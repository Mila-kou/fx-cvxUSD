import React, { useEffect, useMemo, useState } from 'react'
import { Tooltip } from 'antd'
import { DotChartOutlined, InfoCircleOutlined } from '@ant-design/icons'
import tokens from '@/config/tokens'
import PoolItem from './components/PoolItem'
import usePool from './hooks/usePool'

import styles from './styles.module.scss'
import { cBN, fb4, checkNotZoroNum, dollarText } from '@/utils/index'

export default function EarningPoolPage() {
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

  const totalSupplyTvlText = fb4(
    cBN(poolAData.stabilityPoolTotalSupplyTvl).plus(
      poolBData.stabilityPoolTotalSupplyTvl
    ),
    false,
    0
  )

  const totalSupplyText = fb4(
    cBN(poolAData.stabilityPoolTotalSupply_res).plus(
      poolBData.stabilityPoolTotalSupply_res
    )
  )

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
            <h2>{dollarText(totalSupplyTvlText)}</h2>
            <p>{totalSupplyText} fETH</p>
          </div>
          <div className={styles.item}>
            <p>A Pool APR (stETH)</p>
            <h2>{poolAData.apy}%</h2>
            <p>{poolAData.stabilityPoolTotalSupply} fETH</p>
          </div>
          <div className={styles.item}>
            <p>B Pool APR (xETH)</p>
            <h2>{poolBData.apy}%</h2>
            <p>{poolBData.stabilityPoolTotalSupply} fETH</p>
          </div>
        </div>
      </div>

      <PoolItem
        title="My Rebalance Pool A"
        contractType="fx_RebalancePool_A"
        {...poolAData}
      />
      <PoolItem
        title="My Rebalance Pool B"
        contractType="fx_RebalancePool_B"
        hasXETH
        {...poolBData}
      />
    </div>
  )
}
