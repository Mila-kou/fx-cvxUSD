import React, { useEffect, useMemo, useState } from 'react'
import { Tooltip } from 'antd'
import { DotChartOutlined, InfoCircleOutlined } from '@ant-design/icons'
import RebalancePoolCell from './components/RebalancePoolCell'
import usePool from './controller/usePool'

import styles from './styles.module.scss'
import { cBN, fb4, checkNotZoroNum, dollarText } from '@/utils/index'
import { REBALANCE_POOLS_LIST } from '@/config/aladdinVault'

export default function RebalancePoolPage() {
  const { rebalancePoolAddress, rebalanceWithBonusTokenAddress, infoKey } =
    REBALANCE_POOLS_LIST[0]
  const poolAData = usePool({
    rebalancePoolAddress,
    rebalanceWithBonusTokenAddress,
    infoKey,
  })

  const {
    rebalancePoolAddress: rebalancePoolAddress_B,
    rebalanceWithBonusTokenAddress: rebalanceWithBonusTokenAddress_B,
    infoKey: infoKey_B,
  } = REBALANCE_POOLS_LIST[1]
  const poolBData = usePool({
    rebalancePoolAddress: rebalancePoolAddress_B,
    rebalanceWithBonusTokenAddress: rebalanceWithBonusTokenAddress_B,
    infoKey: infoKey_B,
  })

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
          contractType="fx_BoostableRebalancePool_APool"
          {...poolAData}
        />
        <RebalancePoolCell
          title="Rebalance Pool B"
          contractType="fx_BoostableRebalancePool_BPool"
          hasXETH
          {...poolBData}
        />
      </div>
    </div>
  )
}
