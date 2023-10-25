import React, { useState } from 'react'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import useVesting from '../controller/useVesting'
import { useFXNVesting, useFX_ManageableVesting } from '@/hooks/useContracts'
import useWeb3 from '@/hooks/useWeb3'
import Cell from './Cell'
import { fb4 } from '@/utils/index'

export default function SDFXN() {
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
    statkeDaoRewards,
    handleClaim: handleClaimFn,
    handleClaimReward: handleClaimRewardFn,
  } = useVesting(refreshTrigger)

  const handleClaim = async () => {
    const _index = 2
    handleClaimFn(_index, setClaiming, setRefreshTrigger)
  }

  const handleClaimReward = async () => {
    const _index = 2
    handleClaimRewardFn(_index, setClaiming, setRefreshTrigger)
  }

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

    symbol: 'sdFXN',
    rewards: [
      {
        icon: '/tokens/sdt.svg',
        symbol: 'SDT',
        amount: fb4(statkeDaoRewards),
        iconSize: '18px',
      },
      // {
      //   icon: '/images/FXN.svg',
      //   symbol: 'FXN',
      //   amount: '100,000',
      // },
      // {
      //   icon: '/tokens/steth.svg',
      //   symbol: 'wstETH',
      //   amount: '100,000',
      //   iconSize: '20px',
      // },
    ],

    claimRewarding,
    handleClaimReward,
  }

  return <Cell {...data} title="Converted sdFXN Token" />
}
