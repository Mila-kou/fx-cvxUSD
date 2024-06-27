import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { request } from 'graphql-request'
import { useQuery } from '@tanstack/react-query'
import { cBN, fb4, checkNotZoroNum } from '@/utils/index'

const query = `
    query MyQuery {
      navs(first: 168, orderBy: timestamp, orderDirection: desc) {
        id
        baseNav
        fNav
        xNav
        totalBaseToken
        timestamp
      }
    }
    `

export default function useFxNavs() {
  const { data, isSuccess } = useQuery({
    queryKey: ['navs'],
    queryFn: async () =>
      request(
        'https://api.studio.thegraph.com/query/43247/fx-navs/version/latest',
        query
      ).then((res) => res.navs.reverse()),
  })

  const result = useMemo(() => {
    const res = {
      navList: {
        fETH: [],
        xETH: [],
      },
      totalBaseTokenList: [],
      lastDayPrice: {
        xETH: '',
        fETH: '',
      },
      dateList: [],
    }
    if (isSuccess) {
      data.forEach(({ fNav, xNav, baseNav, totalBaseToken, timestamp }) => {
        res.navList.fETH.push(fb4(cBN(fNav)))
        res.navList.xETH.push(fb4(cBN(xNav)))

        const _totalUSD = checkNotZoroNum(totalBaseToken)
          ? cBN(totalBaseToken)
              .multipliedBy(cBN(baseNav).div(1e18))
              .toFixed(0, 1)
          : 0

        res.totalBaseTokenList.push(_totalUSD.replace(/,/g, ''))

        res.dateList.push(timestamp)
      })

      const lastDay = data[data.length - 25]
      if (lastDay) {
        res.lastDayPrice.fETH = lastDay.fNav
        res.lastDayPrice.xETH = lastDay.xNav
      }
    }

    return res
  }, [data, isSuccess])

  return result
}
