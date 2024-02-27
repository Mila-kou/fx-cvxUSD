import { useEffect, useState, useContext, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { cBN, checkNotZoroNum, checkNotZoroNumOption, fb4 } from '@/utils/index'
import { useGlobal } from '@/contexts/GlobalProvider'
import useGaugeApyEstimate from '@/hooks/useGaugeApyEstimate'
import useFxCommon from '@/modules/assets/hooks/useFxCommon'
import config from '@/config/index'
import useWeb3 from '@/hooks/useWeb3'

const useStabiltyPool = (infoKey) => {
  const { tokenPrice } = useSelector((state) => state.token)

  const globalState = useGlobal()
  const { getGaugeEstimate, getGaugeApy } = useGaugeApyEstimate()
  const { fx_info, allGaugeBaseInfo } = globalState
  const fxInfo = fx_info
  const boostableRebalancePoolInfo = globalState[infoKey]
  const { GaugeList = [], allPoolsInfo, allPoolsApyInfo } = allGaugeBaseInfo

  const { CurrentNavRes } = fxInfo.baseInfo || {}

  const { current } = useWeb3()
  const { ethPrice, xETHPrice } = useFxCommon()
  console.log('GaugeList----', GaugeList, boostableRebalancePoolInfo)

  const getTokenPrice = useCallback(
    (token) => {
      if (tokenPrice && tokenPrice[token]) {
        return tokenPrice[token].usd
      }
      return 0
    },
    [tokenPrice]
  )
  const {
    rewardData_wstETH_Res,
    rewardData_xETH_Res,
    rewardData_FXN_Res,
    tokensPerStEth,
  } = boostableRebalancePoolInfo?.baseInfo || {}
  const getRebalanceGaugeFXNAPY = useCallback(
    (item) => {
      let fxnApy = 0
      const _rebalanceGauge = GaugeList.find((gaugeObj) =>
        gaugeObj.actionRebalancePool.includes(item.rebalancePoolAddress)
      )

      if (_rebalanceGauge) {
        fxnApy = getGaugeApy(_rebalanceGauge)
      }
      return fxnApy
    },
    [getGaugeApy, GaugeList]
  )
  const getPoolApy_snap = useCallback(
    (rebalanceTvl) => {
      try {
        const { finishAt, rate } = rewardData_wstETH_Res || {}
        let wstETH_apyWei = 0
        const _fxnPrice = getTokenPrice('FXN')
        const _wstETHPrice = getTokenPrice('wstETH')
        const _fxnApy = checkNotZoroNum(rebalanceTvl)
          ? cBN(1000 * _fxnPrice)
              .div(cBN(rebalanceTvl))
              .times(12)
              .times(100)
          : cBN(0)

        // // FXN Project Apy
        // const { _thisWeek_apy } = getRebalanceGaugeFXNAPY(
        //   boostableRebalancePoolInfo.rebalanceConfig
        // )
        // const _fxnApy = cBN(_thisWeek_apy).div(2).toFixed(2)

        const _currentTime = current.unix()

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
        const _apy = wstETH_apyWei.plus(_fxnApy)
        const apy = _apy
        const apy_text = checkNotZoroNumOption(
          _apy,
          `${fb4(_apy, false, 0, 2)}`
        )
        const wstETHApy = wstETH_apyWei
        const wstETHApy_text = checkNotZoroNumOption(
          wstETH_apyWei,
          `${fb4(wstETH_apyWei, false, 0, 2)}`
        )

        const fxnApyV1_text = checkNotZoroNumOption(
          _fxnApy,
          `${fb4(_fxnApy, false, 0, 2)}`
        )

        const _fxnApy_min = _fxnApy * 0.4
        const fxnApy_min_text = fb4(_fxnApy_min, false, 0, 2)
        const fxnApy_max_text = fb4(_fxnApy, false, 0, 2)
        const minApy = wstETH_apyWei.plus(_fxnApy_min)
        const maxApy = wstETH_apyWei.plus(_fxnApy)
        const minApy_text = checkNotZoroNumOption(
          minApy,
          `${fb4(minApy, false, 0, 2)}`
        )
        const maxApy_text = checkNotZoroNumOption(
          maxApy,
          `${fb4(maxApy, false, 0, 2)}`
        )
        let userApy = 0
        let userApy_text = 0
        let boostLever = 0
        let boostLever_text = 0
        let userFxnApy = 0
        let userFxnApy_text = 0
        const { BoostRatioRes } = boostableRebalancePoolInfo?.userInfo
        console.log('BoostRatioRes---', BoostRatioRes)
        if (false) {
          // boostableRebalancePoolInfo
          boostLever = cBN(BoostRatioRes).div(1e18).times(2.5)
          userFxnApy = cBN(_fxnApy_min).times(boostLever)
          userApy = wstETH_apyWei.plus(userFxnApy)
          userApy_text = checkNotZoroNumOption(
            userApy,
            fb4(userApy, false, 0, 2)
          )
          boostLever_text = fb4(boostLever, false, 0, 2)
          userFxnApy_text = fb4(userFxnApy, false, 0, 2)
        }
        console.log('BoostRatioRes---', BoostRatioRes)
        return {
          apy: _apy,
          apy_text,
          wstETHApy,
          wstETHApy_text,
          // xETHApy,
          // xETHApy_text,
          fxnApy: _fxnApy,
          fxnApyV1_text,
          minApy,
          minApy_text,
          maxApy_text,
          fxnApy_min_text,
          fxnApy_max_text,
          userApy,
          userApy_text,
          boostLever,
          boostLever_text,
          userFxnApy_text,
        }
      } catch (error) {
        console.log('apy---', error)
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

      const userRewardTokenClaimable_text = checkNotZoroNumOption(
        _rewardTokenNum,
        fb4(_rewardTokenNum)
      )
      let userRewardTokenClaimableTvl = cBN(0)
      if (
        checkNotZoroNum(_rewardTokenPrice) &&
        checkNotZoroNum(_rewardTokenNum)
      ) {
        userRewardTokenClaimableTvl =
          cBN(_rewardTokenPrice).times(_rewardTokenNum)
      }
      const userRewardTokenClaimableTvl_text = checkNotZoroNumOption(
        userRewardTokenClaimableTvl,
        fb4(userRewardTokenClaimableTvl)
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

      const myTotalValue = userDepositTvl
        .plus(userWstETHClaimableTvl)
        .plus(userXETHClaimableTvl)
        .plus(userFXNClaimableTvl)

      const userTotalClaimable = userWstETHClaimableTvl
        .plus(userXETHClaimableTvl)
        .plus(userFXNClaimableTvl)
        .div(1e18)

      const userTotalClaimableTvl_text = checkNotZoroNumOption(
        userTotalClaimable,
        fb4(userTotalClaimable, true, 0)
      )

      const myTotalValue_text = checkNotZoroNumOption(
        myTotalValue,
        fb4(myTotalValue, false, 0)
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

        myTotalValue_text,
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
        myTotalValue_text: '-',
        userFXNClaimable: '-',
        userFXNClaimableTvl_text: '-',
      }
    }
  }, [boostableRebalancePoolInfo, fxInfo.baseInfo, ethPrice])
  return {
    ...pageData,
  }
}

export default useStabiltyPool
