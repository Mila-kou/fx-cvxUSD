import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <meta
          name="description"
          content="Aladdin concentrator is a platform that boosts rewards for Curve & Convex stakers and liquidity providers alike, all in a simple and easy to use interface."
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
