import config from '@/config/index'

const cryptoIcons = '/assets/crypto-icons-stack.svg'

export const REWARD_TOKENS = [
  'FXN',
  'wstETH',
  'sfrxETH',
  'weETH',
  'ezETH',
  'WBTC',
  'aladdinWBTC',
]

export const POOLS_LIST = [
  {
    logo2: `/tokens/crypto-icons-stack.svg#eth`,
    icon: '/images/FXN.svg',
    subIcon: `${cryptoIcons}#crv`,
    icons: [
      { icon: '/tokens/crypto-icons-stack.svg#eth' },
      {
        icon: '/images/FXN.svg',
      },
    ],
    id: 1,
    name: 'ETH+FXN',
    platform: 'FX',
    fromPlatform: 'Curve',
    platformUrl: 'https://curve.fi/#/ethereum/pools/factory-crypto-311/deposit',
    curveType: 'curveCopyto',
    nameShow: [' ETH+FXN Curve', ' Pool'],
    gaugeType: 0,
    gaugeTypeName: 'Liquidity Gauge',
    lpAddress: config.POOLS_LIST_GAUGE.ETH_FXN.token,
    lpGaugeAddress: config.POOLS_LIST_GAUGE.ETH_FXN.gauge,
    manageConvexGaugeAddress: config.POOLS_LIST_GAUGE.ETH_FXN.manageConvexGauge,
    baseRewardToken: config.TOKENS_INFO.fxn,
    rewardTokens: [config.TOKENS_INFO.crv, config.TOKENS_INFO.cvx],
    zapTokens: [
      {
        symbol: 'Curve_ETH_FXN',
        icon: 'eth',
        address: config.POOLS_LIST_GAUGE.ETH_FXN.token,
        needZap: false,
        isLp: true,
      },
    ],
  },
  {
    icon: '/images/FXN.svg',
    subIcon: `${cryptoIcons}#crv`,
    icons: [
      { icon: '/images/FXN.svg' },
      {
        icon: '/images/FXN.svg',
        subIcon: '/tokens/crypto-icons-stack.svg#cvx',
      },
    ],
    id: 2,
    name: 'FXN+cvxFXN',
    platform: 'FX',
    fromPlatform: 'Curve',
    platformUrl: 'https://curve.fi/#/ethereum/pools/factory-v2-358/deposit',
    nameShow: ['FXN+cvxFXN Curve', ' Pool'],
    gaugeType: 0,
    gaugeTypeName: 'Liquidity Gauge',
    // lpPoolToken: config.POOLS_LIST_GAUGE.ETH_FXN.lpPoolCurveToken,
    lpAddress: config.POOLS_LIST_GAUGE.FXN_cvxFXN.token,
    lpGaugeAddress: config.POOLS_LIST_GAUGE.FXN_cvxFXN.gauge,
    manageConvexGaugeAddress:
      config.POOLS_LIST_GAUGE.FXN_cvxFXN.manageConvexGauge,
    baseRewardToken: config.TOKENS_INFO.fxn,
    rewardTokens: [config.TOKENS_INFO.crv, config.TOKENS_INFO.cvx],
    zapTokens: [
      {
        symbol: 'Curve_FXN_cvxFXN',
        icon: 'cvx',
        address: config.POOLS_LIST_GAUGE.FXN_cvxFXN.token,
        needZap: false,
        isLp: true,
      },
    ],
  },
  {
    icon: '/images/FXN.svg',
    subIcon: `${cryptoIcons}#crv`,
    icons: [
      { icon: '/images/FXN.svg' },
      {
        icon: '/images/FXN.svg',
        subIcon: '/tokens/stakedao.png',
      },
    ],
    id: 3,
    name: 'FXN+sdFXN',
    nameShow: ['FXN+sdFXN Curve', ' Pool'],
    platform: 'FX',
    fromPlatform: 'Curve',
    platformUrl: 'https://curve.fi/#/ethereum/pools/factory-v2-359/deposit',
    gaugeType: 0,
    gaugeTypeName: 'Liquidity Gauge',
    // lpPoolToken: config.POOLS_LIST_GAUGE.crvUSD_fETH.lpPoolCurveToken,
    lpAddress: config.POOLS_LIST_GAUGE.FXN_sdFXN.token,
    lpGaugeAddress: config.POOLS_LIST_GAUGE.FXN_sdFXN.gauge,
    manageConvexGaugeAddress:
      config.POOLS_LIST_GAUGE.FXN_sdFXN.manageConvexGauge,
    baseRewardToken: config.TOKENS_INFO.fxn,
    rewardTokens: [config.TOKENS_INFO.crv, config.TOKENS_INFO.cvx],
    zapTokens: [
      {
        symbol: 'curve_FXN_sdFXN',
        icon: 'cvx',
        address: config.POOLS_LIST_GAUGE.FXN_sdFXN.token,
        needZap: false,
        isLp: true,
      },
    ],
  },
  {
    icons: [
      { icon: '/tokens/default-crypto.png' },
      {
        icon: '/tokens/fxusd.svg',
      },
    ],
    id: 18,
    name: 'USD0+fxUSD',
    nameShow: ['USD0+fxUSD Curve', ' Pool'],
    platform: 'FX',
    fromPlatformIcon: `${cryptoIcons}#crv`,
    fromPlatform: 'Curve',
    platformUrl:
      'https://curve.fi/#/ethereum/pools/factory-stable-ng-191/deposit',
    gaugeType: 0,
    gaugeTypeName: 'Liquidity Gauge',
    // lpPoolToken: config.POOLS_LIST_GAUGE.crvUSD_fETH.lpPoolCurveToken,
    lpAddress: config.POOLS_LIST_GAUGE.USD0_fxUSD.token,
    lpGaugeAddress: config.POOLS_LIST_GAUGE.USD0_fxUSD.gauge,
    manageConvexGaugeAddress:
      config.POOLS_LIST_GAUGE.USD0_fxUSD.manageConvexGauge,
    baseRewardToken: config.TOKENS_INFO.fxn,
    rewardTokens: [config.TOKENS_INFO.crv, config.TOKENS_INFO.cvx],
    isCloseManageConvex: true,
    zapTokens: [
      {
        symbol: 'curve_USD0_fxUSD',
        icon: 'cvx',
        address: config.POOLS_LIST_GAUGE.USD0_fxUSD.token,
        needZap: false,
        isLp: true,
      },
    ],
  },
  {
    icons: [
      { icon: '/tokens/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png' },
      {
        icon: '/tokens/fxusd.svg',
      },
    ],
    id: 17,
    name: 'USDC+fxUSD',
    nameShow: ['USDC+fxUSD Curve', ' Pool'],
    platform: 'FX',
    fromPlatformIcon: `${cryptoIcons}#crv`,
    fromPlatform: 'Curve',
    platformUrl:
      'https://curve.fi/#/ethereum/pools/factory-stable-ng-193/deposit',
    gaugeType: 0,
    gaugeTypeName: 'Liquidity Gauge',
    // lpPoolToken: config.POOLS_LIST_GAUGE.crvUSD_fETH.lpPoolCurveToken,
    lpAddress: config.POOLS_LIST_GAUGE.USDC_fxUSD.token,
    lpGaugeAddress: config.POOLS_LIST_GAUGE.USDC_fxUSD.gauge,
    manageConvexGaugeAddress:
      config.POOLS_LIST_GAUGE.USDC_fxUSD.manageConvexGauge,
    baseRewardToken: config.TOKENS_INFO.fxn,
    rewardTokens: [config.TOKENS_INFO.crv, config.TOKENS_INFO.cvx],
    isCloseManageConvex: true,
    zapTokens: [
      {
        symbol: 'curve_USDC_fxUSD',
        icon: 'cvx',
        address: config.POOLS_LIST_GAUGE.USDC_fxUSD.token,
        needZap: false,
        isLp: true,
      },
    ],
  },
  {
    icons: [
      { icon: '/tokens/0x8c0d76c9b18779665475f3e212d9ca1ed6a1a0e6.png' },
      {
        icon: '/tokens/fxusd.svg',
      },
    ],
    id: 16,
    name: 'zunUSD+fxUSD',
    nameShow: ['zunUSD+fxUSD Curve', ' Pool'],
    platform: 'FX',
    fromPlatformIcon: `${cryptoIcons}#crv`,
    fromPlatform: 'Curve',
    platformUrl:
      'https://curve.fi/#/ethereum/pools/factory-stable-ng-179/deposit',
    gaugeType: 0,
    gaugeTypeName: 'Liquidity Gauge',
    // lpPoolToken: config.POOLS_LIST_GAUGE.crvUSD_fETH.lpPoolCurveToken,
    lpAddress: config.POOLS_LIST_GAUGE.zunUSD_fxUSD.token,
    lpGaugeAddress: config.POOLS_LIST_GAUGE.zunUSD_fxUSD.gauge,
    manageConvexGaugeAddress:
      config.POOLS_LIST_GAUGE.zunUSD_fxUSD.manageConvexGauge,
    baseRewardToken: config.TOKENS_INFO.fxn,
    rewardTokens: [config.TOKENS_INFO.crv, config.TOKENS_INFO.cvx],
    zapTokens: [
      {
        symbol: 'curve_zunUSD_fxUSD',
        icon: 'cvx',
        address: config.POOLS_LIST_GAUGE.zunUSD_fxUSD.token,
        needZap: false,
        isLp: true,
      },
    ],
  },
  {
    icons: [
      { icon: '/tokens/gho.png' },
      {
        icon: '/tokens/fxusd.svg',
      },
    ],
    id: 9,
    name: 'GHO+fxUSD',
    nameShow: ['GHO+fxUSD Curve', ' Pool'],
    platform: 'FX',
    fromPlatformIcon: `${cryptoIcons}#crv`,
    fromPlatform: 'Curve',
    platformUrl:
      'https://curve.fi/#/ethereum/pools/factory-stable-ng-111/deposit',
    gaugeType: 0,
    gaugeTypeName: 'Liquidity Gauge',
    // lpPoolToken: config.POOLS_LIST_GAUGE.crvUSD_fETH.lpPoolCurveToken,
    lpAddress: config.POOLS_LIST_GAUGE.GHO_fxUSD.token,
    lpGaugeAddress: config.POOLS_LIST_GAUGE.GHO_fxUSD.gauge,
    manageConvexGaugeAddress:
      config.POOLS_LIST_GAUGE.GHO_fxUSD.manageConvexGauge,
    baseRewardToken: config.TOKENS_INFO.fxn,
    rewardTokens: [config.TOKENS_INFO.crv, config.TOKENS_INFO.cvx],
    zapTokens: [
      {
        symbol: 'curve_GHO_fxUSD',
        icon: 'cvx',
        address: config.POOLS_LIST_GAUGE.GHO_fxUSD.token,
        needZap: false,
        isLp: true,
      },
    ],
  },
  {
    icons: [
      { icon: '/tokens/crvUSD.png' },
      {
        icon: '/tokens/fxusd.svg',
      },
    ],
    id: 4,
    name: 'crvUSD+fxUSD',
    nameShow: ['crvUSD+fxUSD Curve', ' Pool'],
    platform: 'FX',
    fromPlatformIcon: `${cryptoIcons}#crv`,
    fromPlatform: 'Curve',
    platformUrl:
      'https://curve.fi/#/ethereum/pools/factory-stable-ng-106/deposit',
    gaugeType: 0,
    gaugeTypeName: 'Liquidity Gauge',
    // lpPoolToken: config.POOLS_LIST_GAUGE.crvUSD_fETH.lpPoolCurveToken,
    lpAddress: config.POOLS_LIST_GAUGE.crvUSD_fxUSD.token,
    lpGaugeAddress: config.POOLS_LIST_GAUGE.crvUSD_fxUSD.gauge,
    manageConvexGaugeAddress:
      config.POOLS_LIST_GAUGE.crvUSD_fxUSD.manageConvexGauge,
    baseRewardToken: config.TOKENS_INFO.fxn,
    rewardTokens: [config.TOKENS_INFO.crv, config.TOKENS_INFO.cvx],
    zapTokens: [
      {
        symbol: 'curve_crvUSD_fxUSD',
        icon: 'cvx',
        address: config.POOLS_LIST_GAUGE.crvUSD_fxUSD.token,
        needZap: false,
        isLp: true,
      },
    ],
  },
  {
    icons: [
      { icon: '/tokens/pyusd.png' },
      {
        icon: '/tokens/fxusd.svg',
      },
    ],
    id: 5,
    name: 'PYUSD+fxUSD',
    nameShow: ['PYUSD+fxUSD Curve', ' Pool'],
    platform: 'FX',
    fromPlatformIcon: `${cryptoIcons}#crv`,
    fromPlatform: 'Curve',
    platformUrl:
      'https://curve.fi/#/ethereum/pools/factory-stable-ng-107/deposit',
    gaugeType: 0,
    gaugeTypeName: 'Liquidity Gauge',
    // lpPoolToken: config.POOLS_LIST_GAUGE.crvUSD_fETH.lpPoolCurveToken,
    lpAddress: config.POOLS_LIST_GAUGE.PYUSD_fxUSD.token,
    lpGaugeAddress: config.POOLS_LIST_GAUGE.PYUSD_fxUSD.gauge,
    manageConvexGaugeAddress:
      config.POOLS_LIST_GAUGE.PYUSD_fxUSD.manageConvexGauge,
    baseRewardToken: config.TOKENS_INFO.fxn,
    rewardTokens: [config.TOKENS_INFO.crv, config.TOKENS_INFO.cvx],
    zapTokens: [
      {
        symbol: 'curve_PYUSD_fxUSD',
        icon: 'cvx',
        address: config.POOLS_LIST_GAUGE.PYUSD_fxUSD.token,
        needZap: false,
        isLp: true,
      },
    ],
  },
  {
    icons: [
      { icon: '/tokens/crypto-icons-stack.svg#frax' },
      {
        icon: '/tokens/fxusd.svg',
      },
    ],
    id: 8,
    name: 'FRAX+fxUSD',
    nameShow: ['FRAX+fxUSD Curve', ' Pool'],
    platform: 'FX',
    fromPlatformIcon: `${cryptoIcons}#crv`,
    fromPlatform: 'Curve',
    platformUrl:
      'https://curve.fi/#/ethereum/pools/factory-stable-ng-110/deposit',
    gaugeType: 0,
    gaugeTypeName: 'Liquidity Gauge',
    // lpPoolToken: config.POOLS_LIST_GAUGE.crvUSD_fETH.lpPoolCurveToken,
    lpAddress: config.POOLS_LIST_GAUGE.FRAX_fxUSD.token,
    lpGaugeAddress: config.POOLS_LIST_GAUGE.FRAX_fxUSD.gauge,
    manageConvexGaugeAddress:
      config.POOLS_LIST_GAUGE.FRAX_fxUSD.manageConvexGauge,
    baseRewardToken: config.TOKENS_INFO.fxn,
    rewardTokens: [config.TOKENS_INFO.crv, config.TOKENS_INFO.cvx],
    zapTokens: [
      {
        symbol: 'curve_FRAX_fxUSD',
        icon: 'cvx',
        address: config.POOLS_LIST_GAUGE.FRAX_fxUSD.token,
        needZap: false,
        isLp: true,
      },
    ],
  },
  {
    icons: [
      { icon: '/tokens/dola.svg' },
      {
        icon: '/tokens/fxusd.svg',
      },
    ],
    id: 6,
    name: 'DOLA+fxUSD',
    nameShow: ['DOLA+fxUSD Curve', ' Pool'],
    platform: 'FX',
    fromPlatformIcon: `${cryptoIcons}#crv`,
    fromPlatform: 'Curve',
    platformUrl:
      'https://curve.fi/#/ethereum/pools/factory-stable-ng-108/deposit',
    gaugeType: 0,
    gaugeTypeName: 'Liquidity Gauge',
    // lpPoolToken: config.POOLS_LIST_GAUGE.crvUSD_fETH.lpPoolCurveToken,
    lpAddress: config.POOLS_LIST_GAUGE.DOLA_fxUSD.token,
    lpGaugeAddress: config.POOLS_LIST_GAUGE.DOLA_fxUSD.gauge,
    manageConvexGaugeAddress:
      config.POOLS_LIST_GAUGE.DOLA_fxUSD.manageConvexGauge,
    baseRewardToken: config.TOKENS_INFO.fxn,
    rewardTokens: [config.TOKENS_INFO.crv, config.TOKENS_INFO.cvx],
    zapTokens: [
      {
        symbol: 'curve_DOLA_fxUSD',
        icon: 'cvx',
        address: config.POOLS_LIST_GAUGE.DOLA_fxUSD.token,
        needZap: false,
        isLp: true,
      },
    ],
  },
  {
    icons: [
      { icon: '/tokens/fxusd.svg' },
      {
        icon: '/tokens/rUSD.svg',
      },
    ],
    id: 12,
    name: 'fxUSD+rUSD',
    nameShow: ['fxUSD+rUSD Curve', ' Pool'],
    platform: 'FX',
    fromPlatformIcon: `${cryptoIcons}#crv`,
    fromPlatform: 'Curve',
    platformUrl:
      'https://curve.fi/#/ethereum/pools/factory-stable-ng-138/deposit',
    gaugeType: 0,
    gaugeTypeName: 'Liquidity Gauge',
    // lpPoolToken: config.POOLS_LIST_GAUGE.crvUSD_fETH.lpPoolCurveToken,
    lpAddress: config.POOLS_LIST_GAUGE.fxUSD_rUSD.token,
    lpGaugeAddress: config.POOLS_LIST_GAUGE.fxUSD_rUSD.gauge,
    manageConvexGaugeAddress:
      config.POOLS_LIST_GAUGE.fxUSD_rUSD.manageConvexGauge,
    baseRewardToken: config.TOKENS_INFO.fxn,
    rewardTokens: [config.TOKENS_INFO.crv, config.TOKENS_INFO.cvx],
    zapTokens: [
      {
        symbol: 'curve_fxUSD_rUSD',
        icon: 'cvx',
        address: config.POOLS_LIST_GAUGE.fxUSD_rUSD.token,
        needZap: false,
        isLp: true,
      },
    ],
  },
  {
    icons: [
      { icon: '/tokens/alusd.png' },
      {
        icon: '/tokens/fxusd.svg',
      },
    ],
    id: 13,
    name: 'alUSD+fxUSD',
    nameShow: ['alUSD+fxUSD Curve', ' Pool'],
    platform: 'FX',
    fromPlatformIcon: `${cryptoIcons}#crv`,
    fromPlatform: 'Curve',
    platformUrl:
      'https://curve.fi/#/ethereum/pools/factory-stable-ng-139/deposit',
    gaugeType: 0,
    gaugeTypeName: 'Liquidity Gauge',
    // lpPoolToken: config.POOLS_LIST_GAUGE.crvUSD_fETH.lpPoolCurveToken,
    lpAddress: config.POOLS_LIST_GAUGE.alUSD_fxUSD.token,
    lpGaugeAddress: config.POOLS_LIST_GAUGE.alUSD_fxUSD.gauge,
    manageConvexGaugeAddress:
      config.POOLS_LIST_GAUGE.alUSD_fxUSD.manageConvexGauge,
    baseRewardToken: config.TOKENS_INFO.fxn,
    rewardTokens: [config.TOKENS_INFO.crv, config.TOKENS_INFO.cvx],
    zapTokens: [
      {
        symbol: 'curve_alUSD_fxUSD',
        icon: 'cvx',
        address: config.POOLS_LIST_GAUGE.alUSD_fxUSD.token,
        needZap: false,
        isLp: true,
      },
    ],
  },
  {
    icons: [
      { icon: '/tokens/0xa0d69e286b938e21cbf7e51d71f6a4c8918f482f.png' },
      {
        icon: '/tokens/fxusd.svg',
      },
    ],
    id: 14,
    name: 'eUSD+fxUSD',
    nameShow: ['eUSD+fxUSD Curve', ' Pool'],
    platform: 'FX',
    fromPlatformIcon: `${cryptoIcons}#crv`,
    fromPlatform: 'Curve',
    platformUrl:
      'https://curve.fi/#/ethereum/pools/factory-stable-ng-114/deposit',
    gaugeType: 0,
    gaugeTypeName: 'Liquidity Gauge',
    // lpPoolToken: config.POOLS_LIST_GAUGE.crvUSD_fETH.lpPoolCurveToken,
    lpAddress: config.POOLS_LIST_GAUGE.eUSD_fxUSD.token,
    lpGaugeAddress: config.POOLS_LIST_GAUGE.eUSD_fxUSD.gauge,
    manageConvexGaugeAddress:
      config.POOLS_LIST_GAUGE.eUSD_fxUSD.manageConvexGauge,
    baseRewardToken: config.TOKENS_INFO.fxn,
    rewardTokens: [config.TOKENS_INFO.crv, config.TOKENS_INFO.cvx],
    // isCloseManageConvex: true,
    zapTokens: [
      {
        symbol: 'curve_eUSD_fxUSD',
        icon: 'cvx',
        address: config.POOLS_LIST_GAUGE.eUSD_fxUSD.token,
        needZap: false,
        isLp: true,
      },
    ],
  },
  {
    icons: [
      { icon: '/tokens/0x99d8a9c45b2eca8864373a26d1459e3dff1e17f3.png' },
      {
        icon: '/tokens/fxusd.svg',
      },
    ],
    id: 13,
    name: 'MIM+fxUSD',
    nameShow: ['MIM+fxUSD Curve', ' Pool'],
    platform: 'FX',
    fromPlatformIcon: `${cryptoIcons}#crv`,
    fromPlatform: 'Curve',
    platformUrl:
      'https://curve.fi/#/ethereum/pools/factory-stable-ng-141/deposit',
    gaugeType: 0,
    gaugeTypeName: 'Liquidity Gauge',
    // lpPoolToken: config.POOLS_LIST_GAUGE.crvUSD_fETH.lpPoolCurveToken,
    lpAddress: config.POOLS_LIST_GAUGE.MIM_fxUSD.token,
    lpGaugeAddress: config.POOLS_LIST_GAUGE.MIM_fxUSD.gauge,
    manageConvexGaugeAddress:
      config.POOLS_LIST_GAUGE.MIM_fxUSD.manageConvexGauge,
    baseRewardToken: config.TOKENS_INFO.fxn,
    rewardTokens: [config.TOKENS_INFO.crv, config.TOKENS_INFO.cvx],
    isCloseManageConvex: true,
    zapTokens: [
      {
        symbol: 'curve_MIM_fxUSD',
        icon: 'cvx',
        address: config.POOLS_LIST_GAUGE.MIM_fxUSD.token,
        needZap: false,
        isLp: true,
      },
    ],
  },
  {
    icons: [
      { icon: '/tokens/default-crypto.png' },
      {
        icon: '/tokens/fxusd.svg',
      },
    ],
    id: 15,
    name: 'rgUSD+fxUSD',
    nameShow: ['rgUSD+fxUSD Curve', ' Pool'],
    platform: 'FX',
    fromPlatformIcon: `${cryptoIcons}#crv`,
    fromPlatform: 'Curve',
    platformUrl:
      'https://curve.fi/#/ethereum/pools/factory-stable-ng-127/deposit',
    gaugeType: 0,
    gaugeTypeName: 'Liquidity Gauge',
    // lpPoolToken: config.POOLS_LIST_GAUGE.crvUSD_fETH.lpPoolCurveToken,
    lpAddress: config.POOLS_LIST_GAUGE.rgUSD_fxUSD.token,
    lpGaugeAddress: config.POOLS_LIST_GAUGE.rgUSD_fxUSD.gauge,
    manageConvexGaugeAddress:
      config.POOLS_LIST_GAUGE.rgUSD_fxUSD.manageConvexGauge,
    baseRewardToken: config.TOKENS_INFO.fxn,
    rewardTokens: [config.TOKENS_INFO.crv, config.TOKENS_INFO.cvx],
    // isCloseManageConvex: true,
    zapTokens: [
      {
        symbol: 'curve_rgUSD_fxUSD',
        icon: 'cvx',
        address: config.POOLS_LIST_GAUGE.rgUSD_fxUSD.token,
        needZap: false,
        isLp: true,
      },
    ],
  },
  {
    icons: [
      { icon: '/tokens/mkusd.png' },
      {
        icon: '/tokens/fxusd.svg',
      },
    ],
    id: 10,
    name: 'mkUSD+fxUSD',
    nameShow: ['mkUSD+fxUSD Curve', ' Pool'],
    platform: 'FX',
    fromPlatformIcon: `${cryptoIcons}#crv`,
    fromPlatform: 'Curve',
    platformUrl:
      'https://curve.fi/#/ethereum/pools/factory-stable-ng-115/deposit',
    gaugeType: 0,
    gaugeTypeName: 'Liquidity Gauge',
    // lpPoolToken: config.POOLS_LIST_GAUGE.crvUSD_fETH.lpPoolCurveToken,
    lpAddress: config.POOLS_LIST_GAUGE.mkUSD_fxUSD.token,
    lpGaugeAddress: config.POOLS_LIST_GAUGE.mkUSD_fxUSD.gauge,
    manageConvexGaugeAddress:
      config.POOLS_LIST_GAUGE.mkUSD_fxUSD.manageConvexGauge,
    baseRewardToken: config.TOKENS_INFO.fxn,
    rewardTokens: [config.TOKENS_INFO.crv, config.TOKENS_INFO.cvx],
    zapTokens: [
      {
        symbol: 'curve_mkUSD_fxUSD',
        icon: 'cvx',
        address: config.POOLS_LIST_GAUGE.mkUSD_fxUSD.token,
        needZap: false,
        isLp: true,
      },
    ],
  },
  {
    icons: [
      { icon: '/tokens/ultra.png' },
      {
        icon: '/tokens/fxusd.svg',
      },
    ],
    id: 11,
    name: 'ULTRA+fxUSD',
    nameShow: ['ULTRA+fxUSD Curve', ' Pool'],
    platform: 'FX',
    fromPlatformIcon: `${cryptoIcons}#crv`,
    fromPlatform: 'Curve',
    platformUrl:
      'https://curve.fi/#/ethereum/pools/factory-stable-ng-116/deposit',
    gaugeType: 0,
    gaugeTypeName: 'Liquidity Gauge',
    // lpPoolToken: config.POOLS_LIST_GAUGE.crvUSD_fETH.lpPoolCurveToken,
    lpAddress: config.POOLS_LIST_GAUGE.ULTRA_fxUSD.token,
    lpGaugeAddress: config.POOLS_LIST_GAUGE.ULTRA_fxUSD.gauge,
    manageConvexGaugeAddress:
      config.POOLS_LIST_GAUGE.ULTRA_fxUSD.manageConvexGauge,
    baseRewardToken: config.TOKENS_INFO.fxn,
    rewardTokens: [config.TOKENS_INFO.crv, config.TOKENS_INFO.cvx],
    zapTokens: [
      {
        symbol: 'curve_ULTRA_fxUSD',
        icon: 'cvx',
        address: config.POOLS_LIST_GAUGE.ULTRA_fxUSD.token,
        needZap: false,
        isLp: true,
      },
    ],
  },
  {
    icons: [
      { icon: '/tokens/grai.png' },
      {
        icon: '/tokens/fxusd.svg',
      },
    ],
    id: 7,
    name: 'GRAI+fxUSD',
    nameShow: ['GRAI+fxUSD Curve', ' Pool'],
    platform: 'FX',
    fromPlatformIcon: `${cryptoIcons}#crv`,
    fromPlatform: 'Curve',
    platformUrl:
      'https://curve.fi/#/ethereum/pools/factory-stable-ng-109/deposit',
    gaugeType: 0,
    gaugeTypeName: 'Liquidity Gauge',
    // lpPoolToken: config.POOLS_LIST_GAUGE.crvUSD_fETH.lpPoolCurveToken,
    lpAddress: config.POOLS_LIST_GAUGE.GRAI_fxUSD.token,
    lpGaugeAddress: config.POOLS_LIST_GAUGE.GRAI_fxUSD.gauge,
    manageConvexGaugeAddress:
      config.POOLS_LIST_GAUGE.GRAI_fxUSD.manageConvexGauge,
    baseRewardToken: config.TOKENS_INFO.fxn,
    rewardTokens: [config.TOKENS_INFO.crv, config.TOKENS_INFO.cvx],
    zapTokens: [
      {
        symbol: 'curve_GRAI_fxUSD',
        icon: 'cvx',
        address: config.POOLS_LIST_GAUGE.GRAI_fxUSD.token,
        needZap: false,
        isLp: true,
      },
    ],
  },
]

export const REBALANCE_GAUGE_LIST = [
  {
    icon: '/images/f-logo.svg',
    icons: [
      {
        icon: '/images/f-logo.svg',
      },
    ],
    id: 1,
    name: 'fETH - wstETH',
    platform: 'FX',
    fromPlatform: 'Fx',
    poolType: 'fETH',
    baseSymbol: 'stETH',
    platformUrl: 'https://fx.aladdin.club/staking',
    curveType: 'Rebalance Pool',
    nameShow: 'Fx fETH',
    gaugeType: 1,
    gaugeTypeName: 'Stability Pool Gauge',
    actionRebalancePool: [
      config.contracts.fx_BoostableRebalancePool_APool,
      config.contracts.fx_BoostableRebalancePool_BPool,
    ],
    lpAddress: config.contracts.fx_BoostableRebalancePool_APool_FundraiseGauge,
    lpGaugeAddress:
      config.contracts.fx_BoostableRebalancePool_APool_FundraiseGauge,
    gaugeRewards: [config.TOKENS_INFO.fxn],
    rewardTokens: [],
  },
  {
    icon: '/tokens/fxusd.svg',
    subIcon: '/tokens/steth.svg',
    icons: [
      {
        icon: '/tokens/fxusd.svg',
        subIcon: '/tokens/steth.svg',
      },
    ],
    id: 2,
    name: 'fxUSD - wstETH',
    platform: 'FX',
    fromPlatform: 'Fx',
    poolType: 'fxUSD',
    baseSymbol: 'wstETH',
    platformUrl: 'https://fx.aladdin.club/staking',
    nameShow: 'fxUSD wstETH Rebalance Pool',
    gaugeType: 1,
    gaugeTypeName: 'Stability Pool Gauge',
    actionRebalancePool: [
      config.contracts.FxUSD_ShareableRebalancePool_wstETH,
      config.contracts.FxUSD_ShareableRebalancePool_xstETH,
    ],
    lpAddress:
      config.contracts.FxUSD_ShareableRebalancePool_wstETH_FundraiseGauge,
    lpGaugeAddress:
      config.contracts.FxUSD_ShareableRebalancePool_wstETH_FundraiseGauge,
    gaugeRewards: [config.TOKENS_INFO.fxn],
    rewardTokens: [],
  },
  {
    icon: '/tokens/fxusd.svg',
    subIcon: `${cryptoIcons}#frax`,
    icons: [
      {
        icon: '/tokens/fxusd.svg',
        subIcon: `${cryptoIcons}#frax`,
      },
    ],
    id: 3,
    name: 'fxUSD - sfrxETH',
    platform: 'FX',
    fromPlatform: 'Fx',
    poolType: 'fxUSD',
    baseSymbol: 'sfrxETH',
    gaugeType: 1,
    gaugeTypeName: 'Stability Pool Gauge',
    actionRebalancePool: [
      config.contracts.FxUSD_ShareableRebalancePool_sfrxETH,
      config.contracts.FxUSD_ShareableRebalancePool_xfrxETH,
    ],
    lpAddress:
      config.contracts.FxUSD_ShareableRebalancePool_sfrxETH_FundraiseGauge,
    lpGaugeAddress:
      config.contracts.FxUSD_ShareableRebalancePool_sfrxETH_FundraiseGauge,
    gaugeRewards: [config.TOKENS_INFO.fxn],
    rewardTokens: [],
  },
  {
    icon: '/tokens/rUSD.svg',
    subIcon: '/tokens/eETH.svg',
    icons: [
      {
        icon: '/tokens/rUSD.svg',
        subIcon: '/tokens/eETH.svg',
      },
    ],
    id: 4,
    name: 'rUSD - weETH',
    platform: 'FX',
    fromPlatform: 'Fx',
    poolType: 'rUSD',
    baseSymbol: 'weETH',
    platformUrl: 'https://fx.aladdin.club/staking',
    nameShow: 'rUSD weETH Rebalance Pool',
    gaugeType: 1,
    gaugeTypeName: 'Stability Pool Gauge',
    actionRebalancePool: [
      config.contracts.rUSD_ShareableRebalancePool_weETH,
      config.contracts.rUSD_ShareableRebalancePool_xeETH,
    ],
    lpAddress:
      config.contracts.rUSD_ShareableRebalancePool_weETH_FundraiseGauge,
    lpGaugeAddress:
      config.contracts.rUSD_ShareableRebalancePool_weETH_FundraiseGauge,
    gaugeRewards: [config.TOKENS_INFO.fxn],
    rewardTokens: [],
  },
  {
    icon: '/tokens/rUSD.svg',
    subIcon: '/tokens/ezETH.png',
    icons: [
      {
        icon: '/tokens/rUSD.svg',
        subIcon: '/tokens/ezETH.png',
      },
    ],
    id: 5,
    name: 'rUSD - ezETH',
    platform: 'FX',
    fromPlatform: 'Fx',
    poolType: 'rUSD',
    baseSymbol: 'ezETH',
    platformUrl: 'https://fx.aladdin.club/staking',
    nameShow: 'rUSD ezETH Rebalance Pool',
    gaugeType: 1,
    gaugeTypeName: 'Stability Pool Gauge',
    actionRebalancePool: [
      config.contracts.rUSD_ShareableRebalancePool_ezETH,
      config.contracts.rUSD_ShareableRebalancePool_xeETH,
    ],
    lpAddress:
      config.contracts.rUSD_ShareableRebalancePool_ezETH_FundraiseGauge,
    lpGaugeAddress:
      config.contracts.rUSD_ShareableRebalancePool_ezETH_FundraiseGauge,
    gaugeRewards: [config.TOKENS_INFO.fxn],
    rewardTokens: [],
  },
  {
    icon: '/tokens/btcUSD.svg',
    subIcon: '/tokens/WBTC.svg',
    icons: [
      {
        icon: '/tokens/btcUSD.svg',
        subIcon: '/tokens/WBTC.svg',
      },
    ],
    id: 6,
    name: 'btcUSD - WBTC',
    platform: 'FX',
    fromPlatform: 'Fx',
    poolType: 'btcUSD',
    baseSymbol: 'WBTC',
    platformUrl: 'https://fx.aladdin.club/staking',
    nameShow: 'btcUSD WBTC Rebalance Pool',
    gaugeType: 1,
    gaugeTypeName: 'Stability Pool Gauge',
    actionRebalancePool: [
      config.contracts.btcUSD_ShareableRebalancePool_WBTC,
      config.contracts.btcUSD_ShareableRebalancePool_xWBTC,
    ],
    lpAddress:
      config.contracts.btcUSD_ShareableRebalancePool_WBTC_FundraiseGauge,
    lpGaugeAddress:
      config.contracts.btcUSD_ShareableRebalancePool_WBTC_FundraiseGauge,
    gaugeRewards: [config.TOKENS_INFO.fxn],
    rewardTokens: [],
  },
]

export const REBALANCE_POOLS_LIST = [
  {
    id: 1,
    icon: '/images/f-logo.svg',
    subIcon: '/tokens/steth.svg',
    gaugeType: 'boostRebalance',
    nameShow: 'fETH Rebalance Pool Redeem to wstETH',
    poolType: 'fETH',
    withdrawDefaultToken: 'fETH',
    rebalancePoolAddress: config.contracts.fx_BoostableRebalancePool_APool,
    rebalanceWithBonusTokenAddress:
      config.contracts.fx_RebalanceWithBonusToken_BoostRebalanceAPool,
    gaugeClaimer:
      config.contracts
        .fx_BoostableRebalancePool_APool_RebalancePoolGaugeClaimer,
    infoKey: 'rebalancePoolV2_info_A',
    gaugeRewards: [config.TOKENS_INFO.fxn],
    rebalanceRewards: ['FXN', 'wstETH'],
    zapTokens: [
      {
        symbol: 'fETH',
        icon: 'eth',
        address: config.tokens.fETH,
        needZap: false,
        isLp: true,
      },
    ],
  },
  {
    id: 2,
    icon: '/images/f-logo.svg',
    subIcon: '/tokens/steth.svg',
    gaugeType: 'boostRebalance',
    nameShow: 'fETH Rebalance Pool Redeem to xETH',
    poolType: 'fETH',
    withdrawDefaultToken: 'fETH',
    gaugeClaimer:
      config.contracts
        .fx_BoostableRebalancePool_APool_RebalancePoolGaugeClaimer,
    rebalancePoolAddress: config.contracts.fx_BoostableRebalancePool_BPool,
    rebalanceWithBonusTokenAddress:
      config.contracts.fx_RebalanceWithBonusToken_BoostRebalanceBPool,
    infoKey: 'rebalancePoolV2_info_B',
    gaugeRewards: [config.TOKENS_INFO.fxn],
    rebalanceRewards: ['FXN', 'wstETH', 'xETH'],
    zapTokens: [
      {
        symbol: 'fETH',
        icon: 'eth',
        address: config.tokens.fETH,
        needZap: false,
        isLp: true,
      },
    ],
  },
  {
    id: 3,
    icon: '/tokens/fxusd.svg',
    subIcon: '/tokens/steth.svg',
    baseSymbol: 'wstETH',
    gaugeType: 'boostRebalance',
    nameShow: 'fxUSD Stability Pool Redeem to wstETH',
    poolType: 'fxUSD',
    withdrawDefaultToken: 'fxUSD',
    gaugeClaimer: config.contracts.fstETH_Claimer,
    rebalancePoolAddress: config.contracts.FxUSD_ShareableRebalancePool_wstETH,
    rebalanceWithBonusTokenAddress: config.contracts.FxUSD_Rebalancer,
    infoKey: 'rebalancePoolV2_info_fxUSD_wstETH',
    gaugeRewards: [config.TOKENS_INFO.fxn],
    rebalanceRewards: ['FXN', 'wstETH'],
    zapTokens: [
      {
        symbol: 'fxUSD',
        address: config.tokens.fxUSD,
        needZap: false,
        isLp: true,
      },
    ],
  },
  {
    id: 4,
    icon: '/tokens/fxusd.svg',
    subIcon: '/tokens/steth.svg',
    baseSymbol: 'wstETH',
    gaugeType: 'boostRebalance',
    nameShow: 'fxUSD Stability Pool Redeem to xstETH',
    poolType: 'fxUSD',
    withdrawDefaultToken: 'fxUSD',
    gaugeClaimer: config.contracts.fstETH_Claimer,
    rebalancePoolAddress: config.contracts.FxUSD_ShareableRebalancePool_xstETH,
    rebalanceWithBonusTokenAddress: config.contracts.FxUSD_Rebalancer,
    infoKey: 'rebalancePoolV2_info_fxUSD_xstETH',
    gaugeRewards: [config.TOKENS_INFO.fxn],
    rebalanceRewards: ['FXN', 'wstETH', 'xstETH'],
    zapTokens: [
      {
        symbol: 'fxUSD',
        address: config.tokens.fxUSD,
        needZap: false,
        isLp: true,
      },
    ],
  },
  {
    id: 5,
    icon: '/tokens/fxusd.svg',
    subIcon: `${cryptoIcons}#frax`,
    baseSymbol: 'sfrxETH',
    gaugeType: 'boostRebalance',
    nameShow: 'fxUSD Stability Pool Redeem to sfrxETH',
    poolType: 'fxUSD',
    withdrawDefaultToken: 'fxUSD',
    gaugeClaimer: config.contracts.ffrxETH_Claimer,
    rebalancePoolAddress: config.contracts.FxUSD_ShareableRebalancePool_sfrxETH,
    rebalanceWithBonusTokenAddress: config.contracts.FxUSD_Rebalancer,
    infoKey: 'rebalancePoolV2_info_fxUSD_sfrxETH',
    gaugeRewards: [config.TOKENS_INFO.fxn],
    rebalanceRewards: ['FXN', 'sfrxETH'],
    zapTokens: [
      {
        symbol: 'fxUSD',
        address: config.tokens.fxUSD,
        needZap: false,
        isLp: true,
      },
    ],
  },
  {
    id: 6,
    icon: '/tokens/fxusd.svg',
    subIcon: `${cryptoIcons}#frax`,
    baseSymbol: 'sfrxETH',
    gaugeType: 'boostRebalance',
    nameShow: 'fxUSD Stability Pool Redeem to xfrxETH',
    poolType: 'fxUSD',
    withdrawDefaultToken: 'fxUSD',
    gaugeClaimer: config.contracts.ffrxETH_Claimer,
    rebalancePoolAddress: config.contracts.FxUSD_ShareableRebalancePool_xfrxETH,
    rebalanceWithBonusTokenAddress: config.contracts.FxUSD_Rebalancer,
    infoKey: 'rebalancePoolV2_info_fxUSD_xfrxETH',
    gaugeRewards: [config.TOKENS_INFO.fxn],
    rebalanceRewards: ['FXN', 'sfrxETH', 'xfrxETH'],
    zapTokens: [
      {
        symbol: 'fxUSD',
        address: config.tokens.fxUSD,
        needZap: false,
        isLp: true,
      },
    ],
  },
  {
    id: 7,
    icon: '/tokens/rUSD.svg',
    subIcon: '/tokens/eETH.svg',
    baseSymbol: 'weETH',
    gaugeType: 'boostRebalance',
    nameShow: 'rUSD Stability Pool Redeem to weETH',
    poolType: 'rUSD',
    withdrawDefaultToken: 'rUSD',
    gaugeClaimer: config.contracts.feETH_Claimer,
    rebalancePoolAddress: config.contracts.rUSD_ShareableRebalancePool_weETH,
    rebalanceWithBonusTokenAddress: config.contracts.FxUSD_Rebalancer,
    infoKey: 'rebalancePoolV2_info_rUSD_weETH',
    gaugeRewards: [config.TOKENS_INFO.fxn],
    rebalanceRewards: ['FXN', 'weETH'],
    zapTokens: [
      {
        symbol: 'rUSD',
        address: config.tokens.rUSD,
        needZap: false,
        isLp: true,
      },
    ],
  },
  {
    id: 8,
    icon: '/tokens/rUSD.svg',
    subIcon: '/tokens/eETH.svg',
    baseSymbol: 'weETH',
    gaugeType: 'boostRebalance',
    nameShow: 'rUSD Stability Pool Redeem to xeETH',
    poolType: 'rUSD',
    withdrawDefaultToken: 'rUSD',
    gaugeClaimer: config.contracts.feETH_Claimer,
    rebalancePoolAddress: config.contracts.rUSD_ShareableRebalancePool_xeETH,
    rebalanceWithBonusTokenAddress: config.contracts.FxUSD_Rebalancer,
    infoKey: 'rebalancePoolV2_info_rUSD_xeETH',
    gaugeRewards: [config.TOKENS_INFO.fxn],
    rebalanceRewards: ['FXN', 'weETH', 'xeETH'],
    zapTokens: [
      {
        symbol: 'rUSD',
        address: config.tokens.rUSD,
        needZap: false,
        isLp: true,
      },
    ],
  },
  {
    id: 9,
    icon: '/tokens/rUSD.svg',
    subIcon: '/tokens/ezETH.png',
    baseSymbol: 'ezETH',
    gaugeType: 'boostRebalance',
    nameShow: 'rUSD Stability Pool Redeem to ezETH',
    poolType: 'rUSD',
    withdrawDefaultToken: 'rUSD',
    gaugeClaimer: config.contracts.feETH_Claimer,
    rebalancePoolAddress: config.contracts.rUSD_ShareableRebalancePool_ezETH,
    rebalanceWithBonusTokenAddress: config.contracts.FxUSD_Rebalancer,
    infoKey: 'rebalancePoolV2_info_rUSD_ezETH',
    gaugeRewards: [config.TOKENS_INFO.fxn],
    rebalanceRewards: ['FXN', 'ezETH'],
    zapTokens: [
      {
        symbol: 'rUSD',
        address: config.tokens.rUSD,
        needZap: false,
        isLp: true,
      },
    ],
  },
  {
    id: 10,
    icon: '/tokens/rUSD.svg',
    subIcon: '/tokens/ezETH.png',
    baseSymbol: 'ezETH',
    gaugeType: 'boostRebalance',
    nameShow: 'rUSD Stability Pool Redeem to xezETH',
    poolType: 'rUSD',
    withdrawDefaultToken: 'rUSD',
    gaugeClaimer: config.contracts.feETH_Claimer,
    rebalancePoolAddress: config.contracts.rUSD_ShareableRebalancePool_xezETH,
    rebalanceWithBonusTokenAddress: config.contracts.FxUSD_Rebalancer,
    infoKey: 'rebalancePoolV2_info_rUSD_xezETH',
    gaugeRewards: [config.TOKENS_INFO.fxn],
    rebalanceRewards: ['FXN', 'ezETH', 'xezETH'],
    zapTokens: [
      {
        symbol: 'rUSD',
        address: config.tokens.rUSD,
        needZap: false,
        isLp: true,
      },
    ],
  },
  // {
  //   id: 11,
  //   icon: '/images/f-logo.svg',
  //   subIcon: '/tokens/crypto-icons-stack.svg#cvx',
  //   baseSymbol: 'aCVX',
  //   gaugeType: 'boostRebalance',
  //   nameShow: 'fCVX Stability Pool Redeem to aCVX',
  //   poolType: 'fCVX',
  //   withdrawDefaultToken: 'fCVX',
  //   rebalancePoolAddress: config.contracts.ShareableRebalancePool_aCVX,
  //   rebalanceWithBonusTokenAddress: config.contracts.FxUSD_Rebalancer,
  //   infoKey: 'rebalancePoolV2_info_fCVX_aCVX',
  //   gaugeRewards: [config.TOKENS_INFO.fxn],
  //   rebalanceRewards: ['FXN', 'aCVX'],
  //   zapTokens: [
  //     {
  //       symbol: 'aCVX',
  //       address: config.tokens.aCVX,
  //       needZap: false,
  //       isLp: true,
  //     },
  //   ],
  // },
  // {
  //   id: 12,
  //   icon: '/images/f-logo.svg',
  //   subIcon: '/tokens/crypto-icons-stack.svg#cvx',
  //   baseSymbol: 'aCVX',
  //   gaugeType: 'boostRebalance',
  //   nameShow: 'fCVX Stability Pool Redeem to xCVX',
  //   poolType: 'fCVX',
  //   withdrawDefaultToken: 'fCVX',
  //   rebalancePoolAddress: config.contracts.ShareableRebalancePool_xCVX,
  //   rebalanceWithBonusTokenAddress: config.contracts.FxUSD_Rebalancer,
  //   infoKey: 'rebalancePoolV2_info_fCVX_xCVX',
  //   gaugeRewards: [config.TOKENS_INFO.fxn],
  //   rebalanceRewards: ['FXN', 'aCVX', 'xCVX'],
  //   zapTokens: [
  //     {
  //       symbol: 'aCVX',
  //       address: config.tokens.aCVX,
  //       needZap: false,
  //       isLp: true,
  //     },
  //   ],
  // },
  {
    id: 13,
    icon: '/tokens/btcUSD.svg',
    subIcon: '/tokens/WBTC.svg',
    baseSymbol: 'WBTC',
    gaugeType: 'boostRebalance',
    nameShow: 'btcUSD Stability Pool Redeem to WBTC',
    poolType: 'btcUSD',
    withdrawDefaultToken: 'btcUSD',
    gaugeClaimer: config.contracts.feETH_Claimer,
    rebalancePoolAddress: config.contracts.btcUSD_ShareableRebalancePool_WBTC,
    rebalanceWithBonusTokenAddress: config.contracts.FxUSD_Rebalancer,
    infoKey: 'rebalancePoolV2_info_btcUSD_WBTC',
    gaugeRewards: [config.TOKENS_INFO.fxn],
    rebalanceRewards: ['FXN', 'aladdinWBTC'],
    zapTokens: [
      {
        symbol: 'btcUSD',
        address: config.tokens.btcUSD,
        needZap: false,
        isLp: true,
      },
    ],
  },
  {
    id: 14,
    icon: '/tokens/btcUSD.svg',
    subIcon: '/tokens/WBTC.svg',
    baseSymbol: 'WBTC',
    gaugeType: 'boostRebalance',
    nameShow: 'btcUSD Stability Pool Redeem to xWBTC',
    poolType: 'btcUSD',
    withdrawDefaultToken: 'btcUSD',
    gaugeClaimer: config.contracts.feETH_Claimer,
    rebalancePoolAddress: config.contracts.btcUSD_ShareableRebalancePool_xWBTC,
    rebalanceWithBonusTokenAddress: config.contracts.FxUSD_Rebalancer,
    infoKey: 'rebalancePoolV2_info_btcUSD_xWBTC',
    gaugeRewards: [config.TOKENS_INFO.fxn],
    rebalanceRewards: ['FXN', 'aladdinWBTC', 'xWBTC'],
    zapTokens: [
      {
        symbol: 'btcUSD',
        address: config.tokens.btcUSD,
        needZap: false,
        isLp: true,
      },
    ],
  },
]

export const OTHER_GAUGE_LIST = [
  {
    icons: [
      {
        icon: '/images/FXN.svg',
      },
    ],
    id: 1,
    name: 'veFund',
    gaugeType: 2,
    gaugeTypeName: 'Fundraising',
    lpAddress: '0x558e7Dd3A72aaA8D54002cabc4565ad9dB58A6dF',
    lpGaugeAddress: '0x558e7Dd3A72aaA8D54002cabc4565ad9dB58A6dF',
    gaugeRewards: [config.TOKENS_INFO.fxn],
  },
]

export const GAUGE_LIST = [
  ...REBALANCE_GAUGE_LIST,
  ...POOLS_LIST,
  ...OTHER_GAUGE_LIST,
]

export default POOLS_LIST
