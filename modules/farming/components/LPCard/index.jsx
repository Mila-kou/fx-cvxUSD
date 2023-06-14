import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Modal } from 'antd'
import { useToggle, useSetState } from 'ahooks'
import { SettingOutlined } from '@ant-design/icons'
import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import { cBN, fb4 } from '@/utils/index'
import { useToken } from '@/hooks/useTokenInfo'
import Button from '@/components/Button'
import styles from './styles.module.scss'
import FLogo from '../../../../public/images/f-logo.svg'
import XLogo from '../../../../public/images/x-logo.svg'

const lpMap = {
  fx: {
    name: 'f(x)/ETH',
    logo: <FLogo />,
  },
  fETH: {
    name: 'fETH/ETH',
    logo: <FLogo />,
  },
  xETH: {
    name: 'xETH/ETH',
    logo: <XLogo />,
  },
}

export default function LPCard({ type, onDeposit, onWithdraw }) {
  const { name, logo } = lpMap[type]
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.icons}>
          {logo}
          <img src="/tokens/crypto-icons-stack.svg#eth" />
        </div>
        {name} Curve LP
      </div>

      <div className={styles.info}>
        <div className={styles.content}>
          <div>
            <p>APR</p>
            <h2>20.12%</h2>
          </div>
          <div>
            <p>TVL</p>
            <h2>$8000.000</h2>
          </div>
        </div>

        <a>Get {name} Curve LP</a>
      </div>

      <div className={styles.main}>
        <div className={styles.item}>
          <p>My Balance</p>
          <h2>100,000 LP</h2>
        </div>

        <div className={styles.item}>
          <p>Rewords</p>
          <h2>100,000 f(x)</h2>

          <a className={styles.claim}>Claim</a>
        </div>
      </div>

      <div className={styles.action}>
        <Button
          width="100%"
          loading={false}
          disabled={false}
          onClick={onDeposit}
        >
          Deposit
        </Button>
        <Button
          type="second"
          width="100%"
          loading={false}
          disabled={false}
          onClick={onWithdraw}
        >
          Withdraw
        </Button>
      </div>
    </div>
  )
}
