import React, { useEffect, useMemo, useState } from 'react'
import { Checkbox } from 'antd'
import { DotChartOutlined, InfoCircleOutlined } from '@ant-design/icons'
import tokens from '@/config/tokens'
import CastVoteModal from './components/CastVoteModal'
import Button from '@/components/Button'

import styles from './styles.module.scss'
import { cBN, fb4, checkNotZoroNumOption, dollarText } from '@/utils/index'
import useGaugeController from '@/modules/earningPool/controller/useGaugeController'
import PoolCell from './components/PoolCell'
import useVoteController from './controller/useVoteController'

export default function GaugePage() {
  const { pageData, ...pageOthers } = useGaugeController()
  const { userVoteInfo, poolVoteInfo } = useVoteController()
  const [clearPrev, setClearPrev] = useState(false)
  const [voteData, setVoteData] = useState(null)

  console.log('POOLS_LIST---voteData', userVoteInfo)

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
            <DotChartOutlined />
            Emissions Voting
          </div>
          <p>
            Current Week: <b>100</b>
          </p>
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

        <div className="px-[16px] mt-[32px] flex justify-between">
          <div className="w-[120px]" />
          <div className="w-[120px] text-[14px]">Type</div>
          <div className="w-[60px] text-[14px]">My Votes</div>
          <div className="w-[180px] text-[14px]">APR Range</div>
          <div className="w-[150px] text-[14px]">Estimate FXN Emissions</div>
          <div className="w-[20px]" />
        </div>
        {pageData.map((item) => (
          <PoolCell
            cellData={item}
            voteData={poolVoteInfo[item.lpGaugeAddress]}
            remaining={userVoteInfo.remaining}
            onCastVote={(newPower) => onCastVote(item, newPower)}
            {...pageOthers}
          />
        ))}

        {voteData && (
          <CastVoteModal
            voteData={voteData}
            onCancel={() => setVoteData(null)}
          />
        )}
      </div>
    </div>
  )
}
