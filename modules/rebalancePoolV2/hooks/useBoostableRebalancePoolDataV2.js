import { useEffect, useState, useContext, useCallback } from 'react'
import { useQueries } from '@tanstack/react-query'
import { useWstETH } from 'hooks/useContracts'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import { useBoostableRebalancePool } from '@/hooks/useGaugeContracts'
import { REBALANCE_POOLS_LIST } from '@/config/aladdinVault'

const useRebalancePoolUseInfo = (infoKey) => {
  const { _currentAccount, web3, blockNumber } = useWeb3()
  const multiCallsV2 = useMutiCallV2()
  const rebalanceConfig = REBALANCE_POOLS_LIST.find(
    (item) => item.infoKey == infoKey
  )
  const { rebalancePoolAddress: contractAddress } = rebalanceConfig
  const { contract: fx_BoostableRebalancePool_PoolContract } =
    useBoostableRebalancePool(contractAddress)

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
        rewardData(config.tokens.xETH),
        rewardData(config.tokens.sfrxETH),
        wstETHContract.methods.tokensPerStEth(),
      ]
      const [
        BoostableRebalancePoolTotalSupplyRes,
        ActiveRewardTokensRes,
        boostRatioRes,
        rewardData_wstETH_Res,
        rewardData_FXN_Res,
        rewardData_xETH_Res,
        rewardData_sfrxETH_Res,
        tokensPerStEth,
      ] = await multiCallsV2(apiCalls)
      console.log(
        'rebalance--0-------BaseInfo222222------1--',
        infoKey,
        // BoostableRebalancePoolTotalSupplyRes,
        // ActiveRewardTokensRes,
        boostRatioRes,
        rewardData_wstETH_Res,
        rewardData_xETH_Res,
        rewardData_FXN_Res,
        rewardData_sfrxETH_Res
        // tokensPerStEth
      )

      return {
        BoostableRebalancePoolTotalSupplyRes,
        ActiveRewardTokensRes,
        rewardData_wstETH_Res,
        rewardData_FXN_Res,
        rewardData_xETH_Res,
        rewardData_sfrxETH_Res,
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
        claimableFn(_currentAccount, config.tokens.sfrxETH),
        claimableFn(_currentAccount, config.tokens.xstETH),
        claimableFn(_currentAccount, config.tokens.xfrxETH),

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
        claimableSFrxETHRes,
        claimableWstETH_x_Res,
        claimableSFrxETH_x_Res,
        // userSnapshotRes,
        // claimableFXNRes,
        // snapshotRes,
        // workingBalanceRes,
      ] = await multiCallsV2(apiCalls)

      console.log(
        'boostableRebalancePoolInfo------',
        _currentAccount,
        contractAddress,
        infoKey,
        BoostableRebalancePoolBalanceOfRes,
        BoostRatioRes,
        claimableWstETHRes,
        claimableXETHRes,
        claimableFXNRes,
        claimableSFrxETHRes,
        claimableWstETH_x_Res,
        claimableSFrxETH_x_Res

        // userSnapshotRes,
        // snapshotRes,
        // workingBalanceRes
      )

      // console.log('claimable-----', {
      //   BoostRatioRes,
      //   claimableWstETHRes,
      //   claimableXETHRes,
      //   claimableFXNRes,
      // })

      return {
        BoostableRebalancePoolBalanceOfRes,
        BoostRatioRes,
        claimableWstETHRes,
        claimableXETHRes,
        claimableFXNRes,
        claimableSFrxETHRes,
        claimableWstETH_x_Res,
        claimableSFrxETH_x_Res,

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
    rebalanceConfig,
    baseInfo: BoostableRebalancePool_baseInfo,
    // ...maxAbleFToken,
    userInfo: BoostableRebalancePool_userInfo,
  }
}
export default useRebalancePoolUseInfo
