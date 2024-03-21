import { useEffect, useState, useContext, useCallback } from 'react'
import { useQueries } from '@tanstack/react-query'
import { useContract, useWstETH } from 'hooks/useContracts'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import abi from '@/config/abi'

const useRebalancePoolUseInfo = (contractAddress) => {
  const { _currentAccount, web3, blockNumber } = useWeb3()
  const multiCallsV2 = useMutiCallV2()
  const { contract: fx_rebalancePoolContract } = useContract(
    contractAddress,
    abi.FX_RebalancePoolABI
  )
  console.log('stabilityPoolInfo---contractAddress-----', contractAddress)
  const { contract: wstETHContract } = useWstETH()

  const fetchBaseInfo = useCallback(async () => {
    const {
      totalSupply: stabilityPoolTotalSupplyFn,
      totalUnlocking,
      extraRewardState: extraRewardStateFn,
      baseRewardToken: rewardsFn,
    } = fx_rebalancePoolContract.methods
    try {
      const apiCalls = [
        stabilityPoolTotalSupplyFn(),
        totalUnlocking(),
        rewardsFn(),
        extraRewardStateFn(config.tokens.wstETH),
        wstETHContract.methods.tokensPerStEth(),
      ]
      const [
        stabilityPoolTotalSupplyRes,
        totalUnlockingRes,
        rewardsRes,
        extraRewardState,
        tokensPerStEth,
      ] = await multiCallsV2(apiCalls)

      return {
        stabilityPoolTotalSupplyRes,
        totalUnlockingRes,
        rewardsRes,
        extraRewardState,
        tokensPerStEth,
      }
    } catch (error) {
      console.log('stabilityPoolInfo---baseInfoError==>', error)
      return {}
    }
  }, [fx_rebalancePoolContract, multiCallsV2, _currentAccount])

  const fetchUserInfo = useCallback(async () => {
    const {
      updateAccountSnapshot,
      balanceOf: stabilityPoolBalanceOfFn,
      unlockedBalanceOf: unlockedBalanceOfFn,
      unlockingBalanceOf: unlockingBalanceOfFn,
      claimable: claimableFn,
    } = fx_rebalancePoolContract.methods

    try {
      const apiCalls = [
        updateAccountSnapshot(_currentAccount),
        stabilityPoolBalanceOfFn(_currentAccount),
        unlockedBalanceOfFn(_currentAccount),
        unlockingBalanceOfFn(_currentAccount),
        claimableFn(_currentAccount, config.tokens.wstETH),
        claimableFn(_currentAccount, config.tokens.xETH),
      ]
      const [
        ,
        stabilityPoolBalanceOfRes,
        unlockedBalanceOfRes,
        unlockingBalanceOfRes,
        claimableRes,
        claimableXETHRes,
      ] = await multiCallsV2(apiCalls)

      console.log(
        'fetchUserInfo-----',
        // fETHTotalSupplyRes, xETHTotalSupplyRes, CurrentNavRes, collateralRatioRes, totalBaseTokenRes,
        // fTokenMintFeeRatioRes, fTokenRedeemFeeRatioRes, xTokenMintFeeRatioRes, xTokenRedeemFeeRatioRes,
        //  betaRes,  mock: 38963624338621390
        stabilityPoolBalanceOfRes,
        unlockedBalanceOfRes,
        unlockingBalanceOfRes,
        claimableRes,
        claimableXETHRes
      )

      return {
        stabilityPoolBalanceOfRes,
        unlockedBalanceOfRes,
        unlockingBalanceOfRes,
        claimableRes,
        claimableXETHRes,
      }
    } catch (error) {
      console.log('UserInfoError==>', error)
      return {}
    }
  }, [fx_rebalancePoolContract, multiCallsV2, _currentAccount, web3])

  const [
    { data: stabilityPool_baseInfo, refetch: refetchBaseInfo },
    { data: stabilityPool_userInfo, refetch: refetchUserInfo },
  ] = useQueries({
    queries: [
      {
        queryKey: ['stabilityPool_baseInfo', contractAddress],
        queryFn: () => fetchBaseInfo(),
        initialData: {},
        enabled: !!web3,
      },
      {
        queryKey: ['stabilityPool_userInfo', contractAddress],
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
export default useRebalancePoolUseInfo
