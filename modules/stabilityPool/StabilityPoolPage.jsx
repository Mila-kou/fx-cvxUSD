import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import cn from 'classnames'
import { useToggle, useSetState } from 'ahooks'
import useWeb3 from '@/hooks/useWeb3'
import DepositModal from './components/DepositModal'
import WithdrawModal from './components/WithdrawModal'
import UnlockingModal from './components/UnlockingModal'

import { POOLS_LIST } from '@/config/aladdinVault'

import styles from './styles.module.scss'
import useStabiltyPool_c from './controller/c_stabiltyPool'
import {
  useFX_LiquidatorWithBonusToken,
  useFX_stabilityPool,
  useFX_stETHTreasury,
} from '@/hooks/useContracts'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import config from '@/config/index'
import { cBN, checkNotZoroNum, dollarText } from '@/utils/index'
import Warning from '../../public/images/warning.svg'
// import Waiting from '../../public/images/waiting.svg'
// <Waiting onClick={toggle} />

const ETHImg = '/tokens/crypto-icons-stack.svg#eth'

const item = POOLS_LIST[0]

export default function StabilityPoolPage() {
  const { currentAccount, isAllReady } = useWeb3()
  const { contract: FX_StabilityPoolContract } = useFX_stabilityPool()
  const { contract: FX_stETHTreasuryContract } = useFX_stETHTreasury()
  const { contract: FX_LiquidatorWithBonusContract } =
    useFX_LiquidatorWithBonusToken()
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

  const [visible, { toggle }] = useToggle()
  const [depositVisible, setDepositVisible] = useState(false)
  const [withdrawVisible, setWithdrawVisible] = useState(false)
  const [claiming, setClaiming] = useState(false)
  const [unlocking, setUnlocking] = useState(false)
  const [harvesting, setHarvesting] = useState(false)

  const unlockingList = [
    {
      amount: '30,000',
      unlockTime: '2023/09/30 08:00:23',
    },
    {
      amount: '30,000',
      unlockTime: '2023/09/30 08:00:23',
    },
    {
      amount: '30,000',
      unlockTime: '2023/09/30 08:00:23',
    },
  ]

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
      const apiCall = FX_StabilityPoolContract.methods.withdrawUnlocked(
        false,
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
    if (claiming || !canClaim) return
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

  const handleHarvest = async () => {
    if (harvesting) return
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
      // const _totalFETH = cBN(stabilityPoolInfo.baseInfo?.stabilityPoolTotalSupplyRes).plus(stabilityPoolInfo.baseInfo?.totalUnlockingRes).toString(10)
      const apiCall = FX_LiquidatorWithBonusContract.methods.liquidate(0)
      const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      const tx = await apiCall.send({ from: currentAccount, gas })
      console.log('stabilityPool liquidate success---', tx)
    } catch (error) {
      console.log('stabilityPool liquidate error', error)
    }
  }

  const canClaim = useMemo(() => {
    console.log(
      'stabilityPoolInfo.userInfo?.claimableResd--',
      stabilityPoolInfo.userInfo?.claimableRes
    )
    if (checkNotZoroNum(stabilityPoolInfo.userInfo?.claimableRes)) {
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
        <p className="text-[22px]">Stability Pool Overview</p>
        <div className={styles.items}>
          <div className={styles.item}>
            <p>Total Deposited Value</p>
            <h2>{dollarText(stabilityPoolTotalSupplyTvl_text)}</h2>
            <p className="text-[14px]">{stabilityPoolTotalSupply} fETH</p>
          </div>
          <div className={styles.item}>
            <p>APY</p>
            <h2 className={styles.green}>{apy}%</h2>
          </div>
          <div className={cn(styles.item, styles.itemWrap)}>
            <div>
              <Warning />
              <p>
                When the collateral rate is lower than 130%, the deposited fETH
                will be used for liquidation.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.wrap}>
        <div className={styles.content}>
          <div className={styles.left}>
            <p className="text-[22px]">My Stability Pool</p>
            <p className="text-[32px] mt-[10px]">
              {dollarText(myTotalValue_text)}
            </p>
            <div className={cn(styles.item, styles.itemWrap, 'mt-[40px]')}>
              <div>
                <img src={ETHImg} />
                <Link href="/home">
                  <p>Get fETH to Deposit →</p>
                </Link>
              </div>
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.cell}>
              <img src="/images/f-logo.svg" />
              <div className={styles.cellContent}>
                <p className="text-[14px]">Deposited fETH</p>
                <p className="text-[24px]">{dollarText(userDepositTvl_text)}</p>
                <p className="text-[14px]">{userDeposit} fETH</p>
                <p className="text-[14px]">
                  Unlocking: {userUnlockingBalance} fETH
                </p>
                <p className="text-[14px]">
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
              </div>
              <div>
                <p
                  className="text-[#fff] w-[178px] h-[48px] rounded-[10px] bg-[#6B79FC] flex items-center justify-center cursor-pointer"
                  onClick={handleDeposit}
                >
                  Deposit
                </p>
                <p
                  className="text-[#000] border-[#E4E4E4] border-[1px] border-solid w-[178px] h-[48px] rounded-[10px] bg-[#fff] flex items-center justify-center cursor-pointer mt-[13px]"
                  onClick={handleWithdraw}
                >
                  Withdraw
                </p>
                <p
                  className="text-[#000] border-[#E4E4E4] border-[1px] border-solid w-[178px] h-[48px] rounded-[10px] bg-[#fff] flex items-center justify-center cursor-pointer mt-[13px]"
                  onClick={handleHarvest}
                >
                  Harvest
                </p>
                <p
                  className="text-[#000] border-[#E4E4E4] border-[1px] border-solid w-[178px] h-[48px] rounded-[10px] bg-[#fff] flex items-center justify-center cursor-pointer mt-[13px]"
                  onClick={handleLiquidatorWithBonus}
                >
                  Liquidator
                </p>
              </div>
            </div>

            <div className={cn(styles.cell, 'mt-[50px]')}>
              <img src={ETHImg} />
              <div className={styles.cellContent}>
                <p className="text-[14px]">Earned</p>
                <p className="text-[24px]">
                  {dollarText(userWstETHClaimableTvl_text)}
                </p>
                <p className="text-[14px]">{userWstETHClaimable} stETH</p>
              </div>
              <div>
                <p
                  className={cn(
                    'text-[#fff] w-[178px] h-[48px] rounded-[10px] bg-[#4FBF67] flex items-center justify-center',
                    canClaim
                      ? 'cursor-pointer'
                      : 'cursor-not-allowed opacity-[0.6]'
                  )}
                  onClick={handleClaim}
                >
                  Claim
                </p>
              </div>
            </div>

            {/* <div className={cn(styles.cell, 'mt-[20px]')}>
              <img src={ETHImg} />
              <div className={styles.cellContent}>
                <p className="text-[14px]">fx Earned</p>
                <p className="text-[24px]">{dollarText(userUnlockingBalanceTvl_text)}</p>
                <p className="text-[14px]">{userUnlockingBalance} fETH</p>
              </div>
            </div> */}
          </div>
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
      <UnlockingModal visible={visible} toggle={toggle} list={unlockingList} />
    </div>
  )
}
