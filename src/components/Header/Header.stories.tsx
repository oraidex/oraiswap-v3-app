import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import Header from './Header'
import { MemoryRouter } from 'react-router-dom'

const meta = {
  title: 'Layout/Header',
  component: Header,
  args: {},
  decorators: [
    Story => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    )
  ]
} satisfies Meta<typeof Header>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    address: 'orai1h6u9m24mnvmyadj8pmcfvcd0yrjfwur4lrcn4hy25wn80mannz0qwt67m7',
    defaultTestnetRPC: 'https://testnet.rpc.orai.io',
    landing: '',
    onConnectWallet: fn(),
    onDisconnectWallet: fn(),
    onNetworkSelect: fn(),
    rpc: 'https://rpc.orai.io',
    typeOfNetwork: 'Testnet',
    walletConnected: true,
    onFaucet: fn()
  }
}
