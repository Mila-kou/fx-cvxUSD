import { useEffect, useState, useContext, useCallback, useMemo } from 'react'
import { cBN, checkNotZoroNum, checkNotZoroNumOption, fb4 } from '@/utils/index'
import {
    useFETH,
    useXETH,
    useFX_Market,
    useFX_stETHTreasury,
    useFX_stETHGateway,
} from '@/hooks/useContracts'
import { useGlobal } from '@/contexts/GlobalProvider'

const useStabiltyPool_c = () => {
    const { stabilityPool_info: stabilityPoolInfo, fx_info: fxInfo } = useGlobal()
    console.log('stabilityPoolInfo---', stabilityPoolInfo, fxInfo)


    const pageData = useMemo(() => {
        try {
            const stabilityPoolTotalSupply = checkNotZoroNumOption(
                stabilityPoolInfo.baseInfo.stabilityPoolTotalSupplyRes,
                fb4(stabilityPoolInfo.baseInfo.stabilityPoolTotalSupplyRes)
            )
            let stabilityPoolTotalSupplyTvl = cBN(0);
            if (checkNotZoroNum(fxInfo.baseInfo.CurrentNavRes?._fNav) && checkNotZoroNum(stabilityPoolInfo.baseInfo.stabilityPoolTotalSupplyRes)) {
                stabilityPoolTotalSupplyTvl = cBN(fxInfo.baseInfo.CurrentNavRes?._fNav).div(1e18).times(stabilityPoolInfo.baseInfo.stabilityPoolTotalSupplyRes).div(1e18)
            }
            const stabilityPoolTotalSupplyTvl_text = fb4(stabilityPoolTotalSupplyTvl, false, 0)

            let userDeposit = checkNotZoroNumOption(stabilityPoolInfo.userInfo?.stabilityPoolBalanceOfRes, fb4(stabilityPoolInfo.userInfo.stabilityPoolBalanceOfRes))
            let userDepositTvl = cBN(0);
            if (checkNotZoroNum(fxInfo.baseInfo.CurrentNavRes?._fNav) && checkNotZoroNum(stabilityPoolInfo.userInfo.stabilityPoolBalanceOfRes)) {
                userDepositTvl = cBN(fxInfo.baseInfo.CurrentNavRes?._fNav).div(1e18).times(stabilityPoolInfo.userInfo.stabilityPoolBalanceOfRes).div(1e18)
            }
            const userDepositTvl_text = fb4(userDepositTvl, false, 0)
            return {
                stabilityPoolTotalSupplyTvl_text,
                stabilityPoolTotalSupply,
                userDeposit,
                userDepositTvl_text
            }
        } catch (error) {
            console.log('error--', error)
            return {
                stabilityPoolTotalSupply: '-',
                stabilityPoolTotalSupplyTvl_text: '-',
                userDeposit: '-',
                userDepositTvl_text: "-"
            }
        }
    }, [
        stabilityPoolInfo,
        fxInfo.baseInfo
    ])
    return {
        ...pageData
    }
}

export default useStabiltyPool_c
