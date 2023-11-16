import React, { useState, useCallback } from 'react'
import { Modal } from 'antd'
import useWeb3 from '@/hooks/useWeb3'
import Button from '@/components/Button'
import styles from './styles.module.scss'

const icons = {
  stETH: '/tokens/steth.svg',
  xETH: '/images/x-logo.svg',
  FXN: '/images/FXN.svg',
}

export default function ManageModal(props) {
  const { onCancel, info } = props
  const [canClaim, setCanClaim] = useState(false)
  const [claiming, setClaiming] = useState(false)
  const { currentAccount, isAllReady } = useWeb3()

  const handleClaim = () => {}

  const rewards = [
    {
      symbol: 'stETH',
      amount: '100000',
    },
    {
      symbol: 'xETH',
      amount: '900000',
    },
    {
      symbol: 'FXN',
      amount: '20000',
    },
  ]

  return (
    <Modal visible centered onCancel={onCancel} footer={null} width={500}>
      <div className={styles.content}>
        <h2 className="mb-[16px]">Claimable Rewards</h2>

        {rewards.map((item) => (
          <div className="mb-[16px] flex gap-[16px] items-center justify-between">
            <img className="h-[30px]" src={icons[item.symbol]} />
            <p className="flex-1">{item.symbol}</p>
            <p>{item.amount}</p>
          </div>
        ))}
      </div>

      <div className="mt-[40px]">
        <Button
          className="w-full"
          disabled={!canClaim}
          loading={claiming}
          onClick={handleClaim}
          type="second"
        >
          Claim
        </Button>
      </div>
    </Modal>
  )
}
