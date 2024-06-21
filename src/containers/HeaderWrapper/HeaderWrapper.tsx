import { useSigningClient } from '../../contexts/cosmwasm';
import Header from '@components/Header/Header';
import { Status, actions as walletActions } from '@store/reducers/wallet';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import SingletonOraiswapV3 from '@store/services/contractSingleton';
import { FaucetTokenList } from '@store/consts/static';
import { getTokenBalances } from '@store/consts/utils';

export const HeaderWrapper: React.FC = () => {
  const dispatch = useDispatch();

  const location = useLocation();

  const { walletAddress, signingClient, connectWallet } = useSigningClient();

  // window.parent?.addEventListener &&
  //   window.parent?.addEventListener('connectWallet', event => console.log({ event }));

  // window.addEventListener('message', function (event) {
  //   console.log('event', event);
  //   if (event.origin !== 'http://localhost:3000') return;

  //   console.log('first', event.data);
  // });

  useEffect(() => {
    (async () => {
      if (!window.walletType) return;
      if (walletAddress == '') connectWallet();

      if (signingClient && walletAddress) {
        SingletonOraiswapV3.load(signingClient, walletAddress);
        dispatch(walletActions.setStatus(Status.Init));
        dispatch(walletActions.setAddress(walletAddress));
        dispatch(walletActions.setIsBalanceLoading(true));

        const balance = await SingletonOraiswapV3.queryBalance(walletAddress);
        dispatch(walletActions.setBalance(BigInt(balance)));
        dispatch(walletActions.setStatus(Status.Initialized));
        const tokens = Object.values(FaucetTokenList);
        const balances = await getTokenBalances(tokens, walletAddress);

        dispatch(walletActions.addTokenBalances(balances));
        dispatch(walletActions.setIsBalanceLoading(false));
      }
    })();
  }, [walletAddress]);

  useEffect(() => {
    window.addEventListener('keplr_keystorechange', connectWallet);
    return () => {
      window.removeEventListener('keplr_keystorechange', connectWallet);
    };
  }, []);

  return (
    <>
      <Header landing={location.pathname.substring(1)} />
      <span>{walletAddress}</span>
    </>
  );
};

export default HeaderWrapper;
