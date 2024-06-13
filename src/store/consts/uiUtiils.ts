import { STABLECOIN_ADDRESSES } from './static'
import {
  TESTNET_BTC_ADDRESS,
  TESTNET_ETH_ADDRESS,
  TESTNET_USDC_ADDRESS
} from '@store/consts/static'
import { PERCENTAGE_SCALE } from './utils'

export const tickerToAddress = (ticker: string): string => {
  return addressTickerMap[ticker] || ticker
}

export const addressToTicker = (address: string): string => {
  return reversedAddressTickerMap[address] || address
}

export const addressTickerMap: { [key: string]: string } = {
  BTC: TESTNET_BTC_ADDRESS,
  ETH: TESTNET_ETH_ADDRESS,
  USDC: TESTNET_USDC_ADDRESS,
  ORAI: 'orai',
  USDT: 'orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh',
  TOKEN1: 'orai1z3zd5fk60ev5tf8slmr5tjuhp2qmhkvhcf84ajk27un5h0tgz4fql075rt',
  TOKEN2: 'orai154a9fxn9wcyfsxnjkgm4ql4spyvhfu7j5twpzwwx2077ts0uwtps66y70s'
}

export const reversedAddressTickerMap = Object.fromEntries(
  Object.entries(addressTickerMap).map(([key, value]) => [value, key])
)

export const initialXtoY = (tokenXAddress?: string, tokenYAddress?: string) => {
  if (!tokenXAddress || !tokenYAddress) {
    return true
  }

  const isTokeXStablecoin = STABLECOIN_ADDRESSES.includes(tokenXAddress)
  const isTokenYStablecoin = STABLECOIN_ADDRESSES.includes(tokenYAddress)

  return isTokeXStablecoin === isTokenYStablecoin || (!isTokeXStablecoin && !isTokenYStablecoin)
}

export const parsePathFeeToFeeString = (pathFee: string): string => {
  return (+pathFee.replace('_', '') * Math.pow(10, Number(PERCENTAGE_SCALE) - 4)).toString()
}
