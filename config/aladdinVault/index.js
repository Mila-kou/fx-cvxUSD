import config from '@/config/index'

const cryptoIcons = '/assets/crypto-icons-stack.svg'

const FLogo = '/images/f-logo.svg'
const XLogo = '/images/x-logo.svg'

export const POOLS_LIST = [
  {
    logo: FLogo,
    logo2: `/tokens/crypto-icons-stack.svg#eth`,
    id: 1,
    name: 'xETH+ETH',
    platform: 'FX',
    fromPlatformIcon: `${cryptoIcons}#crv`,
    fromPlatform: 'Curve',
    platformUrl: 'https://curve.fi/factory-crypto/140',
    curveType: 'curveCopyto',
    nameShow: 'Curve_xETH_ETH',
    // lpPoolToken: config.POOLS_LIST_GAUGE.ETH_xETH.lpPoolCurveToken,
    lpAddress: config.POOLS_LIST_GAUGE.ETH_xETH.token,
    lpGaugeAddress: config.POOLS_LIST_GAUGE.ETH_xETH.gauge,
    rewardTokens: [config.TOKENS_INFO.fxn, config.TOKENS_INFO.stETH],
    zapTokens: [
      {
        symbol: 'Curve_xETH_ETH',
        icon: 'eth',
        address: config.POOLS_LIST_GAUGE.ETH_xETH.token,
        needZap: false,
        isLp: true,
      },
    ],
  },

  // {
  //   logo: FLogo,
  //   logo2: `/tokens/crypto-icons-stack.svg#eth`,
  //   id: 2,
  //   name: 'FXN+ETH',
  //   platform: 'FX',
  //   fromPlatformIcon: `${cryptoIcons}#crv`,
  //   fromPlatform: 'Curve',
  //   platformUrl: 'https://concentrator.aladdin.club/',
  //   nameShow: 'Curve_FXN_ETH',
  //   // lpPoolToken: config.POOLS_LIST_GAUGE.ETH_FXN.lpPoolCurveToken,
  //   lpAddress: config.POOLS_LIST_GAUGE.ETH_FXN.token,
  //   lpGaugeAddress: config.POOLS_LIST_GAUGE.ETH_FXN.gauge,
  //   rewardTokens: [config.TOKENS_INFO.fxn, config.TOKENS_INFO.stETH],
  //   zapTokens: [
  //     {
  //       symbol: 'Curve_FXN_ETH',
  //       icon: 'cvx',
  //       address: config.POOLS_LIST_GAUGE.ETH_FXN.token,
  //       needZap: false,
  //       isLp: true,
  //     },
  //   ],
  // },
  // {
  //   logo: XLogo,
  //   logo2: `/tokens/crypto-icons-stack.svg#eth`,
  //   id: 3,
  //   name: 'fETH+crvUSD',
  //   platform: 'FX',
  //   fromPlatformIcon: `${cryptoIcons}#crv`,
  //   fromPlatform: 'Curve',
  //   // lpPoolToken: config.POOLS_LIST_GAUGE.crvUSD_fETH.lpPoolCurveToken,
  //   lpAddress: config.POOLS_LIST_GAUGE.crvUSD_fETH.token,
  //   lpGaugeAddress: config.POOLS_LIST_GAUGE.crvUSD_fETH.gauge,
  //   rewardTokens: [config.TOKENS_INFO.fxn, config.TOKENS_INFO.stETH],
  //   zapTokens: [
  //     {
  //       symbol: 'curve_fETH_crvUSD',
  //       icon: 'cvx',
  //       address: config.POOLS_LIST_GAUGE.crvUSD_fETH.token,
  //       needZap: false,
  //       isLp: true,
  //     },
  //   ],
  // },
  // {
  //   logo: XLogo,
  //   logo2: `/tokens/crypto-icons-stack.svg#eth`,
  //   id: 4,
  //   name: 'fETH+FRAXBP',
  //   platform: 'FX',
  //   fromPlatformIcon: `${cryptoIcons}#crv`,
  //   fromPlatform: 'Curve',
  //   // lpPoolToken: config.POOLS_LIST_GAUGE.fETH_FRAXBP.lpPoolCurveToken,
  //   lpAddress: config.POOLS_LIST_GAUGE.fETH_FRAXBP.token,
  //   lpGaugeAddress: config.POOLS_LIST_GAUGE.fETH_FRAXBP.gauge,
  //   rewardTokens: [config.TOKENS_INFO.fxn, config.TOKENS_INFO.stETH],
  //   zapTokens: [
  //     {
  //       symbol: 'curve_fETH_FRAXBP',
  //       icon: 'cvx',
  //       address: config.POOLS_LIST_GAUGE.fETH_FRAXBP.token,
  //       needZap: false,
  //       isLp: true,
  //     },
  //   ],
  // },
]

export default POOLS_LIST
