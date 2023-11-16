import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Tooltip } from 'antd'
import cn from 'classnames'
import Button from '@/components/Button'
import { POOLS_LIST } from '@/config/aladdinVault'
import DepositModal from '../DepositModal'
import WithdrawModal from '../WithdrawModal'
import styles from './styles.module.scss'
import { cBN, checkNotZoroNum, dollarText } from '@/utils/index'

const stETHImg = '/tokens/steth.svg'
const xETHImg = '/images/x-logo.svg'

const item = POOLS_LIST[0]

export default function PoolCell({
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

  cellData,
  hasXETH,
}) {
  return (
    <div className={styles.poolWrap}>
      <div className="flex justify-between items-center">
        <div className="w-[180px]">
          <p>{cellData.title}</p>
          <p>{cellData.subTitle}</p>
        </div>
        <div className="w-[140px]">$100,000,000</div>
        <div className="w-[150px]">12.6% ~ 30.7%</div>
        <div className="w-[80px]">
          <img className="h-[30px]" src="/images/f-logo.svg" />
        </div>
        <div className="w-[80px]">
          <img className="h-[30px]" src={stETHImg} />
        </div>
        <div className="w-[80px]">
          <div
            className="underline cursor-pointer text-[var(--a-button-color)]"
            onClick={handleDeposit}
          >
            Deposit
          </div>
        </div>
      </div>

      {depositVisible && (
        <DepositModal
          cellData={cellData}
          info={item}
          contractType={contractType}
          FX_RebalancePoolContract={FX_RebalancePoolContract}
          poolData={stabilityPoolInfo}
          onCancel={() => setDepositVisible(false)}
        />
      )}
    </div>
  )
}
