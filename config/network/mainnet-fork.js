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

const contracts = {
  ...tokensInfo.contracts,

  ChainlinkTwapOracleV3: '0x0F221dD4d8224eCD6ec905AEA2D1602C5D5c36B4',
  fETH: '0xdBB1AAeb04F3B5e2587E4bB849717E9ebD0c8acC',
  xETH: '0x4eECa6bFa3C96210260691639827eEF4D80FA8C6',
  fx_Market: '0x7185E3477Ad54A8186e623768833e8C2686591D3',
  fx_stETHTreasury: '0xe6AAF8fBB56488941f619A9ADB0EB4d89fA9d217',
  fx_stETHGateway: '0x674A745ADb09c3333D655cC63e2d77ACbE6De935',

  fx_StabilityPool: '0x719c287932B0ea6037862b4cec4A786939DEb1d8',
  
  LiquidatorWithBonusToken: '0xBED3FEBBB237AeDdAc81904aD49a93143d5026C8',
  wstETHWrapper: '0x7b9Bb9CdBb04BF57F2F82e51D54F6C8ee165FF3B'

  // fx_Treasury: '0x908f0F329d4cab59Ae962b9ba119d7524fDF002B',
  // fx_ETHGateway: '0x38E0C09F0827326d1Cd603Da150346b2597b2792',
}

const tokens = {
  ...tokensInfo.tokens,
  fETH: '0xdBB1AAeb04F3B5e2587E4bB849717E9ebD0c8acC',
  xETH: '0x4eECa6bFa3C96210260691639827eEF4D80FA8C6',
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
  }
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
