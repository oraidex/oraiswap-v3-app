import { PoolKey } from '@/sdk/OraiswapV3.types'
import { new_pool_key, toSqrtPrice } from '@wasm'
import { PayloadAction } from '@reduxjs/toolkit'
import {
  createLoaderKey,
  createPoolTx,
  findPairs,
  findPairsByPoolKeys,
  getAllLiquidityTicks,
  getFullTickmap,
  getPool,
  getPoolKeys,
  getPools,
  getPoolsByPoolKeys,
  getTokenBalances,
  getTokenDataByAddresses
} from '@store/consts/utils'
import {
  FetchTicksAndTickMaps,
  ListPoolsRequest,
  ListType,
  PairTokens,
  actions
} from '@store/reducers/pools'
import { actions as snackbarsActions } from '@store/reducers/snackbars'
import { tokens } from '@store/selectors/pools'
import { closeSnackbar } from 'notistack'
import { all, call, put, select, spawn, takeEvery, takeLatest } from 'typed-redux-saga'

export function* fetchPoolsDataForList(action: PayloadAction<ListPoolsRequest>) {
  console.log('fetchPoolsDataForList', action.payload)
  const pools = yield* call(getPoolsByPoolKeys, action.payload.poolKeys)

  console.log('pools', pools)

  const allTokens = yield* select(tokens)
  const unknownTokens = new Set(
    action.payload.poolKeys.flatMap(({ token_x, token_y }) =>
      [token_x, token_y].filter(token => !allTokens[token])
    )
  )
  const knownTokens = new Set(
    action.payload.poolKeys.flatMap(({ token_x, token_y }) =>
      [token_x, token_y].filter(token => allTokens[token])
    )
  )

  const unknownTokensData = yield* call(getTokenDataByAddresses, [...unknownTokens])

  const knownTokenBalances = yield* call(getTokenBalances, [...knownTokens])

  yield* put(actions.addTokens(unknownTokensData))
  yield* put(actions.updateTokenBalances(knownTokenBalances))

  console.log(yield* select(tokens))

  yield* put(actions.addPoolsForList({ data: pools, listType: action.payload.listType }))
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

    const poolKey = new_pool_key(token_x, token_y, fee_tier)

    const initTick = 0

    const initSqrtPrice = toSqrtPrice(1n, 0n)

    const tx = yield* call(createPoolTx, poolKey, initSqrtPrice.toString(), initTick)

    // yield put(
    //   snackbarsActions.add({
    //     message: 'Signing transaction...',
    //     variant: 'pending',
    //     persist: true,
    //     key: loaderSigningTx
    //   })
    // )

    // const signedTx = yield* call([tx, tx.signAsync], walletAddress, {
    //   signer: adapter.signer as Signer
    // })

    // closeSnackbar(loaderSigningTx)
    // yield put(snackbarsActions.remove(loaderSigningTx))

    // const txResult = yield* call(sendTx, signedTx)

    yield put(
      snackbarsActions.add({
        message: 'Pool successfully created',
        variant: 'success',
        persist: false,
        txid: tx
      })
    )

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

export function* fetchPoolData(action: PayloadAction<PoolKey>): Generator {
  const { fee_tier, token_x, token_y } = action.payload

  console.log('fetching pool data', fee_tier, token_x, token_y)

  try {
    const pool = yield* call(getPool, { fee_tier, token_x, token_y })

    if (pool) {
      yield* put(actions.addPool(pool))
    } else {
      yield* put(actions.addPool())
    }
  } catch (error) {
    console.log(error)
    yield* put(actions.addPool())
  }
}

export function* fetchAllPoolKeys(): Generator {
  try {
    console.log('fetching pool keys')
    //TODO: in the future handle more than 100 pools
    const pools = yield* call(getPoolKeys)
    const actionPayload = {
      payload: {
        poolKeys: pools,
        listType: ListType.POSITIONS
      }
    }
    yield call(fetchPoolsDataForList, actionPayload as PayloadAction<ListPoolsRequest>)

    yield* put(actions.setPoolKeys(pools))
  } catch (error) {
    yield* put(actions.setPoolKeys([]))
    console.log(error)
  }
}

export function* fetchAllPoolsForPairData(action: PayloadAction<PairTokens>) {
  const poolKeys = yield* call(getPoolKeys)
  const filteredPoolKeys = findPairsByPoolKeys(
    action.payload.first.toString(),
    action.payload.second.toString(),
    poolKeys
  )
  const pools = yield* call(getPools, filteredPoolKeys)

  yield* put(actions.addPools(pools))
}

export function* fetchTicksAndTickMaps(action: PayloadAction<FetchTicksAndTickMaps>) {
  const { tokenFrom, tokenTo, allPools } = action.payload

  console.log('fetchTicksAndTickMaps', tokenFrom, tokenTo)

  try {
    const pools = findPairs(tokenFrom.toString(), tokenTo.toString(), allPools)

    console.log('pools to fetch tick and tickmap', pools)

    const tickmapCalls = pools.map(pool => call(getFullTickmap, pool.pool_key))

    const allTickMaps = yield* all(tickmapCalls)

    for (const [index, pool] of pools.entries()) {
      yield* put(
        actions.setTickMaps({
          poolKey: pool.pool_key,
          tickMapStructure: allTickMaps[index]
        })
      )
    }

    const allTicksCalls = pools.map((pool, index) =>
      call(getAllLiquidityTicks, pool.pool_key, allTickMaps[index])
    )
    const allTicks = yield* all(allTicksCalls)

    for (const [index, pool] of pools.entries()) {
      yield* put(actions.setTicks({ poolKey: pool.pool_key, tickStructure: allTicks[index] }))
    }

    yield* put(actions.stopIsLoadingTicksAndTickMaps())
  } catch (error) {
    console.log(error)
  }
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
  yield* takeLatest(actions.getPoolKeys, fetchAllPoolKeys)
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
