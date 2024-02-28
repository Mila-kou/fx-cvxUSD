import React, { useEffect, useMemo, useState } from 'react'
import { Modal, Tooltip, DatePicker } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import moment from 'moment'
import useWeb3 from 'hooks/useWeb3'
import NoPayableAction, { noPayableErrorAction } from 'utils/noPayableAction'
import { cBN, fb4 } from 'utils'
import Button from 'components/Button'
import { WEEK, YEARS, calc4, tipText, lockTimeTipText } from '../../util'
import { useVeFXN } from '@/hooks/useContracts'
import styles from './styles.module.scss'

export default function ExtendModal({ onCancel, pageData, refreshAction }) {
  const { isAllReady, currentAccount } = useWeb3()
  const [locktime, setLocktime] = useState(moment())
  const [current, setCurrent] = useState()
  const [locking, setLocking] = useState(false)
  const { userLocked } = pageData.contractInfo
  const { contract: veFXNContract } = useVeFXN()

  const handleLock = async () => {
    if (!isAllReady) return
    setLocking(true)
    try {
      const apiCall = veFXNContract.methods.increase_unlock_time(
        locktime.unix()
      )
      const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
      const gas = parseInt(estimatedGas * 1, 10) || 0
      await NoPayableAction(
        () => apiCall.send({ from: currentAccount, gas }),
        {
          key: 'ctr',
          action: 'lock',
        },
        () => {
          refreshAction((prev) => prev + 1)
          setLocking(false)
          onCancel()
        }
      )
    } catch (error) {
      setLocking(false)
      noPayableErrorAction(`error_ctr_lock`, error)
    }
  }

  const vePower = useMemo(() => {
    if (!locktime) {
      return 0
    }

    const lockAmount = userLocked?.amount ?? 0

    if (!lockAmount || cBN(userLocked?.amount ?? 0).isLessThan(0)) {
      return 0
    }

    const timestamp = locktime.unix()

    const unlock_time = Math.floor(timestamp / WEEK) * WEEK
    const willBe =
      ((unlock_time - moment().utc().unix()) / (4 * YEARS)) * lockAmount

    return willBe
  }, [userLocked, locktime])

  useEffect(() => {
    if (userLocked?.end) {
      setLocktime(moment(userLocked?.end * 1000).add(1, 'week'))
    }
  }, [userLocked?.end])

  const addTime = (days) => {
    const params = moment(moment().add(days, 'day'))
    setLocktime(params)
  }

  const disabledDate = (current) => {
    if (!userLocked?.end) {
      return false
    }
    const calcDate = calc4(current).startOf('day')
    return current && !calcDate.isAfter(moment(userLocked.end * 1000))
  }

  const days = useMemo(() => {
    const params = userLocked?.end
      ? moment().diff(
          moment(userLocked?.end * 1000).startOf('day'),
          'days',
          true
        )
      : 0
    return Math.abs(params) + 7
  }, [userLocked])

  const shortDate = useMemo(() => {
    return [
      {
        lable: '4 years',
        disabledDate: days > 1457,
        value: 1460,
      },
      {
        lable: '1 year',
        disabledDate: days > 365,
        value: 365,
      },
      {
        lable: '6 months',
        disabledDate: days > 180,
        value: 180,
      },
      {
        lable: '3 months',
        disabledDate: days > 90,
        value: 90,
      },
      {
        lable: '1 month',
        disabledDate: days > 30,
        value: 30,
      },
      {
        lable: '1 week',
        disabledDate: days > 7,
        value: 7,
      },
    ]
  }, [days])

  const handleShortDateClick = (i) => {
    if (!i.disabledDate) {
      addTime(i.value)
      setCurrent(i.value)
    }
  }

  return (
    <Modal onCancel={onCancel} visible footer={null}>
      <div className={styles.info}>
        <div className="color-white">Extend</div>
      </div>

      <div>
        <DatePicker
          value={locktime}
          onChange={setLocktime}
          disabledDate={disabledDate}
          className={styles.datePicker}
          showTime={false}
          showToday={false}
          dropdownClassName={styles.datePickerDropdown}
        />
        <div className={styles.months}>
          {shortDate.map((i) => (
            <a
              key={i.value}
              className={`${i.disabledDate ? styles.disabled : ''} ${
                i.value === current ? styles.active : ''
              }`}
              onClick={() => handleShortDateClick(i)}
            >
              {i.lable}
            </a>
          ))}
        </div>
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
        <Button
          width="100%"
          onClick={handleLock}
          disabled={days > 1457}
          loading={locking}
        >
          Extend
        </Button>
      </div>
    </Modal>
  )
}
