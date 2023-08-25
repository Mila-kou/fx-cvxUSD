import Onboard from '@web3-onboard/core'
import injectedModule from '@web3-onboard/injected-wallets'
import ledgerModule from '@web3-onboard/ledger/dist/v2'
import walletConnectModule from '@web3-onboard/walletconnect'
import coinbaseModule from '@web3-onboard/coinbase'
import trezorModule from '@web3-onboard/trezor'
import trustModule from '@web3-onboard/trust'
import config from '@/config/index'

const projectId = 'a09980363a7c82db2cc300485b9469c5'

const injected = injectedModule()
const ledger = ledgerModule({
  projectId,
})
const trust = trustModule()

const walletConnect = walletConnectModule({
  projectId,
  requiredChains: [1],
  dappUrl: 'https://fx.aladdin.club/',
})

const coinbaseConnect = coinbaseModule()
const trezorConnect = trezorModule({
  email: 'chao@aladdin.club',
  appUrl: 'https://fx.aladdin.club/',
})

export const initWeb3Onboard = Onboard({
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
