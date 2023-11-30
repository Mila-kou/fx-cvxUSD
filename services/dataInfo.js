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
