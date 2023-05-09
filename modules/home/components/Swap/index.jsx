import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from 'antd'
import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import { cBN, fb4 } from '@/utils/index'
import { useToken } from '@/hooks/useTokenInfo'
import styles from './styles.module.scss'
import Mint from '../Mint'
import Redeem from '../Redeem'

const tabs = ['Mint', 'Redeem']

export default function Swap() {
  const [tab, setTab] = useState(0)
  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        {tabs.map((item, index) => (
          <div
            className={styles.tab}
            data-active={tab === index}
            onClick={() => {
              setTab(index)
            }}
          >
            {item}
          </div>
        ))}
      </div>
      {tab ? <Redeem /> : <Mint />}
    </div>
  )
}
