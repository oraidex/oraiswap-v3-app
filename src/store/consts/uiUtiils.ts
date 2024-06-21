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
  USDT: 'orai13r0p78qtakcxu7yckfs7vr2mswe5qghv6t6t57ff4drqeqw44v5q9zrhq0',
  USDC: 'orai176zyt4mmwtncuuc63ahsfu5v8xymcuxxa8w258yrtrad7l4wqktsajtdg0',
  BTC: 'orai1tgcfr9hffjcjdpgc2354k4ut2s0fufmpva2aapsdswccp3ka442spg9efy',
  OCH: 'orai184daw0zxx4vjkjhcgc2e9q787x67qlgfk0ehg6ea6wrl6grlrztsjuydnc',
  // DEFI3: 'orai1rsx2fr97wnunevl7n09tzlvrau5u5875jq36mjx04e53mdyxnrwq9n90kh',
  // DEFI4: 'orai1gfru0p5n0w4hl0sc7gj8dsaud7zerv8wdu9e4jdh77ghydhahv2q0ecxj7',
  // DEFI5: 'orai1etr7495tul34lvrjk4zxzlnpltf5383sp497prm97pwjmwzhs73sc2umfp',
  // DEFI6: 'orai1a7fdtl4vpylkt4l2vyweaadl687g9s9jjxzz5panlx075kq96k8sfpwjhz',
  ORAI: 'orai'
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
