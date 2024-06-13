import { OraichainNetworks } from '@store/consts/static'
import type { StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import ChangeWalletButton from './ChangeWalletButton'
import SelectNetworkButton from './SelectNetworkButton'
import SelectRPCButton from './SelectRPCButton'

import { action } from '@storybook/addon-actions'
import { Network } from '@store/consts/utils'

const meta = {
  title: 'Buttons/HeaderButtons',
  argTypes: {
    onConnect: { action: 'connect' },
    onDisconnect: { action: 'disconnect' },
    onSelect: { action: 'select' },
    onRPC: { action: 'rpc' },
    onNetworkSelect: { action: 'network' },
    onFaucet: { action: 'faucet' },
    onLanding: { action: 'landing' }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const ConnectWallet: Story = {
  render: () => (
    <div style={{ padding: '100px' }}>
      <ChangeWalletButton
        name='Connect Wallet'
        connected={false}
        onConnect={action('connect')}
        onDisconnect={fn}
        className=''
        hideArrow
      />
    </div>
  )
}

export const WalletConnected: Story = {
  render: () => (
    <div style={{ padding: '100px' }}>
      <ChangeWalletButton
        name='Connected'
        connected={true}
        onConnect={fn}
        onDisconnect={action('disconnect')}
        className=''
        hideArrow
      />
    </div>
  )
}

export const SelectNetwork: Story = {
  render: () => (
    <div style={{ padding: '100px' }}>
      <SelectNetworkButton
        name={Network.Testnet}
        networks={[{ networkType: Network.Testnet, rpc: OraichainNetworks.TEST }]}
        onSelect={(networkType, rpc) => action('chosen: ' + networkType + ' ' + rpc)()}
      />
    </div>
  )
}

export const SelectRPC: Story = {
  render: () => (
    <div style={{ padding: '100px' }}>
      <SelectRPCButton
        rpc={OraichainNetworks.TEST}
        networks={[
          {
            networkType: Network.Testnet,
            rpc: OraichainNetworks.TEST,
            rpcName: 'Testnet'
          }
        ]}
        onSelect={(networkType, rpc) => action('chosen: ' + networkType + ' ' + rpc)()}
      />
    </div>
  )
}
