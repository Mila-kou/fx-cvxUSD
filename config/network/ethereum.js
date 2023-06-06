import tokensInfo from '../tokens'

const chainInfo = {
  id: '0x1',
  token: 'ETH',
  label: 'Ethereum Mainnet',
  rpcUrl:
    'https://eth-mainnet.alchemyapi.io/v2/NYoZTYs7oGkwlUItqoSHJeqpjqtlRT6m',
}

const explorerUri = 'https://www.etherscan.io'

const contracts = {
  ...tokensInfo.contracts,
}

const tokens = {
  ...tokensInfo.tokens,
}

const TOKENS_INFO = {
  ...tokensInfo.TOKENS_INFO,
}

export default {
  tokens,
  contracts,
  TOKENS_INFO,
  chainInfo,
  explorerUri
}
