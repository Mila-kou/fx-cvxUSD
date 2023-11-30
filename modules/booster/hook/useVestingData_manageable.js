import { useEffect, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import useWeb3 from '@/hooks/useWeb3'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import {
  useFX_ManageableVesting,
  useConvex_cvxFxnStaking,
  useStakeDao_sdFxnStaking,
} from '@/hooks/useContracts'
import config from '@/config/index'

const useVestingData = () => {
  const { blockNumber, _currentAccount, isAllReady } = useWeb3()
  const multiCallsV2 = useMutiCallV2()
  const { contract: ManageableVestingContract } = useFX_ManageableVesting()
  const { contract: Convex_cvxFxnStakingContract } = useConvex_cvxFxnStaking()
  const { contract: StakeDao_sdFxnStakingContract } = useStakeDao_sdFxnStaking()

  const fetchUserVesting = useCallback(async () => {
    try {
      const { getUserVest, vested, claim, proxy } =
        ManageableVestingContract.methods
      const { claimableRewards, balanceOf: cvxFxnStakingBalanceOf } =
        Convex_cvxFxnStakingContract.methods
      const { claimable_reward, balanceOf: sdFxnStakingBalanceOf } =
        StakeDao_sdFxnStakingContract.methods

      const canClaim_0 = await claim().call({ from: _currentAccount })
      const canClaim_1 = await claim(1).call({ from: _currentAccount })
      const canClaim_2 = await claim(2).call({ from: _currentAccount })
      const propyUser = await proxy(_currentAccount).call({
        from: _currentAccount,
      })
      const _cvxFxnStakingBalanceOf = await cvxFxnStakingBalanceOf(
        propyUser
      ).call({ from: propyUser })
      const apis = [
        getUserVest(_currentAccount),
        vested(_currentAccount),
        claimableRewards(propyUser),
        claimable_reward(propyUser, config.tokens.SDT),
        claimable_reward(propyUser, config.tokens.wstETH),
        cvxFxnStakingBalanceOf(propyUser),
        sdFxnStakingBalanceOf(propyUser),
      ]
      const [
        userVest,
        vestedData,
        convexRewards,
        statkeDaoRewards,
        statkeDaoWstETHRewards,
        cvxFxnStakingBalances,
        sdFxnStakingBalances,
      ] = await multiCallsV2(apis)
      console.log(
        'userVest--vestedData--convexRewards--statkeDaoRewards--cvxFxnStakingBalances--sdFxnStakingBalances--',
        userVest,
        vestedData,
        convexRewards,
        statkeDaoRewards,
        statkeDaoWstETHRewards,
        cvxFxnStakingBalances,
        sdFxnStakingBalances,
        canClaim_0,
        canClaim_1,
        canClaim_2
      )
      return {
        canClaim: canClaim_0,
        canClaim_1,
        canClaim_2,
        userVest,
        vestedData,
        convexRewards,
        statkeDaoRewards,
        statkeDaoWstETHRewards,
        cvxFxnStakingBalances,
        sdFxnStakingBalances,
      }
    } catch (error) {
      console.log('useVestingData', error)
    }
  }, [ManageableVestingContract, _currentAccount, multiCallsV2])

  const { data, refetch } = useQuery({
    queryKey: ['vestingData', _currentAccount],
    queryFn: fetchUserVesting,
    initialData: {
      userVest: {},
      vestedData: {},
      vestingData: {},
    },
    enabled: isAllReady,
  })

  useEffect(() => {
    refetch()
  }, [blockNumber, isAllReady])

  return data
}

export default useVestingData
