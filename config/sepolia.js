import tokensInfo from './tokens'

const CHAIN_ID = 11155111

const NETWORK_NAME = 'Sepolia'

const devRpcurl = [CHAIN_ID, 'https://rpc.sepolia.org']

const contracts = {
  ...tokensInfo.contracts,
  ChainlinkTwapOracleV3: '0x0F221dD4d8224eCD6ec905AEA2D1602C5D5c36B4',
  fETH: '0xcAD8810BfBbdd189686062A3A399Fc3eCAbB5164',
  xETH: '0x7F44dD8AEf82429B091c45e40f69d31661f521Ac',
  fx_Market: '0x2932fFe5d52a3Ff38FD3165C7BCEc3d853a90552',
  fx_Treasury: '0xf27927a32f28B91912FE3e9167b71c530E3186d7',
  fx_ETHGateway: '0x52E0d4cc3BF2A4A016D36e5851403d2FB30c22AC',
}

const tokens = {
  ...tokensInfo.tokens,
  fETH: '0xcAD8810BfBbdd189686062A3A399Fc3eCAbB5164',
  xETH: '0x7F44dD8AEf82429B091c45e40f69d31661f521Ac',
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
