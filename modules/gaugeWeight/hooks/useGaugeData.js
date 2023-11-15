import { useCallback, useContext, useEffect, useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import abi from 'config/abi'
import { useContract } from '@/hooks/useContracts'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import { groupByLength } from '@/utils/index'
import useWeb3 from '@/hooks/useWeb3'
import { POOLS_LIST } from '@/config/aladdinVault'

const useGaugeData = () => {
  const { _currentAccount, web3, blockNumber } = useWeb3()
  const { getContract } = useContract()
  const multiCallsV2 = useMutiCallV2()

  const fetchAllPoolData = useCallback(
    async (arr) => {
      try {
        console.log('allBaseInfo----1')
        // const _symbol = await symbol().call()
        // console.log('allBaseInfo----1-0', _symbol)
        // const contractList = await Promise.all(
        //   arr.map((item, index) => {
        //     let _lpGaugeContract = item.lpGaugeContract
        //     if (!item.lpContract) {
        //       _lpGaugeContract =  getContract(
        //         item.lpGaugeAddress,
        //         abi.FX_fx_SharedLiquidityGaugeABI
        //       )
        //     }
        //     const { symbol, totalSupply, name, stakingToken, disableGauge } =
        //       _lpGaugeContract.methods
        //     return {
        //       ...item,
        //       lpGaugeContract: _lpGaugeContract,
        //       baseInfo: [symbol()],
        //     }
        //   })
        // )

        const callList = arr.map((item, index) => {
          let _lpGaugeContract = item.lpGaugeContract
          if (!item.lpContract) {
            _lpGaugeContract = getContract(
              item.lpGaugeAddress,
              abi.FX_fx_SharedLiquidityGaugeABI
            )
          }
          console.log('allBaseInfo----2--', _lpGaugeContract)
          const { symbol, totalSupply, name, stakingToken, disableGauge } =
            _lpGaugeContract.methods
          return {
            // ...item,
            lpGaugeContract: _lpGaugeContract,
            baseInfo: {
              symbol: symbol(),
              totalSupply: totalSupply(),
              name: name(),
              stakingToken: stakingToken(),
              disableGauge: disableGauge(),
            },
          }
        })
        console.log('allBaseInfo----2', callList)
        const allBaseInfo = await multiCallsV2(callList, {
          from: _currentAccount,
        })
        console.log('allBaseInfo----3', allBaseInfo)
        return allBaseInfo
      } catch (error) {
        console.log('allBaseInfo----error', error)
      }
    },
    [getContract, multiCallsV2, _currentAccount]
  )

  const fetchAllPoolUserData = useCallback(
    async (arr) => {
      try {
        const userCalls = arr.map((item, index) => {
          const allowanceContractAddr = item.lpGaugeAddress
          let _lpGaugeContract = item.lpGaugeContract
          if (!item.lpContract) {
            _lpGaugeContract = getContract(
              item.lpGaugeAddress,
              abi.FX_fx_SharedLiquidityGaugeABI
            )
          }
          const { balanceOf, allowance, claimable_tokens } =
            _lpGaugeContract.methods
          return {
            ...item,
            lpGaugeContract: _lpGaugeContract,
            baseInfo: {
              symbol: balanceOf(_currentAccount),
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
  }, [_currentAccount])

  return { allPoolsInfo, allPoolsUserInfo }
}

export default useGaugeData
