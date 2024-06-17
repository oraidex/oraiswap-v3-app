import {
  FeeTier,
  LiquidityTick,
  Pool,
  PoolKey,
  PoolWithPoolKey,
  Tick
} from '@/sdk/OraiswapV3.types'
import { Tickmap } from '@wasm'

import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { ORAI, TOKEN1, TOKEN2, Token, USDT } from '@store/consts/static'
import { PayloadType } from '@store/consts/types'
import { poolKeyToString } from '@store/consts/utils'

import * as R from 'remeda'

export interface IndexedFeeTier {
  tier: FeeTier
  primaryIndex: number
}

export interface IPoolsStore {
  tokens: Record<string, Token>
  pools: { [key in string]: PoolWithPoolKey }
  poolKeys: { [key in string]: PoolKey }
  poolTicks: { [key in string]: LiquidityTick[] }
  nearestPoolTicksForPair: { [key in string]: Tick[] }
  isLoadingLatestPoolsForTransaction: boolean
  isLoadingTicksAndTickMaps: boolean
  tickMaps: { [key in string]: string }
}

export interface UpdatePool {
  poolKey: PoolKey
  poolStructure: Pool
}

export interface updateTickMaps {
  poolKey: PoolKey
  tickMapStructure: Tickmap
}

export interface UpdateTick {
  poolKey: PoolKey
  tickStructure: LiquidityTick[]
}
export interface DeleteTick {
  address: string
  index: number
}
export interface UpdateTicks extends DeleteTick {
  tick: Tick
}

export interface UpdateTickmap {
  address: string
  bitmap: number[]
}

export interface FetchTicksAndTickMaps {
  tokenFrom: string
  tokenTo: string
  allPools: PoolWithPoolKey[]
}

export const defaultState: IPoolsStore = {
  tokens: {
    [ORAI.address.toString()]: ORAI,
    [USDT.address.toString()]: USDT,
    [TOKEN1.address.toString()]: TOKEN1,
    [TOKEN2.address.toString()]: TOKEN2
    // [TESTNET_BTC_ADDRESS]: BTC,
    // [TESTNET_ETH_ADDRESS]: ETH,
    // [TESTNET_USDC_ADDRESS]: USDC
  },
  pools: {},
  poolKeys: {},
  poolTicks: {},
  nearestPoolTicksForPair: {},
  isLoadingLatestPoolsForTransaction: false,
  isLoadingTicksAndTickMaps: false,
  tickMaps: {}
}

export interface PairTokens {
  first: string
  second: string
}

export enum ListType {
  POSITIONS,
  FARMS
}

export interface ListPoolsRequest {
  poolKeys: PoolKey[]
  listType: ListType
}

export interface ListPoolsResponse {
  data: PoolWithPoolKey[]
  listType: ListType
}

export const poolsSliceName = 'pools'
const poolsSlice = createSlice({
  name: poolsSliceName,
  initialState: defaultState,
  reducers: {
    initPool(state, _action: PayloadAction<PoolKey>) {
      console.log('initPool')
      return state
    },
    addTokens(state, action: PayloadAction<Record<string, Token>>) {
      console.log('addTokens')
      state.tokens = {
        ...state.tokens,
        ...action.payload
      }
      return state
    },
    updateTokenBalances(state, action: PayloadAction<[string, bigint][]>) {
      console.log('updateTokenBalances')
      action.payload.map(pair => {
        state.tokens[pair[0]] = {
          ...state.tokens[pair[0]],
          balance: pair[1]
        }
      })
      return state
    },
    setPoolKeys(state, action: PayloadAction<PoolKey[]>) {
      console.log('setPoolKeys')
      action.payload.map(poolKey => {
        const keyStringified = poolKeyToString(poolKey)
        state.poolKeys[keyStringified] = poolKey
      })
      return state
    },
    getPoolKeys(state) {
      console.log('getPoolKeys')
      return state
    },
    addPool(state, action: PayloadAction<PoolWithPoolKey | undefined>) {
      console.log('addPool')
      if (action.payload) {
        const poolKey = action.payload.pool_key
        const keyStringified = poolKeyToString(poolKey)

        // Check if a pool with the same PoolKey already exists
        if (!state.pools[keyStringified]) {
          // If the pool does not exist, add it to the pools object
          state.pools[keyStringified] = action.payload
        }
      }

      // TODO add new pool, but not repeat existing ones
      state.isLoadingLatestPoolsForTransaction = false
      return state
    },
    getPoolData(state, _action: PayloadAction<PoolKey>) {
      console.log('getPoolData')
      state.isLoadingLatestPoolsForTransaction = true
      return state
    },
    // setPools(state, action: PayloadAction<{ [key in string]: PoolWithAddress }>) {
    //   state.pools = action.payload
    //   return state
    // },
    setTickMaps(state, action: PayloadAction<updateTickMaps>) {
      console.log('setTickMaps')
      state.tickMaps[poolKeyToString(action.payload.poolKey)] = JSON.stringify(
        Array.from(action.payload.tickMapStructure.bitmap.entries()).map(([key, value]) => [
          key.toString(),
          value.toString()
        ])
      )
      return state
    },
    stopIsLoadingTicksAndTickMaps(state) {
      console.log('stopIsLoadingTicksAndTickMaps')
      state.isLoadingTicksAndTickMaps = false
    },
    setTicks(state, action: PayloadAction<UpdateTick>) {
      console.log('setTicks')
      state.poolTicks[poolKeyToString(action.payload.poolKey)] = action.payload.tickStructure
      return state
    },
    // updatePool(state, action: PayloadAction<UpdatePool>) {
    //   state.pools[action.payload.address.toString()] = {
    //     address: state.pools[action.payload.address.toString()].address,
    //     ...action.payload.poolStructure
    //   }
    //   return state
    // },
    addPools(state, action: PayloadAction<PoolWithPoolKey[]>) {
      console.log('addPools')
      const newData = action.payload.reduce(
        (acc, pool) => ({
          ...acc,
          [poolKeyToString(pool.pool_key)]: pool
        }),
        {}
      )
      state.pools = R.merge(state.pools, newData)
      state.isLoadingLatestPoolsForTransaction = false
      return state
    },
    addPoolsForList(state, action: PayloadAction<ListPoolsResponse>) {
      console.log('addPoolsForList')
      const newData = action.payload.data.reduce(
        (acc, pool) => ({
          ...acc,
          [poolKeyToString(pool.pool_key)]: pool
        }),
        {}
      )
      state.pools = R.merge(state.pools, newData)
      return state
    },
    // updateTicks(state, action: PayloadAction<UpdateTicks>) {
    //   state.poolTicks[action.payload.address][
    //     state.poolTicks[action.payload.address].findIndex(e => e.index === action.payload.index)
    //   ] = action.payload.tick
    // },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getAllPoolsForPairData(state, _action: PayloadAction<PairTokens>) {
      console.log('getAllPoolsForPairData')
      state.isLoadingLatestPoolsForTransaction = true
      return state
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getPoolsDataForList(_state, _action: PayloadAction<ListPoolsRequest>) {
      console.log('getPoolsDataForList')
      return _state
    },
    // deleteTick(state, action: PayloadAction<DeleteTick>) {
    //   state.poolTicks[action.payload.address].splice(action.payload.index, 1)
    // },
    // updateTickmap(state, action: PayloadAction<UpdateTickmap>) {
    //   state.tickMaps[action.payload.address].bitmap = action.payload.bitmap
    // },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getTicksAndTickMaps(state, _action: PayloadAction<FetchTicksAndTickMaps>) {
      console.log('getTicksAndTickMaps')
      state.isLoadingTicksAndTickMaps = true
      return state
    }
    // addTicksToArray(state, action: PayloadAction<UpdateTick>) {
    //   const { index, tickStructure } = action.payload
    //   if (!state.poolTicks[index]) {
    //     state.poolTicks[index] = []
    //   }
    //   state.poolTicks[index] = [...state.poolTicks[index], ...tickStructure]
    // },
    // setNearestTicksForPair(state, action: PayloadAction<UpdateTick>) {
    //   state.nearestPoolTicksForPair[action.payload.index] = action.payload.tickStructure
    //   return state
    // },
    // getNearestTicksForPair(_state, _action: PayloadAction<FetchTicksAndTickMaps>) {}
  }
})

export const actions = poolsSlice.actions
export const reducer = poolsSlice.reducer
export type PayloadTypes = PayloadType<typeof actions>
