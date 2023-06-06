import tokensInfo from './tokens'

const CHAIN_ID = 11155111

const NETWORK_NAME = 'Sepolia'

const devRpcurl = [CHAIN_ID, 'https://rpc.sepolia.org']

const contracts = {
  ...tokensInfo.contracts,
  multiCall: '0x25eef291876194aefad0d60dff89e268b90754bb',

  ChainlinkTwapOracleV3: '0x0F221dD4d8224eCD6ec905AEA2D1602C5D5c36B4',
  fETH: '0x0c8b13cF0439a1D9255BA6912C972Ee4d06639fB',
  xETH: '0xbB0B8D49D4E92cEdEc1F63dFdbbB2Ba6818c2182',
  fx_Market: '0x0c5623BcfF74b5429e7E6E4C86f18E004775697a',
  fx_Treasury: '0x908f0F329d4cab59Ae962b9ba119d7524fDF002B',
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

export default {
  CHAIN_ID,
  devRpcurl,
  NETWORK_NAME,
  tokens,
  contracts,
  TOKENS_INFO,
}
