import React, {
  memo,
  useCallback,
  useRef,
  useMemo,
  useState,
  useEffect,
} from 'react'
import { Tooltip } from 'antd'
import ReactECharts from 'echarts-for-react'
import styles from './styles.module.scss'

export default function Chart({ color, icon, symbol, fxData, dateList, navs }) {
  const ref = useRef(null)

  const option = {
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
      data: dateList,
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
        data: navs,
        type: 'line',
      },
    ],
    tooltip: {
      trigger: 'item',
      formatter: '{b0}<br />Net Assets Value: ${c0}',
    },
    color: ['rgba(255, 255, 255, 0.8)'],
  }

  return (
    <div className={styles.container} data-color={color}>
      <div className={styles.header}>
        <div className={styles.left}>
          <img src={icon} />
        </div>
        <div className={styles.content}>
          <div>
            {symbol}
            {symbol === 'xETH' ? (
              <Tooltip
                placement="top"
                title={`Leverage(Target/Real)+1.25~4.00/+${fxData.xETHBeta_text}X`}
                arrow
                color="#000"
                overlayInnerStyle={{
                  width: '270px',
                }}
              >
                <span className="ml-[12px] border-b-[1px] border-dashed cursor-pointer">
                  x{fxData.xETHBeta_text}
                </span>
              </Tooltip>
            ) : null}
          </div>
          <p className={styles.second}>Net Assets Value</p>
        </div>
        <div className={styles.right}>
          <p>${fxData.nav}</p>
          {/* <p className={styles.second}>(0.56 ETH per 1k fETH)</p> */}
        </div>
      </div>

      <ReactECharts
        ref={ref}
        option={option}
        notMerge
        className={styles.chart}
        style={{ height: 118 }}
      />

      <div className={styles.footer}>
        <div>
          {/* <img src={icon} /> */}
          {symbol} Total Supply:
        </div>
        <div>
          {fxData.totalSupply} ({fxData.ratio}%)
        </div>
      </div>
    </div>
  )
}
