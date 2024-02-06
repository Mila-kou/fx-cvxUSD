import tokensInfo from '../tokens'

const chainInfo = {
  id: '0xaa36a7',
  token: 'SepoliaETH',
  label: 'Sepolia',
  rpcUrl: 'https://rpc.sepolia.org',
}

const explorerUri = 'https://sepolia.etherscan.io/'

const contracts = {
  ...tokensInfo.contracts,
  multiCall: '0x25eef291876194aefad0d60dff89e268b90754bb',

  ChainlinkTwapOracleV3: '0x0F221dD4d8224eCD6ec905AEA2D1602C5D5c36B4',
  fETH: '0x0c8b13cF0439a1D9255BA6912C972Ee4d06639fB',
  xETH: '0xbB0B8D49D4E92cEdEc1F63dFdbbB2Ba6818c2182',
  fx_Market: '0x0c5623BcfF74b5429e7E6E4C86f18E004775697a',

  fx_ETHGateway: '0x38E0C09F0827326d1Cd603Da150346b2597b2792',
}

const tokens = {
  ...tokensInfo.tokens,
  fETH: '0x0c8b13cF0439a1D9255BA6912C972Ee4d06639fB',
  xETH: '0xbB0B8D49D4E92cEdEc1F63dFdbbB2Ba6818c2182',
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
  getTokenInfoByAddress: tokensInfo.getTokenInfoByAddress,
}
