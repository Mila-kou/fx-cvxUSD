import { useEffect, useState, useContext, useCallback } from 'react'
import { useQueries } from '@tanstack/react-query'
import moment from 'moment'
import { useContract, useFETH, useFX_Market, useFX_Treasury, useXETH } from 'hooks/useContracts'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import abis from '@/config/abi'
import config from '@/config/index'
import useWeb3 from '@/hooks/useWeb3'
import { cBN, fb4 } from '@/utils/index'

const useETHPrice = () => {
    const { _currentAccount, web3, blockNumber } = useWeb3()
    const { erc20Contract } = useContract()
    const multiCallsV2 = useMutiCallV2()
    const { contract: fETHContract } = useFETH()
    const { contract: xETHContract } = useXETH()
    const { contract: marketContract } = useFX_Market()
    const { contract: treasuryContract } = useFX_Treasury()

    const fetchInfo = useCallback(async () => {

        const { twapCache, cacheTwap, beta, lastPermissionedPrice } = treasuryContract.methods
        try {
            const apiCalls = [
                cacheTwap(),
                twapCache(),
                beta(),
                lastPermissionedPrice()
            ]
            const [, twapCacheRes, betaRes, lastPermissionedPriceRes] =
                await multiCallsV2(apiCalls)

            console.log(
                'ETHPrceBaseInfo ===>',
                twapCacheRes
            )

            return {
                twapCacheRes
            }
        } catch (error) {
            console.log('baseInfoError==>', error)
            return {}
        }
    }, [treasuryContract, multiCallsV2, _currentAccount, web3])

    const _computeMultiple = (_newPrice, _lastPermissionedPrice, _beta) => {
        const PRECISION_I256 = 1e18;
        const _ratio = cBN(_newPrice).minus(_lastPermissionedPrice).multipliedBy(PRECISION_I256).div(_lastPermissionedPrice)
        const _fMultiple = _ratio.mul(_beta).div(PRECISION_I256);
        return _fMultiple
    }

    const [
        { data: baseInfo, refetch: refetchBaseInfo },
        // { data: userInfo, refetch: refetchUserInfo },
    ] = useQueries({
        queries: [
            {
                queryKey: ['baseInfo'],
                queryFn: () => fetchInfo(),
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
        ...baseInfo,
    }
}
export default useETHPrice