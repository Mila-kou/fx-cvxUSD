import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { request } from 'graphql-request'
import { useQuery } from '@tanstack/react-query'
import { cBN, fb4, checkNotZoroNum } from '@/utils/index'

const query = `
    query MyQuery {
      navs(first: 168, orderBy: timestamp, orderDirection: desc) {
        id
        fxUSD_nav
        xstETH_nav
        xfrxETH_nav
        wstETH_totalBaseToken
        wstETH_price
        sfrxETH_totalBaseToken
        sfrxETH_price
        timestamp
      }
    }
    `

export default function useFxUSDNavs() {
  const { data, isSuccess } = useQuery({
    queryKey: ['fxUSD-navs'],
    queryFn: async () =>
      request(
        'https://api.thegraph.com/subgraphs/name/aladdindaogroup/fxusd-navs',
        query
      ).then((res) => res.navs.reverse()),
  })

  const result = useMemo(() => {
    const res = {
      navList: {
        fxUSD: [],
        xstETH: [],
        xfrxETH: [],
      },
      totalBaseTokenList: {
        wstETH: [],
        sfrxETH: [],
      },
      lastDayPrice: {
        xstETH: '',
        xfrxETH: '',
      },
      dateList: [],
    }
    if (isSuccess) {
      data.forEach(
        ({
          fxUSD_nav,
          xstETH_nav,
          xfrxETH_nav,
          wstETH_totalBaseToken,
          wstETH_price,
          sfrxETH_totalBaseToken,
          sfrxETH_price,
          timestamp,
        }) => {
          res.navList.fxUSD.push(fb4(cBN(fxUSD_nav)))
          res.navList.xstETH.push(fb4(cBN(xstETH_nav)))
          res.navList.xfrxETH.push(fb4(cBN(xfrxETH_nav)))

          const _totalUSD_wstETH = checkNotZoroNum(wstETH_totalBaseToken)
            ? cBN(wstETH_totalBaseToken)
                .multipliedBy(cBN(wstETH_price).div(1e18))
                .toFixed(0, 1)
            : '0'

          res.totalBaseTokenList.wstETH.push(_totalUSD_wstETH.replace(/,/g, ''))

          const _totalUSD_sfrxETH = checkNotZoroNum(sfrxETH_totalBaseToken)
            ? cBN(sfrxETH_totalBaseToken)
                .multipliedBy(cBN(sfrxETH_price).div(1e18))
                .toFixed(0, 1)
            : '0'

          res.totalBaseTokenList.sfrxETH.push(
            _totalUSD_sfrxETH.replace(/,/g, '')
          )

          res.dateList.push(timestamp)
        }
      )

      const lastDay = data[data.length - 25]
      if (lastDay) {
        res.lastDayPrice.xstETH = lastDay.xstETH_nav
        res.lastDayPrice.xfrxETH = lastDay.xfrxETH_nav
      }
    }

    return res
  }, [data, isSuccess])

  return result
}
