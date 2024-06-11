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

const createToken = async (symbol: string, amount: string) => {
  // init airi token
  const res = await oraidexArtifacts.deployContract(
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
  return new OraiswapTokenClient(client, senderAddress, res.contractAddress)
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
    let tokenX = await createToken('tokenx', initialAmount)
    let tokenY = await createToken('tokeny', initialAmount)

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

    await dex.createPosition({
      poolKey,
      lowerTick: lowerTickIndex,
      upperTick: upperTickIndex,
      liquidityDelta,
      slippageLimitLower: '0',
      slippageLimitUpper: '340282366920938463463374607431768211455'
    })

    await dex.createPosition({
      poolKey,
      lowerTick: lowerTickIndex - 20,
      upperTick: middleTickIndex,
      liquidityDelta,
      slippageLimitLower: '0',
      slippageLimitUpper: '340282366920938463463374607431768211455'
    })

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
})
