import { useEffect, useState, useContext, useCallback, useMemo } from 'react'
import moment from 'moment'
import { cBN, checkNotZoroNum, checkNotZoroNumOption, fb4 } from '@/utils/index'
import { useGlobal } from '@/contexts/GlobalProvider'
import config from '@/config/index'
import useWeb3 from '@/hooks/useWeb3'
import useGaugeData from '../hooks/useGaugeData'

const useGaugeController = () => {
  const globalState = useGlobal()

  const { current } = useWeb3()
  const { allPoolsInfo, allPoolsUserInfo } = useGaugeData()
  const pageData = useMemo(() => {
    try {
      return { allPoolsInfo, allPoolsUserInfo }
    } catch (error) {
      return {}
    }
  }, [])
  return {
    ...pageData,
  }
}

export default useGaugeController
