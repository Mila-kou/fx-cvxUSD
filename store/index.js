import { configureStore } from '@reduxjs/toolkit'
import asset from './slices/asset'
import token from './slices/token'
import root from './slices/root'
import baseToken from './slices/baseToken'
import genesis from './slices/genesis'
import gauge from './slices/gauge'

export const store = configureStore({
  reducer: {
    asset,
    token,
    root,
    baseToken,
    genesis,
    gauge,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})
