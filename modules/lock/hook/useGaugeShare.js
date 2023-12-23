import { useCallback, useEffect, useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import moment from 'moment'
import config from 'config'
import abi from 'config/abi'
import { cBN, checkNotZoroNum, checkNotZoroNumOption } from 'utils'
import { useContract } from '@/hooks/useContracts'
import useWeb3 from '@/hooks/useWeb3'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import { REBALANCE_POOLS_LIST, POOLS_LIST } from '@/config/aladdinVault'

const useGaugeShare = () => {
  const { _currentAccount, blockNumber, web3, current } = useWeb3()
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
    try {
      const _gaugeContract = getGaugeContract(lpGaugeAddress)
      const { isStakerAllowed } = _gaugeContract.methods
      const callList = [isStakerAllowed(_currentAccount, receivedAddress)]
      const [IsStakerAllowedRes] = await multiCallsV2(callList)
      return {
        IsStakerAllowedRes,
      }
    } catch (error) {
      console.log('fetchIsStakerAllowed---', error)
      return false
    }
  }

  const fetchAllGaugeShare = async () => {
    console.log('fetchAllGaugeShare---11')
    const callList = POOLS_LIST.map((item) => {
      const { lpGaugeAddress } = item
      const _getGaugeContract = getGaugeContract(lpGaugeAddress)
      const { isStakerAllowed, getStakerVoteOwner } = _getGaugeContract.methods
      return {
        lpGaugeAddress,
        StakerVoteOwnerRes: getStakerVoteOwner(_currentAccount),
        isStakerAllowedRes: isStakerAllowed(_currentAccount, _currentAccount),
      }
    })
    try {
      console.log('fetchAllGaugeShare---22', callList)
      const data = await multiCallsV2(callList)
      console.log('fetchAllGaugeShare---33', data)
      return data
    } catch (error) {
      console.log('fetchAllGaugeShare---error', error)
      return []
    }
  }

  const [{ data: AllGaugeShare, refetch: fetchUserAllGaugeShare }] = useQueries(
    {
      queries: [
        {
          queryKey: ['AllGaugeShare'],
          queryFn: () => fetchAllGaugeShare(),
          initialData: [],
          enabled: !!web3,
        },
      ],
    }
  )

  useEffect(() => {
    fetchUserAllGaugeShare()
  }, [_currentAccount, blockNumber])

  return {
    getGaugeContract,
    fetchGaugeInfo,
    fetchIsStakerAllowed,
    AllGaugeShare,
  }
}

export default useGaugeShare
