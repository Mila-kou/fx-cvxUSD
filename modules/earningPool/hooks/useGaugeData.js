import { useCallback, useContext, useEffect, useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import abi from 'config/abi'
import { useContract, useVeFXN } from '@/hooks/useContracts'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import useWeb3 from '@/hooks/useWeb3'
import { POOLS_LIST } from '@/config/aladdinVault'
import config from '@/config/index'

const useGaugeData = () => {
  const { _currentAccount, web3, isAllReady, blockNumber } = useWeb3()
  const { getContract } = useContract()
  const multiCallsV2 = useMutiCallV2()
  const [data, setData] = useState([])

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

  const getManageGaugeContract = useCallback(
    (lpManageGaugeAddress) => {
      const _lpGaugeContract = getContract(
        lpManageGaugeAddress,
        abi.FX_ConvexCurveManagerABI
      )
      return _lpGaugeContract
    },
    [getContract]
  )

  const fetchAllPoolUserData = useCallback(
    async (arr) => {
      try {
        const checkPointList = []
        let checkPointFn

        const userCalls = arr.map((item, index) => {
          const allowanceContractAddr = item.lpGaugeAddress
          const _lpGaugeContract = getGaugeContract(item.lpGaugeAddress)
          const {
            balanceOf,
            allowance,
            claimable,
            checkpoint,
            claimable_tokens,
            integrate_fraction,
            userSnapshot,
            snapshot,
            workingBalanceOf,
          } = _lpGaugeContract.methods
          if (index == 0) {
            checkPointFn = _lpGaugeContract
          }

          return {
            // ...item,
            // lpGaugeContract: _lpGaugeContract,
            userInfo: {
              // checkPointRes: checkpoint(_currentAccount),
              userShare: balanceOf(_currentAccount),
              userAllowance: allowance(_currentAccount, allowanceContractAddr),
              userClaimables: item.rewardTokens.map((rewardToken) =>
                claimable(_currentAccount, rewardToken[1])
              ),
              userSnapshotRes: userSnapshot(_currentAccount),
              integrate_fractionRes: integrate_fraction(_currentAccount),
              snapshotRes: snapshot(),
              workingBalanceRes: workingBalanceOf(_currentAccount),
            },
          }
        })

        const allUserData1 = await multiCallsV2([userCalls[0], userCalls[1]])
        const allUserData2 = await multiCallsV2([userCalls[2], userCalls[3]])
        const allUserData = [...allUserData1, ...allUserData2].map(
          (item, index) => ({
            ...item,
            ...arr[index],
          })
        )
        console.log('allUserData----', allUserData)
        setData(allUserData)
        return allUserData
      } catch (error) {
        console.log('allUserData----error', error)
        return []
      }
    },
    [getContract, multiCallsV2, _currentAccount]
  )

  const [{ data: allPoolsUserInfo, refetch: refetchUserInfo, isFetching }] =
    useQueries({
      queries: [
        {
          queryKey: ['allPoolsUserInfo', _currentAccount],
          queryFn: () => fetchAllPoolUserData(POOLS_LIST),
          enabled: isAllReady,
          initialData: [],
        },
      ],
    })

  useEffect(() => {
    if (isFetching) return
    refetchUserInfo()
  }, [_currentAccount, blockNumber])

  return { allPoolsUserInfo: data }
}

export default useGaugeData
