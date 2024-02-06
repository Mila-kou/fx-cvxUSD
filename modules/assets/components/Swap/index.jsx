import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useToggle, useSetState } from 'ahooks'
import { SettingOutlined } from '@ant-design/icons'
import styles from './styles.module.scss'
import Mint from '../Mint'
import Redeem from '../Redeem'
import useETH from '../../controller/useETH'
import SlippageModal, { useSlippage } from '../SlippageModal'

const AUTO = 0.3

export default function Swap({ isValidPrice, assetInfo }) {
  const { systemStatus } = useETH()
  const [tab, setTab] = useState(0)

  const slippageProps = useSlippage(AUTO)

  const { slippage, toggle } = slippageProps

  const tabs = useMemo(() => {
    const _tabs = ['Mint', 'Redeem']

    if (tab >= _tabs.length) setTab(0)
    return _tabs
  }, [systemStatus])

  return (
    <div className={styles.container}>
      <div
        className={styles.setting}
        onClick={toggle}
        data-auto={AUTO === slippage}
      >
        <span className={styles.custom}>{slippage}% slippage</span>
        <SettingOutlined />
      </div>
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
      {!!(tab == 0) && <Mint slippage={slippage} assetInfo={assetInfo} />}
      {!!(tab == 1) && (
        <Redeem
          slippage={slippage}
          isValidPrice={isValidPrice}
          assetInfo={assetInfo}
        />
      )}

      <SlippageModal {...slippageProps} />
    </div>
  )
}
