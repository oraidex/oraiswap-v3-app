import { all, spawn } from '@redux-saga/core/effects'
import { poolsSaga } from './pools'
import { positionsSaga } from './positions'
// import { swapSaga } from './swap'
import { walletSaga } from './wallet'

function* rootSaga(): Generator {
  yield all([positionsSaga].map(spawn))
}
export default rootSaga
