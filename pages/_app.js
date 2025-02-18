import React, { useState, useEffect } from 'react'
import { Provider } from 'react-redux'
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { Web3OnboardProvider } from '@web3-onboard/react'
import 'antd/dist/antd.css'
import Layout from '@/components/Layout'
import ThemeProvider from '@/contexts/ThemeProvider'
import Web3Provider from '@/contexts/Web3Provider'
import GlobalProvider from '@/contexts/GlobalProvider'
import { initWeb3Onboard } from '@/config/wallet.config'
import { store } from '@/store/index'
import '../assets/css/styles.scss'

function noop() {}

// if (process.env.NETWORK_ENV === 'mainnet') {
console.log = noop
console.warn = noop
console.error = noop
// }

function App({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <Provider store={store}>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <Web3OnboardProvider web3Onboard={initWeb3Onboard}>
            <Web3Provider>
              <GlobalProvider>
                <Hydrate state={pageProps.dehydratedState}>
                  <Layout>
                    <Component {...pageProps} />
                  </Layout>
                </Hydrate>
              </GlobalProvider>
            </Web3Provider>
          </Web3OnboardProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </Provider>
  )
}

export default App
