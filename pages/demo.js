import React from 'react'
import Head from 'next/head'
import DemoPage from '@/modules/demo/DemoPage'

export default function Lock() {
  return (
    <React.Fragment>
      <Head>
        <title>f(x) Protocol</title>
      </Head>
      <DemoPage />
    </React.Fragment>
  )
}
