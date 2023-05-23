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
import usefxETH from '../../controller/usefxETH'
import RedeemBonus from '../RedeemBonus'
import Tabs from '../Tabs'

export default function Swap() {
  const { systemStatus } = usefxETH()
  const [bonusIndex, setBonusIndex] = useState(0)
  const [tab, setTab] = useState(0)

  const tabs = useMemo(() => {
    let _tabs = ['Mint', 'Redeem']
    if (systemStatus == 1) {
      _tabs = ['Mint', 'Redeem', 'Bonus']
    }
    if (tab >= _tabs.length) setTab(0)
    return _tabs
  }, [systemStatus])

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        {tabs.map((item, index) => (
          <div
            key={item}
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
      {!!(tab == 0) && <Mint />}
      {!!(tab == 1) && <Redeem />}
      {!!(tab == 2) && (
        <div>
          <Tabs
            tabs={['Mint Bonus', 'Redeem Bonus']}
            selecedIndex={bonusIndex}
            onChange={(index) => setBonusIndex(index)}
          />
          {bonusIndex === 0 ? <MintBonus /> : <RedeemBonus />}
        </div>
      )}
    </div>
  )
}
