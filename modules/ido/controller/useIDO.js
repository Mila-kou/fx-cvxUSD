import { useEffect, useState, useContext, useCallback, useMemo } from 'react'
import useInfo from '../hooks/useInfo'
import { checkNotZoroNum, checkNotZoroNumOption, fb4 } from '@/utils/index'

export const useIDO = () => {
    const IDOInfo = useInfo()
    const pageData = useMemo(() => {
        const { info = {}, IdoSaleContract } = IDOInfo
        const { baseInfo, userInfo } = info
        const _currentPrice = checkNotZoroNumOption(baseInfo.currentPrice, fb4(baseInfo.currentPrice, true))
        const _capAmount = checkNotZoroNumOption(baseInfo.capAmount, fb4(baseInfo.capAmount))
        const _totalFundsRaised = checkNotZoroNumOption(baseInfo.totalFundsRaised, fb4(baseInfo.totalFundsRaised))
        const _totalSoldAmount = checkNotZoroNumOption(baseInfo.totalSoldAmount, fb4(baseInfo.totalSoldAmount))
        const _saleStatus = baseInfo?.timeObj?.saleStatus
        const _countdown = baseInfo?.timeObj?.countdown || 0
        const _countdownTitle = baseInfo?.timeObj?.title || ""


        const _myShares = checkNotZoroNumOption(userInfo.myShares, fb4(userInfo.myShares))

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
            countdownTitle:_countdownTitle

        }
    }, [IDOInfo])
    return pageData
}

export default useIDO
