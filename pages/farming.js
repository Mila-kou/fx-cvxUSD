import React from 'react'
import Head from 'next/head'
import FarmingPage from '@/modules/farming/FarmingPage'

export default function Farming() {
  return (
    <React.Fragment>
      <Head>
        <title>f(x) Protocol</title>
      </Head>
      <FarmingPage />
    </React.Fragment>
  )
}
