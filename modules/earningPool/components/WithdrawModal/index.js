import React, { useState, useCallback, useMemo } from 'react'
import { Modal } from 'antd'
import Button from '@/components/Button'
import noPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import useWeb3 from '@/hooks/useWeb3'
import BalanceInput, { useClearInput } from '@/components/BalanceInput'
import { cBN, formatBalance, checkNotZoroNum, fb4 } from '@/utils/index'
import config from '@/config/index'
import styles from './styles.module.scss'

export default function Withdraw(props) {
  const { onCancel, info } = props
  const { lpGaugeContract, zapTokens, name, userInfo } = info
  const { currentAccount, isAllReady, sendTransaction } = useWeb3()
  const [withdrawAmount, setWithdrawAmount] = useState()
  const [withdrawing, setWithdrawing] = useState(false)

  const handleInputChange = (val) => setWithdrawAmount(val)

  const handleWithdraw = async () => {
    if (!isAllReady) return

    setWithdrawing(true)
    let sharesInWei = cBN(withdrawAmount || 0).toFixed(0, 1)
    try {
      if (cBN(userInfo.userShare).isLessThanOrEqualTo(sharesInWei)) {
        sharesInWei = config.uint256Max
      }
      const apiCall = lpGaugeContract.methods.withdraw(
        sharesInWei,
        currentAccount
      )
      await noPayableAction(
        () =>
          sendTransaction({
            to: lpGaugeContract._address,
            data: apiCall.encodeABI(),
          }),
        {
          key: 'withdraw',
          action: 'Withdraw',
        }
      )
      onCancel()
      setWithdrawing(false)
    } catch (error) {
      // console.log(error)
      setWithdrawing(false)
      noPayableErrorAction(`error_withdraw`, error)
    }
  }
  const canWithdraw = useMemo(() => {
    return !!(withdrawAmount * 1) && isAllReady
  }, [withdrawAmount, isAllReady])

  return (
    <Modal visible centered onCancel={onCancel} footer={null} width={500}>
      <div className={styles.content}>
        <h2 className="mb-[16px]">{name}</h2>
        <BalanceInput
          placeholder="0"
          symbol={name}
          balance={fb4(userInfo.userShare, false)}
          maxAmount={userInfo.userShare}
          onChange={handleInputChange}
          withUsd={false}
        />
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
      </div>
    </Modal>
  )
}
