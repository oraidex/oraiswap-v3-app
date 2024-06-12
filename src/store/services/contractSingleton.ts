import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { OraiswapV3Client } from '../../sdk'
import { OraiswapTokenClient } from '@oraichain/oraidex-contracts-sdk'

export default class SingletonOraiswapV3 {
  private static _tokens: { [key: string]: OraiswapTokenClient } = {}
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
    this._tokens[contractAddress] = new OraiswapTokenClient(signingClient, sender, contractAddress)
  }
}
