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
    console.log('stabilityPoolInfo---', fxInfo)

    const { contract: fETHContract, address: fETHAddress } = useFETH()
    const { contract: xETHContract, address: xETHAddress } = useXETH()
    const { contract: marketContract } = useFX_Market()
    const { contract: treasuryContract } = useFX_stETHTreasury()
    const { contract: stETHGatewayContract } = useFX_stETHGateway()
    const [mintLoading, setMintLoading] = useState(false)
    const [feeUsd, setFeeUsd] = useState(10)



    const pageData = useMemo(() => {
        try {
            const stabilityPoolTotalSupply = checkNotZoroNumOption(
                stabilityPoolInfo.baseInfo.stabilityPoolTotalSupplyRes,
                fb4(stabilityPoolInfo.baseInfo.stabilityPoolTotalSupplyRes)
            )
            let stabilityPoolTotalSupplyTvl = cBN(0);
            console.log('fxInfo.baseInfo.CurrentNavRes?._fNav', fxInfo.baseInfo.CurrentNavRes?._fNav, stabilityPoolInfo.baseInfo.stabilityPoolTotalSupplyRes)
            if (checkNotZoroNum(fxInfo.baseInfo.CurrentNavRes?._fNav) && checkNotZoroNum(stabilityPoolInfo.baseInfo.stabilityPoolTotalSupplyRes)) {
                stabilityPoolTotalSupplyTvl = cBN(fxInfo.baseInfo.CurrentNavRes?._fNav).div(1e18).times(stabilityPoolInfo.baseInfo.stabilityPoolTotalSupplyRes)
            }
            const stabilityPoolTotalSupplyTvl_text = fb4(stabilityPoolTotalSupplyTvl, false, 0)

            return {
                stabilityPoolTotalSupplyTvl_text,
                stabilityPoolTotalSupply
            }
        } catch (error) {
            return {
                stabilityPoolTotalSupply: '-',
                stabilityPoolTotalSupplyTvl_text: '-'
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
