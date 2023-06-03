const contracts = {
  eth: '0x0000000000000000000000000000000000000000',
  multiCall: '0xeefba1e63905ef1d7acba5a8513c70307c1ce441',
  idoSale: '0x3eB6Da2d3f39BA184AEA23876026E0747Fb0E17f', // '0x109e9F8e9C34a5EeCdb129863ADE78057025053a', //06.1
  fundsRaisedToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // weth

  ChainlinkTwapOracleV3: '0x32366846354DB5C08e92b4Ab0D2a510b2a2380C8',
  fETH: '0xd35E92d691e2423620CdeEdbbD4399BD812A712C',
  xETH: '0xBB8828DDb2774a141EBE3BB449d1cc5BF6212885',
  fx_Market: '0xDd2cf944633484e4B415d540397C7DD34093ECBc',
  fx_Treasury: '0x58EE0A16FB24ea34169e237bb10900A6a90288FB',
  fx_ETHGateway: '0x922837838aEd2937742CFF7b0AdFd74157e3B9D7',

  fx_VotingEscrow: '0x3875745F4A04549527c7EEa8f777D333193c665c',
  fx_GaugeController: '0x51Ac57dcaf5186a80368EeC6D8DAa338c9CaC125',
  fx_Minter: '0x51Ac57dcaf5186a80368EeC6D8DAa338c9CaC125',
}

const tokens = {
  eth: '0x0000000000000000000000000000000000000000',
  weth: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  idoSale: '0x3eB6Da2d3f39BA184AEA23876026E0747Fb0E17f', // '0x109e9F8e9C34a5EeCdb129863ADE78057025053a', //06.1
  fETH: '0xd35E92d691e2423620CdeEdbbD4399BD812A712C',
  xETH: '0xBB8828DDb2774a141EBE3BB449d1cc5BF6212885',
}

const TOKENS_INFO = {
  eth: ['ethereum', tokens.eth, 18, 'eth'],
}

export default {
  tokens,
  contracts,
  TOKENS_INFO,
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
