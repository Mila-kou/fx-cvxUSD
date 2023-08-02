import ethereum from './network/ethereum'
import mainnetFork_inner from './network/mainnet-fork-inner'
import mainnetFork_10548 from './network/mainnet-fork-10548'
import mainnetFork_outer from './network/mainnet-fork-outer'
import sepolia from './network/sepolia'

// const isForkEnv = process.env.NETWORK_ENV === 'mainnet-fork'

// const chainMap = isForkEnv
//   ? {
//       [ethereum.chainInfo.id]: ethereum,
//       [sepolia.chainInfo.id]: sepolia,
//       [mainnetFork.chainInfo.id]: mainnetFork,
//     }
//   : {
//       [ethereum.chainInfo.id]: ethereum,
//       [sepolia.chainInfo.id]: sepolia,
//       [mainnetFork.chainInfo.id]: mainnetFork,
//     }
const mainnetFork = ethereum
const chainMap = {
  // [sepolia.chainInfo.id]: sepolia,
  // [ethereum.chainInfo.id]: ethereum,
  [mainnetFork.chainInfo.id]: mainnetFork,
}

const allowChains = Object.values(chainMap).map((item) => item.chainInfo)

const zeroAddress = '0x0000000000000000000000000000000000000000'
const defaultAddress = '0x1111111111111111111111111111111111111111'
const daySecond = 86400
const yearSecond = 31536000
const uint256Max =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935'

const config = {
  concentratorAPI: 'https://api.aladdin.club',
  zeroAddress,
  defaultAddress,
  allowChains,
  daySecond,
  yearSecond,
  uint256Max,
  ...Object.values(chainMap)[0],
}

export const setNetwork = (chainId) => {
  if (chainMap[chainId]) {
    Object.assign(config, chainMap[chainId])
  }
  if (chainId === mainnetFork.chainInfo.id) {
    config.concentratorAPI =
      chainId === mainnetFork.chainInfo.id
        ? 'https://apitest.aladdin.club'
        : 'https://api.aladdin.club'
  }
}

export default config
