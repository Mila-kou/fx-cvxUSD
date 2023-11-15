const CLEVIcon = '/assets/tokens/clev.svg'

const contracts = {
  eth: '0x0000000000000000000000000000000000000000',
  multiCall: '0xeefba1e63905ef1d7acba5a8513c70307c1ce441',
  idoSale1: '0x3eB6Da2d3f39BA184AEA23876026E0747Fb0E17f', // round 1

  idoSale: '0x674A745ADb09c3333D655cC63e2d77ACbE6De935', // round 2
  fundsRaisedToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // weth

  // fx ----
  ChainlinkTwapOracleV3: '0xce3b7f32b98599260F4a057b47fa55DcBDa0A757',
  fETH: '0x53805A76E1f5ebbFE7115F16f9c87C2f7e633726',
  xETH: '0xe063F04f280c60aECa68b38341C2eEcBeC703ae2',
  fx_Market: '0xe7b9c7c9cA85340b8c06fb805f7775e3015108dB',
  fx_stETHTreasury: '0x0e5CAA5c889Bdf053c9A76395f62267E653AFbb0',
  fx_stETHGateway: '0x9bF5fFABbF97De0a47843A7Ba0A9DDB40f2e2ed5',

  fx_RebalancePool_A: '0xa677d95B91530d56791FbA72C01a862f1B01A49e',
  fx_RebalancePool_B: '0x1C33BDb791e952C4Dd9b65C9C0D7590d215aF0d2',
  fx_RebalanceWithBonusToken_A: '0x17f21f468d77E6e35702a9Ae7a9da50Db7F6a4f4',
  fx_RebalanceWithBonusToken_B: '0xFf71c3AF2d66E2bAFc8088000fFB4CbFf4Ed7814',

  fx_VotingEscrowBoost: '0x1DC94c4Dba60f2880A40327EF465E364C57df03F',
  fx_VotingEscrowProxy: '0x9B487bA5eB7848352cbFFE20DE7bC3384660E945',
  fx_GaugeController: '0xe60eB8098B34eD775ac44B1ddE864e098C6d7f37',

  // ETH+xETH
  fx_SharedLiquidityGauge_ETH_xETH:
    '0x82E535428b3034Ca74ce738949954715627cb140',
  fx_ConvexCurveManager_ETH_xETH: '0x9748Df3c38Ca6B03697B0769CDbf46BFe7E800d8',

  // ETH+FXN
  fx_SharedLiquidityGauge_ETH_FXN: '0xF74CA519Fe35Ec6A862A4debD8e317BeD3c47c87',
  fx_ConvexCurveManager_ETH_FXN: '0x23831E29db590BbbAcF267EE2Cf377cD3E54A718',

  // crvUSD+fETH
  fx_SharedLiquidityGauge_crvUSD_fETH:
    '0x12B295D12a4D4DF2F3F5B2B8E151bbE000564fa5',
  fx_ConvexCurveManager_crvUSD_fETH:
    '0x79c5f5b0753acE25ecdBdA4c2Bc86Ab074B6c2Bb',

  // fETH+FRAXBP
  fx_SharedLiquidityGauge_fETH_FRAXBP:
    '0x5c28b966aB37cFB9397bBc04595f91F0fBf06d9b',
  fx_ConvexCurveManager_fETH_FRAXBP:
    '0x4eEfea49e4D876599765d5375cF7314cD14C9d38',

  fx_FxGateway: '0x49e51067E695bd79d6275eCaB6E9E527a72AbdE4',
  fx_ReservePool: '0x5d0Aacf75116d1645Db2B3d1Ca4b303ef0CA3752',
  fx_FxETHTwapOracle: '0xa84360896cE9152d1780c546305BB54125F962d9',

  fx_Vesting: '0x2290eeFEa24A6E43b26C27187742bD1FEDC10BDB',

  FXN: '0x365AccFCa291e7D3914637ABf1F7635dB165Bb09',
  fx_FXN_treasury: '0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF',
  fx_FXN_PlatformFeeDistributor: '0x9B54B7703551D9d0ced177A78367560a8B2eDDA4',
  fx_PlatformFeeSpliter: '0xc6dEe5913e010895F3702bc43a40d661B13a40BD',
  veFXN: '0xEC6B8A3F3605B083F7044C0F31f2cac0caf1d469',
  TokenMinter: '0xC8b194925D55d5dE9555AD1db74c149329F71DeF',
  GaugeController: '0xe60eB8098B34eD775ac44B1ddE864e098C6d7f37',
  fx_ve_FeeDistributor: '0x851AAEA3A2757D457E1Ce88C3808C1690213e432',

  redeemConverter: '0xAF345c813CE17Cc5837BfD14a910D365223F3B95',

  CurvefiSwapRouterAddress: '0x99a58482bd75cbab83b27ec03ca68ff489b5788f',
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

  aladdinCLEV: '0x72953a5C32413614d24C29c84a66AE4B59581Bbf',
  aladdinVeFeeForCVX: '0x261E3aEB4cd1ebfD0Fa532d6AcDd4B21EbdCd2De', // FeeDistributor
  aladdinVeFeeForFRAX: '0xb5e7F9cb9d3897808658F1991AD32912959b42E2', // FeeDistributor
  aladdinVeCLEV: '0x94be07d45d57c7973A535C1c517Bd79E602E051e',
  aladdinVeFeeGateway: '0x8Fc7906Fc6047679DaD53c0c3B40E135486421e9', // VeFeeGateway
  aladdinRewardClaimHelper: '0xAf59d144357DCc8a852AD601f27BF6310b657a7f', // RewardClaimHelper
  aladdinGaugeController: '0xB992E8E1943f40f89301aB89A5C254F567aF5b63',
  aladdinCLEVMinter: '0x4aa2afd5616bEEC2321a9EfD7349400d4F18566A',
  aladdinAllInOneGateway: '0x6e513d492Ded19AD8211a57Cc6B4493C9E6C857B',

  BalancerContract: '0xba12222222228d8ba445958a75a0704d566bf2c8',
}

const gaugeTokenList = {
  fx_ETH_xETH: '0x82E535428b3034Ca74ce738949954715627cb140',
  ConvexCurveManager_ETH_xETH: '0x9748Df3c38Ca6B03697B0769CDbf46BFe7E800d8',
  fx_ETH_FXN: '0xF74CA519Fe35Ec6A862A4debD8e317BeD3c47c87',
  ConvexCurveManager_ETH_FXN: '0x23831E29db590BbbAcF267EE2Cf377cD3E54A718',
  fx_crvUSD_fETH: '0x12B295D12a4D4DF2F3F5B2B8E151bbE000564fa5',
  ConvexCurveManager_crvUSD_fETH: '0x79c5f5b0753acE25ecdBdA4c2Bc86Ab074B6c2Bb',
  fx_fETH_FRAXBP: '0x5c28b966aB37cFB9397bBc04595f91F0fBf06d9b',
  ConvexCurveManager_fETH_FRAXBP: '0x4eEfea49e4D876599765d5375cF7314cD14C9d38',
}

const tokens = {
  eth: '0x0000000000000000000000000000000000000000',
  weth: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  idoSale: '0x3eB6Da2d3f39BA184AEA23876026E0747Fb0E17f',

  fETH: '0x53805A76E1f5ebbFE7115F16f9c87C2f7e633726',
  xETH: '0xe063F04f280c60aECa68b38341C2eEcBeC703ae2',

  usdc: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  usdt: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  dai: '0x6b175474e89094c44da98b954eedeac495271d0f',
  wbtc: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
  seth: '0x5e74c9036fb86bd7ecdcb084a0673efc32ea31cb',
  stETH: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
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

  // abcCVX
  abcCVX: '0xDEC800C2b17c9673570FDF54450dc1bd79c8E359',
}

const TOKENS_INFO = {
  eth: ['ethereum', tokens.eth, 18, 'eth'],
  usdc: ['usd-coin', tokens.usdc, 6, 'usdc'],
  usdt: ['usdt', tokens.usdt, 6, 'usdt'],
  dai: ['dai', tokens.dai, 18, 'dai'],
  weth: ['weth', tokens.weth, 18, 'weth'],
  wbtc: ['bitcoin', tokens.wbtc, 8, 'wbtc'],
  seth: ['seth', tokens.seth, 18, 'seth'],
  stETH: ['staked-ether', tokens.stETH, 18, 'stETH'],
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
  fETH: ['fETH', tokens.fETH, 18],
  xETH: ['xETH', tokens.xETH, 18],
  veFXN: ['veFXN', tokens.veFXN, 18],
  fxn: ['FXN', tokens.FXN, 18],
}

const zapTokens = {
  USDC: {
    symbol: 'USDC',
    icon: 'usdc',
    decimals: TOKENS_INFO.usdc[2],
    address: TOKENS_INFO.usdc[1],
    needZap: true,
  },
  USDT: {
    symbol: 'USDT',
    icon: 'usdt',
    decimals: TOKENS_INFO.usdt[2],
    address: TOKENS_INFO.usdt[1],
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
    decimals: TOKENS_INFO.stETH[2],
    address: TOKENS_INFO.stETH[1],
    needZap: true,
  },
  fETH: {
    symbol: 'fETH',
    icon: 'eth',
    decimals: TOKENS_INFO.fETH[2],
    address: TOKENS_INFO.fETH[1],
    needZap: true,
  },
  xETH: {
    symbol: 'xETH',
    icon: 'eth',
    decimals: TOKENS_INFO.xETH[2],
    address: TOKENS_INFO.xETH[1],
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
  gaugeTokenList,
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
