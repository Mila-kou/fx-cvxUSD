import { useMemo } from 'react'
import { useQueries } from '@tanstack/react-query'
import useWeb3 from '@/hooks/useWeb3'
import { getRUSDUserScore } from '@/services/dataInfo'

const useRUSDScore = () => {
  const { currentAccount } = useWeb3()

  const [{ data: weETHData }, { data: ezETHData }] = useQueries({
    queries: [
      {
        queryKey: ['rUSDUserScore', 'weETH'],
        queryFn: () => getRUSDUserScore('weETH'),
      },
      {
        queryKey: ['rUSDUserScore', 'ezETH'],
        queryFn: () => getRUSDUserScore('ezETH'),
      },
    ],
  })

  const rUSDUserScore = useMemo(() => {
    const data = {
      weETH: {
        etherfi: 0,
        eigenlayer: 0,
      },
      ezETH: {
        renzo: 0,
        eigenlayer: 0,
      },
    }
    if (weETHData && weETHData.eigenlayer) {
      const eigenlayer = weETHData.eigenlayer.earnPoint.find(
        (item) => item.address.toLowerCase() == currentAccount.toLowerCase()
      )
      if (eigenlayer) {
        data.weETH.eigenlayer = eigenlayer.earnPoint
      }

      const etherfi = weETHData.etherfi.earnPoint.find(
        (item) => item.address.toLowerCase() == currentAccount.toLowerCase()
      )
      if (etherfi) {
        data.weETH.etherfi = etherfi.earnPoint
      }
    }

    if (ezETHData && ezETHData.eigenlayer) {
      const eigenlayer = ezETHData.eigenlayer.earnPoint.find(
        (item) => item.address.toLowerCase() == currentAccount.toLowerCase()
      )
      if (eigenlayer) {
        data.ezETH.eigenlayer = eigenlayer.earnPoint
      }

      const renzo = ezETHData.renzo.earnPoint.find(
        (item) => item.address.toLowerCase() == currentAccount.toLowerCase()
      )
      if (renzo) {
        data.ezETH.renzo = renzo.earnPoint
      }
    }
    return data
  }, [currentAccount, weETHData, ezETHData])

  return rUSDUserScore
}

export default useRUSDScore
