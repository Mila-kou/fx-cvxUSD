import axios from 'axios'
import config from '@/config/index'
import fetcher from '@/utils/fetcher'

const _fetchUrl = config.concentratorAPI

export const getTokenListPrice = (id) =>
  fetcher(`${_fetchUrl}/api/coingecko/price`, {
    ids: id,
    vs_currencies: 'usd',
  }).then((res) => res.data)

export const getVaultsInfo = () =>
  fetcher(`${_fetchUrl}/api/vaults/info`)
    .then((res) => res.data)
    .catch(() => ({}))

export const getConvexVaultsAPY = () =>
  fetcher(`${_fetchUrl}/api1/lp/convex`)
    .then((res) => res.data)
    .catch(() => ({}))

export const getLpPrice = () =>
  fetcher(`${_fetchUrl}/api1/lp/price`)
    .then((res) => res.data)
    .catch(() => ({}))

export const getFX_cvxFXN_sdFXN_apy = () =>
  fetcher(`${_fetchUrl}/api1/getFX_cvxFXN_sdFXN_apy`)
    .then((res) => res.data)
    .catch(() => ({}))

export const getFxThirdList = () =>
  fetcher(`${_fetchUrl}/api1/get_fx_third_list`)
    .then((res) => res.data)
    .catch(() => ({}))

export const getCodeList = () =>
  fetcher(`${_fetchUrl}/api1/get_inviteCode`)
    .then((res) => res.data)
    .catch(() => [])

export const getInviteUser = (signerAddress) =>
  fetcher({
    url: `${_fetchUrl}/api1/get_inviteUser`,
    params: {
      signerAddress,
    },
  })
    .then((res) => res.data)
    .catch(() => null)

export const invite = (data) => axios.post(`${_fetchUrl}/api1/invite`, data)

export const getConvexFxPools = () =>
  fetcher(`https://fx.convexfinance.com/api/fxp/pools`)
    .then((res) => res)
    .catch(() => ({}))

export const getRUSDUserScore = (type) =>
  fetcher({
    url: `${_fetchUrl}/api1/get_rUSD_userScore`,
    params: { type },
  })
    .then((res) => res.Result)
    .catch(() => ({}))

export const getARUSDUserScore = () =>
  fetcher({
    url: `${_fetchUrl}/api2/get_referral_arUSD`,
  })
    .then((res) => res.data)
    .catch(() => ({}))

export const getARUSDUserRound1Score = () =>
  fetcher({
    url: `${_fetchUrl}/api2/get_referral_arUSD_round1`,
  })
    .then((res) => res.data)
    .catch(() => ({}))
