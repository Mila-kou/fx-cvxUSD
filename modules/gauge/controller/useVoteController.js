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
  const { lpPrice, tokenPrice, ConvexVaultsAPY } = useGlobal()
  const {
    commonVoteData,
    voteInfo: { allVoteData, votePower, veFXNAmount, lastScheduled },
  } = useVoteData()
  const getTokenPrice = useCallback(
    (tokenName) => {
      try {
        const _tokenPrice = tokenPrice[tokenName]
        if (_tokenPrice) {
          return _tokenPrice.usd
        }
        return 0
      } catch (e) {
        return 0
      }
    },
    [tokenPrice]
  )
  const getLpTokenPrice = useCallback(
    (lpAddress) => {
      try {
        const _lpPrice = lpPrice[lpAddress.toLowerCase()]
        if (_lpPrice) {
          return _lpPrice.usd
        }
        return 0
      } catch (e) {
        return 0
      }
    },
    [lpPrice]
  )
  const getGaugeEstimate = useCallback(
    (item) => {
      try {
        const _weekSecond = config.weekSecond
        const { FXNRate, total_weight, typesWeightDatas, typeGaugeList } =
          commonVoteData
        const { gaugeType: typeIndex, lpGaugeAddress } = item
        const { type_weight, weights_sum_per_type } =
          typesWeightDatas[typeIndex]
        const { baseInfo } = typeGaugeList.find(
          (itemObj) =>
            itemObj.lpGaugeAddress.toLowerCase() == lpGaugeAddress.toLowerCase()
        )
        const { this_week_gauge_weight, next_week_gauge_weight } = baseInfo
        const _thisWeek_gaugeEstimate = cBN(FXNRate)
          .div(1e18)
          .times(_weekSecond)
          .times(this_week_gauge_weight)
          .div(1e18)
          .times(type_weight)
          .div(1e18)
          .toFixed(4)
        const _nextWeek_gaugeEstimate = cBN(FXNRate)
          .div(1e18)
          .times(_weekSecond)
          .times(next_week_gauge_weight)
          .div(1e18)
          .times(type_weight)
          .div(1e18)
          .toFixed(4)
        return { _thisWeek_gaugeEstimate, _nextWeek_gaugeEstimate }
      } catch (error) {
        console.log('gaugeEstimate----error--', error)
        return {
          _thisWeek_gaugeEstimate: 0,
          _nextWeek_gaugeEstimate: 0,
        }
      }
    },
    [commonVoteData]
  )

  const getGaugeApy = useCallback(
    (item) => {
      try {
        const { _thisWeek_gaugeEstimate, _nextWeek_gaugeEstimate } =
          getGaugeEstimate(item)
        const { typeGaugeList } = commonVoteData
        const { lpGaugeAddress, lpAddress } = item
        const { baseInfo } = typeGaugeList.find(
          (itemObj) =>
            itemObj.lpGaugeAddress.toLowerCase() == lpGaugeAddress.toLowerCase()
        )
        const { totalSupply } = baseInfo
        const _fxnPrice = getTokenPrice('FXN')
        const _lpPrice = getLpTokenPrice(lpAddress)
        // console.log(
        //   'apy1----totalSupply,_thisWeek_gaugeEstimate,_nextWeek_gaugeEstimate,_fxnPrice--_lpPrice',
        //   totalSupply,
        //   _thisWeek_gaugeEstimate,
        //   _nextWeek_gaugeEstimate,
        //   _fxnPrice,
        //   _lpPrice
        // )
        const _thisWeek_apy = checkNotZoroNum(totalSupply)
          ? cBN(_thisWeek_gaugeEstimate)
              .times(_fxnPrice)
              .div(cBN(totalSupply).div(1e18).times(_lpPrice))
              .toFixed(2)
          : '0'
        const _nextWeek_apy = checkNotZoroNum(totalSupply)
          ? cBN(_nextWeek_gaugeEstimate)
              .times(_fxnPrice)
              .div(cBN(totalSupply).div(1e18).times(_lpPrice))
              .toFixed(2)
          : '0'
        // console.log('apy1----', _thisWeek_apy, _nextWeek_apy)
        return { _thisWeek_apy, _nextWeek_apy }
      } catch (error) {
        // console.log('apy1----error', error)
        return { _thisWeek_apy: 0, _nextWeek_apy: 0 }
      }
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
  }, [allVoteData, veFXNAmount])

  console.log('poolVoteInfo---', allVoteData, poolVoteInfo)

  return {
    userVoteInfo,
    poolVoteInfo,
  }
}

export default useVoteController
