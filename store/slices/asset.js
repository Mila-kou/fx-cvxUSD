import { createSlice } from '@reduxjs/toolkit'
import { ASSET_MAP } from '@/config/tokens'

const initialState = {
  ...ASSET_MAP,
}

const slice = createSlice({
  name: 'asset',
  initialState,
  reducers: {
    updateFETH: (state, action) => {
      state.fETH = {
        ...state.fETH,
        ...(action.payload || {}),
      }
    },
    updateXETH: (state, action) => {
      state.xETH = {
        ...state.xETH,
        ...(action.payload || {}),
      }
    },
    updateAsset: (state, action) => {
      const { symbol, ...other } = action.payload
      state[symbol] = {
        ...state[symbol],
        ...(other || {}),
      }
    },
  },
})

export default slice.reducer

export const { updateFETH, updateXETH, updateAsset } = slice.actions
