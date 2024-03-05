import React, { useState, useMemo } from 'react'
import { Modal } from 'antd'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { useToken } from '@/hooks/useTokenInfo'
import BalanceInput, { useClearInput } from '@/components/BalanceInput'
import useWeb3 from '@/hooks/useWeb3'
import useApprove from '@/hooks/useApprove'
import { NoticeCard } from '@/modules/assets/components/Common'
import { cBN, formatBalance, checkNotZoroNum, fb4 } from '@/utils/index'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import styles from './styles.module.scss'
import {
  useFXUSD_contract,
  useFxUSD_GatewayRouter_contract,
} from '@/hooks/useFXUSDContract'
import Button from '@/components/Button'

export default function DepositModal(props) {
  const baseToken = useSelector((state) => state.baseToken)
  const { fxUSD } = useSelector((state) => state.asset)
  const { onCancel, info, contractType, FX_RebalancePoolContract } = props
  const [depositing, setDepositing] = useState(false)
  const { currentAccount, isAllReady, sendTransaction } = useWeb3()
  const [selectToken, setSelectToken] = useState(info.zapTokens[0])

  const isRecap = baseToken?.[info.baseSymbol]?.data?.isRecap

  const [depositAmount, setDepositAmount] = useState(0)
  const { contract: fxUSD_contract } = useFXUSD_contract()

  const selectTokenInfo = useToken(selectToken.address, contractType, info)
  const tokenContract = selectTokenInfo.contract
  const tokenApproveContractAddress = selectTokenInfo.contractAddress
  const userTokenBalance = selectTokenInfo.balance

  const { BtnWapper } = useApprove({
    approveAmount: depositAmount,
    allowance: selectTokenInfo.allowance,
    tokenContract,
    approveAddress: tokenApproveContractAddress,
  })

  const [showManaged, managed] = useMemo(() => {
    const _managed = fxUSD.markets?.[info.baseSymbol]?.managed
    return [cBN(depositAmount).isGreaterThan(_managed), _managed]
  }, [depositAmount, fxUSD, info])

  const handleDeposit = async () => {
    if (!isAllReady) return
    const depositAmountInWei = cBN(depositAmount || 0).toFixed(0, 1)
    setDepositing(true)

    try {
      let apiCall
      let to
      if (selectToken.symbol === 'fETH') {
        to = FX_RebalancePoolContract._address
        apiCall = FX_RebalancePoolContract.methods.deposit(
          depositAmountInWei,
          currentAccount
        )
      } else {
        to = fxUSD_contract._address
        apiCall = fxUSD_contract.methods.earn(
          info.rebalancePoolAddress,
          depositAmountInWei,
          currentAccount
        )
      }

      await NoPayableAction(
        () =>
          sendTransaction({
            to,
            data: apiCall.encodeABI(),
          }),
        {
          key: 'lp',
          action: 'Deposit',
        }
      )
      onCancel()
      setDepositing(false)
    } catch (error) {
      console.log('error_deposit---', error)
      setDepositing(false)
      noPayableErrorAction(`error_deposit`, error)
    }
  }

  const handleInputChange = (val) => setDepositAmount(val)
  const canSubmit =
    !isRecap &&
    cBN(depositAmount).isGreaterThan(0) &&
    cBN(depositAmount).isLessThanOrEqualTo(cBN(userTokenBalance))

  return (
    <Modal visible centered onCancel={onCancel} footer={null} width={500}>
      <div className={styles.content}>
        <h2 className="mb-[16px]">Deposit {selectToken.symbol} </h2>

        <BalanceInput
          placeholder="0"
          symbol={selectToken.symbol}
          balance={fb4(userTokenBalance, false)}
          maxAmount={userTokenBalance}
          onChange={handleInputChange}
          withUsd={false}
        />
        {/* <p className={styles.note}>
          Note that withdrawals from Rebalancing Pool require 1 day waiting
          period. Pending withdrawals earn no yield, but may be used for stETH
          redemption.
        </p> */}
        <Link href={`/assets/${selectToken.symbol}/`}>
          <p className="text-center mt-[20px] text-[16px] underline text-[var(--a-button-color)]">
            Get {selectToken.symbol} to Deposit
          </p>
        </Link>
      </div>

      {isRecap ? (
        <NoticeCard
          content={[
            'f(x) governance decision to temporarily disable depositing.',
          ]}
        />
      ) : null}

      {showManaged ? (
        <NoticeCard
          content={[`A maximum of ${fb4(managed)} fxUSD can be deposited `]}
        />
      ) : null}

      <div className="mt-[30px]">
        {selectToken.symbol === 'fETH' ? (
          <BtnWapper
            width="100%"
            loading={depositing}
            disabled={!canSubmit}
            onClick={handleDeposit}
          >
            Deposit
          </BtnWapper>
        ) : (
          <Button width="100%" loading={depositing} onClick={handleDeposit}>
            Deposit
          </Button>
        )}
      </div>
    </Modal>
  )
}
