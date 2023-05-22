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

    const fetchBaseInfo = useCallback(async () => {
        const { totalSupply: fETHTotalSupplyFn } = fETHContract.methods
        const { totalSupply: xETHTotalSupplyFn } = xETHContract.methods
        const { getCurrentNav, collateralRatio, totalBaseToken, beta, lastPermissionedPrice, } = treasuryContract.methods
        const { fTokenMintFeeRatio, fTokenRedeemFeeRatio, xTokenMintFeeRatio, xTokenRedeemFeeRatio, marketConfig, mintPaused, redeemPaused } = marketContract.methods
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
                mintPaused(),
                redeemPaused()
            ]
            const [fETHTotalSupplyRes, xETHTotalSupplyRes, CurrentNavRes, collateralRatioRes, totalBaseTokenRes,
                fTokenMintFeeRatioRes, fTokenRedeemFeeRatioRes, xTokenMintFeeRatioRes, xTokenRedeemFeeRatioRes, betaRes,
                lastPermissionedPriceRes, marketConfigRes, mintPausedRes, redeemPausedRes] =
                await multiCallsV2(apiCalls)

            console.log(
                'BaseInfo11111',
                // fETHTotalSupplyRes, xETHTotalSupplyRes, CurrentNavRes, collateralRatioRes, totalBaseTokenRes,
                fTokenMintFeeRatioRes, fTokenRedeemFeeRatioRes, xTokenMintFeeRatioRes, xTokenRedeemFeeRatioRes,
                //  betaRes,
                lastPermissionedPriceRes, marketConfigRes,
                mintPausedRes, redeemPausedRes
            )

            return {
                fETHTotalSupplyRes, xETHTotalSupplyRes, CurrentNavRes, collateralRatioRes, totalBaseTokenRes,
                fTokenMintFeeRatioRes, fTokenRedeemFeeRatioRes, xTokenMintFeeRatioRes, xTokenRedeemFeeRatioRes,
                betaRes, lastPermissionedPriceRes, marketConfigRes, mintPausedRes, redeemPausedRes
            }
        } catch (error) {
            console.log('baseInfoError==>', error)
            return {}
        }
    }, [fETHContract, xETHContract, multiCallsV2, _currentAccount, web3])

    const getMaxAbleFToken = async () => {
        const { maxMintableFToken, maxMintableXToken, maxRedeemableFToken, maxRedeemableXToken } = treasuryContract.methods
        const _stabilityRatio = baseInfo.marketConfigRes?.stabilityRatio || 0
        const _liquidationRatio = baseInfo.marketConfigRes?.liquidationRatio || 0
        const _selfLiquidationRatio = baseInfo.marketConfigRes?.selfLiquidationRatio || 0
        const _recapRatioRatio = baseInfo.marketConfigRes?.recapRatio || 0
        const apiCalls = [
            maxMintableFToken(_stabilityRatio),
            maxMintableXToken(_stabilityRatio),
            maxRedeemableFToken(_stabilityRatio),
            maxRedeemableXToken(_stabilityRatio),
        ]
        // const [maxMintableFTokenRes, maxMintableXTokenRes, maxRedeemableFTokenRes, maxRedeemableXTokenRes] = await multiCallsV2(apiCalls)
        // console.log('maxMintableFTokenRes, maxMintableXTokenRes, maxRedeemableFTokenRes, maxRedeemableXTokenRes--', _stabilityRatio, maxMintableFTokenRes, maxMintableXTokenRes, maxRedeemableFTokenRes, maxRedeemableXTokenRes)
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
            },
            // {
            //     queryKey: ['userInfo'],
            //     queryFn: () => fetchUserInfo(),
            //     initialData: {},
            // },
        ],
    })

    useEffect(() => {
        refetchBaseInfo()
    }, [_currentAccount, blockNumber])

    useEffect(() => {
        getMaxAbleFToken()
    }, [baseInfo.collateralRatioRes])

    return {
        baseInfo,
        // userInfo,
    }
}
export default useInfo