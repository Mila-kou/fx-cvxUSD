import { useEffect, useState, useContext, useCallback } from 'react'
import { useQueries } from '@tanstack/react-query'
import moment from 'moment'
import {
  useContract,
  useFETH,
  useFX_Market,
  useFX_stETHTreasury,
  useFX_stabilityPool,
  useXETH,
} from 'hooks/useContracts'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import useWeb3 from '@/hooks/useWeb3'

const useInfo = () => {
  const { _currentAccount, web3, blockNumber } = useWeb3()
  const { erc20Contract } = useContract()
  const multiCallsV2 = useMutiCallV2()
  const { contract: fx_stabilityPoolContract } = useFX_stabilityPool()
  const [maxAbleFToken, setMaxAbleFToken] = useState({})

  const fetchBaseInfo = useCallback(async () => {
    const { totalSupply: stabilityPoolTotalSupplyFn, totalUnlockingFn, rewardsLength: rewardsLengthFn } = fx_stabilityPoolContract.methods
    try {
      const apiCalls = [
        stabilityPoolTotalSupplyFn(),
        totalUnlockingFn,
        rewardsLengthFn()
      ]
      const [
        stabilityPoolTotalSupplyRes,
        totalUnlockingRes,
        rewardsLengthRes
      ] = await multiCallsV2(apiCalls)

      console.log(
        'BaseInfo222222',
        // fETHTotalSupplyRes, xETHTotalSupplyRes, CurrentNavRes, collateralRatioRes, totalBaseTokenRes,
        // fTokenMintFeeRatioRes, fTokenRedeemFeeRatioRes, xTokenMintFeeRatioRes, xTokenRedeemFeeRatioRes,
        //  betaRes,
        stabilityPoolTotalSupplyRes,
        totalUnlockingRes,
        rewardsLengthRes
      )

      return {
        stabilityPoolTotalSupplyRes,
      }
    } catch (error) {
      console.log('baseInfoError==>', error)
      return {}
    }
  }, [fx_stabilityPoolContract, multiCallsV2, _currentAccount])

  const fetchUserInfo = useCallback(async () => {
    const { balanceOf: stabilityPoolBalanceOfFn } = fx_stabilityPoolContract.methods
    try {
      const apiCalls = [
        stabilityPoolBalanceOfFn(_currentAccount),
      ]
      const [
        stabilityPoolBalanceOfRes,
      ] = await multiCallsV2(apiCalls)

      console.log(
        'fetchUserInfo222222',
        // fETHTotalSupplyRes, xETHTotalSupplyRes, CurrentNavRes, collateralRatioRes, totalBaseTokenRes,
        // fTokenMintFeeRatioRes, fTokenRedeemFeeRatioRes, xTokenMintFeeRatioRes, xTokenRedeemFeeRatioRes,
        //  betaRes,
        stabilityPoolBalanceOfRes,
      )

      return {
        stabilityPoolBalanceOfRes,
      }
    } catch (error) {
      console.log('UserInfoError==>', error)
      return {}
    }
  }, [
    fx_stabilityPoolContract,
    multiCallsV2,
    _currentAccount,
    web3,
  ])
  const [
    { data: stabilityPool_baseInfo, refetch: refetchBaseInfo },
    { data: stabilityPool_userInfo, refetch: refetchUserInfo },
  ] = useQueries({
    queries: [
      {
        queryKey: ['baseInfo', _currentAccount],
        queryFn: () => fetchBaseInfo(),
        initialData: {},
        enabled: !!web3,
      },
      {
        queryKey: ['stabilityPool_userInfo'],
        queryFn: () => fetchUserInfo(),
        initialData: {},
      },
    ],
  })

  useEffect(() => {
    refetchBaseInfo()
    refetchUserInfo()
  }, [_currentAccount, blockNumber])

  // useEffect(() => {
  //   getMaxAbleToken()
  // }, [blockNumber])

  return {
    baseInfo: stabilityPool_baseInfo,
    // ...maxAbleFToken,
    userInfo: stabilityPool_userInfo,
  }
}
export default useInfo
