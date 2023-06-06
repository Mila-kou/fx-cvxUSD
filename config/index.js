import ethereum from './network/ethereum'
import mainnetFork from './network/mainnet-fork'
import sepolia from './network/sepolia'

const isForkEnv = process.env.NETWORK_ENV === 'mainnet-fork'

const chainMap = isForkEnv
  ? { [mainnetFork.chainInfo.id]: mainnetFork }
  : {
      [ethereum.chainInfo.id]: ethereum,
      [sepolia.chainInfo.id]: sepolia,
    }

const allowChains = Object.values(chainMap).map((item) => item.chainInfo)

const concentratorAPI = isForkEnv
  ? 'https://apitest.aladdin.club'
  : `https://api.aladdin.club`

const zeroAddress = '0x0000000000000000000000000000000000000000'
const defaultAddress = '0x1111111111111111111111111111111111111111'
const uint256Max =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935'

const config = {
  concentratorAPI,
  zeroAddress,
  defaultAddress,
  allowChains,
  uint256Max,
  ...Object.values(chainMap)[0],
}

export const setNetwork = (chainId) => {
  if (chainMap[chainId]) {
    Object.assign(config, chainMap[chainId])
  }
}

export default config
