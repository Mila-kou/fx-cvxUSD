import { useEffect, useState, useContext, useCallback, useMemo } from 'react'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import {
  cBN,
  checkNotZoroNum,
  checkNotZoroNumOption,
  fb4,
  numberLess,
} from '@/utils/index'
import { useGlobal } from '@/contexts/GlobalProvider'
import useGaugeData from '../hooks/useGaugeData'
import { POOLS_LIST } from '@/config/aladdinVault'
import { useContract } from '@/hooks/useContracts'
import abi from '@/config/abi'
import useGaugeApyEstimate from '@/hooks/useGaugeApyEstimate'

const useGaugeController = (LIST = POOLS_LIST) => {
  const { lpPrice, ConvexVaultsAPY, allGaugeBaseInfo } = useGlobal()
  const { tokenPrice } = useSelector((state) => state.token)
  const { getContract } = useContract()
  const { allPoolsUserInfo } = useGaugeData()
  const { GaugeList = [], allPoolsInfo, allPoolsApyInfo } = allGaugeBaseInfo
  const { getGaugeApy } = useGaugeApyEstimate()

  const _newGaugeList = useMemo(() => {
    return GaugeList.filter((item) => item.gaugeType == 0)
  }, [GaugeList])

  const _allPoolsUserInfo = useMemo(() => {
    return allPoolsUserInfo.filter((item) => item.gaugeType == 0)
  }, [allPoolsUserInfo])

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
        let _apys = []
        const convexLpApy = getLpConvexApy(lpAddress)
        if (rewardDatas && rewardDatas.length) {
          _apys = rewardDatas.map((baseApyData, index) => {
            let _currentApy = 0
            let _projectApy = 0
            const { rewardAddress } = baseApyData
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
              // const {
              //   rewardData: { finishAt, lastUpdate, rate },
              // } = baseApyData
              // _projectApy = 0
              // const rewardTokenPrice = getTokenPrice(rewardToken[0])
              // const _currTime = Math.ceil(new Date().getTime() / 1000)
              // const _lastFinishAt = cBN(finishAt)
              // if (cBN(_currTime).lt(_lastFinishAt) && cBN(totalSupply).gt(0)) {
              //   _currentApy = cBN(rate)
              //     .div(1e18)
              //     .times(config.yearSecond)
              //     .div(cBN(totalSupply).div(1e18).times(_lpPrice))
              //     .times(100)
              //     .times(rewardTokenPrice)
              //     .toFixed(2)
              // }
              // console.log(
              //   'apy--------name,rewardToken,_currTime,finishAt,totalSupply,rate,config.yearSecond,_lpPrice,rewardTokenPrice,_projectApy--',
              //   item.name,
              //   rewardToken[0],
              //   _currTime,
              //   finishAt,
              //   totalSupply,
              //   rate,
              //   config.yearSecond,
              //   _lpPrice,
              //   rewardTokenPrice,
              //   _currentApy,
              //   _projectApy
              // )
            }
            // allApy = allApy.plus(_currentApy)
            return {
              rewardToken,
              _currentApy,
              _projectApy,
            }
          })
        }
        const fxnApy = getGaugeApy(item)
        return {
          // allApy: allApy.toFixed(2),
          fxnApy,
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
      const { integrate_fractionRes, fxnMintedRes } = PoolsUserInfoItem || {}
      const _fxnReward = cBN(integrate_fractionRes).minus(fxnMintedRes)
      return _fxnReward
    },
    [_allPoolsUserInfo]
  )

  const getRewarItem = useCallback(
    (GaugeUserInfo, fxnRewardData, rewardName) => {
      if (
        !Object.keys(GaugeUserInfo).length &&
        !checkNotZoroNum(fxnRewardData)
      ) {
        return {
          userRewardTokenClaimableRes: 0,
          userRewardTokenClaimable_text: '-',
          userRewardTokenClaimableTvl: 0,
          userRewardTokenClaimableTvl_text: '-',
        }
      }
      let _rewardTokenNum = 0
      const _crvPrice = getTokenPrice('CRV')
      const _cvxPrice = getTokenPrice('CVX')
      const _fxnPrice = getTokenPrice('FXN')

      let _rewardTokenPrice = _crvPrice
      if (rewardName == 'CRV') {
        _rewardTokenNum = GaugeUserInfo?.userClaimables[0]
        _rewardTokenPrice = _crvPrice
      } else if (rewardName == 'CVX') {
        _rewardTokenNum = GaugeUserInfo?.userClaimables[1]
        _rewardTokenPrice = _cvxPrice
      } else if (rewardName == 'FXN') {
        _rewardTokenNum = fxnRewardData
        _rewardTokenPrice = _fxnPrice
      }
      const userRewardTokenClaimable_text = numberLess(
        checkNotZoroNumOption(
          _rewardTokenNum,
          fb4(_rewardTokenNum, false, 18, 2, false)
        ),
        0.01
      )
      let userRewardTokenClaimableTvl = cBN(0)
      if (
        checkNotZoroNum(_rewardTokenPrice) &&
        checkNotZoroNum(_rewardTokenNum)
      ) {
        userRewardTokenClaimableTvl =
          cBN(_rewardTokenPrice).times(_rewardTokenNum)
      }
      const userRewardTokenClaimableTvl_text = numberLess(
        checkNotZoroNumOption(
          userRewardTokenClaimableTvl,
          fb4(userRewardTokenClaimableTvl, false, 18, 2, false)
        ),
        0.01
      )
      return {
        userRewardTokenClaimableRes: _rewardTokenNum,
        userRewardTokenClaimable_text,
        userRewardTokenClaimableTvl,
        userRewardTokenClaimableTvl_text,
      }
    },
    [_newGaugeList]
  )
  const pageData = useMemo(() => {
    try {
      const data = LIST.map((item, index) => {
        const _baseInfo = _newGaugeList[index]?.baseInfo || {}
        const _rewardDatas = _newGaugeList[index]?.rewardDatas || {}

        const _userInfo = _allPoolsUserInfo[index]?.userInfo || {}
        const _lpPrice = getLpTokenPrice(item.lpAddress)
        const totalSupply_text = checkNotZoroNumOption(
          _baseInfo.totalSupply,
          fb4(_baseInfo.totalSupply)
        )
        const _tvl_wei = cBN(_baseInfo.totalSupply).times(_lpPrice)
        const tvl_text = checkNotZoroNumOption(
          _tvl_wei,
          `${fb4(_tvl_wei, true)}`
        )

        const userShare_text = checkNotZoroNumOption(
          _userInfo.userShare,
          fb4(_userInfo.userShare)
        )
        const userShare_tvl_wei = cBN(_userInfo.userShare).times(_lpPrice)
        const userShare_tvl_text = checkNotZoroNumOption(
          userShare_tvl_wei,
          `${fb4(userShare_tvl_wei, true)}`
        )
        const fxnRewardData = getUserFXNNum(_userInfo)
        const _lpGaugeContract = getContract(
          item.lpGaugeAddress,
          abi.FX_fx_SharedLiquidityGaugeABI
        )

        // FXN
        const {
          userRewardTokenClaimableRes: useFXNClaimable,
          userRewardTokenClaimable_text: useFXNClaimable_text,
          userRewardTokenClaimableTvl: useFXNClaimableTVL,
          userRewardTokenClaimableTvl_text: useFXNClaimableTVL_text,
        } = getRewarItem(_userInfo, fxnRewardData, 'FXN')
        // CRV
        const {
          userRewardTokenClaimableRes: useCRVClaimable,
          userRewardTokenClaimable_text: useCRVClaimable_text,
          userRewardTokenClaimableTvl: useCRVClaimableTVL,
          userRewardTokenClaimableTvl_text: useCRVClaimableTVL_text,
        } = getRewarItem(_userInfo, fxnRewardData, 'CRV')
        // CVX
        const {
          userRewardTokenClaimableRes: useCVXClaimable,
          userRewardTokenClaimable_text: useCVXClaimable_text,
          userRewardTokenClaimableTvl: useCVXClaimableTVL,
          userRewardTokenClaimableTvl_text: useCVXClaimableTVL_text,
        } = getRewarItem(_userInfo, fxnRewardData, 'CVX')

        const userTotalClaimable = useFXNClaimableTVL
          .plus(useCRVClaimableTVL)
          .plus(useCVXClaimableTVL)
        const userTotalClaimable_text = checkNotZoroNumOption(
          userTotalClaimable,
          fb4(userTotalClaimable, true)
        )

        const _data = {
          ...item,
          lpGaugeContract: _lpGaugeContract,
          baseInfo: _baseInfo,
          userInfo: _userInfo,
          useFXNClaimable,
          useFXNClaimable_text,
          useFXNClaimableTVL,
          useFXNClaimableTVL_text,
          useCRVClaimable,
          useCRVClaimable_text,
          useCRVClaimableTVL,
          useCRVClaimableTVL_text,
          useCVXClaimable,
          useCVXClaimable_text,
          useCVXClaimableTVL,
          useCVXClaimableTVL_text,
          userTotalClaimable,
          userTotalClaimable_text,
          rewardDatas: _rewardDatas,
          totalSupply_text,
          tvl_text,
          userShare_text,
          userShare_tvl_text,
        }
        const apyInfo = getApy(_data)
        _data.apyInfo = apyInfo
        return _data
      })
      console.log(
        'apy--------LIST---data--',
        // LIST,
        // allPoolsInfo,
        // allPoolsUserInfo,
        data
      )
      return data
    } catch (error) {
      console.log('gauge--LIST---error---', error)
      return LIST
    }
  }, [LIST, allPoolsInfo, _allPoolsUserInfo, allPoolsApyInfo])

  return {
    pageData,
    canClaim,
  }
}

export default useGaugeController
