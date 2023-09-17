import React from 'react'
import Head from 'next/head'
import LockPage from '@/modules/lock/LockPage'

export default function Locker() {
  return (
    <React.Fragment>
      <Head>
        <title>f(x) Protocol</title>
      </Head>
      <LockPage />
    </React.Fragment>
  )
}
