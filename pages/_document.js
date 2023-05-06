import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <meta
          name="description"
          content="AladdinDAO is the platform introduces DeFi projects (DApps) to investors, creates values from information collection, classification, and assessment. It hopes to Identify the m ost valuable projects from their early phases and prompts them to the society as early as possible."
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
