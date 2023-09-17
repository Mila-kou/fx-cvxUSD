import React, { useState } from 'react'
import Visible from 'components/Visible'
import { Tooltip } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import NoPayableAction, { noPayableErrorAction } from 'utils/noPayableAction'
import useWeb3 from 'hooks/useWeb3'
import { cBN, fb4 } from 'utils'
import cn from 'classnames'
import Button from 'components/Button'
import Tabs from '@/modules/home/components/Tabs'
import useInfo from './controllers/useInfo'
import LockModal from './components/LockModal'
import LockMoreModal from './components/LockMoreModal'
import ExtendModal from './components/ExtendModal'
import LockerChart from './components/LockerChart'
import { useVeFXN, useVeFXNFee } from '@/hooks/useContracts'
import styles from './styles.module.scss'

const InfoItem = ({ title, value }) => (
  <div className={`flex justify-between my-3 `}>
    <span>{title}</span>
    <span className="text-[var(--primary-color)]">{value}</span>
  </div>
)

const RebateInfo = ({ info, preWeekData }) => {
  return (
    <div className="bg-[var(--background-color)] p-[56px] rounded-[10px]">
      <div>
        <div className="font-medium mb-6">Total veFXN Revenue</div>
        <div className="flex items-center justify-between my-3">
          <div className="flex items-center gap-1">
            <div>Cumulative This Week</div>
            <Tooltip
              placement="top"
              title={`This week’s revenue sharing pool accumulates 50% of protocol fee starting from ${info.startTime}`}
              arrow
              color="#000"
            >
              <InfoCircleOutlined />
            </Tooltip>
          </div>

          <div className="text-[var(--primary-color)]">
            {fb4(info.weekAmount)} stETH
            {/* ≈ {fb4(info.weekVal, true)} */}
          </div>
        </div>
        <div className="flex items-center justify-between my-3">
          <div>Previous Week</div>
          <div className="text-[var(--primary-color)]">
            {fb4(preWeekData.weekAmount)} stETH
            {/* ≈ {fb4(preWeekData.weekVal, true)} */}
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
  const [locking, setLocking] = useState(false)
  const veContract = useVeFXNFee()
  const { isAllReady, currentAccount } = useWeb3()
  const { contract: veFXN } = useVeFXN()
  const [tabsActinveKey, setTabsActinveKey] = useState(0)

  const handleWithdraw = async () => {
    if (!isAllReady) return

    setLocking(true)
    try {
      const apiCall = veFXN.methods.withdraw()
      const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(() => apiCall.send({ from: currentAccount, gas }), {
        key: 'ctr',
        action: 'withdraw',
      })
      setRefreshTrigger((prev) => prev + 1)
      setLocking(false)
    } catch (error) {
      setLocking(false)
      noPayableErrorAction(`error_ctr_withdraw`, error)
    }
  }

  const handleClaimRewards = async () => {
    if (!isAllReady) return
    try {
      const apiCall = veContract.methods.claim()
      const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(() => apiCall.send({ from: currentAccount, gas }), {
        key: 've_claim',
        action: 'claim',
      })
      setRefreshTrigger((prev) => prev + 1)
    } catch (error) {
      noPayableErrorAction(`error_ve_claim`, error)
    }
  }

  const pageData = useInfo(refreshTrigger)
  const canClaimRewards = cBN(pageData?.userData[3].amount).isGreaterThan(0)

  // console.log('hook-usedata-', pageData.weekReabte);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>FXN Locker</h2>
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
          <h2 className="mb-10">veFXN Voting Power</h2>
          <LockerChart />
        </div>

        <div className="w-full flex flex-col gap-8 flex-1">
          <RebateInfo
            info={pageData.weekReabte}
            preWeekData={pageData.preWeekReabte}
            refresh={() => setRefreshTrigger((prev) => prev + 1)}
          />

          <div className="bg-[var(--background-color)] p-[56px] rounded-[10px]">
            <div>
              <div className="mb-6">Lock FXN</div>
              {pageData.userData.slice(0, 4).map((i) => (
                <InfoItem key={i.title} title={i.title} value={i.value} />
              ))}
            </div>

            <div className="flex gap-3 justify-end mt-2">
              {pageData.status === 'no-lock' && (
                <Button onClick={() => setLockModalVisible(true)}>
                  Create Lock
                </Button>
              )}

              <Visible visible={pageData.status === 'ing2'}>
                <Tabs
                  tabs={['Lock More', 'Extend']}
                  onChange={(index) => setTabsActinveKey(index)}
                  selecedIndex={tabsActinveKey}
                />
              </Visible>

              {pageData.status === 'ing' && (
                <Button onClick={() => setLockMoreModalVisible(true)}>
                  Lock More
                </Button>
              )}

              {pageData.status === 'ing' && (
                <Button onClick={() => setExtendModalVisible(true)}>
                  Extend
                </Button>
              )}

              {/* Visible when lock end */}
              {pageData.status === 'expired' && (
                <Button locking={locking} onClick={() => handleWithdraw(true)}>
                  Claim FXN
                </Button>
              )}

              <Visible visible={canClaimRewards}>
                <Button onClick={handleClaimRewards}>Claim Rewards</Button>
              </Visible>
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
        </div>
      </div>
    </div>
  )
}

export default LockPage
