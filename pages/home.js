import React from 'react'
import Head from 'next/head'
import HomePage from '@/modules/home/HomePage'

export default function Home() {
  return (
    <React.Fragment>
      <Head>
        <title>f(x) Protocol</title>
      </Head>
      <HomePage />
    </React.Fragment>
  )
}
