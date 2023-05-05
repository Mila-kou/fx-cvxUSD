import { init } from '@web3-onboard/react'
import injectedModule from '@web3-onboard/injected-wallets'
import ledgerModule from '@web3-onboard/ledger'
import walletConnectModule from '@web3-onboard/walletconnect'
import coinbaseModule from '@web3-onboard/coinbase'
import trezorModule from '@web3-onboard/trezor'
import trustModule from '@web3-onboard/trust'

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
  chains: [
    {
      id: '0x1',
      token: 'ETH',
      label: 'Ethereum Mainnet',
      rpcUrl: `https://eth-mainnet.alchemyapi.io/v2/NYoZTYs7oGkwlUItqoSHJeqpjqtlRT6m`,
    },
  ],
  appMetadata: {
    name: 'fxETH',
    icon: '/assets/logo-onbroad.svg',
    logo: '/assets/logo-onbroad.svg',
    description:
      'AladdinDAO is the platform introduces DeFi projects (DApps) to investors',
    recommendedInjectedWallets: [
      { name: 'MetaMask', url: 'https://metamask.io' },
      { name: 'Coinbase', url: 'https://wallet.coinbase.com/' },
    ],
  },
})
