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
import DetailCollapse from '../DetailCollapse'
import styles from './styles.module.scss'

export default function Redeem() {
  const [selected, setSelected] = useState(0)
  const [fee, setFee] = useState(0.01)
  const [feeUsd, setFeeUsd] = useState(10)
  const [detail, setDetail] = useState({
    bonus: 75,
    bonusRatio: 2.1,
    ETH: 1,
  })

  const [isF, isX] = useMemo(() => [selected === 0, selected === 1], [selected])

  return (
    <div className={styles.container}>
      <BalanceInput
        placeholder="0"
        balance="122.34"
        symbol="fETH"
        icon={`/images/f-s-logo${isF ? '-white' : ''}.svg`}
        color={isF ? 'blue' : undefined}
        type={isF ? '' : 'select'}
        className={styles.inputItem}
        usd="1,10"
        onSelected={() => setSelected(0)}
      />
      <BalanceInput
        placeholder="0"
        balance="36.16"
        symbol="xETH"
        tip="Bonus+"
        icon={`/images/x-s-logo${isX ? '-white' : ''}.svg`}
        color={isX ? 'red' : undefined}
        selectColor="red"
        type={isX ? '' : 'select'}
        className={styles.inputItem}
        usd="1,10"
        onSelected={() => setSelected(1)}
      />
      <div className={styles.arrow}>
        <DownOutlined />
      </div>

      <BalanceInput
        symbol="ETH"
        placeholder="124.3"
        usd="1800.24"
        disabled
        className={styles.inputItem}
      />
      <DetailCollapse
        title={`Redeem Fee: ${fee}ETH ~ $${feeUsd}`}
        detail={detail}
      />

      <Button className={styles.btn}>Redeem</Button>
    </div>
  )
}
