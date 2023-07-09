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
import config from '@/config/index'

const useInfo = () => {
  const { _currentAccount, web3, blockNumber } = useWeb3()
  const { erc20Contract } = useContract()
  const multiCallsV2 = useMutiCallV2()
  const { contract: fx_stabilityPoolContract } = useFX_stabilityPool()
  const [maxAbleFToken, setMaxAbleFToken] = useState({})

  const fetchBaseInfo = useCallback(async () => {
    const { totalSupply: stabilityPoolTotalSupplyFn, totalUnlocking, rewardsLength: rewardsLengthFn, rewards: rewardsFn, rewardState } = fx_stabilityPoolContract.methods
    try {
      const apiCalls = [
        stabilityPoolTotalSupplyFn(),
        totalUnlocking(),
        rewardsLengthFn(),
        rewardsFn(0),
        rewardState(config.tokens.wstETH)
      ]
      const [
        stabilityPoolTotalSupplyRes,
        totalUnlockingRes,
        rewardsLengthRes,
        rewardsRes,
        rewardStateRes
      ] = await multiCallsV2(apiCalls)

      console.log(
        'BaseInfo222222',
        // fETHTotalSupplyRes, xETHTotalSupplyRes, CurrentNavRes, collateralRatioRes, totalBaseTokenRes,
        // fTokenMintFeeRatioRes, fTokenRedeemFeeRatioRes, xTokenMintFeeRatioRes, xTokenRedeemFeeRatioRes,
        //  betaRes,
        stabilityPoolTotalSupplyRes,
        totalUnlockingRes,
        rewardsLengthRes,
        rewardsRes,
        rewardStateRes
      )

      return {
        stabilityPoolTotalSupplyRes,
        totalUnlockingRes,
        rewardsLengthRes,
        rewardsRes,
        rewardStateRes
      }
    } catch (error) {
      console.log('baseInfoError==>', error)
      return {}
    }
  }, [fx_stabilityPoolContract, multiCallsV2, _currentAccount])

  const fetchUserInfo = useCallback(async () => {

    const { updateAccountSnapshot, balanceOf: stabilityPoolBalanceOfFn, unlockedBalanceOf: unlockedBalanceOfFn, unlockingBalanceOf: unlockingBalanceOfFn, claimable: claimableFn } = fx_stabilityPoolContract.methods
    console.log('_currentAccount---', _currentAccount)

    try {
      const apiCalls = [
        updateAccountSnapshot(config.zeroAddress),
        stabilityPoolBalanceOfFn(_currentAccount),
        unlockedBalanceOfFn(_currentAccount),
        unlockingBalanceOfFn(_currentAccount),
        claimableFn(_currentAccount, config.tokens.wstETH)
      ]
      const [
        ,
        stabilityPoolBalanceOfRes,
        unlockedBalanceOfRes,
        unlockingBalanceOfRes,
        claimableRes
      ] = await multiCallsV2(apiCalls)

      console.log(
        'fetchUserInfo222222',
        // fETHTotalSupplyRes, xETHTotalSupplyRes, CurrentNavRes, collateralRatioRes, totalBaseTokenRes,
        // fTokenMintFeeRatioRes, fTokenRedeemFeeRatioRes, xTokenMintFeeRatioRes, xTokenRedeemFeeRatioRes,
        //  betaRes,
        stabilityPoolBalanceOfRes,
        unlockedBalanceOfRes,
        unlockingBalanceOfRes,
        claimableRes
      )

      return {
        stabilityPoolBalanceOfRes,
        unlockedBalanceOfRes,
        unlockingBalanceOfRes,
        claimableRes
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
        queryKey: ['stabilityPool_baseInfo'],
        queryFn: () => fetchBaseInfo(),
        initialData: {},
        enabled: !!web3,
      },
      {
        queryKey: ['stabilityPool_userInfo'],
        queryFn: () => fetchUserInfo(),
        initialData: {},
        enabled: !!web3,
      },
    ],
  })

  useEffect(() => {
    refetchBaseInfo()
    refetchUserInfo()
  }, [_currentAccount, blockNumber])
  return {
    baseInfo: stabilityPool_baseInfo,
    // ...maxAbleFToken,
    userInfo: stabilityPool_userInfo,
  }
}
export default useInfo
