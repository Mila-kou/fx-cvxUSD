import React, { useState, useCallback } from 'react'
import { Modal } from 'antd'
import useWeb3 from '@/hooks/useWeb3'
import Button from '@/components/Button'
import { useFxGaugeController } from '@/hooks/useContracts'
import noPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import styles from './styles.module.scss'

const icons = {
  stETH: '/tokens/steth.svg',
  xETH: '/images/x-logo.svg',
  FXN: '/images/FXN.svg',
}

export default function CastVoteModal({ onCancel, voteData }) {
  const [voting, setVoting] = useState(false)
  const { currentAccount, isAllReady, sendTransaction } = useWeb3()
  const { contract: gaugeControllerContract } = useFxGaugeController()

  const handleVote = async () => {
    if (!isAllReady) return
    setVoting(true)
    try {
      const apiCall = gaugeControllerContract.methods.vote_for_gauge_weights(
        voteData.lpGaugeAddress,
        voteData.newPower * 100
      )
      await noPayableAction(
        () =>
          sendTransaction({
            to: gaugeControllerContract._address,
            data: apiCall.encodeABI(),
          }),
        {
          key: 'lp',
          action: 'Vot',
        }
      )
      onCancel()
      setVoting(false)
    } catch (error) {
      console.log('error_vote---', error)
      setVoting(false)
      noPayableErrorAction(`error_vote`, error)
    }
  }

  console.log('voteData---', voteData)

  return (
    <Modal visible centered onCancel={onCancel} footer={null} width={500}>
      <div className={styles.content}>
        <h2 className="mb-[32px]">Voting for</h2>

        <div className="mb-[16px] flex justify-between">
          <p className="flex-1 text-[var(--second-text-color)]">Pool Name</p>
          <p className="text-[var(--second-text-color)]">Votes</p>
        </div>

        {[voteData].map((item) => (
          <div className="mb-[16px] flex gap-[16px] items-center justify-between">
            <p className="flex-1">{item.name}</p>
            <p className="text-[var(--primary-color)]">
              {item.newPower}% ({item.newPowerVote})
            </p>
          </div>
        ))}
      </div>

      <p className="mt-[40px] text-[var(--second-text-color)]">
        Will take effect in the next Epoch:{' '}
        <b className="text-[var(--primary-color)]">{voteData.nextEpoch}</b>
      </p>

      <div className="mt-[40px] flex gap-[16px]">
        <Button className="w-full" onClick={onCancel} type="second">
          Cancel
        </Button>
        <Button className="w-full" loading={voting} onClick={handleVote}>
          Vote
        </Button>
      </div>
    </Modal>
  )
}
