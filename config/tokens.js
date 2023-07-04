const CLEVIcon = '/assets/tokens/clev.svg'
const clevUsdIcons = '/assets/tokens/clevUSD.svg'

const contracts = {
  eth: '0x0000000000000000000000000000000000000000',
  multiCall: '0xeefba1e63905ef1d7acba5a8513c70307c1ce441',
  idoSale: '0x3eB6Da2d3f39BA184AEA23876026E0747Fb0E17f',
  fundsRaisedToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // weth

  ChainlinkTwapOracleV3: '0x32366846354DB5C08e92b4Ab0D2a510b2a2380C8',
  fETH: '0xcAD8810BfBbdd189686062A3A399Fc3eCAbB5164',
  xETH: '0xBB8828DDb2774a141EBE3BB449d1cc5BF6212885',
  fx_Market: '0xDd2cf944633484e4B415d540397C7DD34093ECBc',
  fx_Treasury: '0x58EE0A16FB24ea34169e237bb10900A6a90288FB',
  fx_ETHGateway: '0x922837838aEd2937742CFF7b0AdFd74157e3B9D7',

  fx_VotingEscrow: '0x3875745F4A04549527c7EEa8f777D333193c665c',
  fx_GaugeController: '0x51Ac57dcaf5186a80368EeC6D8DAa338c9CaC125',
  fx_Minter: '0x51Ac57dcaf5186a80368EeC6D8DAa338c9CaC125',

  //  ----
  nativeToken: '0xb26C4B3Ca601136Daf98593feAeff9E0CA702a8D',

  convexVault: '0xc8fF37F7d057dF1BB9Ad681b53Fa4726f268E0e8',
  convexVaultAcrv: '0x2b95A1Dcc3D405535f9ed33c219ab38E8d7e0884',

  curveCvxcrvPoolSwap: '0x9D0464996170c6B9e75eED71c68B99dDEDf279e8',
  curveCvxfxsPoolSwap: '0xd658A338613198204DCa1143Ac3F01A722b5d94A',
  curveStethPoolSwap: '0xDC24316b9AE028F1497c275EB9192a3Ea0f67022',
  curveFraxPoolSwap: '0xd632f22692FaC7611d2AA1C0D552930D43CAEd3B',
  curveTricrypto2PoolSwap: '0xD51a44d3FaE010294C616388b506AcdA1bfAAE46',
  curveCrvethPoolSwap: '0x8301AE4fc9c624d1D396cbDAa1ed877821D7C511',
  curveCvxethPoolSwap: '0xB576491F1E6e5E62f1d8F26062Ee822B40B0E0d4',

  curve3PoolSwap: '0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7',
  curveRocketPoolEthSwap: '0x447Ddd4960d9fdBF6af9a790560d0AF76795CB08',
  curveUstWormholeSwap: '0xCEAF7747579696A2F0bb206a14210e3c9e6fB269',

  lockCvx: '0x96C68D861aDa016Ed98c30C810879F9df7c64154',
  transmuterCvx: '0xCe4dCc5028588377E279255c0335Effe2d7aB72a',
  aldCvx: '0xf05e58fCeA29ab4dA01A495140B349F8410Ba904',
  vlCVX: '0xD18140b4B819b895A3dba5442F959fA44994AF50',

  // clevCRV
  metaFurnace: '0xf5D1cA341e1BAadd986D43b226F92B778C75C8cA',
  metaClever: '0x7059eAeBAd4f26c0FD4183fCeCBF93bB21E81E3C',

  // clevUSD
  metaFurnaceForFrax: '0x7f160EFC2436F1aF4E9E8a57d0a5beB8345761a9',
  metaCleverForFrax: '0xEB0ea9D24235aB37196111eeDd656D56Ce4F53b1',
  metaCleverForLUSDFraxBP: '0xb2Fcee71b25B62baFE442c58AF58c42143673cC1',
  metaCleverForTUSDFraxBP: '0xad4caC207A0BFEd10dF8A4FC6A28D377caC730E0',
  metaCleverForClevUSDFRAXBP: '0x2C37F1DcEd208530A05B061A183d8937F686157e',

  aladdinCLEV: '0x72953a5C32413614d24C29c84a66AE4B59581Bbf',
  aladdinVeFeeForCVX: '0x261E3aEB4cd1ebfD0Fa532d6AcDd4B21EbdCd2De', // FeeDistributor
  aladdinVeFeeForFRAX: '0xb5e7F9cb9d3897808658F1991AD32912959b42E2', // FeeDistributor
  aladdinVeCLEV: '0x94be07d45d57c7973A535C1c517Bd79E602E051e',
  aladdinVeFeeGateway: '0x8Fc7906Fc6047679DaD53c0c3B40E135486421e9', // VeFeeGateway
  aladdinRewardClaimHelper: '0xAf59d144357DCc8a852AD601f27BF6310b657a7f', // RewardClaimHelper
  aladdinGaugeController: '0xB992E8E1943f40f89301aB89A5C254F567aF5b63',
  aladdinCLEVMinter: '0x4aa2afd5616bEEC2321a9EfD7349400d4F18566A',
  aladdinAllInOneGateway: '0x6e513d492Ded19AD8211a57Cc6B4493C9E6C857B',

  aladdinCLEVVest: '0x84C82d43f1Cc64730849f3E389fE3f6d776F7A4E',
  clevHoderTreasuyry: '0xfc08757c505ea28709df66e54870fb6de09f0c5e',

  BalancerContract: '0xba12222222228d8ba445958a75a0704d566bf2c8',

  // cveCRV
  CurveLockerProxy: '0x3330B5eca82115417Ae7A1Ab6F781295c0A0eB75',
  CLeverVeCRV: '0xCD320b82010aD409d746c83d855Dd6F936d86Edf',
  CrvDepositor: '0xF56213409F803ec11a029A7457ed9B1Aa53e2289',
  CLeverVeCRVLiquidityStaking: '0xD12AC387057bFb93892Ec15E7C039AF93666F551',
  CurveBooster: '0xFcecbBcd85eeb27FeC0850372a6e738cC303EAc7',
  clevCRV: '0x3eB6Da2d3f39BA184AEA23876026E0747Fb0E17f',
  clevCRVFurnace: '0xF8d8fD35A3BAa5559ED67ed532072287AE9770D3',

  PlatformFeeDistributor: '0xD6eFa5B63531e9ae61e225b02CbACD59092a35bE',
}

const tokens = {
  eth: '0x0000000000000000000000000000000000000000',
  weth: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  idoSale: '0x3eB6Da2d3f39BA184AEA23876026E0747Fb0E17f',
  fETH: '0xcAD8810BfBbdd189686062A3A399Fc3eCAbB5164',
  xETH: '0xBB8828DDb2774a141EBE3BB449d1cc5BF6212885',

  usdc: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  usdt: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  dai: '0x6b175474e89094c44da98b954eedeac495271d0f',
  wbtc: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
  seth: '0x5e74c9036fb86bd7ecdcb084a0673efc32ea31cb',
  steth: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
  renBTC: '0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D',
  aldVote: '0x6e2b4801040d5fab7D0d7700bE5903322BCf61Ce',
  comp: '0xc00e94cb662c3520282e6f5717214004a7f26888',
  sushi: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
  tusd: '0x0000000000085d4780B73119b644AE5ecd22b376',
  lusd: '0x5f98805A4E8be255a32880FDeC7F6728C6568bA0',

  crv: '0xD533a949740bb3306d119CC777fa900bA034cd52',
  cvxcrv: '0x62b9c7356a2dc64a1969e19c23e4f579f9810aa7',

  frax: '0x853d955aCEf822Db058eb8505911ED77F175b99e',
  cvx: '0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B',
  fxs: '0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0',

  reth: '0xae78736cd615f374d3085123a210448e74fc6393',
  wstETH: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
  ust: '0x890f4e345B1dAED0367A877a1612f86A1f86985f',

  vlCVX: '0xD18140b4B819b895A3dba5442F959fA44994AF50',
  clev: '0x72953a5C32413614d24C29c84a66AE4B59581Bbf',
  clevCVX: '0xf05e58fCeA29ab4dA01A495140B349F8410Ba904',

  // for cvx /page/accelerator-cvx
  aldcvx: '0xf9Ee4aBCBA5823148850BA49d93238177accbB64',

  // for clev /page/clevers
  clevCRV: '0x41c94eA5A7724d8F4f6e67e529e809b9EAB11Db2', // clevers/aCrv
  clevUSD: '0x3C20Ac688410bE8F391bE1fb00AFc5C212972F86', // clevers/clevUSD

  aCRV: '0x2b95A1Dcc3D405535f9ed33c219ab38E8d7e0884',
  cusdc: '0x39AA39c021dfbaE8faC545936693aC917d5E7563',
  cyUSDC: '0x76Eb2FE28b36B3ee97F3Adae0C69606eeDB2A37c',
  cyUSDT: '0x48759F220ED983dB51fA7A8C0D2AAb8f3ce4166a',
  cdai: '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643',
  cyDAI: '0x8e595470Ed749b85C6F7669de83EAe304C2ec68F',
  ustTerra: '0xa47c8bf37f92aBed4A126BDA807A7b7498661acD',
  cvxfxs: '0xFEEf77d3f69374f66429C91d732A244f074bdf74',

  // abcCVX
  abcCVX: '0xDEC800C2b17c9673570FDF54450dc1bd79c8E359',
  // cveCRV
  cleverVeCRV: '0xCD320b82010aD409d746c83d855Dd6F936d86Edf',
}

const TOKENS_INFO = {
  eth: ['ethereum', tokens.eth, 18, 'eth'],
  usdc: ['usd-coin', tokens.usdc, 6, 'usdc'],
  dai: ['dai', tokens.dai, 18, 'dai'],
  weth: ['weth', tokens.weth, 18, 'weth'],
  wbtc: ['bitcoin', tokens.wbtc, 8, 'wbtc'],
  seth: ['seth', tokens.seth, 18, 'seth'],
  steth: ['staked-ether', tokens.steth, 18, 'steth'],
  renBTC: ['renbtc', tokens.renBTC, 8, 'renBTC'],
  clev: ['clev', tokens.clev, 18, 'aldClev'],
  clevCVX: ['clev', tokens.clevCVX, 18, 'aldClevCVX'],
  veclev: ['', contracts.aladdinVeCLEV, 18, 'aldVeclev'],
  vefee: ['', contracts.aladdinVeFee, 18, 'aldVefee'],
  cvx: ['convex-finance', tokens.cvx, 18],
  frax: ['frax', tokens.frax, 18, 'frax'],
  busd: ['binance-usd', tokens.busd, 18, 'busd'],
  tusd: ['true-usd', tokens.tusd, 18, 'TUSD'],
  lusd: ['usd-coin', tokens.lusd, 18, 'lusd'],
  cvxfxs: ['', tokens.cvxfxs, 18, 'cvxfxs'],
  clevUSD: ['frax', tokens.clevUSD, 18],
}

const zapTokens = {
  USDC: {
    symbol: 'USDC',
    icon: 'usdc',
    decimals: TOKENS_INFO.usdc[2],
    address: TOKENS_INFO.usdc[1],
    needZap: true,
  },
  ETH: {
    symbol: 'ETH',
    icon: 'eth',
    decimals: TOKENS_INFO.eth[2],
    address: TOKENS_INFO.eth[1],
    needZap: true,
  },
  stETH: {
    symbol: 'stETH',
    icon: 'weth',
    decimals: TOKENS_INFO.steth[2],
    address: TOKENS_INFO.steth[1],
    needZap: true,
  },
  WETH: {
    symbol: 'WETH',
    icon: 'weth',
    decimals: TOKENS_INFO.weth[2],
    address: TOKENS_INFO.weth[1],
    needZap: true,
  },
  CLEV: {
    symbol: 'CLEV',
    icon: CLEVIcon,
    decimals: TOKENS_INFO.clev[2],
    address: TOKENS_INFO.clev[1],
    needZap: true,
  },
  CVX: {
    symbol: 'CVX',
    icon: 'cvx',
    decimals: TOKENS_INFO.cvx[2],
    address: TOKENS_INFO.cvx[1],
    needZap: true,
  },
  CLEVCVX: {
    symbol: 'CLEVCVX',
    icon: CLEVIcon,
    decimals: TOKENS_INFO.clevCVX[2],
    address: TOKENS_INFO.clevCVX[1],
    needZap: true,
  },
  FRAX: {
    symbol: 'FRAX',
    icon: 'frax',
    decimals: TOKENS_INFO.frax[2],
    address: TOKENS_INFO.frax[1],
    needZap: true,
  },
  LUSD: {
    symbol: 'LUSD',
    icon: 'lusd',
    decimals: TOKENS_INFO.lusd[2],
    address: TOKENS_INFO.lusd[1],
    needZap: true,
  },
  BUSD: {
    symbol: 'BUSD',
    icon: 'busd',
    decimals: TOKENS_INFO.busd[2],
    address: TOKENS_INFO.busd[1],
    needZap: true,
  },
  TUSD: {
    symbol: 'TUSD',
    icon: 'tusd',
    decimals: TOKENS_INFO.tusd[2],
    address: TOKENS_INFO.tusd[1],
    needZap: true,
  },
  CVXFXS: {
    symbol: 'cvxFXS',
    icon: 'fxs',
    decimals: TOKENS_INFO.cvxfxs[2],
    address: TOKENS_INFO.cvxfxs[1],
    needZap: true,
  },
  clevUSD: {
    symbol: 'clevUSD',
    icon: clevUsdIcons,
    decimals: TOKENS_INFO.clevUSD[2],
    address: TOKENS_INFO.clevUSD[1],
    needZap: true,
  },
}

const POOLS_LIST_GAUGE = {
  Curve_CLEV_ETH: {
    lpPoolCurveToken: '0x342D1C4Aa76EA6F5E5871b7f11A019a0eB713A4f',
    token: '0x6C280dB098dB673d30d5B34eC04B6387185D3620',
    gauge: '0x86e917ad6Cb44F9E6C8D9fA012acF0d0CfcF114f',
    underlyingAssets: [TOKENS_INFO.weth, TOKENS_INFO.clev],
    otherTokenName: 'CLEV',
    otherTokenIndex: 1,
    checkLpPriceTokenIndex: 0,
    checkLpTokenName: 'ETH',
    abiType: 'balances',
  },
  Curve_clevCVX_CVX: {
    lpPoolCurveToken: '0xF9078Fb962A7D13F55d40d49C8AA6472aBD1A5a6',
    token: '0xF9078Fb962A7D13F55d40d49C8AA6472aBD1A5a6',
    gauge: '0xF758BE28E93672d1a8482BE15EAf21aa5450F979',
    underlyingAssets: [TOKENS_INFO.cvx, TOKENS_INFO.clevCVX],
    otherTokenName: 'clevCVX',
    otherTokenIndex: 1,
    checkLpPriceTokenIndex: 0,
    checkLpTokenName: 'CVX',
    abiType: 'balances',
  },
  Concentrator_abcCVX: {
    lpPoolCurveToken: '',
    token: tokens.abcCVX,
    gauge: '0xc5022291cA8281745d173bB855DCd34dda67F2f0',
    underlyingAssets: [TOKENS_INFO.cvx, TOKENS_INFO.clevCVX],
    otherTokenName: 'clevCVX',
    otherTokenIndex: 1,
    checkLpPriceTokenIndex: 0,
    checkLpTokenName: 'CVX',
    abiType: 'balances',
  },
}
export default {
  tokens,
  contracts,
  TOKENS_INFO,
  POOLS_LIST_GAUGE,
  zapTokens,
}

// market: "0xeCbA45f077df21D9142312a5aa21411371E1f943",
//   baseToken: ADDRESS.WETH,
//   fToken: "0xfAb5Bc982111A8cA5c3D8306622D7bAFD3382d0c",
//   xToken: "0xd43555d5e5Af8DE5302ff12911DCE11C42c21db0",
//   platform: "0xFC08757c505eA28709dF66E54870fB6dE09f0C5E",
//   priceOracle: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
//   beta: 1e15,
//   initialMintRatio: 1e15,
//   treasury: "0xf1A4c4D30D90D49DbA8Baf0e14dA5fff54B638b8"
