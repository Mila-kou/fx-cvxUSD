import React, { useEffect, useMemo, useState } from 'react'
import Button from '@/components/Button'
import useWeb3 from '@/hooks/useWeb3'
import DepositModal from './components/DepositModal'
import WithdrawModal from './components/WithdrawModal'

import { POOLS_LIST } from '@/config/aladdinVault'

import styles from './styles.module.scss'
import useStabiltyPool_c from './controller/c_stabiltyPool'

const item = POOLS_LIST[0]

export default function StabilityPoolPage() {
  const { currentAccount, isAllReady } = useWeb3()
  const { stabilityPoolTotalSupply,
    stabilityPoolTotalSupplyTvl_text,
    userDeposit,
    userDepositTvl_text } = useStabiltyPool_c()

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

  const handleClaim = () => {
    if (!isAllReady) return
    setClaiming(true)
  }

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
            <p>Last 7 Days APY</p>
            <h2>12%</h2>
            <p>Daily 0.0328%</p>
          </div>
        </div>
      </div>

      <div className={styles.wrap}>
        <p className="text-[22px]">My Pool</p>
        <div className={styles.content}>
          <div className={styles.left}>
            <p>Total Value</p>
            <h2>${stabilityPoolTotalSupplyTvl_text}</h2>
          </div>
          <div className={styles.right}>
            <p>Deposited fETH</p>
            <h2>${userDepositTvl_text}</h2>
            <p>{userDeposit} fETH</p>

            <div className="mt-[44px] flex gap-[80px]">
              <div>
                <p>fxETH Earned</p>
                <h2>$18,888.88</h2>
                <p>18,888.88 fxETH</p>
              </div>
              <div>
                <p>fx Earned</p>
                <h2>$18,888.88</h2>
                <p>18,888.88 fx</p>
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
            loading={claiming}
            onClick={handleClaim}
          >
            Claim
          </Button>
        </div>
      </div>

      {depositVisible && (
        <DepositModal info={item} onCancel={() => setDepositVisible(false)} />
      )}
      {withdrawVisible && (
        <WithdrawModal info={item} onCancel={() => setWithdrawVisible(false)} />
      )}
    </div>
  )
}
