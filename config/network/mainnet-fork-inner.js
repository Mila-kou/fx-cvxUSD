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
  id: '0x1864e', // 99918
  token: 'ETH',
  label: 'online-1',
  rpcUrl:
    'https://rpc.phalcon.blocksec.com/rpc_ed3f76d88fac4cf5a1adeae87afce429',
}

// const chainInfo = {
//   id: '0x1864c', // 99916
//   token: 'ETH',
//   label: 'online-2',
//   rpcUrl:
//     'https://rpc.phalcon.blocksec.com/rpc_21320a5eee4e4eb18eba48ad926b04d3',
// }

const contracts = {
  ...tokensInfo.contracts,

  // ChainlinkTwapOracleV3: '0x460B3CdE57DfbA90DBed02fd83d3990a92DA1230',
  // fETH: '0x53805A76E1f5ebbFE7115F16f9c87C2f7e633726',
  // xETH: '0xe063F04f280c60aECa68b38341C2eEcBeC703ae2',
  // fx_Market: '0xe7b9c7c9cA85340b8c06fb805f7775e3015108dB',
  // fx_stETHTreasury: '0x0e5CAA5c889Bdf053c9A76395f62267E653AFbb0',
  // fx_stETHGateway: '0x4C5C52d507066780500e627d592DbE11476E7c21',

  // fx_RebalancePool_A: '0xa677d95B91530d56791FbA72C01a862f1B01A49e',

  // fx_ETHGateway: '0x38E0C09F0827326d1Cd603Da150346b2597b2792',
}

const tokens = {
  ...tokensInfo.tokens,
  // fETH: '0x53805A76E1f5ebbFE7115F16f9c87C2f7e633726',
  // xETH: '0xe063F04f280c60aECa68b38341C2eEcBeC703ae2',
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
