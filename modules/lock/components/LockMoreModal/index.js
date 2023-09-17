import React, { useEffect, useMemo, useState } from 'react'
import Modal from 'components/Modal'
import moment from 'moment'
import config from 'config'
import Input from 'components/Input'
import useApprove from 'hooks/useApprove'
import NoPayableAction, { noPayableErrorAction } from 'utils/noPayableAction'
import useWeb3 from 'hooks/useWeb3'
import { cBN, fb4, checkNotZoroNum } from 'utils'
import styles from './styles.module.scss'
import { YEARS, lockTimeTipText } from '../../util'
import { useVeFXN, useErc20Token } from '@/hooks/useContracts'

export default function LockMoreModal({ onCancel, pageData, refreshAction }) {
  const { isAllReady, currentAccount } = useWeb3()
  const [lockAmount, setLockAmount] = useState()
  const [locking, setLocking] = useState(false)
  const { userLocked } = pageData.contractInfo
  const [refreshTrigger, setRefreshTrigger] = useState(0)

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
      const apiCall = veFXNContract.methods.increase_amount(
        lockAmountInWei.toString()
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

  const vePower = useMemo(() => {
    const locktime = userLocked?.end ?? 0
    if (!lockAmount || cBN(lockAmount).isLessThan(0)) {
      return 0
    }

    const willBe =
      ((locktime - moment().utc().unix()) / (4 * YEARS)) * lockAmount
    return Number.isNaN(willBe)
      ? '-'
      : cBN(willBe).isLessThan(0)
      ? 0
      : cBN(willBe).isZero()
      ? 0
      : cBN(willBe).toFixed(12)
  }, [userLocked, lockAmount])

  const canLock =
    cBN(fxnInfo.balance).isGreaterThan(0) &&
    cBN(lockAmount).isGreaterThan(0) &&
    cBN(lockAmount).isLessThanOrEqualTo(fxnInfo.balance)

  return (
    <Modal onCancel={onCancel}>
      <div className={styles.info}>
        <div className="color-white">Lock More</div>
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
        <div className="mt-1">Available: {fb4(fxnInfo.balance)} FXN</div>
      </div>

      <div className="my-8">
        <div>
          Your starting voting power will be: {fb4(vePower)} veFXNContract
        </div>
        <div className="mb-1 flex items-center gap-1">
          Lock Time Until
          {/* <Tip title={lockTimeTipText} />: */}
          {userLocked.end
            ? moment(userLocked.end * 1000).format('YYYY-MM-DD HH:mm:ss UTCZ')
            : '-'}
        </div>
      </div>

      <div className={styles.actions}>
        <BtnWapper
          theme="lightBlue"
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
