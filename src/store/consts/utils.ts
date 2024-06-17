import { PlotTickData } from '@store/reducers/positions'
import SingletonOraiswapV3, { integerSafeCast } from '@store/services/contractSingleton'
import axios from 'axios'

import {
  Tickmap,
  calculateSqrtPrice,
  getChunkSize,
  getMaxTick,
  getMinTick,
  getPercentageDenominator,
  getPercentageScale,
  getPriceScale,
  toPercentage,
  getSqrtPriceDenominator,
  _newFeeTier,
  // positionToTick,
  alignTickToSpacing,
  _calculateFee,
  calculateAmountDelta,
  calculateAmountDeltaResult,
  _newPoolKey,
  getMaxTickmapQuerySize,
  getLiquidityTicksLimit,
  calculateTick,
  Liquidity,
  LiquidityTick,
  Percentage,
  Pool,
  PoolKey,
  FeeTier,
  Position,
  SqrtPrice,
  TokenAmount,
  positionToTick,
  SwapError,
  getGlobalMaxSqrtPrice,
  getGlobalMinSqrtPrice,
  CalculateSwapResult,
  simulateSwap
} from '@wasm'
import { Token, TokenPriceData } from './static'
import { PoolWithPoolKey, Tick } from '@/sdk/OraiswapV3.types'

export enum Network {
  Local = 'Local',
  Testnet = 'Testnet',
  Mainnet = 'Mainnet'
}

export const parse = (value: any) => {
  if (isArray(value)) {
    return value.map((element: any) => parse(element))
  }

  if (isObject(value)) {
    const newValue: { [key: string]: any } = {}

    Object.entries(value as { [key: string]: any }).forEach(([key, value]) => {
      newValue[key] = parse(value)
    })

    return newValue
  }

  if (isBoolean(value) || isNumber(value)) {
    return value
  }

  try {
    return BigInt(value)
  } catch (e) {
    return value
  }
}

const isBoolean = (value: any): boolean => {
  return typeof value === 'boolean'
}

const isNumber = (value: any): boolean => {
  return typeof value === 'number'
}

const isArray = (value: any): boolean => {
  return Array.isArray(value)
}

const isObject = (value: any): boolean => {
  return typeof value === 'object' && value !== null
}

export const newPoolKey = (token0: string, token1: string, feeTier: FeeTier): PoolKey => {
  return _newPoolKey(token0, token1, _newFeeTier(feeTier.fee, feeTier.tick_spacing))
}

export const calculateFeeTierWithLinearRatio = (tickCount: number): FeeTier => {
  return _newFeeTier(tickCount * Number(toPercentage(1, 4)), tickCount)
}

export const FEE_TIERS: FeeTier[] = [
  calculateFeeTierWithLinearRatio(1),
  calculateFeeTierWithLinearRatio(2),
  calculateFeeTierWithLinearRatio(5),
  calculateFeeTierWithLinearRatio(10),
  calculateFeeTierWithLinearRatio(30),
  calculateFeeTierWithLinearRatio(100)
]

export const MAX_SQRT_PRICE = getGlobalMaxSqrtPrice()
export const MIN_SQRT_PRICE = getGlobalMinSqrtPrice()
export const MAX_TICKMAP_QUERY_SIZE = getMaxTickmapQuerySize()
export const LIQUIDITY_TICKS_LIMIT = getLiquidityTicksLimit()
export const PERCENTAGE_SCALE = getPercentageScale()
export const PERCENTAGE_DENOMINATOR = getPercentageDenominator()
export const CHUNK_SIZE = getChunkSize()
export const PRICE_SCALE = getPriceScale()
export const MAX_REF_TIME = 259058343000
export const DEFAULT_REF_TIME = 1250000000000
export const DEFAULT_PROOF_SIZE = 1250000000000
export const CONCENTRATION_FACTOR = 1.00001526069123

export const createLoaderKey = () => (new Date().getMilliseconds() + Math.random()).toString()

export interface PrefixConfig {
  B?: number
  M?: number
  K?: number
}

const defaultPrefixConfig: PrefixConfig = {
  B: 1000000000,
  M: 1000000,
  K: 10000
}

export const showPrefix = (nr: number, config: PrefixConfig = defaultPrefixConfig): string => {
  const abs = Math.abs(nr)

  if (typeof config.B !== 'undefined' && abs >= config.B) {
    return 'B'
  }

  if (typeof config.M !== 'undefined' && abs >= config.M) {
    return 'M'
  }

  if (typeof config.K !== 'undefined' && abs >= config.K) {
    return 'K'
  }

  return ''
}

export interface FormatNumberThreshold {
  value: number
  decimals: number
  divider?: number
}

export const defaultThresholds: FormatNumberThreshold[] = [
  {
    value: 10,
    decimals: 4
  },
  {
    value: 1000,
    decimals: 2
  },
  {
    value: 10000,
    decimals: 1
  },
  {
    value: 1000000,
    decimals: 2,
    divider: 1000
  },
  {
    value: 1000000000,
    decimals: 2,
    divider: 1000000
  },
  {
    value: Infinity,
    decimals: 2,
    divider: 1000000000
  }
]

export const formatNumbers =
  (thresholds: FormatNumberThreshold[] = defaultThresholds) =>
  (value: string) => {
    const num = Number(value)
    const abs = Math.abs(num)
    const threshold = thresholds.sort((a, b) => a.value - b.value).find(thr => abs < thr.value)

    const formatted = threshold
      ? (abs / (threshold.divider ?? 1)).toFixed(threshold.decimals)
      : value

    return num < 0 && threshold ? '-' + formatted : formatted
  }

export const trimZeros = (numStr: string): string => {
  return numStr
    .replace(/(\.\d*?)0+$/, '$1')
    .replace(/^0+(\d)|(\d)0+$/gm, '$1$2')
    .replace(/\.$/, '')
}

export const calculateFee = (
  pool: Pool,
  position: Position,
  lowerTick: Tick,
  upperTick: Tick
): [TokenAmount, TokenAmount] => {
  return _calculateFee(
    lowerTick.index,
    lowerTick.fee_growth_outside_x,
    lowerTick.fee_growth_outside_y,
    upperTick.index,
    upperTick.fee_growth_outside_x,
    upperTick.fee_growth_outside_y,
    pool.current_tick_index,
    pool.fee_growth_global_x,
    pool.fee_growth_global_y,
    position.fee_growth_inside_x,
    position.fee_growth_inside_y,
    position.liquidity
  )
}

export const calcYPerXPriceByTickIndex = (
  tickIndex: bigint | number,
  xDecimal: bigint,
  yDecimal: bigint
): number => {
  const sqrt = +printBigint(calculateSqrtPrice(tickIndex), PRICE_SCALE)

  const proportion = sqrt * sqrt

  return proportion / 10 ** Number(yDecimal - xDecimal)
}
export const calcYPerXPriceBySqrtPrice = (
  sqrtPrice: bigint,
  xDecimal: bigint,
  yDecimal: bigint
): number => {
  const sqrt = +printBigint(sqrtPrice, PRICE_SCALE)

  const proportion = sqrt * sqrt

  return proportion / 10 ** Number(yDecimal - xDecimal)
}

export const trimLeadingZeros = (amount: string): string => {
  const amountParts = amount.split('.')

  if (!amountParts.length) {
    return '0'
  }

  if (amountParts.length === 1) {
    return amountParts[0]
  }

  const reversedDec = Array.from(amountParts[1]).reverse()
  const firstNonZero = reversedDec.findIndex(char => char !== '0')

  if (firstNonZero === -1) {
    return amountParts[0]
  }

  const trimmed = reversedDec.slice(firstNonZero, reversedDec.length).reverse().join('')

  return `${amountParts[0]}.${trimmed}`
}

export const getScaleFromString = (value: string): number => {
  const parts = value.split('.')

  if ((parts?.length ?? 0) < 2) {
    return 0
  }

  return parts[1]?.length ?? 0
}

export const toMaxNumericPlaces = (num: number, places: number): string => {
  const log = Math.floor(Math.log10(num))

  if (log >= places) {
    return num.toFixed(0)
  }

  if (log >= 0) {
    return num.toFixed(places - log - 1)
  }

  return num.toFixed(places + Math.abs(log) - 1)
}

export const calcPrice = (
  amountTickIndex: bigint,
  isXtoY: boolean,
  xDecimal: bigint,
  yDecimal: bigint
): number => {
  const price = calcYPerXPriceByTickIndex(amountTickIndex, xDecimal, yDecimal)

  return isXtoY ? price : 1 / price
}

export const createPlaceholderLiquidityPlot = (
  isXtoY: boolean,
  yValueToFill: number,
  tickSpacing: bigint,
  tokenXDecimal: bigint,
  tokenYDecimal: bigint
) => {
  const ticksData: PlotTickData[] = []

  const min = getMinTick(tickSpacing)
  const max = getMaxTick(tickSpacing)

  const minPrice = calcPrice(min, isXtoY, tokenXDecimal, tokenYDecimal)

  ticksData.push({
    x: minPrice,
    y: yValueToFill,
    index: min
  })

  const maxPrice = calcPrice(max, isXtoY, tokenXDecimal, tokenYDecimal)

  ticksData.push({
    x: maxPrice,
    y: yValueToFill,
    index: max
  })

  return isXtoY ? ticksData : ticksData.reverse()
}

export const calculateTokenAmounts = (
  pool: Pool,
  position: Position
): calculateAmountDeltaResult => {
  return _calculateTokenAmounts(pool, position, false)
}

export const _calculateTokenAmounts = (
  pool: Pool,
  position: Position,
  sign: boolean
): calculateAmountDeltaResult => {
  console.log({
    current_tick_index: pool.current_tick_index,
    sqrt_price: pool.sqrt_price,
    liquidity: position.liquidity,
    sign,
    upper_tick_index: position.upper_tick_index,
    lower_tick_index: position.lower_tick_index
  })

  return calculateAmountDelta(
    pool.current_tick_index,
    pool.sqrt_price,
    position.liquidity,
    sign,
    position.upper_tick_index,
    position.lower_tick_index
  )
}

export interface CoingeckoPriceData {
  price: number
  priceChange: number
}
export interface CoingeckoApiPriceData {
  id: string
  current_price: number
  price_change_percentage_24h: number
}

export const getCoingeckoTokenPrice = async (id: string): Promise<CoingeckoPriceData> => {
  return await axios
    .get<
      CoingeckoApiPriceData[]
    >(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${id}`)
    .then(res => {
      return {
        price: res.data[0]?.current_price ?? 0,
        priceChange: res.data[0]?.price_change_percentage_24h ?? 0
      }
    })
}

export const tokensPrices: Record<Network, Record<string, TokenPriceData>> = {
  [Network.Testnet]: {
    ORAI_TEST: { price: 16.5 },
    USDT_TEST: { price: 1 },
    TOKEN1_TEST: { price: 2 },
    TOKEN2_TEST: { price: 2 }
  },
  [Network.Mainnet]: {},
  [Network.Local]: {}
}

export const getMockedTokenPrice = (symbol: string, network: Network): TokenPriceData => {
  const sufix = network === Network.Testnet ? '_TEST' : '_DEV'
  const prices = tokensPrices[network]
  switch (symbol) {
    case 'ORAI':
      return prices[symbol + sufix]
    case 'USDT':
      return prices['W' + symbol + sufix]
    case 'TOKEN1':
      return prices[symbol + sufix]
    case 'TOKEN2':
      return prices[symbol + sufix]
    default:
      return { price: 0 }
  }
}

export const printBigint = (amount: TokenAmount | bigint, decimals: bigint): string => {
  const parsedDecimals = Number(decimals)
  const amountString = amount.toString()
  const isNegative = amountString.length > 0 && amountString[0] === '-'

  const balanceString = isNegative ? amountString.slice(1) : amountString

  if (balanceString.length <= parsedDecimals) {
    return (
      (isNegative ? '-' : '') +
      '0.' +
      '0'.repeat(parsedDecimals - balanceString.length) +
      balanceString
    )
  } else {
    return (
      (isNegative ? '-' : '') +
      trimZeros(
        balanceString.substring(0, balanceString.length - parsedDecimals) +
          '.' +
          balanceString.substring(balanceString.length - parsedDecimals)
      )
    )
  }
}

export const newPrintBigInt = (amount: bigint, decimals: bigint): string => {
  const parsedDecimals = Number(decimals)
  const amountString = amount.toString()
  const isNegative = amountString.length > 0 && amountString[0] === '-'

  const balanceString = isNegative ? amountString.slice(1) : amountString

  if (balanceString.length <= parsedDecimals) {
    const diff = parsedDecimals - balanceString.length

    return (
      (isNegative ? '-' : '') +
      trimZeros('0.' + (diff > 3 ? '0' + printSubNumber(diff) : '0'.repeat(diff)) + balanceString)
    )
  } else {
    return (
      (isNegative ? '-' : '') +
      trimZeros(
        balanceString.substring(0, balanceString.length - parsedDecimals) +
          '.' +
          balanceString.substring(balanceString.length - parsedDecimals)
      )
    )
  }
}

const subNumbers = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉']

export const printSubNumber = (amount: number): string => {
  return String(Array.from(amount.toString()).map(char => subNumbers[+char]))
}

export const parseFeeToPathFee = (fee: bigint): string => {
  const parsedFee = (fee / BigInt(Math.pow(10, 8))).toString().padStart(3, '0')
  return parsedFee.slice(0, parsedFee.length - 2) + '_' + parsedFee.slice(parsedFee.length - 2)
}

export const getPoolsByPoolKeys = async (poolKeys: PoolKey[]): Promise<PoolWithPoolKey[]> => {
  const promises = poolKeys.map(({ token_x, token_y, fee_tier }) =>
    SingletonOraiswapV3.dex.pool({ token0: token_x, token1: token_y, feeTier: fee_tier })
  )
  const pools = await Promise.all(promises)

  return pools.map((pool, index) => {
    const poolWithPoolKey: PoolWithPoolKey = {
      pool,
      pool_key: poolKeys[index]
    }
    return poolWithPoolKey
  })
}

export type TokenDataOnChain = {
  symbol: string
  address: string
  name: string
  decimals: bigint
  balance: bigint
}

export const getTokenDataByAddresses = async (tokens: string[]): Promise<Record<string, Token>> => {
  const tokenInfos: TokenDataOnChain[] = await SingletonOraiswapV3.getTokensInfo(tokens)

  const newTokens: Record<string, Token> = {}
  tokenInfos.forEach(token => {
    newTokens[token.address] = {
      symbol: token.symbol ? (token.symbol as string) : 'UNKNOWN',
      address: token.address,
      name: token.name ? (token.name as string) : '',
      decimals: token.decimals as bigint,
      balance: token.balance as bigint,
      logoURI: '/unknownToken.svg',
      isUnknown: true
    }
  })
  return newTokens
}

export const createPoolTx = async (
  poolKey: PoolKey,
  initSqrtPrice: string,
  initTick: number
): Promise<string> => {
  return (
    await SingletonOraiswapV3.dex.createPool({
      feeTier: poolKey.fee_tier,
      initSqrtPrice,
      initTick,
      token0: poolKey.token_x,
      token1: poolKey.token_y
    })
  ).transactionHash
}

export const getPool = async (poolKey: PoolKey): Promise<PoolWithPoolKey> => {
  return {
    pool: await SingletonOraiswapV3.dex.pool({
      token0: poolKey.token_x,
      token1: poolKey.token_y,
      feeTier: poolKey.fee_tier
    }),
    pool_key: poolKey
  }
}

export const getPoolKeys = async (): Promise<PoolKey[]> => {
  const pools = await SingletonOraiswapV3.dex.pools({})
  const poolKeys: PoolKey[] = pools.map(pool => pool.pool_key)
  console.log('poolKeys', poolKeys)
  return poolKeys
  // return pools.map((pool, index) => ({
  //   pool,
  //   pool_key: poolKeys[index]
  // }))
}

export const poolKeyToString = (poolKey: PoolKey): string => {
  return (
    poolKey.token_x +
    '-' +
    poolKey.token_y +
    '-' +
    poolKey.fee_tier.fee +
    '-' +
    poolKey.fee_tier.tick_spacing
  )
}

export const getTokenBalances = async (tokens: string[]) => {
  const results = await Promise.all(
    tokens.map(token => {
      if (token !== 'orai') {
        SingletonOraiswapV3.loadCw20(SingletonOraiswapV3.dex.sender, token)
        return SingletonOraiswapV3.tokens[token].balance({
          address: SingletonOraiswapV3.dex.sender
        })
      } else {
        return SingletonOraiswapV3.queryBalance(token)
      }
    })
  )
  const tokenBalances: [string, bigint][] = []
  tokens.map((token, index) => {
    tokenBalances.push([token, BigInt(results[index]?.balance || results[index])])
  })
  return tokenBalances
}

export const getPrimaryUnitsPrice = (
  price: number,
  isXtoY: boolean,
  xDecimal: number,
  yDecimal: number
) => {
  const xToYPrice = isXtoY ? price : 1 / price

  return xToYPrice * 10 ** (yDecimal - xDecimal)
}

export const logBase = (x: number, b: number): number => Math.log(x) / Math.log(b)

export const adjustToSpacing = (baseTick: number, spacing: number, isGreater: boolean): number => {
  const remainder = baseTick % spacing

  if (Math.abs(remainder) === 0) {
    return baseTick
  }

  let adjustment: number
  if (isGreater) {
    if (baseTick >= 0) {
      adjustment = spacing - remainder
    } else {
      adjustment = Math.abs(remainder)
    }
  } else {
    if (baseTick >= 0) {
      adjustment = -remainder
    } else {
      adjustment = -(spacing - Math.abs(remainder))
    }
  }

  return baseTick + adjustment
}

export const spacingMultiplicityLte = (arg: number, spacing: number): number => {
  return adjustToSpacing(arg, spacing, false)
}

export const spacingMultiplicityGte = (arg: number, spacing: number): number => {
  return adjustToSpacing(arg, spacing, true)
}

export const nearestSpacingMultiplicity = (centerTick: number, spacing: number) => {
  const greaterTick = spacingMultiplicityGte(centerTick, spacing)
  const lowerTick = spacingMultiplicityLte(centerTick, spacing)

  const nearestTick =
    Math.abs(greaterTick - centerTick) < Math.abs(lowerTick - centerTick) ? greaterTick : lowerTick

  return Math.max(
    Math.min(nearestTick, Number(getMaxTick(BigInt(spacing)))),
    Number(getMinTick(BigInt(spacing)))
  )
}

export const calculateTickFromBalance = (
  price: number,
  spacing: bigint,
  isXtoY: boolean,
  xDecimal: bigint,
  yDecimal: bigint
) => {
  const minTick = getMinTick(spacing)
  const maxTick = getMaxTick(spacing)

  const basePrice = Math.max(
    price,
    Number(calcPrice(isXtoY ? minTick : maxTick, isXtoY, xDecimal, yDecimal))
  )
  const primaryUnitsPrice = getPrimaryUnitsPrice(
    basePrice,
    isXtoY,
    Number(xDecimal),
    Number(yDecimal)
  )
  const tick = Math.round(logBase(primaryUnitsPrice, 1.0001))

  return Math.max(
    Math.min(tick, Number(getMaxTick(BigInt(spacing)))),
    Number(getMinTick(BigInt(spacing)))
  )
}

export const nearestTickIndex = (
  price: number,
  spacing: bigint,
  isXtoY: boolean,
  xDecimal: bigint,
  yDecimal: bigint
) => {
  const tick = calculateTickFromBalance(price, spacing, isXtoY, xDecimal, yDecimal)

  return BigInt(nearestSpacingMultiplicity(tick, Number(spacing)))
}

export const getConcentrationArray = (
  tickSpacing: number,
  minimumRange: number,
  currentTick: number
): number[] => {
  const concentrations: number[] = []
  let counter = 0
  let concentration = 0
  let lastConcentration = calculateConcentration(tickSpacing, minimumRange, counter) + 1
  let concentrationDelta = 1

  while (concentrationDelta >= 1) {
    concentration = calculateConcentration(tickSpacing, minimumRange, counter)
    concentrations.push(concentration)
    concentrationDelta = lastConcentration - concentration
    lastConcentration = concentration
    counter++
  }
  concentration = Math.ceil(concentrations[concentrations.length - 1])

  while (concentration > 1) {
    concentrations.push(concentration)
    concentration--
  }
  const maxTick = integerSafeCast(alignTickToSpacing(getMaxTick(1n), tickSpacing))
  if ((minimumRange / 2) * tickSpacing > maxTick - Math.abs(currentTick)) {
    throw new Error(String(SwapError.TickLimitReached))
  }
  const limitIndex =
    (maxTick - Math.abs(currentTick) - (minimumRange / 2) * tickSpacing) / tickSpacing

  return concentrations.slice(0, limitIndex)
}

export const convertBalanceToBigint = (amount: string, decimals: bigint | number): bigint => {
  const balanceString = amount.split('.')
  if (balanceString.length !== 2) {
    return BigInt(balanceString[0] + '0'.repeat(Number(decimals)))
  }

  if (balanceString[1].length <= decimals) {
    return BigInt(
      balanceString[0] + balanceString[1] + '0'.repeat(Number(decimals) - balanceString[1].length)
    )
  }
  return 0n
}

export enum PositionTokenBlock {
  None,
  A,
  B
}

export const determinePositionTokenBlock = (
  currentSqrtPrice: bigint,
  lowerTick: bigint,
  upperTick: bigint,
  isXtoY: boolean
) => {
  const lowerPrice = calculateSqrtPrice(lowerTick)
  const upperPrice = calculateSqrtPrice(upperTick)

  const isBelowLowerPrice = lowerPrice >= currentSqrtPrice
  const isAboveUpperPrice = upperPrice <= currentSqrtPrice

  if (isBelowLowerPrice) {
    return isXtoY ? PositionTokenBlock.B : PositionTokenBlock.A
  }
  if (isAboveUpperPrice) {
    return isXtoY ? PositionTokenBlock.A : PositionTokenBlock.B
  }

  return PositionTokenBlock.None
}

export const findPairs = (tokenFrom: string, tokenTo: string, pairs: PoolWithPoolKey[]) => {
  return pairs.filter(
    pool =>
      (tokenFrom === pool.pool_key.token_x && tokenTo === pool.pool_key.token_y) ||
      (tokenFrom === pool.pool_key.token_y && tokenTo === pool.pool_key.token_x)
  )
}

export const findPairsByPoolKeys = (tokenFrom: string, tokenTo: string, poolKeys: PoolKey[]) => {
  return poolKeys.filter(
    poolKey =>
      (tokenFrom === poolKey.token_x && tokenTo === poolKey.token_y) ||
      (tokenFrom === poolKey.token_y && tokenTo === poolKey.token_x)
  )
}

export type SimulateResult = {
  poolKey: PoolKey | null
  amountOut: bigint
  priceImpact: number
  targetSqrtPrice: bigint
  errors: SwapError[]
}

export const getPools = async (poolKeys: PoolKey[]): Promise<PoolWithPoolKey[]> => {
  const pools = await SingletonOraiswapV3.dex.pools({})

  return pools.map((pool, index) => {
    return { ...pool, poolKey: poolKeys[index] }
  })
}

export const getFullTickmap = async (poolKey: PoolKey): Promise<Tickmap> => {
  console.log('getFullTickmap', poolKey)
  const tickmap = await SingletonOraiswapV3.getFullTickmap(poolKey)
  console.log('tickmap', tickmap)
  return tickmap
}

export const getAllLiquidityTicks = async (
  poolKey: PoolKey,
  tickmap: Tickmap
): Promise<LiquidityTick[]> => {
  const ticks: number[] = []

  tickmap.bitmap.forEach((chunk, chunkIndex) => {
    console.log({ chunkIndex, chunk })
    for (let i = 0; i < 64; i++) {
      console.log(chunk, Number(chunk) & (1 << i))
      if ((Number(chunk) & (1 << i)) !== 0) {
        console.log({ chunkIndex, i, tickSpacing: 1 })
        console.log('posToTick', positionToTick(chunkIndex, i, 1))
        const tickIndex = positionToTick(chunkIndex, i, 1)
        ticks.push(Number(tickIndex.toString()))
      }
    }
  })

  return SingletonOraiswapV3.dex.liquidityTicks({ poolKey, tickIndexes: ticks })
}

export const calculateTickDelta = (
  tickSpacing: number,
  minimumRange: number,
  concentration: number
) => {
  const base = Math.pow(1.0001, -(tickSpacing / 4))
  const logArg =
    (1 - 1 / (concentration * CONCENTRATION_FACTOR)) /
    Math.pow(1.0001, (-tickSpacing * minimumRange) / 4)

  return Math.ceil(Math.log(logArg) / Math.log(base) / 2)
}

export const calculateConcentration = (tickSpacing: number, minimumRange: number, n: number) => {
  const concentration = 1 / (1 - Math.pow(1.0001, (-tickSpacing * (minimumRange + 2 * n)) / 4))
  return concentration / CONCENTRATION_FACTOR
}

export const calculateConcentrationRange = (
  tickSpacing: bigint,
  concentration: number,
  minimumRange: number,
  currentTick: bigint,
  isXToY: boolean
) => {
  const parsedTickSpacing = Number(tickSpacing)
  const parsedCurrentTick = Number(currentTick)
  const tickDelta = calculateTickDelta(parsedTickSpacing, minimumRange, concentration)
  const lowerTick = parsedCurrentTick - (minimumRange / 2 + tickDelta) * parsedTickSpacing
  const upperTick = parsedCurrentTick + (minimumRange / 2 + tickDelta) * parsedTickSpacing

  return {
    leftRange: BigInt(isXToY ? lowerTick : upperTick),
    rightRange: BigInt(isXToY ? upperTick : lowerTick)
  }
}

export const calcTicksAmountInRange = (
  min: number,
  max: number,
  tickSpacing: number,
  isXtoY: boolean,
  xDecimal: number,
  yDecimal: number
): number => {
  const primaryUnitsMin = getPrimaryUnitsPrice(min, isXtoY, xDecimal, yDecimal)
  const primaryUnitsMax = getPrimaryUnitsPrice(max, isXtoY, xDecimal, yDecimal)
  const minIndex = logBase(primaryUnitsMin, 1.0001)
  const maxIndex = logBase(primaryUnitsMax, 1.0001)

  return Math.ceil(Math.abs(maxIndex - minIndex) / tickSpacing)
}

export const getAllTicks = (poolKey: PoolKey, ticks: bigint[]): Promise<Tick[]> => {
  const promises: Promise<Tick>[] = []

  for (const tick of ticks) {
    promises.push(SingletonOraiswapV3.dex.tick({ key: poolKey, index: Number(tick) }))
  }

  return Promise.all(promises)
}

// export const tickmapToArray = (tickmap: Tickmap, tickSpacing: bigint): bigint[] => {
//   const ticks = []

//   for (const [chunkIndex, chunk] of tickmap.bitmap.entries()) {
//     for (let bit = 0n; bit < CHUNK_SIZE; bit++) {
//       const checkedBit = chunk & (1n << bit)
//       if (checkedBit) {
//         ticks.push(positionToTick(chunkIndex, bit, tickSpacing))
//       }
//     }
//   }

//   return ticks
// }

export const deserializeTickmap = (serializedTickmap: string): Tickmap => {
  const deserializedMap: Map<string, string> = new Map(JSON.parse(serializedTickmap))

  const parsedMap = new Map()
  for (const [key, value] of deserializedMap) {
    parsedMap.set(BigInt(key), BigInt(value))
  }

  return { bitmap: parsedMap }
}

export const calculateAmountInWithSlippage = (
  amountOut: bigint,
  sqrtPriceLimit: bigint,
  xToY: boolean
): bigint => {
  const price = +printBigint(sqrtPriceToPrice(sqrtPriceLimit), PRICE_SCALE)
  const amountIn = xToY ? Number(amountOut) * price : Number(amountOut) / price

  return BigInt(Math.ceil(amountIn))
}

export const sqrtPriceToPrice = (sqrtPrice: SqrtPrice | bigint): bigint => {
  return (BigInt(sqrtPrice) * BigInt(sqrtPrice)) / getSqrtPriceDenominator()
}

export interface LiquidityBreakpoint {
  liquidity: Liquidity
  index: bigint
}

export const getTick = async (ind: bigint, poolKey: PoolKey): Promise<Tick> => {
  return await SingletonOraiswapV3.dex.tick({
    index: Number(ind),
    key: poolKey
  })
}

export const calculateLiquidityBreakpoints = (
  ticks: (Tick | LiquidityTick)[]
): LiquidityBreakpoint[] => {
  let currentLiquidity = 0n

  return ticks.map(tick => {
    currentLiquidity = currentLiquidity + BigInt(tick.liquidity_change) * (tick.sign ? 1n : -1n)
    return {
      liquidity: currentLiquidity.toString(),
      index: BigInt(tick.index)
    }
  })
}

export const createLiquidityPlot = (
  rawTicks: LiquidityTick[],
  tickSpacing: bigint,
  isXtoY: boolean,
  tokenXDecimal: bigint,
  tokenYDecimal: bigint
): PlotTickData[] => {
  const sortedTicks = rawTicks.sort((a, b) => Number(a.index - b.index))
  const parsedTicks = rawTicks.length ? calculateLiquidityBreakpoints(sortedTicks) : []

  const ticks = rawTicks.map((raw, index) => ({
    ...raw,
    liqudity: parsedTicks[index].liquidity
  }))

  const ticksData: PlotTickData[] = []

  const min = getMinTick(tickSpacing)
  const max = getMaxTick(tickSpacing)

  if (!ticks.length || ticks[0].index > min) {
    const minPrice = calcPrice(min, isXtoY, tokenXDecimal, tokenYDecimal)

    ticksData.push({
      x: minPrice,
      y: 0,
      index: min
    })
  }

  ticks.forEach((tick, i) => {
    const tickIndex = BigInt(tick.index)
    if (i === 0 && tickIndex - tickSpacing > min) {
      const price = calcPrice(tickIndex - tickSpacing, isXtoY, tokenXDecimal, tokenYDecimal)
      ticksData.push({
        x: price,
        y: 0,
        index: tickIndex - tickSpacing
      })
    } else if (i > 0 && tickIndex - tickSpacing > ticks[i - 1].index) {
      const price = calcPrice(tickIndex - tickSpacing, isXtoY, tokenXDecimal, tokenYDecimal)
      ticksData.push({
        x: price,
        y: +printBigint(ticks[i - 1].liqudity, 12n), // TODO use constant
        index: tickIndex - tickSpacing
      })
    }

    const price = calcPrice(tickIndex, isXtoY, tokenXDecimal, tokenYDecimal)
    ticksData.push({
      x: price,
      y: +printBigint(ticks[i].liqudity, 12n), // TODO use constant
      index: tickIndex
    })
  })
  const lastTick = BigInt(ticks[ticks.length - 1].index)
  if (!ticks.length) {
    const maxPrice = calcPrice(max, isXtoY, tokenXDecimal, tokenYDecimal)

    ticksData.push({
      x: maxPrice,
      y: 0,
      index: max
    })
  } else if (lastTick < max) {
    if (max - lastTick > tickSpacing) {
      const price = calcPrice(lastTick + tickSpacing, isXtoY, tokenXDecimal, tokenYDecimal)
      ticksData.push({
        x: price,
        y: 0,
        index: lastTick + tickSpacing
      })
    }

    const maxPrice = calcPrice(max, isXtoY, tokenXDecimal, tokenYDecimal)

    ticksData.push({
      x: maxPrice,
      y: 0,
      index: max
    })
  }

  return isXtoY ? ticksData : ticksData.reverse()
}

const sqrt = (value: bigint): bigint => {
  if (value < 0n) {
    throw 'square root of negative numbers is not supported'
  }

  if (value < 2n) {
    return value
  }

  return newtonIteration(value, 1n)
}

const newtonIteration = (n: bigint, x0: bigint): bigint => {
  const x1 = (n / x0 + x0) >> 1n
  if (x0 === x1 || x0 === x1 - 1n) {
    return x0
  }
  return newtonIteration(n, x1)
}

export const priceToSqrtPrice = (price: bigint): bigint => {
  return sqrt(price * getSqrtPriceDenominator())
}

export const calculateSqrtPriceAfterSlippage = (
  sqrtPrice: SqrtPrice,
  slippage: Percentage,
  up: boolean
): bigint => {
  if (slippage === 0) {
    return BigInt(sqrtPrice)
  }

  const multiplier = getPercentageDenominator() + BigInt(up ? slippage : -slippage)
  const price = sqrtPriceToPrice(sqrtPrice)
  const priceWithSlippage = BigInt(price) * multiplier * getPercentageDenominator()
  const sqrtPriceWithSlippage = priceToSqrtPrice(priceWithSlippage) / getPercentageDenominator()

  return sqrtPriceWithSlippage
}

export const calculateTokenAmountsWithSlippage = (
  tickSpacing: bigint,
  currentSqrtPrice: SqrtPrice,
  liquidity: Liquidity,
  lowerTickIndex: bigint,
  upperTickIndex: bigint,
  slippage: Percentage,
  roundingUp: boolean
): [bigint, bigint] => {
  const lowerBound = calculateSqrtPriceAfterSlippage(currentSqrtPrice, slippage, false)
  const upperBound = calculateSqrtPriceAfterSlippage(currentSqrtPrice, slippage, true)

  const currentTickIndex = calculateTick(currentSqrtPrice, tickSpacing)

  const [lowerX, lowerY] = calculateAmountDelta(
    currentTickIndex,
    lowerBound,
    liquidity,
    roundingUp,
    upperTickIndex,
    lowerTickIndex
  )

  const [upperX, upperY] = calculateAmountDelta(
    currentTickIndex,
    upperBound,
    liquidity,
    roundingUp,
    upperTickIndex,
    lowerTickIndex
  )

  const x = lowerX > upperX ? lowerX : upperX
  const y = lowerY > upperY ? lowerY : upperY
  return [x, y]
}

export const calculatePriceImpact = (
  startingSqrtPrice: bigint,
  endingSqrtPrice: bigint
): bigint => {
  const startingPrice = startingSqrtPrice * startingSqrtPrice
  const endingPrice = endingSqrtPrice * endingSqrtPrice
  const diff = startingPrice - endingPrice

  const nominator = diff > 0n ? diff : -diff
  const denominator = startingPrice > endingPrice ? startingPrice : endingPrice

  return (nominator * getPercentageDenominator()) / denominator
}
