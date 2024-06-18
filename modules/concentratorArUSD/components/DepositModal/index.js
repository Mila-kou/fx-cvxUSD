import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { Modal, Switch, Tooltip } from 'antd'
import { useDebounceEffect } from 'ahooks'
import { useToken } from '@/hooks/useTokenInfo'
import BalanceInput, { useClearInput } from '@/components/BalanceInput'
import useWeb3 from '@/hooks/useWeb3'
import useApprove from '@/hooks/useApprove'
import {
  cBN,
  formatBalance,
  checkNotZoroNum,
  fb4,
  checkNotZoroNumOption,
} from '@/utils/index'
import noPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import styles from './styles.module.scss'
import { DetailCell } from '@/modules/assets/components/Common'
import { useArUSDWrap_contract } from '@/hooks/useConcentratorContract'

export default function DepositModal(props) {
  const { onCancel, info, poolData } = props
  const {
    config: { zapTokens },
    name,
  } = info
  const { baseInfo = {} } = poolData
  const { liquidatedRes } = baseInfo
  const [depositing, setDepositing] = useState(false)
  const { currentAccount, isAllReady, sendTransaction } = useWeb3()
  const {
    contract: compounderTokenWrapContract,
    address: compounderTokenWrapAddress,
  } = useArUSDWrap_contract()

  const [selectToken, setSelectToken] = useState(zapTokens[0])

  const [minoutNum, setMinoutNum] = useState(0)
  const [depositAmount, setDepositAmount] = useState(0)

  const selectTokenInfo = useToken(selectToken.address, 'wrapArUSD', info)
  const tokenContract = selectTokenInfo.contract
  const tokenApproveContractAddress = selectTokenInfo.contractAddress
  const userTokenBalance = selectTokenInfo.balance

  const { BtnWapper } = useApprove({
    approveAmount: depositAmount,
    allowance: selectTokenInfo.allowance,
    tokenContract,
    approveAddress: tokenApproveContractAddress,
  })

  const handleMinout = async () => {
    try {
      let minoutAmount = 0
      if (liquidatedRes) {
        setMinoutNum(minoutAmount)
        return minoutAmount
      }
      const depositAmountInWei = cBN(depositAmount || 0).toFixed(0, 1)
      const data = await compounderTokenWrapContract.methods
        .previewDeposit(depositAmountInWei)
        .call()
      minoutAmount = data
      setMinoutNum(minoutAmount)
      return minoutAmount
    } catch (error) {
      console.log('arUSD--error', error)
      return false
    }
  }

  const handleDeposit = async () => {
    if (!isAllReady) return
    if (liquidatedRes) {
      noPayableErrorAction(
        `error_arUSD_deposit`,
        'The Stability Pool is undergoing liquidation, temporarily unable to make deposits.'
      )
      setDepositing(false)
      return
    }
    setDepositing(true)
    const depositAmountInWei = cBN(depositAmount || 0).toFixed(0, 1)
    const _minout = await handleMinout()
    console.log('arUSD---_minout--', _minout)
    if (!_minout) {
      noPayableErrorAction(
        `error_arUSD_deposit`,
        'Unable to mint fxUSD. Please mint it on the f(x) platform first and then deposit it.'
      )
      setDepositing(false)
      return
    }
    try {
      const apiCall = compounderTokenWrapContract.methods.deposit(
        depositAmountInWei,
        currentAccount
      )
      await noPayableAction(
        () =>
          sendTransaction({
            to: compounderTokenWrapAddress,
            data: apiCall.encodeABI(),
          }),
        {
          key: 'arUSD',
          action: 'deposit',
        }
      )
      setDepositing(false)
      onCancel()
    } catch (error) {
      setDepositing(false)
      if (!error) {
        noPayableErrorAction(
          `error_arUSD_deposit`,
          'Unable to mint fxUSD. Please mint it on the f(x) platform first and then deposit it.'
        )
      } else {
        noPayableErrorAction(`error_arUSD_deposit`, error)
      }
    }
  }

  useDebounceEffect(
    () => {
      handleMinout()
    },
    [depositAmount, selectToken, currentAccount],
    {
      wait: 1000,
    }
  )

  const handleInputChange = (val) => setDepositAmount(val)
  const canSubmit =
    cBN(depositAmount).isGreaterThan(0) &&
    cBN(depositAmount).isLessThanOrEqualTo(cBN(userTokenBalance))

  return (
    <Modal visible centered onCancel={onCancel} footer={null} width={500}>
      <div className={styles.content}>
        <h2 className="mb-[16px] flex justify-between items-center">rUSD</h2>
        <BalanceInput
          placeholder="0"
          symbol="rUSD"
          balance={fb4(userTokenBalance, false)}
          maxAmount={userTokenBalance}
          onChange={handleInputChange}
          withUsd={false}
        />
        <div className="mt-[10px]">
          <DetailCell
            title="Min. Received:"
            content={[
              checkNotZoroNumOption(minoutNum, fb4(minoutNum, false, 18, 2)),
            ]}
          />
        </div>
        <div className="mt-[20px]">
          <BtnWapper
            width="100%"
            loading={depositing}
            disabled={!canSubmit}
            onClick={handleDeposit}
          >
            Deposit
          </BtnWapper>
        </div>
      </div>
    </Modal>
  )
}
