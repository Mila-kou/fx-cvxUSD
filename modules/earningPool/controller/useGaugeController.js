import { useEffect, useState, useContext, useCallback, useMemo } from 'react'
import moment from 'moment'
import { cBN, checkNotZoroNum, checkNotZoroNumOption, fb4 } from '@/utils/index'
import { useGlobal } from '@/contexts/GlobalProvider'
import config from '@/config/index'
import useWeb3 from '@/hooks/useWeb3'
import useGaugeData from '../hooks/useGaugeData'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import { POOLS_LIST } from '@/config/aladdinVault'

const useGaugeController = () => {
  const globalState = useGlobal()
  const { currentAccount, isAllReady } = useWeb3()
  const { allPoolsInfo, allPoolsUserInfo } = useGaugeData()
  const [depositVisible, setDepositVisible] = useState(false)
  const [withdrawVisible, setWithdrawVisible] = useState(false)
  const [claiming, setClaiming] = useState({
    wstETH: false,
    xETH: false,
  })
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

  const pageData = useMemo(() => {
    try {
      const data = POOLS_LIST.map((item, index) => {
        const _baseInfo = allPoolsInfo[index]?.baseInfo || {}
        const _userInfo = allPoolsInfo[index]?.userInfo || {}
        const tvl_text = checkNotZoroNumOption(
          _baseInfo.totalSupply,
          fb4(_baseInfo.totalSupply)
        )
        const userShare_text = checkNotZoroNumOption(
          _userInfo.userShare,
          fb4(_userInfo.userShare)
        )
        return {
          ...item,
          baseInfo: _baseInfo,
          userInfo: _userInfo,
          tvl_text,
          userShare_text,
        }
      })
      console.log(
        'POOLS_LIST---data--',
        POOLS_LIST,
        allPoolsInfo,
        allPoolsUserInfo,
        data
      )
      return data
    } catch (error) {
      console.log('POOLS_LIST---error---', error)
      return POOLS_LIST
    }
  }, [POOLS_LIST, allPoolsInfo, allPoolsUserInfo])

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
