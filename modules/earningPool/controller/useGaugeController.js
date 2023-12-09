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
import useGaugeApyEstimate from '@/hooks/useGaugeApyEstimate'

const useGaugeController = () => {
  const globalState = useGlobal()
  const { lpPrice, tokenPrice, ConvexVaultsAPY, allGaugeBaseInfo } = globalState
  const { currentAccount, isAllReady } = useWeb3()
  const { getContract } = useContract()
  const { allPoolsUserInfo } = useGaugeData()
  const { GaugeList, allPoolsInfo, allPoolsApyInfo } = allGaugeBaseInfo
  const { getGaugeEstimate, getGaugeApy } = useGaugeApyEstimate()

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
        const _convexLpInfo =
          ConvexVaultsAPY &&
          ConvexVaultsAPY.find(
            (item) => item.address.toLowerCase() == lpAddress.toLowerCase()
          )
        if (_convexLpInfo && _convexLpInfo.name) {
          return {
            apy: _convexLpInfo.apy,
            currentApys: _convexLpInfo.currentApys,
            projectApys: _convexLpInfo.curveApys,
          }
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

  const getApy = useCallback(
    (item) => {
      try {
        const {
          baseInfo = {},
          lpAddress,
          rewardDatas,
          rewardTokens,
        } = item || {}
        const { totalSupply } = baseInfo
        let allApy = cBN(0)
        let _apys = []
        const convexLpApy = getLpConvexApy(lpAddress)
        console.log('apy----c_1--', rewardDatas, convexLpApy)
        if (rewardDatas && rewardDatas.length) {
          _apys = rewardDatas.map((baseApyData, index) => {
            let _currentApy = 0
            let _projectApy = 0
            const {
              rewardData: { finishAt, lastUpdate, rate },
              rewardAddress,
            } = baseApyData
            const _lpPrice = getLpTokenPrice(lpAddress)
            let rewardToken = rewardTokens.find(
              (_tokenData) =>
                _tokenData[1].toLowerCase() == rewardAddress.toLowerCase()
            )

            if (!rewardToken) {
              rewardToken = ['', '']
              _currentApy = 0
              _projectApy = 0
            } else {
              console.log('apy----2--')
              if (
                baseApyData.rewardAddress.toLowerCase() ==
                config.tokens.FXN.toLowerCase()
              ) {
                _projectApy = getGaugeApy(item)
                console.log('apy----3--', _projectApy)
              } else {
                _projectApy = 0
              }
              const rewardTokenPrice = getTokenPrice(rewardToken[0])
              const _currTime = Math.ceil(new Date().getTime() / 1000)
              const _lastFinishAt = cBN(finishAt).plus(24 * 60 * 60 * 7)
              if (cBN(_currTime).lt(_lastFinishAt) && cBN(totalSupply).gt(0)) {
                _currentApy = cBN(rate)
                  .div(1e18)
                  .times(config.yearSecond)
                  .div(cBN(totalSupply).div(1e18).times(_lpPrice))
                  .times(100)
                  .times(rewardTokenPrice)
                  .toFixed(2)
              }
              console.log(
                'apy--------name,rewardToken,_currTime,finishAt,totalSupply,rate,config.yearSecond,_lpPrice,rewardTokenPrice,_projectApy--',
                item.name,
                rewardToken[0],
                _currTime,
                finishAt,
                totalSupply,
                rate,
                config.yearSecond,
                _lpPrice,
                rewardTokenPrice,
                _currentApy,
                _projectApy
              )
            }
            // allApy = allApy.plus(_currentApy)
            return {
              rewardToken,
              _currentApy,
              _projectApy,
            }
          })
        }

        return {
          // allApy: allApy.toFixed(2),
          apyList: _apys,
          convexLpApy,
        }
      } catch (error) {
        console.log('apy----c_error--', error)
        return {
          allApy: 0,
          apyList: [],
          convexLpApy: {},
        }
      }
    },
    [allGaugeBaseInfo, getGaugeApy, ConvexVaultsAPY]
  )

  const getUserFXNNum = useCallback(
    (PoolsUserInfoItem) => {
      const {
        snapshotRes,
        userSnapshotRes,
        workingBalanceRes,
        integrate_fractionRes,
      } = PoolsUserInfoItem || {}
      if (!checkNotZoroNum(PoolsUserInfoItem.workingBalanceRes)) {
        return 0
      }
      const rewards_pending_fxn = cBN(userSnapshotRes.rewards.pending)
        .plus(
          cBN(workingBalanceRes)
            .times(
              cBN(snapshotRes.integral).minus(
                userSnapshotRes.checkpoint.integral
              )
            )
            .div(1e18)
        )
        .toFixed(0)
      // console.log(
      //   'rewards_pending_fxn--workingBalanceRes--snapshotRes--userSnapshotRes--integrate_fractionRes----',
      //   rewards_pending_fxn,
      //   workingBalanceRes,
      //   snapshotRes,
      //   userSnapshotRes,
      //   integrate_fractionRes
      // )
      return rewards_pending_fxn
    },
    [allPoolsUserInfo]
  )

  const pageData = useMemo(() => {
    try {
      const data = POOLS_LIST.map((item, index) => {
        const _baseInfo = GaugeList[index].baseInfo || {}
        const _rewardDatas = GaugeList[index].rewardDatas || {}
        const _userInfo = allPoolsUserInfo[index]?.userInfo || {}
        const tvl_text = checkNotZoroNumOption(
          _baseInfo.totalSupply,
          fb4(_baseInfo.totalSupply)
        )
        const userShare_text = checkNotZoroNumOption(
          _userInfo.userShare,
          fb4(_userInfo.userShare)
        )
        const fxnRewardData = getUserFXNNum(_userInfo)
        const _lpGaugeContract = getContract(
          item.lpGaugeAddress,
          abi.FX_fx_SharedLiquidityGaugeABI
        )
        const _data = {
          ...item,
          lpGaugeContract: _lpGaugeContract,
          baseInfo: _baseInfo,
          userInfo: _userInfo,
          useFXNReward: fxnRewardData,
          useFXNReward_text: checkNotZoroNumOption(
            fxnRewardData,
            fb4(fxnRewardData)
          ),
          rewardDatas: _rewardDatas,
          tvl_text,
          userShare_text,
        }
        const apyInfo = getApy(_data)
        _data.apyInfo = apyInfo
        return _data
      })
      console.log(
        'apy--------POOLS_LIST---data--',
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
