import { useEffect, useState, useContext, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  cBN,
  checkNotZoroNum,
  checkNotZoroNumOption,
  fb4,
  numberLess,
} from '@/utils/index'
import config from '@/config/index'
import useWeb3 from '@/hooks/useWeb3'
import useBoostableRebalancePoolDataV2 from '../hooks/useBoostableRebalancePoolDataV2'
import useGaugeApyEstimate from '@/hooks/useGaugeApyEstimate'
import { useGlobal } from '@/contexts/GlobalProvider'

const useRebalancePoolV2 = (infoKey, baseToken) => {
  const { tokens } = useSelector((state) => state.token)
  const { allGaugeBaseInfo } = useGlobal()
  const boostableRebalancePoolInfo = useBoostableRebalancePoolDataV2(infoKey)
  const { getGaugeEstimate } = useGaugeApyEstimate()
  const { GaugeList = [] } = allGaugeBaseInfo
  const { fNav = 0 } = baseToken?.data || {}

  const { current } = useWeb3()

  const getTokenPrice = useCallback(
    (token) => {
      if (tokens && tokens[token]) {
        return tokens[token].price
      }
      return 0
    },
    [tokens]
  )

  const {
    baseInfo = {},
    userInfo = {},
    rebalanceConfig,
  } = boostableRebalancePoolInfo

  const { rewardsRes = [] } = baseInfo

  const getRebalanceGaugeFXNAPY = useCallback(
    (item) => {
      try {
        let fxnGaugeEstimate = {}
        const _rebalanceGauge = GaugeList.find((gaugeObj) =>
          gaugeObj.actionRebalancePool.includes(item.rebalancePoolAddress)
        )

        if (_rebalanceGauge) {
          fxnGaugeEstimate = getGaugeEstimate(_rebalanceGauge)
        }
        return fxnGaugeEstimate
      } catch (error) {
        return { _thisWeek_gaugeEstimate: 0 }
      }
    },
    [getGaugeEstimate, GaugeList]
  )

  const getPoolApy_snap = useCallback(
    (rebalanceTvl, baseSymbol) => {
      try {
        if (!rewardsRes.length) return {}

        const _currentTime = current.unix()

        const rewardsData = {}

        rewardsRes.forEach(({ symbol, reward }) => {
          const { finishAt, rate } = reward

          const _price = getTokenPrice(symbol)

          let currentApy = cBN(0)
          if (_currentTime < finishAt) {
            currentApy = cBN(rate)
              .multipliedBy(config.yearSecond)
              .multipliedBy(_price)
              .div(rebalanceTvl)
              .div(10 ** (config.TOKENS_INFO?.[symbol]?.[2] || 18))
              .times(100)
          }

          const currentApy_text = checkNotZoroNumOption(
            currentApy,
            `${fb4(currentApy, false, 0, 2)} %`
          )

          rewardsData[symbol] = {
            currentApy,
            currentApy_text,
          }
        })

        let _fxnApy = 0
        const _fxnPrice = getTokenPrice('FXN')

        // FXN Project Apy
        const { _thisWeek_gaugeEstimate, _nextWeek_gaugeEstimate } =
          getRebalanceGaugeFXNAPY(rebalanceConfig)

        const _fxnCurrentApy = rewardsData.FXN?.currentApy
        const fxnCurrentApy_text = rewardsData.FXN.currentApy_text

        const _fxnGaugeEstimate = cBN(_nextWeek_gaugeEstimate).div(2).toFixed(2) // change to _nextWeek_gaugeEstimate

        _fxnApy = cBN(_fxnGaugeEstimate)
          .multipliedBy(config.yearSecond)
          .multipliedBy(_fxnPrice)
          .div(config.weekSecond)
          .div(rebalanceTvl)
          .times(100)
          .toFixed(2)

        const _fxnApy_min = _fxnApy * 0.4
        const _fxnApy_current_min = _fxnCurrentApy * 0.4
        const fxnApy_min_text = fb4(_fxnApy_min, false, 0, 2)
        const fxnApy_current_min_text = fb4(_fxnApy_current_min, false, 0, 2)
        const fxnApy_max_text = fb4(_fxnApy, false, 0, 2)
        const fxnApy_current_max_text = fb4(_fxnCurrentApy, false, 0, 2)

        const baseApy = rewardsData[baseSymbol].currentApy

        const minApy = baseApy.plus(_fxnApy_min)
        const min_current_Apy = baseApy.plus(_fxnApy_current_min)

        const maxApy = baseApy.plus(_fxnApy)
        const max_current_Apy = baseApy.plus(_fxnCurrentApy)

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

        if (checkNotZoroNum(userInfo?.BoostRatioRes)) {
          boostLever = cBN(userInfo.BoostRatioRes).div(1e18).times(2.5)
          if (cBN(boostLever).gt(1)) {
            userFxnApy = cBN(_fxnApy_min).times(boostLever)
            userFxn_current_Apy = cBN(_fxnApy_current_min).times(boostLever)
            userApy = baseApy.plus(userFxnApy)
            user_current_Apy = baseApy.plus(userFxn_current_Apy)

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
          rewardsData,

          fxnCurrentApy_text,

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
        console.log('apy---', error)
        return {}
      }
    },
    [
      rebalanceConfig,
      rewardsRes,
      userInfo?.BoostRatioRes,
      getRebalanceGaugeFXNAPY,
    ]
  )

  const pageData = useMemo(() => {
    try {
      const poolTotalSupply_res = cBN(
        baseInfo.BoostableRebalancePoolTotalSupplyRes
      )
      const poolTotalSupply = checkNotZoroNumOption(
        poolTotalSupply_res,
        fb4(poolTotalSupply_res)
      )
      let poolTotalSupplyTvl = cBN(0)
      if (checkNotZoroNum(fNav) && checkNotZoroNum(poolTotalSupply_res)) {
        poolTotalSupplyTvl = cBN(fNav)
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
        checkNotZoroNum(fNav) &&
        checkNotZoroNum(userInfo.BoostableRebalancePoolBalanceOfRes)
      ) {
        userDepositTvl = cBN(fNav)
          .div(1e18)
          .times(userInfo.BoostableRebalancePoolBalanceOfRes)
          .div(1e18)
      }
      const userDepositTvl_text = fb4(userDepositTvl, true, 0)

      const { claimableRes = [] } = userInfo

      let myTotalValue = userDepositTvl
      let userTotalClaimable = cBN(0)

      const claimableData = {}
      claimableRes.forEach(({ symbol, reward }) => {
        const _price = getTokenPrice(symbol)
        const decimals = config.TOKENS_INFO?.[symbol]?.[2] || 18

        const claimable_text = numberLess(
          checkNotZoroNumOption(reward, fb4(reward, false, decimals)),
          0.01
        )
        let tvl = cBN(0)
        if (checkNotZoroNum(_price) && checkNotZoroNum(reward)) {
          tvl = cBN(_price)
            .times(reward)
            .dividedBy(10 ** decimals)
        }
        const tvl_text = numberLess(
          checkNotZoroNumOption(tvl, fb4(tvl, false, 0)),
          0.01
        )

        // console.log(
        //   'claimable_text-----',
        //   symbol,
        //   _price,
        //   claimable_text,
        //   tvl_text
        // )

        myTotalValue = myTotalValue.plus(tvl)

        userTotalClaimable = userTotalClaimable.plus(tvl)

        claimableData[symbol] = {
          claimable_text,
          tvl,
          tvl_text,
        }
      })

      const userTotalClaimableTvl_text = checkNotZoroNumOption(
        userTotalClaimable,
        fb4(userTotalClaimable, true, 0)
      )

      const apyObj = getPoolApy_snap(
        poolTotalSupplyTvl,
        boostableRebalancePoolInfo.rebalanceConfig.baseSymbol
      )
      return {
        boostableRebalancePoolInfo,
        poolTotalSupplyTvl: poolTotalSupplyTvl.toString(),
        poolTotalSupplyTvl_text,
        poolTotalSupply_res: poolTotalSupply_res.toString(),
        poolTotalSupply,
        userDeposit,
        userDepositTvl_text,

        claimableData,

        userTotalClaimable,
        userTotalClaimableTvl_text,
        apyObj,
      }
    } catch (error) {
      console.log('error--', error)
      return {
        claimableData: {},

        boostableRebalancePoolInfo: {},
        poolTotalSupply_res: 0,
        poolTotalSupply: '-',
        poolTotalSupplyTvl: 0,
        poolTotalSupplyTvl_text: '-',
        userDeposit: '-',
        userDepositTvl_text: '-',
      }
    }
  }, [boostableRebalancePoolInfo])
  return {
    ...pageData,
  }
}

export default useRebalancePoolV2
