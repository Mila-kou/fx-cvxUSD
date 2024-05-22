import React from 'react'
import Head from 'next/head'
import AccountPage from '@/modules/account/AccountPage'

export default function Account() {
  return (
    <React.Fragment>
      <Head>
        <title>f(x) Protocol</title>
      </Head>
      <AccountPage />
    </React.Fragment>
  )
}
