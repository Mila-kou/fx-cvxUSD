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
import useVeShare_c from '../../controllers/useVeShare_c'

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
  const [share_to, setShareTo] = useState(OPTIONS[0].rebalancePoolAddress)
  const [amount, setAmount] = useState()
  const [locktime, setLocktime] = useState(moment().add(1, 'day'))
  const [startTime, setStartTime] = useState(moment())
  const [processing, setProcessing] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [isCheckShare, setIsCheckShare] = useState(-1)

  const { getGaugeContract, fetchGaugeInfo, fetchIsStakerAllowed } =
    useVeShare_c()

  const { title, subTitle, note } = typeList[isShare ? 1 : 0]

  const onChangeAddress = (obj) => {
    setAddress(obj.target.value)
  }

  console.log('share_to---', share_to)

  // useEffect(() => {
  //   setRefreshTrigger((prev) => prev + 1)
  // }, [approveTrigger])

  useEffect(() => {
    refreshAction((prev) => prev + 1)
  }, [refreshTrigger])

  const handleCheckIsShare = async () => {
    if (!isAllReady) return
    const _isAddress = web3.utils.isAddress(delegation_to_address)
    if (!_isAddress) {
      noPayableErrorAction(`Invalid Address`, 'Invalid Address')
      return
    }
    console.log('share_to---', share_to)
    const _data = await fetchIsStakerAllowed(share_to, delegation_to_address)
    setIsCheckShare(_data)
  }

  const handleProcess = async () => {
    if (!isAllReady) return
    const _isAddress = web3.utils.isAddress(delegation_to_address)
    if (!_isAddress) {
      noPayableErrorAction(`Invalid Address`, 'Invalid Address')
      return
    }
    setProcessing(true)

    try {
      const gaugeContract = getGaugeContract(share_to)
      const apiCall = gaugeContract.methods.toggleVoteSharing(
        delegation_to_address
      )
      const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(
        () => apiCall.send({ from: currentAccount, gas }),
        {
          key: 'share',
          action: 'share',
        },
        () => {
          setRefreshTrigger((prev) => prev + 1)
          setProcessing(false)
          onCancel()
        }
      )
    } catch (error) {
      setProcessing(false)
      noPayableErrorAction(`error_share`, error)
    }
  }

  const canProcess = delegation_to_address

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
              options={OPTIONS.map(
                ({ nameShow, rebalancePoolAddress, lpGaugeAddress }) => ({
                  value: rebalancePoolAddress || lpGaugeAddress,
                  label: nameShow,
                })
              )}
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

      <div className="text-[16px] mt-[32px]">{note}</div>

      <div className={styles.actions}>
        {isCheckShare == '-1' && (
          <Button onClick={handleCheckIsShare}>Check is share</Button>
        )}

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
