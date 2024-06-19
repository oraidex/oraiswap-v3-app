import type { Meta, StoryObj } from '@storybook/react'
import PoolInit from './PoolInit'
import { fn } from '@storybook/test'
import { useState } from 'react'

const meta = {
  title: 'Components/PoolInit',
  component: PoolInit
} satisfies Meta<typeof PoolInit>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    currentPairReversed: false,
    isXtoY: true,
    midPrice: 1n, //Storybook doesn't support bigint correctly
    onChangeMidPrice: fn(),
    onChangeRange: fn(),
    tickSpacing: 1,
    tokenASymbol: 'BTC',
    tokenBSymbol: 'ETH',
    xDecimal: 9,
    yDecimal: 12
  },
  render: args => {
    const [midPrice, setMidPrice] = useState(0n)
    return (
      <PoolInit
        {...args}
        midPrice={midPrice}
        onChangeMidPrice={setMidPrice}
        tickSpacing={1}
        xDecimal={9}
        yDecimal={12}
      />
    )
  }
}
