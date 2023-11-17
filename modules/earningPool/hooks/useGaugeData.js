import { useCallback, useContext, useEffect, useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import abi from 'config/abi'
import { useContract } from '@/hooks/useContracts'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import useWeb3 from '@/hooks/useWeb3'
import { POOLS_LIST } from '@/config/aladdinVault'

const useGaugeData = () => {
  const { _currentAccount, web3, isAllReady, blockNumber } = useWeb3()
  const { getContract } = useContract()
  const multiCallsV2 = useMutiCallV2()

  const getGaugeContract = useCallback(
    (lpGaugeAddress) => {
      const _lpGaugeContract = getContract(
        lpGaugeAddress,
        abi.FX_fx_SharedLiquidityGaugeABI
      )
      return _lpGaugeContract
    },
    [getContract]
  )
  const fetchAllPoolData = useCallback(
    async (arr) => {
      try {
        const callList = arr.map((item, index) => {
          const _lpGaugeContract = getGaugeContract(item.lpGaugeAddress)
          const {
            symbol,
            totalSupply,
            name,
            getActiveRewardTokens,
            stakingToken,
            disableGauge,
          } = _lpGaugeContract.methods
          return {
            ...item,
            // lpGaugeContract: _lpGaugeContract,
            baseInfo: {
              symbol: symbol(),
              totalSupply: totalSupply(),
              name: name(),
              stakingToken: stakingToken(),
              activeRewardTokens: getActiveRewardTokens(),
              // disableGauge: disableGauge(),
            },
          }
        })
        const allBaseInfo = await multiCallsV2(callList, {
          from: _currentAccount,
        })
        console.log('allBaseInfo----', allBaseInfo)
        return allBaseInfo
      } catch (error) {
        console.log('allBaseInfo----error', error)
        return arr
      }
    },
    [getContract, multiCallsV2, _currentAccount]
  )

  const fetchAllPoolUserData = useCallback(
    async (arr) => {
      try {
        const userCalls = arr.map((item, index) => {
          const allowanceContractAddr = item.lpGaugeAddress
          const _lpGaugeContract = getGaugeContract(item.lpGaugeAddress)
          const { balanceOf, allowance, claimable_tokens } =
            _lpGaugeContract.methods
          return {
            ...item,
            // lpGaugeContract: _lpGaugeContract,
            userInfo: {
              userShare: balanceOf(_currentAccount),
              userAllowance: allowance(_currentAccount, allowanceContractAddr),
            },
          }
        })
        const allUserData = await multiCallsV2(userCalls, {
          from: _currentAccount,
        })
        console.log('allUserData----', allUserData)
        return allUserData
      } catch (error) {
        console.log(error)
        return []
      }
    },
    [getContract, multiCallsV2, _currentAccount]
  )

  const fetchGaugeListApys = useCallback(
    async (arr) => {
      try {
        const apyCalls = arr.map((item, index) => {
          const { baseInfo } = item
          if (!baseInfo.activeRewardTokens) {
            return []
          }
          const _lpGaugeContract = getGaugeContract(item.lpGaugeAddress)
          const { rewardData } = _lpGaugeContract.methods
          let _rewardData = []
          if (
            baseInfo.activeRewardTokens &&
            baseInfo.activeRewardTokens.length
          ) {
            _rewardData = baseInfo.activeRewardTokens.map((rewardToken) => {
              return {
                rewardAddress: rewardToken,
                rewardData: rewardData(rewardToken),
              }
            })
          }
          item.rewardDatas = _rewardData
          return item
        })
        const allApyData = await multiCallsV2(apyCalls, {
          from: _currentAccount,
        })
        console.log('allUserData----1', allApyData)
        return allApyData
      } catch (error) {
        console.log(error)
        return []
      }
    },
    [getContract, multiCallsV2, _currentAccount]
  )

  const [
    { data: allPoolsInfo, refetch: refetchInfo },
    { data: allPoolsUserInfo, refetch: refetchUserInfo },
    { data: allPoolsApyInfo, refetch: refetchApysInfo },
  ] = useQueries({
    queries: [
      {
        queryKey: ['allPoolsInfo'],
        queryFn: () => fetchAllPoolData(allPoolsInfo),
        enabled: !!web3,
        initialData: POOLS_LIST,
      },
      {
        queryKey: ['allPoolsUserInfo', _currentAccount],
        queryFn: () => fetchAllPoolUserData(allPoolsInfo),
        enabled: isAllReady,
        initialData: [],
      },
      {
        queryKey: ['allPoolsApyInfo', _currentAccount],
        queryFn: () => fetchGaugeListApys(allPoolsInfo),
        enabled: isAllReady,
        initialData: [],
      },
    ],
  })

  useEffect(() => {
    refetchInfo()
    refetchUserInfo()
    refetchApysInfo()
  }, [_currentAccount, blockNumber])

  return { allPoolsInfo, allPoolsUserInfo, allPoolsApyInfo }
}

export default useGaugeData
