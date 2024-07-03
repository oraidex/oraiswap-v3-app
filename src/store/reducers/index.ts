import { combineReducers } from 'redux'
import { reducer as snackbarsReducer, snackbarsSliceName } from './snackbars'
import { connectionSliceName, reducer as connectionReducer } from './connection'
import { walletSliceName, reducer as walletReducer } from './wallet'
import { positionsSliceName, reducer as positionsReducer } from './positions'
import { poolsSliceName, reducer as poolsReducer } from './pools'
import { swapSliceName, reducer as swapReducer } from './swap'
import { statsSliceName, reducer as statsReducer } from './stats'

const combinedReducers = combineReducers({
  [snackbarsSliceName]: snackbarsReducer,
  [connectionSliceName]: connectionReducer,
  [walletSliceName]: walletReducer,
  [positionsSliceName]: positionsReducer,
  [poolsSliceName]: poolsReducer,
  [swapSliceName]: swapReducer,
  [statsSliceName]: statsReducer,
})

export default combinedReducers
