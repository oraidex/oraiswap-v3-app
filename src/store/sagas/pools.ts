import { PoolKey, PoolWithPoolKey } from '@/sdk/OraiswapV3.types'
import { toSqrtPrice } from '@/wasm/oraiswap_v3_wasm'
import { Signer } from '@polkadot/api/types'
import { PayloadAction } from '@reduxjs/toolkit'
import {
  createLoaderKey,
  findPairs,
  findPairsByPoolKeys,
  getPools,
  getPoolsByPoolKeys
} from '@store/consts/utils'
import { FetchTicksAndTickMaps, ListPoolsRequest, PairTokens, actions } from '@store/reducers/pools'
import { actions as snackbarsActions } from '@store/reducers/snackbars'
import { invariantAddress, networkType } from '@store/selectors/connection'
import { pools, tokens } from '@store/selectors/pools'
import { address } from '@store/selectors/wallet'
import SingletonOraiswapV3 from '@store/services/contractSingleton'
import { closeSnackbar } from 'notistack'
import { all, call, put, select, spawn, takeEvery, takeLatest } from 'typed-redux-saga'

export async function fetchPoolsDataForList(action: PayloadAction<ListPoolsRequest>) {
  const pools = await getPoolsByPoolKeys(action.payload.poolKeys)
}

export function* handleInitPool(action: PayloadAction<PoolKey>): Generator {
  const loaderKey = createLoaderKey()
  const loaderSigningTx = createLoaderKey()
  try {
    yield put(
      snackbarsActions.add({
        message: 'Creating new pool...',
        variant: 'pending',
        persist: true,
        key: loaderKey
      })
    )

    const { token_x, token_y, fee_tier } = action.payload

    const network = yield* select(networkType)
    const walletAddress = yield* select(address)

    const poolKey: PoolKey = { token_x, token_y, fee_tier }

    const initSqrtPrice = toSqrtPrice(1n, 0n)

    yield put(
      snackbarsActions.add({
        message: 'Signing transaction...',
        variant: 'pending',
        persist: true,
        key: loaderSigningTx
      })
    )

    closeSnackbar(loaderSigningTx)
    yield put(snackbarsActions.remove(loaderSigningTx))

    closeSnackbar(loaderKey)
    yield put(snackbarsActions.remove(loaderKey))
  } catch (error) {
    console.log(error)
    closeSnackbar(loaderKey)
    yield put(snackbarsActions.remove(loaderKey))
    closeSnackbar(loaderSigningTx)
    yield put(snackbarsActions.remove(loaderSigningTx))
  }
}

export async function fetchPoolData(action: PayloadAction<PoolKey>) {
  const { fee_tier, token_x, token_y } = action.payload

  try {
    const pool = await SingletonOraiswapV3.dex.pool({
      feeTier: fee_tier,
      token0: token_x,
      token1: token_y
    })
    return pool
  } catch (error) {
    console.log(error)
  }
}

export async function fetchAllPools(): Promise<PoolWithPoolKey[]> {
  //TODO: in the future handle more than 100 pools
  const pools = await SingletonOraiswapV3.dex.pools({})
  return pools
}

export async function fetchAllPoolsForPairData(action: PayloadAction<PairTokens>) {
  const pools = await SingletonOraiswapV3.dex.poolsForPair({
    token0: action.payload.first.toString(),
    token1: action.payload.second.toString()
  })
  return pools
}

export async function fetchTicksAndTickMaps(action: PayloadAction<FetchTicksAndTickMaps>) {
  const { tokenFrom, tokenTo, allPools } = action.payload

  const pools = findPairs(tokenFrom.toString(), tokenTo.toString(), allPools)

  const allTickMaps = await Promise.all(
    pools.map(pool => SingletonOraiswapV3.getFullTickmap(pool.pool_key))
  )

  const allTicks = await Promise.all(
    pools.map((pool, index) =>
      SingletonOraiswapV3.getAllLiquidityTicks(pool.pool_key, allTickMaps[index])
    )
  )
  return allTicks
}

export function* getPoolsDataForListHandler(): Generator {
  yield* takeEvery(actions.getPoolsDataForList, fetchPoolsDataForList)
}

export function* initPoolHandler(): Generator {
  yield* takeLatest(actions.initPool, handleInitPool)
}

export function* getPoolDataHandler(): Generator {
  yield* takeLatest(actions.getPoolData, fetchPoolData)
}

export function* getPoolKeysHandler(): Generator {
  yield* takeLatest(actions.getPoolKeys, fetchAllPools)
}

export function* getAllPoolsForPairDataHandler(): Generator {
  yield* takeLatest(actions.getAllPoolsForPairData, fetchAllPoolsForPairData)
}

export function* getTicksAndTickMapsHandler(): Generator {
  yield* takeEvery(actions.getTicksAndTickMaps, fetchTicksAndTickMaps)
}

export function* poolsSaga(): Generator {
  yield all(
    [
      initPoolHandler,
      getPoolDataHandler,
      getPoolKeysHandler,
      getPoolsDataForListHandler,
      getAllPoolsForPairDataHandler,
      getTicksAndTickMapsHandler
    ].map(spawn)
  )
}
