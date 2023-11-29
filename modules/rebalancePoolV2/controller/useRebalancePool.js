import { useEffect, useState, useContext, useCallback, useMemo } from 'react'
import moment from 'moment'
import { cBN, checkNotZoroNum, checkNotZoroNumOption, fb4 } from '@/utils/index'
import { useGlobal } from '@/contexts/GlobalProvider'
import useFxCommon from '@/modules/home/hooks/useFxCommon'
import config from '@/config/index'
import useWeb3 from '@/hooks/useWeb3'

const useStabiltyPool = (infoKey) => {
  const globalState = useGlobal()
  const fxInfo = globalState.fx_info
  const boostableRebalancePoolInfo = globalState[infoKey]

  const { CurrentNavRes } = fxInfo.baseInfo || {}

  const { current } = useWeb3()
  const { ethPrice } = useFxCommon()

  console.log(
    'boostableRebalancePoolInfo-----',
    boostableRebalancePoolInfo
    // fxInfo,
    // ethPrice
  )
  const { extraRewardState, tokensPerStEth } =
    boostableRebalancePoolInfo?.baseInfo || {}
  const stETHRate = checkNotZoroNum(tokensPerStEth)
    ? cBN(1).div(cBN(tokensPerStEth).div(1e18)).toFixed(4)
    : 1
  console.log('stETHRate-----', stETHRate)

  // const getPoolApy = useCallback(
  //   (PoolTotalSupplyTvl) => {
  //     try {
  //       const { finishAt, rate } = extraRewardState || {}
  //       let apy = 0

  //       const _currentTime = current.unix()
  //       if (_currentTime > finishAt) {
  //         apy = 0
  //       } else {
  //         const apyWei = cBN(rate)
  //           .div(1e18)
  //           .multipliedBy(config.yearSecond)
  //           .multipliedBy(ethPrice)
  //           .multipliedBy(stETHRate)
  //           .div(PoolTotalSupplyTvl)
  //           .times(100)
  //         const _apy = apyWei.multipliedBy(1.04)
  //         apy = checkNotZoroNumOption(_apy, fb4(_apy, false, 0, 2))
  //       }
  //       console.log(
  //         'rate_currentTime--finishAt--config.yearSecond--ethPrice--stETHRate--poolTotalSupplyTvl--apy---',
  //         rate,
  //         _currentTime,
  //         finishAt,
  //         config.yearSecond,
  //         ethPrice,
  //         stETHRate,
  //         PoolTotalSupplyTvl.toString(),
  //         apy.toString()
  //       )
  //       return apy
  //     } catch (error) {
  //       console.log('apy---', error)
  //       return 0
  //     }
  //   },
  //   [boostableRebalancePoolInfo?.baseInfo]
  // )

  const pageData = useMemo(() => {
    const { baseInfo = {}, userInfo = {} } = boostableRebalancePoolInfo
    const _fNav = CurrentNavRes?._fNav || 0
    const _xNav = CurrentNavRes?._xNav || 0
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
      const poolTotalSupplyTvl_text = fb4(poolTotalSupplyTvl, false, 0)

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
      const userDepositTvl_text = fb4(userDepositTvl, false, 0)

      // stETH
      const userWstETHClaimable_res = cBN(userInfo?.claimableWstETHRes).times(
        stETHRate
      )

      const userWstETHClaimable = checkNotZoroNumOption(
        userWstETHClaimable_res,
        fb4(userWstETHClaimable_res)
      )
      console.log(
        'userWstETHClaimable-----',
        stETHRate,
        userWstETHClaimable_res,
        userInfo?.claimableWstETHRes
      )
      let userWstETHClaimableTvl = cBN(0)
      if (
        checkNotZoroNum(ethPrice) &&
        checkNotZoroNum(userInfo.claimableWstETHRes)
      ) {
        userWstETHClaimableTvl = cBN(ethPrice)
          .times(userInfo.claimableRes)
          .times(stETHRate)
          .div(1e18)
      }
      const userWstETHClaimableTvl_text = fb4(userWstETHClaimableTvl, false, 0)

      // xETH
      const userXETHClaimable_res = cBN(userInfo?.claimableXETHRes)

      const userXETHClaimable = checkNotZoroNumOption(
        userXETHClaimable_res,
        fb4(userXETHClaimable_res)
      )
      let userXETHClaimableTvl = cBN(0)
      if (
        checkNotZoroNum(_xNav) &&
        checkNotZoroNum(userInfo.claimableXETHRes)
      ) {
        userXETHClaimableTvl = cBN(_xNav)
          .div(1e18)
          .times(userInfo.claimableXETHRes)
          .div(1e18)
      }
      const userXETHClaimableTvl_text = fb4(userXETHClaimableTvl, false, 0)

      // FXN
      const userFXNClaimable_res = cBN(userInfo?.claimableFXNRes)

      const userFXNClaimable = checkNotZoroNumOption(
        userFXNClaimable_res,
        fb4(userFXNClaimable_res)
      )
      let userFXNClaimableTvl = cBN(0)
      if (checkNotZoroNum(_xNav) && checkNotZoroNum(userInfo.claimableFXNRes)) {
        userFXNClaimableTvl = cBN(_xNav)
          .div(1e18)
          .times(userInfo.claimableFXNRes)
          .div(1e18)
      }
      const userFXNClaimableTvl_text = fb4(userFXNClaimableTvl, false, 0)

      const myTotalValue = userDepositTvl
        .plus(userWstETHClaimableTvl)
        .plus(userXETHClaimableTvl)
        .plus(userFXNClaimableTvl)

      const myTotalValue_text = checkNotZoroNumOption(
        myTotalValue,
        fb4(myTotalValue, false, 0)
      )

      const apy = 1 // getPoolApy(poolTotalSupplyTvl)
      return {
        boostableRebalancePoolInfo,
        poolTotalSupplyTvl: poolTotalSupplyTvl.toString(),
        poolTotalSupplyTvl_text,
        poolTotalSupply_res: poolTotalSupply_res.toString(),
        poolTotalSupply,
        userDeposit,
        userDepositTvl_text,
        userWstETHClaimable,
        userWstETHClaimableTvl_text,
        userXETHClaimable,
        userXETHClaimableTvl_text,
        myTotalValue_text,
        userFXNClaimable,
        userFXNClaimableTvl_text,
        apy,
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
