import { newPoolKey } from '@wasm'
import { Status } from '@store/reducers/wallet'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import Swap from './Swap'

const meta = {
  title: 'Components/Swap',
  component: Swap
} satisfies Meta<typeof Swap>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    commonTokens: [],
    handleAddToken: fn(),
    initialHideUnknownTokensValue: false,
    onSwap: fn(),
    initialSlippage: '0.5',
    initialTokenFromIndex: 0,
    initialTokenToIndex: 1,
    isBalanceLoading: false,
    isFetchingNewPool: false,
    isWaitingForNewPool: false,
    onConnectWallet: fn(),
    onDisconnectWallet: fn(),
    onHideUnknownTokensChange: fn(),
    onRefresh: fn(),
    onSetPair: fn(),
    onSlippageChange: fn(),
    pools: [],
    poolTicks: {
      pool1: [
        {
          index: 1,
          sign: true,
          liquidity_change: 100n,
          liquidity_gross: 200n,
          sqrt_price: 300n,
          fee_growth_outside_x: 400n,
          fee_growth_outside_y: 500n,
          seconds_outside: 600
        }
      ],
      pool2: [
        {
          index: 2,
          sign: false,
          liquidity_change: 700n,
          liquidity_gross: 800n,
          sqrt_price: 900n,
          fee_growth_outside_x: 1000n,
          fee_growth_outside_y: 1100n,
          seconds_outside: 1200
        }
      ]
    },
    progress: 'none',
    swapData: {
      slippage: 1,
      estimatedPriceAfterSwap: 123n,
      tokenFrom: '0x123132423423',
      tokenTo: '0x123132423423',
      amountIn: 123n,
      byAmountIn: false,
      amountOut: 1114n,
      poolKey: newPoolKey('0x123132423423', '0x123132423423', { fee: 1, tick_spacing: 1 })
    },
    tickmap: {},
    tokens: [],
    walletStatus: Status.Initialized,
    simulateResult: {
      poolKey: newPoolKey('0x123132423423', '0x123132423423', { fee: 1, tick_spacing: 1 }),
      amountOut: 1000000000000n,
      priceImpact: 1.23,
      targetSqrtPrice: 1000000000000000000000000n,
      errors: []
    }
  },
  render: args => {
    return (
      <Swap
        {...args}
        poolTicks={{
          pool1: [
            {
              index: 1,
              sign: true,
              liquidity_change: 100n,
              liquidity_gross: 200n,
              sqrt_price: 300n,
              fee_growth_outside_x: 400n,
              fee_growth_outside_y: 500n,
              seconds_outside: 600
            }
          ],
          pool2: [
            {
              index: 2,
              sign: false,
              liquidity_change: 700n,
              liquidity_gross: 800n,
              sqrt_price: 900n,
              fee_growth_outside_x: 1000n,
              fee_growth_outside_y: 1100n,
              seconds_outside: 1200
            }
          ]
        }}
        swapData={{
          slippage: 1,
          estimatedPriceAfterSwap: 123n,
          tokenFrom: '0x123132423423',
          tokenTo: '0x123132423423',
          amountIn: 123n,
          byAmountIn: false,
          amountOut: 1114n,
          poolKey: newPoolKey('0x123132423423', '0x123132423423', { fee: 1, tick_spacing: 1 })
        }}
      />
    )
  }
}
