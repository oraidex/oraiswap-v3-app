import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { OraiswapV3Client } from '../../sdk'
import { Cw20BaseClient } from '@oraichain/common-contracts-sdk'

export default class SingletonOraiswapV3 {
  private static _cw20: Cw20BaseClient
  private static _dex: OraiswapV3Client

  private constructor() {}

  public static get dex() {
    return this._dex
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
    if (!this._cw20 || contractAddress !== this._cw20.contractAddress) {
      this._cw20 = new Cw20BaseClient(signingClient, sender, contractAddress)
    }
  }
}
