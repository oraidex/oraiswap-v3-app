import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { OraichainNetworks } from '@store/consts/static'
import { PayloadType } from '@store/consts/types'

export enum Status {
  Uninitialized = 'uninitialized',
  Init = 'init',
  Error = 'error',
  Initialized = 'initalized'
}
export interface IOraichainConnectionStore {
  status: Status
  message: string
  networkType: Network
  blockNumber: number
  rpcAddress: string
  dexAddress: string
}

export const defaultState: IOraichainConnectionStore = {
  status: Status.Uninitialized,
  message: '',
  networkType: 'Mainnet',
  blockNumber: 0,
  rpcAddress: OraichainNetworks.MAIN,
  dexAddress: import.meta.env.VITE_CONTRACT_ADDRESS
}
export const connectionSliceName = 'connection'
const connectionSlice = createSlice({
  name: connectionSliceName,
  initialState: defaultState,
  reducers: {
    initOraichainConnection(state) {
      state.status = Status.Init
      return state
    },
    setStatus(state, action: PayloadAction<Status>) {
      state.status = action.payload
      return state
    },
    setMessage(state, action: PayloadAction<string>) {
      state.message = action.payload
      return state
    },
    setNetwork(
      state,
      action: PayloadAction<{
        networkType: Network
        rpcAddress: string
        rpcName?: string
      }>
    ) {
      state.networkType = action.payload.networkType
      state.rpcAddress = action.payload.rpcAddress
      return state
    },
    updateSlot(state) {
      return state
    },
    setSlot(state, action: PayloadAction<number>) {
      state.blockNumber = action.payload
      return state
    }
  }
})

export const actions = connectionSlice.actions
export const reducer = connectionSlice.reducer
export type PayloadTypes = PayloadType<typeof actions>
