import React from 'react'
import Head from 'next/head'
import GenesisPage from '@/modules/genesis/GenesisPage'

export default function Genesis() {
  return (
    <React.Fragment>
      <Head>
        <title>f(x) Protocol</title>
      </Head>
      <GenesisPage />
    </React.Fragment>
  )
}
