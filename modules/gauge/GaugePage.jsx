import React, { useEffect, useMemo, useState } from 'react'
import { Checkbox } from 'antd'
import { DotChartOutlined, InfoCircleOutlined } from '@ant-design/icons'
import tokens from '@/config/tokens'
import PoolCell from './components/PoolCell'
import CastVoteModal from './components/CastVoteModal'
import Button from '@/components/Button'

import styles from './styles.module.scss'
import { cBN, fb4, checkNotZoroNum, dollarText } from '@/utils/index'
import useVoteController from './controller/useVoteController'

export default function GaugePage() {
  const { pageData, ...pageOthers } = useVoteController()
  const [showModal, setShowModal] = useState(false)
  const [clearPrev, setClearPrev] = useState(false)

  const canCast = true
  console.log('POOLS_LIST---pagedata', pageData)

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
            Next epoch starts: <b>Thu 11.16.2023 08:00 am UTC+8</b>
          </p>
        </div>

        <div className="flex justify-between items-center mt-[32px]">
          <p>Allocated: 0.0% (0 Votes) Remaining: 100.0% (100,000 Votes)</p>
          <div className="flex mt-[8px]">
            <Checkbox
              className="w-[30px]"
              onChange={() => setClearPrev(!clearPrev)}
            />
            <div>Clear Previous Votes</div>
          </div>
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
          <PoolCell cellData={item} {...pageOthers} />
        ))}

        <div className="mt-[40px]">
          <Button
            className="w-[40%] mx-[auto]"
            disabled={!canCast}
            onClick={() => setShowModal(true)}
          >
            Cast Votes
          </Button>
        </div>

        {showModal && <CastVoteModal onCancel={() => setShowModal(false)} />}
      </div>
    </div>
  )
}
