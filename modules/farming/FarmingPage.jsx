import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
// import { Button, InputNumber } from 'antd'
import { useToggle, useSetState } from 'ahooks'
import SimpleInput from '@/components/SimpleInput'
import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import { cBN, checkNotZoroNum, fb4 } from '@/utils/index'
import { useToken } from '@/hooks/useTokenInfo'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import { getGas } from '@/utils/gas'
import useGlobal from '@/hooks/useGlobal'
import styles from './styles.module.scss'
import Button from '@/components/Button'
import { useContract } from '@/hooks/useContracts'
import abi from '@/config/abi'
import LPCard from './components/LPCard'
import DepositModal from './components/DepositModal'
import WithdrawModal from './components/WithdrawModal'

export default function FarmingPage() {
  // const {} = useGlobal()
  const [visible, { toggle }] = useToggle()
  const [visibleW, { toggle: toggleW }] = useToggle()

  const handleDeposit = (type) => {
    toggle()
  }

  const handleWithdraw = (type) => {
    toggleW()
  }

  return (
    <div className={styles.container}>
      <LPCard
        type="fx"
        onDeposit={() => handleDeposit('fx')}
        onWithdraw={() => handleWithdraw('fx')}
      />
      <LPCard
        type="fETH"
        onDeposit={() => handleDeposit('fETH')}
        onWithdraw={() => handleWithdraw('fETH')}
      />
      <LPCard
        type="xETH"
        onDeposit={() => handleDeposit('xETH')}
        onWithdraw={() => handleWithdraw('xETH')}
      />

      <DepositModal visible={visible} onCancel={toggle} />
      <WithdrawModal visible={visibleW} onCancel={toggleW} />
    </div>
  )
}
