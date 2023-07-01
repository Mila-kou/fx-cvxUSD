import React, { useEffect, useState, useMemo } from 'react'
import moment from 'moment'
import useWeb3 from '@/hooks/useWeb3'
import { cBN } from '@/utils/index'
import { WEEK, YEARS, calc4 } from '../util'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'

const useCreateLock = (parmas) => {
  const { currentAccount, current: currentTime, isAllReady } = useWeb3()
  const {
    veContract,
    refresh,
    lockAmount,
    userLocked,
    lockTo,
    status,
    actions,
    startTime: startTimeMoment,
  } = parmas

  const [locking, setLocking] = useState(false)

  const vePower = useMemo(() => {
    if (cBN(lockAmount ?? 0).isLessThan(0) || !lockTo) {
      return 0
    }

    const timestamp = lockTo.unix()
    // 2026.10.29T8:00 =< lockTo < 2026.10.29T8:00。
    const isMaxDate =
      timestamp == calc4(moment(startTimeMoment.clone().add(4, 'years'))).unix()
    const unlock_time =
      Math.floor((isMaxDate ? timestamp - 1 : timestamp) / WEEK) * WEEK
    const timeFactor = cBN(unlock_time - currentTime.unix()).div(4 * YEARS)
    const willBe = cBN(lockAmount).times(timeFactor)
    return Number.isNaN(willBe)
      ? '-'
      : cBN(willBe).isLessThan(0)
      ? 0
      : cBN(willBe)
  }, [lockAmount, startTimeMoment, currentTime, lockTo])

  const lockMoreVePower = useMemo(() => {
    const locktime = userLocked?.end ?? 0
    if (!lockAmount || cBN(lockAmount).isLessThan(0)) {
      return 0
    }

    const willBe = ((locktime - currentTime.unix()) / (4 * YEARS)) * lockAmount
    return Number.isNaN(willBe)
      ? '-'
      : cBN(willBe).isLessThan(0)
      ? 0
      : cBN(willBe).isZero()
      ? 0
      : cBN(willBe)
  }, [lockAmount, currentTime, userLocked])

  const extendVePower = useMemo(() => {
    if (!lockTo) {
      return 0
    }

    const _lockAmount = userLocked?.amount ?? 0

    if (!_lockAmount || cBN(userLocked?.amount ?? 0).isLessThan(0)) {
      return 0
    }

    const timestamp = lockTo.unix()
    // 2026.10.29T8:00 =< lockTo < 2026.10.29T8:00。
    const isMaxDate =
      timestamp ==
      calc4(moment(moment.unix(userLocked?.end).clone().add(4, 'years'))).unix()
    const unlock_time =
      Math.floor((isMaxDate ? timestamp - 1 : timestamp) / WEEK) * WEEK
    const willBe =
      ((unlock_time - currentTime.unix()) / (4 * YEARS)) * _lockAmount

    return willBe
  }, [lockTo, currentTime, userLocked])

  const days = useMemo(() => {
    const params = userLocked?.end
      ? moment().diff(
          moment(userLocked.end * 1000).startOf('day'),
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

  useEffect(() => {
    const current = currentTime.clone().startOf('day').add(8, 'hours')
    if (status == 'no-lock') {
      if (calc4(currentTime).isSameOrBefore(current)) {
        actions.setLockTo(calc4(currentTime.clone().add(1, 'week')))
        actions.setStartTime(calc4(currentTime.clone().add(1, 'week')))
      }
    } else if (status == 'ing' && userLocked?.end) {
      const lockedEndTime = moment.unix(userLocked?.end)
      actions.setLockTo(calc4(lockedEndTime.clone().add(1, 'week')))
      actions.setStartTime(calc4(lockedEndTime.clone().add(1, 'week')))
    }
  }, [status, currentTime, userLocked])

  const handleCreateLock = async (cb) => {
    if (!isAllReady) return
    const lockAmountInWei = lockAmount.toFixed(0, 1)
    setLocking(true)

    // 2026.10.29T8:00 =< lockTo < 2026.10.29T8:00。
    const isMaxDate =
      lockTo.unix() ==
      calc4(moment(startTimeMoment.clone().add(4, 'years'))).unix()
    try {
      const apiCall = veContract.methods.create_lock(
        lockAmountInWei.toString(),
        isMaxDate ? lockTo.unix() - 1 : lockTo.unix()
      )
      const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(() => apiCall.send({ from: currentAccount, gas }), {
        key: 've',
        action: 'create_lock',
      })
      setLocking(false)
      refresh()
      cb?.()
    } catch (error) {
      setLocking(false)
      noPayableErrorAction(`error_ve_create_lock`, error)
    }
  }

  const handleIncreaseTime = async () => {
    if (!isAllReady) return
    setLocking(true)
    // 2026.10.29T8:00 =< lockTo < 2026.10.29T8:00。
    const isMaxDate =
      lockTo.unix() ==
      calc4(moment(moment.unix(userLocked?.end).clone().add(4, 'years'))).unix()
    try {
      const apiCall = veContract.methods.increase_unlock_time(
        isMaxDate ? lockTo.unix() - 1 : lockTo.unix()
      )
      const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(() => apiCall.send({ from: currentAccount, gas }), {
        key: 've_increase_time',
        action: 'lock',
      })
      refresh()
      setLocking(false)
    } catch (error) {
      setLocking(false)
      noPayableErrorAction(`error_ve_increase_time`, error)
    }
  }

  const handleIncreaseAmount = async (cb) => {
    if (!isAllReady) return
    const lockAmountInWei = lockAmount.toFixed(0, 1)
    setLocking(true)
    try {
      const apiCall = veContract.methods.increase_amount(
        lockAmountInWei.toString()
      )
      const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(() => apiCall.send({ from: currentAccount, gas }), {
        key: 'ctr',
        action: 'lock',
      })
      refresh()
      setLocking(false)
      cb?.()
    } catch (error) {
      setLocking(false)
      noPayableErrorAction(`error_ctr_lock`, error)
    }
  }

  return {
    createLockLoading: locking,
    vePower,
    extendVePower,
    lockMoreVePower,
    handleCreateLock,
    handleIncreaseTime,
    handleIncreaseAmount,
    shortDate,
    extendDays: days,
  }
}

export default useCreateLock
