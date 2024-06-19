import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import MarketIdLabel from './MarketIdLabel'

const meta = {
  title: 'Components/MarketIdLabel',
  component: MarketIdLabel
} satisfies Meta<typeof MarketIdLabel>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    copyPoolAddressHandler: fn(),
    displayLength: 5,
    marketId: 'orai1h6u9m24mnvmyadj8pmcfvcd0yrjfwur4lrcn4hy25wn80mannz0qwt67m7'
  }
}
