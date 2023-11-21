import { useCallback, useContext, useEffect, useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import abi from 'config/abi'
import {
  useContract,
  useVeFXN,
  useFxGaugeController,
  useFXN,
} from '@/hooks/useContracts'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import useWeb3 from '@/hooks/useWeb3'
import { POOLS_LIST } from '@/config/aladdinVault'
import { calc4 } from '@/modules/lock/util'
import moment from 'moment'

const useVoteData = () => {
  const { _currentAccount, current, web3, isAllReady, blockNumber } = useWeb3()
  const { getContract } = useContract()
  const { contract: veContract } = useVeFXN()
  const multiCallsV2 = useMutiCallV2()
  const { contract: FXNContract } = useFXN()
  const { contract: FxGaugeControllerContract } = useFxGaugeController()

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
  const fetchCommonVoteData = useCallback(
    async (arr) => {
      try {
        const nextTimes = calc4(current, true) * 1000 + 86400 * 7 * 1000
        const { rate } = FXNContract.methods
        const typeGaugeList = arr.map((item, index) => {
          return {
            ...item,
            baseInfo: {
              checkpoint_gauge: checkpoint_gauge(item.lpGaugeAddress),
              gauge_weight: get_gauge_weight(item.lpGaugeAddress),
              gauge_relative_weight: gauge_relative_weight(
                item.lpGaugeAddress,
                nextTimes
              ),
            },
          }
        })
        const allBaseInfo = await multiCallsV2(
          {
            total_weight: get_total_weight(),
            n_gauge_types: n_gauge_types(),
            FXNRate: rate(),
            typeGaugeList,
          },
          {
            from: _currentAccount,
          }
        )
        const typesWeightCalls = []
        for (let i = 0, l = allBaseInfo.n_gauge_types; i < l; i++) {
          typesWeightCalls.push({
            type_weight: get_type_weight(i),
            weights_sum_per_type: get_weights_sum_per_type(i),
          })
        }
        const typesWeightDatas = await multiCallsV2(typesWeightCalls, {
          from: _currentAccount,
        })
        console.log('CommonVoteData----1', allBaseInfo)
        return { ...allBaseInfo, typesWeightDatas }
      } catch (error) {
        console.log('commonVoteData----error', error)
        return arr
      }
    },
    [getContract, multiCallsV2, _currentAccount]
  )

  const fetchAllPoolVoteData = useCallback(
    async (arr) => {
      try {
        const { balanceOf } = veContract.methods
        const voteCalls = arr.map((item, index) => {
          return {
            ...item,
            voteInfo: {
              // end、power、slope
              voteSlope: vote_user_slopes(_currentAccount, item.lpGaugeAddress),
              lastVote: last_user_vote(_currentAccount, item.lpGaugeAddress),
              gaugeWeight: get_gauge_weight(item.lpGaugeAddress),
            },
          }
        })
        const [allVoteData, _votePower, veFXNAmount, lastScheduled] =
          await multiCallsV2(
            [
              voteCalls,
              vote_user_power(_currentAccount),
              balanceOf(_currentAccount),
              time_total(),
            ],
            {
              from: _currentAccount,
            }
          )
        console.log(
          'allVoteData-----veFXNAmount-',
          allVoteData,
          veFXNAmount,
          lastScheduled
        )
        return {
          allVoteData,
          votePower: _votePower / 100,
          veFXNAmount,
          lastScheduled,
        }
      } catch (error) {
        console.log('allVoteData----error', error)
        return {
          allVoteData: [],
          votePower: 0,
          veFXNAmount: 0,
          lastScheduled: 0,
        }
      }
    },
    [getContract, multiCallsV2, _currentAccount]
  )

  const [
    { data: commonVoteData, refetch: refetchCommonnInfo },
    { data: voteInfo, refetch: refetchVoteInfo },
  ] = useQueries({
    queries: [
      {
        queryKey: ['commonVoteData'],
        queryFn: () => fetchCommonVoteData(POOLS_LIST),
        initialData: {},
      },
      {
        queryKey: ['voteInfo', _currentAccount],
        queryFn: () => fetchAllPoolVoteData(POOLS_LIST),
        enabled: isAllReady,
        initialData: {
          allVoteData: [],
          votePower: 0,
          veFXNAmount: 0,
          lastScheduled: 0,
        },
      },
    ],
  })

  useEffect(() => {
    refetchCommonnInfo()
    refetchVoteInfo()
  }, [_currentAccount, blockNumber])

  return { commonVoteData, voteInfo }
}

export default useVoteData
