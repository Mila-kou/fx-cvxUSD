import { useCallback, useEffect, useMemo, useState } from 'react'
import { cBN, checkNotZoroNum, fb4 } from 'utils'
import abi from 'config/abi'
import moment from 'moment'
import useData from '../hook/useData'
import { calc4 } from '../util'
import useGlobal from '@/hooks/useGlobal'
import useWeb3 from '@/hooks/useWeb3'
import { useContract } from '@/hooks/useContracts'
import useGaugeShare from '../hook/useGaugeShare'

const useVeShare_c = (refreshTrigger) => {
  const { tokens, tokenPrice } = useGlobal()
  const { info, contract } = useData(refreshTrigger)
  const { current, currentAccount } = useWeb3()
  const { getContract } = useContract()
  const { getGaugeContract, fetchGaugeInfo, fetchIsStakerAllowed } =
    useGaugeShare()

  const pageData = useMemo(() => {
    return {}
  }, [info, current])

  return {
    getGaugeContract,
    fetchGaugeInfo,
    fetchIsStakerAllowed,
    pageData,
  }
}

export default useVeShare_c
