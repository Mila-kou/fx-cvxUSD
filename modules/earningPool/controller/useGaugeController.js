import { useEffect, useState, useContext, useCallback, useMemo } from 'react'
import moment from 'moment'
import { cBN, checkNotZoroNum, checkNotZoroNumOption, fb4 } from '@/utils/index'
import { useGlobal } from '@/contexts/GlobalProvider'
import config from '@/config/index'
import useWeb3 from '@/hooks/useWeb3'
import useGaugeData from '../hooks/useGaugeData'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import { POOLS_LIST } from '@/config/aladdinVault'
import { useContract, useVeFXN } from '@/hooks/useContracts'
import abi from '@/config/abi'

const useGaugeController = () => {
  const globalState = useGlobal()
  const { lpPrice, tokenPrice, ConvexVaultsAPY } = globalState
  const { currentAccount, isAllReady } = useWeb3()
  const { getContract } = useContract()
  const { allPoolsInfo, allPoolsUserInfo, allPoolsApyInfo } = useGaugeData()

  const getLpTokenPrice = useCallback(
    (lpAddress) => {
      try {
        const _lpPrice = lpPrice[lpAddress.toLowerCase()]
        if (_lpPrice) {
          return _lpPrice.usd
        }
        return 0
      } catch (e) {
        return 0
      }
    },
    [lpPrice]
  )

  const getTokenPrice = useCallback(
    (tokenName) => {
      try {
        const _tokenPrice = tokenPrice[tokenName]
        if (_tokenPrice) {
          return _tokenPrice.usd
        }
        return 0
      } catch (e) {
        return 0
      }
    },
    [tokenPrice]
  )

  const getLpConvexApy = useCallback(
    (lpAddress) => {
      try {
        const _convexLpInfo = ConvexVaultsAPY.find(
          (item) => item.address.toLowerCase() == lpAddress.toLowerCase()
        )
        if (_convexLpInfo.name) {
          return _convexLpInfo.apy
        }
        return 0
      } catch (error) {
        console.log('apy------getLpConvexApy-error', error)
        return 0
      }
    },
    [ConvexVaultsAPY]
  )

  const canClaim = useMemo(() => {
    return false
  }, [])

  const getApy = useCallback((item) => {
    const { baseInfo = {}, lpAddress, rewardDatas, rewardTokens } = item || {}
    const { totalSupply } = baseInfo
    let allApy = cBN(0)
    const convexLpApy = getLpConvexApy(lpAddress)
    const _apys =
      rewardDatas &&
      rewardDatas.map((baseApyData, index) => {
        let _apy = 0
        const {
          rewardData: { finishAt, lastUpdate, rate },
          rewardAddress,
        } = baseApyData
        const _lpPrice = getLpTokenPrice(lpAddress)
        const rewardToken = rewardTokens.find(
          (_tokenData) =>
            _tokenData[1].toLowerCase() == rewardAddress.toLowerCase()
        )

        if (!rewardToken) {
          _apy = 0
        } else {
          console.log('apy----')
          const rewardTokenPrice = getTokenPrice(rewardToken[0])
          const _currTime = Math.ceil(new Date().getTime() / 1000)
          const _lastFinishAt = cBN(finishAt).plus(24 * 60 * 60 * 7)
          if (cBN(_currTime).lt(_lastFinishAt) && cBN(totalSupply).gt(0)) {
            _apy = cBN(rate)
              .div(1e18)
              .times(config.yearSecond)
              .div(cBN(totalSupply).div(1e18).times(_lpPrice))
              .times(100)
              .times(rewardTokenPrice)
              .toFixed(2)
          }
          console.log(
            'getApy----name,rewardToken,_currTime,finishAt,totalSupply,rate,config.yearSecond,_lpPrice,rewardTokenPrice',
            item.name,
            rewardToken[0],
            _currTime,
            finishAt,
            totalSupply,
            rate,
            config.yearSecond,
            _lpPrice,
            rewardTokenPrice,
            _apy
          )
        }
        allApy = allApy.plus(_apy)
        return {
          rewardToken,
          _apy,
        }
      })
    return {
      allApy: allApy.toFixed(2),
      apyList: _apys,
      convexLpApy,
    }
  })

  const pageData = useMemo(() => {
    try {
      const data = POOLS_LIST.map((item, index) => {
        const _baseInfo = allPoolsInfo[index]?.baseInfo || {}
        const _rewardDatas = allPoolsApyInfo[index]?.rewardDatas || {}
        const _userInfo = allPoolsUserInfo[index]?.userInfo || {}
        const tvl_text = checkNotZoroNumOption(
          _baseInfo.totalSupply,
          fb4(_baseInfo.totalSupply)
        )
        const userShare_text = checkNotZoroNumOption(
          _userInfo.userShare,
          fb4(_userInfo.userShare)
        )
        const _lpGaugeContract = getContract(
          item.lpGaugeAddress,
          abi.FX_fx_SharedLiquidityGaugeABI
        )
        const _data = {
          ...item,
          lpGaugeContract: _lpGaugeContract,
          baseInfo: _baseInfo,
          userInfo: _userInfo,
          rewardDatas: _rewardDatas,
          tvl_text,
          userShare_text,
        }
        const apyInfo = getApy(_data)
        _data.apyInfo = apyInfo
        return _data
      })
      console.log(
        'POOLS_LIST---data--',
        // POOLS_LIST,
        // allPoolsInfo,
        // allPoolsUserInfo,
        data
      )
      return data
    } catch (error) {
      console.log('POOLS_LIST---error---', error)
      return POOLS_LIST
    }
  }, [POOLS_LIST, allPoolsInfo, allPoolsUserInfo, allPoolsApyInfo])

  return {
    pageData,
    canClaim,
  }
}

export default useGaugeController
