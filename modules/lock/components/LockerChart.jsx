import React from 'react'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts/highstock'
import useChart from '../hook/useChart'

const LockerChart = () => {
  const list = useChart()

  const basicOptions = {
    name: 'AAPL',
    chart: {
      backgroundColor: '#000015',
      panning: true,
      zoomType: 'x',
      panKey: 'ctrl',
      type: 'line',
    },
    title: {
      style: {
        color: '#fff',
      },
      text: 'veFXN Voting Power',
    },
    // credits: {
    //   enabled: false,
    // },
    xAxis: {
      labels: {
        style: {
          color: '#fff',
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
