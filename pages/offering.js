import React from 'react'
import Head from 'next/head'
import IdoPage from '@/modules/ido/IdoPage'

export default function Ido() {
  return (
    <React.Fragment>
      <Head>
        <title>FX ETH - IDO</title>
      </Head>
      <IdoPage />
    </React.Fragment>
  )
}
