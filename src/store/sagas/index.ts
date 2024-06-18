import { all, spawn } from '@redux-saga/core/effects'
import { poolsSaga } from './pools'
import { positionsSaga } from './positions'
// import { swapSaga } from './swap'
import { walletSaga } from './wallet'
import { swapSaga } from './swap'

function* rootSaga(): Generator {
  yield all([walletSaga, poolsSaga, positionsSaga, swapSaga].map(spawn))
}
export default rootSaga
