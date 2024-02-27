import { createSlice } from '@reduxjs/toolkit'
import { GENESIS_MAP } from '@/config/tokens'

const initialState = {
  ...GENESIS_MAP,
}

const slice = createSlice({
  name: 'genesis',
  initialState,
  reducers: {
    updateGenesis: (state, action) => {
      const { symbol, ...other } = action.payload
      state[symbol] = {
        ...state[symbol],
        ...(other || {}),
      }
    },
  },
})

export default slice.reducer

export const { updateGenesis } = slice.actions
