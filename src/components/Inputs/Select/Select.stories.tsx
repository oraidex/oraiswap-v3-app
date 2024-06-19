import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import Select from './Select'
import { tokens } from '../../../stories/data'

const meta = {
  title: 'Inputs/Select',
  component: Select,
  args: {}
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    name: 'Select token',
    current: null,
    onSelect: fn(),
    commonTokens: [
      'So11111111111111111111111111111111111111112',
      '9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E',
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
    ],
    handleAddToken: fn(),
    initialHideUnknownTokensValue: false,
    tokens,
    onHideUnknownTokensChange: fn(),
    centered: false
  }
}
