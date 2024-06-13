import { PUBLIC_RPC_ENDPOINT } from '../../hooks/cosmwasm'
import { useSigningClient } from '../../contexts/cosmwasm'
import Header from '@components/Header/Header'
import { Status, actions as walletActions } from '@store/reducers/wallet'
import { networkType } from '@store/selectors/connection'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import SingletonOraiswapV3 from '@store/services/contractSingleton'
import { address } from '@store/selectors/wallet'
import { FaucetTokenList } from '@store/consts/static'
import { getTokenBalances } from '@store/consts/utils'

export const HeaderWrapper: React.FC = () => {
  const dispatch = useDispatch()
  const currentNetwork = useSelector(networkType)
  const wallet = useSelector(address)

  const location = useLocation()

  const { walletAddress, signingClient, connectWallet, disconnect } = useSigningClient()

  useEffect(() => {
    ;(async () => {
      console.log('wallet', { walletAddress })
      if (walletAddress == '') {
        connectWallet()
      }

      if (signingClient && walletAddress) {
        SingletonOraiswapV3.load(signingClient, walletAddress)
        dispatch(walletActions.setStatus(Status.Init))
        dispatch(walletActions.setAddress(walletAddress))
        dispatch(walletActions.setIsBalanceLoading(true))

        const balance = await SingletonOraiswapV3.queryBalance()
        dispatch(walletActions.setBalance(BigInt(balance.toString()) as any))
        dispatch(walletActions.setStatus(Status.Initialized))
        const tokens = Object.values(FaucetTokenList)
        const balances = await getTokenBalances(tokens)

        const convertedBalances = balances.map((balance, index) => ({
          address: balance[0],
          balance: balance[1]
        }))

        dispatch(walletActions.addTokenBalances(convertedBalances))
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
      onNetworkSelect={(network, rpcAddress, rpcName) => {}}
      onConnectWallet={connectWallet}
      landing={location.pathname.substring(1)}
      walletConnected={walletAddress.length !== 0}
      // onFaucet={() => {
      //   dispatch(walletActions.airdrop())
      // }}
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
