import type { Meta, StoryObj } from '@storybook/react'
import SelectNetwork from './SelectNetwork'

const meta = {
  title: 'Modals/SelectNetwork',
  component: SelectNetwork,
  args: {
    activeNetwork: 'Testnet',
    anchorEl: null,
    handleClose: () => {},
    networks: [
      {
        networkType: 'Testnet',
        rpc: 'https://testnet-mock.com',
        rpcName: 'Testnet'
      },
      {
        networkType: 'Mainnet',
        rpc: 'https://mock.com',
        rpcName: 'Mainnet'
      }
    ],
    onSelect: () => {},
    open: true
  }
} satisfies Meta<typeof SelectNetwork>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}
