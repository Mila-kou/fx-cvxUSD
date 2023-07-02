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
  fetcher(`${_fetchUrl}/api/convex`)
    .then((res) => res.data)
    .catch(() => ({}))

export const getConcentratorInit = () =>
  fetcher(`${_fetchUrl}/api/aladdin/initInfo`)
    .then((res) => res.data)
    .catch(() => ({}))

export const getLpPrice = () =>
  fetcher(`${_fetchUrl}/api/lp/price`)
    .then((res) => res.data)
    .catch(() => ({}))
