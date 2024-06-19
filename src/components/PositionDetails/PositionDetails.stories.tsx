import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { MemoryRouter } from 'react-router-dom'
import PositionDetails from './PositionDetails'

const meta = {
  title: 'Components/PositionDetails',
  component: PositionDetails,
  decorators: [
    Story => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    )
  ]
} satisfies Meta<typeof PositionDetails>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    currentPrice: 10000,
    initialIsDiscreteValue: false,
    leftRange: {
      index: 2,
      x: 23
    },
    rightRange: {
      index: 2,
      x: 45354
    },
    max: 100,
    min: 0,
    midPrice: {
      index: 2,
      x: 45354
    },
    onDiscreteChange: fn(),
    reloadHandler: fn(),
    ticksLoading: false,
    tickSpacing: 1,
    closePosition: fn(),
    tokenX: {
      name: 'BTC',
      balance: 10000,
      claimValue: 10000,
      decimal: 9,
      icon: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579',
      liqValue: 10000,
      usdValue: 123
    },
    tokenY: {
      name: 'ETH',
      balance: 432,
      claimValue: 21,
      decimal: 9,
      icon: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579',
      liqValue: 321,
      usdValue: 3246
    },
    hasTicksError: false,
    copyPoolAddressHandler: fn(),
    detailsData: [
      {
        x: 12,
        y: 1234,
        index: 1
      },
      {
        x: 123,
        y: 432,
        index: 2
      }
    ],
    fee: 1n,
    onClickClaimFee: fn(),
    poolAddress: 'orai1h6u9m24mnvmyadj8pmcfvcd0yrjfwur4lrcn4hy25wn80mannz0qwt67m7',
    tokenXAddress: 'orai1h6u9m24mnvmyadj8pmcfvcd0yrjfwur4lrcn4hy25wn80mannz0qwt67m7',
    tokenYAddress: 'orai1h6u9m24mnvmyadj8pmcfvcd0yrjfwur4lrcn4hy25wn80mannz0qwt67m7'
  },
  render: args => {
    return (
      <PositionDetails
        {...args}
        currentPrice={1000}
        leftRange={{
          index: 2,
          x: 23
        }}
        rightRange={{
          index: 2,
          x: 45354
        }}
        midPrice={{
          index: 32,
          x: 4535
        }}
        tokenX={{
          name: 'BTC',
          balance: 10000,
          claimValue: 10000,
          decimal: 9,
          icon: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579',
          liqValue: 10000,
          usdValue: 123
        }}
        tokenY={{
          name: 'ETH',
          balance: 432,
          claimValue: 21,
          decimal: 9,
          icon: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579',
          liqValue: 321,
          usdValue: 3246
        }}
        detailsData={[
          {
            x: 12,
            y: 1234,
            index: 1
          },
          {
            x: 123,
            y: 432,
            index: 2
          }
        ]}
        fee={1n}
      />
    )
  }
}
