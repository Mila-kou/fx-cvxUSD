import { useCallback, useContext, useEffect, useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import abi from '@/config/abi'
import { useContract } from '@/hooks/useContracts'
import useWeb3 from '@/hooks/useWeb3'
import { cBN, fb4, checkNotZoroNumOption, dollarText } from '@/utils/index'
import { REBALANCE_POOLS_LIST } from '@/config/aladdinVault'

const POOLS = REBALANCE_POOLS_LIST.filter((item) => item.poolType === 'fxUSD')

const usePools = () => {
  const { blockNumber } = useWeb3()
  const multiCallsV2 = useMutiCallV2()
  const { getContract } = useContract()

  // const fetchPools = async (arr) => {
  //   try {
  //     const calls = arr.map((item) => {
  //       const BoostableRebalancePoolContract = getContract(
  //         item.rebalancePoolAddress,
  //         abi.FX_BoostableRebalancePoolABI
  //       )

  //       const { totalSupply } = BoostableRebalancePoolContract.methods

  //       return {
  //         nameShow: item.nameShow,
  //         infoKey: item.infoKey,
  //         baseSymbol: item.baseSymbol,
  //         rebalancePoolAddress: item.rebalancePoolAddress,
  //         totalSupplyRes: totalSupply(),
  //       }
  //     })

  //     const callData = await multiCallsV2(calls)

  //     const list = callData.sort((a, b) => a.totalSupplyRes - b.totalSupplyRes)
  //     console.log('fxUSD-pools ----', list)
  //     return list
  //   } catch (error) {
  //     console.log('fxUSD-pools ----error', error)
  //     return POOLS
  //   }
  // }

  // const [{ data: pools }] = useQueries({
  //   queries: [
  //     {
  //       queryKey: ['rebalance pools', 'fxUSD'],
  //       queryFn: () => fetchPools(POOLS),
  //       initialData: [],
  //       refetchInterval: 10000,
  //     },
  //   ],
  // })

  // return pools

  return [POOLS[2], POOLS[3], POOLS[1], POOLS[0]]
}

export default usePools
