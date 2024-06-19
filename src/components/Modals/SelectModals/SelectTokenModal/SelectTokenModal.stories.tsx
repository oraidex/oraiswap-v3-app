import type { Meta, StoryObj } from '@storybook/react'
import SelectTokenModal from './SelectTokenModal'
import { fn } from '@storybook/test'
import { tokens } from '../../../../stories/data'

const meta = {
  title: 'Modals/SelectTokenModal',
  component: SelectTokenModal
} satisfies Meta<typeof SelectTokenModal>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    anchorEl: null,
    handleClose: () => {},
    onSelect: () => {},
    open: true,
    commonTokens: [],
    handleAddToken: fn(),
    initialHideUnknownTokensValue: false,
    onHideUnknownTokensChange: fn(),
    tokens
  }
}
