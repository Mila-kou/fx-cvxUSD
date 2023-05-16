import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import BalanceInput from '@/components/BalanceInput'
import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import { cBN, checkNotZoroNum, fb4 } from '@/utils/index'
import { useToken } from '@/hooks/useTokenInfo'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import { getGas } from '@/utils/gas'
import useGlobal from '@/hooks/useGlobal'
import DetailCollapse from '../DetailCollapse'
import styles from './styles.module.scss'
import usefxETH from '../../controller/usefxETH'

export default function Mint() {
  const { _currentAccount } = useWeb3()
  const [selected, setSelected] = useState(0)
  const { tokens } = useGlobal()
  // const [fee, setFee] = useState(0.01)
  // const [feeUsd, setFeeUsd] = useState(10)
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
    treasuryContract,
    _mintFETHFee,
    _mintXETHFee,
    ethPrice
  } = usefxETH()

  const [isF, isX] = useMemo(() => [selected === 0, selected === 1], [selected])

  const [fee, feeUsd] = useMemo(() => {
    const _fee = cBN(ETHtAmount).multipliedBy(_mintFETHFee)
    const _feeUsd = cBN(_fee).multipliedBy(1 || 1)
    console.log('ETHtAmount---_newETHPrice--', _fee.toString(10), _feeUsd.toString(10), ethPrice)
    return [fb4(_fee), fb4(_feeUsd)]
  }, [ETHtAmount, ethPrice])

  const hanldeETHAmountChanged = (v) => {
    console.log(v)
    if (checkNotZoroNum(v)) {
      console.log('vv------', v.toString(10))
      setETHtAmount(v.toString(10))
    }
  }
  const hanldeFETHAmountChanged = (v) => {
    setFETHtAmount(v.toString(10))
  }

  const hanldeXETHAmountChanged = (v) => {
    setXETHtAmount(v.toString(10))
  }

  const handleGetMinAmount = async () => {
    console.log('ETHtAmount----', ETHtAmount)
    try {
      const minout = await marketContract.methods
        .mintFToken(ETHtAmount, _currentAccount, 0)
        .call()
      console.log('minout---', minout)
    } catch (e) {
      console.log(e)
      return 0
    }
  }

  const handleGetAllMinAmount = async () => {
    console.log('ETHtAmount----', ETHtAmount)
    try {
      const minout = await marketContract.methods
        .mint(ETHtAmount, _currentAccount, 0, 0)
        .call()
      console.log('minout---', minout)
    } catch (e) {
      console.log(e)
      return 0
    }
  }

  useEffect(() => {
    // handleGetMinAmount()
    handleGetAllMinAmount()
  }, [selected, ETHtAmount])

  return (
    <div className={styles.container}>
      <BalanceInput
        placeholder="0"
        symbol="ETH"
        balance={fb4(tokens.ETH.balance, false)}
        usd={tokens.ETH.usd}
        maxAmount={tokens.ETH.balance}
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
