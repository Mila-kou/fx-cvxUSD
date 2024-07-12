import React, { useEffect, useMemo, useState } from 'react'
import { DotChartOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import PoolCell from './components/PoolCell'
import styles from './styles.module.scss'
import useGaugeController from './controller/useGaugeController'

import RebalancePoolCell from '@/modules/rebalancePoolV2/components/RebalancePoolCell'
import RebalancePoolCellV2 from '@/modules/rebalancePoolV2/components/RebalancePoolCellV2'
import usePool from '@/modules/rebalancePoolV2/controller/usePool'
import usePoolV2 from '@/modules/rebalancePoolV2/controller/usePoolV2'
import { fb4 } from '@/utils/index'
import MerkleTree from './MerkleTree'
import ThirdPools from './components/ThirdPools'
import useScore from './hooks/useScore'
import ArUSDPools from '@/modules/concentratorArUSD/ArUSDPools'

const Header = ({ title }) => (
  <div>
    <p className="font-bold">{title}</p>
    <div className="px-[16px] flex justify-between">
      <div className="w-[230px]" />
      <div className="w-[120px] text-[14px]">TVL</div>
      <div className="w-[200px] text-[14px]">APR Range</div>
      <div className="w-[110px] text-[14px]">Deposit</div>
      <div className="w-[100px] text-[14px]">Earn</div>
      <div className="w-[20px]" />
    </div>
  </div>
)

export default function EarningPoolPage() {
  const { pageData, ...pageOthers } = useGaugeController()
  const userScore = useScore()

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

  const rUSD_weETH_pool = usePoolV2({
    infoKey: 'rebalancePoolV2_info_rUSD_weETH',
  })

  const rUSD_xeETH_pool = usePoolV2({
    infoKey: 'rebalancePoolV2_info_rUSD_xeETH',
  })

  const rUSD_ezETH_pool = usePoolV2({
    infoKey: 'rebalancePoolV2_info_rUSD_ezETH',
  })

  const rUSD_xezETH_pool = usePoolV2({
    infoKey: 'rebalancePoolV2_info_rUSD_xezETH',
  })

  const btcUSD_WBTC_pool = usePoolV2({
    infoKey: 'rebalancePoolV2_info_btcUSD_WBTC',
  })

  const btcUSD_xWBTC_pool = usePoolV2({
    infoKey: 'rebalancePoolV2_info_btcUSD_xWBTC',
  })

  const cvxUSD_aCVX_pool = usePoolV2({
    infoKey: 'rebalancePoolV2_info_cvxUSD_aCVX',
  })

  const cvxUSD_xCVX_pool = usePoolV2({
    infoKey: 'rebalancePoolV2_info_cvxUSD_xCVX',
  })

  return (
    <div className={styles.container}>
      <div className={`${styles.content} mt-[32px]`}>
        <div className={styles.headerTitle}>
          <DotChartOutlined />
          Earn
        </div>
        <ArUSDPools />
        <div className="flex justify-end gap-[32px] pr-[46px] my-[20px]">
          <div className="flex items-center gap-[6px]">
            {/* <img src="/tokens/etherfiPoint.svg" className="w-[16px]" /> */}
            <p className="text-[16px]">
              {/*<Tooltip
                title="The points below are only estimates. Please refer to the etherfi for actual details."
                arrow
                color="#000"
                overlayInnerStyle={{ width: '300px' }}
              >
                <InfoCircleOutlined className="mx-[6px]" />
              </Tooltip> */}
              3x FX Points (arUSD): {fb4(userScore.arUSD, false, 0)}
            </p>
          </div>
        </div>
      </div>

      <div className={`${styles.content} `}>
        <Header title="Stake fxUSD" />
        <RebalancePoolCellV2
          title="fxUSD Stability Pool"
          subTitle={
            <p className="text-[14px]">
              Earn wstETH
              <br />
              Redeem to wstETH
            </p>
          }
          {...fxUSD_wstETH_pool}
        />
        <RebalancePoolCellV2
          title="fxUSD Stability Pool"
          subTitle={
            <p className="text-[14px]">
              Earn wstETH
              <br />
              Redeem to xstETH
            </p>
          }
          {...fxUSD_xstETH_pool}
        />
        <RebalancePoolCellV2
          title="fxUSD Stability Pool"
          subTitle={
            <p className="text-[14px]">
              Earn frxETH
              <br />
              Redeem to sfrxETH
            </p>
          }
          {...fxUSD_sfrxETH_pool}
        />
        <RebalancePoolCellV2
          title="fxUSD Stability Pool"
          subTitle={
            <p className="text-[14px]">
              Earn frxETH
              <br />
              Redeem to xfrxETH
            </p>
          }
          {...fxUSD_xfrxETH_pool}
        />
      </div>

      <div className={`${styles.content} `}>
        <Header title="Stake btcUSD" />
        <RebalancePoolCellV2
          title="btcUSD Stability Pool"
          subTitle={
            <p className="text-[14px]">
              Earn WBTC
              <br />
              Redeem to WBTC
            </p>
          }
          {...btcUSD_WBTC_pool}
        />
        <RebalancePoolCellV2
          title="btcUSD Stability Pool"
          subTitle={
            <p className="text-[14px]">
              Earn WBTC
              <br />
              Redeem to xWBTC
            </p>
          }
          {...btcUSD_xWBTC_pool}
        />
      </div>

      <div className={`${styles.content}`}>
        <Header title="Stake rUSD" />
        <RebalancePoolCellV2
          title="rUSD Stability Pool"
          subTitle={
            <p className="text-[14px]">
              Earn weETH
              <br />
              Redeem to weETH
            </p>
          }
          {...rUSD_weETH_pool}
        />
        <RebalancePoolCellV2
          title="rUSD Stability Pool"
          subTitle={
            <p className="text-[14px]">
              Earn weETH
              <br />
              Redeem to xeETH
            </p>
          }
          {...rUSD_xeETH_pool}
        />

        <div className="flex justify-end gap-[32px] pr-[46px] my-[20px]">
          <div className="flex items-center gap-[6px]">
            <img src="/tokens/etherfiPoint.svg" className="w-[16px]" />
            <p className="text-[16px]">
              <a
                href="https://app.ether.fi/portfolio"
                target="_blank"
                rel="noreferrer"
                className="text-[var(--a-button-color)]"
              >
                ether.fi loyalty points
              </a>
              <Tooltip
                title="The points below are only estimates. Please refer to the etherfi for actual details."
                arrow
                color="#000"
                overlayInnerStyle={{ width: '300px' }}
              >
                <InfoCircleOutlined className="mx-[6px]" />
              </Tooltip>
              : {fb4(userScore.weETH.etherfi, false, 0)}
            </p>
          </div>
          <div className="flex items-center gap-[6px]">
            <img src="/tokens/eigenLayer.svg" className="w-[16px]" />
            <p className="text-[16px]">
              Eigen Layer Points: {fb4(userScore.weETH.eigenlayer, false, 0)}
            </p>
          </div>
        </div>

        <RebalancePoolCellV2
          title="rUSD Stability Pool"
          subTitle={
            <p className="text-[14px]">
              Earn ezETH
              <br />
              Redeem to ezETH
            </p>
          }
          {...rUSD_ezETH_pool}
        />
        <RebalancePoolCellV2
          title="rUSD Stability Pool"
          subTitle={
            <p className="text-[14px]">
              Earn ezETH
              <br />
              Redeem to xezETH
            </p>
          }
          {...rUSD_xezETH_pool}
        />

        <div className="flex justify-end gap-[32px] pr-[46px] mt-[20px]">
          <div className="flex items-center gap-[6px]">
            <img src="/tokens/renzo.png" className="w-[16px]" />
            <p className="text-[16px]">
              <a
                href="https://app.renzoprotocol.com/portfolio"
                target="_blank"
                rel="noreferrer"
                className="text-[var(--a-button-color)]"
              >
                Renzo ezPoints
              </a>
              <Tooltip
                title="The points below are only estimates. Please refer to the renzoprotocol for actual details."
                arrow
                color="#000"
                overlayInnerStyle={{ width: '300px' }}
              >
                <InfoCircleOutlined className="mx-[6px]" />
              </Tooltip>
              : {fb4(userScore.ezETH.renzo, false, 0)}
            </p>
          </div>
          <div className="flex items-center gap-[6px]">
            <img src="/tokens/eigenLayer.svg" className="w-[16px]" />
            <p className="text-[16px]">
              Eigen Layer Points: {fb4(userScore.ezETH.eigenlayer, false, 0)}
            </p>
          </div>
        </div>
      </div>

      <div className={`${styles.content} `}>
        <Header title="Stake cvxUSD" />
        <RebalancePoolCellV2
          title="cvxUSD Stability Pool"
          subTitle={
            <p className="text-[14px]">
              Earn aCVX
              <br />
              Redeem to aCVX
            </p>
          }
          {...cvxUSD_aCVX_pool}
        />
        <RebalancePoolCellV2
          title="cvxUSD Stability Pool"
          subTitle={
            <p className="text-[14px]">
              Earn aCVX
              <br />
              Redeem to xCVX
            </p>
          }
          {...cvxUSD_xCVX_pool}
        />
      </div>

      <div className={`${styles.content} `}>
        <Header title="Stake fETH" />
        <RebalancePoolCell
          title="fETH Stability Pool"
          subTitle={
            <p className="text-[14px]">
              Earn wstETH
              <br />
              Redeem to wstETH
            </p>
          }
          {...poolAData}
        />
        <RebalancePoolCell
          title="fETH Stability Pool"
          hasXETH
          subTitle={
            <p className="text-[14px]">
              Earn wstETH
              <br />
              Redeem to xETH
            </p>
          }
          {...poolBData}
        />
      </div>

      <div className={`${styles.content} `}>
        <Header title="Stake f(x) Curve LPs" />
        {pageData.map((item) => (
          <PoolCell cellData={item} {...pageOthers} />
        ))}
      </div>

      <div className={`${styles.content} `}>
        <p className="font-bold">f(x) Earn</p>
        <div className="mt-[32px] px-[16px] flex justify-between">
          <div className="w-[180px] text-[14px]">Pool/Token Name</div>
          <div className="w-[90px] text-[14px]">Protocol/Platform</div>
          <div className="w-[70px] text-[14px]">Category</div>
          <div className="w-[90px] text-[14px]">TVL</div>
          <div className="w-[100px] text-[14px]">APR Range</div>
          <div className="w-[70px]" />
        </div>

        <ThirdPools />
      </div>

      <MerkleTree />

      <p className="w-[1144px] mt-[32px] px-[64px] text-[16px] text-[var(--second-text-color)]">
        Disclaimer: f(x) is a new protocol. Users should be aware that there are
        risks with staking tokens in any of the staking pools listed above. It
        is possible that the f(x) system will enter stability mode for various
        assets in volatile market conditions. User’s supplied assets may be
        redeemed for ETH, an ETH Liquid Staking Derivative or an xToken
        depending on which stability pool their tokens are deposited. Please
        proceed with caution.
      </p>
    </div>
  )
}
