import React, { useEffect, useMemo, useState } from 'react'
import { Tooltip } from 'antd'
import { DotChartOutlined, InfoCircleOutlined } from '@ant-design/icons'
import tokens from '@/config/tokens'
import PoolItem from './components/PoolItem'
import usePool from './controller/usePool'

import styles from './styles.module.scss'
import { cBN, fb4, checkNotZoroNum, dollarText } from '@/utils/index'
import { REBALANCE_POOLS_LIST } from '@/config/aladdinVault'

export default function RebalancePoolPage() {
  const { rebalancePoolAddress, rebalanceWithBonusTokenAddress, infoKey } =
    REBALANCE_POOLS_LIST[0]
  const {
    rebalancePoolAddress: rebalancePoolAddress_B,
    rebalanceWithBonusTokenAddress: rebalanceWithBonusTokenAddress_B,
    infoKey: infoKey_B,
  } = REBALANCE_POOLS_LIST[0]
  const poolAData = usePool({
    rebalancePoolAddress,
    rebalanceWithBonusTokenAddress,
    infoKey,
  })
  const poolBData = usePool({
    rebalancePoolAddress: rebalancePoolAddress_B,
    rebalanceWithBonusTokenAddress: rebalanceWithBonusTokenAddress_B,
    infoKey: infoKey_B,
  })

  const totalSupplyTvlText = fb4(
    cBN(poolAData.poolTotalSupplyTvl).plus(poolBData.poolTotalSupplyTvl),
    false,
    0
  )

  const totalSupplyText = fb4(
    cBN(poolAData.poolTotalSupply_res).plus(poolBData.poolTotalSupply_res)
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
            <p>{poolAData.poolTotalSupply} fETH</p>
          </div>
          <div className={styles.item}>
            <p>B Pool APR (xETH)</p>
            <h2>{poolBData.apy}%</h2>
            <p>{poolBData.poolTotalSupply} fETH</p>
          </div>
        </div>
      </div>

      <PoolItem
        title="My Rebalance Pool A"
        contractType="fx_BoostableRebalancePool_APool"
        {...poolAData}
      />
      <PoolItem
        title="My Rebalance Pool B"
        contractType="fx_BoostableRebalancePool_BPool"
        hasXETH
        {...poolBData}
      />
    </div>
  )
}
