import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Tooltip } from 'antd'
import cn from 'classnames'
import {
  MenuOutlined,
  SettingOutlined,
  LineChartOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'
import SimpleInput from '@/components/SimpleInput'
import useGlobal from '@/hooks/useGlobal'
import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import { cBN, fb4 } from '@/utils/index'
import { useToken } from '@/hooks/useTokenInfo'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import { getGas } from '@/utils/gas'
import useNavs from '../../hooks/useNavs'
import Chart from '../Chart'
import styles from './styles.module.scss'
import useETH from '../../controller/useETH'

const tags = [
  'Rebalance Mode',
  'User Liquidation Mode',
  'Protocol Liquidation Mode',
]

const prices = [
  'Rebalance mode price:',
  'User liquidation price:',
  'Protocol liquidation price:',
  'Protocol liquidation price',
]

export default function SystemStatistics() {
  const { toggleShowMenuPanel, refMenu2 } = useGlobal()
  const { blockNumber, current } = useWeb3()
  const [mode, setMode] = useState(-1)
  const {
    fnav,
    xnav,
    collateralRatio,
    p_f,
    p_x,
    fETHTotalSupply,
    xETHTotalSupply,
    totalBaseToken,
    totalBaseTokenTvl,

    StabilityModePrice,
    UserLiquidationModePrice,
    ProtocolLiquidationModePrice,
    systemStatus,
    ethPrice_text,
    lastPermissionedPrice,
    R,

    xETHBeta_text,
  } = useETH()
  const navsData = useNavs()
  return (
    <div className={styles.container}>
      <div className="flex justify-between align-middle mb-[24px]">
        <h2>
          <LineChartOutlined />
          System Statistics
        </h2>
        <SettingOutlined
          ref={refMenu2}
          className="cursor-pointer"
          style={{ color: 'var(--second-text-color)' }}
          onClick={toggleShowMenuPanel}
        />
      </div>
      {mode > -1 ? (
        <div className={styles.modeContent}>
          <div className={styles.tag}>{tags[mode]}</div>
          <div>
            8% Bonus for<span> Mint xETH </span> / 16% Bonus for
            <span> Burn fETH </span>
          </div>
        </div>
      ) : null}

      <div className={styles.wrap}>
        <div className={styles.item}>
          <div className={styles.card} data-color="blue">
            <div className={styles.title}>Backed Asset Value (TVL)</div>
            <div className={cn(styles.value, styles.nums)}>
              <p>
                <b>{totalBaseToken}</b> ETH
              </p>
              <p>
                ~<span>${totalBaseTokenTvl}</span>
              </p>
            </div>
          </div>

          <div className={styles.chart} data-color="blue">
            <Chart
              fxData={{
                nav: fnav,
                totalSupply: fETHTotalSupply,
                ratio: p_f,
              }}
              dateList={navsData.dateList}
              navs={navsData.fETH}
              color="blue"
              symbol="fETH"
              icon="/images/f-s-logo.svg"
            />
          </div>

          <div className={styles.details} data-color="blue">
            <div className={styles.cell}>
              <div>Stability Mode Price:</div>
              <p>${StabilityModePrice}</p>
            </div>
            <div className={styles.cell}>
              <div>ETH Last Price:</div>
              <p>${lastPermissionedPrice}</p>
            </div>
            {/* <div className={styles.cell}>
              <div>User Stability Mode Price:</div>
              <p>${UserLiquidationModePrice}</p>
            </div> 
            <div className={styles.cell}>
              <div>Protocol Rebalance Price:</div>
              <p>${ProtocolLiquidationModePrice}</p>
            </div>
            */}
          </div>
        </div>

        <div className={styles.item}>
          <div className={styles.card} data-color="red">
            <div className={styles.title}>
              fETH Collateral Ratio{' '}
              <span className="text-[12px]">
                (Backed Asset Value / fETH Supply)
              </span>
              {/* <Tooltip
                placement="top"
                title="fETH Marketcap / Backed Asset Value"
                arrow
                color="#000"
              >
                <InfoCircleOutlined />
          </Tooltip> */}
            </div>
            <div className={cn(styles.ratio, styles.nums)}>
              <p>
                <b className={styles[systemStatus > 0 ? 'red' : 'green']}>
                  {collateralRatio}
                </b>
                %{/* {systemStatus} */}
              </p>
              {/* <p>
                {prices[mode + 1]} {mode < 2 && <span>${StabilityModePrice}</span>}
              </p> */}
            </div>
          </div>

          <div className={styles.chart} data-color="red">
            <Chart
              fxData={{
                nav: xnav,
                totalSupply: xETHTotalSupply,
                ratio: p_x,
                xETHBeta_text,
              }}
              dateList={navsData.dateList}
              navs={navsData.xETH}
              color="red"
              symbol="xETH"
              icon="/images/x-s-logo.svg"
            />
          </div>

          <div className={styles.details} data-color="red">
            <div className={styles.cell}>
              <div>ETH Cumulative Return: </div>
              <p>{R}%</p>
            </div>
            <div className={styles.cell}>
              <div>
                ETH Price:
                <Tooltip
                  placement="top"
                  title="ETH 30 Minute TWAP Price"
                  arrow
                  color="#000"
                >
                  <InfoCircleOutlined />
                </Tooltip>
              </div>
              <p>${ethPrice_text}</p>
            </div>
          </div>
        </div>
      </div>

      <p className={styles.updateAt}>
        Update at: [Block]{blockNumber}, {current.format('YY/MM/DD, HH:mm:ss')}
      </p>
    </div>
  )
}
