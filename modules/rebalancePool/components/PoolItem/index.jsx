import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Tooltip } from 'antd'
import cn from 'classnames'
import Button from '@/components/Button'
import { REBALANCE_POOLS_LIST } from '@/config/aladdinVault'
import DepositModal from '../DepositModal'
import WithdrawModal from '../WithdrawModal'
import styles from './styles.module.scss'
import { cBN, checkNotZoroNum, dollarText } from '@/utils/index'

const stETHImg = '/tokens/steth.svg'
const xETHImg = '/images/x-logo.svg'

const item = REBALANCE_POOLS_LIST[0]

export default function PoolItem({
  harvesting,
  handleHarvest,
  handleLiquidatorWithBonus,

  handleDeposit,
  handleWithdraw,
  canUnlock,
  handleUnlock,
  canClaim,
  claiming,
  handleClaim,

  stabilityPoolInfo,
  userDeposit,
  userDepositTvl_text,
  myTotalValue_text,
  userWstETHClaimable,
  userWstETHClaimableTvl_text,
  userXETHClaimable,
  userXETHClaimableTvl_text,
  userUnlockingBalance,
  userUnlockingUnlockAt,
  userUnlockedBalance,

  depositVisible,
  setDepositVisible,
  withdrawVisible,
  setWithdrawVisible,

  contractType,
  FX_RebalancePoolContract,

  title,
  hasXETH,
}) {
  return (
    <div>
      <div className={styles.poolWrap}>
        <div className={styles.content}>
          <div className={styles.left}>
            <p className="text-[22px]">{title}</p>
            <h2 className="text-[32px] mt-[10px]">
              {dollarText(myTotalValue_text)}
            </h2>
            <div className={cn(styles.item, styles.itemWrap, 'mt-[40px]')}>
              <div>
                <img src="/images/f-logo.svg" />
                <Link href="/assets/fETH/">
                  <p>Get fETH to Deposit →</p>
                </Link>
              </div>
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.cell}>
              <img src="/images/f-logo.svg" />
              <div className={styles.cellContent}>
                <p className="text-[18px]">Deposited fETH</p>
                <h2 className="text-[24px]">
                  {dollarText(userDepositTvl_text)}
                </h2>
                <p className="text-[16px]">{userDeposit} fETH</p>
                {userUnlockingBalance && userUnlockingBalance !== '-' ? (
                  <p className="text-[16px]">
                    Unlocking: {userUnlockingBalance} fETH
                  </p>
                ) : null}
                {checkNotZoroNum(
                  stabilityPoolInfo?.userInfo?.unlockingBalanceOfRes?._balance
                ) ? (
                  <p className="text-[16px]">
                    UnlockAt: {userUnlockingUnlockAt}
                  </p>
                ) : (
                  ''
                )}
                {userUnlockedBalance && userUnlockedBalance !== '-' ? (
                  <p className="text-[16px]">
                    Unlocked: {userUnlockedBalance} fETH{'  '}
                    <span
                      className={cn(
                        'text-[#6B79FC] underline',
                        canUnlock
                          ? 'cursor-pointer'
                          : 'cursor-not-allowed opacity-[0.6]'
                      )}
                      onClick={handleUnlock}
                    >
                      Claim Funds
                    </span>
                  </p>
                ) : null}
              </div>
              <div className={styles.actions}>
                {/* <Button onClick={handleDeposit}>Deposit</Button> */}
                <Button onClick={handleWithdraw} type="second">
                  Withdraw
                </Button>
                {/*        
                <Button
                  loading={harvesting}
                  onClick={handleHarvest}
                  type="second"
                >
                  Harvest
                </Button>
                */}
                {/* <Button onClick={handleLiquidatorWithBonus} type="second">
                  Liquidator
                </Button> */}
              </div>
            </div>

            <div className={cn(styles.cell, 'mt-[50px]')}>
              <div>
                <div className={styles.cell}>
                  <div className={styles.stETHWrap}>
                    <img src={stETHImg} />
                  </div>
                  <div className={styles.cellContent}>
                    <p className="text-[18px]">Earned</p>
                    <h2 className="text-[24px]">
                      {dollarText(userWstETHClaimableTvl_text)}
                    </h2>
                    <p className="text-[16px]">{userWstETHClaimable} stETH</p>
                  </div>
                </div>
              </div>
              <div>
                <Button
                  disabled={!canClaim.wstETH}
                  loading={claiming.wstETH}
                  onClick={() => handleClaim('wstETH', true)}
                >
                  Claim
                </Button>
              </div>
            </div>

            {hasXETH ? (
              <div className={cn(styles.cell, 'mt-[50px]')}>
                <div>
                  <div className={cn(styles.cell)}>
                    <img src={xETHImg} />
                    <div className={styles.cellContent}>
                      <p className="text-[18px]">From liquidation</p>
                      <h2 className="text-[24px]">
                        {dollarText(userXETHClaimableTvl_text)}
                      </h2>
                      <p className="text-[16px]">{userXETHClaimable} xETH</p>
                    </div>
                  </div>
                </div>
                <div>
                  <Button
                    disabled={!canClaim.xETH}
                    loading={claiming.xETH}
                    onClick={() => handleClaim('xETH', false)}
                    type="second"
                  >
                    Claim
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      {depositVisible && (
        <DepositModal
          info={item}
          contractType={contractType}
          FX_RebalancePoolContract={FX_RebalancePoolContract}
          poolData={stabilityPoolInfo}
          onCancel={() => setDepositVisible(false)}
        />
      )}
      {withdrawVisible && (
        <WithdrawModal
          info={item}
          FX_RebalancePoolContract={FX_RebalancePoolContract}
          poolData={stabilityPoolInfo}
          onCancel={() => setWithdrawVisible(false)}
        />
      )}
    </div>
  )
}
