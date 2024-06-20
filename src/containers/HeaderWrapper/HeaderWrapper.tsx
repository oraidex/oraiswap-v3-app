import NavbarButton from '@components/Navbar/Button';
import { Grid } from '@mui/material';
import { FaucetTokenList } from '@store/consts/static';
import { getTokenBalances } from '@store/consts/utils';
import { Status, actions as walletActions } from '@store/reducers/wallet';
import SingletonOraiswapV3 from '@store/services/contractSingleton';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { useSigningClient } from '../../contexts/cosmwasm';
import useStyles from './style';
import Header from '@components/Header/Header';
import { PUBLIC_RPC_ENDPOINT } from '../../hooks/cosmwasm';
import { networkType } from '@store/selectors/connection';

export const HeaderWrapper: React.FC = () => {
  const dispatch = useDispatch();
  const currentNetwork = useSelector(networkType);

  const location = useLocation();

  const { walletAddress, signingClient, connectWallet, disconnect } = useSigningClient();

  window.parent.document.addEventListener('connectWallet', event => console.log({ event }));

  useEffect(() => {
    (async () => {
      console.log('walletAddress: ', walletAddress);
      console.log('storage: ', window?.parent);

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

      // window.addEventListener('keplr_keystorechange', connectWallet);
      // return () => {
      //   window.removeEventListener('keplr_keystorechange', connectWallet);
      // };
    })();
  }, [walletAddress]);

  const { classes } = useStyles();
  // const buttonStyles = useButtonStyles()
  // const isXsDown = useMediaQuery(theme.breakpoints.down('sm'))

  const routes = ['pool', 'swap'];

  const otherRoutesToHighlight: Record<string, RegExp[]> = {
    pool: [/^newPosition\/*/, /^position\/*/]
  };

  const [activePath, setActive] = useState('swap');

  useEffect(() => {
    // if there will be no redirects, get rid of this
    setActive(location.pathname.substring(1));
  }, [location.pathname.substring(1)]);

  return (
    // <Header
    //   address={walletAddress}
    //   onNetworkSelect={() => {}}
    //   onConnectWallet={connectWallet}
    //   landing={location.pathname.substring(1)}
    //   walletConnected={walletAddress.length !== 0}
    //   defaultTestnetRPC=''
    //   onDisconnectWallet={() => {
    //     disconnect();
    //   }}
    //   onFaucet={() => dispatch(walletActions.airdrop())}
    //   typeOfNetwork={currentNetwork}
    //   rpc={PUBLIC_RPC_ENDPOINT}
    // />

    <Grid container item className={classes.routers} wrap='nowrap'>
      {routes.map(path => (
        <Link key={`path-${path}`} to={`/${path}`} className={classes.link}>
          <NavbarButton
            name={path}
            onClick={() => {
              setActive(path);
            }}
            active={
              path === activePath ||
              (!!otherRoutesToHighlight[path] &&
                otherRoutesToHighlight[path].some(pathRegex => pathRegex.test(activePath)))
            }
          />
        </Link>
      ))}

      <span>{walletAddress}</span>
    </Grid>
  );
};

export default HeaderWrapper;
