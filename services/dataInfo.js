import config from '@/config/index'
import fetcher from '@/utils/fetcher'

export const getTokenListPrice = (id) =>
  fetcher(`${config.concentratorAPI}/api/coingecko/price`, {
    ids: id,
    vs_currencies: 'usd',
  }).then((res) => res.data)
