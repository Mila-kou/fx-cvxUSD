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
import useFxCommon from '@/modules/home/hooks/useFxCommon'


const useStabiltyPool_c = () => {
    const { stabilityPool_info: stabilityPoolInfo, fx_info: fxInfo, stETHRate } = useGlobal()
    const {
        ethPrice,
    } = useFxCommon()
    console.log('stabilityPoolInfo---fxInfo--ethPrice--', stabilityPoolInfo, fxInfo, ethPrice)
    const getStabiltyPoolApy = useCallback((stabilityPoolTotalSupplyTvl) => {
        try {
            const { rewardStateRes } = stabilityPoolInfo?.baseInfo
            const { finishAt, rate } = rewardStateRes || {}
            let apy = 0
            const _currentTime = +new Date()
            if (_currentTime > finishAt) {
                apy = 0
            } else {
                const apyWei = cBN(rate).multipliedBy(config.daySecond).multipliedBy(ethPrice).multipliedBy(stETHRate).div(stabilityPoolTotalSupplyTvl)
                apy = checkNotZoroNumOption(apyWei, fb4(apyWei, false, 0, 2))
            }
            console.log('apy---', apy, stETHRate)
            return apy
        } catch (error) {
            return 0
        }
    }, [stabilityPoolInfo?.baseInfo, stETHRate])
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

            let userWstETHClaimable = checkNotZoroNumOption(stabilityPoolInfo.userInfo?.claimableRes, fb4(stabilityPoolInfo.userInfo.claimableRes))
            let userWstETHClaimableTvl = cBN(0);
            if (checkNotZoroNum(ethPrice) && checkNotZoroNum(stabilityPoolInfo.userInfo.claimableRes)) {
                userWstETHClaimableTvl = cBN(ethPrice).times(stabilityPoolInfo.userInfo.claimableRes).div(1e18)
            }
            const userWstETHClaimableTvl_text = fb4(userWstETHClaimableTvl, false, 0)

            let userUnlockedBalance = checkNotZoroNumOption(stabilityPoolInfo.userInfo?.unlockedBalanceOfRes, fb4(stabilityPoolInfo.userInfo.unlockedBalanceOfRes))
            let userUnlockedBalanceTvl = cBN(0);
            if (checkNotZoroNum(fxInfo.baseInfo.CurrentNavRes?._fNav) && checkNotZoroNum(stabilityPoolInfo.userInfo.unlockedBalanceOfRes)) {
                userUnlockedBalanceTvl = cBN(fxInfo.baseInfo.CurrentNavRes?._fNav).div(1e18).times(stabilityPoolInfo.userInfo.unlockedBalanceOfRes).div(1e18)
            }
            const userUnlockedBalanceTvl_text = fb4(userUnlockedBalanceTvl, false, 0)

            let userUnlockingBalance = checkNotZoroNumOption(stabilityPoolInfo.userInfo?.unlockingBalanceOfRes, fb4(stabilityPoolInfo.userInfo.unlockingBalanceOfRes))
            let userUnlockingBalanceTvl = cBN(0);
            if (checkNotZoroNum(fxInfo.baseInfo.CurrentNavRes?._fNav) && checkNotZoroNum(stabilityPoolInfo.userInfo.unlockingBalanceOfRes)) {
                userUnlockingBalanceTvl = cBN(fxInfo.baseInfo.CurrentNavRes?._fNav).div(1e18).times(stabilityPoolInfo.userInfo.unlockingBalanceOfRes).div(1e18)
            }
            const userUnlockingBalanceTvl_text = fb4(userUnlockingBalanceTvl, false, 0)

            const myTotalValue = userDepositTvl.plus(userWstETHClaimableTvl).plus(userUnlockingBalanceTvl).plus(userUnlockedBalanceTvl)
            const myTotalValue_text = checkNotZoroNumOption(myTotalValue, fb4(myTotalValue, false, 0))

            const apy = getStabiltyPoolApy(stabilityPoolTotalSupplyTvl)
            return {
                stabilityPoolInfo,
                stabilityPoolTotalSupplyTvl_text,
                stabilityPoolTotalSupply,
                userDeposit,
                userDepositTvl_text,
                userWstETHClaimable,
                userWstETHClaimableTvl_text,
                myTotalValue_text,
                userUnlockingBalanceTvl_text,
                userUnlockingBalance,
                userUnlockedBalanceTvl,
                userUnlockedBalanceTvl_text,
                userUnlockedBalance,
                apy
            }
        } catch (error) {
            console.log('error--', error)
            return {
                stabilityPoolInfo: {},
                stabilityPoolTotalSupply: '-',
                stabilityPoolTotalSupplyTvl_text: '-',
                userDeposit: '-',
                userDepositTvl_text: "-",
                userWstETHClaimable: '-',
                userWstETHClaimableTvl_text: '-',
                myTotalValue_text: '-',
                userUnlockingBalanceTvl_text: '-',
                userUnlockingBalance: '-',
                userUnlockedBalanceTvl_text: '-',
                userUnlockedBalance: "-",
            }
        }
    }, [
        stabilityPoolInfo,
        fxInfo.baseInfo,
        ethPrice
    ])
    return {
        ...pageData
    }
}

export default useStabiltyPool_c
