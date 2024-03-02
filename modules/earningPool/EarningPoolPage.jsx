import React, { useEffect, useMemo, useState } from 'react'
import { DotChartOutlined } from '@ant-design/icons'
import PoolCell from './components/PoolCell'
import styles from './styles.module.scss'
import useGaugeController from './controller/useGaugeController'

import RebalancePoolCell from '@/modules/rebalancePoolV2/components/RebalancePoolCell'
import usePool from '@/modules/rebalancePoolV2/controller/usePool'
import usePoolV2 from '@/modules/rebalancePoolV2/controller/usePoolV2'
import MerkleTree from './MerkleTree'

const Header = ({ title }) => (
  <div>
    <p className="mt-[36px] font-bold">{title}</p>
    <div className="px-[16px] flex justify-between">
      <div className="w-[230px]" />
      <div className="w-[120px] text-[14px]">TVL</div>
      <div className="w-[170px] text-[14px]">APR Range</div>
      <div className="w-[110px] text-[14px]">Deposit</div>
      <div className="w-[100px] text-[14px]">Earn</div>
      <div className="w-[20px]" />
    </div>
  </div>
)

export default function EarningPoolPage() {
  const { pageData, ...pageOthers } = useGaugeController()

  const poolAData = usePool({
    infoKey: 'rebalancePoolV2_info_A',
  })
  const poolBData = usePool({
    infoKey: 'rebalancePoolV2_info_B',
  })

  const fxUSD_wstETH_pool = usePoolV2({
    infoKey: 'rebalancePoolV2_info_fxUSD_wstETH',
  })

  const fxUSD_xstETH_pool = usePoolV2({
    infoKey: 'rebalancePoolV2_info_fxUSD_xstETH',
  })

  const fxUSD_sfrxETH_pool = usePoolV2({
    infoKey: 'rebalancePoolV2_info_fxUSD_sfrxETH',
  })

  const fxUSD_xfrxETH_pool = usePoolV2({
    infoKey: 'rebalancePoolV2_info_fxUSD_xfrxETH',
  })

  return (
    <div className={styles.container}>
      <div className={`${styles.header} mt-[32px]`}>
        <div className={styles.headerTitle}>
          <DotChartOutlined />
          Earn Pools
        </div>

        <Header title="fxUSD Pools" />
        <RebalancePoolCell
          title="fxUSD Rebalance Pool"
          contractType="rebalancePoolV2_info_fxUSD_wstETH"
          subTitle={
            <p className="text-[14px]">
              Earn wstETH when staked
              <br />
              Redeem to wstETH
            </p>
          }
          {...fxUSD_wstETH_pool}
        />
        <RebalancePoolCell
          title="fxUSD Rebalance Pool"
          contractType="rebalancePoolV2_info_fxUSD_xstETH"
          subTitle={
            <p className="text-[14px]">
              Earn wstETH when staked
              <br />
              Redeem to xstETH
            </p>
          }
          {...fxUSD_xstETH_pool}
        />
        <RebalancePoolCell
          title="fxUSD Rebalance Pool"
          contractType="rebalancePoolV2_info_fxUSD_sfrxETH"
          subTitle={
            <p className="text-[14px]">
              Earn frxETH when staked
              <br />
              Redeem to sfrxETH
            </p>
          }
          {...fxUSD_sfrxETH_pool}
        />
        <RebalancePoolCell
          title="fxUSD Rebalance Pool"
          contractType="rebalancePoolV2_info_fxUSD_xfrxETH"
          subTitle={
            <p className="text-[14px]">
              Earn frxETH when staked
              <br />
              Redeem to xfrxETH
            </p>
          }
          {...fxUSD_xfrxETH_pool}
        />

        <Header title="fETH Pools" />
        <RebalancePoolCell
          title="fETH Rebalance Pool"
          contractType="rebalancePoolV2_info_A"
          subTitle={
            <p className="text-[14px]">
              Earn wstETH when staked
              <br />
              Redeem to stETH
            </p>
          }
          {...poolAData}
        />
        <RebalancePoolCell
          title="fETH Rebalance Pool"
          contractType="rebalancePoolV2_info_B"
          subTitle={
            <p className="text-[14px]">
              Earn wstETH when staked
              <br />
              Redeem to xETH
            </p>
          }
          hasXETH
          {...poolBData}
        />

        <Header title="f(x) Curve LPs" />
        {pageData.map((item) => (
          <PoolCell cellData={item} {...pageOthers} />
        ))}

        <MerkleTree />
      </div>
    </div>
  )
}
