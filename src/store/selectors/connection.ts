import { IOraichainConnectionStore, connectionSliceName } from '@store/reducers/connection'
import { AnyProps, keySelectors } from './helpers'

const store = (s: AnyProps) => s[connectionSliceName] as IOraichainConnectionStore

export const { networkType, status, blockNumber, rpcAddress, dexAddress } = keySelectors(store, [
  'networkType',
  'status',
  'blockNumber',
  'rpcAddress',
  'dexAddress'
])

export const oraichainConnectionSelectors = {
  networkType,
  status,
  blockNumber,
  rpcAddress,
  dexAddress
}

export default oraichainConnectionSelectors
