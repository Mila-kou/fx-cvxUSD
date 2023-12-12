import React from 'react'
import Head from 'next/head'
import VestingPage from '@/modules/booster/VestingPage'

export default function Vesting() {
  return (
    <React.Fragment>
      <Head>
        <title>f(x) Protocol</title>
      </Head>
      <VestingPage />
    </React.Fragment>
  )
}
