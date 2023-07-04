import tokensInfo from '../tokens'

// ---------- 10540,
const chainInfo = {
  id: '10548',
  token: 'ETH',
  label: 'Fork-10548',
  rpcUrl: 'https://apitest.aladdin.club/rpc',
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

  ChainlinkTwapOracleV3: '0x0F221dD4d8224eCD6ec905AEA2D1602C5D5c36B4',
  fETH: '0x674A745ADb09c3333D655cC63e2d77ACbE6De935',
  xETH: '0x7b9Bb9CdBb04BF57F2F82e51D54F6C8ee165FF3B',
  fx_Market: '0x3D8faCB2b65B8CEB682ADE00E016c672Ee6262c0',
  fx_stETHTreasury: '0xBED3FEBBB237AeDdAc81904aD49a93143d5026C8',
  fx_stETHGateway: '0x92d0cb7E56806Bf977e7F5296EA2Fe84B475Fe83',

  fx_StabilityPool: "0x2Abb56D34e526Cbd01db203067f499A0d80ce3F2",

  // fx_Treasury: '0x908f0F329d4cab59Ae962b9ba119d7524fDF002B',
  // fx_ETHGateway: '0x38E0C09F0827326d1Cd603Da150346b2597b2792',
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

export default {
  tokens,
  contracts,
  TOKENS_INFO,
  chainInfo,
  explorerUri,
  POOLS_LIST_GAUGE,
  zapTokens,
}
