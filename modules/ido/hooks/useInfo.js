import { useEffect, useState, useContext, useCallback } from 'react'
import { useQueries } from '@tanstack/react-query'
import moment from 'moment'
import { useContract } from 'hooks/useContracts'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import abis from '@/config/abi'
import config from '@/config/index'
import useWeb3 from '@/hooks/useWeb3'
import { cBN, fb4 } from '@/utils/index'

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

  const publicSaleEndTime = new Date(
    (publicSaleTime * 1 + saleDuration * 1) * 1000
  )
  const whitelistSaleStartTime = new Date(whitelistSaleTime * 1000)
  const publicSaleStartTime = new Date(publicSaleTime * 1000)

  let title = null
  let saleStatus = null
  let countdown = 0

  const { timestamp } = await web3.eth.getBlock('latest')
  const now = moment()

  console.log(
    'now',
    now.toLocaleString(),
    'whitelistSaleStartTime',
    whitelistSaleStartTime.toLocaleString(),
    'publicSaleStartTime',
    publicSaleStartTime.toLocaleString(),
    'publicSaleEndTime',
    publicSaleEndTime.toLocaleString()
  )

  if (now.isBefore(whitelistSaleStartTime)) {
    title = `Starting at ${whitelistSaleStartTime.toLocaleString()}`
    saleStatus = 0
    countdown = whitelistSaleStartTime.valueOf()
  }
  // // white ending time
  if (
    now.isBetween(whitelistSaleStartTime, publicSaleStartTime) ||
    now.isSame(publicSaleStartTime)
  ) {
    title = `Ending at ${publicSaleStartTime.toLocaleString()}`
    saleStatus = 1
    countdown = publicSaleStartTime.valueOf()
  }

  // if (now.isBefore(publicSaleStartTime)) {
  //   title = `Public Sale Starting ${publicSaleStartTime.toLocaleString()}`
  //   saleStatus = 0
  //   countdown = publicSaleStartTime.valueOf()
  // }

  // public ending time
  if (
    now.isBetween(publicSaleStartTime, publicSaleEndTime) ||
    now.isSame(publicSaleEndTime)
  ) {
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
    saleStatus,
  }
}

const useInfo = (refreshTrigger) => {
  const { _currentAccount, web3, blockNumber } = useWeb3()
  const { erc20Contract } = useContract()
  const multiCallsV2 = useMutiCallV2()

  const [baseInfo, setBaseInfo] = useState({})
  const [userInfo, setUserInfo] = useState({})

  const { contract: IdoSaleContract } = useContract(
    config.contracts.idoSale,
    abis.IdoSale
  )
  const { contract: IdoSaleContract1 } = useContract(
    config.contracts.idoSale1,
    abis.IdoSale
  )

  const fetchBaseInfo = useCallback(async () => {
    const { getPrice, saleTimeData, cap, totalSold } = IdoSaleContract.methods
    const {
      getPrice: getPrice_round1,
      cap: cap_round1,
      totalSold: totalSold_round1,
    } = IdoSaleContract1.methods
    const fundsRaisedErc20 = erc20Contract(config.contracts.fundsRaisedToken)
    try {
      const saleCalls = [
        getPrice(),
        saleTimeData(),
        cap(),
        totalSold(),

        getPrice_round1(),
        cap_round1(),
        totalSold_round1(),
        // rewardErc20.methods.balanceOf(config.contracts.idoSale)
      ]
      console.log('getPrice')
      const [
        currentPrice,
        saleTime,
        capAmount,
        totalSoldAmount,
        currentPrice_round1,
        capAmount_round1,
        totalSoldAmount_round1,
      ] = await multiCallsV2(saleCalls)
      const totalFundsRaised = await fundsRaisedErc20.methods
        .balanceOf(config.contracts.idoSale)
        .call()
      const totalFundsRaised_round1 = await fundsRaisedErc20.methods
        .balanceOf(config.contracts.idoSale1)
        .call()
      const isEnd = cBN(capAmount).isEqualTo(cBN(totalSoldAmount))
        ? true
        : false
      const timeObj = await calcSaleTime(saleTime, web3, isEnd)
      console.log(
        'useInfo ===>',
        fb4(currentPrice),
        saleTime,
        capAmount,
        totalSoldAmount,
        totalFundsRaised,
        timeObj
      )

      return {
        idoAmount: fb4(capAmount),
        currentPrice,
        saleTime,
        capAmount,
        totalSoldAmount,
        totalFundsRaised, // cBN(100000).shiftedBy(18),
        timeObj,
        currentPrice_round1,
        capAmount_round1,
        totalSoldAmount_round1,
        totalFundsRaised_round1,
      }
    } catch (error) {
      console.log(error)
      return {}
    }
  }, [IdoSaleContract, erc20Contract, multiCallsV2, web3])

  const fetchUserInfo = useCallback(async () => {
    const { whitelistCap, shares, claimed } = IdoSaleContract.methods
    const { shares: shares_round1, claimed: claimed_round1 } =
      IdoSaleContract1.methods

    try {
      const calls = [
        whitelistCap(_currentAccount),
        shares(_currentAccount),
        claimed(_currentAccount),
        shares_round1(_currentAccount),
        claimed_round1(_currentAccount),
      ]
      const [isWhite, myShares, isClaimed, myShares_round1, isClaimed_round1] =
        await multiCallsV2(calls)
      return {
        myShares,
        isClaimed,
        isWhitelisted: isWhite != 0,
        whitelistCap: isWhite,
        myShares_round1,
        isClaimed_round1,
      }
    } catch (error) {
      console.log(error)
      return {}
    }
  }, [IdoSaleContract, _currentAccount, multiCallsV2])

  const [
    { data: data1, refetch: refetchBaseInfo },
    { data: data2, refetch: refetchUserInfo },
  ] = useQueries({
    queries: [
      {
        queryKey: ['baseInfo'],
        queryFn: () => fetchBaseInfo(),
        initialData: {},
        refetchInterval: 2000,
      },
      {
        queryKey: ['userInfo'],
        queryFn: () => fetchUserInfo(),
        initialData: {},
      },
    ],
  })

  useEffect(() => {
    refetchUserInfo()
  }, [_currentAccount, blockNumber])

  useEffect(() => {
    if (data1?.saleTime) setBaseInfo(data1)
    if (data2) setUserInfo(data2)
  }, [data1, data2])

  return {
    info: {
      baseInfo,
      userInfo,
    },
    IdoSaleContract,
  }
}

export default useInfo
