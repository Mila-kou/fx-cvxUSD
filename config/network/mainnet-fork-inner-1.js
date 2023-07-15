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
const chainInfo = {
  id: '0x1',
  token: 'ETH',
  label: 'Phalcon-Inner',
  rpcUrl: 'https://rpc.phalcon.xyz/rpc_f459d40bea3447cebc00767d6257248f',
}

const contracts = {
  ...tokensInfo.contracts,

  ChainlinkTwapOracleV3: '0x1109E1f9e6D4A15EabAdb22dE11B3077DD2be793',
  fETH: '0xd6e6561Ed9D4a041a2e0c771A06aCCA82765635C',
  xETH: '0x1CCdE657685926e342D12dF5F33d555985FBd0C3',
  fx_Market: '0x3CB1ee412b295aC5B45952658fD70c2DeEc3B59e',
  fx_stETHTreasury: '0x79e3868f36E2F38d2D4C71190D259b614d1d5Fe2',
  fx_stETHGateway: '0x58A76E9C37B89718fE05446C19850249B9564C5B',

  fx_StabilityPool: '0x7d42f87D19D872B5d343aaC09D8436ab276F9d38',

  LiquidatorWithBonusToken: '0x2394b0433Bd5769Dc16FdBaf5d24f862fc855fFc',
  wstETHWrapper: '0x0338B5CCEe1B9297d242A2f0836379470D2e857C'

  // fx_Treasury: '0x908f0F329d4cab59Ae962b9ba119d7524fDF002B',
  // fx_ETHGateway: '0x38E0C09F0827326d1Cd603Da150346b2597b2792',
}


const tokens = {
  ...tokensInfo.tokens,
  fETH: '0xd6e6561Ed9D4a041a2e0c771A06aCCA82765635C',
  xETH: '0x1CCdE657685926e342D12dF5F33d555985FBd0C3',
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
