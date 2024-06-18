import { Liquidity, PoolKey, Position, SqrtPrice, Tick, TokenAmount } from '@wasm'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { PayloadType } from '@store/consts/types'

export interface PositionsListStore {
  list: Position[]
  loading: boolean
}
export interface PlotTickData {
  x: number
  y: number
  index: bigint
}

export type TickPlotPositionData = Omit<PlotTickData, 'y'>
export interface PlotTicks {
  data: PlotTickData[]
  loading: boolean
  hasError?: boolean
}

export interface InitPositionStore {
  inProgress: boolean
  success: boolean
}
export interface CurrentPositionTicksStore {
  lowerTick?: Tick
  upperTick?: Tick
  loading: boolean
}

export interface IPositionsStore {
  lastPage: number
  plotTicks: PlotTicks
  positionsList: PositionsListStore
  currentPositionTicks: CurrentPositionTicksStore
  initPosition: InitPositionStore
}
export interface InitPositionData {
  poolKeyData: PoolKey
  lowerTick: bigint
  upperTick: bigint
  liquidityDelta: Liquidity
  spotSqrtPrice: SqrtPrice
  slippageTolerance: bigint
  tokenXAmount: TokenAmount
  tokenYAmount: TokenAmount
  initPool?: boolean
}
export interface GetCurrentTicksData {
  poolKey: PoolKey
  isXtoY: boolean
  disableLoading?: boolean
}

export interface ClosePositionData {
  positionIndex: bigint
  claimFarmRewards?: boolean
  onSuccess: () => void
  addressTokenX: string
  addressTokenY: string
}

export interface SetPositionData {
  index: bigint
  position: Position
}

export interface GetPositionTicks {
  poolKey: PoolKey
  lowerTickIndex: bigint
  upperTickIndex: bigint
}

export interface HandleClaimFee {
  index: bigint
  addressTokenX: string
  addressTokenY: string
}

export const defaultState: IPositionsStore = {
  lastPage: 1,
  plotTicks: {
    data: [],
    loading: false
  },
  positionsList: {
    list: [],
    loading: true
  },
  currentPositionTicks: {
    lowerTick: undefined,
    upperTick: undefined,
    loading: false
  },
  initPosition: {
    inProgress: false,
    success: false
  }
}

export const positionsSliceName = 'positions'
const positionsSlice = createSlice({
  name: 'positions',
  initialState: defaultState,
  reducers: {
    setLastPage(state, action: PayloadAction<number>) {
      console.log('setLastPage')
      state.lastPage = action.payload
      return state
    },
    initPosition(state, _action: PayloadAction<InitPositionData>) {
      console.log('initPosition')
      state.initPosition.inProgress = true
      return state
    },
    setInitPositionSuccess(state, action: PayloadAction<boolean>) {
      console.log('setInitPositionSuccess')
      state.initPosition.inProgress = false
      state.initPosition.success = action.payload
      return state
    },
    setPlotTicks(state, action: PayloadAction<PlotTickData[]>) {
      console.log('setPlotTicks')
      state.plotTicks.data = action.payload
      state.plotTicks.loading = false
      state.plotTicks.hasError = false
      return state
    },
    setErrorPlotTicks(state, action: PayloadAction<PlotTickData[]>) {
      console.log('setErrorPlotTicks')
      state.plotTicks.data = action.payload
      state.plotTicks.loading = false
      state.plotTicks.hasError = true
      return state
    },
    getCurrentPlotTicks(state, action: PayloadAction<GetCurrentTicksData>) {
      console.log('getCurrentPlotTicks')
      state.plotTicks.loading = !action.payload.disableLoading
      return state
    },
    setPositionsList(state, action: PayloadAction<Position[]>) {
      console.log('setPositionsList')
      state.positionsList.list = action.payload
      state.positionsList.loading = false
      return state
    },
    getPositionsList(state) {
      console.log('getPositionsList')
      state.positionsList.loading = true
      return state
    },
    getSinglePosition(state, _action: PayloadAction<bigint>) {
      console.log('getSinglePosition')
      return state
    },
    setSinglePosition(state, action: PayloadAction<SetPositionData>) {
      console.log('setSinglePosition')
      state.positionsList.list[Number(action.payload.index)] = action.payload.position
      return state
    },
    getCurrentPositionTicks(state, _action: PayloadAction<GetPositionTicks>) {
      console.log('getCurrentPositionTicks')
      state.currentPositionTicks.loading = true
      return state
    },
    setCurrentPositionTicks(state, action: PayloadAction<{ lowerTick?: Tick; upperTick?: Tick }>) {
      console.log('setCurrentPositionTicks')
      state.currentPositionTicks = {
        ...action.payload,
        loading: false
      }
      return state
    },
    claimFee(state, _action: PayloadAction<HandleClaimFee>) {
      return state
    },
    closePosition(state, _action: PayloadAction<ClosePositionData>) {
      return state
    },
    resetState(state) {
      state = defaultState
      return state
    }
  }
})

export const actions = positionsSlice.actions
export const reducer = positionsSlice.reducer
export type PayloadTypes = PayloadType<typeof actions>
