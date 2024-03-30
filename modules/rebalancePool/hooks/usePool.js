import React, { useEffect, useMemo, useState } from 'react'
import useWeb3 from '@/hooks/useWeb3'
import useStabiltyPool from '../controller/useStabiltyPool'
import { useContract } from '@/hooks/useContracts'
import noPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import config from '@/config/index'
import { cBN, checkNotZoroNum, dollarText } from '@/utils/index'
import abi from '@/config/abi'

export default function usePool({ rebalancePoolAddress }) {
  const { isAllReady, sendTransaction } = useWeb3()
  const { contract: FX_RebalancePoolContract } = useContract(
    rebalancePoolAddress,
    abi.FX_RebalancePoolABI
  )

  const poolData = useStabiltyPool()

  const {
    stabilityPoolInfo,
    userWstETHClaimable,
    userXETHClaimable,
    userUnlockedBalanceTvl,
  } = poolData

  const [depositVisible, setDepositVisible] = useState(false)
  const [withdrawVisible, setWithdrawVisible] = useState(false)
  const [claiming, setClaiming] = useState({
    wstETH: false,
    xETH: false,
  })
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
      await noPayableAction(
        () =>
          sendTransaction({
            to: FX_RebalancePoolContract._address,
            data: apiCall.encodeABI(),
          }),
        {
          key: 'lp',
          action: 'Unlock',
        }
      )
      setUnlocking(false)
    } catch (error) {
      setUnlocking(false)
      console.log('unlock-error---', error)
      noPayableErrorAction(`error_unlock`, error)
    }
  }

  const handleClaim = async (symbol, wrap) => {
    if (!isAllReady) return
    try {
      setClaiming({
        ...claiming,
        [symbol]: true,
      })

      console.log('handleClaim-----', symbol, wrap)

      const apiCall = FX_RebalancePoolContract.methods.claim(
        config.tokens[symbol],
        wrap
      )
      await noPayableAction(
        () =>
          sendTransaction({
            to: FX_RebalancePoolContract._address,
            data: apiCall.encodeABI(),
          }),
        {
          key: 'lp',
          action: 'Claim',
        }
      )
      setClaiming({
        ...claiming,
        [symbol]: false,
      })
    } catch (error) {
      setClaiming({
        ...claiming,
        [symbol]: false,
      })
      console.log('claim-error---', error)
      noPayableErrorAction(`error_claim`, error)
    }
  }

  const canClaim = useMemo(() => {
    console.log(
      'stabilityPoolInfo.userInfo?.claimableResd----claimableXETHRes---',
      stabilityPoolInfo.userInfo?.claimableRes,
      stabilityPoolInfo.userInfo?.claimableXETHRes
    )
    return {
      wstETH: checkNotZoroNum(stabilityPoolInfo.userInfo?.claimableRes),
      xETH: checkNotZoroNum(stabilityPoolInfo.userInfo?.claimableXETHRes),
    }
  }, [userWstETHClaimable, userXETHClaimable])

  const canUnlock = useMemo(() => {
    return !!checkNotZoroNum(userUnlockedBalanceTvl)
  }, [userUnlockedBalanceTvl])

  return {
    ...poolData,

    handleDeposit,
    handleWithdraw,
    canUnlock,
    handleUnlock,
    canClaim,
    claiming,
    handleClaim,

    depositVisible,
    setDepositVisible,
    withdrawVisible,
    setWithdrawVisible,

    FX_RebalancePoolContract,
  }
}
