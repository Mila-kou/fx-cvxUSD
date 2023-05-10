import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import cn from 'classnames'
import { DownOutlined } from '@ant-design/icons'
import BalanceInput from '@/components/BalanceInput'
import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import { cBN, fb4 } from '@/utils/index'
import { useToken } from '@/hooks/useTokenInfo'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import { getGas } from '@/utils/gas'
import styles from './styles.module.scss'

export default function Chart({ color, icon, symbol }) {
  const options = {
    grid: { top: 8, right: 0, bottom: 22, left: 25 },
    xAxis: {
      type: 'category',
      axisLine: {
        lineStyle: {
          color: '#fff',
        },
      },
      axisLabel: {
        fontSize: 10,
        interval: 0,
      },
      data: ['3/21', '3/22', '3/23', '3/24', '3/25', '3/26', '3/27'],
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#fff',
        },
      },
      axisLabel: {
        fontSize: 10,
      },
      splitLine: {
        lineStyle: {
          color: ['rgba(255, 255, 255, 0.3)'],
          type: 'dashed',
        },
      },
    },
    series: [
      {
        data: [1.2, 1.0, 1.1, 1.3, 1.1, 1.2, 1.1],
        type: 'line',
      },
    ],
    color: ['rgba(255, 255, 255, 0.8)'],
  }

  return (
    <div className={styles.container} data-color={color}>
      <div className={styles.header}>
        <div className={styles.left}>
          <img src="/tokens/crypto-icons-stack.svg#eth" />
        </div>
        <div className={styles.content}>
          <div>
            <img src={icon} />
            {symbol}
          </div>
          <p className={styles.second}>Net Assets Value</p>
        </div>
        <div className={styles.right}>
          <p>$1.01</p>
          <p className={styles.second}>(0.56 ETH per 1k fETH)</p>
        </div>
      </div>

      <ReactECharts
        option={options}
        className={styles.chart}
        style={{ height: 118 }}
      />

      <div className={styles.footer}>
        <div>
          <img src={icon} />
          {symbol} Total Supply:
        </div>
        <div>8,000,000 (0.35)</div>
      </div>
    </div>
  )
}
