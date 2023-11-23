import tokensInfo from './tokens'

const CHAIN_ID = 10547

const NETWORK_NAME = 'mainnet-fork'

const devRpcurl = [CHAIN_ID, 'https://apitest.aladdin.club/rpc10547']

const contracts = {
  ...tokensInfo.contracts,
}

const tokens = {
  ...tokensInfo.tokens,
}

const TOKENS_INFO = {
  ...tokensInfo.TOKENS_INFO,
}
const gaugeTokenList = {
  ...tokensInfo.gaugeTokenList,
}

export default {
  CHAIN_ID,
  devRpcurl,
  NETWORK_NAME,
  tokens,
  contracts,
  TOKENS_INFO,
  gaugeTokenList,
  getTokenInfoByAddress: tokensInfo.getTokenInfoByAddress,
}
