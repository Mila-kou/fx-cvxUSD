import React, { useEffect, useMemo, useState } from 'react'
import { DatePicker } from 'antd'
import Input from 'components/Input'
import Modal from 'components/Modal'
import moment from 'moment'
import config from 'config'
import useApprove from 'hooks/useApprove'
import NoPayableAction, { noPayableErrorAction } from 'utils/noPayableAction'
import Tip from 'components/Tip'
import useWeb3 from 'hooks/useWeb3'
import { checkNotZoroNum, cBN, fb4 } from 'utils'
import styles from './styles.module.scss'
import {
  WEEK,
  YEARS,
  FOURYEARS,
  calc4,
  tipText,
  shortDate,
  lockTimeTipText,
} from '../../util'
import { useVeFXN, useErc20Token } from '@/hooks/useContracts'

export default function LockModal({ onCancel, refreshAction }) {
  const { isAllReady, currentAccount } = useWeb3()
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
    const lockAmountInWei = lockAmount.toFixed(0, 1)
    setLocking(true)
    try {
      const timestamp = locktime.startOf('day').add(8, 'hours').unix()
      const apiCall = veFXNContract.methods.create_lock(
        lockAmountInWei.toString(),
        timestamp
      )
      const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(
        () => apiCall.send({ from: currentAccount, gas }),
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
    <Modal onCancel={onCancel}>
      <div className={styles.info}>
        <div className="color-white">Lock FXN</div>
      </div>

      <div className="mb-8">
        <div className="mb-1">How much do you want to lock?</div>
        <Input
          style={{ margin: 0 }}
          onChange={setLockAmount}
          available={fxnInfo.balance}
          hidePercent
          decimals={18}
          token="FXN"
        />
        <div className="">Available: {fb4(fxnInfo.balance)} FXN</div>
      </div>

      <div>
        <div className="mb-1 flex items-center gap-1" id="trigger">
          When do you want to lock to?
          <Tip title={tipText} style={{ width: '300px' }} />
        </div>
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
        <div>
          Your starting voting power will be: {fb4(vePower)} veFXNContract
        </div>
        <div className="mb-1 flex items-center gap-1">
          Lock Time Until
          <Tip title={lockTimeTipText} />:
          {locktime ? calc4(locktime).format('YYYY-MM-DD HH:mm:ss UTCZ') : '-'}
        </div>
      </div>

      <div className={styles.actions}>
        <BtnWapper onClick={handleLock} disabled={!canLock} loading={locking}>
          Lock
        </BtnWapper>
      </div>
    </Modal>
  )
}
