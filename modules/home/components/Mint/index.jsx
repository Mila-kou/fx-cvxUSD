import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import BalanceInput from '@/components/BalanceInput'
import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import { cBN, fb4 } from '@/utils/index'
import { useToken } from '@/hooks/useTokenInfo'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import { getGas } from '@/utils/gas'
import Tabs from '../Tabs'
import styles from './styles.module.scss'

export default function Mint() {
  const [tab, setTab] = useState(0)
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    if (tab) {
      setSelected(2)
    } else {
      setSelected(0)
    }
  }, [tab])

  return (
    <div className={styles.container}>
      <BalanceInput
        placeholder="0"
        symbol="ETH"
        balance="124.3"
        usd="1800.24"
      />
      <div className={styles.arrow}>
        <DownOutlined />
      </div>

      <Tabs selecedIndex={tab} onChange={(v) => setTab(v)} />
      <BalanceInput
        symbol="fETH"
        icon="/images/f-s-logo.webp"
        color={selected !== 1 ? 'blue' : undefined}
        placeholder="300"
        disabled
        type={selected == 1 ? 'select' : ''}
        className={styles.inputItem}
        usd="1,10"
        onSelected={() => setSelected(0)}
      />
      <BalanceInput
        symbol="xETH"
        tip="Bonus+"
        icon="/images/x-s-logo.webp"
        color={selected !== 0 ? 'red' : undefined}
        selectColor="red"
        placeholder="300"
        disabled
        type={selected == 0 ? 'select' : ''}
        className={styles.inputItem}
        usd="1,10"
        onSelected={() => setSelected(1)}
      />
    </div>
  )
}
