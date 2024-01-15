import React, { useCallback, useEffect, useMemo, useState } from 'react'
import moment from 'moment'
import { LoadingOutlined } from '@ant-design/icons'
import { cBN, fb4, checkNotZoroNum } from 'utils'
import Tabs from '@/modules/home/components/Tabs'
import { useVotingEscrowBoost } from '@/hooks/useVeContracts'
import useWeb3 from '@/hooks/useWeb3'
import noPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import DelegateModal from '../DelegateModal'
import ShareModal from '../ShareModal'
import ShareAcceptOrRejectModal from '../ShareModal/AcceptOrReject'
import useInfo from '../../controllers/useInfo'
import config from '@/config/index'
import useVeShare_c from '../../controllers/useVeShare_c'

export default function DelegateShare({ refreshAction }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [canceling, setCanceling] = useState(false)
  const [showModalIndex, setShowModalIndex] = useState(-1)
  const pageData = useInfo()
  const { isAllReady, currentAccount } = useWeb3()
  console.log('pageData---', pageData)
  const isShare = activeIndex === 1
  const {
    contract: VotingEscrowBoostContract,
    address: fx_VotingEscrowBoostAdress,
  } = useVotingEscrowBoost()
  const { AllGaugeShare } = useVeShare_c()
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
        __receivedRes = bias
        // cBN(ts)
        //   .minus(_currentTime)
        //   .multipliedBy(slope)
        //   .div(1e18)
        //   .toFixed(0)
      }
    }
    return [__newBoostRes, __receivedRes]
  }, [pageData.contractInfo])

  const [_newGaugeShareRes] = useMemo(() => {
    const __newGaugeShareRes = []
    if (AllGaugeShare) {
      AllGaugeShare.map((item, index) => {
        if (item.StakerVoteOwnerRes != config.zeroAddress) {
          __newGaugeShareRes.push({ ...item, index })
        }
      })
    }
    return [__newGaugeShareRes]
  }, [AllGaugeShare])
  console.log('_newGaugeShareRes----', _newGaugeShareRes)

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
      list: _newGaugeShareRes,
    },
  ]

  const handleCancel = async (item) => {
    setCanceling(true)
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
        setCanceling(false)
      } catch (error) {
        setCanceling(false)
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
      <div className="cursor-pointer">
        <div className="flex justify-between mt-[16px]">
          <p
            onClick={() => setShowModalIndex(activeIndex)}
            className="text-[16px] underline text-[var(--a-button-color)]"
          >
            + New {typeList[activeIndex].title}
          </p>

          {typeList[activeIndex].title == 'Share' && (
            <p
              onClick={() => setShowModalIndex(2)}
              className="text-[16px] underline text-[var(--a-button-color)]"
            >
              Check My Share
            </p>
          )}
        </div>
        <p className="text-[16px] my-[16px]">
          {typeList[activeIndex].subTitle}
        </p>
      </div>

      {activeIndex === 0 && (
        <>
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
                      className="text-[16px] flex items-center gap-[5px]  text-[var(--a-button-color)] cursor-pointer "
                      onClick={() => handleCancel(item)}
                    >
                      Cancel{' '}
                      {canceling ? (
                        <LoadingOutlined style={{ fontSize: '12px' }} />
                      ) : null}
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
          <div
            className="bg-[var(--input-background-color)] p-[16px] rounded-[5px]"
            style={{ marginTop: '10px' }}
          >
            User received: {fb4(typeList[activeIndex].received)}
          </div>
        </>
      )}

      {activeIndex === 1 && (
        <div className="bg-[var(--input-background-color)] p-[16px] rounded-[5px]">
          <div className="flex  justify-between">
            <div className="text-[14px]">Share From </div>
            <div className="text-[14px]">Gauge Name</div>
          </div>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {typeList[activeIndex].list.length ? (
              typeList[activeIndex].list.map((item, index) => (
                <div key={index} className="flex mt-[8px]">
                  <div className="flex-1 text-[16px]">{`${item.StakerVoteOwnerRes.slice(
                    0,
                    6
                  )}...${item.StakerVoteOwnerRes.slice(-6)}`}</div>
                  <div className="text-[16px] flex items-center gap-[5px]  text-[var(--a-button-color)] cursor-pointer ">
                    {item.nameShow}
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
      )}

      {showModalIndex === 0 ? (
        <DelegateModal
          onCancel={() => setShowModalIndex(-1)}
          refreshAction={refreshAction}
        />
      ) : null}

      {showModalIndex === 1 ? (
        <ShareModal
          onCancel={() => setShowModalIndex(-1)}
          refreshAction={refreshAction}
        />
      ) : null}

      {showModalIndex === 2 ? (
        <ShareAcceptOrRejectModal
          onCancel={() => setShowModalIndex(-1)}
          refreshAction={refreshAction}
        />
      ) : null}
    </div>
  )
}
