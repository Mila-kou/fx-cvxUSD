import React, { useEffect, useMemo, useState } from 'react'
import useWeb3 from '@/hooks/useWeb3'
import useStabiltyPool from '../controller/useStabiltyPool'
import { useContract } from '@/hooks/useContracts'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import config from '@/config/index'
import { cBN, checkNotZoroNum, dollarText } from '@/utils/index'
import abi from '@/config/abi'

export default function usePool({ rebalancePoolAddress, infoKey }) {
  const { currentAccount, isAllReady } = useWeb3()
  const { contract: FX_RebalancePoolContract } = useContract(
    rebalancePoolAddress,
    abi.FX_RebalancePoolABI
  )

  const {
    stabilityPoolTotalSupplyTvl_text,
    stabilityPoolTotalSupply,
    stabilityPoolInfo,
    userDeposit,
    userDepositTvl_text,
    userWstETHClaimableTvl_text,
    myTotalValue_text,
    userWstETHClaimable,
    userUnlockingBalance,
    userUnlockingUnlockAt,
    userUnlockedBalance,
    userUnlockedBalanceTvl,
    apy,
  } = useStabiltyPool(infoKey)

  const [depositVisible, setDepositVisible] = useState(false)
  const [withdrawVisible, setWithdrawVisible] = useState(false)
  const [claiming, setClaiming] = useState(false)
  const [unlocking, setUnlocking] = useState(false)

  const handleDeposit = () => {
    if (!isAllReady) return
    setDepositVisible(true)
  }
  const handleWithdraw = () => {
    if (!isAllReady) return
    setWithdrawVisible(true)
  }

  const handleUnlock = async () => {
    if (unlocking || !canUnlock) return
    if (!isAllReady) return
    try {
      setUnlocking(true)
      const apiCall = FX_RebalancePoolContract.methods.withdrawUnlocked(
        false,
        true
      )
      const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(() => apiCall.send({ from: currentAccount, gas }), {
        key: 'lp',
        action: 'Unlock',
      })
      setUnlocking(false)
    } catch (error) {
      setUnlocking(false)
      console.log('unlock-error---', error)
      noPayableErrorAction(`error_unlock`, error)
    }
  }

  const handleClaim = async () => {
    if (!isAllReady) return
    try {
      setClaiming(true)
      const apiCall = FX_RebalancePoolContract.methods.claim(
        config.tokens.wstETH,
        true
      )
      const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(() => apiCall.send({ from: currentAccount, gas }), {
        key: 'lp',
        action: 'Claim',
      })
      setClaiming(false)
    } catch (error) {
      setClaiming(false)
      console.log('claim-error---', error)
      noPayableErrorAction(`error_claim`, error)
    }
  }

  const canClaim = useMemo(() => {
    console.log(
      'stabilityPoolInfo.userInfo?.claimableResd--',
      stabilityPoolInfo.userInfo?.claimableRes
    )
    if (checkNotZoroNum(stabilityPoolInfo.userInfo?.claimableRes)) {
      return true
    }
    return false
  }, [userWstETHClaimable])

  const canUnlock = useMemo(() => {
    return !!checkNotZoroNum(userUnlockedBalanceTvl)
  }, [userUnlockedBalanceTvl])

  return {
    handleDeposit,
    handleWithdraw,
    canUnlock,
    handleUnlock,
    canClaim,
    claiming,
    handleClaim,

    stabilityPoolTotalSupplyTvl_text,
    stabilityPoolTotalSupply,
    stabilityPoolInfo,
    userDeposit,
    userDepositTvl_text,
    userWstETHClaimableTvl_text,
    myTotalValue_text,
    userWstETHClaimable,
    userUnlockingBalance,
    userUnlockingUnlockAt,
    userUnlockedBalance,
    apy,

    depositVisible,
    setDepositVisible,
    withdrawVisible,
    setWithdrawVisible,

    FX_RebalancePoolContract,
  }
}
