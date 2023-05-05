import tokensInfo from './tokens'

const CHAIN_ID = 1

const NETWORK_NAME = 'mainnet'
const devRpcurl = [
  1,
  'https://eth-mainnet.alchemyapi.io/v2/NYoZTYs7oGkwlUItqoSHJeqpjqtlRT6m',
]

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
  CHAIN_ID,
  devRpcurl,
  NETWORK_NAME,
  tokens,
  contracts,
  TOKENS_INFO,
}
