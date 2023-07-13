import { useCallback, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { cBN } from '@/utils/index'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import useWeb3 from '@/hooks/useWeb3'
import { useContract, useAbcCVX } from '@/hooks/useContracts'
import useConvexInfo from '@/hooks/useConvexInfo'
import abi from '@/config/abi'
import config from '@/config/index'

// ## abcCVX
// apy =  lp apy * ratio + lp apy * ratio
export const useAbcCVXData = () => {
  const { contract: aCVXContrct } = useAbcCVX()
  const { blockNumber } = useWeb3()
  const multiCallsV2 = useMutiCallV2()

  const fetchData = useCallback(async () => {
    const { ratio } = aCVXContrct.methods
    const calls = [ratio()]
    const [curRatio] = await multiCallsV2(calls)
    return curRatio
  }, [multiCallsV2, aCVXContrct])

  const { data, refetch } = useQuery({
    queryKey: ['abcCVXData'],
    queryFn: fetchData,
    initialData: 0,
  })

  useEffect(() => {
    refetch()
  }, [blockNumber])

  return data
}

const Curve_clevCVX_CVX = '0xF9078Fb962A7D13F55d40d49C8AA6472aBD1A5a6'

export const useClevCVXApyFromCleverFunarce = () => {
  const { getContract } = useContract()
  const convexApy = useConvexInfo('CVX')

  const fetchApy = useCallback(async () => {
    const _get_dy = await getContract(Curve_clevCVX_CVX, abi.CurveStaticCoinABI)
      .methods.get_dy(1, 0, cBN(0.01).shiftedBy(18).toString())
      .call()
    const dy = cBN(_get_dy).shiftedBy(-18).div(0.01).toString()
    const clevTokenSupply = await getContract(
      config.tokens.clevCVX,
      abi.erc20ABI
    )
      .methods.totalSupply()
      .call()
    const reserveRate = await getContract(
      config.contracts.lockCvx,
      abi.AladdinCVXLockerABI
    )
      .methods.reserveRate()
      .call()
    const totalUnrealised = await getContract(
      config.contracts.transmuterCvx,
      abi.TransmuterABI
    )
      .methods.totalUnrealised()
      .call()
    const {
      apy: { cvxAirfoceApr: profitRatio },
    } = convexApy ?? { apy: { cvxAirfoceApr: 0 } }

    const furnaceRatio = cBN(clevTokenSupply).isZero()
      ? 0
      : cBN(totalUnrealised).div(clevTokenSupply).toString()
    const discount = 1 / dy - 1
    if (!cBN(furnaceRatio).isZero()) {
      const apr = (
        ((discount * (parseFloat(profitRatio) / 100)) /
          ((reserveRate / 10e8) * furnaceRatio)) *
        100
      ).toFixed(2)
      // console.log('apr-----', apr)
      return parseFloat(apr ?? 0)
    }
    return 0
  }, [getContract, convexApy])

  const { data: apy, refetch } = useQuery({
    queryKey: ['clevCVXApyFromCleverFunarce'],
    queryFn: fetchApy,
    initialData: 0,
  })

  useEffect(() => {
    refetch()
  }, [convexApy])

  return apy
}
