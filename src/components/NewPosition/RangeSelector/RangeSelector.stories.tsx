import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { useState } from 'react'
import RangeSelector from './RangeSelector'

const meta = {
  title: 'Components/RangeSelector',
  component: RangeSelector
} satisfies Meta<typeof RangeSelector>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    currentPairReversed: false,
    isXtoY: true,
    midPrice: { x: 1, index: 1 },
    concentrationArray: [0.1, 0.2, 0.3, 0.4, 0.5],
    concentrationIndex: 2,
    data: [
      {
        index: 1,
        x: 1,
        y: 1
      }
    ],
    getTicksInsideRange: fn(),
    initialIsDiscreteValue: false,
    minimumSliderIndex: 0,
    onChangeRange: fn(),
    onDiscreteChange: fn(),
    poolIndex: 0,
    reloadHandler: fn(),
    setConcentrationIndex: fn(),
    ticksLoading: false,
    tickSpacing: 1,
    tokenASymbol: 'BTC',
    tokenBSymbol: 'ETH',
    xDecimal: 9,
    yDecimal: 12
  },
  render: args => {
    const [concentrationIndex, setConcentrationIndex] = useState(2)
    return (
      <RangeSelector
        {...args}
        concentrationIndex={concentrationIndex}
        setConcentrationIndex={setConcentrationIndex}
        tickSpacing={1}
        xDecimal={9}
        yDecimal={12}
        poolIndex={0}
      />
    )
  }
}
