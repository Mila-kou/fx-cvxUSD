import React from 'react'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts/highstock'
import useChart from '../hook/useChart'
import useGlobal from '@/hooks/useGlobal'

function LockerChart() {
  const { theme } = useGlobal()
  const list = useChart()

  const basicOptions = {
    name: 'AAPL',
    chart: {
      panning: true,
      zoomType: 'x',
      panKey: 'ctrl',
      type: 'line',
    },
    title: {
      text: '',
    },
    // credits: {
    //   enabled: false,
    // },
    xAxis: {
      labels: {
        style: {
          color: theme === 'red' ? '#231f20' : '#fff',
        },
      },
      dateTimeLabelFormats: {
        second: '%Y-%m-%d<br/>%H:%M:%S',
        minute: '%Y-%m-%d<br/>%H:%M',
        hour: '%Y-%m-%d<br/>%H:%M',
        day: '%Y<br/>%m-%d',
        week: '%Y<br/>%m-%d',
        month: '%Y-%m',
        year: '%Y',
      },
    },
    yAxis: {
      type: 'linear',
      opposite: false,
      title: {
        text: 'Amount locked',
      },
    },
    backgroundColor:
      theme === 'red' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
    tooltip: {
      valueDecimals: 2,
    },
    rangeSelector: {
      selected: 5,
    },
  }

  return (
    <div>
      <HighchartsReact
        constructorType="stockChart"
        highcharts={Highcharts}
        options={{
          ...basicOptions,
          ...{
            series: [
              {
                name: 'Voting Power',
                data: list,
              },
            ],
          },
        }}
        callback={() => {}}
      />
    </div>
  )
}

export default LockerChart
