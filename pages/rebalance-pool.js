import React from 'react'
import Head from 'next/head'
import StabilityPoolPage from '@/modules/stabilityPool/StabilityPoolPage'

export default function StabilityPool() {
  return (
    <React.Fragment>
      <Head>
        <title>f(x) Protocol</title>
      </Head>
      <StabilityPoolPage />
    </React.Fragment>
  )
}
