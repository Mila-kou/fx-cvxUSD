import { useCallback, useContext, useEffect, useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import abi from '@/config/abi'
import { useContract } from '@/hooks/useContracts'
import useWeb3 from '@/hooks/useWeb3'
import { cBN, fb4, checkNotZoroNumOption, dollarText } from '@/utils/index'
import { REBALANCE_POOLS_LIST } from '@/config/aladdinVault'

const POOLS = REBALANCE_POOLS_LIST.filter((item) => item.poolType === 'fxUSD')

const usePools = () => {
  const { blockNumber } = useWeb3()
  const baseToken = useSelector((state) => state.baseToken)
  const multiCallsV2 = useMutiCallV2()
  const { getContract } = useContract()

  const fetchPools = async (arr) => {
    try {
      const calls = arr.map((item) => {
        const BoostableRebalancePoolContract = getContract(
          item.rebalancePoolAddress,
          abi.FX_BoostableRebalancePoolABI
        )

        const { totalSupply } = BoostableRebalancePoolContract.methods

        return {
          nameShow: item.nameShow,
          infoKey: item.infoKey,
          baseSymbol: item.baseSymbol,
          rebalancePoolAddress: item.rebalancePoolAddress,
          totalSupplyRes: totalSupply(),
          CR: baseToken[item.baseSymbol].data.collateralRatioRes || 0,
        }
      })

      const callData = await multiCallsV2(calls)

      const _list = callData.sort((a, b) => a.totalSupplyRes - b.totalSupplyRes)
      const list = _list.sort((a, b) => b.CR - a.CR)
      return list
    } catch (error) {
      return POOLS
    }
  }

  const [{ data: pools }] = useQueries({
    queries: [
      {
        queryKey: ['rebalance pools', 'fxUSD'],
        queryFn: () => fetchPools(POOLS),
        initialData: [],
        refetchInterval: 10000,
        enabled:
          !!baseToken.wstETH.data?.collateralRatioRes &&
          !!baseToken.sfrxETH.data?.collateralRatioRes,
      },
    ],
  })

  return pools
}

export default usePools
