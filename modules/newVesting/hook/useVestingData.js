import { useEffect, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import useWeb3 from '@/hooks/useWeb3'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import { useFXNVesting } from '@/hooks/useContracts'

const useVestingData = () => {
  const { blockNumber, _currentAccount, isAllReady } = useWeb3()
  const multiCallsV2 = useMutiCallV2()
  const { contract: VestingContract } = useFXNVesting()

  const fetchUserVesting = useCallback(async () => {
    const { getUserVest, vested, claim } = VestingContract.methods
    const canClaim = await claim().call({ from: _currentAccount })
    const apis = [getUserVest(_currentAccount), vested(_currentAccount)]
    const [userVest, vestedData] = await multiCallsV2(apis)

    return {
      canClaim,
      userVest,
      vestedData,
    }
  }, [VestingContract, _currentAccount, multiCallsV2])

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
