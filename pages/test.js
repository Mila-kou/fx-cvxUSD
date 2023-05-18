import React from 'react'
import Head from 'next/head'
import TestPage from '@/modules/test/Test'

export default function Test() {
  return (
    <React.Fragment>
      <Head>
        <title>f(x)ETH - Test</title>
      </Head>
      <TestPage />
    </React.Fragment>
  )
}
