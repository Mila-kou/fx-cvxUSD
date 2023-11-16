import React, { useState, useCallback, useMemo } from 'react'
import Button from '@/components/Button'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import useWeb3 from '@/hooks/useWeb3'
import BalanceInput, { useClearInput } from '@/components/BalanceInput'
import { cBN, formatBalance, checkNotZoroNum, fb4 } from '@/utils/index'

export default function Withdraw(props) {
  const { onCancel, info, poolData, FX_RebalancePoolContract } = props
  const { currentAccount, isAllReady } = useWeb3()
  const [withdrawAmount, setWithdrawAmount] = useState()
  const [withdrawing, setWithdrawing] = useState(false)

  const { logo, name, stakeTokenDecimals } = info

  const handleInputChange = (val) => setWithdrawAmount(val)

  const handleWithdraw = async () => {
    if (!isAllReady) return

    setWithdrawing(true)
    // let sharesInWei = cBN(withdrawAmount || 0).toFixed(0, 1)
    // try {
    //   if (
    //     cBN(userInfo.stabilityPoolBalanceOfRes).isLessThanOrEqualTo(sharesInWei)
    //   ) {
    //     sharesInWei = userInfo.stabilityPoolBalanceOfRes
    //   }
    //   const apiCall = FX_RebalancePoolContract.methods.unlock(sharesInWei)
    //   const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
    //   const gas = parseInt(estimatedGas * 1.2, 10) || 0
    //   await NoPayableAction(() => apiCall.send({ from: currentAccount, gas }), {
    //     key: 'earn',
    //     action: 'Unlock',
    //   })
    //   onCancel()
    //   setWithdrawing(false)
    // } catch (error) {
    //   // console.log(error)
    //   setWithdrawing(false)
    //   noPayableErrorAction(`error_earn_withdraw`, error)
    // }
  }
  const canWithdraw = useMemo(() => {
    return !!(withdrawAmount * 1) && isAllReady
  }, [withdrawAmount, isAllReady])

  return (
    <div>
      <BalanceInput
        placeholder="0"
        symbol={name}
        balance={fb4(0, false)}
        maxAmount={1}
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
  )
}
