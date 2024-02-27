import { useCallback, useContext, useEffect, useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import abi from 'config/abi'
import {
  useContract,
  useVeFXN,
  useFxGaugeController,
  useFXN,
} from '@/hooks/useContracts'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import useWeb3 from '@/hooks/useWeb3'
import { GAUGE_LIST } from '@/config/aladdinVault'

const useVoteData = () => {
  const { _currentAccount, current, web3, isAllReady, blockNumber } = useWeb3()
  const { getContract } = useContract()
  const { contract: veContract } = useVeFXN()
  const multiCallsV2 = useMutiCallV2()
  const { contract: FxGaugeControllerContract } = useFxGaugeController()

  const {
    vote_user_slopes,
    vote_user_power,
    last_user_vote,
    get_gauge_weight,
    gauge_relative_weight,
    checkpoint_gauge,
    time_total,
    get_total_weight,
    get_type_weight,
    n_gauge_types,
    get_weights_sum_per_type,
  } = FxGaugeControllerContract.methods

  const fetchAllPoolVoteData = useCallback(
    async (arr) => {
      try {
        const { balanceOf } = veContract.methods
        const voteCalls = arr.map((item, index) => {
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
        const [allVoteData, _votePower, veFXNAmount, lastScheduled] =
          await multiCallsV2(
            [
              voteCalls,
              vote_user_power(_currentAccount),
              balanceOf(_currentAccount),
              time_total(),
            ],
            {
              from: _currentAccount,
            }
          )
        console.log(
          'allVoteData-----veFXNAmount-',
          allVoteData,
          veFXNAmount,
          lastScheduled
        )
        return {
          allVoteData,
          votePower: _votePower / 100,
          veFXNAmount,
          lastScheduled,
        }
      } catch (error) {
        console.log('allVoteData----error', error)
        return {
          allVoteData: [],
          votePower: 0,
          veFXNAmount: 0,
          lastScheduled: 0,
        }
      }
    },
    [getContract, multiCallsV2, _currentAccount]
  )

  const [{ data: voteInfo, refetch: refetchVoteInfo }] = useQueries({
    queries: [
      {
        queryKey: ['voteInfo', _currentAccount],
        queryFn: () => fetchAllPoolVoteData(GAUGE_LIST),
        enabled: isAllReady,
        initialData: {
          allVoteData: [],
          votePower: 0,
          veFXNAmount: 0,
          lastScheduled: 0,
        },
      },
    ],
  })

  useEffect(() => {
    refetchVoteInfo()
  }, [_currentAccount, blockNumber])

  return { voteInfo }
}

export default useVoteData
