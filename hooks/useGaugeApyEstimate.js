import { useCallback, useContext, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useWeb3 from '@/hooks/useWeb3'
import config from '../config'
import { cBN, checkNotZoroNum } from '../utils'
import useGlobal from './useGlobal'

const useGaugeApyEstimate = () => {
  const { tokenPrice } = useSelector((state) => state.token)
  const { _currentAccount, current, web3, isAllReady, blockNumber } = useWeb3()
  const { lpPrice, ConvexVaultsAPY, fx_info, allGaugeBaseInfo } = useGlobal()

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
        const {
          FXNRate,
          total_weight,
          typesWeightDatas = [],
          GaugeList,
        } = allGaugeBaseInfo
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
        const wstETH_rebalancePool_total =
          baseToken.wstETH.data.RebalancePoolRegistryPoolTotalSupplyRes

        const sfrxETH_rebalancePool_total =
          baseToken.sfrxETH.data.RebalancePoolRegistryPoolTotalSupplyRes

        const stETH_rebalancePool_total =
          fx_info.baseInfo.RebalancePoolRegistryPoolTotalSupplyRes
        const { totalSupply } = baseInfo
        const _fxnPrice = getTokenPrice('FXN')
        const _fETHPrice = getTokenPrice('fETH')
        const _fxUSDPrice = tokens.fxUSD?.price // getTokenPrice('fxUSD')
        const _lpPrice = getLpTokenPrice(lpAddress)
        let _tvl = cBN(totalSupply).div(1e18).times(_lpPrice)
        if (
          lpGaugeAddress ==
          config.contracts.FxUSD_ShareableRebalancePool_sfrxETH_FundraiseGauge
        ) {
          _tvl = cBN(_fxUSDPrice).times(sfrxETH_rebalancePool_total).div(1e18)
        } else if (
          lpGaugeAddress ==
          config.contracts.FxUSD_ShareableRebalancePool_wstETH_FundraiseGauge
        ) {
          _tvl = cBN(_fxUSDPrice).times(wstETH_rebalancePool_total).div(1e18)
        } else if (
          lpGaugeAddress ==
          config.contracts.fx_BoostableRebalancePool_APool_FundraiseGauge
        ) {
          _tvl = cBN(_fETHPrice).times(stETH_rebalancePool_total).div(1e18)
        }
        const _times = cBN(config.yearSecond).div(config.weekSecond)
        const _thisWeek_apy = checkNotZoroNum(_tvl)
          ? cBN(_thisWeek_gaugeEstimate)
              .times(_fxnPrice)
              .div(_tvl)
              .times(_times)
              .times(100)
              .toFixed(2)
          : '0'
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
        return { _thisWeek_apy, _nextWeek_apy }
      } catch (error) {
        console.log('getGaugeApy----error', error)
        return { _thisWeek_apy: 0, _nextWeek_apy: 0 }
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
