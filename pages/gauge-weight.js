import React from 'react'
import Head from 'next/head'
import GaugeWeightPage from '@/modules/gaugeWeight/GaugeWeightPage'

export default function GaugeWeight() {
  return (
    <React.Fragment>
      <Head>
        <title>f(x) Protocol</title>
      </Head>
      <GaugeWeightPage />
    </React.Fragment>
  )
}
