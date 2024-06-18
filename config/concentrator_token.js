import { zapTokens } from './tokens'

const CLEVIcon = '/assets/tokens/clev.svg'
const FXNIcon = '/tokens/FXN.svg'
const stETHIcon = '/tokens/steth.svg'
const crvIcon = '/tokens/0xd533a949740bb3306d119cc777fa900ba034cd52.png'
const cvxIcon = '/tokens/0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b.png'

export const TOKEN_ICON_MAP = {}

export const getTokenIcon = (name) => {
  if (TOKEN_ICON_MAP[name]) {
    return TOKEN_ICON_MAP[name]
  }
  return `/tokens/crypto-icons-stack.svg#${name.toLowerCase()}`
}

export const contracts = {
  aladdin_common_harvest: '0xfa86aa141e45da5183B42792d99Dede3D26Ec515',
  // arUSD
  arUSD: '0x549716F858aefF9CB845d4C78c67A7599B0Df240',
  afxUSD: '0xdcB9a696419B54851307FFC62c8c4E50dDaCfBB0',

  arUSDWrap: '0x07D1718fF05a8C53C8F05aDAEd57C0d672945f9a',
  afxUSDWrap: '0xe7F847C62025eD672CFc57c244D16F76f8Eac66d',
}

export const tokens = {}

export const TOKENS_INFO = {}

const CompounderConf = {
  Aladdin_rUSD: {
    tokenAddress: contracts.arUSD,
    zapTokens: [
      { ...zapTokens.rUSD, needZap: false, approveTo: contracts.arUSDWrap },
      { ...zapTokens.weETH, needZap: false, approveTo: contracts.arUSDWrap },
    ],
    withdrawZapTokens: [
      { ...zapTokens.rUSD, needZap: false, approveTo: contracts.arUSDWrap },
      { ...zapTokens.weETH, needZap: false, approveTo: contracts.arUSDWrap },
    ],
  },
}
export default {
  tokens,
  contracts,
  TOKENS_INFO,
  CompounderConf,
}
