import React, { useState } from 'react'
import Visible from 'components/Visible'
import Tip from 'components/Tip'
import NoPayableAction, { noPayableErrorAction } from 'utils/noPayableAction'
import useWeb3 from 'hooks/useWeb3'
import { cBN, fb4 } from 'utils'
import cn from 'classnames'
import Button from 'components/Button'
import Banner from 'components/Banner'
import useInfo from './controllers/useInfo'
import LockModal from './components/LockModal'
import LockMoreModal from './components/LockMoreModal'
import ExtendModal from './components/ExtendModal'
import LockerChart from './components/LockerChart'
import { useVeFXN, useVeFXNFee } from '@/hooks/useContracts'
import styles from './styles.module.scss'

const InfoItem = ({ title, value }) => (
  <div className={`flex justify-between my-3 `}>
    <span className="color-blue">{title}</span>
    <span className="text-white">{value}</span>
  </div>
)

const BannerData = (props) => {
  const { data } = props
  return (
    <div className={styles.bannerData}>
      {data.map((i) => (
        <div key={i.title} className={styles.item}>
          <div className={styles.title}>{i.title}</div>
          <div className={styles.value}>{i.value}</div>
          <div className={styles.desc}>{i.desc}</div>
        </div>
      ))}
    </div>
  )
}

const RebateInfo = ({ info, preWeekData }) => {
  return (
    <div
      className={cn(
        styles.bgBlue,
        'flex flex-col justify-between p-6 text-base md:text-xl color-blue lg:p-12 mb-6'
      )}
    >
      <div>
        {/* <div className={cn(styles.boardTitle, 'text-lg font-semibold')}>Total veFXN Revenue</div> */}
        <div className="text-white font-medium mb-3">Total veFXN Revenue</div>
        <div className="flex items-center justify-between my-3">
          <div className="flex items-center gap-1">
            <div>Cumulative This Week</div>
            <Tip
              title={`This week’s revenue sharing pool accumulates 50% of protocol fee starting from ${info.startTime}`}
              style={{ width: '300px' }}
            />
          </div>

          <div className="text-white">
            {fb4(info.weekAmount)} FXN
            {/* ≈ {fb4(info.weekVal, true)} */}
          </div>
        </div>
        <div className="flex items-center justify-between my-3">
          <div>Previous Week</div>
          <div className="text-white">
            {fb4(preWeekData.weekAmount)} FXN
            {/* ≈ {fb4(preWeekData.weekVal, true)} */}
          </div>
        </div>
        <div className="flex items-center justify-between my-3">
          <div>Accumulate Till</div>
          <div className="text-white">{info.untilTime}</div>
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
    <div className={styles.vaultPage}>
      <div className="container">
        <Banner
          title="Lock CTR"
          subtitle="Lock CTR to earn platform fee in FXN"
        />
        <BannerData data={pageData.overview} />
        <div className="flex gap-6 flex-col lg:flex-row">
          <div
            className={cn(styles.actionBoard, 'p-12 lg:p-16 lg:w-1/2 w-full')}
          >
            <div className={cn(styles.boardTitle, 'text-lg font-semibold')}>
              veFXN Voting Power
            </div>
            <LockerChart />
          </div>
          <div className="lg:w-1/2 w-full">
            <RebateInfo
              info={pageData.weekReabte}
              preWeekData={pageData.preWeekReabte}
              refresh={() => setRefreshTrigger((prev) => prev + 1)}
            />
            <div
              className={cn(
                styles.bgBlue,
                'flex flex-col text-base md:text-xl justify-between p-6 lg:p-12'
              )}
            >
              <div>
                <div className="text-white font-medium mb-3">Lock CTR</div>
                {/* <div className={cn(styles.boardTitle, 'text-lg font-semibold')}></div> */}
                {pageData.userData.slice(0, 4).map((i) => (
                  <InfoItem key={i.title} title={i.title} value={i.value} />
                ))}
              </div>
              <div className="flex gap-3 justify-end mt-2">
                {pageData.status === 'no-lock' && (
                  <Button
                    theme="lightBlue"
                    onClick={() => setLockModalVisible(true)}
                  >
                    Create Lock
                  </Button>
                )}

                {pageData.status === 'ing' && (
                  <Button
                    theme="deepBlue"
                    onClick={() => setLockMoreModalVisible(true)}
                  >
                    Lock More
                  </Button>
                )}

                {pageData.status === 'ing' && (
                  <Button
                    theme="deepBlue"
                    onClick={() => setExtendModalVisible(true)}
                  >
                    Extend
                  </Button>
                )}

                {/* Visible when lock end */}
                {pageData.status === 'expired' && (
                  <Button
                    theme="deepBlue"
                    locking={locking}
                    onClick={() => handleWithdraw(true)}
                  >
                    Claim CTR
                  </Button>
                )}

                <Visible visible={canClaimRewards}>
                  <Button theme="deepBlue" onClick={handleClaimRewards}>
                    Claim Rewards
                  </Button>
                </Visible>
              </div>
            </div>
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
