import { useEffect, useState, useContext, useCallback } from 'react'
import { useQueries } from '@tanstack/react-query'
import useWeb3 from '@/hooks/useWeb3'
import { useContract, erc20Contract } from 'hooks/useContracts'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import abis from 'config/abi'
import config from 'config'
import moment from 'moment'
import { cBN, fb4 } from 'utils'

const momentFormatStr = 'YYYY-MM-DD HH:mm'


/**
 * 
 * @param {*} saleTime 
 * @description calculate the remaining time of the sale
 * @returns timeObj
 */
const calcSaleTime = async (saleTime, web3, isEnd) => {

    const { publicSaleTime, whitelistSaleTime, saleDuration } = saleTime || {}
    // const publicSaleEndTime = moment((publicSaleTime * 1 + saleDuration * 1) * 1000)
    // const whitelistSaleStartTime = moment(whitelistSaleTime * 1000)
    // const publicSaleStartTime = moment(publicSaleTime * 1000)

    const publicSaleEndTime = new Date((publicSaleTime * 1 + saleDuration * 1) * 1000)
    const whitelistSaleStartTime = new Date(whitelistSaleTime * 1000)
    const publicSaleStartTime = new Date(publicSaleTime * 1000)

    let title = null
    let saleStatus = null
    let countdown = 0

    const { timestamp } = await web3.eth.getBlock('latest')
    const now = moment(timestamp * 1000) || moment()

    console.log(
        'now', now.format('l'),
        'whitelistSaleStartTime', whitelistSaleStartTime.toLocaleString(),
        'publicSaleStartTime', publicSaleStartTime.toLocaleString(),
        'publicSaleEndTime', publicSaleEndTime.toLocaleString(),
    )

    if (now.isBefore(publicSaleStartTime)) {
        title = `Starting ${publicSaleStartTime.toLocaleString()}`
        saleStatus = 0
        countdown = publicSaleStartTime.valueOf()
    }
    // // white ending time
    // if (now.isBetween(whitelistSaleStartTime, publicSaleStartTime)) {
    //     title = `Ending ${publicSaleStartTime.format(momentFormatStr)} UTC`
    //     saleStatus = 1
    //     countdown = isEnd ? 0 : publicSaleStartTime.valueOf()
    // }

    // public ending time
    if (now.isBetween(publicSaleStartTime, publicSaleEndTime)) {
        title = `Ending ${publicSaleEndTime.toLocaleString()}`
        saleStatus = 2
        countdown = isEnd ? 0 : publicSaleEndTime.valueOf()
    }
    // complted
    if (now.isAfter(publicSaleEndTime)) {
        title = null
        saleStatus = 3
    }
    return {
        publicSaleStartTime,
        publicSaleEndTime,
        whitelistSaleStartTime,
        whitelistSaleEndTime: publicSaleEndTime,
        title,
        countdown,
        saleStatus
    }
}

export const useInfo = (refreshTrigger) => {
    const { _currentAccount, web3, blockNumber } = useWeb3()
    const { getContract } = useContract()

    const IdoSaleContract = useContract(config.contracts.idoSale, abis.IdoSale)
    const rewardErc20 = erc20Contract(config.tokens.idoRewardToken)

    const fetchBaseInfo = useCallback(async () => {
        const { getPrice, saleTimeData, cap, totalSold } = IdoSaleContract.methods
        try {
            const saleCalls = [
                getPrice(),
                saleTimeData(),
                cap(),
                totalSold(),
                rewardErc20.methods.balanceOf(config.contracts.idoSale)
            ]
            const [currentPrice, saleTime, capAmount, totalSoldAmount, totalFundsRaised] = await useMutiCallV2(saleCalls)
            const isEnd = cBN(capAmount).isEqualTo(cBN(totalSoldAmount)) ? true : false;
            const timeObj = await calcSaleTime(saleTime, web3, isEnd)
            console.log("useInfo ===>", fb4(currentPrice), saleTime, capAmount, totalSoldAmount, totalFundsRaised, timeObj)

            return {
                idoAmount: fb4(capAmount),
                currentPrice,
                saleTime,
                capAmount,
                totalSoldAmount,
                totalFundsRaised: cBN(100000).shiftedBy(18),
                timeObj
            }
        } catch (error) {
            console.log(error)
        }
    }, [getContract, multiCallsV2, _currentAccount])



    const fetchUserInfo = useCallback(async () => {
        const { whitelistCap, shares, claimed } = IdoSaleContract.methods
        try {
            const calls = [whitelistCap(_currentAccount), shares(_currentAccount), claimed(_currentAccount)]
            const [isWhite, myShares, isClaimed] = await useMutiCallV2(calls)
            return {
                myShares, isClaimed, isWhitelisted: isWhite != 0, whitelistCap: isWhite
            }

        } catch (error) {
            console.log(error)
        }
    }, [getContract, multiCallsV2, _currentAccount])


    const [
        { data: baseInfo, refetch: refetchBaseInfo },
        { data: userInfo, refetch: refetchUserInfo },
    ] = useQueries({
        queries: [
            {
                queryKey: ['baseInfo'],
                queryFn: () => fetchBaseInfo(),
                initialData: {},
            },
            {
                queryKey: ['userInfo'],
                queryFn: () => fetchUserInfo(),
                initialData: {},
            },
        ],
    })

    useEffect(() => {
        refetchBaseInfo()
        refetchUserInfo()
    }, [_currentAccount, blockNumber])

    return {
        info: {
            baseInfo,
            userInfo,
        },
        IdoSaleContract,
    }
}

export default useInfo
