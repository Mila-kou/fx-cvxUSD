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

export default function RebalancePoolCell({
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

  hasXETH,
  ...poolData
}) {
  const [openPanel, setOpenPanel] = useState(false)
  return (
    <div key={poolData.title} className={styles.poolWrap}>
      <div className={styles.card} onClick={() => setOpenPanel(!openPanel)}>
        <div className="flex w-[160px] gap-[6px] items-center">
          <img className="w-[30px]" src={xETHImg} />
          <div>
            <p className="text-[16px]">{poolData.title}</p>
            <p className="text-[14px] text-[var(--second-text-color)]">fETH</p>
          </div>
        </div>
        <div className="w-[90px] text-[16px]">
          {poolData.stabilityPoolTotalSupply}
        </div>
        <div className="w-[180px]">{poolData.apy}</div>
        <div className="w-[60px] text-[16px]">{userDeposit}</div>
        <div className="w-[120px]">
          <div className="flex gap-[6px] py-[2px]">
            <img className="h-[20px]" src={stETHImg} />
            <p className="text-[16px]">{userWstETHClaimable}</p>
          </div>
          {hasXETH ? (
            <div className="flex gap-[6px] py-[2px]">
              <img className="h-[20px]" src={xETHImg} />
              <p className="text-[16px]">{userXETHClaimable}</p>
            </div>
          ) : null}
        </div>
        <div className="w-[20px] cursor-pointer">
          <img
            className={openPanel ? 'rotate-180' : ''}
            src="/images/arrow-down.svg"
          />
        </div>
      </div>
      {openPanel ? (
        <div className={`${styles.panel}`}>
          <div className={`${styles.content} gap-[32px]`}>
            <div>
              {userUnlockingBalance && userUnlockingBalance !== '-' ? (
                <p className="text-[16px]">
                  Unlocking: {userUnlockingBalance} fETH
                </p>
              ) : null}
              {checkNotZoroNum(
                stabilityPoolInfo?.userInfo?.unlockingBalanceOfRes._balance
              ) ? (
                <p className="text-[16px]">UnlockAt: {userUnlockingUnlockAt}</p>
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

            <Button size="small" onClick={handleDeposit}>
              Deposit
            </Button>
            <Button size="small" onClick={handleWithdraw} type="second">
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
            <Button
              size="small"
              onClick={handleLiquidatorWithBonus}
              type="second"
            >
              Liquidator
            </Button>

            <Button
              size="small"
              disabled={!canClaim.wstETH}
              loading={claiming.wstETH}
              onClick={() => handleClaim('wstETH', true)}
              type="second"
            >
              Claim
            </Button>
            <Button
              size="small"
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
