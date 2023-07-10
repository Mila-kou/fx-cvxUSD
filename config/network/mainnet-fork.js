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
  id: '0x2707',
  token: 'ETH',
  label: 'Mainnet Fork',
  rpcUrl: 'https://rpc.phalcon.xyz/rpc_942dd1172f3349ce8ff1d1a6bbffaac2',
}

const contracts = {
  ...tokensInfo.contracts,

  ChainlinkTwapOracleV3: '0xf651a9E5eF8a4E35133e91a851838638853814ae',
  fETH: '0x056cdD95DdF742DB771F5A1F76aF6C39987Cc9E3',
  xETH: '0x7f12E5c14AcED183FD6b9ECf82E5F481F284dB41',
  fx_Market: '0xaE942FBB54cB3C0a2B9F65090bE6dfc487CeC84A',
  fx_stETHTreasury: '0xa8F4242793b65fF4E939C486b88E35D1a216B50a',
  fx_stETHGateway: '0x43697A3a9003F42A7518c1D12b9051972B259a8d',

  fx_StabilityPool: '0x57c9f5a2fC8D4fEd08e563Efc817Af89C4dE9dAf',

  LiquidatorWithBonusToken: '0x0FD4653B77565C4e3a0580F87B521403762f638E',
  wstETHWrapper: '0x72d62875684d7A6b64410E49A92fC43de903C06a'

  // fx_Treasury: '0x908f0F329d4cab59Ae962b9ba119d7524fDF002B',
  // fx_ETHGateway: '0x38E0C09F0827326d1Cd603Da150346b2597b2792',
}


const tokens = {
  ...tokensInfo.tokens,
  fETH: '0x056cdD95DdF742DB771F5A1F76aF6C39987Cc9E3',
  xETH: '0x7f12E5c14AcED183FD6b9ECf82E5F481F284dB41',
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
