import React, { useEffect, useMemo, useState } from 'react'
import { Modal, Tooltip, DatePicker } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import moment from 'moment'
import config from 'config'
import useApprove from 'hooks/useApprove'
import NoPayableAction, { noPayableErrorAction } from 'utils/noPayableAction'
import useWeb3 from 'hooks/useWeb3'
import { checkNotZoroNum, cBN, fb4 } from 'utils'
import BalanceInput from '@/components/BalanceInput'
import styles from './styles.module.scss'
import {
  WEEK,
  YEARS,
  FOURYEARS,
  calc4,
  shortDate,
  lockTimeTipText,
} from '../../util'
import { useVeFXN, useErc20Token } from '@/hooks/useContracts'

export default function LockModal({ onCancel, refreshAction }) {
  const { isAllReady, sendTransaction } = useWeb3()
  const [lockAmount, setLockAmount] = useState()
  const [locktime, setLocktime] = useState(moment().add(1, 'day'))
  const [startTime, setStartTime] = useState(moment())
  const [locking, setLocking] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    const current = moment().startOf('day').add(8, 'hours')
    if (calc4(moment()).isSameOrBefore(current)) {
      setLocktime(calc4(moment().add(7, 'day')))
      setStartTime(calc4(moment().add(7, 'day')).subtract(1, 'days'))
    }
  }, [])

  const { contract: veFXNContract } = useVeFXN()

  const { tokenContract: fxnContract, tokenInfo: fxnInfo } = useErc20Token(
    config.contracts.FXN,
    config.contracts.veFXN
  )

  const { refreshTrigger: approveTrigger, BtnWapper } = useApprove({
    allowance: fxnInfo.allowance,
    tokenContract: fxnContract,
    approveAddress: config.contracts.veFXN,
    approveAmount: checkNotZoroNum(lockAmount) ? lockAmount : 0,
  })

  useEffect(() => {
    setRefreshTrigger((prev) => prev + 1)
  }, [approveTrigger])

  useEffect(() => {
    refreshAction((prev) => prev + 1)
  }, [refreshTrigger])

  const handleLock = async () => {
    if (!isAllReady) return
    const lockAmountInWei = cBN(lockAmount).toFixed(0, 1)
    setLocking(true)
    try {
      const timestamp = locktime.startOf('day').add(8, 'hours').unix()
      const apiCall = veFXNContract.methods.create_lock(
        lockAmountInWei.toString(),
        timestamp
      )
      await NoPayableAction(
        () =>
          sendTransaction({
            to: veFXNContract._address,
            data: apiCall.encodeABI(),
          }),
        {
          key: 'ctr',
          action: 'lock',
        },
        () => {
          setRefreshTrigger((prev) => prev + 1)
          setLocking(false)
          onCancel()
        }
      )
    } catch (error) {
      setLocking(false)
      noPayableErrorAction(`error_ctr_lock`, error)
    }
  }

  const addTime = (days) => {
    setLocktime(calc4(moment(moment().clone().add(days, 'day'))))
  }

  const vePower = useMemo(() => {
    if (cBN(lockAmount).isLessThan(0) || !lockAmount || !locktime) {
      return 0
    }

    const timestamp = locktime.utc().unix()

    const unlock_time = Math.floor(timestamp / WEEK) * WEEK
    const willBe =
      ((unlock_time - moment().utc().unix()) / (4 * YEARS)) * lockAmount

    return Number.isNaN(willBe)
      ? '-'
      : cBN(willBe).isLessThan(0)
      ? 0
      : cBN(willBe).toFixed(12)
  }, [lockAmount, locktime])

  const disabledDate = (current) => {
    return (
      current &&
      !current.isBetween(
        startTime,
        calc4(moment(startTime.clone().add(FOURYEARS, 'day')))
      )
    )
  }

  const canLock =
    cBN(fxnInfo.balance).isGreaterThan(0) &&
    cBN(lockAmount).isGreaterThan(0) &&
    cBN(lockAmount).isLessThanOrEqualTo(fxnInfo.balance)

  return (
    <Modal onCancel={onCancel} visible footer={null} width="600px">
      <div className={styles.info}>
        <div className="color-white">Lock FXN</div>
      </div>

      <div className="mb-8">
        <div className="mb-1" id="trigger">
          How much do you want to lock?
        </div>
        <BalanceInput
          placeholder="0"
          symbol="FXN"
          balance={fb4(fxnInfo.balance, false)}
          maxAmount={fxnInfo.balance}
          onChange={setLockAmount}
          withUsd={false}
        />
      </div>

      <div>
        <DatePicker
          value={locktime}
          onChange={setLocktime}
          disabledDate={disabledDate}
          className={styles.datePicker}
          getPopupContainer={() => document.getElementById('trigger')}
          showTime={false}
          showToday={false}
          renderExtraFooter={() => (
            <div className="flex justify-between flex-wrap">
              {shortDate.map((i) => (
                <div
                  key={i.value}
                  onClick={() => addTime(i.value)}
                  className="text-center w-2/6 underline text-blue-900 cursor-pointer"
                >
                  {i.lable}
                </div>
              ))}
            </div>
          )}
          dropdownClassName={styles.datePickerDropdown}
        />
      </div>

      <div className="my-8">
        <div className="text-[16px]">
          Your starting voting power will be:{' '}
          <span className="text-[var(--primary-color)]">{fb4(vePower)}</span>{' '}
          veFXN
        </div>
        <div className="mb-1 flex items-center gap-1 text-[16px]">
          Lock Time Until
          <Tooltip placement="top" title={lockTimeTipText} arrow color="#000">
            <InfoCircleOutlined />:
          </Tooltip>
          {locktime ? calc4(locktime).format('YYYY-MM-DD HH:mm:ss UTCZ') : '-'}
        </div>
      </div>

      <div className={styles.actions}>
        <BtnWapper
          width="100%"
          onClick={handleLock}
          disabled={!canLock}
          loading={locking}
        >
          Lock
        </BtnWapper>
      </div>
    </Modal>
  )
}
