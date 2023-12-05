import React, { useEffect, useMemo, useState } from 'react'
import { DotChartOutlined, InfoCircleOutlined } from '@ant-design/icons'
import tokens from '@/config/tokens'
import PoolCell from './components/PoolCell'

import styles from './styles.module.scss'
import { cBN, fb4, checkNotZoroNum, dollarText } from '@/utils/index'
import useGaugeController from './controller/useGaugeController'

import RebalancePoolCell from '@/modules/rebalancePoolV2/components/RebalancePoolCell'
import usePool from '@/modules/rebalancePoolV2/controller/usePool'

export default function EarningPoolPage() {
  const { pageData, ...pageOthers } = useGaugeController()

  const poolAData = usePool({
    infoKey: 'rebalancePoolV2_info_A',
  })
  const poolBData = usePool({
    infoKey: 'rebalancePoolV2_info_B',
  })

  return (
    <div className={styles.container}>
      <div className={`${styles.header} mt-[32px]`}>
        <div className={styles.headerTitle}>
          <DotChartOutlined />
          Earning Pools
        </div>
        <div className="px-[16px] mt-[32px] flex justify-between">
          <div className="w-[160px]" />
          <div className="w-[90px] text-[14px]">TVL</div>
          <div className="w-[180px] text-[14px]">APR Range</div>
          <div className="w-[90px] text-[14px]">Deposit</div>
          <div className="w-[120px] text-[14px]">Earn</div>
          <div className="w-[20px]" />
        </div>
        <RebalancePoolCell
          title="Rebalance Pool A"
          contractType="fx_BoostableRebalancePool_APool"
          {...poolAData}
        />
        <RebalancePoolCell
          title="Rebalance Pool B"
          contractType="fx_BoostableRebalancePool_BPool"
          hasXETH
          {...poolBData}
        />
        {pageData.map((item) => (
          <PoolCell cellData={item} {...pageOthers} />
        ))}
      </div>
    </div>
  )
}
