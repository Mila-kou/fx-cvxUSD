import React, { useEffect, useMemo, useState } from 'react'
import cn from 'classnames'
import { useToggle, useSetState } from 'ahooks'
import useWeb3 from '@/hooks/useWeb3'
import DepositModal from './components/DepositModal'
import WithdrawModal from './components/WithdrawModal'
import UnlockingModal from './components/UnlockingModal'

import { POOLS_LIST } from '@/config/aladdinVault'

import styles from './styles.module.scss'
import useStabiltyPool_c from './controller/c_stabiltyPool'
import { useFX_stabilityPool } from '@/hooks/useContracts'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import config from '@/config/index'
import { checkNotZoroNum } from '@/utils/index'
import Warning from '../../public/images/warning.svg'
import Waiting from '../../public/images/waiting.svg'

const ETHImg = '/tokens/crypto-icons-stack.svg#eth'

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

  const [visible, { toggle }] = useToggle()
  const [depositVisible, setDepositVisible] = useState(false)
  const [withdrawVisible, setWithdrawVisible] = useState(false)
  const [claiming, setClaiming] = useState(false)
  const [unlocking, setUnlocking] = useState(false)

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

  const canClaim = useMemo(() => {
    if (checkNotZoroNum(stabilityPoolInfo.userInfo?.claimableResd)) {
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
        <h1>Stability Pool Overview</h1>
        <div className={styles.items}>
          <div className={styles.item}>
            <p>Total Deposited Value</p>
            <h2>${stabilityPoolTotalSupplyTvl_text}</h2>
            <p className="text-[14px]">{stabilityPoolTotalSupply} fETH</p>
          </div>
          <div className={styles.item}>
            <p>Last 7 Days APY</p>
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
            <p className="text-[32px] mt-[10px]">${myTotalValue_text}</p>
            <div className={cn(styles.item, styles.itemWrap, 'mt-[40px]')}>
              <div>
                <img src={ETHImg} />
                <p>Get fETH to Deposit →</p>
              </div>
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.cell}>
              <img src="/images/f-logo.svg" />
              <div className={styles.cellContent}>
                <p className="text-[14px]">Deposited fETH</p>
                <p className="text-[24px]">${userDepositTvl_text}</p>
                <p className="text-[14px]">
                  {userDeposit} fETH <Waiting onClick={toggle} />
                </p>
                <p className="text-[14px]">
                  Unlocked: {userUnlockedBalance} fETH{'  '}
                  <span
                    className="text-[#6B79FC] underline cursor-pointer"
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
              </div>
            </div>

            <div className={cn(styles.cell, 'mt-[50px]')}>
              <img src={ETHImg} />
              <div className={styles.cellContent}>
                <p className="text-[14px]">Earned</p>
                <p className="text-[24px]">${userWstETHClaimableTvl_text}</p>
                <p className="text-[14px]">{userWstETHClaimable} stETH</p>
              </div>
              <div>
                <p
                  className="text-[#fff] w-[178px] h-[48px] rounded-[10px] bg-[#4FBF67] flex items-center justify-center cursor-pointer"
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
                <p className="text-[24px]">${userUnlockingBalanceTvl_text}</p>
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
