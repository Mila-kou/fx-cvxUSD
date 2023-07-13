import { useCallback, useContext, useEffect, useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import abi from 'config/abi'
import { useContract } from '@/hooks/useContracts'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import { groupByLength } from '@/utils/index'
import useWeb3 from '@/hooks/useWeb3'
import { POOLS_LIST } from '@/config/aladdinVault'

const useFarmData = () => {
  const { _currentAccount, web3, blockNumber } = useWeb3()
  const { getContract } = useContract()
  const multiCallsV2 = useMutiCallV2()

  const fetchAllPoolData = useCallback(
    async (arr) => {
      if (arr.length == 1) {
        return getLocalListData()
      }

      async function getLocalListData() {
        let basicCalls = []
        const list = arr.map((item) => {
          let contract = item.lpContract
          if (!item.lpContract) {
            contract = getContract(
              item.lpGaugeAddress,
              abi.AlaLiquidityGaugeV3ABI
            )
          }
          const { totalSupply, name, decimals, symbol } = contract.methods
          basicCalls = basicCalls.concat([
            totalSupply(),
            name(),
            decimals(),
            symbol(),
          ])
          item.lpContract = contract
          return item
        })
        const allPoolsBasicInfo = await multiCallsV2(basicCalls, {
          from: _currentAccount,
        })
        const poolInfoList = groupByLength(allPoolsBasicInfo, 4)
        const listData = await getListData(list, poolInfoList, 'local')
        return listData
      }

      async function getListData(list, allVaultsBasicInfo, type) {
        const listData = await Promise.all(
          list.map(async (item, i) => {
            let _allVaultsBasicInfo
            let totalSupply
            let lp_name
            let lp_decimals
            let lp_symbol
            if (type == 'local') {
              _allVaultsBasicInfo = allVaultsBasicInfo
              totalSupply = _allVaultsBasicInfo[i]
                ? _allVaultsBasicInfo[i][0]
                : 0
              lp_name = _allVaultsBasicInfo[i] ? _allVaultsBasicInfo[i][1] : ''
              lp_decimals = _allVaultsBasicInfo[i]
                ? _allVaultsBasicInfo[i][2]
                : 18
              lp_symbol = _allVaultsBasicInfo[i]
                ? _allVaultsBasicInfo[i][3]
                : ''
            }
            return {
              ...item,
              totalSupply,
              lp_name,
              lp_decimals,
              lp_symbol,
            }
          })
        )
        return listData
      }

      const res = await getLocalListData()
      return res
    },
    [getContract, multiCallsV2, _currentAccount]
  )

  const fetchAllPoolUserData = useCallback(
    async (arr) => {
      try {
        const userCalls = arr.map((item) => {
          const contract = getContract(
            item.lpGaugeAddress,
            abi.AlaLiquidityGaugeV3ABI
          )
          const allowanceContractAddr = item.lpGaugeAddress

          const { balanceOf, allowance, claimable_tokens } = contract.methods

          return [
            balanceOf(_currentAccount),
            allowance(_currentAccount, allowanceContractAddr),
            claimable_tokens(_currentAccount),
          ]
        })
        const callList = userCalls.reduce((prev, cur) => [...prev, ...cur])
        const allVaultsUserInfo = await multiCallsV2(callList, {
          from: _currentAccount,
        })
        const listData = groupByLength(allVaultsUserInfo, 3).map((item, i) => {
          const [userDeposited, userTokenAllowance, claimable_reward] =
            item || {}
          return {
            userDeposited,
            userTokenAllowance,
            claimable_reward,
          }
        })
        return listData
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
        // enabled: isAllReady,
        initialData: [],
      },
    ],
  })

  useEffect(() => {
    refetchInfo()
    refetchUserInfo()
  }, [_currentAccount, blockNumber])

  return { allPoolsInfo, allPoolsUserInfo }
}

export default useFarmData
