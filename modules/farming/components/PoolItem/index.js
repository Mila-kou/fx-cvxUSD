import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import cn from 'classnames'
import DepositModal from '../DepositModal'
import WithdrawModal from '../WithdrawModal'

import { cBN, checkNotZoroNum, checkNotZoroNumOption, fb4 } from '@/utils/index'
import { useClevMinter } from '@/hooks/useContracts'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import useWeb3 from '@/hooks/useWeb3'
import styles from './styles.module.scss'
import Button from '@/components/Button'

import useLiquidityLimit from '@/modules/calculator/hook/useLiquidityLimit'
import useCalc from '@/modules/calculator/hook/useCalc'

const IconClev = '/assets/ctr.svg'
const cryptoIcons = '/assets/crypto-icons-stack.svg'

export default function PoolItem({ item }) {
  const { currentAccount, isAllReady } = useWeb3()
  const [claiming, setClaiming] = useState(false)
  const {
    tvlText,
    lpContract,
    name,
    totalSupply,
    lpGaugeAddress,
    userInfo = {},
    otherTokenData = {},
    rewardApyMin,
    rewardApy,
    baseApy,
    baseApyText,
    rewardApyMinText,
    apyMinText,
    apyText,
    apyMaxText,
    clevUSD_FraxBP_apy,
    rewardApyMaxText,
  } = item
  const { veTotalSupply, userVeCLEV } = useCalc()
  const { contract: ClevMinterContract } = useClevMinter()

  const boost = useLiquidityLimit(null, {
    lpContract, // lp gauge contract
    depositAmount: userInfo?.userDeposited, // lp deposit amount
    poolLiquidity: totalSupply, // lp totalSupply
    totalveCLEV: veTotalSupply, // ve veTotalSupply
    veCLEVAmount: userVeCLEV, // ve userVeCLEV
  })

  const newApyText = useMemo(() => {
    if (checkNotZoroNum(boost) && checkNotZoroNum(rewardApy)) {
      const _rewardApy = cBN(rewardApyMin).times(boost)
      const _apy = _rewardApy.plus(baseApy)
      return checkNotZoroNumOption(_apy, `${_apy.toFixed(2)}%`)
    }
    return checkNotZoroNumOption(rewardApy, apyText)
  }, [boost, rewardApyMin, baseApy])

  const [depositVisible, setDepositVisible] = useState(false)
  const [withdrawVisible, setWithdrawVisible] = useState(false)

  const handleDeposit = () => {
    if (!isAllReady) return
    setDepositVisible(true)
  }
  const handleWithdraw = () => {
    if (!isAllReady) return
    setWithdrawVisible(true)
  }

  const handleClaim = async () => {
    if (!isAllReady) return
    setClaiming(true)
    try {
      const apiCall = ClevMinterContract.methods.mint(lpGaugeAddress)
      const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(() => apiCall.send({ from: currentAccount, gas }), {
        key: 'clev',
        action: 'claim',
      })
      setClaiming(false)
    } catch (error) {
      setClaiming(false)
      noPayableErrorAction(`error_farm_claim`, error)
    }
  }
  const canClaim = checkNotZoroNum(userInfo.claimable_reward)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.icons}>
          <img src={item.logo} className="absolute left-[26px]" />
          <img src={item.logo2} />
        </div>
        {name}
      </div>

      <div className={styles.info}>
        <div className={styles.content}>
          <div>
            <p>APR</p>
            <h2>
              {checkNotZoroNum(boost)
                ? `${newApyText}`
                : checkNotZoroNum(rewardApy)
                ? `${apyMinText} -> ${apyMaxText}`
                : '-'}
            </h2>
          </div>
          <div>
            <p>TVL</p>
            <h2>{tvlText}</h2>
          </div>
        </div>

        <a>Get {name}</a>
      </div>

      <div className={styles.main}>
        <div className={styles.item}>
          <p>My Balance</p>
          <h2>
            {checkNotZoroNum(userInfo ? userInfo.userDeposited : 0)
              ? fb4(
                  userInfo.userDeposited,
                  false,
                  item.stakeTokenDecimals ?? 18
                )
              : '-'}
            <span>{userInfo ? userInfo.userDepositedTvlText : '-'}</span>
          </h2>
        </div>

        <div className={styles.item}>
          <p>Rewords</p>
          <h2>
            {item.isStaticPool
              ? ''
              : userInfo
              ? userInfo.claimableTvlText
              : '-'}
          </h2>

          {canClaim && (
            <a className={styles.claim} onClick={handleClaim}>
              Claim
            </a>
          )}
        </div>
      </div>

      <div className={styles.action}>
        <Button
          width="100%"
          disabled={item.closeDeposit}
          onClick={handleDeposit}
        >
          Deposit
        </Button>
        <Button type="second" width="100%" onClick={handleWithdraw}>
          Withdraw
        </Button>
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
