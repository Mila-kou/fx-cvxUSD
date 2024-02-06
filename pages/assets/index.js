import React from 'react'
import Head from 'next/head'
import AssetsPage from '@/modules/assets/AssetsPage'

export default function Assets() {
  return (
    <React.Fragment>
      <Head>
        <title>f(x) Protocol</title>
      </Head>
      <AssetsPage />
    </React.Fragment>
  )
}
