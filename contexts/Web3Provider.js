import React, { useEffect, useMemo, useCallback } from 'react'
import { useQuery, useQueries, useMutation } from '@tanstack/react-query'
import Web3 from 'web3'
import ethProvider from 'eth-provider'
import { useConnectWallet, useSetChain } from '@web3-onboard/react'
import moment from 'moment'
import config, { setNetwork } from '@/config/index'
import { initWeb3Onboard } from '@/config/wallet.config'

const Web3Context = React.createContext(null)

function Web3ContextProvider({ children }) {
  const [{ wallet, connecting }, connect, _disconnect] = useConnectWallet()
  const [{ chains, connectedChain, settingChain }, setChain] = useSetChain()

  useEffect(() => {
    if (!wallet && !connecting) {
      const previouslySelectedWallet =
        window.localStorage.getItem('selectedWallet')
      if (previouslySelectedWallet) {
        initWeb3Onboard.connectWallet({
          autoSelect: {
            label: previouslySelectedWallet,
            disableModals: true,
          },
        })
      }
    }
  }, [wallet, connecting])

  const disconnect = useCallback(() => {
    if (_disconnect && wallet) {
      _disconnect(wallet)
      window.localStorage.setItem('selectedWallet', null)
    }
  }, [_disconnect, wallet])

  const currentAccount = useMemo(() => {
    if (wallet?.accounts?.length) {
      window.localStorage.setItem('selectedWallet', wallet.label)
      // return ['0x741be0a7f5f373d31c70a7a655c174162fb38657', wallet.chains[0].id]
      // return ['0x9a27B56cf576E45ad10D8d3Cf26Dbe207463e813', wallet.chains[0].id]
      return wallet.accounts[0].address
    }
    return ''
  }, [wallet])

  const currentChainId = useMemo(
    () => config.chainInfo.id,
    [config.chainInfo.id]
  )

  const switchChain = useCallback(
    (chainId) => {
      if (!currentAccount) {
        connect()
        return
      }
      setChain({ chainId: chainId || config.chainInfo.id })
    },
    [setChain, connect, currentAccount]
  )

  const [isRightChain, isAllowChain] = useMemo(() => {
    return [
      !currentAccount || currentChainId === connectedChain?.id,
      !currentAccount ||
      config.allowChains.find((item) => connectedChain?.id === item.id),
    ]
  }, [currentAccount, currentChainId, connectedChain])

  useEffect(() => {
    setNetwork(connectedChain?.id)
  }, [connectedChain])

  const provider = useMemo(() => {
    if (typeof window !== 'undefined' && wallet && isRightChain) {
      console.log('wallet---', wallet)
      if (wallet?.provider) return wallet.provider
    }
    return ethProvider(config.chainInfo.rpcUrl)
  }, [wallet, currentChainId, isRightChain, config.chainInfo.rpcUrl])

  const web3 = useMemo(() => {
    const _web3 = new Web3(provider)
    _web3.eth.extend({
      methods: [
        {
          name: 'chainId',
          call: 'eth_chainId',
          outputFormatter: _web3.utils.hexToNumber,
        },
      ],
    })
    _web3.eth.transactionConfirmationBlocks = 1
    return _web3
  }, [provider])

  const isAllReady = useMemo(() => {
    return !!(currentAccount && web3 && isRightChain)
  }, [web3, currentAccount, isRightChain])

  const [{ data: blockNumber }, { data: blockTime }] = useQueries({
    queries: [
      {
        queryKey: ['blockNumber', currentChainId],
        queryFn: () => web3.eth.getBlockNumber(),
        enabled: !!web3,
        refetchInterval: 2000,
      },
      {
        queryKey: ['blockTime', currentChainId],
        queryFn: () =>
          web3.eth.getBlock('latest').then(({ timestamp }) => timestamp),
        enabled: !!web3,
        refetchInterval: 2000,
      },
    ],
  })

  const current = useMemo(() => moment(1000 * blockTime), [blockTime])

  const value = useMemo(
    () => ({
      web3,
      wallet,
      connecting,
      connect,
      disconnect,
      currentAccount,
      currentChainId,
      blockNumber,
      current,
      blockTime,
      isAllReady,
      _currentAccount: currentAccount || config.defaultAddress,
      isRightChain,
      chains,
      switchChain,
      settingChain,
      isAllowChain,
    }),
    [
      web3,
      wallet,
      connecting,
      connect,
      disconnect,
      currentAccount,
      currentChainId,
      blockNumber,
      current,
      blockTime,
      isAllReady,
      isRightChain,
      chains,
      switchChain,
      settingChain,
      isAllowChain,
    ]
  )

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
}

export { Web3Context }

export default Web3ContextProvider
