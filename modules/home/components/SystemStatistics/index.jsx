import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from 'antd'
import cn from 'classnames'
import {
  MenuOutlined,
  CloseOutlined,
  LineChartOutlined,
  SkinOutlined,
} from '@ant-design/icons'
import SimpleInput from '@/components/SimpleInput'
import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import { cBN, fb4 } from '@/utils/index'
import { useToken } from '@/hooks/useTokenInfo'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import { getGas } from '@/utils/gas'
import Chart from '../Chart'
import styles from './styles.module.scss'

const tags = [
  'Stability Mode',
  'User Liquidation Mode',
  'Protocol Liquidation Mode',
]

const prices = [
  'Stability mode price:',
  'User liquidation price:',
  'Protocol liquidation price:',
  'Protocol liquidation price',
]

export default function SystemStatistics() {
  const [mode, setMode] = useState(-1)
  return (
    <div className={styles.container}>
      <h2 className={styles.header}>
        <LineChartOutlined />
        System Statistics
      </h2>
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
          <div className={styles.card}>
            <div className={styles.title}>Backed Asset Value</div>
            <div className={cn(styles.value, styles.nums)}>
              <p>
                <b>40,000</b> ETH
              </p>
              <p>
                ~<span>$720,000,800</span>
              </p>
            </div>
          </div>

          <div className={styles.chart} data-color="blue">
            <Chart
              color="blue"
              symbol="fETH"
              icon="/images/f-s-logo-white.svg"
            />
          </div>

          <div className={styles.details} data-color="blue">
            <div className={styles.cell}>
              <div>Stability Mode Price:</div>
              <p>$1,200.88</p>
            </div>
            <div className={styles.cell}>
              <div>User Liquidation Mode Price:</div>
              <p>$1,100.88</p>
            </div>
            <div className={styles.cell}>
              <div>Protocol Liquidation Mode Price:</div>
              <p>$900.88</p>
            </div>
          </div>
        </div>

        <div className={styles.item}>
          <div className={styles.card}>
            <div className={styles.title}>fETH Collecteral Ratio</div>
            <div className={cn(styles.ratio, styles.nums)}>
              <p>
                <b>200</b>%
              </p>
              <p>
                {prices[mode + 1]} {mode < 2 && <span>$1,200</span>}
              </p>
            </div>
          </div>

          <div className={styles.chart} data-color="red">
            <Chart
              color="red"
              symbol="xETH"
              icon="/images/x-s-logo-white.svg"
            />
          </div>

          <div className={styles.details} data-color="red">
            <div className={styles.cell}>
              <div>ETH Last Change: </div>
              <p>20%</p>
            </div>
            <div className={styles.cell}>
              <div>Oracle. Current Calc Price: </div>
              <p>$2,021.88</p>
            </div>
            <div className={styles.cell}>
              <div>Oracle. Last Calc Price:</div>
              <p>$2,021.88</p>
            </div>
          </div>
        </div>
      </div>

      <p className={styles.updateAt}>
        Update at: [Block]17023966, 23/4/11 12:12:12
      </p>
    </div>
  )
}
