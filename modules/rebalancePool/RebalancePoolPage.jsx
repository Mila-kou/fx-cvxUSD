import React, { useEffect, useMemo, useState } from 'react'
import { Tooltip } from 'antd'
import { DotChartOutlined, InfoCircleOutlined } from '@ant-design/icons'
import tokens from '@/config/tokens'
import PoolItem from './components/PoolItem'
import usePool from './hooks/usePool'

import styles from './styles.module.scss'
import { cBN, fb4, dollarText } from '@/utils/index'

export default function RebalancePoolPage() {
  const poolAData = usePool({
    rebalancePoolAddress: tokens.contracts.fx_RebalancePool_A,
    rebalanceWithBonusTokenAddress:
      tokens.contracts.fx_RebalanceWithBonusToken_A,
  })

  const totalSupplyTvlText = fb4(
    cBN(poolAData.stabilityPoolTotalSupplyTvl).plus(
      0
      // poolBData.stabilityPoolTotalSupplyTvl
    ),
    false,
    0
  )

  const totalSupplyText = fb4(
    cBN(poolAData.stabilityPoolTotalSupply_res).plus(
      0
      // poolBData.stabilityPoolTotalSupply_res
    )
  )

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <DotChartOutlined />
          Rebalance Pool (Deprecated)
        </div>
        <p className="text-[20px] mt-[24px]">Overview</p>
        <div className="flex items-center">
          {`CR < 130% fETH will be used for rebalance`} {` `}
          <Tooltip
            placement="topLeft"
            title="The deposited, unlocking, unclaimed fETH will be used for rebalance. "
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
            <h2>{dollarText(totalSupplyTvlText)}</h2>
            <p>{totalSupplyText} fETH</p>
          </div>
          <div className={styles.item}>
            <p>Pool APR (stETH)</p>
            <h2>{poolAData.apy}%</h2>
            <p>{poolAData.stabilityPoolTotalSupply} fETH</p>
          </div>
        </div>
      </div>

      <PoolItem
        title="My Rebalance Pool"
        contractType="fx_RebalancePool_A"
        {...poolAData}
      />
    </div>
  )
}
