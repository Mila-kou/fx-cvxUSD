import React, { useEffect, useMemo, useState } from 'react'
import { DotChartOutlined, InfoCircleOutlined } from '@ant-design/icons'
import tokens from '@/config/tokens'
import PoolCell from './components/PoolCell'

import styles from './styles.module.scss'
import { cBN, fb4, checkNotZoroNum, dollarText } from '@/utils/index'
import useGaugeController from './controller/useGaugeController'

import RebalancePoolCell from '@/modules/rebalancePool/components/RebalancePoolCell'
import usePool from '@/modules/rebalancePool/hooks/usePool'

export default function EarningPoolPage() {
  const { pageData, ...pageOthers } = useGaugeController()
  console.log('POOLS_LIST---pagedata', pageData)

  const poolAData = usePool({
    rebalancePoolAddress: tokens.contracts.fx_RebalancePool_A,
    rebalanceWithBonusTokenAddress:
      tokens.contracts.fx_RebalanceWithBonusToken_A,
    infoKey: 'rebalancePool_info_A',
  })
  const poolBData = usePool({
    rebalancePoolAddress: tokens.contracts.fx_RebalancePool_B,
    rebalanceWithBonusTokenAddress:
      tokens.contracts.fx_RebalanceWithBonusToken_B,
    infoKey: 'rebalancePool_info_B',
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
          <div className="w-[60px] text-[14px]">Deposit</div>
          <div className="w-[120px] text-[14px]">Earn</div>
          <div className="w-[20px]" />
        </div>
        <RebalancePoolCell
          title="Rebalance Pool A"
          contractType="fx_RebalancePool_A"
          {...poolAData}
        />
        <RebalancePoolCell
          title="Rebalance Pool B"
          contractType="fx_RebalancePool_B"
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
