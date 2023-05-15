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
import usefxETH from '../../controller/usefxETH'

export default function Mint() {
  const [selected, setSelected] = useState(0)
  const [fee, setFee] = useState(0.01)
  const [feeUsd, setFeeUsd] = useState(10)
  const [ETHtAmount, setETHtAmount] = useState(0)
  const [FETHtAmount, setFETHtAmount] = useState(0)
  const [XETHtAmount, setXETHtAmount] = useState(0)
  const [detail, setDetail] = useState({
    bonus: 75,
    bonusRatio: 2.1,
    fETH: 2,
    xETH: 3,
  })
  const {
    fETHContract,
    xETHContract,
    marketContract,
    treasuryContract
  } = usefxETH();

  const [isF, isX] = useMemo(() => [selected === 0, selected === 1], [selected])

  const hanldeETHAmountChanged = (v) => {
    setETHtAmount(v)
  }
  const hanldeFETHAmountChanged = (v) => {
    setFETHtAmount(v)
  }

  const hanldeXETHAmountChanged = (v) => {
    setXETHtAmount(v)
  }

  const handleGetMinAmount = () => {

  }

  return (
    <div className={styles.container}>
      <BalanceInput
        placeholder="0"
        symbol="ETH"
        balance="124.3"
        usd="1800.24"
        onChange={hanldeETHAmountChanged}
      />
      <div className={styles.arrow}>
        <DownOutlined />
      </div>

      <BalanceInput
        symbol="fETH"
        icon={`/images/f-s-logo${isF ? '-white' : ''}.svg`}
        color={isF ? 'blue' : undefined}
        placeholder="300"
        disabled
        type={isF ? '' : 'select'}
        className={styles.inputItem}
        usd="1,10"
        onChange={hanldeFETHAmountChanged}
        onSelected={() => setSelected(0)}
      />
      <BalanceInput
        symbol="xETH"
        tip="Bonus+"
        icon={`/images/x-s-logo${isX ? '-white' : ''}.svg`}
        color={isX ? 'red' : undefined}
        selectColor="red"
        placeholder="300"
        disabled
        type={isX ? '' : 'select'}
        className={styles.inputItem}
        usd="1,10"

        onSelected={() => setSelected(1)}
      />

      <DetailCollapse
        title={`Mint Fee: ${fee}ETH ~ $${feeUsd}`}
        detail={detail}
      />

      <Button className={styles.btn}>Mint</Button>
    </div>
  )
}
