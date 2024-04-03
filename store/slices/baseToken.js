import { createSlice } from '@reduxjs/toolkit'
import { BASE_TOKENS_MAP } from '@/config/tokens'

const initialState = {
  wstETH: {
    ...BASE_TOKENS_MAP.wstETH,
    data: {},
  },
  sfrxETH: {
    ...BASE_TOKENS_MAP.sfrxETH,
    data: {},
  },
  weETH: {
    ...BASE_TOKENS_MAP.weETH,
    data: {},
  },
  ezETH: {
    ...BASE_TOKENS_MAP.ezETH,
    data: {},
  },
  aCVX: {
    ...BASE_TOKENS_MAP.aCVX,
    data: {},
  },
}

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
