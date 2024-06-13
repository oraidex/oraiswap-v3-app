

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
  calculateAmountInWithSlippage,
  createLoaderKey,
  deserializeTickmap,
  findPairs,
  poolKeyToString,
  printBigint
} from '@store/consts/utils'
import { actions as poolActions } from '@store/reducers/pools'
import { actions as snackbarsActions } from '@store/reducers/snackbars'
import { Simulate, Swap, actions } from '@store/reducers/swap'
import { poolTicks, pools, tickMaps, tokens } from '@store/selectors/pools'
import { address, balance } from '@store/selectors/wallet'
import SingletonOraiswapV3 from '@store/services/contractSingleton'
import { closeSnackbar } from 'notistack'
import { fetchBalances } from './wallet'

export async function handleSwap(action: PayloadAction<Omit<Swap, 'txid'>>) {
  const { poolKey, tokenFrom, slippage, amountIn, byAmountIn, estimatedPriceAfterSwap, tokenTo } =
    action.payload

  if (!poolKey) {
    return
  }

  const loaderSwappingTokens = createLoaderKey()
  const loaderSigningTx = createLoaderKey()

  try {
     put(
      snackbarsActions.add({
        message: 'Swapping tokens...',
        variant: 'pending',
        persist: true,
        key: loaderSwappingTokens
      })
    )

    const xToY = tokenFrom.toString() === poolKey.token_x

    const sqrtPriceLimit = calculateSqrtPriceAfterSlippage(estimatedPriceAfterSwap, slippage, !xToY)

    let calculatedAmountIn = amountIn
    if (!byAmountIn) {
      calculatedAmountIn = calculateAmountInWithSlippage(amountIn, sqrtPriceLimit, !xToY)
    }

    // check allowance to approve instead of combine message
    if (xToY) {
      await SingletonOraiswapV3.tokens[poolKey.token_x].increaseAllowance({
        spender: SingletonOraiswapV3.dex.contractAddress,
        amount: calculatedAmountIn.toString()
      })
    } else {
      await SingletonOraiswapV3.tokens[poolKey.token_y].increaseAllowance({
        spender: SingletonOraiswapV3.dex.contractAddress,
        amount: calculatedAmountIn.toString()
      })
    }

    const swapTx = await SingletonOraiswapV3.dex.swap({
      poolKey,
      xToY,
      amount: amountIn.toString(),
      byAmountIn,
      sqrtPriceLimit: sqrtPriceLimit.toString()
    })

     put(
      snackbarsActions.add({
        message: 'Signing transaction...',
        variant: 'pending',
        persist: true,
        key: loaderSigningTx
      })
    )

  //   const signedBatchedTx = yield* call([batchedTx, batchedTx.signAsync], walletAddress, {
  //     signer: adapter.signer as Signer
  //   })

  //   closeSnackbar(loaderSigningTx)
  //   yield put(snackbarsActions.remove(loaderSigningTx))

  //   const txResult = yield* call(sendTx, signedBatchedTx)

  //   closeSnackbar(loaderSwappingTokens)
  //   yield put(snackbarsActions.remove(loaderSwappingTokens))

  //   yield put(
  //     snackbarsActions.add({
  //       message: 'Tokens swapped successfully.',
  //       variant: 'success',
  //       persist: false,
  //       txid: txResult.hash
  //     })
  //   )

  //   yield* call(fetchBalances, [poolKey.tokenX, poolKey.tokenY])

  //   yield put(actions.setSwapSuccess(true))

  //   yield put(
  //     poolActions.getAllPoolsForPairData({
  //       first: tokenFrom,
  //       second: tokenTo
  //     })
  //   )
  // } catch (error) {
  //   console.log(error)

  //   yield put(actions.setSwapSuccess(false))

  //   closeSnackbar(loaderSwappingTokens)
  //   yield put(snackbarsActions.remove(loaderSwappingTokens))
  //   closeSnackbar(loaderSigningTx)
  //   yield put(snackbarsActions.remove(loaderSigningTx))

  //   yield put(
  //     snackbarsActions.add({
  //       message: 'Tokens swapping failed. Please try again.',
  //       variant: 'error',
  //       persist: false
  //     })
  //   )

  //   yield put(
  //     poolActions.getAllPoolsForPairData({
  //       first: tokenFrom,
  //       second: tokenTo
  //     })
  //   )
  // }
}

export async function handleSwapWithAZERO(action: PayloadAction<Omit<Swap, 'txid'>>) {
  const { poolKey, tokenFrom, slippage, amountIn, byAmountIn, estimatedPriceAfterSwap, tokenTo } =
    action.payload

  if (!poolKey) {
    return
  }

  const loaderSwappingTokens = createLoaderKey()
  const loaderSigningTx = createLoaderKey()

  try {
    

    yield put(
      snackbarsActions.add({
        message: 'Swapping tokens...',
        variant: 'pending',
        persist: true,
        key: loaderSwappingTokens
      })
    )

    
    const xToY = tokenFrom.toString() === poolKey.token_x


    const sqrtPriceLimit = calculateSqrtPriceAfterSlippage(estimatedPriceAfterSwap, slippage, !xToY)
    let calculatedAmountIn = amountIn
    if (!byAmountIn) {
      calculatedAmountIn = calculateAmountInWithSlippage(amountIn, sqrtPriceLimit, !xToY)
    }


    if (xToY) {
      await SingletonOraiswapV3.tokens[poolKey.token_x].increaseAllowance({
        spender: SingletonOraiswapV3.dex.contractAddress,
        amount: calculatedAmountIn.toString()
      })
    } else {
      await SingletonOraiswapV3.tokens[poolKey.token_y].increaseAllowance({
        spender: SingletonOraiswapV3.dex.contractAddress,
        amount: calculatedAmountIn.toString()
      })
    }

    
    const swapTx = await SingletonOraiswapV3.dex.swap({
      poolKey,
      xToY,
      amount: amountIn.toString(),
      byAmountIn,
      sqrtPriceLimit: sqrtPriceLimit.toString()
    })

    // if (
    //   (!xToY && poolKey.tokenX === TESTNET_WAZERO_ADDRESS) ||
    //   (xToY && poolKey.tokenY === TESTNET_WAZERO_ADDRESS)
    // ) {
    //   const withdrawTx = wazero.withdrawTx(swapSimulateResult.amountOut, WAZERO_WITHDRAW_OPTIONS)
    //   txs.push(withdrawTx)
    // }

    // const approveTx = psp22.approveTx(
    //   invAddress,
    //   U128MAX,
    //   TESTNET_WAZERO_ADDRESS,
    //   PSP22_APPROVE_OPTIONS
    // )
    // txs.push(approveTx)

    const batchedTx = api.tx.utility.batchAll(txs)

    yield put(
      snackbarsActions.add({
        message: 'Signing transaction...',
        variant: 'pending',
        persist: true,
        key: loaderSigningTx
      })
    )

    const signedBatchedTx = yield* call([batchedTx, batchedTx.signAsync], walletAddress, {
      signer: adapter.signer as Signer
    })

    closeSnackbar(loaderSigningTx)
    yield put(snackbarsActions.remove(loaderSigningTx))

    const txResult = yield* call(sendTx, signedBatchedTx)

    closeSnackbar(loaderSwappingTokens)
    yield put(snackbarsActions.remove(loaderSwappingTokens))

    yield put(
      snackbarsActions.add({
        message: 'Tokens swapped successfully.',
        variant: 'success',
        persist: false,
        txid: txResult.hash
      })
    )

    

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

export enum SwapError {
  InsufficientLiquidity,
  AmountIsZero,
  NoRouteFound,
  MaxTicksCrossed,
  StateOutdated
}

export async function handleGetSimulateResult(action: PayloadAction<Simulate>) {
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
      const xToY = fromToken.toString() === pool.poolKey.token_x

      try {
        const result = simulateInvariantSwap(
          deserializeTickmap(allTickmaps[poolKeyToString(pool.poolKey)]),
          pool.poolKey.fee_tier,
          allPools[poolKeyToString(pool.poolKey)],
          allTicks[poolKeyToString(pool.poolKey)],
          xToY,
          byAmountIn
            ? amount - (amount * pool.poolKey.fee_tier.fee) / PERCENTAGE_DENOMINATOR
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
          poolKey = pool.poolKey
          priceImpact = +printBigint(
            calculatePriceImpact(pool.sqrt_price, result.targetSqrtPrice),
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

export async function swapHandler() {
  yield* takeEvery(actions.swap, handleSwap)
}

export async function getSimulateResultHandler() {
  yield* takeEvery(actions.getSimulateResult, handleGetSimulateResult)
}

