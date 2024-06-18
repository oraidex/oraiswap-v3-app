import { PayloadAction } from '@reduxjs/toolkit'
import {
  INVARIANT_SWAP_OPTIONS,
  INVARIANT_WITHDRAW_ALL_WAZERO,
  PSP22_APPROVE_OPTIONS,
  U128MAX,
  WAZERO_DEPOSIT_OPTIONS,
  WAZERO_WITHDRAW_OPTIONS
} from '@store/consts/static'
import {
  MAX_SQRT_PRICE,
  MIN_SQRT_PRICE,
  PERCENTAGE_DENOMINATOR,
  PERCENTAGE_SCALE,
  calculateAmountInWithSlippage,
  calculatePriceImpact,
  calculateSqrtPriceAfterSlippage,
  createLoaderKey,
  deserializeTickmap,
  findPairs,
  poolKeyToString,
  printBigint
} from '@store/consts/utils'
import { FetchTicksAndTickMaps, actions as poolActions } from '@store/reducers/pools'
import { actions as snackbarsActions } from '@store/reducers/snackbars'
import { Simulate, Swap, actions } from '@store/reducers/swap'
import { poolTicks, pools, tickMaps, tokens } from '@store/selectors/pools'
import { address, balance } from '@store/selectors/wallet'
import SingletonOraiswapV3 from '@store/services/contractSingleton'
import { closeSnackbar } from 'notistack'
import { all, call, fork, join, put, select, spawn, takeEvery } from 'typed-redux-saga'
import { fetchBalances } from './wallet'
import { SwapError, simulateSwap } from '@wasm'
import { fetchTicksAndTickMaps } from './pools'

export function* handleSwap(action: PayloadAction<Omit<Swap, 'txid'>>) {
  const { poolKey, tokenFrom, slippage, amountIn, byAmountIn, estimatedPriceAfterSwap, tokenTo } =
    action.payload

  if (!poolKey) {
    return
  }

  const loaderSwappingTokens = createLoaderKey()
  const loaderSigningTx = createLoaderKey()

  put(
    snackbarsActions.add({
      message: 'Swapping tokens...',
      variant: 'pending',
      persist: true,
      key: loaderSwappingTokens
    })
  )

  const xToY = tokenFrom.toString() === poolKey.token_x

  const sqrtPriceLimit = calculateSqrtPriceAfterSlippage(
    BigInt(estimatedPriceAfterSwap),
    slippage,
    !xToY
  )

  let calculatedAmountIn = amountIn
  if (!byAmountIn) {
    calculatedAmountIn = calculateAmountInWithSlippage(amountIn, sqrtPriceLimit, !xToY)
  }

  // check allowance to approve instead of combine message
  if (xToY) {
    yield SingletonOraiswapV3.tokens[poolKey.token_x].increaseAllowance({
      spender: SingletonOraiswapV3.dex.contractAddress,
      amount: calculatedAmountIn.toString()
    })
  } else {
    yield SingletonOraiswapV3.tokens[poolKey.token_y].increaseAllowance({
      spender: SingletonOraiswapV3.dex.contractAddress,
      amount: calculatedAmountIn.toString()
    })
  }

  try {
    closeSnackbar(loaderSigningTx)
    yield put(snackbarsActions.remove(loaderSigningTx))
    const swapTx = yield SingletonOraiswapV3.dex.swap({
      poolKey,
      xToY,
      amount: amountIn.toString(),
      byAmountIn,
      sqrtPriceLimit: sqrtPriceLimit.toString()
    })

    closeSnackbar(loaderSwappingTokens)

    yield put(snackbarsActions.remove(loaderSwappingTokens))

    yield put(
      snackbarsActions.add({
        message: 'Tokens swapped successfully.',
        variant: 'success',
        persist: false,
        txid: swapTx.transactionHash
      })
    )

    yield call(fetchBalances, [poolKey.token_x, poolKey.token_y])

    yield put(actions.setSwapSuccess(true))

    yield put(
      poolActions.getAllPoolsForPairData({
        first: tokenFrom,
        second: tokenTo
      })
    )
  } catch (error) {
    console.log(error)
    yield put(actions.setSwapSuccess(false))

    closeSnackbar(loaderSwappingTokens)
    yield put(snackbarsActions.remove(loaderSwappingTokens))
    closeSnackbar(loaderSigningTx)
    yield put(snackbarsActions.remove(loaderSigningTx))

    yield put(
      snackbarsActions.add({
        message: 'Tokens swapping failed. Please try again.',
        variant: 'error',
        persist: false
      })
    )
    yield put(
      poolActions.getAllPoolsForPairData({
        first: tokenFrom,
        second: tokenTo
      })
    )
  }
}

export function* handleGetSimulateResult(action: PayloadAction<Simulate>) {
  try {
    const allPools = yield* select(pools)
    const allTickmaps = yield* select(tickMaps)
    const allTicks = yield* select(poolTicks)

    const { fromToken, toToken, amount, byAmountIn } = action.payload

    if (amount === 0n) {
      yield put(
        actions.setSimulateResult({
          poolKey: null,
          amountOut: 0n,
          priceImpact: 0,
          targetSqrtPrice: 0n,
          errors: [SwapError.AmountIsZero]
        })
      )
      return
    }

    const filteredPools = findPairs(
      fromToken.toString(),
      toToken.toString(),
      Object.values(allPools)
    )
    if (!filteredPools) {
      yield put(
        actions.setSimulateResult({
          poolKey: null,
          amountOut: 0n,
          priceImpact: 0,
          targetSqrtPrice: 0n,
          errors: [SwapError.NoRouteFound]
        })
      )
      return
    }

    let poolKey = null
    let amountOut = 0n
    let priceImpact = 0
    let targetSqrtPrice = 0n
    const errors = []

    for (const pool of filteredPools) {
      const xToY = fromToken.toString() === pool.pool_key.token_x

      try {
        const result = simulateSwap(
          deserializeTickmap(allTickmaps[poolKeyToString(pool.pool_key)]),
          pool.pool_key.fee_tier,
          allPools[poolKeyToString(pool.pool_key)],
          allTicks[poolKeyToString(pool.pool_key)],
          xToY,
          byAmountIn
            ? amount - (amount * BigInt(pool.pool_key.fee_tier.fee)) / PERCENTAGE_DENOMINATOR
            : amount,
          byAmountIn,
          xToY ? MIN_SQRT_PRICE : MAX_SQRT_PRICE
        )

        if (result.globalInsufficientLiquidity) {
          errors.push(SwapError.InsufficientLiquidity)
          continue
        }

        if (result.maxTicksCrossed) {
          errors.push(SwapError.MaxTicksCrossed)
          continue
        }

        if (result.stateOutdated) {
          errors.push(SwapError.StateOutdated)
          continue
        }

        const calculatedAmountOut = byAmountIn ? result.amountOut : result.amountOut + result.fee

        if (calculatedAmountOut === 0n) {
          errors.push(SwapError.AmountIsZero)
          continue
        }

        if (calculatedAmountOut > amountOut) {
          amountOut = calculatedAmountOut
          poolKey = pool.pool_key
          priceImpact = +printBigint(
            calculatePriceImpact(BigInt(pool.pool.sqrt_price), BigInt(result.targetSqrtPrice)),
            PERCENTAGE_SCALE
          )
          targetSqrtPrice = result.targetSqrtPrice
        }
      } catch (e) {
        console.log(e)
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
    )
  } catch (error) {
    console.log(error)
  }
}

export function* swapHandler(): Generator {
  yield* takeEvery(actions.swap, handleSwap)
}

export function* getSimulateResultHandler(): Generator {
  yield* takeEvery(actions.getSimulateResult, handleGetSimulateResult)
}

export function* swapSaga(): Generator {
  yield all([swapHandler, getSimulateResultHandler].map(spawn))
}
