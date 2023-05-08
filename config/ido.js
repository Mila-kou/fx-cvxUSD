import tokens from './tokens'

export const tokensList = {
  depositTokens: [
    {
      symbol: 'ETH',
      // icon: clevUSDFraxBpLpIcon,
      address: tokens.tokens.eth,
      needZap: false,
      isLp: false,
    },
  ],
}

export default {
  tokensList,
}
