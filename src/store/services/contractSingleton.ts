import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { OraiswapV3Client } from '../../sdk'
import { OraiswapTokenClient } from '@oraichain/oraidex-contracts-sdk'
import { Token } from '@store/consts/static'
import { LiquidityTick, PoolKey, PoolWithPoolKey, Tick } from '@/sdk/OraiswapV3.types'
import { PayloadAction } from '@reduxjs/toolkit'
import { _newPoolKey, toSqrtPrice } from '@/wasm/oraiswap_v3_wasm'

export default class SingletonOraiswapV3 {
  private static _tokens: Record<string, Token> = {}
  private static pools: { [key in string]: PoolWithPoolKey } = {}
  private static poolKeys: { [key in string]: PoolKey } = {}
  private static poolTicks: { [key in string]: LiquidityTick[] } = {}
  private static nearestPoolTicksForPair: { [key in string]: Tick[] } = {}
  private static isLoadingLatestPoolsForTransaction: boolean = false
  private static isLoadingTicksAndTickMaps: boolean = false
  private static tickMaps: { [key in string]: string } = {}
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

  public static async loadCw20(
    signingClient: SigningCosmWasmClient,
    sender: string,
    contractAddress: string
  ) {
    return new OraiswapTokenClient(signingClient, sender, contractAddress)
  }

  public static async handleInitPool(action: PayloadAction<PoolKey>): Generator {
    try {
      const { token_x: tokenX, token_y: tokenY, fee_tier: feeTier } = action.payload

      const poolKey = _newPoolKey(tokenX, tokenY, feeTier)

      const initSqrtPrice = toSqrtPrice(1n, 0n)

      const tx = this._dex.createPool({
        feeTier,
        initSqrtPrice,
        initTick:
      })

      const signedTx =
        yield *
        call([tx, tx.signAsync], walletAddress, {
          signer: adapter.signer as Signer
        })

      const txResult = yield * call(sendTx, signedTx)
    } catch (error) {
      console.log(error)
    }
  }
}
