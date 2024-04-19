import tokensInfo from '../tokens'

// ---------- 10540,
// const chainInfo = {
//   id: '10548',
//   token: 'ETH',
//   label: 'Fork-10548',
//   rpcUrl: 'https://apitest.aladdin.club/rpc',
// }

const explorerUri = 'https://www.etherscan.io'

// ---------- 10548
const chainInfo = {
  id: '0x1',
  token: 'ETH',
  label: 'newgauge',
  rpcUrl:
    'https://rpc.phalcon.blocksec.com/rpc_e6d64596988e402caf542bfbf87aa149',
}

const contracts = {
  ...tokensInfo.contracts,
}

const tokens = {
  ...tokensInfo.tokens,
}

const TOKENS_INFO = {
  ...tokensInfo.TOKENS_INFO,
}

const POOLS_LIST_GAUGE = {
  ...tokensInfo.POOLS_LIST_GAUGE,
}

const zapTokens = {
  ...tokensInfo.zapTokens,
}

const gaugeTokenList = {
  ...tokensInfo.gaugeTokenList,
}
export default {
  tokens,
  contracts,
  TOKENS_INFO,
  chainInfo,
  explorerUri,
  POOLS_LIST_GAUGE,
  zapTokens,
  gaugeTokenList,
  getTokenInfoByAddress: tokensInfo.getTokenInfoByAddress,
}
