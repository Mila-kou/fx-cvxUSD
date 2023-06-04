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
    const { contract: treasuryContract, address: treasuryAddress } = useFX_Treasury()
    const [maxAbleFToken, setMaxAbleFToken] = useState({})

    const fetchBaseInfo = useCallback(async () => {
        const { nav, totalSupply: fETHTotalSupplyFn } = fETHContract.methods
        const { totalSupply: xETHTotalSupplyFn } = xETHContract.methods
        const { getCurrentNav, collateralRatio, totalBaseToken, beta, lastPermissionedPrice, } = treasuryContract.methods
        const { fTokenMintInSystemStabilityModePaused, xTokenRedeemInSystemStabilityModePaused,
            fTokenMintFeeRatio, fTokenRedeemFeeRatio, xTokenMintFeeRatio,
            xTokenRedeemFeeRatio, marketConfig, incentiveConfig, mintPaused, redeemPaused } = marketContract.methods
        const wethContract = erc20Contract(config.tokens.weth)
        try {
            // const testApiCalls = [
            //     web3.eth.getBalance(treasuryAddress),
            //     web3.eth.getBalance("0x07dA2d30E26802ED65a52859a50872cfA615bD0A"),
            //     wethContract.methods.balanceOf(treasuryAddress),
            //     wethContract.methods.balanceOf('0x07dA2d30E26802ED65a52859a50872cfA615bD0A'),
            // ]
            // const [treasury_ethBalance, platform_ethBalance, treasury_wethBalance, platform_wethBalance] =
            //     await multiCallsV2(testApiCalls)
            // console.log('treasury_ethBalance--treasury_wethBalance--platform_ethBalance--platform_wethBalance--', treasury_ethBalance, treasury_wethBalance, platform_ethBalance, platform_wethBalance)
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

    const getMaxAbleToken = async () => {
        const { maxMintableFToken, maxMintableXToken, maxRedeemableFToken, maxRedeemableXToken, cacheTwap, maxMintableXTokenWithIncentive, maxLiquidatable } = treasuryContract.methods
        const _stabilityRatio = baseInfo.marketConfigRes?.stabilityRatio || 0
        const _liquidationRatio = baseInfo.marketConfigRes?.liquidationRatio || 0
        const _selfLiquidationRatio = baseInfo.marketConfigRes?.selfLiquidationRatio || 0
        const _recapRatioRatio = baseInfo.marketConfigRes?.recapRatio || 0
        const _stabilityIncentiveRatio = baseInfo.incentiveConfigRes?.stabilityIncentiveRatio || 0
        const _liquidationIncentiveRatio = baseInfo.incentiveConfigRes?.liquidationIncentiveRatio || 0
        try {
            const apiCalls = [
                cacheTwap(),
                // maxMintableFToken(_stabilityRatio),
                // maxMintableXToken(_stabilityRatio),
                // maxRedeemableFToken(_stabilityRatio),
                // maxRedeemableXToken(_stabilityRatio),
                maxMintableXTokenWithIncentive(
                    _stabilityRatio,
                    _stabilityIncentiveRatio
                ),
                maxLiquidatable(
                    _liquidationRatio,
                    _liquidationIncentiveRatio
                )
            ]
            const [,
                // maxMintableFTokenRes, maxMintableXTokenRes, maxRedeemableFTokenRes, maxRedeemableXTokenRes,
                maxMintableXTokenWithIncentiveRes, maxLiquidatableRes] = await multiCallsV2(apiCalls)
            console.log('maxMintableFTokenRes, maxMintableXTokenRes, maxRedeemableFTokenRes, maxRedeemableXTokenRes--',
                // _stabilityRatio, maxMintableFTokenRes, maxMintableXTokenRes, maxRedeemableFTokenRes, maxRedeemableXTokenRes,
                maxMintableXTokenWithIncentiveRes, maxLiquidatableRes)
            setMaxAbleFToken((pre) => {
                return {
                    ...pre,
                    maxMintableXTokenWithIncentiveRes,
                    maxLiquidatableRes
                }
            })
        } catch (e) {
            console.log('getMaxAbleToken--', e)
        }
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
        getMaxAbleToken()
    }, [blockNumber])

    return {
        baseInfo,
        ...maxAbleFToken
        // userInfo,
    }
}
export default useInfo