import React, { useCallback, useMemo, useState } from 'react'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import useVesting from '../controller/useVesting'
import { useFX_ManageableVesting } from '@/hooks/useContracts'
import useWeb3 from '@/hooks/useWeb3'
import Cell from './Cell'
import { fb4, numberLess } from '@/utils/index'
import config from '@/config/index'

export default function CVXFXN() {
  const { currentAccount } = useWeb3()
  const [claiming, setClaiming] = useState(false)
  const [claimRewarding, setClaimRewarding] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const {
    canClaim_1: canClaim,
    canClaim_1_Text: canClaimText,
    convexRewards,
    getBatchsInfo,
    newList_convex,
    handleClaim: handleClaimFn,
    handleClaimReward: handleClaimRewardFn,
  } = useVesting(refreshTrigger)

  const {
    startTime,
    latestTime,
    claimedAmountInWei,
    totalClaimAbleInWei,
    claimedAmount,
    totalClaimAble,
    notYetVested,
    notYetVestedText,
    startTimeText,
    latestTimeText,
  } = useMemo(() => {
    return getBatchsInfo(newList_convex, '1')
  }, [newList_convex])

  console.log('newList_convex--', newList_convex)

  const handleClaim = async () => {
    const _index = 1
    handleClaimFn(_index, setClaiming, setRefreshTrigger)
  }

  const handleClaimReward = async () => {
    const _index = 1
    handleClaimRewardFn(_index, setClaimRewarding, setRefreshTrigger)
  }

  const getRewardsData = useCallback(
    (token) => {
      if (convexRewards) {
        const _data = convexRewards.find(
          (item) => item.token.toLowerCase() == token.toLowerCase()
        )
        if (_data) {
          return numberLess(fb4(_data.amount), 0.01)
        }
      }
      return 0
    },
    [convexRewards]
  )

  const rewards = [
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
      iconSize: '22',
    },
  ]

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
    rewards,

    claimRewarding,
    handleClaimReward,

    canClaimReward: !!rewards.find((item) => item.amount !== '-'),
  }

  return <Cell {...data} title="Converted cvxFXN Token" />
}
