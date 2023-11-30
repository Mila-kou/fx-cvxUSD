import { useEffect, useState, useContext, useCallback, useMemo } from 'react'
import moment from 'moment'
import { cBN, checkNotZoroNum, checkNotZoroNumOption, fb4 } from '@/utils/index'
import { useGlobal } from '@/contexts/GlobalProvider'
import useWeb3 from '@/hooks/useWeb3'
import useVoteData from '../hooks/useVoteData'
import useGaugeApyEstimate from '@/hooks/useGaugeApyEstimate'

const useVoteController = () => {
  const { currentAccount, isAllReady, blockTime } = useWeb3()
  // const { allGaugeBaseInfo } = useGlobal()
  const {
    voteInfo: { allVoteData, votePower, veFXNAmount, lastScheduled },
  } = useVoteData()

  const { getGaugeEstimate, getGaugeApy } = useGaugeApyEstimate()

  // console.log('commonVoteData-----2', allGaugeBaseInfo)
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
        const { _thisWeek_gaugeEstimate, _nextWeek_gaugeEstimate } =
          getGaugeEstimate(item)
        const gaugeApy = getGaugeApy(item)
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
          thisWeekEstimateFXNEmissions: _thisWeek_gaugeEstimate,
          nextWeekEstimateFXNEmissions: _nextWeek_gaugeEstimate,
          gaugeApy,
        }
      })
    } catch (error) {
      return info
    }
    return info
  }, [allVoteData, veFXNAmount, getGaugeEstimate, getGaugeApy])

  console.log('poolVoteInfo---', allVoteData, poolVoteInfo)

  return {
    userVoteInfo,
    poolVoteInfo,
  }
}

export default useVoteController
