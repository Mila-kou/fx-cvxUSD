import config from '@/config/index'

const cryptoIcons = '/assets/crypto-icons-stack.svg'

const FLogo = '/images/f-logo.svg'
const XLogo = '/images/x-logo.svg'

export const POOLS_LIST = [
  {
    logo: FLogo,
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
    fromPlatformIcon: `${cryptoIcons}#crv`,
    fromPlatform: 'Curve',
    platformUrl: 'https://curve.fi/#/ethereum/pools/factory-crypto-311/deposit',
    curveType: 'curveCopyto',
    nameShow: [' ETH+FXN Curve', ' Pool'],
    gaugeType: 0,
    gaugeTypeName: 'Liquidity Gauge',
    // lpPoolToken: config.POOLS_LIST_GAUGE.ETH_xETH.lpPoolCurveToken,
    lpAddress: config.POOLS_LIST_GAUGE.ETH_FXN.token,
    lpGaugeAddress: config.POOLS_LIST_GAUGE.ETH_FXN.gauge,
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
    logo: FLogo,
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
    fromPlatformIcon: `${cryptoIcons}#crv`,
    fromPlatform: 'Curve',
    platformUrl: 'https://curve.fi/#/ethereum/pools/factory-v2-358/deposit',
    nameShow: ['FXN+cvxFXN Curve', ' Pool'],
    gaugeType: 0,
    gaugeTypeName: 'Liquidity Gauge',
    // lpPoolToken: config.POOLS_LIST_GAUGE.ETH_FXN.lpPoolCurveToken,
    lpAddress: config.POOLS_LIST_GAUGE.FXN_cvxFXN.token,
    lpGaugeAddress: config.POOLS_LIST_GAUGE.FXN_cvxFXN.gauge,
    // manageConvexGaugeAddress:
    //   config.POOLS_LIST_GAUGE.FXN_cvxFXN.manageConvexGauge,
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
    logo: FLogo,
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
    fromPlatformIcon: `${cryptoIcons}#crv`,
    fromPlatform: 'Curve',
    platformUrl: 'https://curve.fi/#/ethereum/pools/factory-v2-359/deposit',
    gaugeType: 0,
    gaugeTypeName: 'Liquidity Gauge',
    // lpPoolToken: config.POOLS_LIST_GAUGE.crvUSD_fETH.lpPoolCurveToken,
    lpAddress: config.POOLS_LIST_GAUGE.FXN_sdFXN.token,
    lpGaugeAddress: config.POOLS_LIST_GAUGE.FXN_sdFXN.gauge,
    // manageConvexGaugeAddress:
    //   config.POOLS_LIST_GAUGE.FXN_sdFXN.manageConvexGauge,
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
    logo: FLogo,
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
    // manageConvexGaugeAddress:
    //   config.POOLS_LIST_GAUGE.FXN_sdFXN.manageConvexGauge,
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
    logo: FLogo,
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
    // manageConvexGaugeAddress:
    //   config.POOLS_LIST_GAUGE.FXN_sdFXN.manageConvexGauge,
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
    logo: FLogo,
    icons: [
      { icon: '/tokens/crypto-icons-stack.svg#dola' },
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
    // manageConvexGaugeAddress:
    //   config.POOLS_LIST_GAUGE.FXN_sdFXN.manageConvexGauge,
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
    logo: FLogo,
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
    // manageConvexGaugeAddress:
    //   config.POOLS_LIST_GAUGE.FXN_sdFXN.manageConvexGauge,
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
  {
    logo: FLogo,
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
    // manageConvexGaugeAddress:
    //   config.POOLS_LIST_GAUGE.FXN_sdFXN.manageConvexGauge,
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
    logo: FLogo,
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
    // manageConvexGaugeAddress:
    //   config.POOLS_LIST_GAUGE.FXN_sdFXN.manageConvexGauge,
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
    logo: FLogo,
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
    // manageConvexGaugeAddress:
    //   config.POOLS_LIST_GAUGE.FXN_sdFXN.manageConvexGauge,
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
    logo: FLogo,
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
    // manageConvexGaugeAddress:
    //   config.POOLS_LIST_GAUGE.FXN_sdFXN.manageConvexGauge,
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
]

export const REBALANCE_GAUGE_LIST = [
  {
    logo: FLogo,
    icon: '/images/f-logo.svg',
    icons: [
      {
        icon: '/images/f-logo.svg',
      },
    ],
    id: 1,
    name: 'fETH - wstETH',
    platform: 'FX',
    fromPlatformIcon: FLogo,
    fromPlatform: 'Fx',
    poolType: 'fETH',
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
    logo: FLogo,
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
    fromPlatformIcon: `${cryptoIcons}#crv`,
    fromPlatform: 'Fx',
    poolType: 'fxUSD',
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
    logo: FLogo,
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
    fromPlatformIcon: `${cryptoIcons}#crv`,
    fromPlatform: 'Fx',
    poolType: 'fxUSD',
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
]

export const REBALANCE_POOLS_LIST = [
  {
    logo: FLogo,
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
    infoKey: 'rebalancePoolV2_info_A',
    gaugeRewards: [config.TOKENS_INFO.fxn],
    rebalanceRewards: [config.TOKENS_INFO.wstETH],
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
    logo: FLogo,
    id: 2,
    icon: '/images/f-logo.svg',
    subIcon: '/tokens/steth.svg',
    gaugeType: 'boostRebalance',
    nameShow: 'fETH Rebalance Pool Redeem to xETH',
    poolType: 'fETH',
    withdrawDefaultToken: 'fETH',
    rebalancePoolAddress: config.contracts.fx_BoostableRebalancePool_BPool,
    rebalanceWithBonusTokenAddress:
      config.contracts.fx_RebalanceWithBonusToken_BoostRebalanceBPool,
    infoKey: 'rebalancePoolV2_info_B',
    gaugeRewards: [config.TOKENS_INFO.fxn],
    rebalanceRewards: [config.TOKENS_INFO.wstETH, config.TOKENS_INFO.xETH],
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
    logo: FLogo,
    id: 3,
    icon: '/tokens/fxusd.svg',
    subIcon: '/tokens/steth.svg',
    baseSymbol: 'wstETH',
    gaugeType: 'boostRebalance',
    nameShow: 'fxUSD Stability Pool Redeem to wstETH',
    poolType: 'fxUSD',
    withdrawDefaultToken: 'fxUSD',
    rebalancePoolAddress: config.contracts.FxUSD_ShareableRebalancePool_wstETH,
    rebalanceWithBonusTokenAddress: config.contracts.FxUSD_Rebalancer,
    infoKey: 'rebalancePoolV2_info_fxUSD_wstETH',
    gaugeRewards: [config.TOKENS_INFO.fxn],
    rebalanceRewards: [config.TOKENS_INFO.wstETH],
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
    logo: FLogo,
    id: 4,
    icon: '/tokens/fxusd.svg',
    subIcon: '/tokens/steth.svg',
    baseSymbol: 'wstETH',
    gaugeType: 'boostRebalance',
    nameShow: 'fxUSD Stability Pool Redeem to xstETH',
    poolType: 'fxUSD',
    withdrawDefaultToken: 'fxUSD',
    rebalancePoolAddress: config.contracts.FxUSD_ShareableRebalancePool_xstETH,
    rebalanceWithBonusTokenAddress: config.contracts.FxUSD_Rebalancer,
    infoKey: 'rebalancePoolV2_info_fxUSD_xstETH',
    gaugeRewards: [config.TOKENS_INFO.fxn],
    rebalanceRewards: [config.TOKENS_INFO.wstETH, config.TOKENS_INFO.xstETH],
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
    logo: FLogo,
    id: 5,
    icon: '/tokens/fxusd.svg',
    subIcon: `${cryptoIcons}#frax`,
    baseSymbol: 'sfrxETH',
    gaugeType: 'boostRebalance',
    nameShow: 'fxUSD Stability Pool Redeem to sfrxETH',
    poolType: 'fxUSD',
    withdrawDefaultToken: 'fxUSD',
    rebalancePoolAddress: config.contracts.FxUSD_ShareableRebalancePool_sfrxETH,
    rebalanceWithBonusTokenAddress: config.contracts.FxUSD_Rebalancer,
    infoKey: 'rebalancePoolV2_info_fxUSD_sfrxETH',
    gaugeRewards: [config.TOKENS_INFO.fxn],
    rebalanceRewards: [config.TOKENS_INFO.sfrxETH],
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
    logo: FLogo,
    id: 6,
    icon: '/tokens/fxusd.svg',
    subIcon: `${cryptoIcons}#frax`,
    baseSymbol: 'sfrxETH',
    gaugeType: 'boostRebalance',
    nameShow: 'fxUSD Stability Pool Redeem to xfrxETH',
    poolType: 'fxUSD',
    withdrawDefaultToken: 'fxUSD',
    rebalancePoolAddress: config.contracts.FxUSD_ShareableRebalancePool_xfrxETH,
    rebalanceWithBonusTokenAddress: config.contracts.FxUSD_Rebalancer,
    infoKey: 'rebalancePoolV2_info_fxUSD_xfrxETH',
    gaugeRewards: [config.TOKENS_INFO.fxn],
    rebalanceRewards: [config.TOKENS_INFO.sfrxETH, config.TOKENS_INFO.xfrxETH],
    zapTokens: [
      {
        symbol: 'fxUSD',
        address: config.tokens.fxUSD,
        needZap: false,
        isLp: true,
      },
    ],
  },
]

export const OTHER_GAUGE_LIST = [
  {
    logo: FLogo,
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
