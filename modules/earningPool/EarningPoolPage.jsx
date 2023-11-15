import React, { useEffect, useMemo, useState } from 'react'
import { DotChartOutlined, InfoCircleOutlined } from '@ant-design/icons'
import tokens from '@/config/tokens'
import PoolCell from './components/PoolCell'
import DepositCell from './components/DepositCell'
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
        {cells.map((item) => (
          <PoolCell cellData={item} {...poolAData} />
        ))}
      </div>
    </div>
  )
}
