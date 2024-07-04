import { CosmWasmClient, SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { OraiswapV3Client, OraiswapV3QueryClient } from '../../sdk';
import { OraiswapTokenClient, OraiswapTokenQueryClient } from '@oraichain/oraidex-contracts-sdk';
import {
  Tickmap,
  getMaxTick,
  getMinTick,
  PoolKey,
  LiquidityTick,
  positionToTick,
  calculateSqrtPrice,
} from '@wasm';
import {
  CHUNK_SIZE,
  LIQUIDITY_TICKS_LIMIT,
  MAX_TICKMAP_QUERY_SIZE,
  TokenDataOnChain,
  getCoingeckoTokenPriceV2,
  parse,
  poolKeyToString
  // parse
} from '@store/consts/utils';
import { ArrayOfTupleOfUint16AndUint64, PoolWithPoolKey } from '@/sdk/OraiswapV3.types';
import { defaultState } from '@store/reducers/connection';
import { FAUCET_LIST_TOKEN } from '@store/consts/static';

export const assert = (condition: boolean, message?: string) => {
  if (!condition) {
    throw new Error(message || 'assertion failed');
  }
};

export const integerSafeCast = (value: bigint): number => {
  if (value > BigInt(Number.MAX_SAFE_INTEGER) || value < BigInt(Number.MIN_SAFE_INTEGER)) {
    throw new Error('Integer value is outside the safe range for Numbers');
  }
  return Number(value);
};

export default class SingletonOraiswapV3 {
  private static _tokens: { [key: string]: OraiswapTokenClient } = {};
  private static _nativeTokens: { [key: string]: string } = {};
  private static _dex: OraiswapV3Client;
  private static _dexQuerier: OraiswapV3QueryClient;

  private constructor() {}

  public static get dex() {
    return this._dex;
  }

  public static get dexQuerier() {
    return this._dexQuerier;
  }

  public static get tokens() {
    return this._tokens;
  }

  public static get nativeTokens() {
    return this._nativeTokens;
  }

  public static async load(signingClient: SigningCosmWasmClient, sender: string) {
    if (!this.dex || defaultState.dexAddress !== this.dex.contractAddress) {
      this._dex = new OraiswapV3Client(signingClient, sender, defaultState.dexAddress);
    }
    const client = await CosmWasmClient.connect(import.meta.env.VITE_CHAIN_RPC_ENDPOINT);
    this._dexQuerier = new OraiswapV3QueryClient(client, defaultState.dexAddress);
  }

  public static async loadCw20(sender: string, contractAddress: string) {
    this._tokens[contractAddress] = new OraiswapTokenClient(
      this._dex.client,
      sender,
      contractAddress
    );
  }

  public static async loadNative(tokenDenom: string) {
    this._nativeTokens[tokenDenom] = tokenDenom;
  }

  public static async queryBalance(address: string, tokenDenom: string = 'orai') {
    if (!address) {
      return '0';
    }
    const client = await CosmWasmClient.connect(import.meta.env.VITE_CHAIN_RPC_ENDPOINT);
    const { amount } = await client.getBalance(address, tokenDenom);
    return amount;
  }

  public static async getRawTickmap(
    poolKey: PoolKey,
    lowerTick: number,
    upperTick: number,
    xToY: boolean
  ): Promise<ArrayOfTupleOfUint16AndUint64> {
    const client = await CosmWasmClient.connect(import.meta.env.VITE_CHAIN_RPC_ENDPOINT);
    const queryClient = new OraiswapV3QueryClient(client, defaultState.dexAddress);

    const tickmaps = await queryClient.tickMap({
      lowerTickIndex: lowerTick,
      upperTickIndex: upperTick,
      xToY,
      poolKey
    });
    return tickmaps;
  }

  public static async getTokensInfo(
    tokens: string[],
    address?: string
  ): Promise<TokenDataOnChain[]> {
    return await Promise.all(
      tokens.map(async token => {
        if (token.includes('ibc') || token == 'orai') {
          const balance = address ? BigInt(await this.queryBalance(address, token)) : 0n;
          return {
            address: token,
            balance: balance,
            symbol: token == 'orai' ? 'ORAI' : 'IBC',
            decimals: 6,
            name: token == 'orai' ? 'ORAI' : 'IBC Token'
          };
        }

        const queryClient = new OraiswapTokenQueryClient(this.dex.client, token);
        const balance = address ? await queryClient.balance({ address: address }) : { balance: '0' };
        const tokenInfo = await queryClient.tokenInfo();
        const symbol = tokenInfo.symbol;
        const decimals = tokenInfo.decimals;
        const name = tokenInfo.name;

        return {
          address: token,
          balance: BigInt(balance.balance),
          symbol: symbol,
          decimals,
          name: name
        };
      })
    );
  }

  public static async getPools(): Promise<PoolWithPoolKey[]> {
    const client = await CosmWasmClient.connect(import.meta.env.VITE_CHAIN_RPC_ENDPOINT);
    const queryClient = new OraiswapV3QueryClient(client, defaultState.dexAddress);
    return await queryClient.pools({});
  }

  public static async getPool(poolKey: PoolKey): Promise<PoolWithPoolKey> {
    const client = await CosmWasmClient.connect(import.meta.env.VITE_CHAIN_RPC_ENDPOINT);
    const queryClient = new OraiswapV3QueryClient(client, defaultState.dexAddress);
    const pool = await queryClient.pool({
      feeTier: poolKey.fee_tier,
      token0: poolKey.token_x,
      token1: poolKey.token_y
    });
    return {
      pool: pool,
      pool_key: poolKey
    };
  }

  public static async getAllPosition(
    address: string,
    limit?: number,
    offset?: PoolKey
  ): Promise<any> {
    const position = await this.dex.client.queryContractSmart(defaultState.dexAddress, {
      positions: {
        limit,
        offset,
        owner_id: address
      }
    });
    return position;
  }

  public static async getFullTickmap(poolKey: PoolKey): Promise<Tickmap> {
    const maxTick = getMaxTick(poolKey.fee_tier.tick_spacing);
    let lowerTick = getMinTick(poolKey.fee_tier.tick_spacing);

    const xToY = false;

    const promises = [];
    const tickSpacing = poolKey.fee_tier.tick_spacing;
    assert(tickSpacing <= 100);

    assert(MAX_TICKMAP_QUERY_SIZE > 3);
    assert(CHUNK_SIZE * 2 > tickSpacing);
    // move back 1 chunk since the range is inclusive
    // then move back additional 2 chunks to ensure that adding tickspacing won't exceed the query limit
    const jump = (MAX_TICKMAP_QUERY_SIZE - 3) * CHUNK_SIZE;

    while (lowerTick <= maxTick) {
      let nextTick = lowerTick + jump;
      const remainder = nextTick % tickSpacing;

      if (remainder > 0) {
        nextTick += tickSpacing - remainder;
      } else if (remainder < 0) {
        nextTick -= remainder;
      }

      let upperTick = nextTick;

      if (upperTick > maxTick) {
        upperTick = maxTick;
      }

      assert(upperTick % tickSpacing === 0);
      assert(lowerTick % tickSpacing === 0);

      const result = this.getRawTickmap(poolKey, lowerTick, upperTick, xToY).then(
        tickmap => tickmap.map(([a, b]) => [BigInt(a), BigInt(b)]) as [bigint, bigint][]
      );
      promises.push(result);

      lowerTick = upperTick + tickSpacing;
    }

    const fullResult = (await Promise.all(promises)).flat(1);

    const storedTickmap = new Map<bigint, bigint>(fullResult);

    return { bitmap: storedTickmap };
  }

  public static async getAllLiquidityTicks(
    poolKey: PoolKey,
    tickmap: Tickmap
  ): Promise<LiquidityTick[]> {
    const tickIndexes: number[] = [];
    for (const [chunkIndex, chunk] of tickmap.bitmap.entries()) {
      for (let bit = 0; bit < CHUNK_SIZE; bit++) {
        const checkedBit = chunk & (1n << BigInt(bit));
        if (checkedBit) {
          const tickIndex = positionToTick(Number(chunkIndex), bit, poolKey.fee_tier.tick_spacing);
          tickIndexes.push(tickIndex);
        }
      }
    }
    const tickLimit = LIQUIDITY_TICKS_LIMIT;
    const promises: Promise<LiquidityTick[]>[] = [];
    for (let i = 0; i < tickIndexes.length; i += tickLimit) {
      promises.push(
        this.dex
          .liquidityTicks({
            poolKey,
            tickIndexes: tickIndexes.slice(i, i + tickLimit).map(Number)
          })
          .then(parse)
      );
    }

    const tickResults = await Promise.all(promises);
    return tickResults.flat(1);
  }

  public static approveToken = async (token: string, amount: bigint, address: string) => {
    const tokenClient = new OraiswapTokenClient(this.dex.client, address, token);

    return await tokenClient.increaseAllowance({
      amount: amount.toString(),
      spender: this.dex.contractAddress
    });
  };

  public static getPoolLiquidities = async (
    pools: PoolWithPoolKey[]
  ): Promise<Record<string, number>> => {
    const poolLiquidities: Record<string, number> = {};
    for (const pool of pools) {
      const tickmap = await this.getFullTickmap(pool.pool_key);

      const liquidityTicks = await this.getAllLiquidityTicks(pool.pool_key, tickmap);

      const tickIndexes: number[] = [];
      for (const [chunkIndex, chunk] of tickmap.bitmap.entries()) {
        for (let bit = 0; bit < CHUNK_SIZE; bit++) {
          const checkedBit = chunk & (1n << BigInt(bit));
          if (checkedBit) {
            const tickIndex = positionToTick(
              Number(chunkIndex),
              bit,
              pool.pool_key.fee_tier.tick_spacing
            );
            tickIndexes.push(tickIndex);
          }
        }
      }

      const tickArray: VirtualRange[] = [];

      for (let i = 0; i < tickIndexes.length - 1; i++) {
        tickArray.push({
          lowerTick: tickIndexes[i],
          upperTick: tickIndexes[i + 1]
        });
      }

      const posTest: PositionTest[] = calculateLiquidityForRanges(liquidityTicks, tickArray);

      const res = await calculateLiquidityForPair(posTest, BigInt(pool.pool.sqrt_price));

      const tokens = [pool.pool_key.token_x, pool.pool_key.token_y];

      const tokenInfos = await Promise.all(
        tokens.map(async token => {
          if (FAUCET_LIST_TOKEN.filter(item => item.address === token).length > 0) {
            const info = FAUCET_LIST_TOKEN.filter(item => item.address === token)[0];
            return { info, price: await getCoingeckoTokenPriceV2(info.coingeckoId) };
          }
        })
      );

      const tokenWithLiquidities = [
        {
          address: pool.pool_key.token_x,
          balance: res.liquidityX
        },
        {
          address: pool.pool_key.token_y,
          balance: res.liquidityY
        }
      ]

      const tokenWithUSDValue = tokenWithLiquidities.map(token => {
        const tokenInfo = tokenInfos.filter(item => item.info.address === token.address)[0];
        return {
          address: token.address,
          usdValue: (Number(token.balance) / 10 ** 6) * tokenInfo.price.price
        };
      });

      const totalValue = tokenWithUSDValue.reduce((acc, item) => acc + item.usdValue, 0);

      poolLiquidities[poolKeyToString(pool.pool_key)] = totalValue;
    }
    return poolLiquidities;
  };

  public static getTotalLiquidityValue = async (): Promise<number> => {
    const pools = await this._dexQuerier.pools({}); // get pools from state

    const totalLiquidity = await Promise.all(
      pools.map(async pool => {
        const tickmap = await this.getFullTickmap(pool.pool_key);

        const liquidityTicks = await this.getAllLiquidityTicks(pool.pool_key, tickmap);

        // console.log({ liquidityTicks });

        const tickIndexes: number[] = [];
        for (const [chunkIndex, chunk] of tickmap.bitmap.entries()) {
          for (let bit = 0; bit < CHUNK_SIZE; bit++) {
            const checkedBit = chunk & (1n << BigInt(bit));
            if (checkedBit) {
              const tickIndex = positionToTick(
                Number(chunkIndex),
                bit,
                pool.pool_key.fee_tier.tick_spacing
              );
              tickIndexes.push(tickIndex);
            }
          }
        }

        const tickArray: VirtualRange[] = [];

        for (let i = 0; i < tickIndexes.length - 1; i++) {
          tickArray.push({
            lowerTick: tickIndexes[i],
            upperTick: tickIndexes[i + 1]
          });
        }

        const posTest: PositionTest[] = calculateLiquidityForRanges(liquidityTicks, tickArray);

        const res = await calculateLiquidityForPair(posTest, BigInt(pool.pool.sqrt_price));

        return [
          { address: pool.pool_key.token_x, balance: res.liquidityX },
          { address: pool.pool_key.token_y, balance: res.liquidityY }
        ];
      })
    );

    const flattenArray = totalLiquidity.flat(1);

    // get all tokens and remove duplicate
    const tokens = flattenArray
      .map(item => item.address)
      .filter((value, index, self) => self.indexOf(value) === index);

    // get token info
    const tokenInfos = await Promise.all(
      tokens.map(async token => {
        if (FAUCET_LIST_TOKEN.filter(item => item.address === token).length > 0) {
          const info = FAUCET_LIST_TOKEN.filter(item => item.address === token)[0];
          return { info, price: await getCoingeckoTokenPriceV2(info.coingeckoId) };
        }
      })
    );

    // console.log({ tokenInfos });

    const tokenWithLiquidities = tokens.map(token => {
      const liquidity = flattenArray
        .filter(item => item.address === token)
        .reduce((acc, item) => acc + item.balance, 0n);
      return { address: token, balance: liquidity };
    });

    // console.log({ tokenWithLiquidities })

    // tokenWithUSDValue
    const tokenWithUSDValue = tokenWithLiquidities.map(token => {
      const tokenInfo = tokenInfos.filter(item => item.info.address === token.address)[0];
      return {
        address: token.address,
        usdValue: (Number(token.balance) / 10 ** 6) * tokenInfo.price.price
      };
    });

    // console.log({ tokenWithUSDValue });

    const totalValue = tokenWithUSDValue.reduce((acc, item) => acc + item.usdValue, 0);

    return totalValue;
  };
}

export interface PositionTest {
  liquidity: bigint;
  upper_tick_index: number;
  lower_tick_index: number;
}

export interface VirtualRange {
  lowerTick: number;
  upperTick: number;
}

export const calculateLiquidityForPair = async (positions: PositionTest[], sqrt_price: bigint) => {
  let liquidityX = 0n;
  let liquidityY = 0n;
  for (const position of positions) {
    let xVal, yVal;

    try {
      xVal = getX(
        position.liquidity,
        calculateSqrtPrice(position.upper_tick_index),
        sqrt_price,
        calculateSqrtPrice(position.lower_tick_index)
      );
    } catch (error) {
      xVal = 0n;
    }

    try {
      yVal = getY(
        position.liquidity,
        calculateSqrtPrice(position.upper_tick_index),
        sqrt_price,
        calculateSqrtPrice(position.lower_tick_index)
      );
    } catch (error) {
      yVal = 0n;
    }

    liquidityX = liquidityX + xVal;
    liquidityY = liquidityY + yVal;
  }

  return { liquidityX, liquidityY };
};

export const LIQUIDITY_SCALE = 6n;
export const PRICE_SCALE = 24n;
export const LIQUIDITY_DENOMINATOR = 10n ** LIQUIDITY_SCALE;
export const PRICE_DENOMINATOR = 10n ** PRICE_SCALE;

export const getX = (
  liquidity: bigint,
  upperSqrtPrice: bigint,
  currentSqrtPrice: bigint,
  lowerSqrtPrice: bigint
): bigint => {
  if (upperSqrtPrice <= 0n || currentSqrtPrice <= 0n || lowerSqrtPrice <= 0n) {
    throw new Error('Price cannot be lower or equal 0');
  }

  let denominator: bigint;
  let nominator: bigint;

  if (currentSqrtPrice >= upperSqrtPrice) {
    return 0n;
  } else if (currentSqrtPrice < lowerSqrtPrice) {
    denominator = (lowerSqrtPrice * upperSqrtPrice) / PRICE_DENOMINATOR;
    nominator = upperSqrtPrice - lowerSqrtPrice;
  } else {
    denominator = (upperSqrtPrice * currentSqrtPrice) / PRICE_DENOMINATOR;
    nominator = upperSqrtPrice - currentSqrtPrice;
  }

  return (liquidity * nominator) / denominator / LIQUIDITY_DENOMINATOR;
};
export const getY = (
  liquidity: bigint,
  upperSqrtPrice: bigint,
  currentSqrtPrice: bigint,
  lowerSqrtPrice: bigint
): bigint => {
  if (lowerSqrtPrice <= 0n || currentSqrtPrice <= 0n || upperSqrtPrice <= 0n) {
    throw new Error('Price cannot be 0');
  }

  let difference: bigint;
  if (currentSqrtPrice <= lowerSqrtPrice) {
    return 0n;
  } else if (currentSqrtPrice >= upperSqrtPrice) {
    difference = upperSqrtPrice - lowerSqrtPrice;
  } else {
    difference = currentSqrtPrice - lowerSqrtPrice;
  }

  return (liquidity * difference) / PRICE_DENOMINATOR / LIQUIDITY_DENOMINATOR;
};

function calculateLiquidityForRanges(
  liquidityChanges: LiquidityTick[],
  tickRanges: VirtualRange[]
): PositionTest[] {
  let currentLiquidity = 0n;
  const rangeLiquidity = [];

  liquidityChanges.forEach(change => {
    let liquidityChange = change.liquidity_change;
    if (!change.sign) {
      liquidityChange = -liquidityChange;
    }
    currentLiquidity += liquidityChange;

    tickRanges.forEach((range, index) => {
      if (change.index >= range.lowerTick && change.index < range.upperTick) {
        if (!rangeLiquidity[index]) {
          rangeLiquidity[index] = 0;
        }
        rangeLiquidity[index] = currentLiquidity;
      }
    });
  });

  return rangeLiquidity.map((liquidity, index) => ({
    lower_tick_index: tickRanges[index].lowerTick,
    upper_tick_index: tickRanges[index].upperTick,
    liquidity: liquidity
  }));
}
