import React from 'react'
import Head from 'next/head'
import SymbolPage from '@/modules/assets/SymbolPage'
import { ASSETS } from '@/config/tokens'

export default function Symbol() {
  return (
    <React.Fragment>
      <Head>
        <title>f(x) Protocol</title>
      </Head>
      <SymbolPage />
    </React.Fragment>
  )
}

export async function getStaticPaths() {
  const paths = ASSETS.map(({ symbol }) => ({
    params: { symbol },
  }))

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps() {
  return { props: {} }
}
