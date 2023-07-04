import config from '@/config/index'

const cryptoIcons = '/assets/crypto-icons-stack.svg'

const FLogo = '/images/f-logo.svg'
const XLogo = '/images/x-logo.svg'

export const POOLS_LIST = [
  {
    logo: FLogo,
    logo2: `/tokens/crypto-icons-stack.svg#eth`,
    id: 1,
    name: 'f(x) / ETH Curve LP',
    platform: 'CLever',
    fromPlatformIcon: `${cryptoIcons}#crv`,
    fromPlatform: 'Curve',
    platformUrl: 'https://curve.fi/factory-crypto/140',
    curveType: 'curveCopyto',
    nameShow: 'Curve_CLEV_ETH',
    apy: 0,
    tvlPriceTokenId: 'Curve_CLEV_ETH',
    lpPoolToken: config.POOLS_LIST_GAUGE.Curve_CLEV_ETH.lpPoolCurveToken,
    lpAddress: config.POOLS_LIST_GAUGE.Curve_CLEV_ETH.token,
    lpGaugeAddress: config.POOLS_LIST_GAUGE.Curve_CLEV_ETH.gauge,
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'CLEV',
    rewardTokenDecimals: 18,
    isClevPrice: true,
    zapTokens: [
      // {
      //   symbol: 'Curve_CLEV_ETH',
      //   icon: 'eth',
      //   address: config.POOLS_LIST_GAUGE.Curve_CLEV_ETH.token,
      //   needZap: false,
      //   isLp: true,
      // },
      {
        ...config.zapTokens.fETH,
        needZap: false,
      },
    ],
  },

  {
    logo: FLogo,
    logo2: `/tokens/crypto-icons-stack.svg#eth`,
    id: 4,
    name: 'fETH / ETH Curve LP',
    platform: 'CLever',
    fromPlatformIcon: `${cryptoIcons}#crv`,
    fromPlatform: 'Concentrator',
    platformUrl: 'https://concentrator.aladdin.club/',
    nameShow: 'abcCVX',
    apy: 0,
    tvlPriceTokenId: 'curveLP-abcCVX',
    lpPoolToken: config.POOLS_LIST_GAUGE.Concentrator_abcCVX.lpPoolCurveToken,
    lpAddress: config.POOLS_LIST_GAUGE.Concentrator_abcCVX.token,
    lpGaugeAddress: config.POOLS_LIST_GAUGE.Concentrator_abcCVX.gauge,
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'CLEV',
    rewardTokenDecimals: 18,
    zapTokens: [
      {
        symbol: 'abcCVX',
        icon: 'cvx',
        address: config.POOLS_LIST_GAUGE.Concentrator_abcCVX.token,
        needZap: false,
        isLp: true,
      },
    ],
  },
  {
    logo: XLogo,
    logo2: `/tokens/crypto-icons-stack.svg#eth`,
    id: 5,
    name: 'xETH / ETH Curve LP',
    platform: 'CLever',
    fromPlatformIcon: `${cryptoIcons}#crv`,
    fromPlatform: 'Curve',
    isStaticPool: true,
    apy: 0,
    lpAddress: config.POOLS_LIST_GAUGE.Curve_clevCVX_CVX.lpPoolCurveToken,
    lpPoolToken: config.POOLS_LIST_GAUGE.Curve_clevCVX_CVX.lpPoolCurveToken,
    lpGaugeAddress: config.POOLS_LIST_GAUGE.Curve_clevCVX_CVX.gauge,
    stakeTokenDecimals: 18,
    rewardTokenSymbol: 'CLEV',
    rewardTokenDecimals: 18,
  },
]

export default POOLS_LIST
