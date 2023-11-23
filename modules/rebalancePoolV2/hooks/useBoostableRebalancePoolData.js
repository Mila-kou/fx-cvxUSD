import { useEffect, useState, useContext, useCallback } from 'react'
import { useQueries } from '@tanstack/react-query'
import { useContract, useWstETH } from 'hooks/useContracts'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import abi from '@/config/abi'
import { useBoostableRebalancePool } from '@/hooks/useGaugeContracts'

const useRebalancePoolUseInfo = (contractAddress) => {
  const { _currentAccount, web3, blockNumber } = useWeb3()
  const multiCallsV2 = useMutiCallV2()
  const { contract: fx_BoostableRebalancePool_PoolContract } =
    useBoostableRebalancePool(contractAddress)

  console.log('rebalance--0--', contractAddress)
  const { contract: wstETHContract } = useWstETH()

  const fetchBaseInfo = useCallback(async () => {
    const {
      totalSupply: BoostableRebalancePoolTotalSupplyFn,
      getActiveRewardTokens,
      getBoostRatio,
      rewardData,
    } = fx_BoostableRebalancePool_PoolContract.methods
    try {
      const apiCalls = [
        BoostableRebalancePoolTotalSupplyFn(),
        getActiveRewardTokens(),
        getBoostRatio(_currentAccount),
        rewardData(config.tokens.wstETH),
        rewardData(config.tokens.FXN),
        wstETHContract.methods.tokensPerStEth(),
      ]
      const [
        BoostableRebalancePoolTotalSupplyRes,
        ActiveRewardTokensRes,
        rewardData_wstETH_Res,
        rewardData_FXN_Res,
        tokensPerStEth,
      ] = await multiCallsV2(apiCalls)
      console.log(
        'rebalance--BaseInfo222222------',
        BoostableRebalancePoolTotalSupplyRes,
        ActiveRewardTokensRes,
        rewardData_wstETH_Res,
        rewardData_FXN_Res,
        tokensPerStEth
      )

      return {
        BoostableRebalancePoolTotalSupplyRes,
        ActiveRewardTokensRes,
        rewardData_wstETH_Res,
        rewardData_FXN_Res,
        tokensPerStEth,
      }
    } catch (error) {
      console.log('rebalance--baseInfoError==>', error)
      return {}
    }
  }, [fx_BoostableRebalancePool_PoolContract, multiCallsV2, _currentAccount])

  const fetchUserInfo = useCallback(async () => {
    console.log('rebalance--fetchUserInfo--')
    const {
      checkpoint,
      balanceOf: BoostableRebalancePoolBalanceOfFn,
      claimable: claimableFn,
      getBoostRatio,
    } = fx_BoostableRebalancePool_PoolContract.methods

    try {
      const apiCalls = [
        checkpoint(_currentAccount),
        BoostableRebalancePoolBalanceOfFn(_currentAccount),
        getBoostRatio(_currentAccount),
        claimableFn(_currentAccount, config.tokens.wstETH),
        claimableFn(_currentAccount, config.tokens.xETH),
        claimableFn(_currentAccount, config.tokens.FXN),
      ]
      const [
        ,
        BoostableRebalancePoolBalanceOfRes,
        BoostRatioRes,
        claimableWstETHRes,
        claimableXETHRes,
        claimableFXNRes,
      ] = await multiCallsV2(apiCalls)

      console.log(
        'rebalance--userData--',
        BoostableRebalancePoolBalanceOfRes,
        BoostRatioRes,
        claimableWstETHRes,
        claimableXETHRes,
        claimableFXNRes
      )

      return {
        BoostableRebalancePoolBalanceOfRes,
        BoostRatioRes,
        claimableWstETHRes,
        claimableXETHRes,
        claimableFXNRes,
      }
    } catch (error) {
      console.log('rebalance--UserInfoError==>', error)
      return {}
    }
  }, [
    fx_BoostableRebalancePool_PoolContract,
    multiCallsV2,
    _currentAccount,
    web3,
  ])

  const [
    { data: BoostableRebalancePool_baseInfo, refetch: refetchBaseInfo },
    { data: BoostableRebalancePool_userInfo, refetch: refetchUserInfo },
  ] = useQueries({
    queries: [
      {
        queryKey: ['BoostableRebalancePool_baseInfo', contractAddress],
        queryFn: () => fetchBaseInfo(),
        initialData: {},
        enabled: !!web3,
      },
      {
        queryKey: ['BoostableRebalancePool_userInfo', contractAddress],
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
    baseInfo: BoostableRebalancePool_baseInfo,
    // ...maxAbleFToken,
    userInfo: BoostableRebalancePool_userInfo,
  }
}
export default useRebalancePoolUseInfo
