const contracts = {
  eth: '0x0000000000000000000000000000000000000000',
  multiCall: '0xeefba1e63905ef1d7acba5a8513c70307c1ce441',
  idoSale: '0x6AbcC0404301b947a1bC5CB562B6E12c67d1c326',
  idoRewardToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // cvx
}

const tokens = {
  eth: '0x0000000000000000000000000000000000000000',
  idoSale: '0x6AbcC0404301b947a1bC5CB562B6E12c67d1c326',
}

const TOKENS_INFO = {
  eth: ['ethereum', tokens.eth, 18, 'eth'],
}

export default {
  tokens,
  contracts,
  TOKENS_INFO,
}
