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
  const stabilityPoolInfo = globalState[infoKey]

  const { current } = useWeb3()
  const { ethPrice } = useFxCommon()
  console.log(
    'stabilityPoolInfo---fxInfo--ethPrice--',
    stabilityPoolInfo,
    fxInfo,
    ethPrice
  )
  const { extraRewardState, tokensPerStEth } = stabilityPoolInfo?.baseInfo || {}
  const stETHRate = checkNotZoroNum(tokensPerStEth)
    ? cBN(1).div(cBN(tokensPerStEth).div(1e18)).toFixed(4)
    : 1
  console.log('stETHRate-----', stETHRate)
  const getStabiltyPoolApy = useCallback(
    (stabilityPoolTotalSupplyTvl) => {
      try {
        const { finishAt, rate } = extraRewardState || {}
        let apy = 0

        const _currentTime = current.unix()
        if (_currentTime > finishAt) {
          apy = 0
        } else {
          const apyWei = cBN(rate)
            .div(1e18)
            .multipliedBy(config.yearSecond)
            .multipliedBy(ethPrice)
            .multipliedBy(stETHRate)
            .div(stabilityPoolTotalSupplyTvl)
            .times(100)
          const _apy = apyWei.multipliedBy(1.04)
          apy = checkNotZoroNumOption(_apy, fb4(_apy, false, 0, 2))
        }
        console.log(
          'rate_currentTime--finishAt--config.yearSecond--ethPrice--stETHRate--stabilityPoolTotalSupplyTvl--apy---',
          rate,
          _currentTime,
          finishAt,
          config.yearSecond,
          ethPrice,
          stETHRate,
          stabilityPoolTotalSupplyTvl.toString(),
          apy.toString()
        )
        return apy
      } catch (error) {
        console.log('apy---', error)
        return 0
      }
    },
    [stabilityPoolInfo?.baseInfo]
  )
  const pageData = useMemo(() => {
    try {
      const stabilityPoolTotalSupply_res = cBN(
        stabilityPoolInfo.baseInfo?.stabilityPoolTotalSupplyRes
      )
      const stabilityPoolTotalSupply = checkNotZoroNumOption(
        stabilityPoolTotalSupply_res,
        fb4(stabilityPoolTotalSupply_res)
      )
      let stabilityPoolTotalSupplyTvl = cBN(0)
      if (
        checkNotZoroNum(fxInfo.baseInfo.CurrentNavRes?._fNav) &&
        checkNotZoroNum(stabilityPoolTotalSupply_res)
      ) {
        stabilityPoolTotalSupplyTvl = cBN(fxInfo.baseInfo.CurrentNavRes?._fNav)
          .div(1e18)
          .times(stabilityPoolTotalSupply_res)
          .div(1e18)
      }
      const stabilityPoolTotalSupplyTvl_text = fb4(
        stabilityPoolTotalSupplyTvl,
        false,
        0
      )

      const userDeposit = checkNotZoroNumOption(
        stabilityPoolInfo.userInfo?.stabilityPoolBalanceOfRes,
        fb4(stabilityPoolInfo.userInfo.stabilityPoolBalanceOfRes)
      )
      let userDepositTvl = cBN(0)
      if (
        checkNotZoroNum(fxInfo.baseInfo.CurrentNavRes?._fNav) &&
        checkNotZoroNum(stabilityPoolInfo.userInfo.stabilityPoolBalanceOfRes)
      ) {
        userDepositTvl = cBN(fxInfo.baseInfo.CurrentNavRes?._fNav)
          .div(1e18)
          .times(stabilityPoolInfo.userInfo.stabilityPoolBalanceOfRes)
          .div(1e18)
      }
      const userDepositTvl_text = fb4(userDepositTvl, false, 0)

      const userWstETHClaimable_res = cBN(
        stabilityPoolInfo.userInfo?.claimableRes
      ).times(stETHRate)

      // TODO:
      // userXETHClaimable
      // userXETHClaimableTvl_text
      const userWstETHClaimable = checkNotZoroNumOption(
        userWstETHClaimable_res,
        fb4(userWstETHClaimable_res)
      )
      let userWstETHClaimableTvl = cBN(0)
      if (
        checkNotZoroNum(ethPrice) &&
        checkNotZoroNum(stabilityPoolInfo.userInfo.claimableRes)
      ) {
        userWstETHClaimableTvl = cBN(ethPrice)
          .times(stabilityPoolInfo.userInfo.claimableRes)
          .times(stETHRate)
          .div(1e18)
      }
      const userWstETHClaimableTvl_text = fb4(userWstETHClaimableTvl, false, 0)

      const userUnlockedBalance = checkNotZoroNumOption(
        stabilityPoolInfo.userInfo?.unlockedBalanceOfRes,
        fb4(stabilityPoolInfo.userInfo.unlockedBalanceOfRes)
      )
      let userUnlockedBalanceTvl = cBN(0)
      if (
        checkNotZoroNum(fxInfo.baseInfo.CurrentNavRes?._fNav) &&
        checkNotZoroNum(stabilityPoolInfo.userInfo.unlockedBalanceOfRes)
      ) {
        userUnlockedBalanceTvl = cBN(fxInfo.baseInfo.CurrentNavRes?._fNav)
          .div(1e18)
          .times(stabilityPoolInfo.userInfo.unlockedBalanceOfRes)
          .div(1e18)
      }

      const userUnlockingBalance = checkNotZoroNumOption(
        stabilityPoolInfo.userInfo?.unlockingBalanceOfRes?._balance,
        fb4(stabilityPoolInfo.userInfo.unlockingBalanceOfRes?._balance)
      )
      const userUnlockingUnlockAt = checkNotZoroNumOption(
        stabilityPoolInfo.userInfo?.unlockingBalanceOfRes._unlockAt,
        moment(
          stabilityPoolInfo.userInfo?.unlockingBalanceOfRes._unlockAt * 1000
        ).format('lll')
      )

      let userUnlockingBalanceTvl = cBN(0)
      if (
        checkNotZoroNum(fxInfo.baseInfo.CurrentNavRes?._fNav) &&
        checkNotZoroNum(
          stabilityPoolInfo.userInfo.unlockingBalanceOfRes?._balance
        )
      ) {
        userUnlockingBalanceTvl = cBN(fxInfo.baseInfo.CurrentNavRes?._fNav)
          .div(1e18)
          .times(stabilityPoolInfo.userInfo.unlockingBalanceOfRes?._balance)
          .div(1e18)
      }

      const myTotalValue = userDepositTvl
        .plus(userWstETHClaimableTvl)
        .plus(userUnlockingBalanceTvl)
        .plus(userUnlockedBalanceTvl)
      const myTotalValue_text = checkNotZoroNumOption(
        myTotalValue,
        fb4(myTotalValue, false, 0)
      )

      const apy = getStabiltyPoolApy(stabilityPoolTotalSupplyTvl)
      return {
        stabilityPoolInfo,
        stabilityPoolTotalSupplyTvl: stabilityPoolTotalSupplyTvl.toString(),
        stabilityPoolTotalSupplyTvl_text,
        stabilityPoolTotalSupply_res: stabilityPoolTotalSupply_res.toString(),
        stabilityPoolTotalSupply,
        userDeposit,
        userDepositTvl_text,
        userWstETHClaimable,
        userWstETHClaimableTvl_text,
        myTotalValue_text,
        userUnlockingBalance,
        userUnlockingUnlockAt,
        userUnlockedBalanceTvl,
        userUnlockedBalance,
        apy,
      }
    } catch (error) {
      console.log('error--', error)
      return {
        stabilityPoolInfo: {},
        stabilityPoolTotalSupply_res: 0,
        stabilityPoolTotalSupply: '-',
        stabilityPoolTotalSupplyTvl: 0,
        stabilityPoolTotalSupplyTvl_text: '-',
        userDeposit: '-',
        userDepositTvl_text: '-',
        userWstETHClaimable: '-',
        userWstETHClaimableTvl_text: '-',
        myTotalValue_text: '-',
        userUnlockingBalance: '-',
        userUnlockedBalance: '-',
      }
    }
  }, [stabilityPoolInfo, fxInfo.baseInfo, ethPrice])
  return {
    ...pageData,
  }
}

export default useStabiltyPool
