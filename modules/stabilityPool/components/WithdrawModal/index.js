import React, { useState, useCallback } from 'react'
import { Modal } from 'antd'
import Input from '@/components/Input'
import Button from '@/components/Button'
import { cBN } from '@/utils/index'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import useWeb3 from '@/hooks/useWeb3'
import { useContract } from '@/hooks/useContracts'
import abi from '@/config/abi'
import styles from './styles.module.scss'
import useStabiltyPool_c from '../../controller/c_stabiltyPool'

export default function WithdrawModal(props) {
  const { onCancel, info } = props
  const { currentAccount, isAllReady } = useWeb3()
  const [withdrawAmount, setWithdrawAmount] = useState()
  const [withdrawing, setWithdrawing] = useState(false)
  const { getContract } = useContract()

  const { logo, userInfo = {}, name, stakeTokenDecimals } = info
  const {
    userDeposit,
    userDepositTvl_text,
  } = useStabiltyPool_c()

  const handleInputChange = (val) => setWithdrawAmount(val)

  const handleWithdraw = async () => {
    if (!isAllReady) return
    const lpContract = getContract(
      info.lpGaugeAddress,
      abi.AlaLiquidityGaugeV3ABI
    )
    setWithdrawing(true)
    let sharesInWei = withdrawAmount?.toFixed(0, 1) || '0'
    try {
      if (cBN(userInfo.userDeposited).isLessThanOrEqualTo(sharesInWei)) {
        sharesInWei = userInfo.userDeposited
      }
      const apiCall = lpContract.methods.withdraw(sharesInWei)
      const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(() => apiCall.send({ from: currentAccount, gas }), {
        key: 'earn',
        action: 'Withdraw',
      })
      onCancel()
      setWithdrawing(false)
    } catch (error) {
      // console.log(error)
      setWithdrawing(false)
      noPayableErrorAction(`error_earn_deposit`, error)
    }
  }

  const earned = cBN(userInfo.userDeposited).toNumber()

  return (
    <Modal visible centered onCancel={onCancel} footer={null} width={600}>
      <div className={styles.content}>
        <h2>Withdraw fETH/ETH </h2>
        <Input
          balance={userDeposit}
          onChange={handleInputChange}
          // available={userDeposit}
          token={name}
          decimals={stakeTokenDecimals}
        />
      </div>

      <div className="mt-[56px]">
        <Button width="100%" loading={withdrawing} onClick={handleWithdraw}>
          Withdraw
        </Button>
      </div>
    </Modal>
  )
}
