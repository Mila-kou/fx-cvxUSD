import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { cBN, checkNotZoroNum, checkNotZoroNumOption, fb4 } from '@/utils/index'
import config from '@/config/index'
import useGenesis from '../hooks/useGenesis'

const configs = [
  {
    symbol: 'stETH',
    fxnNum: 100,
    usdNum: 10000,
  },
  {
    symbol: 'frxETH',
    fxnNum: 100,
    usdNum: 10000,
  },
  {
    symbol: 'eETH',
    usdNum: 10000,
  },
  {
    symbol: 'ezETH',
    usdNum: 10000,
  },
  {
    symbol: 'WBTC',
    usdNum: 15000,
  },
  {
    symbol: 'CVX',
    fxnNum: 35,
    cvxNum: 1000,
  },
]

const useGenesis_c = () => {
  useGenesis()
  const { tokenPrice, tokens } = useSelector((state) => state.token)
  const genesis = useSelector((state) => state.genesis)

  const getTokenPrice = useCallback(
    (tokenName) => {
      try {
        const _tokenPrice = tokenPrice[tokenName]
        if (_tokenPrice) {
          return _tokenPrice.usd
        }
        if (tokens[tokenName]) {
          return tokens[tokenName]?.price
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
    const _cvxPrice = getTokenPrice('CVX')

    const data = {}
    configs.forEach(({ symbol, fxnNum = 0, usdNum = 0, cvxNum = 0 }) => {
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
        const _symbol_apy = cBN(usdNum).div(_tvl).times(_times).times(100)
        const _symbol_cvx_apy = cBN(cvxNum)
          .times(_cvxPrice)
          .div(_tvl)
          .times(_times)
          .times(100)

        let apy = _symbol_fxn_apy.plus(_symbol_apy).plus(_symbol_cvx_apy)
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
