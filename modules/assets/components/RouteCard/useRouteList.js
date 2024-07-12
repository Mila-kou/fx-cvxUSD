import { useRef } from 'react'
import { useZapIn, ROUTE_TYPE } from '@/hooks/useZap'
import { cBN, fb4 } from '@/utils/index'
import { zapTokens } from '@/config/tokens'

// {
//   amount: '0.03564',
//   symbol: 'ETH',
//   usd: '13.32',
//   routeType: '1inch',
// },
const getZapInSupportRoutes = (from, to, symbol) => {
  // mint fxUSD
  if (symbol === 'fxUSD') {
    if (['ETH'].includes(from)) {
      return [ROUTE_TYPE.INCH]
    }
    return [
      ROUTE_TYPE.INCH,
      ROUTE_TYPE.FX_ROUTE,
      ROUTE_TYPE.CURVE,
      ROUTE_TYPE.COWSWAP,
    ]
  }

  if (['eETH'].includes(from)) {
    return [ROUTE_TYPE.INCH]
  }

  // mint rUSD
  if (symbol === 'rUSD') {
    if (['ETH'].includes(from)) {
      return [ROUTE_TYPE.INCH]
    }
    return [
      ROUTE_TYPE.INCH,
      ROUTE_TYPE.FX_ROUTE,
      ROUTE_TYPE.CURVE,
      ROUTE_TYPE.COWSWAP,
    ]
  }

  // mint btcUSD
  if (symbol === 'btcUSD') {
    return [ROUTE_TYPE.INCH, ROUTE_TYPE.COWSWAP]
  }

  if (['WBTC'].includes(to)) {
    return [ROUTE_TYPE.INCH]
  }

  // mint xToken/fToken
  if (['xstETH', 'xfrxETH', 'xeETH'].includes(symbol)) {
    if (['ETH'].includes(from)) {
      return [ROUTE_TYPE.INCH]
    }
    return [ROUTE_TYPE.INCH, ROUTE_TYPE.FX_ROUTE]
  }

  if (['xezETH'].includes(symbol)) {
    return [ROUTE_TYPE.INCH]
  }

  if (['cvxUSD', 'xCVX'].includes(symbol)) {
    return [ROUTE_TYPE.FX_ROUTE]
  }

  return [ROUTE_TYPE.INCH, ROUTE_TYPE.FX_ROUTE]
}

const getZapOutSupportRoutes = (from, to) => {
  // redeem fxUSD
  if (['fxUSD', 'btcUSD', 'rUSD'].includes(from)) {
    return [ROUTE_TYPE.FX_ROUTE, ROUTE_TYPE.CURVE, ROUTE_TYPE.COWSWAP]
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
          callback(item).catch((e) => {
            if (e?.message.includes('0x2cbf45d6')) {
              return { outAmount: 0, result: 0, isCapReached: true }
            }
            return { outAmount: 0, result: 0 }
          })
        )
      )

      const _price = `${price}`.replace(/,/g, '')

      const routes = supportedRoute.map((routeType, index) => {
        const out_CBN = cBN(resList[index].outAmount) || cBN(0)
        let swapUrl = ''
        if (routeType == ROUTE_TYPE.CURVE) {
          swapUrl = `https://curve.fi/#/ethereum/swap?from=${zapTokens[from].address}&to=${zapTokens[symbol].address}`
        }
        if (routeType == ROUTE_TYPE.COWSWAP) {
          swapUrl = `https://swap.cow.fi/#/1/swap/${zapTokens[from].symbol}/${zapTokens[symbol].symbol}`
        }
        return {
          amount: out_CBN.toString(10),
          amount_text: fb4(out_CBN.toString(10), false, decimals),
          usd: fb4(out_CBN.multipliedBy(_price).toString(10), false, decimals),
          symbol,
          routeType,
          result: resList[index].result,
          swapUrl,
          isCapReached: resList[index].isCapReached || false,
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
    } catch (e) {
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
