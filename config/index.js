/* eslint-disable global-require */

// Configs irrelated to network
const CHAIN_MAPPING = {
  1: 'Mainnet',
  3: 'Ropsten',
  42: 'Kovan',
  4: 'Rinkeby',
  128: 'Heco',
  256: 'Heco Test',
}

const explorerUri = 'http://www.etherscan.io'

const enableCachedLpPrice = false

const isServerData = true

export const ChainsInfo = {
  1: {
    chainId: 1,
    chainName: 'Ethereum',
    shortName: 'Ethereum',
    rpcUrls: ['https://main-rpc.linkpool.io'],
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    blockExplorerUrl: 'https://etherscan.io/',
  },
}

const ALLOWS_CHAINS = [1, 10548]

console.log(process.env.NETWORK_ENV, '???')

const NET_STATUS = {
  checkUser: 3,
  checkNetWork: 2,
  checkWeb3: 1,
  err: 0,
}

const coingeckoURL = 'https://api.coingecko.com/api/v3'

const API = `https://api.aladdin.club/api/`
const concentratorAPI =
  process.env.NETWORK_ENV === 'mainnet-fork'
    ? 'https://apitest.aladdin.club'
    : `https://api.aladdin.club`

const stakingStartTime = 1631289693000
const zeroAddress = '0x0000000000000000000000000000000000000000'
const defaultAddress = '0x1111111111111111111111111111111111111111'
const uint256Max =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935'
const SECONDS_PER_YEAR = '31536000'

let envConf = {}

switch (process.env.NETWORK_ENV) {
  case 'mainnet':
    envConf = require('./mainnet').default
    break
  case 'mainnet-fork':
    envConf = require('./mainnet-fork').default
    break
  default:
    envConf = require('./mainnet').default
}
// envConf = mainConfig

export default {
  concentratorAPI,
  enableCachedLpPrice,
  explorerUri,
  coingeckoURL,
  API,
  NET_STATUS,
  CHAIN_MAPPING,
  ALLOWS_CHAINS,
  zeroAddress,
  defaultAddress,
  ...envConf,
  stakingStartTime,
  isServerData,
  uint256Max,
  SECONDS_PER_YEAR,
}
