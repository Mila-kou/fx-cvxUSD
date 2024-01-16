import React, { useEffect, useMemo, useState } from 'react'
import { DotChartOutlined, InfoCircleOutlined } from '@ant-design/icons'
import tokens from '@/config/tokens'
// import PoolCell from './components/PoolCell'

import styles from './styles.module.scss'
import { cBN, fb4, checkNotZoroNum, dollarText } from '@/utils/index'
// import useGaugeController from './controller/useGaugeController'

import RebalancePoolCell from '@/modules/rebalancePoolV2/components/RebalancePoolCell'
import usePool from '@/modules/rebalancePoolV2/controller/usePool'
import MerkleTree from './MerkleTree'

export default function EarningPoolPage() {
  // const { pageData, ...pageOthers } = useGaugeController()

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
          Rebalance Pools
        </div>
        <div className="px-[16px] mt-[32px] flex justify-between">
          <div className="w-[230px]" />
          <div className="w-[120px] text-[14px]">TVL</div>
          <div className="w-[120px] text-[14px]">APR Range</div>
          <div className="w-[110px] text-[14px]">Deposit</div>
          <div className="w-[100px] text-[14px]">Earn</div>
          <div className="w-[20px]" />
        </div>
        <RebalancePoolCell
          title="fETH Rebalance Pool (Redeem to stETH)"
          contractType="fx_BoostableRebalancePool_APool"
          // subTitle="fETH for stETH"
          {...poolAData}
        />
        <RebalancePoolCell
          title="fETH Rebalance Pool (Redeem to xETH)"
          contractType="fx_BoostableRebalancePool_BPool"
          // subTitle="fETH for xETH"
          hasXETH
          {...poolBData}
        />
        {/*
        {pageData.map((item) => (
          <PoolCell cellData={item} {...pageOthers} />
        ))}
        */}

        <MerkleTree />
      </div>
    </div>
  )
}
