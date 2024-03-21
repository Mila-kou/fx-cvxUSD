import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { cBN, checkNotZoroNum, checkNotZoroNumOption, fb4 } from '@/utils/index'
import config from '@/config/index'
import useGenesis from '../hooks/useGenesis'

const configs = [
  {
    symbol: 'stETH',
    fxnNum: 100,
    total: 10000,
  },
  {
    symbol: 'frxETH',
    fxnNum: 100,
    total: 10000,
  },
  {
    symbol: 'eETH',
    fxnNum: 0,
    total: 10000,
  },
]

const useGenesis_c = () => {
  useGenesis()
  const { tokenPrice } = useSelector((state) => state.token)
  const genesis = useSelector((state) => state.genesis)

  const getTokenPrice = useCallback(
    (tokenName) => {
      try {
        const _tokenPrice = tokenPrice[tokenName]
        if (_tokenPrice) {
          return _tokenPrice.usd
        }
        return 0
      } catch (e) {
        return 0
      }
    },
    [tokenPrice]
  )

  const dataPage = useMemo(() => {
    const _fxnPrice = getTokenPrice('FXN')

    const data = {}
    configs.forEach(({ symbol, fxnNum, total }) => {
      try {
        const { totalShare } = genesis[symbol]
        if (!totalShare) {
          data[symbol] = { apy: '> 500%' }
          return
        }
        const _price = getTokenPrice(symbol)
        const _tvl = cBN(totalShare).times(_price).div(1e18)

        const _times = cBN(config.yearSecond).div(config.weekSecond)
        const _symbol_fxn_apy = cBN(fxnNum)
          .times(_fxnPrice)
          .div(_tvl)
          .times(_times)
          .times(100)
        const _symbol_apy = cBN(total).div(_tvl).times(_times).times(100)

        let apy = _symbol_fxn_apy.plus(_symbol_apy)
        apy = checkNotZoroNumOption(
          apy,
          apy.gt(1000) ? '1000% +' : `${fb4(apy, false, 0, 2)}%`
        )
        data[symbol] = { apy }
      } catch (error) {
        data[symbol] = { apy: '-' }
      }
    })

    return data
  }, [tokenPrice, genesis])
  return dataPage
}

export default useGenesis_c
