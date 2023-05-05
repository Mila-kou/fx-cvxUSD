import React from 'react'
import Head from 'next/head'
import IdoPage from '@/modules/ido/IdoPage'

export default function Farming() {
  return (
    <React.Fragment>
      <Head>
        <title>fxETH - IDO</title>
      </Head>
      <IdoPage />
    </React.Fragment>
  )
}
