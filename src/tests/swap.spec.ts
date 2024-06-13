import { SimulateCosmWasmClient } from '@oraichain/cw-simulate'
import { OraiswapTokenClient, OraiswapTokenTypes } from '@oraichain/oraidex-contracts-sdk'
import * as oraidexArtifacts from '@oraichain/oraidex-contracts-build'
import fs from 'fs'
import path from 'path'
import * as OraiswapV3Wasm from '../wasm'
import { OraiswapV3Client, OraiswapV3Types } from '../sdk'

const senderAddress = 'orai1g4h64yjt0fvzv5v2j8tyfnpe5kmnetejvfgs7g'
const bobAddress = 'orai1602dkqjvh4s7ryajnz2uwhr8vetrwr8nekpxv5'

const client = new SimulateCosmWasmClient({
  chainId: 'Oraichain',
  bech32Prefix: 'orai'
})

const createTokens = async (...args: string[]) => {
  let symbols = args.slice(0, -1)
  const amount = args[symbols.length]
  // init airi token
  const list = await Promise.all(
    symbols.map(symbol =>
      oraidexArtifacts.deployContract(
        client,
        senderAddress,

        {
          mint: {
            minter: senderAddress
          },
          decimals: 6,
          symbol,
          name: symbol,
          initial_balances: [{ address: senderAddress, amount }]
        } as OraiswapTokenTypes.InstantiateMsg,
        'token',
        'oraiswap_token'
      )
    )
  )

  // sorted by contract address
  return list
    .map(res => res.contractAddress)
    .sort()
    .map(address => new OraiswapTokenClient(client, senderAddress, address))
}

describe('swap', () => {
  // decimals: 12 + scale 3 = e9
  let protocol_fee = Number(OraiswapV3Wasm.toPercentage(6, 3))

  let dex: OraiswapV3Client

  beforeEach(async () => {
    const { codeId: dexCodeId } = await client.upload(
      senderAddress,
      fs.readFileSync(path.resolve(__dirname, 'testdata', 'oraiswap-v3.wasm')),
      'auto'
    )

    dex = new OraiswapV3Client(
      client,
      senderAddress,
      (
        await client.instantiate(
          senderAddress,
          dexCodeId,
          { protocol_fee } as OraiswapV3Types.InstantiateMsg,
          'oraiswap_v3',
          'auto'
        )
      ).contractAddress
    )
  })

  it('test_swap_x_to_y', async () => {
    let feeTier: OraiswapV3Types.FeeTier = { fee: protocol_fee, tick_spacing: 10 }
    let res = await dex.addFeeTier({ feeTier })
    console.log(res)
    let initTick = 0

    let initSqrtPrice = OraiswapV3Wasm.calculateSqrtPrice(initTick)

    let initialAmount = (1e10).toString()
    let [tokenX, tokenY] = await createTokens('tokenx', 'tokeny', initialAmount)

    res = await dex.createPool({
      feeTier,
      initSqrtPrice,
      initTick,
      token0: tokenX.contractAddress,
      token1: tokenY.contractAddress
    })

    await tokenX.increaseAllowance({ amount: initialAmount, spender: dex.contractAddress })
    await tokenY.increaseAllowance({ amount: initialAmount, spender: dex.contractAddress })

    let poolKey: OraiswapV3Types.PoolKey = {
      fee_tier: feeTier,
      token_x: tokenX.contractAddress,
      token_y: tokenY.contractAddress
    }

    let lowerTickIndex = -20
    let middleTickIndex = -10
    let upperTickIndex = 10
    let liquidityDelta = (1000000e6).toString()

    // createPosition (add liquidity)
    await dex.createPosition({
      poolKey,
      lowerTick: lowerTickIndex,
      upperTick: upperTickIndex,
      liquidityDelta,
      slippageLimitLower: '0',
      slippageLimitUpper: '340282366920938463463374607431768211455'
    })

    // createPosition (add liquidity)
    await dex.createPosition({
      poolKey,
      lowerTick: lowerTickIndex - 20,
      upperTick: middleTickIndex,
      liquidityDelta,
      slippageLimitLower: '0',
      slippageLimitUpper: '340282366920938463463374607431768211455'
    })

    // get pool info
    let pool = await dex.pool({
      feeTier,
      token0: tokenX.contractAddress,
      token1: tokenY.contractAddress
    })
    expect(pool.liquidity).toEqual(liquidityDelta)
    let amount = 1000n
    let swapAmount: OraiswapV3Types.TokenAmount = amount.toString()
    await tokenX.mint({ amount: swapAmount, recipient: bobAddress })
    tokenX.sender = bobAddress
    await tokenX.increaseAllowance({ amount: swapAmount, spender: dex.contractAddress })

    let slippage = OraiswapV3Wasm.getGlobalMinSqrtPrice().toString()

    //simulate price from
    let { target_sqrt_price: targetSqrtPrice } = await dex.quote({
      amount: swapAmount,
      poolKey,
      sqrtPriceLimit: slippage,
      byAmountIn: true,
      xToY: true
    })

    let beforeDexX = BigInt((await tokenX.balance({ address: dex.contractAddress })).balance)
    let beforeDexY = BigInt((await tokenY.balance({ address: dex.contractAddress })).balance)

    dex.sender = bobAddress
    // swap
    await dex.swap({
      poolKey,
      amount: swapAmount,
      byAmountIn: true,
      sqrtPriceLimit: targetSqrtPrice,
      xToY: true
    })

    // Load states
    pool = await dex.pool({
      feeTier,
      token0: tokenX.contractAddress,
      token1: tokenY.contractAddress
    })
    let lowerTick = await dex.tick({ key: poolKey, index: lowerTickIndex })
    let middleTick = await dex.tick({ key: poolKey, index: middleTickIndex })
    let upperTick = await dex.tick({ key: poolKey, index: upperTickIndex })

    let lowerTickBit = await dex.isTickInitialized({ key: poolKey, index: lowerTickIndex })
    let middleTickBit = await dex.isTickInitialized({ key: poolKey, index: middleTickIndex })
    let upperTickBit = await dex.isTickInitialized({ key: poolKey, index: upperTickIndex })
    let bobX = BigInt((await tokenX.balance({ address: bobAddress })).balance)
    let bobY = BigInt((await tokenY.balance({ address: bobAddress })).balance)
    let dexX = BigInt((await tokenX.balance({ address: dex.contractAddress })).balance)
    let dexY = BigInt((await tokenY.balance({ address: dex.contractAddress })).balance)
    let deltaDexY = beforeDexY - dexY
    let deltaDexX = dexX - beforeDexX
    let expectedY = amount - 10n
    let expectedX = 0n
    // Check balances
    expect(bobX).toEqual(expectedX)
    expect(bobY).toEqual(expectedY)
    expect(deltaDexX).toEqual(amount)
    expect(deltaDexY).toEqual(expectedY)
    // Check Pool
    expect(pool.fee_growth_global_y).toEqual('0')
    expect(pool.fee_growth_global_x).toEqual('40000000000000000000000')
    expect(pool.fee_protocol_token_y).toEqual('0')
    expect(pool.fee_protocol_token_x).toEqual('2')
    // Check Ticks
    expect(lowerTick.liquidity_change).toEqual(liquidityDelta)
    expect(middleTick.liquidity_change).toEqual(liquidityDelta)
    expect(upperTick.liquidity_change).toEqual(liquidityDelta)
    expect(upperTick.fee_growth_outside_x).toEqual('0')
    expect(middleTick.fee_growth_outside_x).toEqual('30000000000000000000000')
    expect(lowerTick.fee_growth_outside_x).toEqual('0')
    expect(lowerTickBit).toBeTruthy()
    expect(middleTickBit).toBeTruthy()
    expect(upperTickBit).toBeTruthy()
  })

  it('test_swap_route', async () => {
    let initial_amount = (1e10).toString()

    let [token_x, token_y, token_z] = await createTokens(
      'tokenx',
      'tokeny',
      'tokenz',
      initial_amount
    )

    await token_x.increaseAllowance({
      amount: '18446744073709551615',
      spender: dex.contractAddress
    })
    await token_y.increaseAllowance({
      amount: '18446744073709551615',
      spender: dex.contractAddress
    })
    await token_z.increaseAllowance({
      amount: '18446744073709551615',
      spender: dex.contractAddress
    })

    let amount = 1000

    await token_x.mint({ amount: amount.toString(), recipient: bobAddress })
    token_x.sender = bobAddress
    await token_x.increaseAllowance({ amount: amount.toString(), spender: dex.contractAddress })
    token_y.sender = bobAddress
    await token_y.increaseAllowance({
      amount: '18446744073709551615',
      spender: dex.contractAddress
    })

    let feeTier: OraiswapV3Types.FeeTier = { fee: protocol_fee, tick_spacing: 1 }

    await dex.addFeeTier({ feeTier })

    let init_tick = 0
    let init_sqrt_price = OraiswapV3Wasm.calculateSqrtPrice(init_tick)

    await dex.createPool({
      feeTier,
      initSqrtPrice: init_sqrt_price.toString(),
      initTick: init_tick,
      token0: token_x.contractAddress,
      token1: token_y.contractAddress
    })

    await dex.createPool({
      feeTier,
      initSqrtPrice: init_sqrt_price.toString(),
      initTick: init_tick,
      token0: token_y.contractAddress,
      token1: token_z.contractAddress
    })

    let poolKey1 = OraiswapV3Wasm._newPoolKey(
      token_x.contractAddress,
      token_y.contractAddress,
      feeTier
    )
    let poolKey2 = OraiswapV3Wasm._newPoolKey(
      token_y.contractAddress,
      token_z.contractAddress,
      feeTier
    )

    let liquidity_delta = 2n ** 63n - 1n

    let pool_1 = await dex.pool({
      feeTier,
      token0: token_x.contractAddress,
      token1: token_y.contractAddress
    })

    let slippage_limit_lower = pool_1.sqrt_price
    let slippage_limit_upper = pool_1.sqrt_price

    await dex.createPosition({
      poolKey: poolKey1,
      lowerTick: -1,
      upperTick: 1,
      liquidityDelta: liquidity_delta.toString(),
      slippageLimitLower: slippage_limit_lower,
      slippageLimitUpper: slippage_limit_upper
    })

    let pool_2 = await dex.pool({
      feeTier,
      token0: token_y.contractAddress,
      token1: token_z.contractAddress
    })

    slippage_limit_lower = pool_2.sqrt_price
    slippage_limit_upper = pool_2.sqrt_price

    await dex.createPosition({
      poolKey: poolKey2,
      lowerTick: -1,
      upperTick: 1,
      liquidityDelta: liquidity_delta.toString(),
      slippageLimitLower: slippage_limit_lower,
      slippageLimitUpper: slippage_limit_upper
    })

    let amount_in = 1000n
    let slippage = 0n
    let swaps: OraiswapV3Types.SwapHop[] = [
      {
        pool_key: poolKey1,
        x_to_y: true
      },
      {
        pool_key: poolKey2,
        x_to_y: true
      }
    ]

    let expected_token_amount = await dex.quoteRoute({ amountIn: amount_in.toString(), swaps })

    dex.sender = bobAddress
    await dex.swapRoute({
      amountIn: amount_in.toString(),
      expectedAmountOut: expected_token_amount,
      slippage: Number(slippage),
      swaps
    })

    let bob_amount_x = (await token_x.balance({ address: bobAddress })).balance
    let bob_amount_y = (await token_y.balance({ address: bobAddress })).balance
    let bob_amount_z = (await token_z.balance({ address: bobAddress })).balance

    expect(bob_amount_x).toEqual('0')
    expect(bob_amount_y).toEqual('0')
    expect(bob_amount_z).toEqual('986')

    let pool_1_after = await dex.pool({
      token0: token_x.contractAddress,
      token1: token_y.contractAddress,
      feeTier
    })
    expect(pool_1_after.fee_protocol_token_x).toEqual('1')
    expect(pool_1_after.fee_protocol_token_y).toEqual('0')

    let pool_2_after = await dex.pool({
      token0: token_y.contractAddress,
      token1: token_z.contractAddress,
      feeTier
    })
    expect(pool_2_after.fee_protocol_token_x).toEqual('1')
    expect(pool_2_after.fee_protocol_token_y).toEqual('0')

    let alice_amount_x_before = Number((await token_x.balance({ address: senderAddress })).balance)
    let alice_amount_y_before = Number((await token_y.balance({ address: senderAddress })).balance)
    let alice_amount_z_before = Number((await token_z.balance({ address: senderAddress })).balance)

    dex.sender = senderAddress
    await dex.claimFee({ index: 0 })
    await dex.claimFee({ index: 1 })

    let alice_amount_x_after = Number((await token_x.balance({ address: senderAddress })).balance)
    let alice_amount_y_after = Number((await token_y.balance({ address: senderAddress })).balance)
    let alice_amount_z_after = Number((await token_z.balance({ address: senderAddress })).balance)

    expect(alice_amount_x_after - alice_amount_x_before).toEqual(4)
    expect(alice_amount_y_after - alice_amount_y_before).toEqual(4)
    expect(alice_amount_z_after - alice_amount_z_before).toEqual(0)
  })
})
