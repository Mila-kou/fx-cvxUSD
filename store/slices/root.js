import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  theme: '',
}

const slice = createSlice({
  name: 'root',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload
    },
  },
})

export default slice.reducer

export const { setTheme } = slice.actions
