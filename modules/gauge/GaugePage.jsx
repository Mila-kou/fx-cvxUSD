import React, { useEffect, useMemo, useState } from 'react'
import { MedicineBoxOutlined } from '@ant-design/icons'
import CastVoteModal from './components/CastVoteModal'
import {
  REBALANCE_GAUGE_LIST,
  POOLS_LIST,
  OTHER_GAUGE_LIST,
} from '@/config/aladdinVault'

import styles from './styles.module.scss'
import { cBN, fb4, checkNotZoroNumOption, dollarText } from '@/utils/index'
import PoolCell from './components/PoolCell'
import useVoteController from './controller/useVoteController'

const Header = ({ title }) => (
  <div>
    <p className="mt-[36px] font-bold">{title}</p>
    <div className="px-[16px] flex justify-between">
      <div className="w-[200px]" />
      <div className="w-[180px] text-[14px]">Type</div>
      <div className="w-[100px] text-[14px]">My Votes</div>
      <div className="w-[200px] text-[14px]">APR Range</div>
      <div className="w-[150px] text-[14px]">Estimate FXN Emissions</div>
      <div className="w-[20px]" />
    </div>
  </div>
)

export default function GaugePage() {
  const { userVoteInfo, poolVoteInfo } = useVoteController()
  const [clearPrev, setClearPrev] = useState(false)
  const [voteData, setVoteData] = useState(null)

  const onCastVote = (item, newPower) => {
    const _powerVote = cBN(userVoteInfo.veFXNAmount)
      .multipliedBy(newPower)
      .dividedBy(100)
    setVoteData({
      ...item,
      nextEpoch: userVoteInfo.nextEpoch,
      canVoteTime: userVoteInfo.canVoteTime,
      newPower,
      newPowerVote: checkNotZoroNumOption(_powerVote, fb4(_powerVote)),
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <div className="flex items-center gap-[6px]">
            <MedicineBoxOutlined />
            Emissions Voting
          </div>
          {/* <p>
              Current Week: <b>100</b>
            </p> */}
          <p>
            Next epoch starts: <b>{userVoteInfo.nextEpoch}</b>
          </p>
        </div>

        <div className="flex justify-between items-center mt-[32px]">
          <p>
            Allocated: {userVoteInfo.allocated}% ({userVoteInfo.allocatedVotes}{' '}
            Votes){' '}
            <span className="ml-[16px]">
              Remaining: {userVoteInfo.remaining}% (
              {userVoteInfo.remainingVotes} Votes)
            </span>
          </p>
          {/* <div className="flex mt-[8px]">
            <Checkbox
              className="w-[30px]"
              onChange={() => setClearPrev(!clearPrev)}
            />
            <div>Clear Previous Votes</div>
          </div> */}
        </div>
        <Header title="fxUSD Pools" />
        {REBALANCE_GAUGE_LIST.filter((item) => item.poolType === 'fxUSD').map(
          (item) => (
            <PoolCell
              cellData={item}
              userVoteInfo={userVoteInfo}
              voteData={poolVoteInfo[item.lpGaugeAddress]}
              remaining={userVoteInfo.remaining}
              onCastVote={(newPower) => onCastVote(item, newPower)}
            />
          )
        )}

        <Header title="btcUSD Pools" />
        {REBALANCE_GAUGE_LIST.filter((item) => item.poolType === 'btcUSD').map(
          (item) => (
            <PoolCell
              cellData={item}
              userVoteInfo={userVoteInfo}
              voteData={poolVoteInfo[item.lpGaugeAddress]}
              remaining={userVoteInfo.remaining}
              onCastVote={(newPower) => onCastVote(item, newPower)}
            />
          )
        )}

        <Header title="rUSD Pools" />
        {REBALANCE_GAUGE_LIST.filter((item) => item.poolType === 'rUSD').map(
          (item) => (
            <PoolCell
              cellData={item}
              userVoteInfo={userVoteInfo}
              voteData={poolVoteInfo[item.lpGaugeAddress]}
              remaining={userVoteInfo.remaining}
              onCastVote={(newPower) => onCastVote(item, newPower)}
            />
          )
        )}

        <Header title="cvxUSD Pools" />
        {REBALANCE_GAUGE_LIST.filter((item) => item.poolType === 'cvxUSD').map(
          (item) => (
            <PoolCell
              cellData={item}
              userVoteInfo={userVoteInfo}
              voteData={poolVoteInfo[item.lpGaugeAddress]}
              remaining={userVoteInfo.remaining}
              onCastVote={(newPower) => onCastVote(item, newPower)}
            />
          )
        )}

        <Header title="fETH Pools" />
        {REBALANCE_GAUGE_LIST.filter((item) => item.poolType === 'fETH').map(
          (item) => (
            <PoolCell
              cellData={item}
              userVoteInfo={userVoteInfo}
              voteData={poolVoteInfo[item.lpGaugeAddress]}
              remaining={userVoteInfo.remaining}
              onCastVote={(newPower) => onCastVote(item, newPower)}
            />
          )
        )}

        <Header title="f(x) Curve LPs" />
        {POOLS_LIST.map((item) => (
          <PoolCell
            cellData={item}
            userVoteInfo={userVoteInfo}
            voteData={poolVoteInfo[item.lpGaugeAddress]}
            remaining={userVoteInfo.remaining}
            onCastVote={(newPower) => onCastVote(item, newPower)}
          />
        ))}

        <Header title="Other" />
        {OTHER_GAUGE_LIST.map((item) => (
          <PoolCell
            cellData={item}
            userVoteInfo={userVoteInfo}
            voteData={poolVoteInfo[item.lpGaugeAddress]}
            remaining={userVoteInfo.remaining}
            onCastVote={(newPower) => onCastVote(item, newPower)}
          />
        ))}

        {voteData && (
          <CastVoteModal
            voteData={voteData}
            userVoteInfo={userVoteInfo}
            remaining={userVoteInfo.remaining}
            onCancel={() => setVoteData(null)}
          />
        )}
      </div>
    </div>
  )
}
