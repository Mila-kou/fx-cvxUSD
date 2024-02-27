import { createSlice } from '@reduxjs/toolkit'
import { GAUGE_LIST } from '@/config/aladdinVault'

const initialState = GAUGE_LIST

const slice = createSlice({
  name: 'gauge',
  initialState,
  reducers: {
    updateGauge: (state, action) => {
      state = action.payload
    },
  },
})

export default slice.reducer

export const { updateGauge } = slice.actions
