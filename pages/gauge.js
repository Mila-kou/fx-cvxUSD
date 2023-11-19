import React from 'react'
import Head from 'next/head'
import GaugePage from '@/modules/gauge/GaugePage'

export default function Gauge() {
  return (
    <React.Fragment>
      <Head>
        <title>f(x) Protocol</title>
      </Head>
      <GaugePage />
    </React.Fragment>
  )
}
