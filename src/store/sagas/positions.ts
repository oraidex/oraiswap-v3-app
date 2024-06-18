import { PayloadAction } from '@reduxjs/toolkit'
import {
  approveToken,
  calculateTokenAmountsWithSlippage,
  // calculateTokenAmountsWithSlippage,
  createLiquidityPlot,
  createLoaderKey,
  createPlaceholderLiquidityPlot,
  createPoolTx,
  createPositionTx,
  deserializeTickmap,
  getAllLiquidityTicks,
  getPosition,
  getTick,
  poolKeyToString,
  positionList
} from '@store/consts/utils'
import { FetchTicksAndTickMaps, ListType, actions as poolsActions } from '@store/reducers/pools'
import {
  ClosePositionData,
  GetPositionTicks,
  HandleClaimFee,
  InitPositionData,
  actions
} from '@store/reducers/positions'
import { actions as snackbarsActions } from '@store/reducers/snackbars'
import { poolsArraySortedByFees, tickMaps, tokens } from '@store/selectors/pools'
import { address } from '@store/selectors/wallet'
import SingletonOraiswapV3 from '@store/services/contractSingleton'
import { closeSnackbar } from 'notistack'
import { all, call, fork, join, put, select, spawn, takeEvery, takeLatest } from 'typed-redux-saga'
import { fetchTicksAndTickMaps } from './pools'
import { fetchBalances } from './wallet'
import { PoolKey, newPoolKey, toSqrtPrice } from '@wasm'

function* handleInitPosition(action: PayloadAction<InitPositionData>): Generator {
  const {
    poolKeyData,
    lowerTick,
    upperTick,
    spotSqrtPrice,
    // tokenXAmount,
    // tokenYAmount,
    liquidityDelta,
    initPool,
    slippageTolerance
  } = action.payload

  const { token_x, token_y, fee_tier } = poolKeyData

  // if ( -> call native init position
  //   (tokenX === TESTNET_WAZERO_ADDRESS && tokenXAmount !== 0n) ||
  //   (tokenY === TESTNET_WAZERO_ADDRESS && tokenYAmount !== 0n)
  // ) {
  //   return yield* call(handleInitPositionWithAZERO, action)
  // }

  const loaderCreatePosition = createLoaderKey()
  const loaderSigningTx = createLoaderKey()

  try {
    yield put(
      snackbarsActions.add({
        message: 'Creating position...',
        variant: 'pending',
        persist: true,
        key: loaderCreatePosition
      })
    )

    const txs = []

    // const psp22 = yield* call([psp22Singleton, psp22Singleton.loadInstance], api, network)

    const [xAmountWithSlippage, yAmountWithSlippage] = calculateTokenAmountsWithSlippage(
      fee_tier.tick_spacing,
      spotSqrtPrice,
      liquidityDelta,
      Number(lowerTick),
      Number(upperTick),
      Number(slippageTolerance),
      true
    )

    const XTokenTx = yield* call(approveToken, token_x, xAmountWithSlippage)
    txs.push(XTokenTx)

    const YTokenTx = yield* call(approveToken, token_y, yAmountWithSlippage)
    txs.push(YTokenTx)

    const poolKey = newPoolKey(token_x, token_y, fee_tier)

    if (initPool) {
      const initTick = 0
      const initSqrtPrice = toSqrtPrice(1, 0)
      const createTx = yield* call(createPoolTx, poolKey, initSqrtPrice.toString(), initTick)
      txs.push(createTx)
    }

    const tx = yield* call(
      createPositionTx,
      poolKey,
      lowerTick,
      upperTick,
      liquidityDelta,
      spotSqrtPrice,
      slippageTolerance
    )
    txs.push(tx)

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

    // const txResult = yield* call(sendTx, signedBatchedTx)

    yield* put(actions.setInitPositionSuccess(true))

    closeSnackbar(loaderCreatePosition)
    yield put(snackbarsActions.remove(loaderCreatePosition))

    yield put(
      snackbarsActions.add({
        message: 'Position successfully created',
        variant: 'success',
        persist: false,
        txid: tx
      })
    )

    yield put(actions.getPositionsList())

    yield* call(fetchBalances, [token_x, token_y])

    yield* put(poolsActions.getPoolKeys())
  } catch (e: any) {
    console.log(e)

    yield* put(actions.setInitPositionSuccess(false))

    closeSnackbar(loaderCreatePosition)
    yield put(snackbarsActions.remove(loaderCreatePosition))
    closeSnackbar(loaderSigningTx)
    yield put(snackbarsActions.remove(loaderSigningTx))

    if (e.message) {
      yield put(
        snackbarsActions.add({
          message: e.message,
          variant: 'error',
          persist: false
        })
      )
    } else {
      yield put(
        snackbarsActions.add({
          message: 'Failed to send. Please try again.',
          variant: 'error',
          persist: false
        })
      )
    }
  }
}

export function* handleGetPositionsList() {
  const positions = yield* call(positionList, SingletonOraiswapV3.dex.sender)

  const pools: PoolKey[] = []
  const poolSet: Set<string> = new Set()
  for (let i = 0; i < positions.length; i++) {
    const poolKeyString = poolKeyToString(positions[i].pool_key)

    if (!poolSet.has(poolKeyString)) {
      poolSet.add(poolKeyString)
      pools.push(positions[i].pool_key)
    }
  }
}

export function* handleGetCurrentPositionTicks(action: PayloadAction<GetPositionTicks>) {
  const { poolKey, lowerTickIndex, upperTickIndex } = action.payload
  const [lowerTick, upperTick] = yield* all([
    call(getTick, lowerTickIndex, poolKey),
    call(getTick, upperTickIndex, poolKey)
  ])

  yield put(
    actions.setCurrentPositionTicks({
      lowerTick,
      upperTick
    })
  )
}

export function* handleGetCurrentPlotTicks(
  action: PayloadAction<{ poolKey: PoolKey; isXtoY: boolean }>
): Generator {
  const { poolKey, isXtoY } = action.payload
  // const api = yield* getConnection()
  // const network = yield* select(networkType)
  // const invAddress = yield* select(dexAddress)
  let allTickmaps = yield* select(tickMaps)
  const allTokens = yield* select(tokens)
  const allPools = yield* select(poolsArraySortedByFees)

  const xDecimal = allTokens[poolKey.token_x].decimals
  const yDecimal = allTokens[poolKey.token_y].decimals

  try {
    // const invariant = yield* call(
    //   [invariantSingleton, invariantSingleton.loadInstance],
    //   api,
    //   network,
    //   invAddress
    // )

    if (!allTickmaps[poolKeyToString(poolKey)]) {
      const fetchTicksAndTickMapsAction: PayloadAction<FetchTicksAndTickMaps> = {
        type: poolsActions.getTicksAndTickMaps.type,
        payload: {
          tokenFrom: allTokens[poolKey.token_x].address,
          tokenTo: allTokens[poolKey.token_y].address,
          allPools
        }
      }

      const fetchTask = yield* fork(fetchTicksAndTickMaps, fetchTicksAndTickMapsAction)

      yield* join(fetchTask)
      allTickmaps = yield* select(tickMaps)
    }

    const rawTicks = yield* call(
      getAllLiquidityTicks,
      poolKey,
      deserializeTickmap(allTickmaps[poolKeyToString(poolKey)])
    )
    if (rawTicks.length === 0) {
      const data = createPlaceholderLiquidityPlot(
        action.payload.isXtoY,
        0,
        poolKey.fee_tier.tick_spacing,
        xDecimal,
        yDecimal
      )
      yield* put(actions.setPlotTicks(data))
      return
    }

    const ticksData = createLiquidityPlot(
      rawTicks,
      poolKey.fee_tier.tick_spacing,
      isXtoY,
      xDecimal,
      yDecimal
    )
    yield put(actions.setPlotTicks(ticksData))
  } catch (error) {
    console.log(error)
    const data = createPlaceholderLiquidityPlot(
      action.payload.isXtoY,
      10,
      poolKey.fee_tier.tick_spacing,
      xDecimal,
      yDecimal
    )
    yield* put(actions.setErrorPlotTicks(data))
  }
}

export async function handleClaimFeeSingleton(index?: bigint) {
  const txResult = await SingletonOraiswapV3.dex.claimFee({
    index: Number(index)
  })

  return txResult
}

export function* handleClaimFee(action: PayloadAction<HandleClaimFee>) {
  const { index } = action.payload

  const loaderKey = createLoaderKey()
  const loaderSigningTx = createLoaderKey()
  try {
    yield put(
      snackbarsActions.add({
        message: 'Claiming fee...',
        variant: 'pending',
        persist: true,
        key: loaderKey
      })
    )
    // const txResult =  SingletonOraiswapV3.dex.claimFee({
    //   index: Number(index)
    // })

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

    const txResult = yield* call(handleClaimFeeSingleton, index)

    closeSnackbar(loaderKey)
    yield put(snackbarsActions.remove(loaderKey))
    yield put(
      snackbarsActions.add({
        message: 'Fee successfully claimed',
        variant: 'success',
        persist: false,
        txid: txResult.transactionHash
      })
    )

    yield put(actions.getSinglePosition(index))
  } catch (e) {
    closeSnackbar(loaderSigningTx)
    yield put(snackbarsActions.remove(loaderSigningTx))
    closeSnackbar(loaderKey)
    yield put(snackbarsActions.remove(loaderKey))

    yield put(
      snackbarsActions.add({
        message: 'Failed to claim fee. Please try again.',
        variant: 'error',
        persist: false
      })
    )

    console.log(e)
  }
}

// export function* handleClaimFeeWithAZERO(action: PayloadAction<HandleClaimFee>) {
//   const loaderKey = createLoaderKey()
//   const loaderSigningTx = createLoaderKey()

//   try {
//     yield put(
//       snackbarsActions.add({
//         message: 'Claiming fee...',
//         variant: 'pending',
//         persist: true,
//         key: loaderKey
//       })
//     )

//     // const psp22 = yield* call([psp22Singleton, psp22Singleton.loadInstance], api, network)

//     const txs = []
//     // const claimTx = invariant.claimFeeTx(index, INVARIANT_CLAIM_FEE_OPTIONS)
//     const claimTx = yield* call(SingletonOraiswapV3.dex.claimFee, {
//       index: Number(action.payload.index)
//     })
//     txs.push(claimTx)

//     // const approveTx = psp22.approveTx(
//     //   invAddress,
//     //   U128MAX,

//     //   PSP22_APPROVE_OPTIONS
//     // )
//     // txs.push(approveTx)

//     // const unwrapTx = invariant.withdrawAllWAZEROTx(

//     //   INVARIANT_WITHDRAW_ALL_WAZERO
//     // )
//     // txs.push(unwrapTx)

//     // const resetApproveTx = psp22.approveTx(
//     //   invAddress,
//     //   0n,

//     //   PSP22_APPROVE_OPTIONS
//     // )
//     txs.push(resetApproveTx)

//     const batchedTx = api.tx.utility.batchAll(txs)

//     yield put(
//       snackbarsActions.add({
//         message: 'Signing transaction...',
//         variant: 'pending',
//         persist: true,
//         key: loaderSigningTx
//       })
//     )

//     const signedBatchedTx = yield* call([batchedTx, batchedTx.signAsync], walletAddress, {
//       signer: adapter.signer as Signer
//     })

//     closeSnackbar(loaderSigningTx)
//     yield put(snackbarsActions.remove(loaderSigningTx))

//     const txResult = yield* call(sendTx, signedBatchedTx)

//     closeSnackbar(loaderKey)
//     yield put(snackbarsActions.remove(loaderKey))
//     yield put(
//       snackbarsActions.add({
//         message: 'Fee successfully created',
//         variant: 'success',
//         persist: false,
//         txid: txResult.hash
//       })
//     )

//     yield put(actions.getSinglePosition(index))

//     yield* call(fetchBalances, [addressTokenX, addressTokenY])
//   } catch (e) {
//     closeSnackbar(loaderSigningTx)
//     yield put(snackbarsActions.remove(loaderSigningTx))
//     closeSnackbar(loaderKey)
//     yield put(snackbarsActions.remove(loaderKey))

//     yield put(
//       snackbarsActions.add({
//         message: 'Failed to claim fee. Please try again.',
//         variant: 'error',
//         persist: false
//       })
//     )

//     console.log(e)
//   }
// }

export function* handleGetSinglePosition(action: PayloadAction<bigint>) {
  const walletAddress = yield* select(address)
  const position = yield* call(getPosition, action.payload, walletAddress)
  console.log('position', position)
  yield* put(
    actions.setSinglePosition({
      index: action.payload,
      position
    })
  )
  yield* put(
    actions.getCurrentPositionTicks({
      poolKey: position.pool_key,
      lowerTickIndex: BigInt(position.lower_tick_index),
      upperTickIndex: BigInt(position.upper_tick_index)
    })
  )
  yield* put(
    poolsActions.getPoolsDataForList({
      poolKeys: [position.pool_key],
      listType: ListType.POSITIONS
    })
  )
}

export function* handleClosePosition(action: PayloadAction<ClosePositionData>) {
  const { addressTokenX, addressTokenY, onSuccess, positionIndex } = action.payload

  const loaderKey = createLoaderKey()
  const loaderSigningTx = createLoaderKey()

  try {
    yield put(
      snackbarsActions.add({
        message: 'Removing position...',
        variant: 'pending',
        persist: true,
        key: loaderKey
      })
    )
    const tx = yield SingletonOraiswapV3.dex.removePosition({ index: Number(positionIndex) })

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

    // const txResult = yield* call(sendTx, signedTx)

    closeSnackbar(loaderKey)
    yield put(snackbarsActions.remove(loaderKey))
    yield put(
      snackbarsActions.add({
        message: 'Position successfully removed',
        variant: 'success',
        persist: false,
        txid: tx.transactionHash
      })
    )

    yield* put(actions.getPositionsList())
    onSuccess()

    yield* call(fetchBalances, [addressTokenX, addressTokenY])
  } catch (e) {
    closeSnackbar(loaderSigningTx)
    yield put(snackbarsActions.remove(loaderSigningTx))
    closeSnackbar(loaderKey)
    yield put(snackbarsActions.remove(loaderKey))

    yield put(
      snackbarsActions.add({
        message: 'Failed to close position. Please try again.',
        variant: 'error',
        persist: false
      })
    )

    console.log(e)
  }
}

// export function* handleClosePositionWithAZERO(action: PayloadAction<ClosePositionData>) {
//   const loaderSigningTx = createLoaderKey()
//   const loaderKey = createLoaderKey()

//   try {
//     yield put(
//       snackbarsActions.add({
//         message: 'Removing position...',
//         variant: 'pending',
//         persist: true,
//         key: loaderKey
//       })
//     )

//     const { addressTokenX, addressTokenY, positionIndex, onSuccess } = action.payload

//     const txs = []

//     const removePositionTx = SingletonOraiswapV3.dex.removePosition({
//       index: Number(positionIndex)
//     })
//     txs.push(removePositionTx)

//     // const approveTx = psp22.approveTx(invAddress, U128MAX, TESTNET_WAZERO_ADDRESS)
//     // txs.push(approveTx)

//     // const unwrapTx = invariant.withdrawAllWAZEROTx(TESTNET_WAZERO_ADDRESS)
//     // txs.push(unwrapTx)

//     // const resetApproveTx = psp22.approveTx(invAddress, 0n, TESTNET_WAZERO_ADDRESS)
//     // txs.push(resetApproveTx)

//     yield put(
//       snackbarsActions.add({
//         message: 'Signing transaction...',
//         variant: 'pending',
//         persist: true,
//         key: loaderSigningTx
//       })
//     )

//     closeSnackbar(loaderSigningTx)
//     yield put(snackbarsActions.remove(loaderSigningTx))

//     const txResult = yield* call(sendTx, signedBatchedTx)

//     closeSnackbar(loaderKey)
//     yield put(snackbarsActions.remove(loaderKey))
//     yield put(
//       snackbarsActions.add({
//         message: 'Position successfully removed',
//         variant: 'success',
//         persist: false,
//         txid: txResult.hash
//       })
//     )

//     yield* put(actions.getPositionsList())
//     onSuccess()

//     yield* call(fetchBalances, [addressTokenX, addressTokenY])
//   } catch (e) {
//     closeSnackbar(loaderSigningTx)
//     yield put(snackbarsActions.remove(loaderSigningTx))
//     closeSnackbar(loaderKey)
//     yield put(snackbarsActions.remove(loaderKey))

//     yield put(
//       snackbarsActions.add({
//         message: 'Failed to close position. Please try again.',
//         variant: 'error',
//         persist: false
//       })
//     )

//     console.log(e)
//   }
// }

export function* initPositionHandler(): Generator {
  yield* takeEvery(actions.initPosition, handleInitPosition)
}

export function* getPositionsListHandler(): Generator {
  yield* takeLatest(actions.getPositionsList, handleGetPositionsList)
}

export function* getCurrentPositionTicksHandler(): Generator {
  yield* takeEvery(actions.getCurrentPositionTicks, handleGetCurrentPositionTicks)
}

export function* getCurrentPlotTicksHandler(): Generator {
  yield* takeLatest(actions.getCurrentPlotTicks, handleGetCurrentPlotTicks)
}
export function* claimFeeHandler(): Generator {
  yield* takeEvery(actions.claimFee, handleClaimFee)
}

export function* getSinglePositionHandler(): Generator {
  yield* takeEvery(actions.getSinglePosition, handleGetSinglePosition)
}

export function* closePositionHandler(): Generator {
  yield* takeEvery(actions.closePosition, handleClosePosition)
}

export function* positionsSaga(): Generator {
  yield all(
    [
      initPositionHandler,
      getPositionsListHandler,
      getCurrentPositionTicksHandler,
      getCurrentPlotTicksHandler,
      claimFeeHandler,
      getSinglePositionHandler,
      closePositionHandler
    ].map(spawn)
  )
}
