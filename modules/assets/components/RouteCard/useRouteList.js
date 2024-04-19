import { useRef } from 'react'
import { useZapIn, ROUTE_TYPE } from '@/hooks/useZap'
import { cBN, fb4 } from '@/utils/index'

// {
//   amount: '0.03564',
//   symbol: 'ETH',
//   usd: '13.32',
//   routeType: '1inch',
// },
const getZapInSupportRoutes = (from, to, symbol) => {
  // mint fxUSD
  if (symbol === 'fxUSD') {
    if (['USDT', 'USDC', 'Frax', 'crvUSD'].includes(from)) {
      return [ROUTE_TYPE.INCH, ROUTE_TYPE.FX_ROUTE, ROUTE_TYPE.CURVE]
    }
  }

  if (['ETH', 'stETH', 'WETH'].includes(from)) {
    return [ROUTE_TYPE.INCH]
  }

  if (['frxETH'].includes(from)) {
    return [ROUTE_TYPE.FX_ROUTE]
  }

  if (symbol === 'btcUSD' || ['WBTC'].includes(to)) {
    return [ROUTE_TYPE.INCH]
  }

  return [ROUTE_TYPE.INCH, ROUTE_TYPE.FX_ROUTE]
}

const getZapOutSupportRoutes = (from, to) => {
  // redeem fxUSD
  if (from === 'fxUSD') {
    if (['USDT', 'USDC', 'Frax', 'crvUSD'].includes(to)) {
      return [ROUTE_TYPE.FX_ROUTE, ROUTE_TYPE.CURVE]
    }
  }

  return [ROUTE_TYPE.FX_ROUTE]
}

const useRouteList = () => {
  const routesRef = useRef([])
  const { getZapInParams } = useZapIn()

  const refreshRouteList = async (
    {
      from,
      to,
      amount,
      slippage,
      symbol,
      decimals = 18,
      price = 1,
      isZapIn = true,
    },
    callback
  ) => {
    const func = isZapIn ? getZapInSupportRoutes : getZapOutSupportRoutes
    const supportedRoute = func(from, to, symbol)
    let paramsList = supportedRoute.map((routeType) => ({ routeType }))

    try {
      if (isZapIn) {
        const paramsCalls = supportedRoute.map((routeType) =>
          getZapInParams({
            from,
            to,
            amount,
            slippage,
            routeType,
          })
        )
        paramsList = await Promise.all(paramsCalls)
      }

      const resList = await Promise.all(
        paramsList.map((item) =>
          callback(item).catch((e) => ({ outAmount: 0, result: 0 }))
        )
      )

      const _price = `${price}`.replace(/,/g, '')

      const routes = supportedRoute.map((routeType, index) => {
        const out_CBN = cBN(resList[index].outAmount) || cBN(0)

        return {
          amount: out_CBN.toString(10),
          amount_text: fb4(out_CBN.toString(10), false, decimals),
          usd: fb4(out_CBN.multipliedBy(_price).toString(10), false, decimals),
          symbol,
          routeType,
          result: resList[index].result,
        }
      })

      const list = routes.sort((a, b) => b.amount - a.amount)
      if (list.length > 0) {
        const best = list[0]
        list.forEach((item, index) => {
          if (index > 0) {
            item.diffRatio = (
              ((item.amount - best.amount) * 100) /
              best.amount
            ).toFixed(2)
          }
        })
      }

      routesRef.current = list
      return list
    } catch (error) {
      routesRef.current = []
      return []
    }
  }

  return {
    routeList: routesRef.current,
    refreshRouteList,
  }
}

export default useRouteList
