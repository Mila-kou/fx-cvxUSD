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
  id: '0x2934',
  token: 'ETH',
  label: 'Mainnet Fork',
  rpcUrl: 'https://apitest.aladdin.club/rpc',
}
// const chainInfo = {
//   id: '0x2934',
//   token: 'ETH',
//   label: 'Mainnet Fork-10548',
//   rpcUrl: 'https://rpc.phalcon.xyz/rpc_999ebf7d68bb4a2e9c81c59c3e597280',
// }

const contracts = {
  ...tokensInfo.contracts,
}

const tokens = {
  ...tokensInfo.tokens,
}

const TOKENS_INFO = {
  ...tokensInfo.TOKENS_INFO,
  fETH: ['fETH', tokens.fETH, 18],
}

const POOLS_LIST_GAUGE = {
  ...tokensInfo.POOLS_LIST_GAUGE,
}

const zapTokens = {
  ...tokensInfo.zapTokens,
  fETH: {
    symbol: 'fETH',
    icon: 'eth',
    decimals: TOKENS_INFO.fETH[2],
    address: TOKENS_INFO.fETH[1],
    needZap: true,
  },
}

export default {
  tokens,
  contracts,
  TOKENS_INFO,
  chainInfo,
  explorerUri,
  POOLS_LIST_GAUGE,
  zapTokens,
}
