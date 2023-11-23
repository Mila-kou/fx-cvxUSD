import React, { useEffect, useMemo, useState } from 'react'
import useWeb3 from '@/hooks/useWeb3'
import useRebalancePool from './useRebalancePool'
import { useContract, useFX_stETHTreasury } from '@/hooks/useContracts'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import config from '@/config/index'
import { cBN, checkNotZoroNum, dollarText } from '@/utils/index'
import abi from '@/config/abi'
import {
  useBoostableRebalancePool,
  useRebalanceWithBonusToken,
} from '@/hooks/useGaugeContracts'

export default function usePool({
  rebalancePoolAddress,
  rebalanceWithBonusTokenAddress,
  infoKey,
}) {
  const { currentAccount, isAllReady } = useWeb3()
  const { contract: FX_stETHTreasuryContract } = useFX_stETHTreasury()
  const { contract: FX_RebalancePoolContract } =
    useBoostableRebalancePool(rebalancePoolAddress)

  const { contract: FX_RebalanceWithBonusTokenContract } =
    useRebalanceWithBonusToken(rebalanceWithBonusTokenAddress)

  const poolData = useRebalancePool(infoKey)

  const {
    boostableRebalancePoolInfo,
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

  const [harvesting, setHarvesting] = useState(false)

  const handleDeposit = () => {
    if (!isAllReady) return
    setDepositVisible(true)
  }
  const handleWithdraw = () => {
    if (!isAllReady) return
    setWithdrawVisible(true)
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
      const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(() => apiCall.send({ from: currentAccount, gas }), {
        key: 'lp',
        action: 'Claim',
      })
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
      'boostableRebalancePoolInfo.userInfo?.claimableResd----claimableXETHRes---',
      boostableRebalancePoolInfo.userInfo?.claimableRes,
      boostableRebalancePoolInfo.userInfo?.claimableXETHRes
    )
    return {
      wstETH: checkNotZoroNum(
        boostableRebalancePoolInfo.userInfo?.claimableRes
      ),
      xETH: checkNotZoroNum(
        boostableRebalancePoolInfo.userInfo?.claimableXETHRes
      ),
    }
  }, [userWstETHClaimable, userXETHClaimable])

  const handleHarvest = async () => {
    if (!isAllReady) return
    try {
      setHarvesting(true)
      const apiCall = FX_stETHTreasuryContract.methods.harvest()
      const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(() => apiCall.send({ from: currentAccount, gas }), {
        key: 'lp',
        action: 'Harvest',
      })
      setHarvesting(false)
    } catch (error) {
      setHarvesting(false)
      console.log('harvest-error---', error)
      noPayableErrorAction(`error_harvest`, error)
    }
  }

  const handleLiquidatorWithBonus = async () => {
    try {
      // const _totalFETH = cBN(boostableRebalancePoolInfo.baseInfo?.stabilityPoolTotalSupplyRes).plus(boostableRebalancePoolInfo.baseInfo?.totalUnlockingRes).toString(10)
      const apiCall = FX_RebalanceWithBonusTokenContract.methods.liquidate(0)
      const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      const tx = await apiCall.send({ from: currentAccount, gas })
      console.log('liquidate success---', tx)
    } catch (error) {
      console.log('liquidate error', error)
    }
  }

  return {
    ...poolData,

    harvesting,
    handleHarvest,
    handleLiquidatorWithBonus,

    handleDeposit,
    handleWithdraw,
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
