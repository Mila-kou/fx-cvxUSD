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
        const { nav: fETHNavFn, totalSupply: fETHTotalSupplyFn } = fETHContract.methods
        const { nav: xETHNavFn, totalSupply: xETHTotalSupplyFn } = xETHContract.methods
        const { totalUnderlying: ETHTotalUnderlying, twapCache, cacheTwap, beta, lastPermissionedPrice } = treasuryContract.methods
        const { fTokenMintFeeRatio, fTokenRedeemFeeRatio, xTokenMintFeeRatio, xTokenRedeemFeeRatio } = marketContract.methods
        try {
            const apiCalls = [
                fETHNavFn(),
                fETHTotalSupplyFn(),
                xETHNavFn(),
                xETHTotalSupplyFn(),

                fTokenMintFeeRatio(),
                fTokenRedeemFeeRatio(),
                xTokenMintFeeRatio(),
                xTokenRedeemFeeRatio(),

                ETHTotalUnderlying(),
                beta(),
            ]
            const [fETHNavRes, fETHTotalSupplyRes, xETHNavRes, xETHTotalSupplyRes,
                fTokenMintFeeRatioRes, fTokenRedeemFeeRatioRes, xTokenMintFeeRatioRes, xTokenRedeemFeeRatioRes, ETHTotalUnderlyingRes, betaRes] =
                await multiCallsV2(apiCalls)

            console.log(
                'BaseInfo ===>',
                fETHNavRes, fETHTotalSupplyRes, xETHNavRes, xETHTotalSupplyRes,
                fTokenMintFeeRatioRes, fTokenRedeemFeeRatioRes, xTokenMintFeeRatioRes, xTokenRedeemFeeRatioRes, ETHTotalUnderlyingRes, betaRes
            )

            return {
                fETHNavRes, fETHTotalSupplyRes, xETHNavRes, xETHTotalSupplyRes,
                fTokenMintFeeRatioRes, fTokenRedeemFeeRatioRes, xTokenMintFeeRatioRes, xTokenRedeemFeeRatioRes, ETHTotalUnderlyingRes, betaRes
            }
        } catch (error) {
            console.log('baseInfoError==>', error)
            return {}
        }
    }, [fETHContract, xETHContract, multiCallsV2, _currentAccount, web3])

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
        // refetchUserInfo()
    }, [_currentAccount, blockNumber])

    return {
        baseInfo,
        // userInfo,
    }
}
export default useInfo