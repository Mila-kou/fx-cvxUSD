import tokensInfo from '../tokens'

// ---------- 10540,
const chainInfo = {
  id: '0x292c',
  token: 'ETH',
  label: 'Mainnet Fork',
  rpcUrl: 'https://apitest.aladdin.club/rpc1',
}

const explorerUri = 'https://www.etherscan.io'

// ---------- 10548
// const chainInfo = {
//   id: '0x2934',
//   token: 'ETH',
//   label: 'Mainnet Fork',
//   rpcUrl: 'https://apitest.aladdin.club/rpc',
//   explorerUri: 'https://www.etherscan.io',
// }

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
  chainInfo,
  tokens,
  contracts,
  TOKENS_INFO,
  explorerUri,
}
