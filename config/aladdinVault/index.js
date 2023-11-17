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
    apy: 0,
    tvlPriceTokenId: 'Curve_xETH_ETH',
    lpPoolToken: config.POOLS_LIST_GAUGE.ETH_xETH.lpPoolCurveToken,
    lpAddress: config.POOLS_LIST_GAUGE.ETH_xETH.token,
    lpGaugeAddress: config.POOLS_LIST_GAUGE.ETH_xETH.gauge,
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'CLEV',
    rewardTokenDecimals: 18,
    isClevPrice: true,
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

  {
    logo: FLogo,
    logo2: `/tokens/crypto-icons-stack.svg#eth`,
    id: 4,
    name: 'FXN+ETH',
    platform: 'FX',
    fromPlatformIcon: `${cryptoIcons}#crv`,
    fromPlatform: 'Curve',
    platformUrl: 'https://concentrator.aladdin.club/',
    nameShow: 'Curve_FXN_ETH',
    apy: 0,
    tvlPriceTokenId: 'curveLP-abcCVX',
    lpPoolToken: config.POOLS_LIST_GAUGE.ETH_FXN.lpPoolCurveToken,
    lpAddress: config.POOLS_LIST_GAUGE.ETH_FXN.token,
    lpGaugeAddress: config.POOLS_LIST_GAUGE.ETH_FXN.gauge,
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'CLEV',
    rewardTokenDecimals: 18,
    zapTokens: [
      {
        symbol: 'Curve_FXN_ETH',
        icon: 'cvx',
        address: config.POOLS_LIST_GAUGE.ETH_FXN.token,
        needZap: false,
        isLp: true,
      },
    ],
  },
  {
    logo: XLogo,
    logo2: `/tokens/crypto-icons-stack.svg#eth`,
    id: 5,
    name: 'fETH+crvUSD',
    platform: 'FX',
    fromPlatformIcon: `${cryptoIcons}#crv`,
    fromPlatform: 'Curve',
    apy: 0,
    lpAddress: config.POOLS_LIST_GAUGE.crvUSD_fETH.lpPoolCurveToken,
    lpPoolToken: config.POOLS_LIST_GAUGE.crvUSD_fETH.lpPoolCurveToken,
    lpGaugeAddress: config.POOLS_LIST_GAUGE.crvUSD_fETH.gauge,
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'CLEV',
    rewardTokenDecimals: 18,
    zapTokens: [
      {
        symbol: 'curve_fETH_crvUSD',
        icon: 'cvx',
        address: config.POOLS_LIST_GAUGE.crvUSD_fETH.token,
        needZap: false,
        isLp: true,
      },
    ],
  },
  {
    logo: XLogo,
    logo2: `/tokens/crypto-icons-stack.svg#eth`,
    id: 5,
    name: 'fETH+FRAXBP',
    platform: 'FX',
    fromPlatformIcon: `${cryptoIcons}#crv`,
    fromPlatform: 'Curve',
    apy: 0,
    lpAddress: config.POOLS_LIST_GAUGE.fETH_FRAXBP.lpPoolCurveToken,
    lpPoolToken: config.POOLS_LIST_GAUGE.fETH_FRAXBP.lpPoolCurveToken,
    lpGaugeAddress: config.POOLS_LIST_GAUGE.fETH_FRAXBP.gauge,
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'CLEV',
    rewardTokenDecimals: 18,
    zapTokens: [
      {
        symbol: 'curve_fETH_FRAXBP',
        icon: 'cvx',
        address: config.POOLS_LIST_GAUGE.fETH_FRAXBP.token,
        needZap: false,
        isLp: true,
      },
    ],
  },
]

export default POOLS_LIST
