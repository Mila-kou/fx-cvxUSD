import { useEffect, useState, useContext, useCallback, useMemo } from 'react'
import moment from 'moment'
import { cBN, checkNotZoroNum, checkNotZoroNumOption, fb4 } from '@/utils/index'
import { useGlobal } from '@/contexts/GlobalProvider'
import useWeb3 from '@/hooks/useWeb3'
import useVoteData from '../hooks/useVoteData'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import { POOLS_LIST } from '@/config/aladdinVault'
import { useContract, useVeFXN } from '@/hooks/useContracts'
import config from '@/config/index'

const useVoteController = () => {
  const { currentAccount, isAllReady, blockTime } = useWeb3()
  const {
    commonVoteData,
    voteInfo: { allVoteData, votePower, veFXNAmount, lastScheduled },
  } = useVoteData()

  const getGaugeEstimate = useCallback(
    (typeIndex, lpGaugeAddress, typeWeek = 'thisWeek') => {
      const _weekSecond = config.weekSecond
      const { FXNRate, total_weight, typesWeightDatas, typeGaugeList } =
        commonVoteData
      const { type_weight, weights_sum_per_type } = typesWeightDatas[typeIndex]
      const { baseInfo } = typeGaugeList.find(
        (item) =>
          item.lpGaugeAddress.toLowerCase() == lpGaugeAddress.toLowerCase()
      )
      console.log(
        'gaugeEstimate----typeIndex, lpGaugeAddress,commonVoteData,typesWeightDatas,typeGaugeList,baseInfo',
        typeIndex,
        lpGaugeAddress,
        commonVoteData,
        typesWeightDatas,
        typeGaugeList,
        baseInfo
      )
      const _allTypesWeight = cBN(type_weight).times(weights_sum_per_type)
      const _typeWeightRate = cBN(_allTypesWeight).div(total_weight)
      const _gaugeWeightRate = cBN(baseInfo?.gauge_weight).div(
        weights_sum_per_type
      )
      console.log(
        'gaugeEstimate----baseInfo?.gauge_weight,_allTypesWeight,_typeWeightRate,_gaugeWeightRate',
        baseInfo?.gauge_weight,
        _allTypesWeight.toString(10),
        _typeWeightRate.toString(10),
        _gaugeWeightRate.toString(10)
      )
      const _gaugeEstimate = cBN(FXNRate)
        .times(_weekSecond)
        .times(_typeWeightRate)
        .times(_gaugeWeightRate)
        .div(1e18)
        .toFixed(4)
      console.log('gaugeEstimate----2', _gaugeEstimate)
      return _gaugeEstimate
    },
    [commonVoteData]
  )

  console.log('commonVoteData-----2', commonVoteData)
  const userVoteInfo = useMemo(() => {
    const _allocatedVotes = cBN(veFXNAmount)
      .multipliedBy(votePower)
      .dividedBy(100)
    const _remainingVotes = cBN(veFXNAmount)
      .multipliedBy(100 - votePower)
      .dividedBy(100)
    const next_time = moment(lastScheduled * 1000).format('DD.MM.YYYY HH:mm')

    return {
      allocated: votePower,
      allocatedVotes: checkNotZoroNumOption(
        _allocatedVotes,
        fb4(_allocatedVotes)
      ),
      remaining: 100 - votePower,
      remainingVotes: checkNotZoroNumOption(
        _remainingVotes,
        fb4(_remainingVotes)
      ),
      veFXNAmount,
      nextEpoch: `Thu ${next_time} am UTC-8`,
    }
  }, [votePower, veFXNAmount])

  const poolVoteInfo = useMemo(() => {
    const info = {}
    try {
      allVoteData.forEach((item) => {
        const _vote = cBN(veFXNAmount)
          .multipliedBy(item.voteInfo.voteSlope.power)
          .dividedBy(10000)
        const lastVoteTime = Number(item.voteInfo.lastVote)
        const _thisWeekEstimateFXNEmissions = getGaugeEstimate(
          item.gaugeType,
          item.lpGaugeAddress,
          'thisWeek'
        )
        const _nextWeekEstimateFXNEmissions = getGaugeEstimate(
          item.gaugeType,
          item.lpGaugeAddress,
          'nextWeek'
        )
        info[item.lpGaugeAddress] = {
          gaugeWeight: item.voteInfo.gaugeWeight,
          lastVoteTime,
          // Cannot change weight votes more often than once in 10 days
          canVote: lastVoteTime + 10 * 86400 <= blockTime,
          canVoteTime: moment((lastVoteTime + 10 * 86400) * 1000).format(
            'YYYY-MM-DD HH:mm:ss'
          ),
          userPower: item.voteInfo.voteSlope.power / 100,
          blockTime,
          userVote: checkNotZoroNumOption(_vote, fb4(_vote)),
          thisWeekEstimateFXNEmissions: _thisWeekEstimateFXNEmissions,
          nextWeekEstimateFXNEmissions: _nextWeekEstimateFXNEmissions,
        }
      })
    } catch (error) {
      return info
    }
    return info
  }, [allVoteData, veFXNAmount])

  console.log('poolVoteInfo---', allVoteData, poolVoteInfo)

  return {
    userVoteInfo,
    poolVoteInfo,
  }
}

export default useVoteController
