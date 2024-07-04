import { PoolWithPoolKey } from '@/sdk/OraiswapV3.types';
import { FeeTier, LiquidityTick, Pool, PoolKey, Tick, Tickmap } from '@wasm';

import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ORAIX, OCH, ORAI, USDC, USDT, Token } from '@store/consts/static';
import { PayloadType } from '@store/consts/types';
import { poolKeyToString } from '@store/consts/utils';

import * as R from 'remeda';

export interface IndexedFeeTier {
  tier: FeeTier;
  primaryIndex: number;
}

export interface IPoolsStore {
  liquidityValue: string;
  poolLiquidities: Record<string, number>;
  tokens: Record<string, Token>;
  pools: { [key in string]: PoolWithPoolKey };
  poolKeys: { [key in string]: PoolKey };
  poolTicks: { [key in string]: LiquidityTick[] };
  nearestPoolTicksForPair: { [key in string]: Tick[] };
  isLoadingLatestPoolsForTransaction: boolean;
  isLoadingAllPool: boolean;
  lastPage: number;
  isLoadingTicksAndTickMaps: boolean;
  isLoadingPoolKeys: boolean;
  tickMaps: { [key in string]: string };
  isLoadingPoolLiquidities: boolean;
}

export interface UpdatePool {
  poolKey: PoolKey;
  poolStructure: Pool;
}

export interface updateTickMaps {
  poolKey: PoolKey;
  tickMapStructure: Tickmap;
}

export interface UpdateTick {
  poolKey: PoolKey;
  tickStructure: LiquidityTick[];
}
export interface DeleteTick {
  address: string;
  index: number;
}
export interface UpdateTicks extends DeleteTick {
  tick: Tick;
}

export interface UpdateTickmap {
  address: string;
  bitmap: number[];
}

export interface FetchTicksAndTickMaps {
  tokenFrom: string;
  tokenTo: string;
  allPools: PoolWithPoolKey[];
}

export const defaultState: IPoolsStore = {
  liquidityValue: '0',
  poolLiquidities: {},
  tokens: {
    [ORAI.address.toString()]: ORAI,
    [USDT.address.toString()]: USDT,
    [USDC.address.toString()]: USDC,
    [OCH.address.toString()]: OCH,
    [ORAIX.address.toString()]: ORAIX
  },
  pools: {},
  poolKeys: {},
  poolTicks: {},
  nearestPoolTicksForPair: {},
  isLoadingLatestPoolsForTransaction: false,
  isLoadingAllPool: false,
  lastPage: 1,
  isLoadingTicksAndTickMaps: false,
  isLoadingPoolKeys: false,
  tickMaps: {},
  isLoadingPoolLiquidities: false
};

export interface PairTokens {
  first: string;
  second: string;
}

export enum ListType {
  POSITIONS,
  FARMS
}

export interface ListPoolsRequest {
  poolKeys: PoolKey[];
  listType: ListType;
}

export interface ListPoolsResponse {
  data: PoolWithPoolKey[];
  listType: ListType;
}

export const poolsSliceName = 'pools';
const poolsSlice = createSlice({
  name: poolsSliceName,
  initialState: defaultState,
  reducers: {
    initPool(state, _action: PayloadAction<PoolKey>) {
      return state;
    },
    setLastPoolPage(state, action: PayloadAction<number>) {
      state.lastPage = action.payload;
      return state;
    },
    addTokens(state, action: PayloadAction<Record<string, Token>>) {
      state.tokens = {
        ...state.tokens,
        ...action.payload
      };
      return state;
    },
    updateTokenBalances(state, action: PayloadAction<{ address: string; balance: bigint }[]>) {
      action.payload.map(pair => {
        state.tokens[pair.address] = {
          ...state.tokens[pair.address],
          balance: pair.balance
        };
      });
      return state;
    },
    setPoolKeys(state, action: PayloadAction<PoolKey[]>) {
      state.isLoadingPoolKeys = false;
      action.payload.map(poolKey => {
        const keyStringified = poolKeyToString(poolKey);
        state.poolKeys[keyStringified] = poolKey;
      });
      return state;
    },
    getPoolKeys(state) {
      state.isLoadingPoolKeys = true;
      return state;
    },
    addPool(state, action: PayloadAction<PoolWithPoolKey | undefined>) {
      if (action.payload) {
        const poolKey = action.payload.pool_key;
        const keyStringified = poolKeyToString(poolKey);

        // Check if a pool with the same PoolKey already exists
        if (!state.pools[keyStringified]) {
          // If the pool does not exist, add it to the pools object
          state.pools[keyStringified] = action.payload;
        }
      }

      // TODO add new pool, but not repeat existing ones
      state.isLoadingLatestPoolsForTransaction = false;
      return state;
    },
    getPoolData(state, _action: PayloadAction<PoolKey>) {
      state.isLoadingLatestPoolsForTransaction = true;
      return state;
    },
    getAllPoolData(state) {
      state.isLoadingAllPool = true;
      return state;
    },
    setAllPools(state, action: PayloadAction<PoolWithPoolKey[]>) {
      const newData = action.payload.reduce(
        (acc, pool) => ({
          ...acc,
          [poolKeyToString(pool.pool_key)]: pool
        }),
        {}
      );
      state.pools = R.merge(state.pools, newData);
      state.isLoadingAllPool = false;
      return state;
    },
    setTickMaps(state, action: PayloadAction<updateTickMaps>) {
      state.tickMaps[poolKeyToString(action.payload.poolKey)] = JSON.stringify(
        Array.from(action.payload.tickMapStructure.bitmap.entries()).map(([key, value]) => [
          key.toString(),
          value.toString()
        ])
      );
      return state;
    },
    stopIsLoadingTicksAndTickMaps(state) {
      state.isLoadingTicksAndTickMaps = false;
    },
    setTicks(state, action: PayloadAction<UpdateTick>) {
      state.poolTicks[poolKeyToString(action.payload.poolKey)] = action.payload.tickStructure;
      return state;
    },
    // updatePool(state, action: PayloadAction<UpdatePool>) {
    //   state.pools[action.payload.address.toString()] = {
    //     address: state.pools[action.payload.address.toString()].address,
    //     ...action.payload.poolStructure
    //   }
    //   return state
    // },
    addPools(state, action: PayloadAction<PoolWithPoolKey[]>) {
      const newData = action.payload.reduce(
        (acc, pool) => ({
          ...acc,
          [poolKeyToString(pool.pool_key)]: pool
        }),
        {}
      );
      state.pools = R.merge(state.pools, newData);
      state.isLoadingLatestPoolsForTransaction = false;
      return state;
    },
    addPoolsForList(state, action: PayloadAction<ListPoolsResponse>) {
      const newData = action.payload.data.reduce(
        (acc, pool) => ({
          ...acc,
          [poolKeyToString(pool.pool_key)]: pool
        }),
        {}
      );
      state.pools = R.merge(state.pools, newData);
      return state;
    },
    getAllPoolsForPairData(state, _action: PayloadAction<PairTokens>) {
      state.isLoadingLatestPoolsForTransaction = true;
      return state;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getPoolsDataForList(_state, _action: PayloadAction<ListPoolsRequest>) {},
    getTicksAndTickMaps(state, _action: PayloadAction<FetchTicksAndTickMaps>) {
      state.isLoadingTicksAndTickMaps = true;
      return state;
    },
    setLiquidityValue(state, action: PayloadAction<string>) {
      state.liquidityValue = action.payload;
      return state;
    },
    setPoolLiquidities(state, action: PayloadAction<Record<string, number>>) {
      state.poolLiquidities = action.payload;
      return state;
    },
    setIsLoadingPoolLiquidities(state, action: PayloadAction<boolean>) {
      state.isLoadingPoolLiquidities = action.payload;
      return state;
    }
  }
});

export const actions = poolsSlice.actions;
export const reducer = poolsSlice.reducer;
export type PayloadTypes = PayloadType<typeof actions>;
