import { useCallback, useContext, useEffect } from 'react'
import useWeb3 from '@/hooks/useWeb3'
import config from '../config'
import { cBN, checkNotZoroNum } from '../utils'
import useGlobal from './useGlobal'

const useGaugeApyEstimate = () => {
  const { _currentAccount, current, web3, isAllReady, blockNumber } = useWeb3()
  const { lpPrice, tokenPrice, ConvexVaultsAPY, allGaugeBaseInfo } = useGlobal()

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
        const { FXNRate, total_weight, typesWeightDatas, GaugeList } =
          allGaugeBaseInfo
        const { gaugeType: typeIndex, lpGaugeAddress } = item
        const { type_weight, weights_sum_per_type } =
          typesWeightDatas[typeIndex]
        const { baseInfo, baseGaugeControllerInfo } = GaugeList.find(
          (itemObj) =>
            itemObj.lpGaugeAddress.toLowerCase() == lpGaugeAddress.toLowerCase()
        )
        console.log('gaugeEstimate----3--', baseInfo)
        const { this_week_gauge_weight, next_week_gauge_weight } =
          baseGaugeControllerInfo
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
    [allGaugeBaseInfo]
  )

  const getGaugeApy = useCallback(
    (item) => {
      try {
        const { _thisWeek_gaugeEstimate, _nextWeek_gaugeEstimate } =
          getGaugeEstimate(item)
        const { GaugeList } = allGaugeBaseInfo
        const { lpGaugeAddress, lpAddress } = item
        const { baseInfo } = GaugeList.find(
          (itemObj) =>
            itemObj.lpGaugeAddress.toLowerCase() == lpGaugeAddress.toLowerCase()
        )
        console.log(
          'getGaugeApy--getGaugeEstimate-----',
          allGaugeBaseInfo,
          GaugeList,
          item,
          baseInfo
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
              .times(100)
              .toFixed(2)
          : '0'
        const _nextWeek_apy = checkNotZoroNum(totalSupply)
          ? cBN(_nextWeek_gaugeEstimate)
              .times(_fxnPrice)
              .div(cBN(totalSupply).div(1e18).times(_lpPrice))
              .times(100)
              .toFixed(2)
          : '0'
        console.log('getGaugeApy----', _thisWeek_apy, _nextWeek_apy)
        return { _thisWeek_apy, _nextWeek_apy }
      } catch (error) {
        console.log('getGaugeApy----error', error)
        return { _thisWeek_apy: 0, _nextWeek_apy: 0 }
      }
    },
    [allGaugeBaseInfo]
  )

  return {
    getGaugeEstimate,
    getGaugeApy,
  }
}

export default useGaugeApyEstimate
