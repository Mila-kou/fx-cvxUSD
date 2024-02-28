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
    id: 2,
    name: 'FXN+cvxFXN',
    platform: 'FX',
    fromPlatformIcon: `${cryptoIcons}#crv`,
    fromPlatform: 'Curve',
    platformUrl: 'https://curve.fi/#/ethereum/pools/factory-v2-358/deposit',
    nameShow: ['ETH+cvxFXN Curve', ' Pool'],
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
    id: 3,
    name: 'FXN+sdFXN',
    nameShow: ['ETH+sdFXN Curve', ' Pool'],
    platform: 'FX',
    fromPlatformIcon: `${cryptoIcons}#crv`,
    fromPlatform: 'Curve',
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
]

export const REBALANCE_GAUGE_LIST = [
  {
    logo: FLogo,
    icon: '/images/f-logo.svg',
    id: 1,
    name: 'fETH - wstETH',
    platform: 'FX',
    fromPlatformIcon: FLogo,
    fromPlatform: 'Fx',
    poolType: 'fETH',
    platformUrl: 'https://fx.aladdin.club/earning-pool',
    curveType: 'Rebalance Pool',
    nameShow: 'Fx fETH',
    gaugeType: 1,
    gaugeTypeName: 'Rebalance Pool Gauge',
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
    id: 2,
    name: 'fxUSD - wstETH',
    platform: 'FX',
    fromPlatformIcon: `${cryptoIcons}#crv`,
    fromPlatform: 'Fx',
    poolType: 'fxUSD',
    platformUrl: 'https://fx.aladdin.club/earning-pool',
    nameShow: 'fxUSD wstETH Rebalance Pool',
    gaugeType: 1,
    gaugeTypeName: 'Rebalance Pool Gauge',
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
    id: 3,
    name: 'fxUSD - sfrxETH',
    platform: 'FX',
    fromPlatformIcon: `${cryptoIcons}#crv`,
    fromPlatform: 'Fx',
    poolType: 'fxUSD',
    gaugeType: 1,
    gaugeTypeName: 'Rebalance Pool Gauge',
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
    nameShow: 'fETH Rebalance Pool Redeem to stETH',
    poolType: 'fETH',
    withdrawDefaultToken: 'fETH',
    rebalancePoolAddress: config.contracts.fx_BoostableRebalancePool_APool,
    rebalanceWithBonusTokenAddress:
      config.contracts.fx_RebalanceWithBonusToken_BoostRebalanceAPool,
    infoKey: 'rebalancePoolV2_info_A',
    gaugeRewards: [config.TOKENS_INFO.fxn],
    rebalanceReward: [config.TOKENS_INFO.stETH],
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
    rebalanceRewards: [config.TOKENS_INFO.stETH, config.TOKENS_INFO.xETH],
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
    nameShow: 'fxUSD Rebalance Pool Redeem to wstETH',
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
    nameShow: 'fxUSD Rebalance Pool Redeem to xstETH',
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
    nameShow: 'fxUSD Rebalance Pool Redeem to sfrxETH',
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
    nameShow: 'fxUSD Rebalance Pool Redeem to xfrxETH',
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

export const GAUGE_LIST = [...REBALANCE_GAUGE_LIST, ...POOLS_LIST]

export default POOLS_LIST
