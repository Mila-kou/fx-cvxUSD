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
import InputSelect from '@/components/InputSelect'
import styles from './styles.module.scss'
import { REBALANCE_POOLS_LIST, POOLS_LIST } from '@/config/aladdinVault'
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

const typeList = [
  {
    title: 'Delegation',
    subTitle: 'The delegated address will obtain the right to use your veFXN.',
    note: 'After delegated, you can canceled the delegation anytime, it will take effect every epoch.',
  },
  {
    title: 'Share',
    subTitle: 'The address shared with will share your veFXN boosting.',
    note: 'After shared, you can canceled the sharing anytime, it will take effect every epoch.',
  },
]

const OPTIONS = [...REBALANCE_POOLS_LIST, ...POOLS_LIST]

export default function DelegateShareModal({
  isShare,
  onCancel,
  refreshAction,
}) {
  const { isAllReady, web3, currentAccount } = useWeb3()
  const [delegation_to_address, setAddress] = useState('')
  const [share_to, setShareTo] = useState(OPTIONS[0].shareAddress)
  const [amount, setAmount] = useState()
  const [locktime, setLocktime] = useState(moment().add(1, 'day'))
  const [startTime, setStartTime] = useState(moment())
  const [processing, setProcessing] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const {
    veTotalSupply,
    veLockedFXN,
    userLocked,
    userVeShare,
    _last_ve_balance,
  } = useVeBoostDelegateShare_c()

  const { end } = userLocked
  // moment(end * 1000).isBefore(moment()
  console.log('shareModal---', userVeShare, _last_ve_balance)

  const { title, subTitle, note } = typeList[isShare ? 1 : 0]

  useEffect(() => {
    const current = moment().startOf('day').add(8, 'hours')
    if (calc4(moment()).isSameOrBefore(current)) {
      setLocktime(calc4(moment().add(7, 'day')))
      setStartTime(calc4(moment().add(7, 'day')).subtract(1, 'days'))
    }
  }, [])

  const { contract: veFXNContract } = useVeFXN()
  const {
    contract: VotingEscrowBoostContract,
    address: fx_VotingEscrowBoostAdress,
  } = useVotingEscrowBoost()

  const onChangeAddress = (obj) => {
    setAddress(obj.target.value)
  }
  // const { tokenContract: fxnContract, tokenInfo: fxnInfo } = useErc20Token(
  //   config.contracts.veFXN,
  //   fx_VotingEscrowBoostAdress
  // )

  // const { refreshTrigger: approveTrigger, BtnWapper } = useApprove({
  //   allowance: fxnInfo.allowance,
  //   tokenContract: fxnContract,
  //   approveAddress: config.contracts.veFXN,
  //   approveAmount: checkNotZoroNum(amount) ? amount : 0,
  // })

  // useEffect(() => {
  //   setRefreshTrigger((prev) => prev + 1)
  // }, [approveTrigger])

  useEffect(() => {
    refreshAction((prev) => prev + 1)
  }, [refreshTrigger])

  const handleProcess = async () => {
    if (!isAllReady) return
    const _isAddress = web3.utils.isAddress(delegation_to_address)
    if (!_isAddress) {
      noPayableErrorAction(`Invalid Address`, 'Invalid Address')
      return
    }
    const boostAmountInWei = cBN(amount).gte(cBN(userVeShare).times(0.99))
      ? cBN(amount).times(0.99).toFixed(0, 1)
      : cBN(amount).toFixed(0, 1)

    setProcessing(true)

    try {
      const timestamp = locktime.startOf('day').add(8, 'hours').unix()
      const apiCall = VotingEscrowBoostContract.methods.boost(
        delegation_to_address,
        boostAmountInWei.toString(),
        timestamp
      )
      const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(
        () => apiCall.send({ from: currentAccount, gas }),
        {
          key: 'boost',
          action: 'boost',
        },
        () => {
          setRefreshTrigger((prev) => prev + 1)
          setProcessing(false)
          onCancel()
        }
      )
    } catch (error) {
      setProcessing(false)
      noPayableErrorAction(`error_boost`, error)
    }
  }

  const toEnd = () => {
    setLocktime(calc4(moment(end * 1000)))
  }

  const disabledDate = (current) => {
    return (
      current &&
      !current.isBetween(startTime, calc4(moment(end * 1000)), undefined, '(]')
    )
  }

  const canProcess =
    delegation_to_address &&
    cBN(userVeShare).isGreaterThan(0) &&
    cBN(amount).isGreaterThan(0) &&
    cBN(amount).isLessThanOrEqualTo(userVeShare)

  return (
    <Modal onCancel={onCancel} visible footer={null} width="600px">
      <div className={styles.info}>
        <div className="color-white">{title} your veFXN</div>
      </div>

      <div className="mb-[16px] text-[16px]" id="trigger">
        {subTitle}
      </div>

      <p className="mt-[32px] mb-[16px] text-[16px] text-[var(--second-text-color)]">
        {title} to (address)
      </p>
      <TextInput onChange={onChangeAddress} withUsd={false} />

      {isShare ? (
        <>
          <p className="mt-[32px] mb-[16px] text-[16px] text-[var(--second-text-color)]">
            Pool
          </p>
          <div className={styles.selectItem}>
            <InputSelect
              value={share_to}
              className="h-[60px]"
              onChange={(v) => setShareTo(v)}
              options={OPTIONS.map(({ shareAddress, nameShow }) => ({
                value: shareAddress,
                label: nameShow,
              }))}
            />
          </div>
        </>
      ) : (
        <>
          <p className="mt-[32px] mb-[16px] text-[16px] text-[var(--second-text-color)]">
            {title} Amount
          </p>
          <BalanceInput
            placeholder="0"
            symbol="veFXN"
            balance={fb4(_last_ve_balance, false)}
            maxAmount={_last_ve_balance}
            onChange={setAmount}
            withUsd={false}
          />
        </>
      )}

      <p className="mt-[32px] mb-[16px] text-[16px] text-[var(--second-text-color)]">
        Duration
      </p>
      <DatePicker
        value={locktime}
        onChange={setLocktime}
        disabledDate={disabledDate}
        className={styles.datePicker}
        getPopupContainer={() => document.getElementById('trigger')}
        showTime={false}
        showToday={false}
        renderExtraFooter={() => (
          <Button
            onClick={toEnd}
            type="second"
            w="100%"
            size="small"
            className="my-[20px] text-[14px]"
          >
            Until lock-up end:{' '}
            {end != 0 && end != undefined
              ? moment(end * 1000).format('YYYY-MM-DD')
              : '-'}
          </Button>
        )}
        dropdownClassName={styles.datePickerDropdown}
      />

      <div className="text-[16px] mt-[32px]">{note}</div>

      <div className={styles.actions}>
        <Button
          width="100%"
          onClick={handleProcess}
          disabled={!canProcess}
          loading={processing}
        >
          {title}
        </Button>
      </div>
    </Modal>
  )
}
