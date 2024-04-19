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

export async function getStaticPaths() {
  const paths = ['fxUSD', 'rUSD_weETH', 'rUSD_ezETH', 'btcUSD_WBTC'].map(
    (assetSymbol) => ({
      params: { assetSymbol },
    })
  )

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps() {
  return { props: {} }
}
