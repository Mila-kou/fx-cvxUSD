import React, { useState } from 'react'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import useVesting from '../controller/useVesting'
import { useFXNVesting } from '@/hooks/useContracts'
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
      noPayableErrorAction(`error_Claim`, error)
    }
  }

  const handleClaimReward = async () => {}

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
