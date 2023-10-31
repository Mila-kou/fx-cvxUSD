import React, { useEffect, useMemo, useState } from 'react'
import { Tooltip } from 'antd'
import { DotChartOutlined, InfoCircleOutlined } from '@ant-design/icons'
import PoolItem from './components/PoolItem'
import usePoolA from './hooks/usePoolA'

import styles from './styles.module.scss'
import { cBN, checkNotZoroNum, dollarText } from '@/utils/index'

export default function RebalancePoolPage() {
  const poolAData = usePoolA()

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <DotChartOutlined />
          Rebalance Pool
        </div>
        <p className="text-[20px] mt-[24px]">Overview</p>
        <div className="flex items-center">
          {`CR < 130% fETH will be used for rebalance`} {` `}
          <Tooltip
            placement="topLeft"
            title="The deposited, unlocking, unclaimed fETH will be used for rebalance. Unlocking takes 1 day from the last unlocking transaction."
            arrow
            color="#000"
            overlayInnerStyle={{ width: '300px' }}
          >
            <InfoCircleOutlined className="ml-[8px]" />
          </Tooltip>
        </div>
        <div className={styles.items}>
          <div className={styles.item}>
            <p>Total Deposited Value</p>
            <h2>{dollarText(poolAData.stabilityPoolTotalSupplyTvl_text)}</h2>
            <p>{poolAData.stabilityPoolTotalSupply} fETH</p>
          </div>
          <div className={styles.item}>
            <p>A Pool APR (stETH)</p>
            <h2>{poolAData.apy}%</h2>
          </div>
          <div className={styles.item}>
            <p>B Pool APR (xETH)</p>
            <h2>{poolAData.apy}%</h2>
          </div>
        </div>
      </div>

      <PoolItem {...poolAData} />
      <PoolItem />
    </div>
  )
}
