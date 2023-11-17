import { useEffect, useState, useContext, useCallback, useMemo } from 'react'
import moment from 'moment'
import { cBN, checkNotZoroNum, checkNotZoroNumOption, fb4 } from '@/utils/index'
import { useGlobal } from '@/contexts/GlobalProvider'
import config from '@/config/index'
import useWeb3 from '@/hooks/useWeb3'
import useGaugeData from '../hooks/useGaugeData'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import { POOLS_LIST } from '@/config/aladdinVault'
import { useContract } from '@/hooks/useContracts'
import abi from '@/config/abi'

const useGaugeController = () => {
  const globalState = useGlobal()
  const { lpPrice, tokenPrice } = globalState
  const { currentAccount, isAllReady } = useWeb3()
  const { getContract } = useContract()
  const { allPoolsInfo, allPoolsUserInfo, allPoolsApyInfo } = useGaugeData()
  const [depositVisible, setDepositVisible] = useState(false)
  const [withdrawVisible, setWithdrawVisible] = useState(false)
  const [claiming, setClaiming] = useState({
    wstETH: false,
    xETH: false,
  })

  console.log('vaultsPrice----', lpPrice)

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

  const handleDeposit = () => {
    if (!isAllReady) return
    setDepositVisible(true)
  }
  const handleWithdraw = () => {
    if (!isAllReady) return
    setWithdrawVisible(true)
  }
  const handleClaim = async (symbol, wrap) => {
    if (!isAllReady) return
    try {
      setClaiming({
        ...claiming,
        [symbol]: true,
      })

      // console.log('handleClaim-----', symbol, wrap)

      // const apiCall = FX_RebalancePoolContract.methods.claim(
      //   config.tokens[symbol],
      //   wrap
      // )
      // const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
      // const gas = parseInt(estimatedGas * 1.2, 10) || 0
      // await NoPayableAction(() => apiCall.send({ from: currentAccount, gas }), {
      //   key: 'lp',
      //   action: 'Claim',
      // })
      setClaiming({
        ...claiming,
        [symbol]: false,
      })
    } catch (error) {
      setClaiming({
        ...claiming,
        [symbol]: false,
      })
      console.log('claim-error---', error)
      noPayableErrorAction(`error_claim`, error)
    }
  }

  const canClaim = useMemo(() => {
    return false
  }, [])

  const getApy = useCallback((item) => {
    const { totalSupply, lpAddress, rewardDatas, rewardTokens } = item
    const _apys =
      rewardDatas &&
      rewardDatas.map((baseApyData, index) => {
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
          return 0
        }
        const rewardTokenPrice = getTokenPrice(rewardToken[0])
        let _apy = 0
        const _currTime = Math.ceil(new Date().getTime() / 1000)
        if (cBN(_currTime).gt(finishAt) && cBN(totalSupply).lt(0)) {
          _apy = cBN(rate)
            .div(1e18)
            .times(config.yearSecond)
            .div(cBN(totalSupply).div(1e18).times(_lpPrice))
            .times(100)
            .times(rewardTokenPrice)
            .toFixed(2)
        }
        return {
          rewardToken,
          _apy,
        }
      })
    return _apys
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
        const apys = getApy(_data)
        _data.apys = apys
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
    setDepositVisible,
    setWithdrawVisible,
    setClaiming,
    canClaim,
    handleDeposit,
    handleWithdraw,
    handleClaim,
  }
}

export default useGaugeController
