import React from 'react'
import Head from 'next/head'
import TestPage from '@/modules/home/TestPage'

export default function Home() {
  return (
    <React.Fragment>
      <Head>
        <title>f(x) Protocol</title>
      </Head>
      <TestPage />
    </React.Fragment>
  )
}
