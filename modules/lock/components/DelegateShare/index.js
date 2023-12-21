import React, { useCallback, useEffect, useMemo, useState } from 'react'
import moment from 'moment'
import { cBN, fb4, checkNotZoroNum } from 'utils'
import Tabs from '@/modules/home/components/Tabs'
import styles from './styles.module.scss'
import DelegateShareModal from '../DelegateShareModal'
import useInfo from '../../controllers/useInfo'
import { useVotingEscrowBoost } from '@/hooks/useVeContracts'
import useWeb3 from '@/hooks/useWeb3'
import noPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'

export default function DelegateShare({ refreshAction }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const pageData = useInfo()
  const { isAllReady, currentAccount } = useWeb3()
  console.log('pageData---', pageData)
  const isShare = activeIndex === 1
  const {
    contract: VotingEscrowBoostContract,
    address: fx_VotingEscrowBoostAdress,
  } = useVotingEscrowBoost()
  const [_newBoostRes, _receivedRes] = useMemo(() => {
    const __newBoostRes = []
    let __receivedRes = 0
    if (pageData.contractInfo && pageData.contractInfo.boostsRes) {
      const _currentTime = Math.ceil(new Date().getTime() / 1000)
      pageData.contractInfo.boostsRes.map((item, index) => {
        if (
          cBN(item.cancelAmount).lt(item.initialAmount) &&
          cBN(_currentTime).lt(item.endTime)
        ) {
          __newBoostRes.push({ ...item, index })
        }
      })
    }
    if (pageData.contractInfo && pageData.contractInfo.receivedRes) {
      const { ts, slope, bias } = pageData.contractInfo.receivedRes
      const _currentTime = Math.ceil(new Date().getTime() / 1000)
      if (cBN(_currentTime).lt(ts)) {
        __receivedRes = 0
      } else {
        __receivedRes = cBN(ts)
          .minus(_currentTime)
          .multipliedBy(slope)
          .div(1e18)
          .toFixed(0)
      }
    }
    return [__newBoostRes, __receivedRes]
  }, [pageData.contractInfo])
  const typeList = [
    {
      title: 'Delegation',
      subTitle: 'These addresses are delegated to use your veFXN.',
      list: _newBoostRes,
      received: _receivedRes,
    },
    {
      title: 'Share',
      subTitle: 'These addresses can share your veFXN boosting.',
      list: [],
      received: 0,
    },
  ]

  const handleCancel = async (item) => {
    const _currentTime = Math.ceil(new Date().getTime() / 1000)
    if (
      checkNotZoroNum(item.initialAmount) &&
      cBN(_currentTime).lt(item.endTime)
    ) {
      try {
        const apiCall = VotingEscrowBoostContract.methods.unboost(
          item.index,
          item.initialAmount.toString()
        )
        const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
        const gas = parseInt(estimatedGas * 1.2, 10) || 0
        await noPayableAction(
          () => apiCall.send({ from: currentAccount, gas }),
          {
            key: 'boost',
            action: 'boost',
          },
          () => {}
        )
      } catch (error) {
        noPayableErrorAction(`error_boost`, error)
      }
    }
  }

  return (
    <div>
      <Tabs
        selecedIndex={activeIndex}
        onChange={(v) => setActiveIndex(v)}
        tabs={typeList.map((item) => item.title)}
      />
      <div onClick={() => setShowModal(true)} className="cursor-pointer">
        <p className="text-[16px] mt-[16px] underline text-[var(--a-button-color)]">
          + New {typeList[activeIndex].title}
        </p>
        <p className="text-[16px] my-[16px]">
          {typeList[activeIndex].subTitle}
        </p>
      </div>

      <div className="bg-[var(--input-background-color)] p-[16px] rounded-[5px]">
        <div className="flex  justify-between">
          <div className="text-[14px]">Address</div>
          <div className="text-[14px]">Duration</div>
          <div className="text-[14px]">Action</div>
        </div>
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {typeList[activeIndex].list.length ? (
            typeList[activeIndex].list.map((item, index) => (
              <div key={index} className="flex mt-[8px]">
                <div className="flex-1 text-[16px]">{`${item.receiver.slice(
                  0,
                  6
                )}...${item.receiver.slice(-6)}`}</div>
                <div className="flex-1 text-[16px]">
                  {moment(item.endTime * 1000).format('lll')}
                </div>
                <div
                  className="text-[16px]  text-[var(--a-button-color)] cursor-pointer"
                  onClick={() => handleCancel(item)}
                >
                  Cancel
                </div>
              </div>
            ))
          ) : (
            <p
              style={{
                height: '30px',
                textAlign: 'center',
                fontSize: '14px',
              }}
            >
              No Data
            </p>
          )}
        </div>
      </div>

      <div className="bg-[var(--input-background-color)] p-[16px] rounded-[5px]">
        User received: {fb4(typeList[activeIndex].received)}
      </div>
      {showModal ? (
        <DelegateShareModal
          onCancel={() => setShowModal(false)}
          isShare={isShare}
          refreshAction={refreshAction}
        />
      ) : null}
    </div>
  )
}
