import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { OraiswapV3Client } from '../../sdk'

export default class SingletonOraiswapV3 {
  private static _contract: OraiswapV3Client

  private constructor() {}

  public static get contract() {
    return this._contract
  }

  public static async load(signingClient: SigningCosmWasmClient, sender: string) {
    if (!this.contract || import.meta.env.VITE_CONTRACT_ADDRESS !== this.contract.contractAddress) {
      this._contract = new OraiswapV3Client(
        signingClient,
        sender,
        import.meta.env.VITE_CONTRACT_ADDRESS
      )
    }
  }
}
