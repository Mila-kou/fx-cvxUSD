import React, { useState, useCallback, useMemo } from 'react'
import { Modal } from 'antd'
import Input from '@/components/Input'
import Button from '@/components/Button'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import useWeb3 from '@/hooks/useWeb3'
import { useContract, useFX_stabilityPool } from '@/hooks/useContracts'
import BalanceInput, { useClearInput } from '@/components/BalanceInput'
import abi from '@/config/abi'
import { cBN, formatBalance, checkNotZoroNum, fb4 } from '@/utils/index'
import styles from './styles.module.scss'
import useStabiltyPool_c from '../../controller/c_stabiltyPool'

export default function WithdrawModal(props) {
  const { onCancel, info, poolData } = props
  const { currentAccount, isAllReady } = useWeb3()
  const [withdrawAmount, setWithdrawAmount] = useState()
  const [withdrawing, setWithdrawing] = useState(false)
  const { contract: stabilityPoolContract } = useFX_stabilityPool()

  const { logo, name, stakeTokenDecimals } = info
  const { userInfo, baseInfo } = poolData

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
      const apiCall = stabilityPoolContract.methods.unlock(sharesInWei)
      const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(() => apiCall.send({ from: currentAccount, gas }), {
        key: 'earn',
        action: 'Unlock',
      })
      onCancel()
      setWithdrawing(false)
    } catch (error) {
      // console.log(error)
      setWithdrawing(false)
      noPayableErrorAction(`error_earn_withdraw`, error)
    }
  }
  const canWithdraw = useMemo(() => {
    return !!withdrawAmount && isAllReady
  }, [withdrawAmount, isAllReady])

  return (
    <Modal visible centered onCancel={onCancel} footer={null} width={500}>
      <div className={styles.content}>
        <h2 className="mb-[16px]">Withdraw fETH </h2>
        <BalanceInput
          placeholder="0"
          symbol={name}
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
