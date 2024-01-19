import { useEffect, useMemo, useState } from 'react'
import { cBN, checkNotZoroNum, fb4 } from 'utils'
import moment from 'moment'
import useData from '../hook/useData'
import { calc4 } from '../util'
import useGlobal from '@/hooks/useGlobal'
import useWeb3 from '@/hooks/useWeb3'

const useVeBoostDelegateShare_c = (refreshTrigger) => {
  const { tokens, tokenPrice } = useGlobal()
  const { info, contract } = useData(refreshTrigger)
  const { current, currentAccount } = useWeb3()

  const pageData = useMemo(() => {
    const {
      veTotalSupply,
      veLockedFXN,
      userLocked,
      userVeShare,
      delegatedBalanceRes,
      adjustedVeBalanceRes,
      receivedRes,
      receivedBalanceRes,
    } = info
    console.log('shareModal---', info)
    const _last_ve_balance = adjustedVeBalanceRes
    const _pageData = {
      userVeShare,
      veTotalSupply,
      veLockedFXN,
      userLocked,
      delegatedBalanceRes,
      adjustedVeBalanceRes,
      receivedRes,
      receivedBalanceRes,
      _last_ve_balance,
    }
    return _pageData
  }, [info, current])

  return pageData
}

export default useVeBoostDelegateShare_c
