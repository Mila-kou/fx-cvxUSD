import { createSlice } from '@reduxjs/toolkit'
import { BASE_TOKENS_MAP } from '@/config/tokens'

const initialState = {}

Object.values(BASE_TOKENS_MAP).forEach((item) => {
  initialState[item.baseSymbol] = {
    ...item,
    data: {},
  }
})

const slice = createSlice({
  name: 'baseToken',
  initialState,
  reducers: {
    updateDataList: (state, action) => {
      action.payload.forEach((item) => {
        state[item.baseSymbol].data = {
          ...state[item.baseSymbol].data,
          ...item,
        }
      })
    },
  },
})

export default slice.reducer

export const { updateDataList } = slice.actions
