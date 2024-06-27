import { FaucetTokenList, STABLECOIN_ADDRESSES } from './static';
import {
  TESTNET_BTC_ADDRESS,
  TESTNET_ETH_ADDRESS,
  TESTNET_USDC_ADDRESS
} from '@store/consts/static';
import { PERCENTAGE_SCALE } from './utils';

export const tickerToAddress = (ticker: string): string => {
  return addressTickerMap[ticker] || ticker;
};

export const addressToTicker = (address: string): string => {
  return reversedAddressTickerMap[address] || address;
};

export const addressTickerMap: { [key: string]: string } = FaucetTokenList;

export const reversedAddressTickerMap = Object.fromEntries(
  Object.entries(addressTickerMap).map(([key, value]) => [value, key])
);

export const initialXtoY = (tokenXAddress?: string, tokenYAddress?: string) => {
  if (!tokenXAddress || !tokenYAddress) {
    return true;
  }

  const isTokeXStablecoin = STABLECOIN_ADDRESSES.includes(tokenXAddress);
  const isTokenYStablecoin = STABLECOIN_ADDRESSES.includes(tokenYAddress);

  return isTokeXStablecoin === isTokenYStablecoin || (!isTokeXStablecoin && !isTokenYStablecoin);
};

export const parsePathFeeToFeeString = (pathFee: string): string => {
  return (+pathFee.replace('_', '') * Math.pow(10, Number(PERCENTAGE_SCALE) - 2)).toString();
};
