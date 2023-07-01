import { useEffect, useCallback, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import useWeb3 from '@/hooks/useWeb3'
import { useMutiCall } from '@/hooks/useMutiCalls'
import { useVeClev, useClev } from '@/hooks/useContracts'

const useCalc = () => {
  const { currentAccount, isAllReady, blockNumber } = useWeb3()
  const multiCall = useMutiCall()
  const { contract: veContract } = useVeClev()
  const { contract: clevContract } = useClev()

  const fetchCotractInfo = useCallback(() => {
    const abiCalls = [
      veContract.methods.totalSupply(),
      veContract.methods.balanceOf(currentAccount),
      clevContract.methods.balanceOf(currentAccount),
    ]
    return multiCall(...abiCalls)
  }, [veContract, clevContract, currentAccount])

  const {
    data: [veTotalSupply, myVeBalance, myClevBalance],
    refetch,
  } = useQuery({
    queryKey: ['calcData', currentAccount],
    queryFn: fetchCotractInfo,
    initialData: [0, 0, 0],
    enabled: isAllReady,
  })

  useEffect(() => {
    if (isAllReady) {
      refetch()
    }
  }, [currentAccount, blockNumber, isAllReady])

  return useMemo(
    () => ({
      veTotalSupply,
      userVeCLEV: myVeBalance,
      userCLEV: myClevBalance,
      contracts: { veContract },
    }),
    [veTotalSupply, myVeBalance, myClevBalance, veContract]
  )
}

export default useCalc
