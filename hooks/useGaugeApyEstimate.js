import { useCallback, useContext, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import config from '../config'
import { cBN, checkNotZoroNum } from '../utils'
import useGlobal from './useGlobal'

const useGaugeApyEstimate = () => {
  const { tokenPrice } = useSelector((state) => state.token)
  const { lpPrice, fx_info, allGaugeBaseInfo } = useGlobal()

  const baseToken = useSelector((state) => state.baseToken)
  const { tokens } = useSelector((state) => state.token)
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
        const { FXNRate, typesWeightDatas = [], GaugeList } = allGaugeBaseInfo
        const { gaugeType: typeIndex, lpGaugeAddress } = item

        const { type_weight = 0 } = typesWeightDatas[typeIndex]
        const { baseGaugeControllerInfo } = GaugeList.find(
          (itemObj) =>
            itemObj.lpGaugeAddress.toLowerCase() == lpGaugeAddress.toLowerCase()
        )

        const { this_week_gauge_weight, next_week_gauge_weight } =
          baseGaugeControllerInfo
        const _thisWeek_gaugeEstimate = cBN(FXNRate)
          .div(1e18)
          .times(_weekSecond)
          .times(this_week_gauge_weight)
          .div(1e18)
          .times(type_weight)
          .div(1e18)
          .toFixed(2)
        const _nextWeek_gaugeEstimate = cBN(FXNRate)
          .div(1e18)
          .times(_weekSecond)
          .times(next_week_gauge_weight)
          .div(1e18)
          .times(type_weight)
          .div(1e18)
          .toFixed(2)
        return { _thisWeek_gaugeEstimate, _nextWeek_gaugeEstimate }
      } catch (error) {
        console.log('gaugeEstimate----error--', item.name, error)
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
        const { lpGaugeAddress, lpAddress, baseSymbol, poolType } = item
        const { baseInfo } = GaugeList.find(
          (itemObj) =>
            itemObj.lpGaugeAddress.toLowerCase() == lpGaugeAddress.toLowerCase()
        )

        const stETH_rebalancePool_total =
          fx_info.baseInfo.RebalancePoolRegistryPoolTotalSupplyRes

        const { totalSupply } = baseInfo
        const _fxnPrice = getTokenPrice('FXN')
        const _lpPrice = getLpTokenPrice(lpAddress)
        let _tvl = cBN(totalSupply).div(1e18).times(_lpPrice)

        if (['fxUSD', 'rUSD'].includes(poolType)) {
          const poolTotalSupply =
            baseToken[baseSymbol].data.RebalancePoolRegistryPoolTotalSupplyRes
          const _fPrice = tokens[poolType]?.price
          _tvl = cBN(_fPrice).times(poolTotalSupply).div(1e18)
        } else if (
          lpGaugeAddress ==
          config.contracts.fx_BoostableRebalancePool_APool_FundraiseGauge
        ) {
          const _fETHPrice = getTokenPrice('fETH')
          _tvl = cBN(_fETHPrice).times(stETH_rebalancePool_total).div(1e18)
        }

        const _times = cBN(config.yearSecond).div(config.weekSecond)
        let otherApy = 0
        const _thisWeek_apy = checkNotZoroNum(_tvl)
          ? cBN(_thisWeek_gaugeEstimate)
              .times(_fxnPrice)
              .div(_tvl)
              .times(_times)
              .times(100)
              .toFixed(2)
          : '0'
        if (
          !checkNotZoroNum(_thisWeek_apy) &&
          checkNotZoroNum(_thisWeek_gaugeEstimate)
        ) {
          otherApy = '500%+'
        }
        const _nextWeek_apy = checkNotZoroNum(_tvl)
          ? cBN(_nextWeek_gaugeEstimate)
              .times(_fxnPrice)
              .div(_tvl)
              .times(_times)
              .times(100)
              .toFixed(2)
          : '0'
        // console.log(
        //   'getGaugeApy----',
        //   _thisWeek_gaugeEstimate,
        //   _fxnPrice,
        //   _fETHPrice,
        //   _fxUSDPrice,
        //   sfrxETH_rebalancePool_total,
        //   wstETH_rebalancePool_total,
        //   stETH_rebalancePool_total,
        //   lpGaugeAddress,
        //   _tvl.toFixed(0, 1),
        //   _thisWeek_apy
        // )
        return { _thisWeek_apy, _nextWeek_apy, otherApy }
      } catch (error) {
        console.log('getGaugeApy----error', item.name, error)
        return { _thisWeek_apy: 0, _nextWeek_apy: 0, otherApy: 0 }
      }
    },
    [allGaugeBaseInfo, tokens, baseToken]
  )

  return {
    getGaugeEstimate,
    getGaugeApy,
  }
}

export default useGaugeApyEstimate
