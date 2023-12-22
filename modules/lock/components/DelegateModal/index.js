import React, { useEffect, useMemo, useState } from 'react'
import { Modal, Tooltip, DatePicker } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import moment from 'moment'
import config from 'config'
import useApprove from 'hooks/useApprove'
import NoPayableAction, { noPayableErrorAction } from 'utils/noPayableAction'
import useWeb3 from 'hooks/useWeb3'
import { checkNotZoroNum, cBN, fb4 } from 'utils'
import TextInput from '@/components/TextInput'
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
import { useVotingEscrowBoost } from '@/hooks/useVeContracts'
import useVeBoostDelegateShare_c from '../../controllers/useVeboost_c'
import Button from '@/components/Button'
import useInfo from '../../controllers/useInfo'
import useVeShare_c from '../../controllers/useVeShare_c'

export default function DelegateShareModal({ onCancel, refreshAction }) {
  const { isAllReady, web3, currentAccount } = useWeb3()
  const [delegation_to_address, setAddress] = useState('')
  const [amount, setAmount] = useState()
  const [locktime, setLocktime] = useState(moment().add(1, 'day'))
  const [startTime, setStartTime] = useState(moment())
  const [delegating, setDelegating] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const _last_ve_balance = 0

  const { getGaugeContract, fetchGaugeInfo, fetchIsStakerAllowed } =
    useVeShare_c()

  const onChangeAddress = (obj) => {
    setAddress(obj.target.value)
  }

  // useEffect(() => {
  //   setRefreshTrigger((prev) => prev + 1)
  // }, [approveTrigger])

  useEffect(() => {
    refreshAction((prev) => prev + 1)
  }, [refreshTrigger])

  const handleDelegate = async () => {
    if (!isAllReady) return
    const _isAddress = web3.utils.isAddress(delegation_to_address)
    if (!_isAddress) {
      noPayableErrorAction(`Invalid Address`, 'Invalid Address')
      return
    }
    setDelegating(true)

    // try {
    //   const gaugeContract = getGaugeContract(share_to)
    //   const apiCall = gaugeContract.methods.toggleVoteSharing(
    //     delegation_to_address
    //   )
    //   const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
    //   const gas = parseInt(estimatedGas * 1.2, 10) || 0
    //   await NoPayableAction(
    //     () => apiCall.send({ from: currentAccount, gas }),
    //     {
    //       key: 'share',
    //       action: 'share',
    //     },
    //     () => {
    //       setRefreshTrigger((prev) => prev + 1)
    //       setDelegating(false)
    //       onCancel()
    //     }
    //   )
    // } catch (error) {
    //   setDelegating(false)
    //   noPayableErrorAction(`error_share`, error)
    // }
  }

  const canDelegate = delegation_to_address

  return (
    <Modal onCancel={onCancel} visible footer={null} width="600px">
      <div className={styles.info}>
        <div className="color-white">Delegation your veFXN</div>
      </div>

      <div className="mb-[16px] text-[16px]" id="trigger">
        The delegated address will obtain the right to use your veFXN.
      </div>

      <p className="mt-[32px] mb-[16px] text-[16px] text-[var(--second-text-color)]">
        Delegation to (address)
      </p>
      <TextInput onChange={onChangeAddress} withUsd={false} />

      <p className="mt-[32px] mb-[16px] text-[16px] text-[var(--second-text-color)]">
        Delegation Amount
      </p>
      <BalanceInput
        placeholder="0"
        symbol="veFXN"
        balance={fb4(_last_ve_balance, false)}
        maxAmount={_last_ve_balance}
        onChange={setAmount}
        withUsd={false}
      />

      <div className="text-[16px] mt-[32px]">
        After delegated, you can canceled the delegation anytime, it will take
        effect every epoch.
      </div>

      <div className={styles.actions}>
        <Button
          width="100%"
          onClick={handleDelegate}
          disabled={!canDelegate}
          loading={delegating}
        >
          Delegate
        </Button>
      </div>
    </Modal>
  )
}
