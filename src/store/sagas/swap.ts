import { PayloadAction } from '@reduxjs/toolkit';
import { SWAP_HOPS_CACHE, U128MAX } from '@store/consts/static';
import {
  MAX_SQRT_PRICE,
  MIN_SQRT_PRICE,
  PERCENTAGE_SCALE,
  approveToken,
  calculateAmountInWithSlippage,
  calculatePriceImpact,
  calculateSqrtPriceAfterSlippage,
  createLoaderKey,
  deserializeTickmap,
  findPairs,
  isNativeToken,
  poolKeyToString,
  priceToSqrtPrice,
  printBigint,
  quoteRoute,
  reverseSwapHopArray,
  swapRouteWithSlippageTx,
  swapWithSlippageTx
} from '@store/consts/utils';
import { FetchTicksAndTickMaps, actions as poolActions } from '@store/reducers/pools';
import { actions as snackbarsActions } from '@store/reducers/snackbars';
import { Simulate, Swap, actions } from '@store/reducers/swap';
import { poolTicks, pools, tickMaps, tokens } from '@store/selectors/pools';
import { closeSnackbar } from 'notistack';
import { all, call, put, select, spawn, takeEvery } from 'typed-redux-saga';
import { fetchBalances } from './wallet';
import { CalculateSwapResult, PoolKey, SwapError, simulateSwap } from '@wasm';
import { fetchTicksAndTickMaps } from './pools';
import { address } from '@store/selectors/wallet';

export function* handleSwap(action: PayloadAction<Omit<Swap, 'txid'>>): Generator {
  const walletAddress = yield* select(address);

  const {
    poolKey,
    tokenFrom,
    slippage,
    amountIn,
    // amountOut,
    byAmountIn,
    estimatedPriceAfterSwap,
    tokenTo
  } = action.payload;

  if (poolKey.fee_tier.tick_spacing == 0) {
    return yield* call(handleSwapWithMultiHop, action);
  }

  if (!poolKey) {
    return;
  }

  if (isNativeToken(poolKey.token_x) || isNativeToken(poolKey.token_y)) {
    return yield* call(handleSwapWithNative, action);
  }

  const loaderSwappingTokens = createLoaderKey();
  const loaderSigningTx = createLoaderKey();

  try {
    const allTokens = yield* select(tokens);

    yield put(
      snackbarsActions.add({
        message: 'Swapping tokens...',
        variant: 'pending',
        persist: true,
        key: loaderSwappingTokens
      })
    );

    // const api = yield* getConnection()
    // const network = yield* select(networkType)
    // const walletAddress = yield* select(address)
    // const adapter = yield* call(getAlephZeroWallet)
    // const invAddress = yield* select(oraidexAddress)

    const tokenX = allTokens[poolKey.token_x];
    const tokenY = allTokens[poolKey.token_y];
    const xToY = tokenFrom.toString() === poolKey.token_x;

    const txs = [];

    const sqrtPriceLimit = calculateSqrtPriceAfterSlippage(
      BigInt(estimatedPriceAfterSwap),
      slippage,
      !xToY
    );
    let calculatedAmountIn = amountIn;
    if (!byAmountIn) {
      calculatedAmountIn = calculateAmountInWithSlippage(
        amountIn,
        sqrtPriceLimit,
        !xToY,
        BigInt(poolKey.fee_tier.fee)
      );
    }

    if (xToY) {
      const approveTx = yield* call(
        approveToken,
        tokenX.address,
        calculatedAmountIn,
        walletAddress
      );
      txs.push(approveTx);
    } else {
      const approveTx = yield* call(
        approveToken,
        tokenY.address,
        calculatedAmountIn,
        walletAddress
      );
      txs.push(approveTx);
    }

    const swapTx = yield* call(
      swapWithSlippageTx,
      poolKey,
      xToY,
      amountIn,
      byAmountIn,
      sqrtPriceLimit,
      slippage,
      walletAddress
    );
    txs.push(swapTx);

    // const batchedTx = api.tx.utility.batchAll(txs)

    yield put(
      snackbarsActions.add({
        message: 'Signing transaction...',
        variant: 'pending',
        persist: true,
        key: loaderSigningTx
      })
    );

    // let signedBatchedTx: any
    // try {
    //   signedBatchedTx = yield* call([batchedTx, batchedTx.signAsync], walletAddress, {
    //     signer: adapter.signer as Signer
    //   })
    // } catch (e) {
    //   throw new Error(ErrorMessage.TRANSACTION_SIGNING_ERROR)
    // }

    closeSnackbar(loaderSigningTx);
    yield put(snackbarsActions.remove(loaderSigningTx));

    // const txResult = yield* call(sendTx, signedBatchedTx)

    closeSnackbar(loaderSwappingTokens);
    yield put(snackbarsActions.remove(loaderSwappingTokens));

    yield put(
      snackbarsActions.add({
        message: 'Tokens swapped successfully.',
        variant: 'success',
        persist: false,
        txid: swapTx
      })
    );

    yield* call(fetchBalances, [poolKey.token_x, poolKey.token_y]);

    yield put(actions.setSwapSuccess(true));

    yield put(
      poolActions.getAllPoolsForPairData({
        first: tokenFrom,
        second: tokenTo
      })
    );
  } catch (e: any) {
    console.log(e.message);
    console.log(e);

    yield put(actions.setSwapSuccess(false));

    closeSnackbar(loaderSwappingTokens);
    yield put(snackbarsActions.remove(loaderSwappingTokens));
    closeSnackbar(loaderSigningTx);
    yield put(snackbarsActions.remove(loaderSigningTx));

    // if (e.message) {
    //   yield put(
    //     snackbarsActions.add({
    //       message: e.message,
    //       variant: 'error',
    //       persist: false
    //     })
    //   );
    // } else {
      yield put(
        snackbarsActions.add({
          message: 'Tokens swapping failed. Please try again.',
          variant: 'error',
          persist: false
        })
      );
    // }

    yield put(
      poolActions.getAllPoolsForPairData({
        first: tokenFrom,
        second: tokenTo
      })
    );
  }
}

export function* handleSwapWithMultiHop(action: PayloadAction<Omit<Swap, 'txid'>>): Generator {
  const walletAddress = yield* select(address);

  const {
    poolKey,
    tokenFrom,
    slippage,
    amountIn,
    amountOut,
    byAmountIn,
    // estimatedPriceAfterSwap,
    tokenTo
  } = action.payload;

  // console.log('handleSwapWithMultiHop', action.payload);

  if (!poolKey) {
    return;
  }

  const loaderSwappingTokens = createLoaderKey();
  const loaderSigningTx = createLoaderKey();

  try {
    const allTokens = yield* select(tokens);

    yield put(
      snackbarsActions.add({
        message: 'Swapping tokens...',
        variant: 'pending',
        persist: true,
        key: loaderSwappingTokens
      })
    );

    const tokenX = allTokens[poolKey.token_x];
    const tokenY = allTokens[poolKey.token_y];
    const xToY = tokenFrom.toString() === poolKey.token_x;

    const txs = [];
    // console.log({ amountOut, slippage, xToY });
    const estimatedPriceAfterSwap = priceToSqrtPrice(amountOut);
    const sqrtPriceLimit = calculateSqrtPriceAfterSlippage(
      estimatedPriceAfterSwap,
      slippage,
      !xToY
    );
    // console.log({ sqrtPriceLimit });
    let calculatedAmountIn = amountIn;
    if (!byAmountIn) {
      calculatedAmountIn = calculateAmountInWithSlippage(
        amountIn,
        sqrtPriceLimit,
        !xToY,
        BigInt(poolKey.fee_tier.fee)
      );
    }

    if (xToY) {
      const approveTx = yield* call(
        approveToken,
        tokenX.address,
        calculatedAmountIn,
        walletAddress
      );
      txs.push(approveTx);
    } else {
      const approveTx = yield* call(
        approveToken,
        tokenY.address,
        calculatedAmountIn,
        walletAddress
      );
      txs.push(approveTx);
    }

    const key = poolKey.token_x + '-' + poolKey.token_y + '-0-0';
    // console.log({ key });
    let swapHopArray = SWAP_HOPS_CACHE[key];
    if (!swapHopArray) {
      swapHopArray = SWAP_HOPS_CACHE[poolKey.token_y + '-' + poolKey.token_x + '-0-0'];
      swapHopArray = reverseSwapHopArray(swapHopArray);
    }
    if (!xToY) {
      swapHopArray = reverseSwapHopArray(swapHopArray);
    }

    // console.log({ swapHopArray });

    const swapTx = yield* call(
      swapRouteWithSlippageTx,
      poolKey,
      xToY,
      amountIn,
      sqrtPriceLimit,
      amountOut,
      slippage,
      walletAddress,
      swapHopArray
    );
    txs.push(swapTx);

    // const batchedTx = api.tx.utility.batchAll(txs)

    yield put(
      snackbarsActions.add({
        message: 'Signing transaction...',
        variant: 'pending',
        persist: true,
        key: loaderSigningTx
      })
    );

    // let signedBatchedTx: any
    // try {
    //   signedBatchedTx = yield* call([batchedTx, batchedTx.signAsync], walletAddress, {
    //     signer: adapter.signer as Signer
    //   })
    // } catch (e) {
    //   throw new Error(ErrorMessage.TRANSACTION_SIGNING_ERROR)
    // }

    closeSnackbar(loaderSigningTx);
    yield put(snackbarsActions.remove(loaderSigningTx));

    // const txResult = yield* call(sendTx, signedBatchedTx)

    closeSnackbar(loaderSwappingTokens);
    yield put(snackbarsActions.remove(loaderSwappingTokens));

    yield put(
      snackbarsActions.add({
        message: 'Tokens swapped successfully.',
        variant: 'success',
        persist: false,
        txid: swapTx
      })
    );

    yield* call(fetchBalances, [poolKey.token_x, poolKey.token_y]);

    yield put(actions.setSwapSuccess(true));

    yield put(
      poolActions.getAllPoolsForPairData({
        first: tokenFrom,
        second: tokenTo
      })
    );
  } catch (e: any) {
    console.log(e.message);
    console.log(e);

    yield put(actions.setSwapSuccess(false));

    closeSnackbar(loaderSwappingTokens);
    yield put(snackbarsActions.remove(loaderSwappingTokens));
    closeSnackbar(loaderSigningTx);
    yield put(snackbarsActions.remove(loaderSigningTx));

    // if (e.message) {
    //   yield put(
    //     snackbarsActions.add({
    //       message: e.message,
    //       variant: 'error',
    //       persist: false
    //     })
    //   );
    // } else {
      yield put(
        snackbarsActions.add({
          message: 'Tokens swapping failed. Please try again.',
          variant: 'error',
          persist: false
        })
      );
    // }

    yield put(
      poolActions.getAllPoolsForPairData({
        first: tokenFrom,
        second: tokenTo
      })
    );
  }
}

export function* handleSwapWithNative(action: PayloadAction<Omit<Swap, 'txid'>>): Generator {
  const walletAddress = yield* select(address);

  const {
    poolKey,
    tokenFrom,
    slippage,
    amountIn,
    amountOut,
    byAmountIn,
    estimatedPriceAfterSwap,
    tokenTo
  } = action.payload;

  if (!poolKey) {
    return;
  }

  const loaderSwappingTokens = createLoaderKey();
  const loaderSigningTx = createLoaderKey();

  try {
    const allTokens = yield* select(tokens);

    yield put(
      snackbarsActions.add({
        message: 'Swapping tokens...',
        variant: 'pending',
        persist: true,
        key: loaderSwappingTokens
      })
    );

    const tokenX = allTokens[poolKey.token_x];
    const tokenY = allTokens[poolKey.token_y];
    const xToY = tokenFrom.toString() === poolKey.token_x;

    const txs = [];

    const sqrtPriceLimit = calculateSqrtPriceAfterSlippage(
      BigInt(estimatedPriceAfterSwap),
      slippage,
      !xToY
    );

    let calculatedAmountIn = amountIn;
    if (!byAmountIn) {
      calculatedAmountIn = calculateAmountInWithSlippage(
        amountIn,
        sqrtPriceLimit,
        !xToY,
        BigInt(poolKey.fee_tier.fee)
      );
    }

    if (xToY) {
      const approveTx = yield* call(
        approveToken,
        tokenX.address,
        calculatedAmountIn,
        walletAddress
      );
      txs.push(approveTx);
    } else {
      const approveTx = yield* call(
        approveToken,
        tokenY.address,
        calculatedAmountIn,
        walletAddress
      );
      txs.push(approveTx);
    }

    const swapTx = yield* call(
      swapWithSlippageTx,
      poolKey,
      xToY,
      amountIn,
      byAmountIn,
      sqrtPriceLimit,
      slippage,
      walletAddress
    );
    txs.push(swapTx);

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

    closeSnackbar(loaderSwappingTokens);
    yield put(snackbarsActions.remove(loaderSwappingTokens));

    yield put(
      snackbarsActions.add({
        message: 'Tokens swapped successfully.',
        variant: 'success',
        persist: false,
        txid: swapTx
      })
    );

    yield* call(fetchBalances, [poolKey.token_x, poolKey.token_y]);

    yield put(actions.setSwapSuccess(true));

    yield put(
      poolActions.getAllPoolsForPairData({
        first: tokenFrom,
        second: tokenTo
      })
    );
  } catch (e: any) {
    console.log(e);

    yield put(actions.setSwapSuccess(false));

    closeSnackbar(loaderSwappingTokens);
    yield put(snackbarsActions.remove(loaderSwappingTokens));
    closeSnackbar(loaderSigningTx);
    yield put(snackbarsActions.remove(loaderSigningTx));

    // if (e.message) {
    //   yield put(
    //     snackbarsActions.add({
    //       message: e.message,
    //       variant: 'error',
    //       persist: false
    //     })
    //   );
    // } else {
      yield put(
        snackbarsActions.add({
          message: 'Tokens swapping failed. Please try again.',
          variant: 'error',
          persist: false
        })
      );
    // }

    yield put(
      poolActions.getAllPoolsForPairData({
        first: tokenFrom,
        second: tokenTo
      })
    );
  }
}

export function* handleGetSimulateResult(action: PayloadAction<Simulate>) {
  try {
    const { fromToken, toToken, amount, byAmountIn } = action.payload;

    /**
     * tokenFrom: string
  tokenTo: string
  allPools: PoolWithPoolKey[]
     */

    const allPools = yield* select(pools);
    const poolKeyArray = Object.values(allPools);
    const actionFetch: PayloadAction<FetchTicksAndTickMaps> = {
      payload: {
        tokenFrom: fromToken,
        tokenTo: toToken,
        allPools: poolKeyArray
      },
      type: 'pools/fetchTicksAndTickMaps'
    };
    yield* call(fetchTicksAndTickMaps, actionFetch);
    const allTickmaps = yield* select(tickMaps);
    const allTicks = yield* select(poolTicks);

    console.log({ allPools, allTickmaps, allTicks, fromToken, toToken, amount, byAmountIn });

    const filteredPools = findPairs(
      fromToken.toString(),
      toToken.toString(),
      Object.values(allPools)
    );

    // console.log({ filteredPools });

    if (filteredPools.length === 0) {
      return yield* call(handleGetSimulateResultMultiHop, action);
    }

    if (amount === 0n) {
      yield put(
        actions.setSimulateResult({
          poolKey: null,
          amountOut: 0n,
          priceImpact: 0,
          targetSqrtPrice: 0n,
          errors: [SwapError.AmountIsZero]
        })
      );
      return;
    }

    let poolKey = null;
    let amountOut = byAmountIn ? 0n : U128MAX;
    let priceImpact = 0;
    let targetSqrtPrice = 0n;
    const errors = [];

    console.log({ filteredPools });

    for (const pool of filteredPools) {
      const xToY = fromToken.toString() === pool.pool_key.token_x;

      const poolInfo = allPools[poolKeyToString(pool.pool_key)].pool;
      const convertedPool = {
        current_tick_index: poolInfo.current_tick_index,
        fee_growth_global_x: BigInt(poolInfo.fee_growth_global_x),
        fee_growth_global_y: BigInt(poolInfo.fee_growth_global_y),
        fee_protocol_token_x: BigInt(poolInfo.fee_protocol_token_x),
        fee_protocol_token_y: BigInt(poolInfo.fee_protocol_token_y),
        fee_receiver: poolInfo.fee_receiver,
        liquidity: BigInt(poolInfo.liquidity),
        last_timestamp: Number(poolInfo.last_timestamp.toFixed(0)),
        sqrt_price: BigInt(poolInfo.sqrt_price),
        start_timestamp: Number(poolInfo.start_timestamp.toFixed(0))
      };
      console.log({ convertedPool });
      try {
        const result: CalculateSwapResult = simulateSwap(
          deserializeTickmap(allTickmaps[poolKeyToString(pool.pool_key)]),
          pool.pool_key.fee_tier,
          convertedPool,
          allTicks[poolKeyToString(pool.pool_key)],
          xToY,
          amount,
          byAmountIn,
          xToY ? MIN_SQRT_PRICE : MAX_SQRT_PRICE
        );

        if (result.global_insufficient_liquidity) {
          errors.push(SwapError.InsufficientLiquidity);
          continue;
        }

        if (result.max_ticks_crossed) {
          errors.push(SwapError.MaxTicksCrossed);
          continue;
        }

        if (result.state_outdated) {
          errors.push(SwapError.StateOutdated);
          continue;
        }

        if (result.amount_out === 0n) {
          errors.push(SwapError.AmountIsZero);
          continue;
        }

        if (
          byAmountIn ? result.amount_out > amountOut : result.amount_in + result.fee < amountOut
        ) {
          amountOut = byAmountIn ? result.amount_out : result.amount_in + result.fee;
          poolKey = pool.pool_key;
          priceImpact = +printBigint(
            calculatePriceImpact(BigInt(pool.pool.sqrt_price), result.target_sqrt_price),
            PERCENTAGE_SCALE
          );
          targetSqrtPrice = result.target_sqrt_price;
        }
      } catch (e) {
        console.log(e);
      }
    }

    yield put(
      actions.setSimulateResult({
        poolKey,
        amountOut,
        priceImpact,
        targetSqrtPrice,
        errors
      })
    );
  } catch (error) {
    console.log(error);
  }
}

export function* handleGetSimulateResultMultiHop(action: PayloadAction<Simulate>) {
  try {
    const { fromToken, toToken, amount } = action.payload;
    let { byAmountIn } = action.payload;

    let key = fromToken + '-' + toToken + '-0-0';
    // console.log({ key });
    let swapHopArray = SWAP_HOPS_CACHE[key];

    if (!swapHopArray) {
      // console.log('not go here')
      key = toToken + '-' + fromToken + '-0-0';
      swapHopArray = SWAP_HOPS_CACHE[key];

      if (!swapHopArray) {
        // console.log('not go here')
        yield put(
          actions.setSimulateResult({
            poolKey: null,
            amountOut: 0n,
            priceImpact: 0,
            targetSqrtPrice: 0n,
            errors: [SwapError.NoRouteFound]
          })
        );

        return;
      }
      byAmountIn = !byAmountIn;
    }

    // console.log({ swapHopArray });

    const poolKey: PoolKey = {
      fee_tier: {
        fee: 0,
        tick_spacing: 0
      },
      token_x: fromToken,
      token_y: toToken
    };

    if (amount === 0n) {
      // console.log('go hereeeeeee');
      yield put(
        actions.setSimulateResult({
          poolKey: null,
          amountOut: 0n,
          priceImpact: 0,
          targetSqrtPrice: 0n,
          errors: [SwapError.AmountIsZero]
        })
      );
      return;
    }

    let total_fee = 0;
    swapHopArray.forEach((hop) => {
      total_fee += hop.pool_key.fee_tier.fee;
    })

    poolKey.fee_tier.fee = total_fee;

    /**
     *  tokenFrom: string
        tokenTo: string
        allPools: PoolWithPoolKey[]
     */

    // const allPools = yield* select(pools);
    // const poolKeyArray = Object.values(allPools);
    // const actionFetch: PayloadAction<FetchTicksAndTickMaps> = {
    //   payload: {
    //     tokenFrom: fromToken,
    //     tokenTo: toToken,
    //     allPools: poolKeyArray
    //   },
    //   type: 'pools/fetchTicksAndTickMaps'
    // };
    // yield* call(fetchTicksAndTickMaps, actionFetch);
    // const allTickmaps = yield* select(tickMaps);
    // const allTicks = yield* select(poolTicks);

    // console.log({ allPools, allTickmaps, allTicks, fromToken, toToken, amount, byAmountIn });

    // const filteredPools = findPairs(
    //   fromToken.toString(),
    //   toToken.toString(),
    //   Object.values(allPools)
    // );

    if (!byAmountIn) {
      swapHopArray = reverseSwapHopArray(swapHopArray);
    }

    let amountOut = byAmountIn ? 0n : U128MAX;
    const priceImpact = 0;
    const targetSqrtPrice = 0n;
    const errors = [];

    // console.log({ filteredPools });
    amountOut = yield* call(quoteRoute, amount.toString(), swapHopArray);

    // for (const pool of filteredPools) {
    //   const xToY = fromToken.toString() === pool.pool_key.token_x;

    //   const poolInfo = allPools[poolKeyToString(pool.pool_key)].pool;
    //   const convertedPool = {
    //     current_tick_index: poolInfo.current_tick_index,
    //     fee_growth_global_x: BigInt(poolInfo.fee_growth_global_x),
    //     fee_growth_global_y: BigInt(poolInfo.fee_growth_global_y),
    //     fee_protocol_token_x: BigInt(poolInfo.fee_protocol_token_x),
    //     fee_protocol_token_y: BigInt(poolInfo.fee_protocol_token_y),
    //     fee_receiver: poolInfo.fee_receiver,
    //     liquidity: BigInt(poolInfo.liquidity),
    //     last_timestamp: Number(poolInfo.last_timestamp.toFixed(0)),
    //     sqrt_price: BigInt(poolInfo.sqrt_price),
    //     start_timestamp: Number(poolInfo.start_timestamp.toFixed(0))
    //   };
    //   console.log({ convertedPool });
    //   try {
    //     const result: CalculateSwapResult = simulateSwap(
    //       deserializeTickmap(allTickmaps[poolKeyToString(pool.pool_key)]),
    //       pool.pool_key.fee_tier,
    //       convertedPool,
    //       allTicks[poolKeyToString(pool.pool_key)],
    //       xToY,
    //       amount,
    //       byAmountIn,
    //       xToY ? MIN_SQRT_PRICE : MAX_SQRT_PRICE
    //     );

    //     if (result.global_insufficient_liquidity) {
    //       errors.push(SwapError.InsufficientLiquidity);
    //       continue;
    //     }

    //     if (result.max_ticks_crossed) {
    //       errors.push(SwapError.MaxTicksCrossed);
    //       continue;
    //     }

    //     if (result.state_outdated) {
    //       errors.push(SwapError.StateOutdated);
    //       continue;
    //     }

    //     if (result.amount_out === 0n) {
    //       errors.push(SwapError.AmountIsZero);
    //       continue;
    //     }

    //     if (
    //       byAmountIn ? result.amount_out > amountOut : result.amount_in + result.fee < amountOut
    //     ) {
    //       amountOut = byAmountIn ? result.amount_out : result.amount_in + result.fee;
    //       poolKey = pool.pool_key;
    //       priceImpact = +printBigint(
    //         calculatePriceImpact(BigInt(pool.pool.sqrt_price), result.target_sqrt_price),
    //         PERCENTAGE_SCALE
    //       );
    //       targetSqrtPrice = result.target_sqrt_price;
    //     }
    //   } catch (e) {
    //     console.log(e);
    //   }
    // }

    yield put(
      actions.setSimulateResult({
        poolKey,
        amountOut,
        priceImpact,
        targetSqrtPrice,
        errors
      })
    );
  } catch (error) {
    console.log(error);
  }
}

export function* swapHandler(): Generator {
  yield* takeEvery(actions.swap, handleSwap);
}

export function* getSimulateResultHandler(): Generator {
  yield* takeEvery(actions.getSimulateResult, handleGetSimulateResult);
}

export function* swapSaga(): Generator {
  yield all([swapHandler, getSimulateResultHandler].map(spawn));
}
