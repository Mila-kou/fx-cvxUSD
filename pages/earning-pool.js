import React from 'react'
import Head from 'next/head'
import EarningPoolPage from '@/modules/earningPool/EarningPoolPage'

export default function EarningPool() {
  return (
    <React.Fragment>
      <Head>
        <title>f(x) Protocol</title>
      </Head>
      <EarningPoolPage />
    </React.Fragment>
  )
}
