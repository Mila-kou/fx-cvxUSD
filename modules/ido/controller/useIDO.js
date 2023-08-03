import { useEffect, useState, useContext, useCallback, useMemo } from 'react'
import useInfo from '../hooks/useInfo'
import { checkNotZoroNum, checkNotZoroNumOption, fb4 } from '@/utils/index'

const useIDO = () => {
  const IDOInfo = useInfo()
  const pageData = useMemo(() => {
    const { info = {}, IdoSaleContract } = IDOInfo
    const { baseInfo, userInfo } = info
    const _currentPrice = checkNotZoroNumOption(
      baseInfo.currentPrice,
      fb4(baseInfo.currentPrice)
    )
    const _capAmount = checkNotZoroNumOption(
      baseInfo.capAmount,
      fb4(baseInfo.capAmount)
    )
    const _totalFundsRaised = checkNotZoroNumOption(
      baseInfo.totalFundsRaised,
      fb4(baseInfo.totalFundsRaised)
    )
    const _totalSoldAmount = checkNotZoroNumOption(
      baseInfo.totalSoldAmount,
      fb4(baseInfo.totalSoldAmount)
    )

    const _currentPrice_round1 = checkNotZoroNumOption(
      baseInfo.currentPrice_round1,
      fb4(baseInfo.currentPrice_round1)
    )
    const _capAmount_round1 = checkNotZoroNumOption(
      baseInfo.capAmount_round1,
      fb4(baseInfo.capAmount_round1)
    )
    const _totalSoldAmount_round1 = checkNotZoroNumOption(
      baseInfo.totalSoldAmount_round1,
      fb4(baseInfo.totalSoldAmount_round1)
    )
    const _totalFundsRaised_round1 = checkNotZoroNumOption(
      baseInfo.totalFundsRaised_round1,
      fb4(baseInfo.totalFundsRaised_round1)
    )
    const _saleStatus = baseInfo?.timeObj?.saleStatus
    const _countdown = baseInfo?.timeObj?.countdown || 0
    const _countdownTitle = baseInfo?.timeObj?.title || ''

    const _myShares = checkNotZoroNumOption(
      userInfo.myShares,
      fb4(userInfo.myShares)
    )
    const _myShares_round1 = checkNotZoroNumOption(
      userInfo.myShares_round1,
      fb4(userInfo.myShares_round1)
    )
    return {
      ...info,
      IdoSaleContract,
      currentPrice: _currentPrice,
      capAmount: _capAmount,
      totalFundsRaised: _totalFundsRaised,
      totalSoldAmount: _totalSoldAmount,
      saleStatus: _saleStatus,

      myShares: _myShares,
      countdown: _countdown,
      countdownTitle: _countdownTitle,

      currentPrice_round1: _currentPrice_round1,
      capAmount_round1: _capAmount_round1,
      totalSoldAmount_round1: _totalSoldAmount_round1,
      totalFundsRaised_round1: _totalFundsRaised_round1,
      myShares_round1: _myShares_round1,
    }
  }, [IDOInfo])
  return pageData
}

export default useIDO
