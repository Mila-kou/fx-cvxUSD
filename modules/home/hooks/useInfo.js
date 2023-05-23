import { useEffect, useState, useContext, useCallback } from 'react'
import { useQueries } from '@tanstack/react-query'
import moment from 'moment'
import { useContract, useFETH, useFX_Market, useFX_Treasury, useXETH } from 'hooks/useContracts'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import abis from '@/config/abi'
import config from '@/config/index'
import useWeb3 from '@/hooks/useWeb3'
import { cBN, fb4 } from '@/utils/index'

const useInfo = () => {
    const { _currentAccount, web3, blockNumber } = useWeb3()
    const { erc20Contract } = useContract()
    const multiCallsV2 = useMutiCallV2()
    const { contract: fETHContract } = useFETH()
    const { contract: xETHContract } = useXETH()
    const { contract: marketContract } = useFX_Market()
    const { contract: treasuryContract } = useFX_Treasury()
    const [maxAbleFToken, setMaxAbleFToken] = useState({})

    const fetchBaseInfo = useCallback(async () => {
        const { nav, totalSupply: fETHTotalSupplyFn } = fETHContract.methods
        const { totalSupply: xETHTotalSupplyFn } = xETHContract.methods
        const { getCurrentNav, collateralRatio, totalBaseToken, beta, lastPermissionedPrice, } = treasuryContract.methods
        const { fTokenMintInSystemStabilityModePaused, xTokenRedeemInSystemStabilityModePaused,
            fTokenMintFeeRatio, fTokenRedeemFeeRatio, xTokenMintFeeRatio,
            xTokenRedeemFeeRatio, marketConfig, incentiveConfig, mintPaused, redeemPaused } = marketContract.methods
        try {
            const apiCalls = [
                fETHTotalSupplyFn(),
                xETHTotalSupplyFn(),
                getCurrentNav(),
                collateralRatio(),
                totalBaseToken(),

                fTokenMintFeeRatio(),
                fTokenRedeemFeeRatio(),
                xTokenMintFeeRatio(),
                xTokenRedeemFeeRatio(),


                beta(),
                lastPermissionedPrice(),
                marketConfig(),
                incentiveConfig(),
                mintPaused(),
                redeemPaused(),
                fTokenMintInSystemStabilityModePaused(),
                xTokenRedeemInSystemStabilityModePaused(),
                nav()
            ]
            const [fETHTotalSupplyRes, xETHTotalSupplyRes, CurrentNavRes, collateralRatioRes, totalBaseTokenRes,
                fTokenMintFeeRatioRes, fTokenRedeemFeeRatioRes, xTokenMintFeeRatioRes, xTokenRedeemFeeRatioRes, betaRes,
                lastPermissionedPriceRes, marketConfigRes, incentiveConfigRes, mintPausedRes, redeemPausedRes,
                fTokenMintInSystemStabilityModePausedRes, xTokenRedeemInSystemStabilityModePausedRes, fNav0Res] =
                await multiCallsV2(apiCalls)

            console.log(
                'BaseInfo11111',
                // fETHTotalSupplyRes, xETHTotalSupplyRes, CurrentNavRes, collateralRatioRes, totalBaseTokenRes,
                // fTokenMintFeeRatioRes, fTokenRedeemFeeRatioRes, xTokenMintFeeRatioRes, xTokenRedeemFeeRatioRes,
                //  betaRes,
                lastPermissionedPriceRes, marketConfigRes, incentiveConfigRes,
                // mintPausedRes, redeemPausedRes,
                // fTokenMintInSystemStabilityModePausedRes,
                // xTokenRedeemInSystemStabilityModePausedRes,
                fNav0Res
            )

            return {
                fETHTotalSupplyRes, xETHTotalSupplyRes, CurrentNavRes, collateralRatioRes, totalBaseTokenRes,
                fTokenMintFeeRatioRes, fTokenRedeemFeeRatioRes, xTokenMintFeeRatioRes, xTokenRedeemFeeRatioRes,
                betaRes, lastPermissionedPriceRes, marketConfigRes, incentiveConfigRes, mintPausedRes, redeemPausedRes,
                fTokenMintInSystemStabilityModePausedRes,
                xTokenRedeemInSystemStabilityModePausedRes,
                fNav0Res
            }
        } catch (error) {
            console.log('baseInfoError==>', error)
            return {}
        }
    }, [fETHContract, xETHContract, multiCallsV2, _currentAccount, web3])

    const getMaxAbleFToken = async () => {
        const { maxMintableFToken, maxMintableXToken, maxRedeemableFToken, maxRedeemableXToken, cacheTwap, maxMintableXTokenWithIncentive } = treasuryContract.methods
        const _stabilityRatio = baseInfo.marketConfigRes?.stabilityRatio || 0
        const _liquidationRatio = baseInfo.marketConfigRes?.liquidationRatio || 0
        const _selfLiquidationRatio = baseInfo.marketConfigRes?.selfLiquidationRatio || 0
        const _recapRatioRatio = baseInfo.marketConfigRes?.recapRatio || 0
        const _stabilityIncentiveRatio = baseInfo.incentiveConfigRes?.stabilityIncentiveRatio || 0
        const apiCalls = [
            cacheTwap(),
            // maxMintableFToken(_stabilityRatio),
            // maxMintableXToken(_stabilityRatio),
            // maxRedeemableFToken(_stabilityRatio),
            // maxRedeemableXToken(_stabilityRatio),
            maxMintableXTokenWithIncentive(
                _stabilityRatio,
                _stabilityIncentiveRatio
            )
        ]
        const [,
            // maxMintableFTokenRes, maxMintableXTokenRes, maxRedeemableFTokenRes, maxRedeemableXTokenRes,
            maxMintableXTokenWithIncentiveRes] = await multiCallsV2(apiCalls)
        console.log('maxMintableFTokenRes, maxMintableXTokenRes, maxRedeemableFTokenRes, maxRedeemableXTokenRes--',
            // _stabilityRatio, maxMintableFTokenRes, maxMintableXTokenRes, maxRedeemableFTokenRes, maxRedeemableXTokenRes,
            maxMintableXTokenWithIncentiveRes)
        setMaxAbleFToken((pre) => {
            return {
                ...pre,
                maxMintableXTokenWithIncentiveRes
            }
        })
    }

    const [
        { data: baseInfo, refetch: refetchBaseInfo },
        // { data: userInfo, refetch: refetchUserInfo },
    ] = useQueries({
        queries: [
            {
                queryKey: ['baseInfo'],
                queryFn: () => fetchBaseInfo(),
                initialData: {},
            }
        ],
    })

    useEffect(() => {
        refetchBaseInfo()
    }, [_currentAccount, blockNumber])

    useEffect(() => {
        getMaxAbleFToken()
    }, [blockNumber])

    return {
        baseInfo,
        ...maxAbleFToken
        // userInfo,
    }
}
export default useInfo