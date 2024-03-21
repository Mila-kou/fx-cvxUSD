import { useCallback, useContext, useEffect, useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import abi from 'config/abi'
import { useContract } from '@/hooks/useContracts'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import useWeb3 from '@/hooks/useWeb3'
import { GAUGE_LIST } from '@/config/aladdinVault'
import { useFXNTokenMinter } from '@/hooks/useGaugeContracts'

const useGaugeData = () => {
  const { _currentAccount, web3, isAllReady, blockNumber } = useWeb3()
  const { getContract } = useContract()
  const multiCallsV2 = useMutiCallV2()
  const [data, setData] = useState([])
  const { contract: FXNTokenMinterContract } = useFXNTokenMinter()

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
            user_checkpoint,
            claimable_tokens,
            integrate_fraction,
            userSnapshot,
            snapshot,
            workingBalanceOf,
            claim,
          } = _lpGaugeContract.methods
          const { minted } = FXNTokenMinterContract.methods
          if (index == 0) {
            checkPointFn = _lpGaugeContract
          }
          if (item.gaugeTypeName == 'Liquidity Gauge') {
            return {
              // ...item,
              // lpGaugeContract: _lpGaugeContract,
              userInfo: {
                // checkPointRes: user_checkpoint(_currentAccount),
                userClaimables: item.rewardTokens.map((rewardToken) =>
                  claimable(_currentAccount, rewardToken[1])
                ),
                claimRes: claim(_currentAccount),
                userShare: balanceOf(_currentAccount),
                userAllowance: allowance(
                  _currentAccount,
                  allowanceContractAddr
                ),
                // userSnapshotRes: userSnapshot(_currentAccount),
                fxnMintedRes: minted(_currentAccount, item.lpGaugeAddress),
                integrate_fractionRes: integrate_fraction(_currentAccount),
                // snapshotRes: snapshot(),
                workingBalanceRes: workingBalanceOf(_currentAccount),
              },
            }
          }
          return {
            userInfo: {},
          }
        })
        const allUserData_all = await multiCallsV2(userCalls)
        // const allUserData1 = await multiCallsV2([userCalls[0], userCalls[1]])
        // const allUserData2 = await multiCallsV2([userCalls[2], userCalls[3]])
        // const allUserData_all = [...allUserData1, ...allUserData2]
        const allUserData = allUserData_all.map((item, index) => ({
          ...item,
          ...arr[index],
        }))
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

  const [{ refetch: refetchUserInfo, isFetching }] = useQueries({
    queries: [
      {
        queryKey: ['allPoolsUserInfo', _currentAccount],
        queryFn: () => fetchAllPoolUserData(GAUGE_LIST),
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
