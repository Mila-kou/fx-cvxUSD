import React, { useEffect, useMemo, useState } from 'react'
import useWeb3 from '@/hooks/useWeb3'
import useRebalancePool from './useRebalancePool'
import noPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import {
  useBoostableRebalancePool,
  useRebalanceWithBonusToken,
} from '@/hooks/useGaugeContracts'
import { REBALANCE_POOLS_LIST } from '@/config/aladdinVault'

export default function usePool({ infoKey }) {
  const { currentAccount, isAllReady, sendTransaction } = useWeb3()
  const _poolConfig = REBALANCE_POOLS_LIST.find(
    (item) => item.infoKey == infoKey
  )
  const { rebalancePoolAddress, rebalanceWithBonusTokenAddress } = _poolConfig
  const { contract: FX_RebalancePoolContract } =
    useBoostableRebalancePool(rebalancePoolAddress)

  const { contract: FX_RebalanceWithBonusTokenContract } =
    useRebalanceWithBonusToken(rebalanceWithBonusTokenAddress)

  const poolData = useRebalancePool(infoKey)

  const [depositVisible, setDepositVisible] = useState(false)
  const [withdrawVisible, setWithdrawVisible] = useState(false)
  const [claiming, setClaiming] = useState(false)

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
      setClaiming(false)
    } catch (error) {
      setClaiming(false)
      console.log('claim-error---', error)
      noPayableErrorAction(`error_claim`, error)
    }
  }

  return {
    ...poolData,
    _poolConfig,

    handleDeposit,
    handleWithdraw,
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
