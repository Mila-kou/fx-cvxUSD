import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { request } from 'graphql-request'
import { useQuery } from '@tanstack/react-query'
import { cBN, fb4 } from '@/utils/index'

const query = `
    query MyQuery {
      navs(first: 7, orderBy: timestamp, orderDirection: desc) {
        id
        baseNav
        fNav
        xNav
        timestamp
      }
    }
    `

export default function useNavs() {
  const { data, isSuccess } = useQuery({
    queryKey: ['navs'],
    queryFn: async () =>
      request(
        'https://api.studio.thegraph.com/query/43247/fx-value/v0.1.0',
        query
      ).then((res) => res.navs.reverse()),
  })

  const result = useMemo(() => {
    const res = {
      fETH: [],
      xETH: [],
      dateList: [],
    }
    if (isSuccess) {
      data.forEach(({ fNav, xNav, timestamp }) => {
        res.fETH.push(fb4(cBN(fNav)))
        res.xETH.push(fb4(cBN(xNav)))

        const time = new Date(timestamp * 1000)
        res.dateList.push(`${time.getUTCMonth() + 1}/${time.getUTCDate()}`)
      })
    }

    return res
  }, [data, isSuccess])

  return result
}
