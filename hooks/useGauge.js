import { useCallback, useState, useEffect } from 'react'
import { useQueries } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import abi from 'config/abi'
import { useContract, useFXN, useFxGaugeController } from './useContracts'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import { GAUGE_LIST } from '@/config/aladdinVault'
import useWeb3 from '@/hooks/useWeb3'
import { calc4 } from '@/modules/lock/util'
import { updateGauge } from '@/store/slices/gauge'
import config from '../config'

const useGauge = () => {
  const { getContract } = useContract()
  const { _currentAccount, current, web3, isAllReady, blockNumber } = useWeb3()
  const multiCallsV2 = useMutiCallV2()
  const dispatch = useDispatch()

  const { contract: FxGaugeControllerContract } = useFxGaugeController()
  const { contract: FXNContract } = useFXN()
  const [data, setData] = useState({
    total_weight: 0,
    n_gauge_types: 0,
    FXNRate: 0,
    GaugeList: GAUGE_LIST,
  })

  const {
    vote_user_slopes,
    vote_user_power,
    last_user_vote,
    get_gauge_weight,
    gauge_relative_weight,
    checkpoint_gauge,
    time_total,
    get_total_weight,
    get_type_weight,
    n_gauge_types,
    get_weights_sum_per_type,
  } = FxGaugeControllerContract.methods

  const getGaugeContract = useCallback(
    (lpGaugeAddress) => {
      const _lpGaugeContract = getContract(
        lpGaugeAddress,
        abi.FX_fx_SharedLiquidityGaugeABI
      )
      return _lpGaugeContract
    },
    [getContract]
  )
  const fetchAllGaugeData = useCallback(
    async (arr) => {
      try {
        const nextTimes = calc4(current, true) + 86400 * 7
        const currentTimes = calc4(current, true)
        const { rate } = FXNContract.methods
        const _lpGaugeContractList = []

        const GaugeList = arr.map((item, index) => {
          const _lpGaugeContract = getGaugeContract(item.lpGaugeAddress)
          const {
            symbol,
            totalSupply,
            name,
            getActiveRewardTokens,
            stakingToken,
          } = _lpGaugeContract.methods
          _lpGaugeContractList.push(_lpGaugeContract)

          console.log(
            '__GaugeList---GaugeList-_lpGaugeContract--',
            _lpGaugeContract
          )
          const _apiCall = {
            baseInfo: {},
            baseGaugeControllerInfo: {
              // checkpoint_gauge: checkpoint_gauge(item.lpGaugeAddress),
              gauge_weight: get_gauge_weight(item.lpGaugeAddress),
              this_week_gauge_weight: gauge_relative_weight(
                item.lpGaugeAddress,
                currentTimes
              ),
              next_week_gauge_weight: gauge_relative_weight(
                item.lpGaugeAddress,
                nextTimes
              ),
            },
          }
          if (
            !['Stability Pool Gauge', 'Fundraising'].includes(
              item.gaugeTypeName
            )
          ) {
            _apiCall.baseInfo = {
              symbol: symbol(),
              totalSupply: totalSupply(),
              name: name(),
              stakingToken: stakingToken(),
              activeRewardTokens: getActiveRewardTokens(),
            }
          }
          return _apiCall
        })
        console.log('__GaugeList---GaugeList-', GaugeList)

        const GaugeList_all = await multiCallsV2(GaugeList)

        const allGaugeBaseInfo = await multiCallsV2({
          total_weight: get_total_weight(),
          n_gauge_types: n_gauge_types(),
          FXNRate: rate(),
        })
        allGaugeBaseInfo.GaugeList = [...GaugeList_all]
        console.log('__GaugeList---GaugeList-1--', allGaugeBaseInfo)
        // fetchGaugeListApys
        const fetchGaugeListApys = allGaugeBaseInfo.GaugeList.map(
          (item, index) => {
            const { activeRewardTokens = [] } = item.baseInfo
            const { rewardData } = _lpGaugeContractList[index].methods

            const _rewardData = activeRewardTokens.map((rewardToken) => {
              return {
                rewardAddress: rewardToken,
                rewardData: rewardData(rewardToken),
              }
            })
            // item.rewardDatas = _rewardData
            return {
              rewardDatas: [
                ..._rewardData,
                { rewardAddress: config.tokens.FXN }, // add FXN reward
              ],
            }
          }
        )
        const fetchGaugeListApysData = await multiCallsV2(fetchGaugeListApys)
        console.log(
          '__GaugeList--fetchGaugeListApysData----',
          fetchGaugeListApysData
        )
        allGaugeBaseInfo.GaugeList = arr.map((item, index) => ({
          ...item,
          ...allGaugeBaseInfo.GaugeList[index],
          ...fetchGaugeListApysData[index],
        }))
        // typesWeightCalls
        const typesWeightCalls = []
        for (let i = 0, l = allGaugeBaseInfo.n_gauge_types * 1; i < l; i++) {
          typesWeightCalls.push({
            type_weight: get_type_weight(i),
            weights_sum_per_type: get_weights_sum_per_type(i),
          })
        }
        const typesWeightDatas = await multiCallsV2(typesWeightCalls)
        console.log('__GaugeList--success--typesWeightDatas', allGaugeBaseInfo)
        setData({
          ...allGaugeBaseInfo,
          typesWeightDatas,
        })
        return {
          data: {
            ...allGaugeBaseInfo,
            typesWeightDatas,
          },
        }
      } catch (error) {
        console.log('__GaugeList---GaugeList-error', error)

        return {
          data: {},
        }
      }
    },
    [multiCallsV2, current, FXNContract, getGaugeContract]
  )

  const [{ isFetching, refetch: refetchAllGaugeData }] = useQueries({
    queries: [
      {
        queryKey: ['allGaugeData', _currentAccount],
        queryFn: () => fetchAllGaugeData(GAUGE_LIST),
        initialData: {
          total_weight: 0,
          n_gauge_types: 0,
          FXNRate: 0,
          GaugeList: GAUGE_LIST,
        },
      },
    ],
  })

  useEffect(() => {
    if (isFetching) return
    refetchAllGaugeData()
  }, [_currentAccount, blockNumber])

  useEffect(() => {
    dispatch(updateGauge(data))
  }, [data, dispatch])

  return data
}

export default useGauge
