import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import BalanceInput from '@/components/BalanceInput'
import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import { cBN, fb4 } from '@/utils/index'
import { useToken } from '@/hooks/useTokenInfo'
import noPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import { getGas } from '@/utils/gas'
import styles from './styles.module.scss'

export default function Tabs({
  selecedIndex = 0,
  tabs = ['fETH', 'xETH'],
  disabledIndexs = [],
  onChange,
}) {
  return (
    <div className={styles.tabs}>
      {tabs.map((item, index) => (
        <div
          className={styles.tab}
          data-active={selecedIndex === index}
          onClick={() => {
            if (disabledIndexs.includes(index)) return
            onChange(index)
          }}
        >
          {item}
        </div>
      ))}
    </div>
  )
}
