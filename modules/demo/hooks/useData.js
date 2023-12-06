import { useEffect, useState, useContext, useCallback } from 'react'
import { useQueries } from '@tanstack/react-query'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import { useBoostableRebalancePool } from '@/hooks/useGaugeContracts'
import { REBALANCE_POOLS_LIST } from '@/config/aladdinVault'

const useData = (infoKey) => {
  const { _currentAccount, web3, blockNumber, blockTime } = useWeb3()
  const multiCallsV2 = useMutiCallV2()
  const { rebalancePoolAddress: contractAddress } = REBALANCE_POOLS_LIST.find(
    (item) => item.infoKey == infoKey
  )
  const { contract: fx_BoostableRebalancePool_PoolContract } =
    useBoostableRebalancePool(contractAddress)

  console.log('rebalance--0--', contractAddress)
  // const { contract: wstETHContract } = useWstETH()

  const fetchBaseInfo = useCallback(async () => {
    const {
      boostCheckpoint: boostCheckpointFn,
      balanceOf: balanceOfFn,
      totalSupply: BoostableRebalancePoolTotalSupplyFn,
      getBoostRatio,
      rewardData,
      claimable: claimableFn,
    } = fx_BoostableRebalancePool_PoolContract.methods
    try {
      const apiCalls = [
        boostCheckpointFn(_currentAccount),
        balanceOfFn(_currentAccount),
        BoostableRebalancePoolTotalSupplyFn(),
        getBoostRatio(_currentAccount),
        // rewardData(config.tokens.wstETH),
        rewardData(config.tokens.FXN),
        claimableFn(_currentAccount, config.tokens.FXN),
        // rewardData(config.tokens.xETH),
        // wstETHContract.methods.tokensPerStEth(),
      ]
      const [
        boostCheckpoint,
        balanceOf,
        totalSupply,
        boostRatio,
        // rewardData_wstETH_Res,
        rewardData_FXN,
        claimableFXN,
        // rewardData_xETH_Res,
        // tokensPerStEth,
      ] = await multiCallsV2(apiCalls)
      console.log(
        'blockNumber-----useData------',
        blockNumber
        // BoostableRebalancePoolTotalSupplyRes,
        // ActiveRewardTokensRes,
        // boostRatioRes,
        // rewardData_wstETH_Res,
        // rewardData_xETH_Res
        // rewardData_FXN_Res
        // tokensPerStEth
      )

      return {
        boostCheckpoint,
        balanceOf,
        totalSupply,
        boostRatio,
        // rewardData_wstETH_Res,
        rewardData_FXN,
        claimableFXN,
        blockNumber,
        blockTime,
        // rewardData_xETH_Res,
        // tokensPerStEth,
      }
    } catch (error) {
      console.log('rebalance--baseInfoError==>', error)
      return {}
    }
  }, [
    fx_BoostableRebalancePool_PoolContract,
    multiCallsV2,
    _currentAccount,
    blockNumber,
    blockTime,
  ])

  const fetchUserInfo = useCallback(async () => {
    console.log('rebalance--fetchUserInfo--')
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

    try {
      const apiCalls = [
        checkpoint(_currentAccount),
        BoostableRebalancePoolBalanceOfFn(_currentAccount),
        getBoostRatio(_currentAccount),
        claimableFn(_currentAccount, config.tokens.wstETH),
        claimableFn(_currentAccount, config.tokens.xETH),
        claimableFn(_currentAccount, config.tokens.FXN),

        // userSnapshot(_currentAccount),
        // integrate_fraction(_currentAccount),
        // snapshot(),
        // workingBalanceOf(_currentAccount),
      ]
      const [
        ,
        BoostableRebalancePoolBalanceOfRes,
        BoostRatioRes,
        claimableWstETHRes,
        claimableXETHRes,
        claimableFXNRes,
        // userSnapshotRes,
        // claimableFXNRes,
        // snapshotRes,
        // workingBalanceRes,
      ] = await multiCallsV2(apiCalls)

      console.log(
        'rebalance--userData--',
        BoostableRebalancePoolBalanceOfRes,
        BoostRatioRes,
        claimableWstETHRes,
        claimableXETHRes,
        claimableFXNRes

        // userSnapshotRes,
        // snapshotRes,
        // workingBalanceRes
      )

      console.log('claimable-----', {
        BoostRatioRes,
        claimableWstETHRes,
        claimableXETHRes,
        claimableFXNRes,
      })

      return {
        BoostableRebalancePoolBalanceOfRes,
        BoostRatioRes,
        claimableWstETHRes,
        claimableXETHRes,
        claimableFXNRes,

        // userSnapshotRes,
        // snapshotRes,
        // workingBalanceRes,
      }
    } catch (error) {
      console.log('boostableRebalancePoolInfo--UserInfoError==>', error)
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
    // { data: BoostableRebalancePool_userInfo, refetch: refetchUserInfo },
  ] = useQueries({
    queries: [
      {
        queryKey: ['BoostableRebalancePool_baseInfo_data', contractAddress],
        queryFn: () => fetchBaseInfo(),
        initialData: {},
        enabled: !!web3,
      },
      // {
      //   queryKey: ['BoostableRebalancePool_userInfo', contractAddress],
      //   queryFn: () => fetchUserInfo(),
      //   initialData: {},
      //   enabled: !!web3,
      // },
    ],
  })

  useEffect(() => {
    refetchBaseInfo()
    // refetchUserInfo()
  }, [_currentAccount, blockNumber])
  return {
    baseInfo: BoostableRebalancePool_baseInfo,
    // ...maxAbleFToken,
    // userInfo: BoostableRebalancePool_userInfo,
  }
}
export default useData
