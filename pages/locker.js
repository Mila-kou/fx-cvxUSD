import React from 'react'
import Head from 'next/head'
import LockerPage from '@/modules/locker/LockerPage'

export default function Locker() {
  return (
    <React.Fragment>
      <Head>
        <title>f(x) Protocol</title>
      </Head>
      <LockerPage />
    </React.Fragment>
  )
}
