import config from '@/config/index'

const cryptoIcons = '/assets/crypto-icons-stack.svg'

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
    isCloseManageConvex: true,
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
    isCloseManageConvex: true,
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
  // {
  //   id: 9,
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
  //   id: 10,
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
