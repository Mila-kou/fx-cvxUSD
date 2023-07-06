import React, { useEffect, useMemo, useState } from 'react'
import Button from '@/components/Button'
import useWeb3 from '@/hooks/useWeb3'
import DepositModal from './components/DepositModal'
import WithdrawModal from './components/WithdrawModal'

import { POOLS_LIST } from '@/config/aladdinVault'

import styles from './styles.module.scss'
import useStabiltyPool_c from './controller/c_stabiltyPool'
import { useFX_stabilityPool } from '@/hooks/useContracts'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import config from '@/config/index'
import { checkNotZoroNum } from '@/utils/index'

const item = POOLS_LIST[0]

export default function StabilityPoolPage() {
  const { currentAccount, isAllReady } = useWeb3()
  const { contract: FX_StabilityPoolContract } = useFX_stabilityPool()
  const {
    stabilityPoolInfo,
    stabilityPoolTotalSupply,
    stabilityPoolTotalSupplyTvl_text,
    userDeposit,
    userDepositTvl_text,
    userWstETHClaimableTvl_text,
    myTotalValue_text,
    userWstETHClaimable,
    userUnlockingBalance,
    userUnlockingBalanceTvl_text,
    userUnlockedBalance,
    userUnlockedBalanceTvl,
    userUnlockedBalanceTvl_text,
    apy,
  } = useStabiltyPool_c()

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
    if (!isAllReady) return
    try {
      setUnlocking(true)
      const apiCall = FX_StabilityPoolContract.methods.withdrawUnlocked(
        true,
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
      const apiCall = FX_StabilityPoolContract.methods.claim(
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
    if (userWstETHClaimable) {
      return true
    }
    return false
  }, [userWstETHClaimable])
  const canUnlock = useMemo(() => {
    return !!checkNotZoroNum(userUnlockedBalanceTvl)
  }, [userUnlockedBalanceTvl])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>f(x) Locker</h1>
        <p className="mt-[29px] text-[22px]">Overview</p>
        <p className="mt-[11px]">
          When the collateral rate is lower than 130% ,the deposited fETH will
          be used for liquidation.
        </p>
        <div className={styles.items}>
          <div className={styles.item}>
            <p>Total Deposited Value</p>
            <h2>${stabilityPoolTotalSupplyTvl_text}</h2>
            <p>{stabilityPoolTotalSupply} fETH</p>
          </div>
          <div className={styles.item}>
            <p>APY</p>
            <h2>{apy}%</h2>
          </div>
        </div>
      </div>

      <div className={styles.wrap}>
        <p className="text-[22px]">My Pool</p>
        <div className={styles.content}>
          <div className={styles.left}>
            <p>Total Value</p>
            <h2>${myTotalValue_text}</h2>
          </div>
          <div className={styles.right}>
            <div className="mt-[44px] flex gap-[80px]">
              <div>
                <p>Deposited fETH</p>
                <h2>${userDepositTvl_text}</h2>
                <p>{userDeposit} fETH</p>
              </div>
              <div>
                <p>Unlocked Funds</p>
                <h2>${userUnlockedBalanceTvl_text}</h2>
                <p>{userUnlockedBalance} fETH</p>

                <Button
                  type="second"
                  width="120px"
                  height="45px"
                  disabled={!canUnlock}
                  loading={unlocking}
                  onClick={handleUnlock}
                >
                  Unlock
                </Button>
              </div>
            </div>

            <div className="mt-[44px] flex gap-[80px]">
              <div>
                <p>Earned</p>
                <h2>${userWstETHClaimableTvl_text}</h2>
                <p>{userWstETHClaimable} stETH</p>
              </div>
              <div>
                <p>Locking</p>
                <h2>${userUnlockingBalanceTvl_text}</h2>
                <p>{userUnlockingBalance} fETH</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <Button
            width="120px"
            height="45px"
            className="mr-[25px]"
            onClick={handleDeposit}
          >
            Deposit
          </Button>
          <Button
            type="second"
            width="120px"
            height="45px"
            className="mr-[114px]"
            onClick={handleWithdraw}
          >
            Withdraw
          </Button>
          <Button
            type="second"
            width="120px"
            height="45px"
            disabled={!canClaim}
            loading={claiming}
            onClick={handleClaim}
          >
            Claim
          </Button>
        </div>
      </div>

      {depositVisible && (
        <DepositModal
          info={item}
          poolData={stabilityPoolInfo}
          onCancel={() => setDepositVisible(false)}
        />
      )}
      {withdrawVisible && (
        <WithdrawModal
          info={item}
          poolData={stabilityPoolInfo}
          onCancel={() => setWithdrawVisible(false)}
        />
      )}
    </div>
  )
}
