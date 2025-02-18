import { useEffect, useState, useContext, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  cBN,
  checkNotZoroNum,
  checkNotZoroNumOption,
  fb4,
  numberLess,
} from '@/utils/index'
import { useGlobal } from '@/contexts/GlobalProvider'
import useGaugeApyEstimate from '@/hooks/useGaugeApyEstimate'
import useFxCommon from '@/modules/assets/hooks/useFxCommon'
import useBoostableRebalancePoolData from '../hooks/useBoostableRebalancePoolData'
import config from '@/config/index'
import useWeb3 from '@/hooks/useWeb3'

const useRebalancePool = (infoKey) => {
  const { tokenPrice } = useSelector((state) => state.token)

  const globalState = useGlobal()
  const { getGaugeEstimate, getGaugeApy } = useGaugeApyEstimate()
  const { fx_info, allGaugeBaseInfo } = globalState
  const fxInfo = fx_info
  const boostableRebalancePoolInfo = useBoostableRebalancePoolData(infoKey)
  const { GaugeList = [] } = allGaugeBaseInfo

  const { CurrentNavRes } = fxInfo.baseInfo || {}

  const { current } = useWeb3()
  const { ethPrice } = useFxCommon()

  const getTokenPrice = useCallback(
    (token) => {
      if (tokenPrice && tokenPrice[token]) {
        return tokenPrice[token].usd
      }
      return 0
    },
    [tokenPrice]
  )
  const { rewardData_wstETH_Res, rewardData_FXN_Res } =
    boostableRebalancePoolInfo?.baseInfo || {}
  const getRebalanceGaugeFXNAPY = useCallback(
    (item) => {
      let fxnGaugeEstimate = {}
      const _rebalanceGauge = GaugeList.find((gaugeObj) =>
        gaugeObj.actionRebalancePool.includes(item.rebalancePoolAddress)
      )

      if (_rebalanceGauge) {
        fxnGaugeEstimate = getGaugeEstimate(_rebalanceGauge)
      }
      return fxnGaugeEstimate
    },
    [getGaugeApy, GaugeList]
  )
  const getPoolApy_snap = useCallback(
    (rebalanceTvl) => {
      try {
        const { finishAt, rate } = rewardData_wstETH_Res || {}
        const { finishAt: finishAt_fxn, rate: rate_fxn } =
          rewardData_FXN_Res || {}
        let wstETH_apyWei = 0
        const _fxnPrice = getTokenPrice('FXN')
        const _wstETHPrice = getTokenPrice('wstETH')
        // FXN Project Apy
        const { _thisWeek_gaugeEstimate, _nextWeek_gaugeEstimate } =
          getRebalanceGaugeFXNAPY(boostableRebalancePoolInfo.rebalanceConfig)
        const _fxnGaugeEstimate = cBN(_nextWeek_gaugeEstimate).div(2).toFixed(2) // change to _nextWeek_gaugeEstimate
        let _fxnCurrentApy = 0
        const _fxnApy = cBN(_fxnGaugeEstimate)
          .multipliedBy(config.yearSecond)
          .multipliedBy(_fxnPrice)
          .div(config.weekSecond)
          .div(rebalanceTvl)
          .times(100)
          .toFixed(2)
        const _currentTime = current.unix()

        // FXN Current Apy
        if (_currentTime > finishAt_fxn) {
          _fxnCurrentApy = cBN(0)
        } else {
          _fxnCurrentApy = cBN(rate_fxn)
            .div(1e18)
            .multipliedBy(config.yearSecond)
            .multipliedBy(_fxnPrice)
            .div(rebalanceTvl)
            .times(100)
        }

        // wstETH apy
        if (_currentTime > finishAt) {
          wstETH_apyWei = cBN(0)
        } else {
          wstETH_apyWei = cBN(rate)
            .div(1e18)
            .multipliedBy(config.yearSecond)
            .multipliedBy(_wstETHPrice)
            .div(rebalanceTvl)
            .times(100)
        }
        const wstETHApy_text = checkNotZoroNumOption(
          wstETH_apyWei,
          `${fb4(wstETH_apyWei, false, 0, 2)} %`
        )

        const fxnApyV1_text = checkNotZoroNumOption(
          _fxnApy,
          `${fb4(_fxnApy, false, 0, 2)} %`
        )

        const _fxnApy_min = _fxnApy * 0.4
        const _fxnApy_current_min = _fxnCurrentApy * 0.4
        const fxnApy_min_text = fb4(_fxnApy_min, false, 0, 2)
        const fxnApy_current_min_text = fb4(_fxnApy_current_min, false, 0, 2)
        const fxnApy_max_text = fb4(_fxnApy, false, 0, 2)
        const fxnApy_current_max_text = fb4(_fxnCurrentApy, false, 0, 2)
        const minApy = wstETH_apyWei.plus(_fxnApy_min)
        const min_current_Apy = wstETH_apyWei.plus(_fxnApy_current_min)
        const maxApy = wstETH_apyWei.plus(_fxnApy)
        const max_current_Apy = wstETH_apyWei.plus(_fxnCurrentApy)
        const minApy_text = checkNotZoroNumOption(
          minApy,
          `${fb4(minApy, false, 0, 2)}`
        )
        const min_current_Apy_text = checkNotZoroNumOption(
          min_current_Apy,
          `${fb4(min_current_Apy, false, 0, 2)}`
        )
        const maxApy_text = checkNotZoroNumOption(
          maxApy,
          `${fb4(maxApy, false, 0, 2)}`
        )
        const max_current_Apy_text = checkNotZoroNumOption(
          max_current_Apy,
          `${fb4(max_current_Apy, false, 0, 2)}`
        )
        let userApy = 0
        let user_current_Apy = 0
        let user_current_Apy_text = 0
        let boostLever = 0
        let boostLever_text = 0
        let userFxnApy = 0
        let userFxn_current_Apy = 0
        let userFxnApy_text = 0
        let userFxn_current_Apy_text = 0
        const { BoostRatioRes } = boostableRebalancePoolInfo?.userInfo
        if (checkNotZoroNum(BoostRatioRes)) {
          // boostableRebalancePoolInfo
          boostLever = cBN(BoostRatioRes).div(1e18).times(2.5)
          if (cBN(boostLever).gt(1)) {
            userFxnApy = cBN(_fxnApy_min).times(boostLever)
            userFxn_current_Apy = cBN(_fxnApy_current_min).times(boostLever)
            userApy = wstETH_apyWei.plus(userFxnApy)
            user_current_Apy = wstETH_apyWei.plus(userFxn_current_Apy)
            user_current_Apy_text = checkNotZoroNumOption(
              user_current_Apy,
              fb4(user_current_Apy, false, 0, 2)
            )
            boostLever_text = fb4(boostLever, false, 0, 2)
            userFxnApy_text = fb4(userFxnApy, false, 0, 2)
            userFxn_current_Apy_text = fb4(userFxn_current_Apy, false, 0, 2)
          }
        }
        return {
          wstETHApy_text,
          fxnApyV1_text,
          minApy,
          minCurrentApy: min_current_Apy,
          minApy_text,
          minCurrentApy_text: min_current_Apy_text,
          maxApy_text,
          maxCurrentApy: max_current_Apy,
          maxCurrentApy_text: max_current_Apy_text,
          fxnApy_min_text,
          fxnApy_current_min_text,
          fxnApy_max_text,
          fxnApy_current_max_text,
          userApy,
          userCurrentApy_text: user_current_Apy_text,
          boostLever,
          boostLever_text,
          userFxnApy_text,
          userFxnCurrentApy_text: userFxn_current_Apy_text,
        }
      } catch (error) {
        console.log('apyObj------error--', error)
        return 0
      }
    },
    [boostableRebalancePoolInfo?.baseInfo]
  )
  const getRewarItem = useCallback(
    (RebalanceUserInfo, rewardName) => {
      let _rewardTokenNum = 0
      const _fNav = CurrentNavRes?._fNav || 0
      const _xNav = CurrentNavRes?._xNav || 0
      const _wstETHPrice = getTokenPrice('wstETH')
      // const _sfrxETHPrice = getTokenPrice('sfrxETH')
      // const _xstETHPrice = getTokenPrice('xstETH')
      // const _xfrxETHPrice = getTokenPrice('xfrxETH')
      const _fxnPrice = getTokenPrice('FXN')

      let _rewardTokenPrice = _wstETHPrice
      if (rewardName == 'wstETH') {
        _rewardTokenNum = RebalanceUserInfo.claimableWstETHRes
        _rewardTokenPrice = _wstETHPrice
      } else if (rewardName == 'xETH') {
        _rewardTokenNum = RebalanceUserInfo.claimableXETHRes
        _rewardTokenPrice = cBN(_xNav).div(1e18)
      } else if (rewardName == 'FXN') {
        _rewardTokenNum = RebalanceUserInfo.claimableFXNRes
        _rewardTokenPrice = _fxnPrice
      }

      const userRewardTokenClaimable_text = numberLess(
        checkNotZoroNumOption(_rewardTokenNum, fb4(_rewardTokenNum)),
        0.01
      )
      let userRewardTokenClaimableTvl = cBN(0)
      if (
        checkNotZoroNum(_rewardTokenPrice) &&
        checkNotZoroNum(_rewardTokenNum)
      ) {
        userRewardTokenClaimableTvl =
          cBN(_rewardTokenPrice).times(_rewardTokenNum)
      }
      const userRewardTokenClaimableTvl_text = numberLess(
        checkNotZoroNumOption(
          userRewardTokenClaimableTvl,
          fb4(userRewardTokenClaimableTvl)
        ),
        0.01
      )
      return {
        userRewardTokenClaimableRes: _rewardTokenNum,
        userRewardTokenClaimable_text,
        userRewardTokenClaimableTvl,
        userRewardTokenClaimableTvl_text,
      }
    },
    [boostableRebalancePoolInfo, CurrentNavRes]
  )
  const pageData = useMemo(() => {
    const { baseInfo = {}, userInfo = {} } = boostableRebalancePoolInfo
    const _fNav = CurrentNavRes?._fNav || 0
    const _xNav = CurrentNavRes?._xNav || 0
    const _wstETHPrice = getTokenPrice('wstETH')
    try {
      const poolTotalSupply_res = cBN(
        baseInfo.BoostableRebalancePoolTotalSupplyRes
      )
      const poolTotalSupply = checkNotZoroNumOption(
        poolTotalSupply_res,
        fb4(poolTotalSupply_res)
      )
      let poolTotalSupplyTvl = cBN(0)
      if (checkNotZoroNum(_fNav) && checkNotZoroNum(poolTotalSupply_res)) {
        poolTotalSupplyTvl = cBN(_fNav)
          .div(1e18)
          .times(poolTotalSupply_res)
          .div(1e18)
      }
      const poolTotalSupplyTvl_text = fb4(poolTotalSupplyTvl, true, 0)

      const userDeposit = checkNotZoroNumOption(
        userInfo?.BoostableRebalancePoolBalanceOfRes,
        fb4(userInfo.BoostableRebalancePoolBalanceOfRes)
      )
      let userDepositTvl = cBN(0)
      if (
        checkNotZoroNum(_fNav) &&
        checkNotZoroNum(userInfo.BoostableRebalancePoolBalanceOfRes)
      ) {
        userDepositTvl = cBN(_fNav)
          .div(1e18)
          .times(userInfo.BoostableRebalancePoolBalanceOfRes)
          .div(1e18)
      }
      const userDepositTvl_text = fb4(userDepositTvl, true, 0)

      // stETH
      // stETH
      const {
        userRewardTokenClaimable_text: userWstETHClaimable_text,
        userRewardTokenClaimableTvl: userWstETHClaimableTvl,
        userRewardTokenClaimableTvl_text: userWstETHClaimableTvl_text,
      } = getRewarItem(userInfo, 'wstETH')

      // xETH
      const {
        userRewardTokenClaimable_text: userXETHClaimable_text,
        userRewardTokenClaimableTvl: userXETHClaimableTvl,
        userRewardTokenClaimableTvl_text: userXETHClaimableTvl_text,
      } = getRewarItem(userInfo, 'xETH')

      // FXN
      const {
        userRewardTokenClaimable_text: userFXNClaimable_text,
        userRewardTokenClaimableTvl: userFXNClaimableTvl,
        userRewardTokenClaimableTvl_text: userFXNClaimableTvl_text,
      } = getRewarItem(userInfo, 'FXN')

      const userTotalClaimable = userWstETHClaimableTvl
        .plus(userXETHClaimableTvl)
        .plus(userFXNClaimableTvl)
        .div(1e18)

      const userTotalClaimableTvl_text = checkNotZoroNumOption(
        userTotalClaimable,
        fb4(userTotalClaimable, true, 0)
      )

      const apyObj = getPoolApy_snap(poolTotalSupplyTvl)
      return {
        boostableRebalancePoolInfo,
        poolTotalSupplyTvl: poolTotalSupplyTvl.toString(),
        poolTotalSupplyTvl_text,
        poolTotalSupply_res: poolTotalSupply_res.toString(),
        poolTotalSupply,
        userDeposit,
        userDepositTvl_text,

        userWstETHClaimable_text,
        userWstETHClaimableTvl_text,
        userXETHClaimable_text,
        userXETHClaimableTvl_text,
        userFXNClaimable_text,
        userFXNClaimableTvl_text,

        userTotalClaimable,
        userTotalClaimableTvl_text,
        apyObj,
      }
    } catch (error) {
      console.log('error--', error)
      return {
        boostableRebalancePoolInfo: {},
        poolTotalSupply_res: 0,
        poolTotalSupply: '-',
        poolTotalSupplyTvl: 0,
        poolTotalSupplyTvl_text: '-',
        userDeposit: '-',
        userDepositTvl_text: '-',
        userWstETHClaimable: '-',
        userWstETHClaimable_text: '-',
        userWstETHClaimableTvl_text: '-',
        userXETHClaimable: '-',
        userXETHClaimableTvl_text: '-',
        userFXNClaimable: '-',
        userFXNClaimableTvl_text: '-',
      }
    }
  }, [boostableRebalancePoolInfo, fxInfo.baseInfo, ethPrice])
  return {
    ...pageData,
  }
}

export default useRebalancePool
