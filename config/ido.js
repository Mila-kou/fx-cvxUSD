import tokens from './tokens'

export const tokensList = {
  depositTokens: [
    {
      symbol: 'ETH',
      icon: '/tokens/crypto-icons-stack.svg',
      address: tokens.tokens.eth,
      needZap: false,
      isLp: false,
    },
  ],
}

export default {
  tokensList,
}
