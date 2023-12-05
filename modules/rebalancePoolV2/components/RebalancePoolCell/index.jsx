import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Tooltip } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import cn from 'classnames'
import Button from '@/components/Button'
import DepositModal from '../DepositModal'
import WithdrawModal from '../WithdrawModal'
import styles from './styles.module.scss'
import {
  cBN,
  checkNotZoroNum,
  checkNotZoroNumOption,
  dollarText,
} from '@/utils/index'

const stETHImg = '/tokens/steth.svg'
const xETHImg = '/images/x-logo.svg'
const fETHImg = '/images/f-logo.svg'
const fxnImg = '/images/FXN.svg'

export default function RebalancePoolCell({
  harvesting,
  handleHarvest,
  handleLiquidatorWithBonus,

  handleDeposit,
  handleWithdraw,
  canUnlock,
  handleUnlock,
  claiming,
  handleClaim,

  boostableRebalancePoolInfo,
  userDeposit,
  userDepositTvl_text,
  myTotalValue_text,
  userWstETHClaimable,
  userWstETHClaimableTvl_text,
  userFXNClaimable,
  userFXNClaimableTvl_text,
  userXETHClaimable,
  userXETHClaimableTvl_text,
  poolTotalSupplyTvl_text,
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
  _poolConfig,
  ...poolData
}) {
  const [openPanel, setOpenPanel] = useState(false)

  const canClaim = userWstETHClaimable || userFXNClaimable || userXETHClaimable

  const getRewards = (props = {}) => (
    <div {...props}>
      <div className="flex gap-[6px] py-[2px]">
        <img className="h-[20px]" src={fxnImg} />
        <p className="text-[16px]">{userFXNClaimable}</p>
      </div>
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
  )

  const apyList = [
    `APY: ${poolData.apyObj?.apy_text}`,
    `FXN APR: ${poolData.apyObj?.fxnApy_text}`,
    `wstETH APR: ${poolData.apyObj?.wstETHApy_text}`,
    hasXETH ? `xETH APR: ${poolData.apyObj?.xETHApy_text}` : '',
  ]

  return (
    <div key={poolData.title} className={styles.poolWrap}>
      <div className={styles.card} onClick={() => setOpenPanel(!openPanel)}>
        <div className="flex w-[160px] gap-[6px] items-center">
          <img className="w-[30px]" src={fETHImg} />
          <div>
            <p className="text-[16px]">{poolData.title}</p>
            <p className="text-[14px] text-[var(--second-text-color)]">fETH</p>
          </div>
        </div>
        <div className="w-[90px] text-[16px]">
          <p className="text-[16px]">{poolTotalSupplyTvl_text}</p>
          <p className="text-[16px] mt-[6px] text-[var(--second-text-color)]">
            {poolData.poolTotalSupply}
          </p>
        </div>
        <div className="w-[180px]">{poolData.apyObj?.apy_text}</div>
        <div className="w-[90px] text-[16px]">
          <p className="text-[16px]">{userDepositTvl_text}</p>
          <p className="text-[16px] mt-[6px] text-[var(--second-text-color)]">
            {userDeposit}
          </p>
        </div>
        <div className="w-[120px]">{getRewards()}</div>
        <div className="w-[20px] cursor-pointer">
          <img
            className={openPanel ? 'rotate-180' : ''}
            src="/images/arrow-down.svg"
          />
        </div>
      </div>
      {openPanel ? (
        <div className={`${styles.panel}`}>
          <div className={styles.content}>
            <div className={styles.item}>
              <div>
                <div>
                  Projected APY: {poolData.apyObj?.apy_text}{' '}
                  <Tooltip
                    placement="topLeft"
                    title={
                      <div>
                        {apyList.map((apyText) => (
                          <p className="text-[14px]">{apyText}</p>
                        ))}
                      </div>
                    }
                    arrow
                    color="#000"
                    overlayInnerStyle={{ width: '300px' }}
                  >
                    <InfoCircleOutlined className="ml-[8px]" />
                  </Tooltip>
                </div>
              </div>
              <div>
                <div className="flex gap-[32px]">
                  <Button size="small" onClick={handleDeposit}>
                    Deposit
                  </Button>
                  <Button size="small" onClick={handleWithdraw} type="second">
                    Withdraw
                  </Button>
                </div>
              </div>
            </div>

            <div className={`${styles.item} mt-[32px]`}>
              <div>
                <div className="flex">
                  Earn: {getRewards({ className: 'flex gap-[32px] ml-[8px]' })}
                </div>
              </div>
              <div>
                <div className="flex gap-[32px]">
                  <Button
                    size="small"
                    onClick={handleLiquidatorWithBonus}
                    type="second"
                  >
                    Liquidator
                  </Button>
                  <Button
                    size="small"
                    disabled={!canClaim}
                    loading={claiming}
                    onClick={() => handleClaim()}
                  >
                    Claim
                  </Button>
                </div>
                {/* 
                <Button
                  size="small"
                  loading={harvesting}
                  onClick={handleHarvest}
                  type="second"
                >
                  Harvest
                </Button> */}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {depositVisible && (
        <DepositModal
          info={_poolConfig}
          contractType={contractType}
          FX_RebalancePoolContract={FX_RebalancePoolContract}
          poolData={boostableRebalancePoolInfo}
          onCancel={() => setDepositVisible(false)}
        />
      )}
      {withdrawVisible && (
        <WithdrawModal
          info={_poolConfig}
          FX_RebalancePoolContract={FX_RebalancePoolContract}
          poolData={boostableRebalancePoolInfo}
          onCancel={() => setWithdrawVisible(false)}
        />
      )}
    </div>
  )
}
