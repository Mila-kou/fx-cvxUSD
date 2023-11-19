import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <meta
          name="description"
          content="f(x) is a DeFi protocol on Ethereum that offers a powerful new decentralized stablecoin enabled by an amplified ETH token, both backed by staked ETH."
        />
        <link rel="shortcut icon" href="/images/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
