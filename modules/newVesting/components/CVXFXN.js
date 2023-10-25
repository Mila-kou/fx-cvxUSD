import React, { useCallback, useState } from 'react'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import useVesting from '../controller/useVesting'
import { useFXNVesting } from '@/hooks/useContracts'
import useWeb3 from '@/hooks/useWeb3'
import Cell from './Cell'
import { fb4 } from '@/utils/index'
import config from '@/config/index'

export default function CVXFXN() {
  const { currentAccount } = useWeb3()
  const [claiming, setClaiming] = useState(false)
  const [claimRewarding, setClaimRewarding] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const {
    canClaim,
    canClaimText,
    totalClaimAble,
    notYetVestedText,
    newList,
    startTime,
    startTimeText,
    latestTime,
    latestTimeText,
    claimedAmount,
    claimedAmountInWei,
    convexRewards,
  } = useVesting(refreshTrigger)
  const { contract: vestContract } = useFXNVesting()

  const handleClaim = async () => {
    try {
      setClaiming(true)
      const apiCall = vestContract.methods.claim()
      const estimatedGas = await apiCall.estimateGas({
        from: currentAccount,
      })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(() => apiCall.send({ from: currentAccount, gas }), {
        key: 'Claim',
        action: 'Claim',
      })
      setClaiming(false)
      setRefreshTrigger((prev) => prev + 1)
    } catch (error) {
      setClaiming(false)
      noPayableErrorAction(`error_earn_approve`, error)
    }
  }

  const handleClaimReward = async () => {}

  const getRewardsData = useCallback(
    (token) => {
      if (convexRewards) {
        const _data = convexRewards.find(
          (item) => item.token.toLowerCase() == token.toLowerCase()
        )
        if (_data) {
          return fb4(_data.amount)
        }
      }
      return 0
    },
    [convexRewards]
  )

  const data = {
    canClaim,
    claiming,
    handleClaim,

    totalClaimAble,
    canClaimText,
    notYetVestedText,
    claimedAmount,

    startTime,
    startTimeText,
    latestTime,
    latestTimeText,

    symbol: 'cvxFXN',
    rewards: [
      {
        icon: '/tokens/cvx.svg',
        symbol: 'CVX',
        amount: getRewardsData(config.tokens.cvx),
      },
      {
        icon: '/images/FXN.svg',
        symbol: 'FXN',
        amount: getRewardsData(config.contracts.FXN),
      },
      {
        icon: '/tokens/steth.svg',
        symbol: 'wstETH',
        amount: getRewardsData(config.tokens.wstETH),
        iconSize: '20px',
      },
    ],

    claimRewarding,
    handleClaimReward,
  }

  return <Cell {...data} title="Converted cvxFXN Token" />
}
