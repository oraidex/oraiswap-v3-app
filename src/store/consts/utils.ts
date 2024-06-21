import { PlotTickData } from '@store/reducers/positions';
import SingletonOraiswapV3 from '@store/services/contractSingleton';
import axios from 'axios';

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
  newFeeTier,
  alignTickToSpacing,
  calculateFee as wasmCalculateFee,
  calculateAmountDelta,
  AmountDeltaResult,
  getMaxTickmapQuerySize,
  getLiquidityTicksLimit,
  getTickAtSqrtPrice,
  Liquidity,
  Percentage,
  Pool,
  PoolKey,
  FeeTier,
  // Position,
  SqrtPrice,
  TokenAmount,
  positionToTick,
  SwapError,
  getGlobalMaxSqrtPrice,
  getGlobalMinSqrtPrice,
  Tick,
  Position,
  LiquidityTick,
  TokenAmounts
} from '@wasm';
import { Token, TokenPriceData } from './static';
import { PoolWithPoolKey } from '@/sdk/OraiswapV3.types';

export const parse = (value: any) => {
  if (isArray(value)) {
    return value.map((element: any) => parse(element));
  }

  if (isObject(value)) {
    const newValue: { [key: string]: any } = {};

    Object.entries(value as { [key: string]: any }).forEach(([key, value]) => {
      newValue[key] = parse(value);
    });

    return newValue;
  }

  if (isBoolean(value) || isNumber(value)) {
    return value;
  }

  try {
    return BigInt(value);
  } catch (e) {
    return value;
  }
};

const isBoolean = (value: any): boolean => {
  return typeof value === 'boolean';
};

const isNumber = (value: any): boolean => {
  return typeof value === 'number';
};

const isArray = (value: any): boolean => {
  return Array.isArray(value);
};

const isObject = (value: any): boolean => {
  return typeof value === 'object' && value !== null;
};

export const calculateFeeTierWithLinearRatio = (tickCount: number): FeeTier => {
  return newFeeTier(tickCount * Number(toPercentage(1, 4)), tickCount);
};

// export const FEE_TIERS: FeeTier[] = [
//   calculateFeeTierWithLinearRatio(1),
//   calculateFeeTierWithLinearRatio(2),
//   calculateFeeTierWithLinearRatio(5),
//   calculateFeeTierWithLinearRatio(10),
//   calculateFeeTierWithLinearRatio(30),
//   calculateFeeTierWithLinearRatio(100)
// ]

export const MAX_SQRT_PRICE = getGlobalMaxSqrtPrice();
export const MIN_SQRT_PRICE = getGlobalMinSqrtPrice();
export const MAX_TICKMAP_QUERY_SIZE = getMaxTickmapQuerySize();
export const LIQUIDITY_TICKS_LIMIT = getLiquidityTicksLimit();
export const PERCENTAGE_SCALE = Number(getPercentageScale());
export const PERCENTAGE_DENOMINATOR = getPercentageDenominator();
export const CHUNK_SIZE = getChunkSize();
export const PRICE_SCALE = Number(getPriceScale());
export const MAX_REF_TIME = 259058343000;
export const DEFAULT_REF_TIME = 1250000000000;
export const DEFAULT_PROOF_SIZE = 1250000000000;
export const CONCENTRATION_FACTOR = 1.00001526069123;

export const createLoaderKey = () => (new Date().getMilliseconds() + Math.random()).toString();

export interface PrefixConfig {
  B?: number;
  M?: number;
  K?: number;
}

const defaultPrefixConfig: PrefixConfig = {
  B: 1000000000,
  M: 1000000,
  K: 10000
};

export const showPrefix = (nr: number, config: PrefixConfig = defaultPrefixConfig): string => {
  const abs = Math.abs(nr);

  if (typeof config.B !== 'undefined' && abs >= config.B) {
    return 'B';
  }

  if (typeof config.M !== 'undefined' && abs >= config.M) {
    return 'M';
  }

  if (typeof config.K !== 'undefined' && abs >= config.K) {
    return 'K';
  }

  return '';
};

export interface FormatNumberThreshold {
  value: number;
  decimals: number;
  divider?: number;
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
];

export const formatNumbers =
  (thresholds: FormatNumberThreshold[] = defaultThresholds) =>
  (value: string) => {
    const num = Number(value);
    const abs = Math.abs(num);
    const threshold = thresholds.sort((a, b) => a.value - b.value).find(thr => abs < thr.value);

    const formatted = threshold
      ? (abs / (threshold.divider ?? 1)).toFixed(threshold.decimals)
      : value;

    return num < 0 && threshold ? '-' + formatted : formatted;
  };

export const trimZeros = (numStr: string): string => {
  return numStr
    .replace(/(\.\d*?)0+$/, '$1')
    .replace(/^0+(\d)|(\d)0+$/gm, '$1$2')
    .replace(/\.$/, '');
};

export const calculateFee = (
  pool: Pool,
  position: Position,
  lowerTick: Tick,
  upperTick: Tick
): TokenAmounts => {
  return wasmCalculateFee(
    lowerTick.index,
    BigInt(lowerTick.fee_growth_outside_x),
    BigInt(lowerTick.fee_growth_outside_y),
    upperTick.index,
    BigInt(upperTick.fee_growth_outside_x),
    BigInt(upperTick.fee_growth_outside_y),
    pool.current_tick_index,
    BigInt(pool.fee_growth_global_x),
    BigInt(pool.fee_growth_global_y),
    BigInt(position.fee_growth_inside_x),
    BigInt(position.fee_growth_inside_y),
    BigInt(position.liquidity)
  );
};

export const calcYPerXPriceByTickIndex = (
  tickIndex: number,
  xDecimal: number,
  yDecimal: number
): number => {
  const sqrt = +printBigint(calculateSqrtPrice(tickIndex), PRICE_SCALE);

  const proportion = sqrt * sqrt;

  return proportion / 10 ** (yDecimal - xDecimal);
};
export const calcYPerXPriceBySqrtPrice = (
  sqrtPrice: bigint,
  xDecimal: number,
  yDecimal: number
): number => {
  const sqrt = +printBigint(sqrtPrice, PRICE_SCALE);

  const proportion = sqrt * sqrt;

  return proportion / 10 ** (yDecimal - xDecimal);
};

export const trimLeadingZeros = (amount: string): string => {
  const amountParts = amount.split('.');

  if (!amountParts.length) {
    return '0';
  }

  if (amountParts.length === 1) {
    return amountParts[0];
  }

  const reversedDec = Array.from(amountParts[1]).reverse();
  const firstNonZero = reversedDec.findIndex(char => char !== '0');

  if (firstNonZero === -1) {
    return amountParts[0];
  }

  const trimmed = reversedDec.slice(firstNonZero, reversedDec.length).reverse().join('');

  return `${amountParts[0]}.${trimmed}`;
};

export const getScaleFromString = (value: string): number => {
  const parts = value.split('.');

  if ((parts?.length ?? 0) < 2) {
    return 0;
  }

  return parts[1]?.length ?? 0;
};

export const toMaxNumericPlaces = (num: number, places: number): string => {
  const log = Math.floor(Math.log10(num));

  if (log >= places) {
    return num.toFixed(0);
  }

  if (log >= 0) {
    return num.toFixed(places - log - 1);
  }

  return num.toFixed(places + Math.abs(log) - 1);
};

export const calcPrice = (
  amountTickIndex: number,
  isXtoY: boolean,
  xDecimal: number,
  yDecimal: number
): number => {
  const price = calcYPerXPriceByTickIndex(amountTickIndex, xDecimal, yDecimal);

  return isXtoY ? price : 1 / price;
};

export const createPlaceholderLiquidityPlot = (
  isXtoY: boolean,
  yValueToFill: number,
  tickSpacing: number,
  tokenXDecimal: number,
  tokenYDecimal: number
) => {
  const ticksData: PlotTickData[] = [];

  const min = getMinTick(tickSpacing);
  const max = getMaxTick(tickSpacing);

  const minPrice = calcPrice(min, isXtoY, tokenXDecimal, tokenYDecimal);

  ticksData.push({
    x: minPrice,
    y: yValueToFill,
    index: min
  });

  const maxPrice = calcPrice(max, isXtoY, tokenXDecimal, tokenYDecimal);

  ticksData.push({
    x: maxPrice,
    y: yValueToFill,
    index: max
  });

  return isXtoY ? ticksData : ticksData.reverse();
};

export const calculateTokenAmounts = (pool: Pool, position: Position): AmountDeltaResult => {
  return _calculateTokenAmounts(pool, position, false);
};

export const _calculateTokenAmounts = (
  pool: Pool,
  position: Position,
  sign: boolean
): AmountDeltaResult => {
  return calculateAmountDelta(
    pool.current_tick_index,
    BigInt(pool.sqrt_price),
    BigInt(position.liquidity),
    sign,
    position.upper_tick_index,
    position.lower_tick_index
  );
};

export interface CoingeckoPriceData {
  price: number;
  priceChange?: number;
}
export interface CoingeckoApiPriceData {
  id: string;
  current_price: number;
  price_change_percentage_24h: number;
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
      };
    });
};

export const getCoingeckoTokenPriceV2 = async (id: string): Promise<CoingeckoPriceData> => {
  return await axios
    .get<
      CoingeckoApiPriceData[]
    >(`https://price.market.orai.io/simple/price?vs_currencies=usd&ids=${id}`)
    .then(res => {
      console.log({ res });
      return {
        price: res.data[id]?.usd ?? 0
      };
    });
};

export const tokensPrices: Record<Network, Record<string, TokenPriceData>> = {
  ['Testnet']: {},
  ['Mainnet']: {
    ORAI_TEST: { price: 16.5 },
    USDT_TEST: { price: 1 },
    TOKEN1_TEST: { price: 2 },
    TOKEN2_TEST: { price: 2 }
  },
  ['Local']: {}
};

export const getMockedTokenPrice = (symbol: string, network: Network): TokenPriceData => {
  const sufix = network === 'Testnet' ? '_TEST' : '_MAIN';
  const prices = tokensPrices[network];
  switch (symbol) {
    case 'ORAI':
      return prices[symbol + sufix];
    case 'USDT':
      return prices['W' + symbol + sufix];
    case 'USDC':
      return prices[symbol + sufix];
    case 'BTC':
      return prices[symbol + sufix];
    case 'OCH':
      return prices[symbol + sufix];
    default:
      return { price: 0 };
  }
};

export const printBigint = (amount: TokenAmount, decimals: number): string => {
  const amountString = amount.toString();
  const isNegative = amountString.length > 0 && amountString[0] === '-';

  const balanceString = isNegative ? amountString.slice(1) : amountString;

  if (balanceString.length <= decimals) {
    return (
      (isNegative ? '-' : '') + '0.' + '0'.repeat(decimals - balanceString.length) + balanceString
    );
  } else {
    return (
      (isNegative ? '-' : '') +
      trimZeros(
        balanceString.substring(0, balanceString.length - decimals) +
          '.' +
          balanceString.substring(balanceString.length - decimals)
      )
    );
  }
};

export const newPrintBigInt = (amount: bigint, decimals: bigint): string => {
  const parsedDecimals = Number(decimals);
  const amountString = amount.toString();
  const isNegative = amountString.length > 0 && amountString[0] === '-';

  const balanceString = isNegative ? amountString.slice(1) : amountString;

  if (balanceString.length <= parsedDecimals) {
    const diff = parsedDecimals - balanceString.length;

    return (
      (isNegative ? '-' : '') +
      trimZeros('0.' + (diff > 3 ? '0' + printSubNumber(diff) : '0'.repeat(diff)) + balanceString)
    );
  } else {
    return (
      (isNegative ? '-' : '') +
      trimZeros(
        balanceString.substring(0, balanceString.length - parsedDecimals) +
          '.' +
          balanceString.substring(balanceString.length - parsedDecimals)
      )
    );
  }
};

const subNumbers = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];

export const printSubNumber = (amount: number): string => {
  return String(Array.from(amount.toString()).map(char => subNumbers[+char]));
};

export const parseFeeToPathFee = (fee: bigint): string => {
  const parsedFee = (fee / BigInt(Math.pow(10, 8))).toString().padStart(3, '0');
  return parsedFee.slice(0, parsedFee.length - 2) + '_' + parsedFee.slice(parsedFee.length - 2);
};

export const getPoolsByPoolKeys = async (poolKeys: PoolKey[]): Promise<PoolWithPoolKey[]> => {
  const promises = poolKeys.map(({ token_x, token_y, fee_tier }) =>
    SingletonOraiswapV3.dex.pool({ token0: token_x, token1: token_y, feeTier: fee_tier })
  );
  const pools = await Promise.all(promises);

  return pools.map((pool, index) => {
    const poolWithPoolKey: PoolWithPoolKey = {
      pool,
      pool_key: poolKeys[index]
    };
    return poolWithPoolKey;
  });
};

export type TokenDataOnChain = {
  symbol: string;
  address: string;
  name: string;
  decimals: number;
  balance: bigint;
};

export const getTokenDataByAddresses = async (tokens: string[]): Promise<Record<string, Token>> => {
  const tokenInfos: TokenDataOnChain[] = await SingletonOraiswapV3.getTokensInfo(tokens);

  const newTokens: Record<string, Token> = {};
  tokenInfos.forEach(token => {
    newTokens[token.address] = {
      symbol: token.symbol ? (token.symbol as string) : 'UNKNOWN',
      address: token.address,
      name: token.name ? (token.name as string) : '',
      decimals: token.decimals,
      balance: token.balance,
      logoURI: '/unknownToken.svg',
      isUnknown: true
    };
  });
  return newTokens;
};

export const createPoolTx = async (poolKey: PoolKey, initSqrtPrice: string): Promise<string> => {
  const initTick = getTickAtSqrtPrice(BigInt(initSqrtPrice), poolKey.fee_tier.tick_spacing);

  return (
    await SingletonOraiswapV3.dex.createPool({
      feeTier: poolKey.fee_tier,
      initSqrtPrice,
      initTick,
      token0: poolKey.token_x,
      token1: poolKey.token_y
    })
  ).transactionHash;
};

export const createPositionTx = async (
  poolKey: PoolKey,
  lowerTick: number,
  upperTick: number,
  liquidityDelta: bigint,
  spotSqrtPrice: bigint,
  slippageTolerance: bigint
): Promise<string> => {
  const slippageLimitLower = calculateSqrtPriceAfterSlippage(
    spotSqrtPrice,
    Number(slippageTolerance),
    false
  );
  const slippageLimitUpper = calculateSqrtPriceAfterSlippage(
    spotSqrtPrice,
    Number(slippageTolerance),
    true
  );

  const res = await SingletonOraiswapV3.dex.createPosition({
    poolKey,
    lowerTick: Number(lowerTick),
    upperTick: Number(upperTick),
    liquidityDelta: liquidityDelta.toString(),
    slippageLimitLower: slippageLimitLower.toString(),
    slippageLimitUpper: slippageLimitUpper.toString()
  });

  return res.transactionHash;
};

export const getPool = async (poolKey: PoolKey): Promise<PoolWithPoolKey> => {
  console.log('getPool here', poolKey);
  const pool = await SingletonOraiswapV3.getPool(poolKey);
  return {
    pool,
    pool_key: poolKey
  };
};

export const getPoolKeys = async (): Promise<PoolKey[]> => {
  try {
    const pools = await SingletonOraiswapV3.getPools();
    const poolKeys: PoolKey[] = pools.map(pool => pool.pool_key);
    console.log('poolKeys', poolKeys);
    return poolKeys;
  } catch {
    return [];
  }
};

export const poolKeyToString = (poolKey: PoolKey): string => {
  return (
    poolKey.token_x +
    '-' +
    poolKey.token_y +
    '-' +
    poolKey.fee_tier.fee +
    '-' +
    poolKey.fee_tier.tick_spacing
  );
};

export const getTokenBalances = async (tokens: string[]) => {
  const tokenBalances = await Promise.all(
    tokens.map(async token => {
      if (token !== 'orai') {
        if (!SingletonOraiswapV3.dex) {
          return { address: token, balance: 0n };
        }
        SingletonOraiswapV3.loadCw20(SingletonOraiswapV3.dex.sender, token);
        const { balance } = await SingletonOraiswapV3.tokens[token].balance({
          address: SingletonOraiswapV3.dex.sender
        });
        return { address: token, balance: BigInt(balance) };
      } else {
        const balance = await SingletonOraiswapV3.queryBalance(
          SingletonOraiswapV3.dex.sender,
          token
        );
        return { address: token, balance: BigInt(balance) };
      }
    })
  );

  return tokenBalances;
};

export const getPrimaryUnitsPrice = (
  price: number,
  isXtoY: boolean,
  xDecimal: number,
  yDecimal: number
) => {
  const xToYPrice = isXtoY ? price : 1 / price;

  return xToYPrice * 10 ** (yDecimal - xDecimal);
};

export const logBase = (x: number, b: number): number => Math.log(x) / Math.log(b);

export const adjustToSpacing = (baseTick: number, spacing: number, isGreater: boolean): number => {
  const remainder = baseTick % spacing;

  if (Math.abs(remainder) === 0) {
    return baseTick;
  }

  let adjustment: number;
  if (isGreater) {
    if (baseTick >= 0) {
      adjustment = spacing - remainder;
    } else {
      adjustment = Math.abs(remainder);
    }
  } else {
    if (baseTick >= 0) {
      adjustment = -remainder;
    } else {
      adjustment = -(spacing - Math.abs(remainder));
    }
  }

  return baseTick + adjustment;
};

export const spacingMultiplicityLte = (arg: number, spacing: number): number => {
  return adjustToSpacing(arg, spacing, false);
};

export const spacingMultiplicityGte = (arg: number, spacing: number): number => {
  return adjustToSpacing(arg, spacing, true);
};

export const nearestSpacingMultiplicity = (centerTick: number, spacing: number) => {
  const greaterTick = spacingMultiplicityGte(centerTick, spacing);
  const lowerTick = spacingMultiplicityLte(centerTick, spacing);

  const nearestTick =
    Math.abs(greaterTick - centerTick) < Math.abs(lowerTick - centerTick) ? greaterTick : lowerTick;

  return Math.max(Math.min(nearestTick, Number(getMaxTick(spacing))), Number(getMinTick(spacing)));
};

export const getTickAtSqrtPriceFromBalance = (
  price: number,
  spacing: number,
  isXtoY: boolean,
  xDecimal: number,
  yDecimal: number
) => {
  const minTick = getMinTick(spacing);
  const maxTick = getMaxTick(spacing);

  const basePrice = Math.max(
    price,
    Number(calcPrice(isXtoY ? minTick : maxTick, isXtoY, xDecimal, yDecimal))
  );
  const primaryUnitsPrice = getPrimaryUnitsPrice(
    basePrice,
    isXtoY,
    Number(xDecimal),
    Number(yDecimal)
  );
  const tick = Math.round(logBase(primaryUnitsPrice, 1.0001));

  return Math.max(Math.min(tick, Number(getMaxTick(spacing))), Number(getMinTick(spacing)));
};

export const nearestTickIndex = (
  price: number,
  spacing: number,
  isXtoY: boolean,
  xDecimal: number,
  yDecimal: number
) => {
  const tick = getTickAtSqrtPriceFromBalance(price, spacing, isXtoY, xDecimal, yDecimal);

  return nearestSpacingMultiplicity(tick, spacing);
};

export const getConcentrationArray = (
  tickSpacing: number,
  minimumRange: number,
  currentTick: number
): number[] => {
  const concentrations: number[] = [];
  let counter = 0;
  let concentration = 0;
  let lastConcentration = calculateConcentration(tickSpacing, minimumRange, counter) + 1;
  let concentrationDelta = 1;

  while (concentrationDelta >= 1) {
    concentration = calculateConcentration(tickSpacing, minimumRange, counter);
    concentrations.push(concentration);
    concentrationDelta = lastConcentration - concentration;
    lastConcentration = concentration;
    counter++;
  }
  concentration = Math.ceil(concentrations[concentrations.length - 1]);

  while (concentration > 1) {
    concentrations.push(concentration);
    concentration--;
  }
  const maxTick = alignTickToSpacing(getMaxTick(1), tickSpacing);
  if ((minimumRange / 2) * tickSpacing > maxTick - Math.abs(currentTick)) {
    throw new Error(String(SwapError.TickLimitReached));
  }
  const limitIndex =
    (maxTick - Math.abs(currentTick) - (minimumRange / 2) * tickSpacing) / tickSpacing;

  return concentrations.slice(0, limitIndex);
};

export const convertBalanceToBigint = (amount: string, decimals: bigint | number): bigint => {
  const balanceString = amount.split('.');
  if (balanceString.length !== 2) {
    return BigInt(balanceString[0] + '0'.repeat(Number(decimals)));
  }

  if (balanceString[1].length <= decimals) {
    return BigInt(
      balanceString[0] + balanceString[1] + '0'.repeat(Number(decimals) - balanceString[1].length)
    );
  }
  return 0n;
};

export enum PositionTokenBlock {
  None,
  A,
  B
}

export const determinePositionTokenBlock = (
  currentSqrtPrice: bigint,
  lowerTick: number,
  upperTick: number,
  isXtoY: boolean
) => {
  const lowerPrice = calculateSqrtPrice(lowerTick);
  const upperPrice = calculateSqrtPrice(upperTick);

  const isBelowLowerPrice = lowerPrice >= currentSqrtPrice;
  const isAboveUpperPrice = upperPrice <= currentSqrtPrice;

  if (isBelowLowerPrice) {
    return isXtoY ? PositionTokenBlock.B : PositionTokenBlock.A;
  }
  if (isAboveUpperPrice) {
    return isXtoY ? PositionTokenBlock.A : PositionTokenBlock.B;
  }

  return PositionTokenBlock.None;
};

export const findPairs = (tokenFrom: string, tokenTo: string, pairs: PoolWithPoolKey[]) => {
  return pairs.filter(
    pool =>
      (tokenFrom === pool.pool_key.token_x && tokenTo === pool.pool_key.token_y) ||
      (tokenFrom === pool.pool_key.token_y && tokenTo === pool.pool_key.token_x)
  );
};

export const findPairsByPoolKeys = (tokenFrom: string, tokenTo: string, poolKeys: PoolKey[]) => {
  return poolKeys.filter(
    poolKey =>
      (tokenFrom === poolKey.token_x && tokenTo === poolKey.token_y) ||
      (tokenFrom === poolKey.token_y && tokenTo === poolKey.token_x)
  );
};

export type SimulateResult = {
  poolKey: PoolKey | null;
  amountOut: bigint;
  priceImpact: number;
  targetSqrtPrice: bigint;
  errors: SwapError[];
};

export const getPools = async (poolKeys: PoolKey[]): Promise<PoolWithPoolKey[]> => {
  const pools = await SingletonOraiswapV3.dex.pools({});

  return pools.map((pool, index) => {
    return { ...pool, poolKey: poolKeys[index] };
  });
};

export const getFullTickmap = async (poolKey: PoolKey): Promise<Tickmap> => {
  console.log('getFullTickmap', poolKey);
  const tickmap = await SingletonOraiswapV3.getFullTickmap(poolKey);
  console.log('tickmap', tickmap);
  return tickmap;
};

export const getAllLiquidityTicks = async (
  poolKey: PoolKey,
  tickmap: Tickmap
): Promise<LiquidityTick[]> => {
  const ticks: number[] = [];

  for (const [chunkIndex, chunk] of tickmap.bitmap.entries()) {
    for (let i = 0; i < 64; i++) {
      if ((chunk & (1n << BigInt(i))) != 0n) {
        const tickIndex = positionToTick(Number(chunkIndex), i, poolKey.fee_tier.tick_spacing);
        ticks.push(Number(tickIndex.toString()));
      }
    }
  }

  const liquidityTicks = await SingletonOraiswapV3.dex.liquidityTicks({
    poolKey,
    tickIndexes: ticks
  });
  console.log({ liquidityTicks });
  const convertedLiquidityTicks: LiquidityTick[] = liquidityTicks.map((tickData: any) => {
    return {
      index: tickData.index,
      liquidity_change: BigInt(tickData.liquidity_change),
      sign: tickData.sign
    };
  });

  return convertedLiquidityTicks;
};

export const getTickAtSqrtPriceDelta = (
  tickSpacing: number,
  minimumRange: number,
  concentration: number
) => {
  const base = Math.pow(1.0001, -(tickSpacing / 4));
  const logArg =
    (1 - 1 / (concentration * CONCENTRATION_FACTOR)) /
    Math.pow(1.0001, (-tickSpacing * minimumRange) / 4);

  return Math.ceil(Math.log(logArg) / Math.log(base) / 2);
};

export const calculateConcentration = (tickSpacing: number, minimumRange: number, n: number) => {
  const concentration = 1 / (1 - Math.pow(1.0001, (-tickSpacing * (minimumRange + 2 * n)) / 4));
  return concentration / CONCENTRATION_FACTOR;
};

export const calculateConcentrationRange = (
  tickSpacing: number,
  concentration: number,
  minimumRange: number,
  currentTick: number,
  isXToY: boolean
) => {
  const tickDelta = getTickAtSqrtPriceDelta(tickSpacing, minimumRange, concentration);
  const lowerTick = currentTick - (minimumRange / 2 + tickDelta) * tickSpacing;
  const upperTick = currentTick + (minimumRange / 2 + tickDelta) * tickSpacing;

  return {
    leftRange: isXToY ? lowerTick : upperTick,
    rightRange: isXToY ? upperTick : lowerTick
  };
};

export const calcTicksAmountInRange = (
  min: number,
  max: number,
  tickSpacing: number,
  isXtoY: boolean,
  xDecimal: number,
  yDecimal: number
): number => {
  const primaryUnitsMin = getPrimaryUnitsPrice(min, isXtoY, xDecimal, yDecimal);
  const primaryUnitsMax = getPrimaryUnitsPrice(max, isXtoY, xDecimal, yDecimal);
  const minIndex = logBase(primaryUnitsMin, 1.0001);
  const maxIndex = logBase(primaryUnitsMax, 1.0001);

  return Math.ceil(Math.abs(maxIndex - minIndex) / tickSpacing);
};

export const getAllTicks = async (poolKey: PoolKey, ticks: bigint[]): Promise<Tick[]> => {
  const tickDatas = await Promise.all(
    ticks.map(async tick => {
      const tickData = await SingletonOraiswapV3.dex.tick({ key: poolKey, index: Number(tick) });
      const convertedTick: Tick = {
        fee_growth_outside_x: BigInt(tickData.fee_growth_outside_x),
        fee_growth_outside_y: BigInt(tickData.fee_growth_outside_y),
        index: tickData.index,
        liquidity_change: BigInt(tickData.liquidity_change),
        sign: tickData.sign,
        liquidity_gross: BigInt(tickData.liquidity_gross),
        seconds_outside: tickData.seconds_outside,
        sqrt_price: BigInt(tickData.sqrt_price)
      };
      return convertedTick;
    })
  );

  return tickDatas;
};

export const deserializeTickmap = (serializedTickmap: string): Tickmap => {
  const deserializedMap: Map<string, string> = new Map(JSON.parse(serializedTickmap));

  const parsedMap = new Map();
  for (const [key, value] of deserializedMap) {
    parsedMap.set(BigInt(key), BigInt(value));
  }

  return { bitmap: parsedMap };
};

export const calculateAmountInWithSlippage = (
  amountOut: bigint,
  sqrtPriceLimit: bigint,
  xToY: boolean
): bigint => {
  const price = +printBigint(sqrtPriceToPrice(sqrtPriceLimit), PRICE_SCALE);
  const amountIn = xToY ? Number(amountOut) * price : Number(amountOut) / price;

  return BigInt(Math.ceil(amountIn));
};

export const sqrtPriceToPrice = (sqrtPrice: SqrtPrice | bigint): bigint => {
  return (BigInt(sqrtPrice) * BigInt(sqrtPrice)) / getSqrtPriceDenominator();
};

export interface LiquidityBreakpoint {
  liquidity: Liquidity;
  index: bigint;
}

export const getTick = async (ind: bigint, poolKey: PoolKey): Promise<Tick> => {
  const tickData = await SingletonOraiswapV3.dex.tick({ key: poolKey, index: Number(ind) });
  const convertedTick: Tick = {
    fee_growth_outside_x: BigInt(tickData.fee_growth_outside_x),
    fee_growth_outside_y: BigInt(tickData.fee_growth_outside_y),
    index: tickData.index,
    liquidity_change: BigInt(tickData.liquidity_change),
    sign: tickData.sign,
    liquidity_gross: BigInt(tickData.liquidity_gross),
    seconds_outside: tickData.seconds_outside,
    sqrt_price: BigInt(tickData.sqrt_price)
  };
  return convertedTick;
};

export const calculateLiquidityBreakpoints = (
  ticks: (Tick | LiquidityTick)[]
): LiquidityBreakpoint[] => {
  let currentLiquidity = 0n;

  return ticks.map(tick => {
    currentLiquidity = currentLiquidity + BigInt(tick.liquidity_change) * (tick.sign ? 1n : -1n);
    return {
      liquidity: currentLiquidity,
      index: BigInt(tick.index)
    };
  });
};

export const createLiquidityPlot = (
  rawTicks: LiquidityTick[],
  tickSpacing: number,
  isXtoY: boolean,
  tokenXDecimal: number,
  tokenYDecimal: number
): PlotTickData[] => {
  const sortedTicks = rawTicks.sort((a, b) => Number(a.index - b.index));
  const parsedTicks = rawTicks.length ? calculateLiquidityBreakpoints(sortedTicks) : [];

  const ticks = rawTicks.map((raw, index) => ({
    ...raw,
    liqudity: parsedTicks[index].liquidity
  }));

  const ticksData: PlotTickData[] = [];

  const min = getMinTick(tickSpacing);
  const max = getMaxTick(tickSpacing);

  if (!ticks.length || ticks[0].index > min) {
    const minPrice = calcPrice(min, isXtoY, tokenXDecimal, tokenYDecimal);

    ticksData.push({
      x: minPrice,
      y: 0,
      index: min
    });
  }

  ticks.forEach((tick, i) => {
    const tickIndex = tick.index;
    if (i === 0 && tickIndex - tickSpacing > min) {
      const price = calcPrice(tickIndex - tickSpacing, isXtoY, tokenXDecimal, tokenYDecimal);
      ticksData.push({
        x: price,
        y: 0,
        index: tickIndex - tickSpacing
      });
    } else if (i > 0 && tickIndex - tickSpacing > ticks[i - 1].index) {
      const price = calcPrice(tickIndex - tickSpacing, isXtoY, tokenXDecimal, tokenYDecimal);
      ticksData.push({
        x: price,
        y: +printBigint(ticks[i - 1].liqudity, 12), // TODO use constant
        index: tickIndex - tickSpacing
      });
    }

    const price = calcPrice(tickIndex, isXtoY, tokenXDecimal, tokenYDecimal);
    ticksData.push({
      x: price,
      y: +printBigint(ticks[i].liqudity, 12), // TODO use constant
      index: tickIndex
    });
  });
  const lastTick = ticks[ticks.length - 1].index;
  if (!ticks.length) {
    const maxPrice = calcPrice(max, isXtoY, tokenXDecimal, tokenYDecimal);

    ticksData.push({
      x: maxPrice,
      y: 0,
      index: max
    });
  } else if (lastTick < max) {
    if (max - lastTick > tickSpacing) {
      const price = calcPrice(lastTick + tickSpacing, isXtoY, tokenXDecimal, tokenYDecimal);
      ticksData.push({
        x: price,
        y: 0,
        index: lastTick + tickSpacing
      });
    }

    const maxPrice = calcPrice(max, isXtoY, tokenXDecimal, tokenYDecimal);

    ticksData.push({
      x: maxPrice,
      y: 0,
      index: max
    });
  }

  return isXtoY ? ticksData : ticksData.reverse();
};

const sqrt = (value: bigint): bigint => {
  if (value < 0n) {
    throw 'square root of negative numbers is not supported';
  }

  if (value < 2n) {
    return value;
  }

  return newtonIteration(value, 1n);
};

const newtonIteration = (n: bigint, x0: bigint): bigint => {
  const x1 = (n / x0 + x0) >> 1n;
  if (x0 === x1 || x0 === x1 - 1n) {
    return x0;
  }
  return newtonIteration(n, x1);
};

export const priceToSqrtPrice = (price: bigint): bigint => {
  return sqrt(price * getSqrtPriceDenominator());
};

export const calculateSqrtPriceAfterSlippage = (
  sqrtPrice: SqrtPrice,
  slippage: Percentage,
  up: boolean
): bigint => {
  if (slippage === 0) {
    return BigInt(sqrtPrice);
  }

  const multiplier = getPercentageDenominator() + BigInt(up ? slippage : -slippage);
  const price = sqrtPriceToPrice(sqrtPrice);
  const priceWithSlippage = BigInt(price) * multiplier * getPercentageDenominator();
  const sqrtPriceWithSlippage = priceToSqrtPrice(priceWithSlippage) / getPercentageDenominator();

  return sqrtPriceWithSlippage;
};

export const calculateTokenAmountsWithSlippage = (
  tickSpacing: number,
  currentSqrtPrice: SqrtPrice,
  liquidity: Liquidity,
  lowerTickIndex: number,
  upperTickIndex: number,
  slippage: Percentage,
  roundingUp: boolean
): [bigint, bigint] => {
  const lowerBound = calculateSqrtPriceAfterSlippage(currentSqrtPrice, slippage, false);
  const upperBound = calculateSqrtPriceAfterSlippage(currentSqrtPrice, slippage, true);

  const currentTickIndex = getTickAtSqrtPrice(currentSqrtPrice, tickSpacing);

  const { x: lowerX, y: lowerY } = calculateAmountDelta(
    currentTickIndex,
    lowerBound,
    liquidity,
    roundingUp,
    upperTickIndex,
    lowerTickIndex
  );

  const { x: upperX, y: upperY } = calculateAmountDelta(
    currentTickIndex,
    upperBound,
    liquidity,
    roundingUp,
    upperTickIndex,
    lowerTickIndex
  );

  const x = lowerX > upperX ? lowerX : upperX;
  const y = lowerY > upperY ? lowerY : upperY;
  return [x, y];
};

export const calculatePriceImpact = (
  startingSqrtPrice: bigint,
  endingSqrtPrice: bigint
): bigint => {
  const startingPrice = startingSqrtPrice * startingSqrtPrice;
  const endingPrice = endingSqrtPrice * endingSqrtPrice;
  const diff = startingPrice - endingPrice;

  const nominator = diff > 0n ? diff : -diff;
  const denominator = startingPrice > endingPrice ? startingPrice : endingPrice;

  return (nominator * getPercentageDenominator()) / denominator;
};

/**
 * export interface Position {
    pool_key: PoolKey;
    liquidity: Liquidity;
    lower_tick_index: number;
    upper_tick_index: number;
    fee_growth_inside_x: FeeGrowth;
    fee_growth_inside_y: FeeGrowth;
    last_block_number: number;
    tokens_owed_x: TokenAmount;
    tokens_owed_y: TokenAmount;
}
 */
export const getPosition = async (index: bigint, ownerId: string): Promise<Position> => {
  const position = await SingletonOraiswapV3.dex.position({ index: Number(index), ownerId });
  const convertedPosition: Position = {
    pool_key: position.pool_key,
    liquidity: BigInt(position.liquidity),
    lower_tick_index: position.lower_tick_index,
    upper_tick_index: position.upper_tick_index,
    fee_growth_inside_x: BigInt(position.fee_growth_inside_x),
    fee_growth_inside_y: BigInt(position.fee_growth_inside_y),
    last_block_number: position.last_block_number,
    tokens_owed_x: BigInt(position.tokens_owed_x),
    tokens_owed_y: BigInt(position.tokens_owed_y)
  };
  return convertedPosition;
};

export const positionList = async (ownerId: string): Promise<Position[]> => {
  const positions = await SingletonOraiswapV3.dex.positions({ ownerId });
  return positions.map(position => ({
    pool_key: position.pool_key,
    liquidity: BigInt(position.liquidity),
    lower_tick_index: position.lower_tick_index,
    upper_tick_index: position.upper_tick_index,
    fee_growth_inside_x: BigInt(position.fee_growth_inside_x),
    fee_growth_inside_y: BigInt(position.fee_growth_inside_y),
    last_block_number: position.last_block_number,
    tokens_owed_x: BigInt(position.tokens_owed_x),
    tokens_owed_y: BigInt(position.tokens_owed_y)
  }));
};

export const approveToken = async (token: string, amount: bigint): Promise<string> => {
  const result = await SingletonOraiswapV3.approveToken(token, amount);
  return result.transactionHash;
};

export const swapWithSlippageTx = async (
  poolKey: PoolKey,
  xToY: boolean,
  amount: bigint,
  byAmountIn: boolean,
  estimatedSqrtPrice: bigint,
  slippage: Percentage
): Promise<string> => {
  const sqrtPriceAfterSlippage = calculateSqrtPriceAfterSlippage(
    estimatedSqrtPrice,
    slippage,
    !xToY
  );

  const res = await SingletonOraiswapV3.dex.swap({
    poolKey,
    xToY,
    amount: amount.toString(),
    byAmountIn,
    sqrtPriceLimit: sqrtPriceAfterSlippage.toString()
  });

  return res.transactionHash;
};

export const claimFee = async (positionIndex: bigint): Promise<string> => {
  const res = await SingletonOraiswapV3.dex.claimFee({ index: Number(positionIndex) });
  return res.transactionHash;
};

export const removePosition = async (positionIndex: bigint): Promise<string> => {
  const res = await SingletonOraiswapV3.dex.removePosition({ index: Number(positionIndex) });
  return res.transactionHash;
};

export const getBalance = async (address: string): Promise<bigint> => {
  // TODO: open for ibc later
  const balance = await SingletonOraiswapV3.queryBalance(address, 'orai');
  return BigInt(balance);
};
