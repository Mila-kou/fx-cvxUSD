import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Modal } from 'antd'
import { useToggle, useSetState } from 'ahooks'
import Button from '@/components/Button'
import styles from './styles.module.scss'
import AcceleratorInput from '@/components/AcceleratorInput'

export default function DepositModal({ visible, onCancel }) {
  const selectedChange = () => {}
  const [loading, setLoading] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const deposit = () => {}
  return (
    <Modal
      visible={visible}
      centered
      onCancel={onCancel}
      footer={null}
      width={500}
    >
      <div className={styles.content}>
        <h2>Deposit fETH/ETH </h2>
        <AcceleratorInput
          balance="111.33"
          selectedToken="fETH/ETH"
          options={['fETH/ETH', 'ETH']}
          selectedChange={selectedChange}
        />

        <div className={styles.info}>
          <p>
            Minimum fETH/ETH to receive: <span>-</span>
          </p>
          <p>
            Max Slippage:
            <span>
              0.1% <a>Edit</a>
            </span>
          </p>
          <p>
            Your depositing token are adding liquidity to the Curve fETH/ETH
            pool.
          </p>
        </div>
      </div>

      <Button
        width="100%"
        loading={loading}
        disabled={disabled}
        onClick={deposit}
      >
        Deposit
      </Button>
    </Modal>
  )
}
