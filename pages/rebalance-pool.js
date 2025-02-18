import React from 'react'
import Head from 'next/head'
import RebalancePoolPage from '@/modules/rebalancePool/RebalancePoolPage'

export default function RebalancePool() {
  return (
    <React.Fragment>
      <Head>
        <title>f(x) Protocol</title>
      </Head>
      <RebalancePoolPage />
    </React.Fragment>
  )
}
