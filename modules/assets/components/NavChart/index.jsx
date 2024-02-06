import React, {
  memo,
  useCallback,
  useRef,
  useMemo,
  useState,
  useEffect,
} from 'react'
import dynamic from 'next/dynamic'
import styles from './styles.module.scss'

const ReactECharts = dynamic(() => import('echarts-for-react'), {
  ssr: false,
})

export default function NavChart({ dateList, navs }) {
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
        interval: 23,
        formatter: (value) => {
          const time = new Date(value * 1000)
          return `${time.getMonth() + 1}/${time.getDate()}`
        },
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
        symbol: 'none',
      },
    ],
    tooltip: {
      trigger: 'axis',
      // formatter: '{b0}<br />Net Assets Value: ${c0}',
      formatter: (params) => {
        const { axisValue, value } = params[0]
        console.log('params----', params)
        const time = new Date(axisValue * 1000)
        const _time = `${time.getFullYear()}-${
          time.getMonth() + 1
        }-${time.getDate()} ${time.getHours()}:00:00`
        return `${_time}<br />Net Assets Value: $${value}`
      },
    },
    color: ['rgba(255, 255, 255, 0.8)'],
  }

  return (
    <div className={styles.container}>
      <ReactECharts
        ref={ref}
        option={option}
        notMerge
        style={{ height: 118 }}
      />
    </div>
  )
}
