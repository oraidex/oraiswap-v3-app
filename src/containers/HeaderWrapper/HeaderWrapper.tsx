import { PUBLIC_RPC_ENDPOINT } from '../../hooks/cosmwasm'
import { useSigningClient } from '../../contexts/cosmwasm'
import Header from '@components/Header/Header'
import { actions as walletActions } from '@store/reducers/wallet'
import { networkType } from '@store/selectors/connection'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

export const HeaderWrapper: React.FC = () => {
  const dispatch = useDispatch()
  const currentNetwork = useSelector(networkType)

  const location = useLocation()

  const { walletAddress, error, connectWallet } = useSigningClient()

  useEffect(() => {
    // auto connect when open page
    if (walletAddress.length === 0) {
      connectWallet()
    }

    window.addEventListener('keplr_keystorechange', connectWallet)
    return () => {
      window.removeEventListener('keplr_keystorechange', connectWallet)
    }
  }, [])

  return (
    <Header
      address={walletAddress}
      onNetworkSelect={(network, rpcAddress, rpcName) => {}}
      onConnectWallet={connectWallet}
      landing={location.pathname.substring(1)}
      walletConnected={walletAddress.length !== 0}
      // onFaucet={() => {
      //   dispatch(walletActions.airdrop())
      // }}
      onDisconnectWallet={() => {
        dispatch(walletActions.disconnect())
      }}
      onFaucet={() => dispatch(walletActions.airdrop())}
      typeOfNetwork={currentNetwork}
      rpc={PUBLIC_RPC_ENDPOINT}
    />
  )
}

export default HeaderWrapper
