import { createSelector } from '@reduxjs/toolkit';
import { IPoolsStore, poolsSliceName } from '../reducers/pools';
import { keySelectors, AnyProps } from './helpers';
import { RootState } from '..';

const store = (s: AnyProps) => s[poolsSliceName] as IPoolsStore;

export const {
  liquidityValue,
  poolLiquidities,
  pools,
  poolKeys,
  tokens,
  poolTicks,
  isLoadingLatestPoolsForTransaction,
  isLoadingAllPool,
  tickMaps,
  nearestPoolTicksForPair,
  isLoadingTicksAndTickMaps,
  isLoadingPoolKeys
} = keySelectors(store, [
  'liquidityValue',
  'poolLiquidities',
  'pools',
  'poolKeys',
  'tokens',
  'poolTicks',
  'isLoadingLatestPoolsForTransaction',
  'isLoadingAllPool',
  'tickMaps',
  'nearestPoolTicksForPair',
  'isLoadingTicksAndTickMaps',
  'isLoadingPoolKeys'
]);

// export const lastPageSelector = createSelector(lastPage, s => s);
export const getListPoolSelector = (state: RootState) => {
  return state.pools.pools;
};

export const poolsArraySortedByFees = createSelector(pools, allPools =>
  Object.values(allPools).sort((a, b) => Number(a.pool_key.fee_tier.fee - b.pool_key.fee_tier.fee))
);

export const hasTokens = createSelector(tokens, allTokens => !!Object.values(allTokens).length);

export const poolsSelectors = {
  liquidityValue,
  poolLiquidities,
  pools,
  poolKeys,
  tokens,
  poolTicks,
  isLoadingLatestPoolsForTransaction,
  tickMaps,
  nearestPoolTicksForPair,
  isLoadingTicksAndTickMaps
};

export default poolsSelectors;
