import { CosmWasmClient, SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { OraiswapV3Client, OraiswapV3QueryClient } from '../../sdk'
import { OraiswapTokenClient, OraiswapTokenQueryClient } from '@oraichain/oraidex-contracts-sdk'
import {
  Tickmap,
  get_max_tick,
  get_min_tick,
  PoolKey,
  LiquidityTick,
  position_to_tick
} from '@wasm'
import {
  CHUNK_SIZE,
  LIQUIDITY_TICKS_LIMIT,
  MAX_TICKMAP_QUERY_SIZE,
  TokenDataOnChain,
  parse
  // parse
} from '@store/consts/utils'
import { ArrayOfTupleOfUint16AndUint64, PoolWithPoolKey } from '@/sdk/OraiswapV3.types'

export const assert = (condition: boolean, message?: string) => {
  if (!condition) {
    throw new Error(message || 'assertion failed')
  }
}

export const integerSafeCast = (value: bigint): number => {
  if (value > BigInt(Number.MAX_SAFE_INTEGER) || value < BigInt(Number.MIN_SAFE_INTEGER)) {
    throw new Error('Integer value is outside the safe range for Numbers')
  }
  return Number(value)
}

export default class SingletonOraiswapV3 {
  private static _tokens: { [key: string]: OraiswapTokenClient | any } = {}
  private static _dex: OraiswapV3Client

  private constructor() {}

  public static get dex() {
    return this._dex
  }

  public static get tokens() {
    return this._tokens
  }

  public static async load(signingClient: SigningCosmWasmClient, sender: string) {
    if (!this.dex || import.meta.env.VITE_CONTRACT_ADDRESS !== this.dex.contractAddress) {
      this._dex = new OraiswapV3Client(signingClient, sender, import.meta.env.VITE_CONTRACT_ADDRESS)
    }
  }

  public static async loadCw20(sender: string, contractAddress: string) {
    this._tokens[contractAddress] = new OraiswapTokenClient(
      this._dex.client,
      sender,
      contractAddress
    )
  }

  public static async loadNative(tokenDenom: string) {
    this._tokens[tokenDenom] = tokenDenom
  }

  public static async queryBalance(tokenDenom: string = 'orai') {
    const { amount } = await this._dex.client.getBalance(this._dex.sender, tokenDenom)
    return amount
  }

  public static async getRawTickmap(
    poolKey: PoolKey,
    lowerTick: number,
    upperTick: number,
    xToY: boolean
  ): Promise<ArrayOfTupleOfUint16AndUint64> {
    const tickmaps = await this.dex.tickMap({
      lowerTickIndex: lowerTick,
      upperTickIndex: upperTick,
      xToY,
      poolKey
    })
    return tickmaps
  }

  public static async getTokensInfo(tokens: string[]): Promise<TokenDataOnChain[]> {
    return await Promise.all(
      tokens.map(async token => {
        const queryClient = new OraiswapTokenQueryClient(this.dex.client, token)
        const balance = await queryClient.balance({ address: this.dex.sender })
        const tokenInfo = await queryClient.tokenInfo()
        const symbol = tokenInfo.symbol
        const decimals = tokenInfo.decimals
        const name = tokenInfo.name

        return {
          address: token,
          balance: BigInt(balance.balance),
          symbol: symbol,
          decimals: BigInt(decimals),
          name: name
        }
      })
    )
  }

  public static async getPools(): Promise<PoolWithPoolKey[]> {
    const client = await CosmWasmClient.connect(import.meta.env.VITE_CHAIN_RPC_ENDPOINT)
    const queryClient = new OraiswapV3QueryClient(client, import.meta.env.VITE_CONTRACT_ADDRESS)
    return await queryClient.pools({})
  }

  public static async getAllPosition(limit?: number, offset?: PoolKey): Promise<any> {
    const position = await this.dex.client.queryContractSmart(
      import.meta.env.VITE_CONTRACT_ADDRESS,
      {
        positions: {
          limit,
          offset,
          owner_id: this.dex.sender
        }
      }
    )
    return position
  }

  public static async getFullTickmap(poolKey: PoolKey): Promise<Tickmap> {
    const maxTick = get_max_tick(poolKey.fee_tier.tick_spacing)
    let lowerTick = get_min_tick(poolKey.fee_tier.tick_spacing)

    const xToY = false

    const promises = []
    const tickSpacing = poolKey.fee_tier.tick_spacing
    assert(tickSpacing <= 100)

    assert(MAX_TICKMAP_QUERY_SIZE > 3)
    assert(CHUNK_SIZE * 2 > tickSpacing)
    // move back 1 chunk since the range is inclusive
    // then move back additional 2 chunks to ensure that adding tickspacing won't exceed the query limit
    const jump = (MAX_TICKMAP_QUERY_SIZE - 3) * CHUNK_SIZE

    while (lowerTick <= maxTick) {
      let nextTick = lowerTick + jump
      const remainder = nextTick % tickSpacing

      if (remainder > 0) {
        nextTick += tickSpacing - remainder
      } else if (remainder < 0) {
        nextTick -= remainder
      }

      let upperTick = nextTick

      if (upperTick > maxTick) {
        upperTick = maxTick
      }

      assert(upperTick % tickSpacing === 0)
      assert(lowerTick % tickSpacing === 0)

      const result = this.getRawTickmap(poolKey, lowerTick, upperTick, xToY).then(
        tickmap => tickmap.map(([a, b]) => [BigInt(a), BigInt(b)]) as [bigint, bigint][]
      )
      promises.push(result)

      lowerTick = upperTick + tickSpacing
    }

    const fullResult = (await Promise.all(promises)).flat(1)

    const storedTickmap = new Map<bigint, bigint>(fullResult)

    return { bitmap: storedTickmap }
  }

  public static async getAllLiquidityTicks(
    poolKey: PoolKey,
    tickmap: Tickmap
  ): Promise<LiquidityTick[]> {
    const tickIndexes: number[] = []
    for (const [chunkIndex, chunk] of tickmap.bitmap.entries()) {
      for (let bit = 0; bit < CHUNK_SIZE; bit++) {
        const checkedBit = chunk & (1n << BigInt(bit))
        if (checkedBit) {
          const tickIndex = position_to_tick(Number(chunkIndex), bit, poolKey.fee_tier.tick_spacing)
          tickIndexes.push(tickIndex)
        }
      }
    }
    const tickLimit = LIQUIDITY_TICKS_LIMIT
    const promises: Promise<LiquidityTick[]>[] = []
    for (let i = 0; i < tickIndexes.length; i += tickLimit) {
      promises.push(
        this.dex
          .liquidityTicks({
            poolKey,
            tickIndexes: tickIndexes.slice(i, i + tickLimit).map(Number)
          })
          .then(parse)
      )
    }

    const tickResults = await Promise.all(promises)
    return tickResults.flat(1)
  }

  public static approveToken = async (token: string, amount: bigint) => {
    const tokenClient = new OraiswapTokenClient(this.dex.client, this.dex.sender, token)

    return await tokenClient.increaseAllowance({
      amount: amount.toString(),
      spender: this.dex.contractAddress
    })
  }
}
