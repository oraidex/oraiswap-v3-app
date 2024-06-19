import { PUBLIC_RPC_ENDPOINT } from '../../hooks/cosmwasm'
import { useSigningClient } from '../../contexts/cosmwasm'
import Header from '@components/Header/Header'
import { Status, actions as walletActions } from '@store/reducers/wallet'
import { networkType } from '@store/selectors/connection'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import SingletonOraiswapV3 from '@store/services/contractSingleton'
import { FaucetTokenList } from '@store/consts/static'
import { getTokenBalances } from '@store/consts/utils'

export const HeaderWrapper: React.FC = () => {
  const dispatch = useDispatch()
  const currentNetwork = useSelector(networkType)

  const location = useLocation()

  const { walletAddress, signingClient, connectWallet, disconnect } = useSigningClient()

  useEffect(() => {
    ;(async () => {
      if (walletAddress == '') {
        connectWallet()
      }

      if (signingClient && walletAddress) {
        SingletonOraiswapV3.load(signingClient, walletAddress)
        dispatch(walletActions.setStatus(Status.Init))
        dispatch(walletActions.setAddress(walletAddress))
        dispatch(walletActions.setIsBalanceLoading(true))

        const balance = await SingletonOraiswapV3.queryBalance()
        dispatch(walletActions.setBalance(BigInt(balance)))
        dispatch(walletActions.setStatus(Status.Initialized))
        const tokens = Object.values(FaucetTokenList)
        const balances = await getTokenBalances(tokens)

        dispatch(walletActions.addTokenBalances(balances))
        dispatch(walletActions.setIsBalanceLoading(false))
      }

      window.addEventListener('keplr_keystorechange', connectWallet)
      return () => {
        window.removeEventListener('keplr_keystorechange', connectWallet)
      }
    })()
  }, [walletAddress])

  return (
    <Header
      address={walletAddress}
      onNetworkSelect={() => {}}
      onConnectWallet={connectWallet}
      landing={location.pathname.substring(1)}
      walletConnected={walletAddress.length !== 0}
      defaultTestnetRPC=''
      onDisconnectWallet={() => {
        disconnect()
      }}
      onFaucet={() => dispatch(walletActions.airdrop())}
      typeOfNetwork={currentNetwork}
      rpc={PUBLIC_RPC_ENDPOINT}
    />
  )
}

export default HeaderWrapper
