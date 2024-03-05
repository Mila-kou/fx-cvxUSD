import React, { useState, useCallback, useMemo } from 'react'
import { Modal } from 'antd'
import Button from '@/components/Button'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import useWeb3 from '@/hooks/useWeb3'
import BalanceInput, { useClearInput } from '@/components/BalanceInput'
import { cBN, formatBalance, checkNotZoroNum, fb4 } from '@/utils/index'
import styles from './styles.module.scss'

export default function WithdrawModal(props) {
  const { onCancel, info, poolData, FX_RebalancePoolContract } = props
  const { sendTransaction, isAllReady } = useWeb3()
  const [withdrawAmount, setWithdrawAmount] = useState()
  const [withdrawing, setWithdrawing] = useState(false)

  const { logo, name, stakeTokenDecimals } = info
  const { userInfo } = poolData

  const handleInputChange = (val) => setWithdrawAmount(val)

  const handleWithdraw = async () => {
    if (!isAllReady) return

    setWithdrawing(true)
    let sharesInWei = cBN(withdrawAmount || 0).toFixed(0, 1)
    try {
      if (
        cBN(userInfo.stabilityPoolBalanceOfRes).isLessThanOrEqualTo(sharesInWei)
      ) {
        sharesInWei = userInfo.stabilityPoolBalanceOfRes
      }
      const apiCall = FX_RebalancePoolContract.methods.unlock(sharesInWei)
      await NoPayableAction(
        () =>
          sendTransaction({
            to: FX_RebalancePoolContract._address,
            data: apiCall.encodeABI(),
          }),
        {
          key: 'earn',
          action: 'Unlock',
        }
      )
      onCancel()
      setWithdrawing(false)
    } catch (error) {
      // console.log(error)
      setWithdrawing(false)
      noPayableErrorAction(`error_earn_withdraw`, error)
    }
  }
  const canWithdraw = useMemo(() => {
    return (
      !!(withdrawAmount * 1) &&
      isAllReady &&
      cBN(withdrawAmount).isLessThanOrEqualTo(
        userInfo.stabilityPoolBalanceOfRes
      )
    )
  }, [withdrawAmount, isAllReady])

  return (
    <Modal visible centered onCancel={onCancel} footer={null} width={500}>
      <div className={styles.content}>
        <h2 className="mb-[16px]">Withdraw fETH </h2>
        <BalanceInput
          placeholder="0"
          symbol="fETH"
          balance={fb4(userInfo.stabilityPoolBalanceOfRes, false)}
          maxAmount={userInfo.stabilityPoolBalanceOfRes}
          onChange={handleInputChange}
          withUsd={false}
        />
      </div>

      <div className="mt-[40px]">
        <Button
          width="100%"
          disabled={!canWithdraw}
          loading={withdrawing}
          onClick={handleWithdraw}
        >
          Withdraw
        </Button>
      </div>
    </Modal>
  )
}
