import { init } from '@web3-onboard/react'
import injectedModule from '@web3-onboard/injected-wallets'
import ledgerModule from '@web3-onboard/ledger'
import walletConnectModule from '@web3-onboard/walletconnect'
import coinbaseModule from '@web3-onboard/coinbase'
import trezorModule from '@web3-onboard/trezor'
import trustModule from '@web3-onboard/trust'
import config from '@/config/index'

const injected = injectedModule()
const ledger = ledgerModule()
const trust = trustModule()

const walletConnect = walletConnectModule({
  bridge: 'https://bridge.walletconnect.org',
  qrcodeModalOptions: {
    mobileLinks: ['metamask', 'trust', 'imtoken'],
  },
  connectFirstChainId: true,
})
const coinbaseConnect = coinbaseModule()
const trezorConnect = trezorModule({
  email: 'chao@aladdin.club',
  appUrl: 'https://concentrator.aladdin.club/',
})

export const initWeb3Onboard = init({
  accountCenter: {
    desktop: {
      enabled: false,
      position: 'topRight',
    },
  },
  wallets: [
    injected,
    walletConnect,
    coinbaseConnect,
    trezorConnect,
    ledger,
    trust,
  ],
  chains: config.allowChains,
  appMetadata: {
    name: 'fxETH',
    icon: '/images/onbroad-logo.png',
    logo: '/images/onbroad-logo.png',
    description:
      'AladdinDAO is the platform introduces DeFi projects (DApps) to investors',
    recommendedInjectedWallets: [
      { name: 'MetaMask', url: 'https://metamask.io' },
      { name: 'Coinbase', url: 'https://wallet.coinbase.com/' },
    ],
  },
})
