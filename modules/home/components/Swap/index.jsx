import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from 'antd'
import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import { cBN, fb4 } from '@/utils/index'
import { useToken } from '@/hooks/useTokenInfo'
import styles from './styles.module.scss'
import Mint from '../Mint'
import MintBonus from '../MintBonus'
import Redeem from '../Redeem'
import { useFETH } from '@/hooks/useContracts'
import RedeemBonus from '../RedeemBonus'

export default function Swap() {
  const { systemStatus } = useFETH()
  const [tab, setTab] = useState(0)
  let tabs = useMemo(() => {
    if (systemStatus == 1) {
      return ['Mint', 'Redeem']
    }
    return ['Mint', 'Redeem', 'Redeem Bonus']
  }, [systemStatus])

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
      {!!tab == 0 && <Mint />}
      {!!tab == 1 && <Redeem />}
      {!!tab == 2 && <RedeemBonus />}
    </div>
  )
}
