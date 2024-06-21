import Header from '@components/Header/Header';
import { FaucetTokenList } from '@store/consts/static';
import { getTokenBalances } from '@store/consts/utils';
import { Status, actions as walletActions } from '@store/reducers/wallet';
import SingletonOraiswapV3 from '@store/services/contractSingleton';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useSigningClient } from '../../contexts/cosmwasm';

export const HeaderWrapper: React.FC = () => {
  const dispatch = useDispatch();

  const location = useLocation();

  const { walletAddress, signingClient, connectWallet } = useSigningClient();

  useEffect(() => {
    (async () => {
      if (walletAddress == '') {
        connectWallet();
      }

      if (signingClient && walletAddress) {
        SingletonOraiswapV3.load(signingClient, walletAddress);
        dispatch(walletActions.setStatus(Status.Init));
        dispatch(walletActions.setAddress(walletAddress));
        dispatch(walletActions.setIsBalanceLoading(true));

        const balance = await SingletonOraiswapV3.queryBalance();
        dispatch(walletActions.setBalance(BigInt(balance)));
        dispatch(walletActions.setStatus(Status.Initialized));
        const tokens = Object.values(FaucetTokenList);
        const balances = await getTokenBalances(tokens);

        dispatch(walletActions.addTokenBalances(balances));
        dispatch(walletActions.setIsBalanceLoading(false));
      }

      window.addEventListener('keplr_keystorechange', connectWallet);
      return () => {
        window.removeEventListener('keplr_keystorechange', connectWallet);
      };
    })();
  }, [walletAddress]);

  return <Header landing={location.pathname.substring(1)} />;
};

export default HeaderWrapper;
