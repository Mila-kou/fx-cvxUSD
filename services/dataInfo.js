import config from '@/config/index'
import fetcher from '@/utils/fetcher'

const _fetchUrl = config.concentratorAPI

export const getTokenListPrice = (id) =>
  fetcher(`${_fetchUrl}/api/coingecko/price`, {
    ids: id,
    vs_currencies: 'usd',
  }).then((res) => res.data)
