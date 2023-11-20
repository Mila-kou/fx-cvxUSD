import { useCallback, useContext, useEffect, useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import abi from 'config/abi'
import {
  useContract,
  useVeFXN,
  useFxGaugeController,
} from '@/hooks/useContracts'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import useWeb3 from '@/hooks/useWeb3'
import { POOLS_LIST } from '@/config/aladdinVault'

const useVoteData = () => {
  const { _currentAccount, web3, isAllReady, blockNumber } = useWeb3()
  const { getContract } = useContract()
  const { contract: veContract } = useVeFXN()
  const { contract: gaugeControllerContract } = useFxGaugeController()
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

  const fetchAllPoolVoteData = useCallback(
    async (arr) => {
      try {
        const {
          vote_user_slopes,
          vote_user_power,
          last_user_vote,
          get_gauge_weight,
        } = gaugeControllerContract.methods

        const { balanceOf } = veContract.methods

        const voteCalls = arr.map((item, index) => {
          const allowanceContractAddr = item.lpGaugeAddress
          const _lpGaugeContract = getGaugeContract(item.lpGaugeAddress)
          // const {} = _lpGaugeContract.methods
          return {
            ...item,
            voteInfo: {
              // end、power、slope
              voteSlope: vote_user_slopes(_currentAccount, item.lpGaugeAddress),
              lastVote: last_user_vote(_currentAccount, item.lpGaugeAddress),
              gaugeWeight: get_gauge_weight(item.lpGaugeAddress),
            },
          }
        })
        const [allVoteData, _votePower, veFXNAmount] = await multiCallsV2(
          [
            voteCalls,
            vote_user_power(_currentAccount),
            balanceOf(_currentAccount),
          ],
          {
            from: _currentAccount,
          }
        )
        console.log(
          'allVoteData--votePower---veFXNAmount-',
          allVoteData,
          _votePower / 100,
          veFXNAmount
        )
        return {
          allVoteData,
          votePower: _votePower / 100,
          veFXNAmount,
        }
      } catch (error) {
        console.log('allVoteData----error', error)
        return {
          allVoteData: [],
          votePower: 0,
          veFXNAmount: 0,
        }
      }
    },
    [getContract, multiCallsV2, _currentAccount]
  )

  const [{ data: voteInfo, refetch: refetchVoteInfo }] = useQueries({
    queries: [
      {
        queryKey: ['voteInfo', _currentAccount],
        queryFn: () => fetchAllPoolVoteData(POOLS_LIST),
        enabled: isAllReady,
        initialData: {
          allVoteData: [],
          votePower: 0,
          veFXNAmount: 0,
        },
      },
    ],
  })

  useEffect(() => {
    refetchVoteInfo()
  }, [_currentAccount, blockNumber])

  return voteInfo
}

export default useVoteData
