import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { request } from 'graphql-request'
import { useQuery } from '@tanstack/react-query'
import { cBN, fb4, checkNotZoroNum } from '@/utils/index'

const query = `
    query MyQuery {
      navs(first: 168, orderBy: timestamp, orderDirection: desc) {
        id
        timestamp
        assets(first: 100) {
          symbol
          nav
        }
        baseTokens(first: 100) {
          symbol
          price
          collateralRatio
          totalBaseToken
        }
      }
    }
    `

export default function useFxUSDNavs() {
  const { data, isSuccess } = useQuery({
    queryKey: ['fx-assets'],
    queryFn: async () =>
      request(
        'https://api.thegraph.com/subgraphs/name/aladdindaogroup/fx-assets',
        query
      ).then((res) => res.navs.reverse()),
  })

  const result = useMemo(() => {
    const res = {
      navList: {
        fxUSD: [],
        rUSD: [],
        xstETH: [],
        xfrxETH: [],
        xeETH: [],
      },
      totalBaseTokenList: {
        wstETH: [],
        sfrxETH: [],
        weETH: [],
      },
      lastDayPrice: {
        xstETH: '',
        xfrxETH: '',
        xeETH: '',
      },
      dateList: [],
    }
    if (isSuccess) {
      data.forEach(({ assets, baseTokens, timestamp }) => {
        Object.keys(res.navList).forEach((key) => {
          const asset = assets.find((item) => item.symbol === key)
          res.navList[key].push(fb4(cBN(asset.nav)))
        })

        Object.keys(res.totalBaseTokenList).forEach((key) => {
          const { totalBaseToken, price } = baseTokens.find(
            (item) => item.symbol === key
          )
          const _totalUSD = checkNotZoroNum(totalBaseToken)
            ? cBN(totalBaseToken)
                .multipliedBy(cBN(price).div(1e18))
                .toFixed(0, 1)
            : '0'

          res.totalBaseTokenList[key].push(_totalUSD.replace(/,/g, ''))
        })

        res.dateList.push(timestamp)
      })

      const lastDay = data[data.length - 25]
      if (lastDay) {
        Object.keys(res.lastDayPrice).forEach((key) => {
          const asset = lastDay.assets.find((item) => item.symbol === key)
          res.lastDayPrice[key] = asset.nav
        })
      }
    }

    return res
  }, [data, isSuccess])

  return result
}
