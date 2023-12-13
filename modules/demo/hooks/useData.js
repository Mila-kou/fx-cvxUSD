import { useEffect, useState, useContext, useCallback } from 'react'
import { useQueries } from '@tanstack/react-query'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import { useBoostableRebalancePool } from '@/hooks/useGaugeContracts'
import { REBALANCE_POOLS_LIST } from '@/config/aladdinVault'
import { fb4 } from '@/utils/index'
import {
  useVeFXNFee,
  useVeFXN,
  useFXN,
  useErc20Token,
  useWstETH,
} from '@/hooks/useContracts'

const format = (v, d = 18) =>
  fb4(v, false, d, d).replace(',', '').replace('-', '0')

const useData = (infoKey) => {
  const { _currentAccount, web3, blockNumber, blockTime } = useWeb3()
  const { contract: veFXNContract, address: veFXNAddress } = useVeFXN()
  const multiCallsV2 = useMutiCallV2()
  const { rebalancePoolAddress: contractAddress } = REBALANCE_POOLS_LIST.find(
    (item) => item.infoKey == infoKey
  )
  const { contract: fx_BoostableRebalancePool_PoolContract } =
    useBoostableRebalancePool(contractAddress)

  const { totalSupply: totalSupplyVeFXNFn, balanceOf: veFXNBalanceOf } =
    veFXNContract.methods

  console.log('rebalance--0--', contractAddress)
  // const { contract: wstETHContract } = useWstETH()

  const fetchBaseInfo = useCallback(async () => {
    const {
      checkpoint,
      boostCheckpoint: boostCheckpointFn,
      balanceOf: balanceOfFn,
      totalSupply: BoostableRebalancePoolTotalSupplyFn,
      getBoostRatio,
      rewardData,
      claimable: claimableFn,
      userRewardSnapshot: userRewardSnapshotFn,
    } = fx_BoostableRebalancePool_PoolContract.methods
    try {
      const apiCalls = [
        checkpoint(_currentAccount),
        boostCheckpointFn(_currentAccount),
        balanceOfFn(_currentAccount),
        BoostableRebalancePoolTotalSupplyFn(),
        getBoostRatio(_currentAccount),
        // rewardData(config.tokens.wstETH),
        rewardData(config.tokens.FXN),
        claimableFn(_currentAccount, config.tokens.FXN),
        totalSupplyVeFXNFn(),
        userRewardSnapshotFn(_currentAccount, config.tokens.FXN),
        // rewardData(config.tokens.xETH),
        // wstETHContract.methods.tokensPerStEth(),
      ]
      const [
        ,
        boostCheckpoint,
        balanceOf,
        totalSupply,
        boostRatio,
        // rewardData_wstETH_Res,
        rewardData_FXN,
        claimableFXN,
        totalSupply_veFXN,
        userRewardSnapshot_FXNRes,
        // rewardData_xETH_Res,
        // tokensPerStEth,
      ] = await multiCallsV2(apiCalls)
      console.log(
        'claimableFXN------',
        claimableFXN
        // BoostableRebalancePoolTotalSupplyRes,
        // ActiveRewardTokensRes,
        // boostRatioRes,
        // rewardData_wstETH_Res,
        // rewardData_xETH_Res
        // rewardData_FXN_Res
        // tokensPerStEth
      )

      const userRewardSnapshot_FXN = {
        pending: format(userRewardSnapshot_FXNRes.rewards.pending),
        claimed: format(userRewardSnapshot_FXNRes.rewards.claimed),
        timestamp: userRewardSnapshot_FXNRes.checkpoint.timestamp,
        integral: format(userRewardSnapshot_FXNRes.checkpoint.integral, 36),
      }

      return {
        dataObj: {
          boostCheckpoint,
          balanceOf,
          totalSupply,
          boostRatio,
          // rewardData_wstETH_Res,
          rewardData_FXN,
          claimableFXN,
          totalSupply_veFXN,
          userRewardSnapshot_FXN,
          blockNumber,
          blockTime,
        },

        dataList: [
          boostCheckpoint[0],
          boostCheckpoint[1],
          boostCheckpoint[2],
          balanceOf,
          totalSupply,
          boostRatio,
          claimableFXN,
          totalSupply_veFXN,
        ],

        spList: [
          userRewardSnapshot_FXN.pending,
          userRewardSnapshot_FXN.claimed,
          userRewardSnapshot_FXN.timestamp,
          userRewardSnapshot_FXN.integral,
          format(rewardData_FXN[0]),
          format(rewardData_FXN[1]),
          rewardData_FXN[2],
          rewardData_FXN[3],
        ],
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
  }, [_currentAccount, blockNumber, blockTime])
  return {
    baseInfo: BoostableRebalancePool_baseInfo,
    // ...maxAbleFToken,
    // userInfo: BoostableRebalancePool_userInfo,
  }
}
export default useData
