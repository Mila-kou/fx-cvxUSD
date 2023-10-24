import { useEffect, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import useWeb3 from '@/hooks/useWeb3'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import { useFXNVesting, useFX_ManageableVesting } from '@/hooks/useContracts'

const useVestingData = () => {
  const { blockNumber, _currentAccount, isAllReady } = useWeb3()
  const multiCallsV2 = useMutiCallV2()
  const { contract: ManageableVestingContract } = useFX_ManageableVesting()

  const fetchUserVesting = useCallback(async () => {
    try {
      const { getUserVest, vested, getReward, claim } =
        ManageableVestingContract.methods
      const canClaim_0 = await claim().call({ from: _currentAccount })
      const canClaim_1 = await claim(1).call({ from: _currentAccount })
      const canClaim_2 = await claim(2).call({ from: _currentAccount })
      const apis = [getUserVest(_currentAccount), vested(_currentAccount)]
      const [userVest, vestedData] = await multiCallsV2(apis)
      console.log('userVest--vestedData--', userVest, vestedData)
      return {
        canClaim: canClaim_0,
        canClaim_1,
        canClaim_2,
        userVest,
        vestedData,
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
