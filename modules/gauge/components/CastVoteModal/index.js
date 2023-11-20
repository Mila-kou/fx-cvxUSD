import React, { useState, useCallback } from 'react'
import { Modal } from 'antd'
import useWeb3 from '@/hooks/useWeb3'
import Button from '@/components/Button'
import {
  useContract,
  useVeFXN,
  useFxGaugeController,
} from '@/hooks/useContracts'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import styles from './styles.module.scss'

const icons = {
  stETH: '/tokens/steth.svg',
  xETH: '/images/x-logo.svg',
  FXN: '/images/FXN.svg',
}

export default function CastVoteModal({ onCancel, info }) {
  const [canVote, setCanVote] = useState(true)
  const [voting, setVoting] = useState(false)
  const { currentAccount, isAllReady } = useWeb3()
  const { contract: gaugeControllerContract } = useFxGaugeController()

  const handleVote = async () => {
    if (!isAllReady) return
    // const depositAmountInWei = cBN(depositAmount || 0).toFixed(0, 1)
    setVoting(true)
    try {
      const apiCall = gaugeControllerContract.methods.vote_for_gauge_weights(
        '0xF74CA519Fe35Ec6A862A4debD8e317BeD3c47c87',
        100
      )
      const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(() => apiCall.send({ from: currentAccount, gas }), {
        key: 'lp',
        action: 'Vot',
      })
      onCancel()
      setVoting(false)
    } catch (error) {
      console.log('error_vote---', error)
      setVoting(false)
      noPayableErrorAction(`error_vote`, error)
    }
  }

  const rewards = [
    {
      name: 'Rebalance Pool A',
      amount: '10% (10,000 votes)',
    },
    {
      name: 'Rebalance Pool C',
      amount: '10% (10,000 votes)',
    },
    {
      name: 'FXN / ETH Curve LP',
      amount: '10% (10,000 votes)',
    },
  ]

  return (
    <Modal visible centered onCancel={onCancel} footer={null} width={500}>
      <div className={styles.content}>
        <h2 className="mb-[32px]">Voting for</h2>

        <div className="mb-[16px] flex justify-between">
          <p className="flex-1 text-[var(--second-text-color)]">Pool Name</p>
          <p className="text-[var(--second-text-color)]">Votes</p>
        </div>

        {rewards.map((item) => (
          <div className="mb-[16px] flex gap-[16px] items-center justify-between">
            <p className="flex-1">{item.name}</p>
            <p>{item.amount}</p>
          </div>
        ))}
      </div>

      <p className="mt-[40px] text-[var(--second-text-color)]">
        Will take effect in the next Epoch: <b>Thu 11.16.2023 08:00 am UTC+8</b>
      </p>

      <div className="mt-[40px] flex gap-[16px]">
        <Button className="w-full" onClick={onCancel} type="second">
          Cancel
        </Button>
        <Button
          className="w-full"
          disabled={!canVote}
          loading={voting}
          onClick={handleVote}
        >
          Vote
        </Button>
      </div>
    </Modal>
  )
}
