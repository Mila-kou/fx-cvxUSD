import { useEffect, useState, useContext, useCallback, useMemo } from 'react'
import useInfo from '../hooks/useInfo'
import { checkNotZoroNum, checkNotZoroNumOption, fb4 } from '@/utils/index'

export const useIDO = () => {
    const IDOInfo = useInfo()
    const pageData = useMemo(() => {
        const { info = {} } = IDOInfo
        const { baseInfo, userInfo } = info
        const _currentPrice = checkNotZoroNumOption(baseInfo.currentPrice, fb4(baseInfo.currentPrice, true))
        const _capAmount = checkNotZoroNumOption(baseInfo.capAmount, fb4(baseInfo.capAmount))
        const _totalFundsRaised = checkNotZoroNumOption(baseInfo.totalFundsRaised, fb4(baseInfo.totalFundsRaised))
        const _totalSoldAmount = checkNotZoroNumOption(baseInfo.totalSoldAmount, fb4(baseInfo.totalSoldAmount))
        return {
            ...info,
            currentPrice: _currentPrice,
            capAmount: _capAmount,
            totalFundsRaised: _totalFundsRaised,
            totalSoldAmount: _totalSoldAmount,
        }
    }, [IDOInfo])
    return pageData
}

export default useIDO
