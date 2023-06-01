import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Modal } from 'antd'
import { useToggle, useSetState } from 'ahooks'
import { SettingOutlined } from '@ant-design/icons'
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
import SlippageModal, { useSlippage } from '../SlippageModal'

export default function Swap() {
  const { systemStatus } = usefxETH()
  const [bonusIndex, setBonusIndex] = useState(0)
  const [tab, setTab] = useState(0)

  const slippageProps = useSlippage(0.3)

  const { slippage, toggle } = slippageProps

  const tabs = useMemo(() => {
    let _tabs = ['Mint', 'Redeem']
    if (systemStatus * 1 >= 1) {
      _tabs = ['Mint', 'Redeem', 'Bonus']
    }
    if (tab >= _tabs.length) setTab(0)
    return _tabs
  }, [systemStatus])

  return (
    <div className={styles.container}>
      <SettingOutlined onClick={toggle} />
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
      {!!(tab == 0) && <Mint slippage={slippage} />}
      {!!(tab == 1) && <Redeem slippage={slippage} />}
      {!!(tab == 2) && (
        <div>
          <Tabs
            tabs={['Mint xETH', 'Redeem fETH']}
            selecedIndex={bonusIndex}
            onChange={(index) => setBonusIndex(index)}
            disabledIndexs={systemStatus * 1 >= 2 ? [] : [1]}
          />
          {bonusIndex == 0 ? (
            <MintBonus slippage={slippage} />
          ) : (
            <RedeemBonus slippage={slippage} />
          )}
        </div>
      )}

      <SlippageModal {...slippageProps} />
    </div>
  )
}
