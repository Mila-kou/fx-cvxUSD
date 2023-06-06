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
  fETH: '0xd35E92d691e2423620CdeEdbbD4399BD812A712C',
  xETH: '0x7F44dD8AEf82429B091c45e40f69d31661f521Ac',
  fx_Market: '0x2932fFe5d52a3Ff38FD3165C7BCEc3d853a90552',
  fx_Treasury: '0xf27927a32f28B91912FE3e9167b71c530E3186d7',
  fx_ETHGateway: '0x52E0d4cc3BF2A4A016D36e5851403d2FB30c22AC',
}

const tokens = {
  ...tokensInfo.tokens,
  fETH: '0xd35E92d691e2423620CdeEdbbD4399BD812A712C',
  xETH: '0x7F44dD8AEf82429B091c45e40f69d31661f521Ac',
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
