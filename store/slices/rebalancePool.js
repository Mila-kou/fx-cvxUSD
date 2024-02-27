import { createSlice } from '@reduxjs/toolkit'
import { ASSET_MAP } from '@/config/tokens'

const initialState = {
  rebalancePool_A: {},
  rebalancePoolV2_A: {},
  rebalancePoolV2_B: {},
}

const slice = createSlice({
  name: 'rebalancePool',
  initialState,
  reducers: {
    updateRebalanceA: (state, action) => {
      state.rebalancePool_A = {
        ...state.rebalancePool_A,
        ...action.payload,
      }
    },
    updateRebalanceV2: (state, action) => {
      state[action.key] = {
        ...state[action.key],
        ...action.payload.data,
      }
    },
  },
})

export default slice.reducer

export const { updateRebalanceA, updateRebalanceV2 } = slice.actions
