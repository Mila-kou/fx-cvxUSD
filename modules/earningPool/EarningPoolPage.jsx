import React, { useEffect, useMemo, useState } from 'react'
import { DotChartOutlined, InfoCircleOutlined } from '@ant-design/icons'
import tokens from '@/config/tokens'
import PoolCell from './components/PoolCell'
import DepositCell from './components/DepositCell'

import styles from './styles.module.scss'
import { cBN, fb4, checkNotZoroNum, dollarText } from '@/utils/index'
import useGaugeController from './controller/useGaugeController'

export default function EarningPoolPage() {
  const { pageData, ...pageOthers } = useGaugeController()
  console.log('POOLS_LIST---pagedata', pageData)

  const deposits = [
    {
      title: 'Rebalance Pool A',
    },
    {
      title: 'FXN / ETH Curve LP',
    },
  ]

  const cells = [
    {
      title: 'Rebalance Pool A',
      subTitle: 'fETH',
    },
    {
      title: 'Rebalance Pool B',
      subTitle: 'fETH',
    },
    {
      title: 'FXN / ETH Curve LP',
    },
    {
      title: 'xETH / ETH Curve LP',
    },
    {
      title: 'fETH / crvUSD Curve LP',
    },
    {
      title: 'fETH / FRAXBP Curve LP',
    },
  ]

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <DotChartOutlined />
          My Deposits
        </div>
        <div className="mt-[32px] flex justify-between">
          <div className="w-[180px]">Pool Name</div>
          <div className="w-[180px]">Current APR</div>
          <div className="w-[140px]">Deposits</div>
          <div className="w-[80px]">Earned</div>
          <div className="w-[80px]" />
        </div>
        {deposits.map((item) => (
          <DepositCell cellData={item} {...pageOthers} />
        ))}
      </div>

      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <DotChartOutlined />
          Earning Pools
        </div>
        <div className="flex justify-between">
          <div className="w-[180px]" />
          <div className="w-[140px]">TVL</div>
          <div className="w-[150px]">APR Range</div>
          <div className="w-[80px]">Deposit</div>
          <div className="w-[80px]">Earn</div>
          <div className="w-[80px]" />
        </div>
        {pageData.map((item) => (
          <PoolCell cellData={item} {...pageOthers} />
        ))}
      </div>
    </div>
  )
}
