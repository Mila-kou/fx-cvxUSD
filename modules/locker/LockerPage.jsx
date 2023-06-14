import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
// import { Button, InputNumber } from 'antd'
import SimpleInput from '@/components/SimpleInput'
import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import { cBN, checkNotZoroNum, fb4 } from '@/utils/index'
import { useToken } from '@/hooks/useTokenInfo'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import { getGas } from '@/utils/gas'
import useGlobal from '@/hooks/useGlobal'
import styles from './styles.module.scss'
import Button from '@/components/Button'
import { useContract } from '@/hooks/useContracts'
import abi from '@/config/abi'

export default function LockerPage() {
  const { showSystemStatistics } = useGlobal()
  const [locked, setLocked] = useState(false)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>f(x) Locker</h2>
        <div className={styles.items}>
          <div className={styles.item}>
            <p>Locking APR</p>
            <h2>27.2%</h2>
          </div>
          <div className={styles.item}>
            <p>f(x) Locked</p>
            <h2>80,000,00</h2>
            <p>20% of f(x) Supply</p>
          </div>
          <div className={styles.item}>
            <p>vef(x)</p>
            <h2>80,000,00 </h2>
            <p>3.2 years average lock</p>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.left}>
          <h2>vef(x) Voting Power</h2>
        </div>
        <div className={styles.right}>
          <h2>Lock</h2>
          {locked ? (
            <div className={styles.wrap}>
              <p>My Locked:</p>
              <h2>100,1000 f(x)</h2>
              <div className={styles.cell}>
                <p className={styles.color}>100,000 vef(x)</p>
                <a>Add amount</a>
              </div>

              <p>Locked Until:</p>
              <div className={styles.cell}>
                <h2>2024/12/12 08:00:00</h2>
                <a>Extend</a>
              </div>

              <p>Rewards:</p>
              <div className={styles.cell}>
                <h2>1.36 ETH</h2>
                <a>Claim</a>
              </div>
            </div>
          ) : (
            <div className={styles.wrap}>
              <p>Lock f(x) to earn protocol fees!</p>
              <Button width="100%">Create Lock</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
