import { useCallback, useEffect, useState } from 'react'
import moment from 'moment'
import config from 'config'
import abi from 'config/abi'
import { cBN, checkNotZoroNum, checkNotZoroNumOption } from 'utils'
import { useContract } from '@/hooks/useContracts'
import useWeb3 from '@/hooks/useWeb3'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'

const useGaugeShare = () => {
  const { _currentAccount, blockNumber, current } = useWeb3()
  const { getContract } = useContract()
  const multiCallsV2 = useMutiCallV2()

  const getGaugeContract = useCallback(
    (lpGaugeAddress) => {
      const _lpGaugeContract = getContract(
        lpGaugeAddress,
        abi.FX_fx_SharedLiquidityGaugeABI
      )
      return _lpGaugeContract
    },
    [getContract]
  )

  const fetchGaugeInfo = async (lpGaugeAddress) => {
    const _gaugeContract = getGaugeContract(lpGaugeAddress)
    const { getStakerVoteOwner } = _gaugeContract.methods
    const callList = [getStakerVoteOwner(_currentAccount)]
    const [stakerVoteOwnerRes] = await multiCallsV2(callList)
    return {
      stakerVoteOwnerRes,
    }
  }

  const fetchIsStakerAllowed = async (lpGaugeAddress, receivedAddress) => {
    const _gaugeContract = getGaugeContract(lpGaugeAddress)
    const { isStakerAllowed } = _gaugeContract.methods
    const callList = [isStakerAllowed(_currentAccount, receivedAddress)]
    const [IsStakerAllowedRes] = await multiCallsV2(callList)
    return {
      IsStakerAllowedRes,
    }
  }

  return {
    getGaugeContract,
    fetchGaugeInfo,
    fetchIsStakerAllowed,
  }
}

export default useGaugeShare
