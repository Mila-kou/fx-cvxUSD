const CLEVIcon = '/assets/tokens/clev.svg'
const FXNIcon = '/tokens/FXN.svg'
const stETHIcon = '/tokens/steth.svg'
const crvIcon = '/tokens/0xd533a949740bb3306d119cc777fa900ba034cd52.png'
const cvxIcon = '/tokens/0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b.png'

export const contracts = {
  eth: '0x0000000000000000000000000000000000000000',
  multiCall: '0xeefba1e63905ef1d7acba5a8513c70307c1ce441',
  idoSale1: '0x3eB6Da2d3f39BA184AEA23876026E0747Fb0E17f', // round 1

  idoSale: '0x674A745ADb09c3333D655cC63e2d77ACbE6De935', // round 2
  fundsRaisedToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // weth

  Llamas: '0xe127ce638293fa123be79c25782a5652581db234',

  // fx ----
  ChainlinkTwapOracleV3: '0xAd36C7B3C5E0e097884DE951C271eDf5e99EB567', // 0xce3b7f32b98599260F4a057b47fa55DcBDa0A757
  fETH: '0x53805A76E1f5ebbFE7115F16f9c87C2f7e633726',
  xETH: '0xe063F04f280c60aECa68b38341C2eEcBeC703ae2',
  fx_Market: '0xe7b9c7c9cA85340b8c06fb805f7775e3015108dB',
  fx_stETHTreasury: '0x0e5CAA5c889Bdf053c9A76395f62267E653AFbb0',
  fx_stETHGateway: '0x9bF5fFABbF97De0a47843A7Ba0A9DDB40f2e2ed5',

  // ve boost
  fx_VotingEscrowBoost: '0x8Cc02c0D9592976635E98e6446ef4976567E7A81', // for delegation
  fx_VotingEscrowProxy: '0x1145f304d74f3295Fa38b82e7BB8704B0E187FA1', // for delegation

  fx_GaugeController: '0xe60eB8098B34eD775ac44B1ddE864e098C6d7f37',

  fx_FxGateway: '0x5c28b966aB37cFB9397bBc04595f91F0fBf06d9b',
  fx_ReservePool: '0x5d0Aacf75116d1645Db2B3d1Ca4b303ef0CA3752',
  fx_FxETHTwapOracle: '0xa84360896cE9152d1780c546305BB54125F962d9',

  // ManageableVesting
  fx_Vesting: '0x2290eeFEa24A6E43b26C27187742bD1FEDC10BDB',
  fx_ManageableVesting: '0x0E4f31a2f48418c90F5e9fa84Bf761D832C54ceD',
  fx_ManageableVesting_CvxFxnVestingManager:
    '0x43fCFe9F128b5e4271c7E25C47eFe91bA8896220',
  fx_ManageableVesting_SdFxnVestingManager:
    '0xA2FaffE31153e5E60F2352e3ed28ff973309C156',
  convex_cvxFxnStaking: '0xEC60Cd4a5866fb3B0DD317A46d3B474a24e06beF',
  stakeDao_sdFxnStaking: '0xbcfE5c47129253C6B8a9A00565B3358b488D42E0',

  FXN: '0x365AccFCa291e7D3914637ABf1F7635dB165Bb09',
  fx_FXN_treasury: '0x26B2ec4E02ebe2F54583af25b647b1D619e67BbF',
  aladdin_FXN_treasury: '0xc40549aa1D05C30af23a1C4a5af6bA11FCAFe23F',
  fx_FXN_PlatformFeeDistributor: '0x9B54B7703551D9d0ced177A78367560a8B2eDDA4',
  fx_PlatformFeeSpliter: '0x0084C2e1B1823564e597Ff4848a88D61ac63D703',
  fx_FXN_ProxyAdmin: '0x9B54B7703551D9d0ced177A78367560a8B2eDDA4',
  veFXN: '0xEC6B8A3F3605B083F7044C0F31f2cac0caf1d469',
  fx_TokenMinter: '0xC8b194925D55d5dE9555AD1db74c149329F71DeF',
  GaugeController: '0xe60eB8098B34eD775ac44B1ddE864e098C6d7f37',
  fx_ve_FeeDistributor: '0xd116513EEa4Efe3908212AfBAeFC76cb29245681',

  redeemConverter: '0x11C907b3aeDbD863e551c37f21DD3F36b28A6784', // common converter

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

  fx_RebalancePoolRegistry: '0x4eEfea49e4D876599765d5375cF7314cD14C9d38',

  // rebalance
  fx_RebalancePool_A: '0xa677d95B91530d56791FbA72C01a862f1B01A49e',
  fx_RebalancePool_B: '0x1C33BDb791e952C4Dd9b65C9C0D7590d215aF0d2',
  fx_RebalanceWithBonusToken_A: '0x74E9234A6e03c382A01Bb942B1aF05B639371309',
  fx_RebalanceWithBonusToken_B: '0x5a161B94c737326cA115eC46f4Eaf4eEC5037dBE',
  fx_RebalancePoolSplitter: '0x79c5f5b0753acE25ecdBdA4c2Bc86Ab074B6c2Bb', // fx_BoostableRebalancePool_APool_RebalancePoolSplitter

  fx_BoostableRebalancePool_APool: '0xc6dEe5913e010895F3702bc43a40d661B13a40BD',
  fx_BoostableRebalancePool_APool_FundraiseGauge:
    '0x9710ca7f3edd4893f399c89ea184d92cc7172e28',
  fx_BoostableRebalancePool_APool_RebalancePoolGaugeClaimer:
    '0x81243a88Dd9Fb963c643bD3f2194c2cA9CCFc428',

  fx_BoostableRebalancePool_BPool: '0xB87A8332dFb1C76Bb22477dCfEdDeB69865cA9f9',
  fx_RebalanceWithBonusToken_BoostRebalanceAPool:
    '0x74E9234A6e03c382A01Bb942B1aF05B639371309',
  fx_RebalanceWithBonusToken_BoostRebalanceBPool:
    '0x5a161B94c737326cA115eC46f4Eaf4eEC5037dBE',
  fx_RebalancePoolSplitter_BoostableRebalancePool_fETH:
    '0x79c5f5b0753acE25ecdBdA4c2Bc86Ab074B6c2Bb',
  fx_RebalancePoolGaugeClaimer_BoostableRebalancePool_fETH:
    '0x81243a88Dd9Fb963c643bD3f2194c2cA9CCFc428',

  aladdinTreeAddress: '0xabc6a4e345801cb5f57629e79cd5eb2e9e514e98',

  // fxUSD
  FxUSD: '0x085780639CC2cACd35E474e71f4d000e2405d8f6',
  fxUSD_FxInitialFund_wstETH: '0xe6b953BB4c4B8eEd78b40B81e457ee4BDA461D55', // FxInitialFund
  fxUSD_FxInitialFund_sfrxETH: '0xFC3862c33b54E0BBA61d966Ff51973C20be4fC62', // FxInitialFund

  fxUSD_wstETH_Treasury: '0xED803540037B0ae069c93420F89Cd653B6e3Df1f',
  fxUSD_wstETH_Market: '0xAD9A0E7C08bc9F747dF97a3E7E7f620632CB6155',
  fxUSD_wstETH_FractionalToken: '0xD6B8162e2fb9F3EFf09bb8598ca0C8958E33A23D',
  fxUSD_wstETH_LeveragedToken: '0x5a097b014C547718e79030a077A91Ae37679EfF5',
  fxUSD_sfrxETH_Treasury: '0xcfEEfF214b256063110d3236ea12Db49d2dF2359',
  fxUSD_sfrxETH_Market: '0x714B853b3bA73E439c652CfE79660F329E6ebB42',
  fxUSD_sfrxETH_FractionalToken: '0xa87F04c9743Fd1933F82bdDec9692e9D97673769',
  fxUSD_sfrxETH_LeveragedToken: '0x2bb0C32101456F5960d4e994Bac183Fe0dc6C82c',
  fxUSD_GatewayRouter: '0xA5e2Ec4682a32605b9098Ddd7204fe84Ab932fE4',

  // fxUSD rebalance pool
  FxUSD_ShareableRebalancePool_wstETH:
    '0x9aD382b028e03977D446635Ba6b8492040F829b7',
  FxUSD_ShareableRebalancePool_wstETH_FundraiseGauge:
    '0xf422446F7730e50B9CAb4618343425d9927b35ED',
  FxUSD_ShareableRebalancePool_xstETH:
    '0x0417CE2934899d7130229CDa39Db456Ff2332685',

  FxUSD_ShareableRebalancePool_sfrxETH:
    '0xb925F8CAA6BE0BFCd1A7383168D1c932D185A748',
  FxUSD_ShareableRebalancePool_sfrxETH_FundraiseGauge:
    '0xB3886b8c94C8635B786b1CA88942337669BB1e1E',
  FxUSD_ShareableRebalancePool_xfrxETH:
    '0x4a2ab45D27428901E826db4a52Dae00594b68022',

  FxUSD_Rebalancer: '0x78c3aF23A4DeA2F630C130d2E42717587584BF05',

  MultiPathConverter: '0x4F96fe476e7dcD0404894454927b9885Eb8B57c3',

  fxUSD_wstETH_RebalancePoolRegistry:
    '0x86e987a89Fd7345457d97b9e82906f346D61Df39',
  fxUSD_sfrxETH_RebalancePoolRegistry:
    '0x345a345DAd48c3504113539ce83c0cB765627B54',
  fxUSD_ReservePoolV2: '0xb592E01dd77084b36430ffCB9c9D2F76fDE32631',

  fxUSD_FxStETHTwapOracle: '0xa84360896cE9152d1780c546305BB54125F962d9',
  fxUSD_FxFrxETHTwapOracle: '0x939c38921c961DecB3cc16f601C32d07C41cd25C',

  wstETHRateProvider: '0x81A777c4aB65229d1Bf64DaE4c831bDf628Ccc7f',
  sfrxETHRateProvider: '0x7ceD6167b5A08111dC8d0D2f9F7E482c4Da62506',
}

const gaugeTokenList = {
  fx_ETH_FXN: '0xA5250C540914E012E22e623275E290c4dC993D11',
  ConvexCurveManager_ETH_FXN: '0x9B0df1A542d982DC4AdC413acf1db0D10e5cED4B',
  fx_FXN_cvxFXN: '0xfEFafB9446d84A9e58a3A2f2DDDd7219E8c94FbB',
  ConvexCurveManager_FXN_cvxFXN: '0x607Fb364d8D7fBB4630d3020eC582e4D75d1949a',
  fx_FXN_sdFXN: '0x5b1D12365BEc01b8b672eE45912d1bbc86305dba',
  ConvexCurveManager_FXN_sdFXN: '0x06688aC314dA737a1E9841B374F393A7982fA6D1',

  crvUSD_fxUSD: '0xF4Bd6D66bAFEA1E0500536d52236f64c3e8a2a84',
  ConvexCurveManager_crvUSD_fxUSD: '0x7a57429755Fc2F6fEa171Bdb7d9788E4A0E7f63c',
  PYUSD_fxUSD: '0xeD113B925AC3f972161Be012cdFEE33470040E6a',
  ConvexCurveManager_PYUSD_fxUSD: '0x6735151401D038F72C1B2a69aE2dD27453703263',
  DOLA_fxUSD: '0x61F32964C39Cca4353144A6DB2F8Efdb3216b35B',
  ConvexCurveManager_DOLA_fxUSD: '0x5C8223439bC15CA61a973D942F1C4684508239c0',
  GRAI_fxUSD: '0xfa4761512aaf899b010438a10C60D01EBdc0eFcA',
  ConvexCurveManager_GRAI_fxUSD: '0x0909fd92f0b700F7Ac69715AAc4C63ACB215b1E5',
  FRAX_fxUSD: '0x31b630B21065664dDd2dBa0eD3a60D8ff59501F0',
  ConvexCurveManager_FRAX_fxUSD: '0xCef4fFA670E2672E15F2ca76dc661d847f3B5b4D',
  GHO_fxUSD: '0xf0A3ECed42Dbd8353569639c0eaa833857aA0A75',
  ConvexCurveManager_GHO_fxUSD: '0xfefB84273A4DEdd40D242f4C007190DE21C9E39e',
  mkUSD_fxUSD: '0xDbA9a415bae1983a945ba078150CAe8b690c9229',
  ConvexCurveManager_mkUSD_fxUSD: '0xfefB84273A4DEdd40D242f4C007190DE21C9E39e', // toDO update address
  ULTRA_fxUSD: '0x0d3e9A29E856CF00d670368a7ab0512cb0c29FAC',
  ConvexCurveManager_ULTRA_fxUSD: '0xfefB84273A4DEdd40D242f4C007190DE21C9E39e', // toDO update address
}

export const tokens = {
  eth: '0x0000000000000000000000000000000000000000',
  weth: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  idoSale: '0x3eB6Da2d3f39BA184AEA23876026E0747Fb0E17f',

  fETH: '0x53805A76E1f5ebbFE7115F16f9c87C2f7e633726',
  fxUSD: contracts.FxUSD,

  xETH: '0xe063F04f280c60aECa68b38341C2eEcBeC703ae2',
  xstETH: contracts.fxUSD_wstETH_LeveragedToken,
  xfrxETH: contracts.fxUSD_sfrxETH_LeveragedToken,

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
  SDT: '0x73968b9a57c6E53d41345FD57a6E6ae27d6CDB2F',

  FXN: contracts.FXN,
  sfrxETH: '0xac3e018457b222d93114458476f3e3416abbe38f',
  frxETH: '0x5e8422345238f34275888049021821e8e08caa1f',

  crvUSD: '0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E',
}

const TOKENS_INFO = {
  eth: ['ethereum', tokens.eth, 18, 'eth'],
  usdc: ['usd-coin', tokens.usdc, 6, 'usdc'],
  usdt: ['usdt', tokens.usdt, 6, 'usdt'],
  dai: ['dai', tokens.dai, 18, 'dai'],
  weth: ['weth', tokens.weth, 18, 'weth'],
  wbtc: ['bitcoin', tokens.wbtc, 8, 'wbtc'],
  seth: ['seth', tokens.seth, 18, 'seth'],
  stETH: ['staked-ether', tokens.stETH, 18, 'stETH', stETHIcon],
  renBTC: ['renbtc', tokens.renBTC, 8, 'renBTC'],
  clev: ['clev', tokens.clev, 18, 'aldClev'],
  clevCVX: ['clev', tokens.clevCVX, 18, 'aldClevCVX'],
  veclev: ['', contracts.aladdinVeCLEV, 18, 'aldVeclev'],
  vefee: ['', contracts.aladdinVeFee, 18, 'aldVefee'],
  cvx: ['convex-finance', tokens.cvx, 18, 'cvx', cvxIcon],
  frax: ['frax', tokens.frax, 18, 'frax'],
  busd: ['binance-usd', tokens.busd, 18, 'busd'],
  tusd: ['true-usd', tokens.tusd, 18, 'TUSD'],
  lusd: ['usd-coin', tokens.lusd, 18, 'lusd'],
  fETH: ['fETH', tokens.fETH, 18, 'fETH'],
  xETH: ['xETH', tokens.xETH, 18, 'xETH'],
  veFXN: ['veFXN', tokens.veFXN, 18, 'veFXN'],
  fxn: ['FXN', tokens.FXN, 18, 'FXN', FXNIcon],
  crv: ['CRV', tokens.crv, 18, 'CRV', crvIcon],
  wstETH: ['wstETH', tokens.wstETH, 18, 'wstETH', 'wstETH'],
  sfrxETH: ['sfrxETH', tokens.sfrxETH, 18, 'sfrxETH', 'sfrxETH'],
  frxETH: ['frxETH', tokens.frxETH, 18, 'frxETH', 'frxETH'],
  xstETH: ['xstETH', tokens.xstETH, 18, 'xstETH', 'xstETH'],
  xfrxETH: ['xfrxETH', tokens.xfrxETH, 18, 'xfrxETH', 'xfrxETH'],
  crvUSD: ['crvusd', tokens.crvUSD, 18],
}

export const zapTokens = {
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
  wstETH: {
    symbol: 'wstETH',
    icon: 'wstETH',
    decimals: TOKENS_INFO.wstETH[2],
    address: TOKENS_INFO.wstETH[1],
    needZap: true,
  },
  frxETH: {
    symbol: 'frxETH',
    icon: 'frxETH',
    decimals: TOKENS_INFO.frxETH[2],
    address: TOKENS_INFO.frxETH[1],
    needZap: true,
  },
  sfrxETH: {
    symbol: 'sfrxETH',
    icon: 'sfrxETH',
    decimals: TOKENS_INFO.sfrxETH[2],
    address: TOKENS_INFO.sfrxETH[1],
    needZap: true,
  },
  crvUSD: {
    symbol: 'crvUSD',
    icon: 'crvUSD',
    decimals: TOKENS_INFO.crvUSD[2],
    address: TOKENS_INFO.crvUSD[1],
    needZap: true,
  },
  Frax: {
    symbol: 'Frax',
    icon: 'frax',
    decimals: TOKENS_INFO.frax[2],
    address: TOKENS_INFO.frax[1],
    needZap: true,
  },
}

const POOLS_LIST_GAUGE = {
  ETH_FXN: {
    lpPoolCurveToken: '0xc15f285679a1ef2d25f53d4cbd0265e1d02f2a92',
    token: '0xE06A65e09Ae18096B99770A809BA175FA05960e2',
    manageConvexGauge: gaugeTokenList.ConvexCurveManager_ETH_FXN,
    gauge: gaugeTokenList.fx_ETH_FXN,
  },
  FXN_cvxFXN: {
    lpPoolCurveToken: '0x1062fd8ed633c1f080754c19317cb3912810b5e5',
    token: '0x1062fd8ed633c1f080754c19317cb3912810b5e5',
    manageConvexGauge: gaugeTokenList.ConvexCurveManager_FXN_cvxFXN,
    gauge: gaugeTokenList.fx_FXN_cvxFXN,
  },
  FXN_sdFXN: {
    lpPoolCurveToken: '0x28ca243dc0ac075dd012fcf9375c25d18a844d96',
    token: '0x28ca243dc0ac075dd012fcf9375c25d18a844d96',
    manageConvexGauge: gaugeTokenList.ConvexCurveManager_FXN_sdFXN,
    gauge: gaugeTokenList.fx_FXN_sdFXN,
  },
  crvUSD_fxUSD: {
    lpPoolCurveToken: '0x8fFC7b89412eFD0D17EDEa2018F6634eA4C2FCb2',
    token: '0x8fFC7b89412eFD0D17EDEa2018F6634eA4C2FCb2',
    manageConvexGauge: gaugeTokenList.ConvexCurveManager_crvUSD_fxUSD,
    gauge: gaugeTokenList.crvUSD_fxUSD,
  },
  PYUSD_fxUSD: {
    lpPoolCurveToken: '0xd6982da59f1d26476e259559508f4135135cf9b8',
    token: '0xd6982da59f1d26476e259559508f4135135cf9b8',
    manageConvexGauge: gaugeTokenList.ConvexCurveManager_PYUSD_fxUSD,
    gauge: gaugeTokenList.PYUSD_fxUSD,
  },
  DOLA_fxUSD: {
    lpPoolCurveToken: '0x189b4e49b5caf33565095097b4b960f14032c7d0',
    token: '0x189b4e49b5caf33565095097b4b960f14032c7d0',
    manageConvexGauge: gaugeTokenList.ConvexCurveManager_DOLA_fxUSD,
    gauge: gaugeTokenList.DOLA_fxUSD,
  },
  GRAI_fxUSD: {
    lpPoolCurveToken: '0x69cf42f15f9325986154b61a013da6e8fec82ccf',
    token: '0x69cf42f15f9325986154b61a013da6e8fec82ccf',
    manageConvexGauge: gaugeTokenList.ConvexCurveManager_GRAI_fxUSD,
    gauge: gaugeTokenList.GRAI_fxUSD,
  },
  FRAX_fxUSD: {
    lpPoolCurveToken: '0x1ee81c56e42ec34039d993d12410d437ddea341e',
    token: '0x1ee81c56e42ec34039d993d12410d437ddea341e',
    manageConvexGauge: gaugeTokenList.ConvexCurveManager_FRAX_fxUSD,
    gauge: gaugeTokenList.FRAX_fxUSD,
  },
  GHO_fxUSD: {
    lpPoolCurveToken: '0x74345504eaea3d9408fc69ae7eb2d14095643c5b',
    token: '0x74345504eaea3d9408fc69ae7eb2d14095643c5b',
    manageConvexGauge: gaugeTokenList.ConvexCurveManager_GHO_fxUSD,
    gauge: gaugeTokenList.GHO_fxUSD,
  },
  mkUSD_fxUSD: {
    lpPoolCurveToken: '0xca554e2e2948a211d4650fe0f4e271f01f9cb5f1',
    token: '0xca554e2e2948a211d4650fe0f4e271f01f9cb5f1',
    manageConvexGauge: gaugeTokenList.ConvexCurveManager_mkUSD_fxUSD,
    gauge: gaugeTokenList.mkUSD_fxUSD,
  },
  ULTRA_fxUSD: {
    lpPoolCurveToken: '0xf33ab11e5c4e55dacb13644f0c0a9d1e199a796f',
    token: '0xf33ab11e5c4e55dacb13644f0c0a9d1e199a796f',
    manageConvexGauge: gaugeTokenList.ConvexCurveManager_ULTRA_fxUSD,
    gauge: gaugeTokenList.ULTRA_fxUSD,
  },
}

const getTokenInfoByAddress = (tokenAddress) => {
  for (const key in TOKENS_INFO) {
    if (TOKENS_INFO[key][1].toLowerCase() == tokenAddress.toLowerCase()) {
      return TOKENS_INFO[key]
    }
  }
  return {}
}

export const GENESIS_MAP = {
  stETH: {
    symbol: 'stETH',
    baseSymbol: 'wstETH',
    xToken: 'xstETH',
    address: contracts.fxUSD_FxInitialFund_wstETH,
  },
  frxETH: {
    symbol: 'frxETH',
    baseSymbol: 'sfrxETH',
    xToken: 'xfrxETH',
    address: contracts.fxUSD_FxInitialFund_sfrxETH,
  },
}

export const BASE_TOKENS_MAP = {
  fxETH: {
    baseSymbol: 'fxETH',
    baseName: 'stETH',
    contracts: {
      market: contracts.fx_Market,
      treasury: contracts.fx_stETHTreasury,
      rebalancePoolRegistry: contracts.fx_RebalancePoolRegistry,
    },
  },
  wstETH: {
    baseSymbol: 'wstETH',
    baseName: 'stETH',
    contracts: {
      market: contracts.fxUSD_wstETH_Market,
      treasury: contracts.fxUSD_wstETH_Treasury,
      rebalancePoolRegistry: contracts.fxUSD_wstETH_RebalancePoolRegistry,
      fToken: contracts.fxUSD_wstETH_FractionalToken,
      xToken: contracts.fxUSD_wstETH_LeveragedToken,
      twapOracle: contracts.fxUSD_FxStETHTwapOracle,
      rateProvider: contracts.wstETHRateProvider,
    },
  },
  sfrxETH: {
    baseSymbol: 'sfrxETH',
    baseName: 'frxETH',
    contracts: {
      market: contracts.fxUSD_sfrxETH_Market,
      treasury: contracts.fxUSD_sfrxETH_Treasury,
      rebalancePoolRegistry: contracts.fxUSD_sfrxETH_RebalancePoolRegistry,
      fToken: contracts.fxUSD_sfrxETH_FractionalToken,
      xToken: contracts.fxUSD_sfrxETH_LeveragedToken,
      twapOracle: contracts.fxUSD_FxFrxETHTwapOracle,
      rateProvider: contracts.sfrxETHRateProvider,
    },
  },
}

export const ASSET_MAP = {
  fETH: {
    symbol: 'fETH',
    address: TOKENS_INFO.fETH[1],
    decimals: TOKENS_INFO.fETH[2],
    descrition: '10% Volatility of ETH',
    icon: '/images/f-logo.svg',
    isF: true,
    isShow24Change: true,
    baseSymbol: 'fxETH',
  },
  xETH: {
    symbol: 'xETH',
    name: 'xETH (Lido)',
    address: TOKENS_INFO.xETH[1],
    decimals: TOKENS_INFO.xETH[2],
    descrition: 'Long stETH up to 4x',
    icon: '/images/x-logo.svg',
    subIcon: '/tokens/steth.svg',
    isX: true,
    isShow24Change: true,
    baseSymbol: 'fxETH',
  },
  fxUSD: {
    symbol: 'fxUSD',
    address: contracts.FxUSD,
    descrition: '$1.00 Pegged',
    icon: '/tokens/fxusd.svg',
    isBreakdownChart: true,
    background: 'linear-gradient(270deg, #1a6d63 0%, #075e54 100%)',
    isF: true,
    baseTokenInfos: [BASE_TOKENS_MAP.wstETH, BASE_TOKENS_MAP.sfrxETH],
  },
  xstETH: {
    symbol: 'xstETH',
    name: 'xstETH (Lido)',
    address: contracts.fxUSD_wstETH_LeveragedToken,
    descrition: 'Long stETH up to 4.3x',
    icon: '/images/x-logo.svg',
    subIcon: '/tokens/steth.svg',
    isX: true,
    isShow24Change: true,
    baseSymbol: 'wstETH',
    baseTokenInfo: BASE_TOKENS_MAP.wstETH,
  },
  xfrxETH: {
    symbol: 'xfrxETH',
    name: 'xfrxETH (Frax)',
    address: contracts.fxUSD_sfrxETH_LeveragedToken,
    descrition: 'Long frxETH up to 4.3x',
    icon: '/images/x-logo.svg',
    subIcon: '/tokens/frxeth.svg',
    isX: true,
    isShow24Change: true,
    baseSymbol: 'sfrxETH',
    baseTokenInfo: BASE_TOKENS_MAP.sfrxETH,
  },
  fCVX: {
    symbol: 'fCVX',
    // address: '',
    // descrition: 'Coming soon',
    icon: '/tokens/fxusd.svg',
    // subIcon: '/tokens/frxeth.svg',
    // isX: true,
    // isShow24Change: true,
    isComing: true,
    // baseSymbol: 'sfrxETH',
    isF: true,
    // baseTokenInfo: BASE_TOKENS_MAP.sfrxETH,
  },
  xCVX: {
    symbol: 'xCVX',
    name: 'xCVX (Convex)',
    // address: '',
    // descrition: 'Coming soon',
    icon: '/images/x-logo.svg',
    subIcon: '/tokens/crypto-icons-stack.svg#cvx',
    isX: true,
    // isShow24Change: true,
    isComing: true,
    // baseSymbol: 'sfrxETH',
    // baseTokenInfo: BASE_TOKENS_MAP.sfrxETH,
  },
}

export const ASSETS = Object.values(ASSET_MAP)

export default {
  tokens,
  contracts,
  TOKENS_INFO,
  POOLS_LIST_GAUGE,
  zapTokens,
  gaugeTokenList,
  getTokenInfoByAddress,
  ASSETS,
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

export const TOKEN_MAP = {
  ETH: '/tokens/crypto-icons-stack.svg#eth',
  stETH: '/tokens/steth.svg',
  wstETH: '/tokens/steth.svg',
  sfrxETH: '/tokens/sfrxeth.svg',
  crvUSD: '/tokens/crvUSD.png',
  fxUSD: '/tokens/fxusd.svg',
  frxETH: '/tokens/frxeth.svg',
  Frax: '/tokens/crypto-icons-stack.svg#frax',
  USDC: '/tokens/crypto-icons-stack.svg#usdc',
  USDT: '/tokens/crypto-icons-stack.svg#usdt',
  WETH: '/tokens/crypto-icons-stack.svg#weth',
  xETH: '/images/x-logo.svg',
  fETH: '/images/f-logo.svg',
}
