import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Modal } from 'antd'
import { useToggle, useSetState } from 'ahooks'
import Button from '@/components/Button'
import styles from './styles.module.scss'
import AcceleratorInput from '@/components/AcceleratorInput'

export default function WithdrawModal({ visible, onCancel }) {
  const selectedChange = () => {}
  const [loading, setLoading] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const withdraw = () => {}
  return (
    <Modal
      visible={visible}
      centered
      onCancel={onCancel}
      footer={null}
      width={500}
    >
      <div className={styles.content}>
        <h2>Withdraw fETH/ETH </h2>
        <AcceleratorInput
          available="111.33"
          selectedToken="fETH/ETH"
          options={['fETH/ETH', 'ETH']}
          selectedChange={selectedChange}
        />
      </div>

      <Button
        width="100%"
        loading={loading}
        disabled={disabled}
        onClick={withdraw}
      >
        Withdraw
      </Button>
    </Modal>
  )
}
