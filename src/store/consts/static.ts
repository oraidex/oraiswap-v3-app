export const TESTNET_BTC_ADDRESS = '5FEE8ptrT6387MYHqYmyB8ChWfkEsGEDpTMDpwUh4FCYGyCi'
export const TESTNET_ETH_ADDRESS = '5FmDoQPFS5qPMkSumdvVVekiTpsKVmL9E5DHxHEUXCdHFdYy'
export const TESTNET_USDC_ADDRESS = '5EjKBBJMLE9R2HsXKJRw2CCMZW2q48Ps5bVAQqzsxyhH9jU5'

import { Network } from '@store/consts/utils'

export enum OraichainNetworks {
  TEST = 'wss://ws.test.azero.dev',
  DEV = 'wss://ws.dev.azero.dev'
}

export const TESTNET_DEX_ADDRESS = ''

export const POSITIONS_PER_PAGE = 5

export const STABLECOIN_ADDRESSES: string[] = []

export type PositionOpeningMethod = 'range' | 'concentration'

export interface TokenPriceData {
  price: number
}

export interface Token {
  symbol: string
  address: string
  decimals: bigint
  name: string
  logoURI: string
  balance?: bigint
  coingeckoId?: string
  isUnknown?: boolean
}

export const tokensPrices: Record<Network, Record<string, TokenPriceData>> = {
  [Network.Testnet]: { USDC_TEST: { price: 1 }, BTC_TEST: { price: 64572.0 } },
  [Network.Mainnet]: {},
  [Network.Local]: {}
}
export interface BestTier {
  tokenX: string
  tokenY: string
  bestTierIndex: number
}

// const mainnetBestTiersCreator = () => {
//   const stableTokens = {
//     USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
//   }

//   const unstableTokens = {
//     BTC: '9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E'
//   }

//   const bestTiers: BestTier[] = []

//   for (let i = 0; i < 4; i++) {
//     const tokenX = Object.values(stableTokens)[i]
//     for (let j = i + 1; j < 4; j++) {
//       const tokenY = Object.values(stableTokens)[j]

//       bestTiers.push({
//         tokenX,
//         tokenY,
//         bestTierIndex: 0
//       })
//     }
//   }

//   for (let i = 0; i < 5; i++) {
//     const [symbolX, tokenX] = Object.entries(unstableTokens)[i]
//     for (let j = i + 1; j < 5; j++) {
//       const [symbolY, tokenY] = Object.entries(unstableTokens)[j]

//       if (symbolX.slice(-3) === 'SOL' && symbolY.slice(-3) === 'SOL') {
//         bestTiers.push({
//           tokenX,
//           tokenY,
//           bestTierIndex: 0
//         })
//       } else {
//         bestTiers.push({
//           tokenX,
//           tokenY,
//           bestTierIndex: 2
//         })
//       }
//     }
//   }

//   for (let i = 0; i < 4; i++) {
//     const tokenX = Object.values(stableTokens)[i]
//     for (let j = 0; j < 5; j++) {
//       const tokenY = Object.values(unstableTokens)[j]

//       bestTiers.push({
//         tokenX,
//         tokenY,
//         bestTierIndex: 2
//       })
//     }
//   }

//   return bestTiers
// }

export const bestTiers: Record<Network, BestTier[]> = {
  //TODO add best Tiers
  [Network.Testnet]: [],
  [Network.Mainnet]: [],
  [Network.Local]: []
}

export const commonTokensForNetworks: Record<Network, string[]> = {
  [Network.Testnet]: [],
  [Network.Mainnet]: [],
  [Network.Local]: []
}

export const FAUCET_DEPLOYER_MNEMONIC =
  'motion ice subject actress spider rare leg fortune brown similar excess amazing'

export const FAUCET_TOKEN_AMOUNT = 1000n

export const TokenAirdropAmount = {
  BTC: 100000n,
  ETH: 20000000000000000n,
  USDC: 50000000n
}

export const FaucetTokenList = {
  // BTC: TESTNET_BTC_ADDRESS,
  // ETH: TESTNET_ETH_ADDRESS,
  // USDC: TESTNET_USDC_ADDRESS,
  TOKEN1: 'orai1z3zd5fk60ev5tf8slmr5tjuhp2qmhkvhcf84ajk27un5h0tgz4fql075rt',
  TOKEN2: 'orai154a9fxn9wcyfsxnjkgm4ql4spyvhfu7j5twpzwwx2077ts0uwtps66y70s',
  ORAI: 'orai',
  USDT: 'orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh'
}

export const TOKEN1: Token = {
  symbol: 'TOKEN1',
  address: 'orai1z3zd5fk60ev5tf8slmr5tjuhp2qmhkvhcf84ajk27un5h0tgz4fql075rt',
  decimals: 6n,
  name: 'TOKEN1',
  logoURI:
    'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E/logo.png',
  coingeckoId: 'tether'
}
export const TOKEN2: Token = {
  symbol: 'TOKEN2',
  address: 'orai154a9fxn9wcyfsxnjkgm4ql4spyvhfu7j5twpzwwx2077ts0uwtps66y70s',
  decimals: 6n,
  name: 'TOKEN2',
  logoURI:
    'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E/logo.png',
  coingeckoId: 'tether'
}

export const BTC: Token = {
  symbol: 'BTC',
  address: TESTNET_BTC_ADDRESS,
  decimals: 8n,
  name: 'Bitcoin',
  logoURI:
    'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E/logo.png',
  coingeckoId: 'bitcoin'
}

export const ETH: Token = {
  symbol: 'ETH',
  address: TESTNET_ETH_ADDRESS,
  decimals: 18n,
  name: 'Ether',
  logoURI:
    'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk/logo.png',
  coingeckoId: 'ethereum'
}

export const USDC: Token = {
  symbol: 'USDC',
  address: TESTNET_USDC_ADDRESS,
  decimals: 6n,
  name: 'USDC',
  logoURI:
    'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
  coingeckoId: 'usdc'
}

export const ORAI: Token = {
  symbol: 'ORAI',
  address: 'orai',
  decimals: 6n,
  name: 'Oraichain Native Token',
  logoURI: 'https://assets.coingecko.com/coins/images/12931/standard/orai.png',
  coingeckoId: 'oraichain-token'
}

export const USDT: Token = {
  symbol: 'USDT',
  address: 'orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh',
  decimals: 6n,
  name: 'Tether USD',
  logoURI: 'https://assets.coingecko.com/coins/images/325/standard/Tether.png',
  coingeckoId: 'tether'
}

export const FAUCET_LIST_TOKEN = [TOKEN1, TOKEN2, ORAI, USDT]

export const DEFAULT_INVARIANT_OPTIONS = {
  storageDepositLimit: null,
  refTime: 100000000000,
  proofSize: 100000000000
}

export const DEFAULT_PSP22_OPTIONS = {
  storageDepositLimit: null,
  refTime: 5000000000,
  proofSize: 5000000000
}

export const DEFAULT_WAZERO_OPTIONS = {
  storageDepositLimit: null,
  refTime: 5000000000,
  proofSize: 5000000000
}

export const INVARIANT_SWAP_OPTIONS = {
  storageDepositLimit: null,
  refTime: 250000000000,
  proofSize: 500000
}

export const INVARIANT_WITHDRAW_ALL_WAZERO = {
  storageDepositLimit: null,
  refTime: 25000000000,
  proofSize: 250000
}

export const INVARIANT_CREATE_POOL_OPTIONS = {
  storageDepositLimit: null,
  refTime: 10000000000,
  proofSize: 250000
}

export const INVARIANT_CREATE_POSITION_OPTIONS = {
  storageDepositLimit: null,
  refTime: 25000000000,
  proofSize: 500000
}

export const INVARIANT_CLAIM_FEE_OPTIONS = {
  storageDepositLimit: null,
  refTime: 25000000000,
  proofSize: 500000
}

export const INVARIANT_REMOVE_POSITION_OPTIONS = {
  storageDepositLimit: null,
  refTime: 25000000000,
  proofSize: 250000
}

export const PSP22_APPROVE_OPTIONS = {
  storageDepositLimit: null,
  refTime: 2500000000,
  proofSize: 50000
}

export const WAZERO_DEPOSIT_OPTIONS = {
  storageDepositLimit: null,
  refTime: 2500000000,
  proofSize: 50000
}

export const WAZERO_WITHDRAW_OPTIONS = {
  storageDepositLimit: null,
  refTime: 2500000000,
  proofSize: 50000
}

// export const ALL_FEE_TIERS_DATA = FEE_TIERS.map((tier, index) => ({
//   tier,
//   primaryIndex: index
// }))

export const U128MAX = 2n ** 128n - 1n

export const SWAP_SAFE_TRANSACTION_FEE = BigInt(Math.ceil(0.05 * 10 ** 12))
export const POOL_SAFE_TRANSACTION_FEE = BigInt(Math.ceil(0.05 * 10 ** 12))
