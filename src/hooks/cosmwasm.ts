import { useState } from 'react';
import { connectKeplr } from '../services/keplr';
import { Tendermint37Client, Tendermint34Client } from '@cosmjs/tendermint-rpc';
import { CosmWasmClient, SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { GasPrice } from '@cosmjs/stargate';
import { useDispatch } from 'react-redux';
import { actions as walletActions, Status } from '@store/reducers/wallet';
import { actions as poolActions } from '@store/reducers/pools';
import { actions as positionActions } from '@store/reducers/positions';
import SingletonOraiswapV3 from '@store/services/contractSingleton';

const getStatus = Tendermint34Client.prototype.status;

CosmWasmClient.prototype.getHeight = async function () {
  const status = await getStatus.call(this.tmClient);
  return status.syncInfo.latestBlockHeight;
};

// @ts-ignore
Tendermint34Client.detectVersion = Tendermint37Client.detectVersion = () => {};
// @ts-ignore
Tendermint34Client.prototype.status = Tendermint37Client.prototype.status = () => {
  return {
    nodeInfo: {
      network: PUBLIC_CHAIN_ID,
      version: ''
    }
  };
};

export interface ISigningCosmWasmClientContext {
  walletAddress: string;
  signingClient: SigningCosmWasmClient | null;
  loading: boolean;
  error: any;
  connectWallet: any;
  disconnect: any;
}

export const PUBLIC_RPC_ENDPOINT = import.meta.env.VITE_CHAIN_RPC_ENDPOINT || '';
export const PUBLIC_CHAIN_ID = import.meta.env.VITE_CHAIN_ID;

export const MULTISIG_CODE_ID = parseInt(import.meta.env.VITE_MULTISIG_CODE_ID as string);

export const GAS_PRICE = GasPrice.fromString(
  (import.meta.env.VITE_GAS_PRICE || '0.001') + import.meta.env.VITE_STAKING_DENOM
);

export const POLL_INTERVAL = parseInt(import.meta.env.VITE_POLL_INTERVAL || '3000');

export const useSigningCosmWasmClient = (): ISigningCosmWasmClientContext => {
  const [walletAddress, setWalletAddress] = useState('');
  const [signingClient, setSigningClient] = useState<SigningCosmWasmClient | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  window.onmessage = function (e) {
    if (e.data.statusWallet) {
      if (e.data.statusWallet === 'connect') {
        window.walletType = e.data.walletType;
        window.Keplr =
          (e.data.walletType === 'keplr' ? window?.keplr : window?.owallet) ?? window?.keplr;
        connectWallet();
      }
      if (e.data.statusWallet === 'disconnect') {
        window.walletType = e.data.walletType;
        window.Keplr = undefined;
        disconnect();
      }
    }
  };

  const connectWallet = async () => {
    setLoading(true);
    try {
      if (window.walletType) {
        await connectKeplr();
        // enable website to access kepler
        await window.Keplr.enable(PUBLIC_CHAIN_ID);

        // get offline signer for signing txs
        const offlineSigner = window.Keplr.getOfflineSigner(PUBLIC_CHAIN_ID);

        // make client
        const client = await SigningCosmWasmClient.connectWithSigner(
          PUBLIC_RPC_ENDPOINT,
          offlineSigner,
          {
            gasPrice: GAS_PRICE,
            broadcastPollIntervalMs: POLL_INTERVAL
          }
        );
        setSigningClient(client);

        // get user address
        const [{ address }] = await offlineSigner.getAccounts();
        setWalletAddress(address);
        dispatch(walletActions.setAddress(address));

        dispatch(walletActions.setStatus(Status.Initialized));
        dispatch(poolActions.getPoolKeys());
        dispatch(positionActions.getPositionsList());
      }
    } catch (error) {
      // make fallback client
      const client = await SigningCosmWasmClient.connectWithSigner(PUBLIC_RPC_ENDPOINT, null);
      setSigningClient(client);
      setError(error);
    }
    setLoading(false);
  };

  const disconnect = () => {
    if (signingClient) {
      signingClient.disconnect();
    }
    dispatch(walletActions.setStatus(Status.Uninitialized));
    setWalletAddress('');
    setSigningClient(null);
    setLoading(false);
  };

  return {
    walletAddress,
    signingClient,
    loading,
    error,
    connectWallet,
    disconnect
  };
};
