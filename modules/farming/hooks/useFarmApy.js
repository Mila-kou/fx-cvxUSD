import { useCallback, useEffect, useMemo } from 'react'
import { useQueries } from '@tanstack/react-query'
import useWeb3 from '@/hooks/useWeb3'
import { cBN, checkNotZoroNum } from '@/utils/index'
import { useClev, useClevGaugeController } from '@/hooks/useContracts'
import fetcher from '@/utils/fetcher'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import { useAbcCVXData, useClevCVXApyFromCleverFunarce } from './useAbccvx'
import useFarmData from './useFarmData'
import useConvexInfo from '@/hooks/useConvexInfo'

const useFarmApy = () => {
  const { blockTime, blockNumber } = useWeb3()
  const { allPoolsInfo: AllPoolsInfo } = useFarmData()
  const { contract: ClevContract } = useClev()
  const { contract: ClevGaugeControllerContract } = useClevGaugeController()
  const multiCallsV2 = useMutiCallV2()
  const clevCVX_CVX_APY = useClevCVXApyFromCleverFunarce()
  const curRatio = useAbcCVXData()
  const cvxClevCVXConvexApy = useConvexInfo('CVX​+clevCVX')

  const fetchAllPoolApy = useCallback(async () => {
    const allFethList = {}
    const _currTimestamp = blockTime || Math.floor(new Date().getTime() / 1000)
    AllPoolsInfo.forEach((item) => {
      const { lpAddress, lpGaugeAddress } = item
      allFethList[lpAddress.toLowerCase()] = {
        rate: ClevContract.methods.rate(),
        gauge_relative_weight:
          ClevGaugeControllerContract.methods.gauge_relative_weight(
            lpGaugeAddress,
            _currTimestamp
          ),
      }
    })
    const allPoolsBasicInfo = await multiCallsV2(allFethList)
    const _apyAllList = {}
    Object.keys(allPoolsBasicInfo).forEach((item) => {
      const { rate: clevRate, gauge_relative_weight: _gaugeRelativeWeight } =
        allPoolsBasicInfo[item]
      const gaugeRelativeWeight = _gaugeRelativeWeight // '500000000000000000'
      const gauge_clev_timestamp = cBN(clevRate)
        .div(1e18)
        .times(gaugeRelativeWeight)
        .div(1e18)
      _apyAllList[item] = {
        clevRate,
        gaugeRelativeWeight,
        gauge_clev_timestamp,
      }
    })
    return _apyAllList
  }, [
    AllPoolsInfo,
    blockTime,
    ClevContract,
    ClevGaugeControllerContract,
    multiCallsV2,
  ])

  const getConcentratorAbcCVXApy = async () => {
    let cvxClevCVXLpApy = cvxClevCVXConvexApy
      ? cvxClevCVXConvexApy.apy.project
      : 0
    cvxClevCVXLpApy = parseFloat(cvxClevCVXLpApy)
    let ratio = curRatio / 10e9
    // eslint-disable-next-line operator-assignment
    ratio = ratio / (ratio + 1)
    const apy = cvxClevCVXLpApy * ratio + clevCVX_CVX_APY * (1 - ratio)
    const concentratorTokenApy = cBN(apy)
      .dividedBy(100)
      .dividedBy(52)
      .plus(1)
      .pow(52)
      .minus(1)
      .shiftedBy(2)

    const abcCVXBaseApy = checkNotZoroNum(concentratorTokenApy)
      ? concentratorTokenApy
      : 0
    return abcCVXBaseApy
  }

  const [{ data: json }, { data: json2 }, { data: json3 }] = useQueries({
    queries: [
      {
        queryKey: ['getFactoryAPYs/crypto'],
        queryFn: () =>
          fetcher(
            'https://api.curve.fi/api/getFactoryAPYs?version=crypto'
          ).then((res) => res.data),
      },
      {
        queryKey: ['getFactoryAPYs/version'],
        queryFn: () =>
          fetcher('https://api.curve.fi/api/getFactoryAPYs?version=2').then(
            (res) => res.data
          ),
      },
      {
        queryKey: ['balancer'],
        queryFn: () =>
          fetcher('https://api.aladdin.club/api/balancer').then(
            (res) => res.data
          ),
      },
    ],
  })

  const getCurveApy = useCallback(async () => {
    const pool = {}
    const data = json?.poolDetails
    const data2 = json2?.poolDetails
    const _data = [].concat(data).concat(data2)
    AllPoolsInfo.forEach((poolInfo) => {
      if (poolInfo.fromPlatform.toLowerCase() == 'curve') {
        const item = _data.filter(
          (itemOjb) =>
            itemOjb.poolAddress.toLowerCase() ==
            poolInfo.lpPoolToken.toLowerCase()
        )
        if (item.length) {
          // eslint-disable-next-line prefer-destructuring
          pool[item[0].poolAddress.toLowerCase()] = item[0]
        } else {
          pool[poolInfo.lpPoolToken.toLowerCase()] = {
            index: 0,
            poolAddress: poolInfo.lpPoolToken,
            apy: 0,
            apyWeekly: 0,
            virtualPrice: 0,
            volume: 0,
          }
        }
      }
    })

    return pool
  }, [AllPoolsInfo, json, json2])

  const getBalancerApy = useCallback(async () => {
    const info = json3?.info
    const pool = {}

    AllPoolsInfo.filter(
      (item) => item.fromPlatform.toLowerCase() === 'balancer' && item.lpPoolId
    ).forEach((poolInfo) => {
      const id = poolInfo.lpPoolId.toLowerCase()
      const item = info[id]

      const data = {
        id,
        lpAddress: poolInfo.lpAddress.toLowerCase(),
        symbol: '',
        apy: '',
      }

      if (item) {
        data.apy = cBN(parseFloat(item.detailed.swap_fees)).div(100).toNumber()
        data.symbol = item.symbol
      }

      pool[id] = data
    })

    return pool
  }, [AllPoolsInfo, json3])

  const [
    { data: concentratorAbcCVXBaseApy, refetch: refetch1 },
    { data: curveApy, refetch: refetch2 },
    { data: balancerApy, refetch: refetch3 },
    { data: allPoolApy, refetch: refetch4 },
  ] = useQueries({
    queries: [
      {
        queryKey: ['concentratorAbcCVXBaseApy'],
        queryFn: getConcentratorAbcCVXApy,
        refetchInterval: 300000,
      },
      {
        queryKey: ['curveApy'],
        queryFn: getCurveApy,
        refetchInterval: 300000,
        enabled: !!json && !!json2,
      },
      {
        queryKey: ['balancerApy'],
        queryFn: getBalancerApy,
        refetchInterval: 300000,
        enabled: !!json3,
      },
      {
        queryKey: ['allPoolApy'],
        queryFn: fetchAllPoolApy,
        refetchInterval: 300000,
      },
    ],
  })

  useEffect(() => {
    refetch1()
  }, [cvxClevCVXConvexApy, clevCVX_CVX_APY, curRatio])

  useEffect(() => {
    if (json && json2) refetch2()
    if (json3) refetch3()
    refetch4()
  }, [AllPoolsInfo, json, json2, json3])

  return {
    ...allPoolApy,
    concentratorAbcCVXBaseApy,
    curveApy,
    balancerApy,
  }
}

export default useFarmApy
