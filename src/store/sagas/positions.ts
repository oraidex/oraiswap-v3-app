import { PayloadAction } from '@reduxjs/toolkit';
import {
  approveToken,
  calculateTokenAmountsWithSlippage,
  claimFee,
  // calculateTokenAmountsWithSlippage,
  createLiquidityPlot,
  createLoaderKey,
  createPlaceholderLiquidityPlot,
  createPoolTx,
  createPositionTx,
  createPositionWithNativeTx,
  deserializeTickmap,
  getAllLiquidityTicks,
  getPosition,
  getTick,
  isNativeToken,
  poolKeyToString,
  positionList,
  removePosition
} from '@store/consts/utils';
import { FetchTicksAndTickMaps, ListType, actions as poolsActions } from '@store/reducers/pools';
import {
  ClosePositionData,
  GetCurrentTicksData,
  GetPositionTicks,
  HandleClaimFee,
  InitPositionData,
  actions
} from '@store/reducers/positions';
import { actions as snackbarsActions } from '@store/reducers/snackbars';
import { poolsArraySortedByFees, tickMaps, tokens } from '@store/selectors/pools';
import { address } from '@store/selectors/wallet';
import SingletonOraiswapV3 from '@store/services/contractSingleton';
import { closeSnackbar } from 'notistack';
import { all, call, fork, join, put, select, spawn, takeEvery, takeLatest } from 'typed-redux-saga';
import { fetchTicksAndTickMaps } from './pools';
import { fetchBalances } from './wallet';
import { PoolKey, newPoolKey } from '@wasm';
import { ORAI } from '@store/consts/static';
import { actions as walletActions } from '@store/reducers/wallet';

function* handleInitPosition(action: PayloadAction<InitPositionData>): Generator {
  const {
    poolKeyData,
    lowerTick,
    upperTick,
    spotSqrtPrice,
    tokenXAmount,
    tokenYAmount,
    liquidityDelta,
    initPool,
    slippageTolerance
  } = action.payload;

  const { token_x, token_y, fee_tier } = poolKeyData;

  const walletAddress = yield* select(address);

  if (
    // TODO: open to ibc tokens later
    (isNativeToken(token_x) && tokenXAmount !== 0n) ||
    (isNativeToken(token_y) && tokenYAmount !== 0n)
  ) {
    return yield* call(handleInitPositionWithNative, action);
  }

  const loaderCreatePosition = createLoaderKey();
  const loaderSigningTx = createLoaderKey();

  try {
    yield put(
      snackbarsActions.add({
        message: 'Creating position...',
        variant: 'pending',
        persist: true,
        key: loaderCreatePosition
      })
    );

    const txs = [];

    const [xAmountWithSlippage, yAmountWithSlippage] = calculateTokenAmountsWithSlippage(
      fee_tier.tick_spacing,
      spotSqrtPrice,
      liquidityDelta,
      Number(lowerTick),
      Number(upperTick),
      Number(slippageTolerance),
      true
    );

    const XTokenTx = yield* call(approveToken, token_x, xAmountWithSlippage, walletAddress);
    txs.push(XTokenTx);

    const YTokenTx = yield* call(approveToken, token_y, yAmountWithSlippage, walletAddress);
    txs.push(YTokenTx);

    const poolKey = newPoolKey(token_x, token_y, fee_tier);

    if (initPool) {
      const createTx = yield* call(createPoolTx, poolKey, spotSqrtPrice.toString(), walletAddress);
      txs.push(createTx);
    }

    const tx = yield* call(
      createPositionTx,
      poolKey,
      lowerTick,
      upperTick,
      liquidityDelta,
      spotSqrtPrice,
      slippageTolerance,
      walletAddress
    );
    txs.push(tx);

    yield put(
      snackbarsActions.add({
        message: 'Signing transaction...',
        variant: 'pending',
        persist: true,
        key: loaderSigningTx
      })
    );

    closeSnackbar(loaderSigningTx);
    yield put(snackbarsActions.remove(loaderSigningTx));

    yield* put(actions.setInitPositionSuccess(true));

    closeSnackbar(loaderCreatePosition);
    yield put(snackbarsActions.remove(loaderCreatePosition));

    yield put(
      snackbarsActions.add({
        message: 'Position successfully created',
        variant: 'success',
        persist: false,
        txid: tx
      })
    );

    yield put(actions.getPositionsList());

    yield* call(fetchBalances, [token_x, token_y]);

    yield* put(poolsActions.getPoolKeys());
  } catch (e: any) {
    console.log(e);

    yield* put(actions.setInitPositionSuccess(false));

    closeSnackbar(loaderCreatePosition);
    yield put(snackbarsActions.remove(loaderCreatePosition));
    closeSnackbar(loaderSigningTx);
    yield put(snackbarsActions.remove(loaderSigningTx));

    if (e.message) {
      yield put(
        snackbarsActions.add({
          message: e.message,
          variant: 'error',
          persist: false
        })
      );
    } else {
      yield put(
        snackbarsActions.add({
          message: 'Failed to send. Please try again.',
          variant: 'error',
          persist: false
        })
      );
    }
  }
}

export function* handleGetPositionsList() {
  try {
    const walletAddress = yield* select(address);
    const positions = yield* call(positionList, walletAddress);

    const pools: PoolKey[] = [];
    const poolSet: Set<string> = new Set();
    for (let i = 0; i < positions.length; i++) {
      const poolKeyString = poolKeyToString(positions[i].pool_key);

      if (!poolSet.has(poolKeyString)) {
        poolSet.add(poolKeyString);
        pools.push(positions[i].pool_key);
      }
    }

    yield* put(
      poolsActions.getPoolsDataForList({
        poolKeys: Array.from(pools),
        listType: ListType.POSITIONS
      })
    );

    yield* put(actions.setPositionsList(positions));
  } catch (e) {
    yield* put(actions.setPositionsList([]));
  }
}

export function* handleGetCurrentPositionTicks(action: PayloadAction<GetPositionTicks>) {
  const { poolKey, lowerTickIndex, upperTickIndex } = action.payload;
  const [lowerTick, upperTick] = yield* all([
    call(getTick, lowerTickIndex, poolKey),
    call(getTick, upperTickIndex, poolKey)
  ]);

  yield put(
    actions.setCurrentPositionTicks({
      lowerTick,
      upperTick
    })
  );
}

function* handleInitPositionWithNative(action: PayloadAction<InitPositionData>): Generator {
  const walletAddress = yield* select(address);

  // TODO: implement work with native token
  const loaderCreatePosition = createLoaderKey()
  const loaderSigningTx = createLoaderKey()

  const {
    poolKeyData,
    lowerTick,
    upperTick,
    spotSqrtPrice,
    liquidityDelta,
    initPool,
    slippageTolerance
  } = action.payload

  const { token_x, token_y, fee_tier } = poolKeyData

  try {
    yield put(
      snackbarsActions.add({
        message: 'Creating position...',
        variant: 'pending',
        persist: true,
        key: loaderCreatePosition
      })
    )

    const [xAmountWithSlippage, yAmountWithSlippage] = calculateTokenAmountsWithSlippage(
      fee_tier.tick_spacing,
      spotSqrtPrice,
      liquidityDelta,
      lowerTick,
      upperTick,
      Number(slippageTolerance),
      true
    )

    yield* call(approveToken, token_x, xAmountWithSlippage, walletAddress)

    yield* call(approveToken, token_y, yAmountWithSlippage, walletAddress)

    const poolKey = newPoolKey(token_x, token_y, fee_tier);

    if (initPool) {
      yield* call(createPoolTx, poolKey, spotSqrtPrice.toString(), walletAddress);
    }

    // TODO:here
    const tx = yield* call(
      createPositionWithNativeTx,
      poolKey,
      lowerTick,
      upperTick,
      liquidityDelta,
      spotSqrtPrice,
      slippageTolerance,
      xAmountWithSlippage,
      yAmountWithSlippage,
      walletAddress
    );

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

    yield put(walletActions.getSelectedTokens([token_x, token_y]))

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

export function* handleGetCurrentPlotTicks(
  action: PayloadAction<GetCurrentTicksData>
): Generator {
  const { poolKey, isXtoY, fetchTicksAndTickmap } = action.payload
  let allTickmaps = yield* select(tickMaps);
  const allTokens = yield* select(tokens);
  const allPools = yield* select(poolsArraySortedByFees);

  const xDecimal = allTokens[poolKey.token_x].decimals;
  const yDecimal = allTokens[poolKey.token_y].decimals;

  try {
    if (!allTickmaps[poolKeyToString(poolKey)] || fetchTicksAndTickmap) {
      const fetchTicksAndTickMapsAction: PayloadAction<FetchTicksAndTickMaps> = {
        type: poolsActions.getTicksAndTickMaps.type,
        payload: {
          tokenFrom: allTokens[poolKey.token_x].address,
          tokenTo: allTokens[poolKey.token_y].address,
          allPools
        }
      };

      const fetchTask = yield* fork(fetchTicksAndTickMaps, fetchTicksAndTickMapsAction);

      yield* join(fetchTask);
      allTickmaps = yield* select(tickMaps);
    }

    if (!allTickmaps[poolKeyToString(poolKey)]) {
      const data = createPlaceholderLiquidityPlot(
        action.payload.isXtoY,
        0,
        poolKey.fee_tier.tick_spacing,
        xDecimal,
        yDecimal
      );
      yield* put(actions.setPlotTicks(data));
      return;
    }

    const rawTicks = yield* call(
      getAllLiquidityTicks,
      poolKey,
      deserializeTickmap(allTickmaps[poolKeyToString(poolKey)])
    );
    if (rawTicks.length === 0) {
      const data = createPlaceholderLiquidityPlot(
        action.payload.isXtoY,
        0,
        poolKey.fee_tier.tick_spacing,
        xDecimal,
        yDecimal
      );
      yield* put(actions.setPlotTicks(data));
      return;
    }

    const ticksData = createLiquidityPlot(
      rawTicks,
      poolKey.fee_tier.tick_spacing,
      isXtoY,
      xDecimal,
      yDecimal
    );
    yield put(actions.setPlotTicks(ticksData));
  } catch (error) {
    console.log(error);
    const data = createPlaceholderLiquidityPlot(
      action.payload.isXtoY,
      10,
      poolKey.fee_tier.tick_spacing,
      xDecimal,
      yDecimal
    );
    yield* put(actions.setErrorPlotTicks(data));
  }
}

// TODO: remove this function use handleClaimFee instead
export async function handleClaimFeeSingleton(index?: bigint) {
  const txResult = await SingletonOraiswapV3.dex.claimFee({
    index: Number(index)
  });

  return txResult;
}

export function* handleClaimFee(action: PayloadAction<HandleClaimFee>) {
  const { index, addressTokenX, addressTokenY } = action.payload;

  const walletAddress = yield* select(address);

  // TODO: clain fee with native token
  // if (addressTokenX === ORAI.address || addressTokenY === ORAI.address) {
  //   yield* call(handleClaimFeeWithNative, action);
  //   return;
  // }

  const loaderKey = createLoaderKey();
  const loaderSigningTx = createLoaderKey();
  try {
    yield put(
      snackbarsActions.add({
        message: 'Claiming fee...',
        variant: 'pending',
        persist: true,
        key: loaderKey
      })
    );

    yield put(
      snackbarsActions.add({
        message: 'Signing transaction...',
        variant: 'pending',
        persist: true,
        key: loaderSigningTx
      })
    );

    closeSnackbar(loaderSigningTx);
    yield put(snackbarsActions.remove(loaderSigningTx));

    const txResult = yield* call(claimFee, index, walletAddress);

    closeSnackbar(loaderKey);
    yield put(snackbarsActions.remove(loaderKey));
    yield put(
      snackbarsActions.add({
        message: 'Fee successfully claimed',
        variant: 'success',
        persist: false,
        txid: txResult
      })
    );

    yield put(actions.getSinglePosition(index));
    yield* call(fetchBalances, [addressTokenX === ORAI.address ? addressTokenY : addressTokenX]);
  } catch (e) {
    closeSnackbar(loaderSigningTx);
    yield put(snackbarsActions.remove(loaderSigningTx));
    closeSnackbar(loaderKey);
    yield put(snackbarsActions.remove(loaderKey));

    // yield put(
    //   snackbarsActions.add({
    //     message: 'Failed to claim fee. Please try again.',
    //     variant: 'error',
    //     persist: false
    //   })
    // );

    if (e.message) {
      yield put(
        snackbarsActions.add({
          message: e.message,
          variant: 'error',
          persist: false
        })
      );
    } else {
      yield put(
        snackbarsActions.add({
          message: 'Failed to claim fee. Please try again.',
          variant: 'error',
          persist: false
        })
      );
    }

    console.log(e);
  }
}

// export function* handleClaimFeeWithNative(_action: PayloadAction<HandleClaimFee>) {
//   // TODO: implement claim fee with native token
// }

export function* handleGetSinglePosition(action: PayloadAction<bigint>) {
  const walletAddress = yield* select(address);
  const position = yield* call(getPosition, action.payload, walletAddress);
  console.log('position', position);
  yield* put(
    actions.setSinglePosition({
      index: action.payload,
      position
    })
  );
  yield* put(
    actions.getCurrentPositionTicks({
      poolKey: position.pool_key,
      lowerTickIndex: BigInt(position.lower_tick_index),
      upperTickIndex: BigInt(position.upper_tick_index)
    })
  );
  yield* put(
    poolsActions.getPoolsDataForList({
      poolKeys: [position.pool_key],
      listType: ListType.POSITIONS
    })
  );
}

export function* handleClosePosition(action: PayloadAction<ClosePositionData>) {
  const walletAddress = yield* select(address);

  const { addressTokenX, addressTokenY, onSuccess, positionIndex } = action.payload;

  // TODO: open to ibc tokens later
  // if (addressTokenX === ORAI.address || addressTokenY === ORAI.address) {
  //   yield* call(handleClosePositionWithNative, action);
  //   return;
  // }

  const loaderKey = createLoaderKey();
  const loaderSigningTx = createLoaderKey();

  try {
    yield put(
      snackbarsActions.add({
        message: 'Removing position...',
        variant: 'pending',
        persist: true,
        key: loaderKey
      })
    );

    yield put(
      snackbarsActions.add({
        message: 'Signing transaction...',
        variant: 'pending',
        persist: true,
        key: loaderSigningTx
      })
    );

    const tx = yield* call(removePosition, positionIndex, walletAddress);

    closeSnackbar(loaderSigningTx);
    yield put(snackbarsActions.remove(loaderSigningTx));

    // const txResult = yield* call(sendTx, signedTx)

    closeSnackbar(loaderKey);
    yield put(snackbarsActions.remove(loaderKey));
    yield put(
      snackbarsActions.add({
        message: 'Position successfully removed',
        variant: 'success',
        persist: false,
        txid: tx
      })
    );

    yield* put(actions.getPositionsList());
    onSuccess();

    yield* call(fetchBalances, [addressTokenX, addressTokenY]);
  } catch (e) {
    closeSnackbar(loaderSigningTx);
    yield put(snackbarsActions.remove(loaderSigningTx));
    closeSnackbar(loaderKey);
    yield put(snackbarsActions.remove(loaderKey));

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
          message: 'Failed to close position. Please try again.',
          variant: 'error',
          persist: false
        })
      )
    }

    console.log(e);
  }
}

// export function* handleClosePositionWithNative(_action: PayloadAction<ClosePositionData>) {
//   // TODO: implement close position with native token
// }

export function* initPositionHandler(): Generator {
  yield* takeEvery(actions.initPosition, handleInitPosition);
}

export function* getPositionsListHandler(): Generator {
  yield* takeLatest(actions.getPositionsList, handleGetPositionsList);
}

export function* getCurrentPositionTicksHandler(): Generator {
  yield* takeEvery(actions.getCurrentPositionTicks, handleGetCurrentPositionTicks);
}

export function* getCurrentPlotTicksHandler(): Generator {
  yield* takeLatest(actions.getCurrentPlotTicks, handleGetCurrentPlotTicks);
}
export function* claimFeeHandler(): Generator {
  yield* takeEvery(actions.claimFee, handleClaimFee);
}

export function* getSinglePositionHandler(): Generator {
  yield* takeEvery(actions.getSinglePosition, handleGetSinglePosition);
}

export function* closePositionHandler(): Generator {
  yield* takeEvery(actions.closePosition, handleClosePosition);
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
  );
}
