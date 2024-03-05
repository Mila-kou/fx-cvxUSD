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
import { useGlobal } from '@/contexts/GlobalProvider'
import { REBALANCE_POOLS_LIST } from '@/config/aladdinVault'

export default function usePool({ infoKey }) {
  const { currentAccount, isAllReady, sendTransaction } = useWeb3()
  const { fx_info } = useGlobal()
  const { contract: FX_stETHTreasuryContract } = useFX_stETHTreasury()
  const _poolConfig = REBALANCE_POOLS_LIST.find(
    (item) => item.infoKey == infoKey
  )
  const { rebalancePoolAddress, rebalanceWithBonusTokenAddress } = _poolConfig
  const { contract: FX_RebalancePoolContract } =
    useBoostableRebalancePool(rebalancePoolAddress)

  const { contract: FX_RebalanceWithBonusTokenContract } =
    useRebalanceWithBonusToken(rebalanceWithBonusTokenAddress)

  const poolData = useRebalancePool(infoKey)
  const canLiquite = useMemo(() => {
    const { collateralRatioRes, marketConfigRes } = fx_info.baseInfo
    if (
      checkNotZoroNum(collateralRatioRes) &&
      checkNotZoroNum(marketConfigRes.stabilityRatio) &&
      cBN(collateralRatioRes).lt(marketConfigRes.stabilityRatio)
    ) {
      return true
    }
    return false
  }, [fx_info])

  const {
    boostableRebalancePoolInfo,
    userWstETHClaimable,
    userXETHClaimable,
    userUnlockedBalanceTvl,
  } = poolData

  const [depositVisible, setDepositVisible] = useState(false)
  const [withdrawVisible, setWithdrawVisible] = useState(false)
  const [claiming, setClaiming] = useState(false)

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
      setClaiming(true)

      console.log('handleClaim-----', symbol, wrap)

      const apiCall = FX_RebalancePoolContract.methods.claim(currentAccount)
      await NoPayableAction(
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
      setClaiming(false)
    } catch (error) {
      setClaiming(false)
      console.log('claim-error---', error)
      noPayableErrorAction(`error_claim`, error)
    }
  }

  const handleHarvest = async () => {
    if (!isAllReady) return
    try {
      setHarvesting(true)
      const apiCall = FX_stETHTreasuryContract.methods.harvest()
      await NoPayableAction(
        () =>
          sendTransaction({
            to: FX_stETHTreasuryContract._address,
            data: apiCall.encodeABI(),
          }),
        {
          key: 'lp',
          action: 'Harvest',
        }
      )
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
      const tx = await sendTransaction({
        to: FX_RebalanceWithBonusTokenContract._address,
        data: apiCall.encodeABI(),
      })
      console.log('liquidate success---', tx)
    } catch (error) {
      console.log('liquidate error', error)
    }
  }

  return {
    ...poolData,
    _poolConfig,
    harvesting,
    handleHarvest,
    handleLiquidatorWithBonus,

    handleDeposit,
    handleWithdraw,
    canLiquite,
    claiming,
    handleClaim,

    depositVisible,
    setDepositVisible,
    withdrawVisible,
    setWithdrawVisible,

    FX_RebalancePoolContract,
    FX_RebalanceWithBonusTokenContract,
  }
}
