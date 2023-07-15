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

  ChainlinkTwapOracleV3: '0xdf0Ed4f20E2e01CF8c97a94F52061EF2a50b5Abd',
  fETH: '0x6b8dBaB9605FD4a1007e6F64176DB64482B8dB47',
  xETH: '0x828849cD2f08B3c1ACaD6587B3adb470D870DE16',
  fx_Market: '0xb33fDeB819eF5E00cd47B8939b43f41851fd6C1B',
  fx_stETHTreasury: '0x41f959F53257965Dcc6b22C8326b0EBf213D7F09',
  fx_stETHGateway: '0x5B90385dad18c2f19EEb67345713afE93eaDe748',

  fx_StabilityPool: '0x79ec7351773228d79FA585d770588c0D6A1Ad60C',

  LiquidatorWithBonusToken: '0xb890e6610369FCa71A2d00dB7DBB55f6ea05e1fb',
  wstETHWrapper: '0x5979651d542C058A2917be11804D05a652197C80'

  // fx_Treasury: '0x908f0F329d4cab59Ae962b9ba119d7524fDF002B',
  // fx_ETHGateway: '0x38E0C09F0827326d1Cd603Da150346b2597b2792',
}


const tokens = {
  ...tokensInfo.tokens,
  fETH: '0x6b8dBaB9605FD4a1007e6F64176DB64482B8dB47',
  xETH: '0x828849cD2f08B3c1ACaD6587B3adb470D870DE16',
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
