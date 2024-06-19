import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { MemoryRouter } from 'react-router-dom'
import SinglePositionPlot from './SinglePositionPlot'

const meta = {
  title: 'Components/SinglePositionPlot',
  component: SinglePositionPlot,
  decorators: [
    Story => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    )
  ]
} satisfies Meta<typeof SinglePositionPlot>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    currentPrice: 10000,
    data: [],
    initialIsDiscreteValue: false,
    leftRange: {
      index: 2,
      x: 10000
    },
    rightRange: {
      index: 2,
      x: 10000
    },
    max: 100,
    min: 0,
    midPrice: {
      x: 1,
      index: 1
    },
    onDiscreteChange: fn(),
    reloadHandler: fn(),
    ticksLoading: false,
    tickSpacing: 1,
    tokenX: {
      name: 'BTC',
      decimal: 9
    },
    tokenY: {
      name: 'ETH',
      decimal: 12
    },
    xToY: true,
    hasTicksError: false
  },
  render: args => {
    return (
      <SinglePositionPlot
        {...args}
        currentPrice={10000}
        leftRange={{
          index: 2,
          x: 10000
        }}
        rightRange={{
          index: 2,
          x: 10000
        }}
        midPrice={{
          index: 2,
          x: 1020
        }}
        tokenX={{
          name: 'BTC',
          decimal: 9
        }}
        tokenY={{
          name: 'ETH',
          decimal: 12
        }}
      />
    )
  }
}
