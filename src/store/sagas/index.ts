import { all, spawn } from '@redux-saga/core/effects'
import { poolsSaga } from './pools'
import { positionsSaga } from './positions'
import { walletSaga } from './wallet'
import { swapSaga } from './swap'
import { statsSaga } from './stats'

function* rootSaga(): Generator {
  yield all([walletSaga, poolsSaga, positionsSaga, swapSaga, statsSaga].map(spawn))
}
export default rootSaga
