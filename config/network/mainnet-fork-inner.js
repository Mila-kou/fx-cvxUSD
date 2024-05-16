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
// const chainInfo = {
//   id: '0x2934',
//   token: 'ETH',
//   label: 'Mainnet Fork',
//   rpcUrl: 'https://apitest.aladdin.club/rpc',
// }
// const chainInfo = {
//   id: '0x1864e', // 99918
//   token: 'ETH',
//   label: 'online-1',
//   rpcUrl:
//     'https://rpc.phalcon.blocksec.com/rpc_ed3f76d88fac4cf5a1adeae87afce429',
// }

// const chainInfo = {
//   id: '0x1864e', // 99918 0x1864d 99917
//   token: 'ETH',
//   label: 'newBtcUSD',
//   rpcUrl:
//     'https://rpc.phalcon.blocksec.com/rpc_c64f88ceb5e246c5ba32a40cb690ac4b',
// }

const chainInfo = {
  id: '0x1864d', // 9991
  token: 'ETH',
  label: 'new-oracle2',
  rpcUrl:
    'https://rpc.phalcon.blocksec.com/rpc_30a834e782d14f2e9f30eae4bcd399b1',
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
