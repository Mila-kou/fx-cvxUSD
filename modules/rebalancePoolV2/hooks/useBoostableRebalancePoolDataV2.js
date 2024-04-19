import { useEffect, useState, useContext, useCallback } from 'react'
import { useQueries } from '@tanstack/react-query'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import { useBoostableRebalancePool } from '@/hooks/useGaugeContracts'
import { REBALANCE_POOLS_LIST, REWARD_TOKENS } from '@/config/aladdinVault'

const useRebalancePoolUseInfo = (infoKey) => {
  const { _currentAccount, web3, blockNumber } = useWeb3()
  const multiCallsV2 = useMutiCallV2()
  const rebalanceConfig = REBALANCE_POOLS_LIST.find(
    (item) => item.infoKey == infoKey
  )
  const { rebalancePoolAddress: contractAddress, rebalanceRewards } =
    rebalanceConfig
  const { contract: fx_BoostableRebalancePool_PoolContract } =
    useBoostableRebalancePool(contractAddress)

  const fetchBaseInfo = useCallback(async () => {
    const {
      totalSupply: BoostableRebalancePoolTotalSupplyFn,
      getActiveRewardTokens,
      rewardData,
    } = fx_BoostableRebalancePool_PoolContract.methods

    const rewardsCalls = REWARD_TOKENS.map((item) => ({
      reward: rewardData(config.tokens[item]),
      symbol: item,
    }))

    try {
      const apiCalls = [
        BoostableRebalancePoolTotalSupplyFn(),
        getActiveRewardTokens(),
        rewardsCalls,
      ]
      const [
        BoostableRebalancePoolTotalSupplyRes,
        ActiveRewardTokensRes,
        rewardsRes,
      ] = await multiCallsV2(apiCalls)

      return {
        BoostableRebalancePoolTotalSupplyRes,
        ActiveRewardTokensRes,
        rewardsRes,
      }
    } catch (error) {
      console.log('rebalance--baseInfoError==>', error)
      return {}
    }
  }, [fx_BoostableRebalancePool_PoolContract, multiCallsV2, _currentAccount])

  const fetchUserInfo = useCallback(async () => {
    const {
      checkpoint,
      balanceOf: BoostableRebalancePoolBalanceOfFn,
      claimable: claimableFn,
      getBoostRatio,
      allowance,
      userSnapshot,
      integrate_fraction,
      snapshot,
      workingBalanceOf,
    } = fx_BoostableRebalancePool_PoolContract.methods

    const claimableCalls = rebalanceRewards.map((item) => ({
      reward: claimableFn(_currentAccount, config.tokens[item]),
      symbol: item,
    }))

    try {
      const apiCalls = [
        checkpoint(_currentAccount),
        BoostableRebalancePoolBalanceOfFn(_currentAccount),
        getBoostRatio(_currentAccount),
        claimableCalls,

        // userSnapshot(_currentAccount),
        // integrate_fraction(_currentAccount),
        // snapshot(),
        // workingBalanceOf(_currentAccount),
      ]
      const [
        ,
        BoostableRebalancePoolBalanceOfRes,
        BoostRatioRes,
        claimableRes,
        // userSnapshotRes,
        // claimableFXNRes,
        // snapshotRes,
        // workingBalanceRes,
      ] = await multiCallsV2(apiCalls)

      // console.log('claimable-----', {
      //   BoostRatioRes,
      //   claimableWstETHRes,
      //   claimableXETHRes,
      //   claimableFXNRes,
      // })

      return {
        BoostableRebalancePoolBalanceOfRes,
        BoostRatioRes,
        claimableRes,

        // userSnapshotRes,
        // snapshotRes,
        // workingBalanceRes,
      }
    } catch (error) {
      console.log('boostableRebalancePoolInfo------UserInfoError==>', error)
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
        queryKey: [
          'BoostableRebalancePool_userInfo',
          contractAddress,
          _currentAccount,
        ],
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
    rebalanceConfig,
    baseInfo: BoostableRebalancePool_baseInfo,
    userInfo: BoostableRebalancePool_userInfo,
  }
}
export default useRebalancePoolUseInfo
