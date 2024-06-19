import type { Meta, StoryObj } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'
import { PositionsList } from './PositionsList'
import { tokens } from '../../stories/data'

const meta = {
  title: 'PositionsList',
  component: PositionsList,
  decorators: [
    Story => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    )
  ]
} satisfies Meta<typeof PositionsList>

export default meta
type Story = StoryObj<typeof meta>

const data = [
  {
    tokenXName: 'BTC',
    tokenYName: 'AZERO',
    tokenXIcon: tokens[0].logoURI,
    tokenYIcon: tokens[1].logoURI,
    tokenXLiq: 5000,
    tokenYLiq: 300.2,
    min: 2149.6,
    max: 149.6,
    fee: 0.05,
    valueX: 10000.45,
    valueY: 2137.4,
    id: 1,
    address: 'tokenx'
  },
  {
    tokenXName: 'BTC',
    tokenYName: 'AZERO',
    tokenXIcon: tokens[0].logoURI,
    tokenYIcon: tokens[1].logoURI,
    tokenXLiq: 5000,
    tokenYLiq: 300.2,
    min: 2149.6,
    max: 149.6,
    fee: 0.05,
    valueX: 10000.45,
    valueY: 2137.4,
    id: 2,
    address: 'tokeny'
  },
  {
    tokenXName: 'BTC',
    tokenYName: 'AZERO',
    tokenXIcon: tokens[0].logoURI,
    tokenYIcon: tokens[1].logoURI,
    tokenXLiq: 5000,
    tokenYLiq: 300.2,
    min: 2149.6,
    max: 149.6,
    fee: 0.05,
    valueX: 10000.45,
    valueY: 2137.4,
    id: 3,
    address: 'tokenx'
  },
  {
    tokenXName: 'BTC',
    tokenYName: 'AZERO',
    tokenXIcon: tokens[0].logoURI,
    tokenYIcon: tokens[1].logoURI,
    tokenXLiq: 5000,
    tokenYLiq: 300.2,
    min: 2149.6,
    max: 149.6,
    fee: 0.05,
    valueX: 10000.45,
    valueY: 2137.4,
    id: 4,
    address: 'tokeny'
  }
]

const handleClick = () => {
  console.log('actionButton add Position')
}

export const Primary: Story = {
  args: {
    data,
    onAddPositionClick: handleClick,
    itemsPerPage: 5,
    noConnectedBlockerProps: {
      onConnect: () => {}
    },
    searchValue: '',
    searchSetValue: () => {},
    handleRefresh: () => {},
    initialPage: 1,
    setLastPage: () => {}
  }
}
