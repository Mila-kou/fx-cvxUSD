import React, { useCallback, useEffect, useMemo, useState } from 'react'
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

const OPTIONS = POOLS_LIST

export default function DelegateShareModal({ onCancel, refreshAction }) {
  const { isAllReady, web3, currentAccount } = useWeb3()
  const [share_from_address, setAddress] = useState('')
  const [share_to, setShareTo] = useState(OPTIONS[0].lpGaugeAddress)
  const [amount, setAmount] = useState()
  const [locktime, setLocktime] = useState(moment().add(1, 'day'))
  const [startTime, setStartTime] = useState(moment())
  const [sharing, setSharing] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [isCheckShare, setIsCheckShare] = useState(-1)

  const _last_ve_balance = 0

  const { getGaugeContract, fetchGaugeInfo, fetchIsStakerAllowed } =
    useVeShare_c()

  const onChangeAddress = (obj) => {
    setAddress(obj.target.value)
  }

  const onChangeSelectGauge = (obj) => {
    setIsCheckShare(-1)
    setShareTo(obj)
  }

  // useEffect(() => {
  //   setRefreshTrigger((prev) => prev + 1)
  // }, [approveTrigger])

  useEffect(() => {
    refreshAction((prev) => prev + 1)
  }, [refreshTrigger])

  const handleCheckIsShare = async () => {
    if (!isAllReady) return
    const _isAddress = web3.utils.isAddress(share_from_address)
    if (!_isAddress) {
      noPayableErrorAction(`Invalid Address`, 'Invalid Address')
      return
    }
    const _data = await fetchIsStakerAllowed(share_to, currentAccount).call({
      from: share_from_address,
    })
    setIsCheckShare(_data.IsStakerAllowedRes)
  }

  const handleProcess = async (type) => {
    if (!isAllReady) return
    const _isAddress = web3.utils.isAddress(share_from_address)
    if (!_isAddress) {
      noPayableErrorAction(`Invalid Address`, 'Invalid Address')
      return
    }
    setSharing(true)

    try {
      const gaugeContract = getGaugeContract(share_to)
      let apiCall = gaugeContract.methods.rejectSharedVote()
      if (type == 'accept') {
        apiCall = gaugeContract.methods.acceptSharedVote(currentAccount)
      } else {
        apiCall = gaugeContract.methods.rejectSharedVote()
      }
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
          setSharing(false)
          onCancel()
        }
      )
    } catch (error) {
      setSharing(false)
      noPayableErrorAction(`error_share`, error)
    }
  }

  const canProcess = share_from_address

  const ButtonDom = useCallback(() => {
    let _dom = (
      <Button width="100%" onClick={handleCheckIsShare}>
        Check Shared
      </Button>
    )
    if (isCheckShare == '-1') {
      _dom = (
        <Button width="100%" onClick={handleCheckIsShare}>
          Check Shared
        </Button>
      )
    } else {
      if (isCheckShare) {
        _dom = (
          <Button width="100%" disabled={!canProcess} loading={sharing}>
            No Share
          </Button>
        )
      }
      _dom = (
        <>
          <Button
            width="100%"
            onClick={() => handleProcess('accept')}
            disabled={!canProcess}
            loading={sharing}
          >
            Accept Share
          </Button>
          <Button
            width="100%"
            onClick={() => handleProcess('reject')}
            disabled={!canProcess}
            loading={sharing}
          >
            Reject Share
          </Button>
        </>
      )
    }
    return _dom
  }, [isCheckShare, share_from_address])
  return (
    <Modal onCancel={onCancel} visible footer={null} width="600px">
      <div className={styles.info}>
        <div className="color-white">Share your veFXN</div>
      </div>

      <div className="mb-[16px] text-[16px]" id="trigger">
        The address shared with will share your veFXN boosting.
      </div>

      <p className="mt-[32px] mb-[16px] text-[16px] text-[var(--second-text-color)]">
        Share to (address)
      </p>
      <TextInput onChange={onChangeAddress} withUsd={false} />

      <p className="mt-[32px] mb-[16px] text-[16px] text-[var(--second-text-color)]">
        Pool
      </p>
      <div className={styles.selectItem}>
        <InputSelect
          value={share_to}
          className="h-[60px]"
          onChange={(v) => onChangeSelectGauge(v)}
          options={OPTIONS.map(({ name, lpGaugeAddress }) => ({
            value: lpGaugeAddress,
            label: name,
          }))}
        />
      </div>

      <div className="text-[16px] mt-[32px]">
        After shared, you can canceled the sharing anytime, it will take effect
        every epoch.
      </div>

      <div className={styles.actions}>{ButtonDom()}</div>
    </Modal>
  )
}
