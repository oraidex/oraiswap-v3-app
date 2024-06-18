import { createSelector } from '@reduxjs/toolkit'
import { IOraichainWallet, ITokenBalance, walletSliceName } from '@store/reducers/wallet'
import { AnyProps, keySelectors } from './helpers'
import { tokens } from './pools'
import { TokenAmount } from '@wasm'

const store = (s: AnyProps) => s[walletSliceName] as IOraichainWallet

export const { address, balance, tokensBalances, status, balanceLoading } = keySelectors(store, [
  'address',
  'balance',
  'tokensBalances',
  'status',
  'balanceLoading'
])

// export const tokenBalance = (tokenAddress: Keyring) =>
//   createSelector(accounts, balance, (tokensAccounts, solBalance) => {
//     if (tokenAddress.equals(new Keyring(MOCK_TOKENS.SOL))) {
//       return { balance: solBalance, decimals: 9 }
//     } else {
//       if (!tokensAccounts[tokenAddress.toString()]) {
//         return { balance: new BN(0), decimals: 9 }
//       }
//       return {
//         balance: tokensAccounts[tokenAddress.toString()].balance,
//         decimals: tokensAccounts[tokenAddress.toString()].decimals
//       }
//     }
//   })

export const tokenBalance = (tokenAddress: string) =>
  createSelector(tokensBalances, tokensAccounts => {
    if (tokensAccounts[tokenAddress.toString()]) {
      return tokensAccounts[tokenAddress.toString()]
    }
  })

export const tokenBalanceAddress = () =>
  createSelector(tokensBalances, tokenAccounts => {
    return Object.values(tokenAccounts).map(item => {
      return item.address
    })
  })

export interface SwapToken {
  balance: TokenAmount
  decimals: number
  symbol: string
  assetAddress: string
  name: string
  logoURI: string
  isUnknown?: boolean
  coingeckoId?: string
}

export const swapTokens = createSelector(
  tokensBalances,
  tokens,
  balance,
  (allAccounts, tokens, _a0Balance) => {
    return Object.values(tokens).map(token => {
      const tokenSwap: SwapToken = {
        ...token,
        assetAddress: token.address,
        balance: allAccounts[token.address]?.balance ?? 0n
      }
      return tokenSwap
    })
  }
)

export const poolTokens = createSelector(
  tokensBalances,
  tokens,
  balance,
  (allAccounts, tokens, _a0Balance) => {
    return Object.values(tokens).map(token => ({
      ...token,
      assetAddress: token.address,
      balance: allAccounts[token.address]?.balance ?? 0n
    }))
  }
)

export const swapTokensDict = createSelector(
  tokensBalances,
  tokens,
  balance,
  (allAccounts, tokens, _a0Balance) => {
    const swapTokens: Record<string, SwapToken> = {}
    Object.entries(tokens).forEach(([key, val]) => {
      swapTokens[key] = {
        ...val,
        assetAddress: val.address,
        balance: allAccounts[val.address]?.balance ?? 0n
      }
    })

    return swapTokens
  }
)

export const canCreateNewPool = () =>
  createSelector(balance, () => {
    // switch (network) {
    //   case NetworkType.DEVNET:
    //     return ethBalance.gte(WETH_POOL_INIT_LAMPORTS)
    //   case NetworkType.TESTNET:
    //     return ethBalance.gte(WETH_POOL_INIT_LAMPORTS_TEST)
    //   case NetworkType.MAINNET:
    //     return ethBalance.gte(WETH_POOL_INIT_LAMPORTS)
    //   default:
    //     return ethBalance.gte(WETH_POOL_INIT_LAMPORTS)
    // }
    return true
  })
export const canCreateNewPosition = () =>
  createSelector(balance, () => {
    // switch (network) {
    //   case NetworkType.DEVNET:
    //     return ethBalance.gte(WETH_POOL_INIT_LAMPORTS)
    //   case NetworkType.TESTNET:
    //     return ethBalance.gte(WETH_POOL_INIT_LAMPORTS_TEST)
    //   case NetworkType.MAINNET:
    //     return ethBalance.gte(WETH_POOL_INIT_LAMPORTS)
    //   default:
    //     return ethBalance.gte(WETH_POOL_INIT_LAMPORTS)
    // }
    return true
  })

export type TokenBalances = ITokenBalance & {
  symbol: string
  usdValue: bigint
  assetDecimals: number
}

export const oraichainWalletSelectors = {
  address,
  balance,
  tokensBalances,
  status,
  tokenBalance,
  balanceLoading
}
export default oraichainWalletSelectors
