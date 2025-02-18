import { createSlice } from '@reduxjs/toolkit'

const tokens = {}

const list = [
  'ETH',
  'fETH',
  'xETH',
  'stETH',
  'wstETH',
  'frxETH',
  'sfrxETH',
  'xstETH',
  'xfrxETH',
  'fxUSD',
  'USDC',
  'USDT',
  'WETH',
  'FXN',
  'Frax',
  'crvUSD',

  'rUSD',
  'eETH',
  'weETH',
  'xeETH',
  'ezETH',
  'xezETH',

  'CVX',
  'aCVX',
  'cvxUSD',
  'xCVX',

  'btcUSD',
  'WBTC',
  'xWBTC',
]

list.forEach((item) => {
  tokens[item] = {
    price: 0,
    balance: 0,
  }
})

const initialState = {
  tokens,
  tokenPrice: {},
  lps: {},
}

const slice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    updateTokens: (state, action) => {
      state.tokens = {
        ...state.tokens,
        ...action.payload,
      }
    },
    updateTokenPrice: (state, action) => {
      state.tokenPrice = action.payload
    },
    updateLps: (state, action) => {
      state.lps = {
        ...state.lps,
        ...action.payload,
      }
    },
  },
})

export default slice.reducer

export const { updateTokens, updateTokenPrice } = slice.actions
