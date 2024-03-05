import React, { useState } from 'react'
import Visible from 'components/Visible'
import { Tooltip } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import NoPayableAction, { noPayableErrorAction } from 'utils/noPayableAction'
import useWeb3 from 'hooks/useWeb3'
import useGlobal from 'hooks/useGlobal'
import { cBN, fb4 } from 'utils'
import Button from 'components/Button'
import useInfo from './controllers/useInfo'
import LockModal from './components/LockModal'
import LockMoreModal from './components/LockMoreModal'
import ExtendModal from './components/ExtendModal'
import LockerChart from './components/LockerChart'
import DelegateShare from './components/DelegateShare'
import { useVeFXN, useVeFXNFee } from '@/hooks/useContracts'
import styles from './styles.module.scss'

const InfoItem = ({ title, value }) => (
  <div className="flex justify-between my-3 text-[16px]">
    <span>{title}</span>
    <span className="text-[var(--primary-color)]">{value}</span>
  </div>
)

const RebateInfo = ({ info, preWeekData }) => {
  return (
    <div className="bg-[var(--background-color)] p-[58px] rounded-[10px]">
      <div>
        <div className="font-medium mb-6">Total veFXN Revenue</div>
        <div className="flex items-center justify-between my-3">
          <div className="flex items-center gap-1">
            <div>Cumulative This Week</div>
            <Tooltip
              placement="top"
              title={`This week’s revenue sharing pool accumulates 75% of protocol fee starting from ${info.startTime}`}
              arrow
              color="#000"
            >
              <InfoCircleOutlined />
            </Tooltip>
          </div>

          <div className="text-[var(--primary-color)]">
            {fb4(info.weekAmount)} wstETH
          </div>
        </div>
        <div className="flex items-center justify-between my-3">
          <div>Previous Week</div>
          <div className="text-[var(--primary-color)]">
            {fb4(preWeekData.weekAmount)} wstETH
          </div>
        </div>
        <div className="flex items-center justify-between my-3">
          <div>Accumulate Till</div>
          <div className="text-[var(--primary-color)]">{info.untilTime}</div>
        </div>
      </div>
    </div>
  )
}

const LockPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [lockModalVisible, setLockModalVisible] = useState(false)
  const [lockMoreModalVisible, setLockMoreModalVisible] = useState(false)
  const [extendModalVisible, setExtendModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [crLoading, setCrLoading] = useState(false)
  const { contract: veContract } = useVeFXNFee()
  const { isAllReady, currentAccount, sendTransaction } = useWeb3()
  const { contract: veFXN } = useVeFXN()
  const { theme } = useGlobal()

  const handleWithdraw = async () => {
    if (!isAllReady) return

    setLoading(true)
    try {
      const apiCall = veFXN.methods.withdraw()
      await NoPayableAction(
        () =>
          sendTransaction({
            to: veFXN._address,
            data: apiCall.encodeABI(),
          }),
        {
          key: 'ctr',
          action: 'withdraw',
        }
      )
      setRefreshTrigger((prev) => prev + 1)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      noPayableErrorAction(`error_ctr_withdraw`, error)
    }
  }

  const handleClaimRewards = async () => {
    if (!isAllReady) return
    setCrLoading(true)
    try {
      const apiCall = veContract.methods.claim()
      await NoPayableAction(
        () =>
          sendTransaction({
            to: veContract._address,
            data: apiCall.encodeABI(),
          }),
        {
          key: 've_claim',
          action: 'claim',
        }
      )
      setRefreshTrigger((prev) => prev + 1)
      setCrLoading(false)
    } catch (error) {
      setCrLoading(false)
      noPayableErrorAction(`error_ve_claim`, error)
    }
  }

  const pageData = useInfo(refreshTrigger)
  const canClaimRewards = cBN(pageData?.userData[3].amount).isGreaterThan(0)

  // console.log('hook-usedata-', pageData.weekReabte);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className="flex gap-[6px]">
          <img
            className="h-[22px]"
            src={`/images/locker${theme === 'red' ? '' : '-white'}.svg`}
          />
          FXN Locker
        </h2>
        <div className={styles.items}>
          {pageData.overview.map((item) => (
            <div className={styles.item} key={item.title}>
              <p>{item.title}</p>
              <h2>{item.value}</h2>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.left}>
          <RebateInfo
            info={pageData.weekReabte}
            preWeekData={pageData.preWeekReabte}
            refresh={() => setRefreshTrigger((prev) => prev + 1)}
          />

          <div className={styles.itemContent}>
            <h2 className="mb-10">veFXN Voting Power</h2>
            <LockerChart />
          </div>
        </div>

        <div className="w-full flex flex-col flex-1">
          <div className="bg-[var(--background-color)] p-[48px] rounded-[10px]">
            <div>
              <div className="mb-6">Lock FXN</div>
              {pageData.userData.slice(0, 4).map((i) => (
                <InfoItem key={i.title} title={i.title} value={i.value} />
              ))}

              <Visible visible={canClaimRewards}>
                <Button
                  width="100%"
                  type="red"
                  onClick={handleClaimRewards}
                  loading={crLoading}
                >
                  Claim Rewards
                </Button>
              </Visible>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              {pageData.status === 'no-lock' && (
                <Button width="100%" onClick={() => setLockModalVisible(true)}>
                  Create Lock
                </Button>
              )}

              {pageData.status === 'ing' && (
                <Button
                  width="100%"
                  onClick={() => setLockMoreModalVisible(true)}
                  size="small"
                >
                  Lock More
                </Button>
              )}

              {pageData.status === 'ing' && (
                <Button
                  width="100%"
                  onClick={() => setExtendModalVisible(true)}
                  size="small"
                >
                  Extend
                </Button>
              )}

              {/* Visible when lock end */}
              {pageData.status === 'expired' && (
                <Button
                  width="100%"
                  type="red"
                  loading={loading}
                  onClick={() => handleWithdraw(true)}
                >
                  Claim FXN
                </Button>
              )}
            </div>
          </div>

          <div className={styles.itemContent}>
            <DelegateShare refreshAction={setRefreshTrigger} />
          </div>
        </div>
      </div>

      <Visible visible={lockModalVisible}>
        <LockModal
          onCancel={() => setLockModalVisible(false)}
          refreshAction={setRefreshTrigger}
        />
      </Visible>
      <Visible visible={lockMoreModalVisible}>
        <LockMoreModal
          pageData={pageData}
          onCancel={() => setLockMoreModalVisible(false)}
          refreshAction={setRefreshTrigger}
        />
      </Visible>

      <Visible visible={extendModalVisible}>
        <ExtendModal
          pageData={pageData}
          onCancel={() => setExtendModalVisible(false)}
          refreshAction={setRefreshTrigger}
        />
      </Visible>
    </div>
  )
}

export default LockPage
