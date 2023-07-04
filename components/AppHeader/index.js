import React, { useRef, useCallback, useState, useEffect, useMemo } from 'react'
import cn from 'classnames'
import Link from 'next/link'
import Image from 'next/image'
import { Switch } from 'antd'
import { useToggle, useClickAway } from 'ahooks'
import {
  MenuOutlined,
  CloseOutlined,
  LineChartOutlined,
  SkinOutlined,
  ShareAltOutlined,
} from '@ant-design/icons'
import { useRouter } from 'next/router'
import useWeb3 from '@/hooks/useWeb3'
import useGlobal from '@/hooks/useGlobal'
import styles from './styles.module.scss'
import config from '@/config/index'
import { addToMetamask, fb4 } from '@/utils/index'
import Select from '@/components/Select'
import FAQ from '@/components/FAQ'

const routers = [
  ['F(x)', '/home'],
  // ['Farming', '/farming'],
  // ['Locker', '/locker'],
  ['Stability Pool', '/stability-pool'],
]

export default function AppHeader() {
  const {
    theme,
    toggleTheme,
    showSystemStatistics,
    toggleShowSystemStatistics,
    tokens,
  } = useGlobal()
  const {
    connect,
    disconnect,
    currentAccount,
    switchChain,
    currentChainId,
    settingChain,
    isAllowChain,
  } = useWeb3()
  const { route } = useRouter()
  const [showAccountPanel, { toggle: toggleShowAccountPanel }] = useToggle()
  const [showMenuPanel, { toggle: toggleShowMenuPanel }] = useToggle()
  const [openFAQ, { toggle: toggleFAQ }] = useToggle()

  const assets = useMemo(() => {
    const list = [
      {
        name: 'Ethereum',
        symbol: 'ETH',
        amount: fb4(tokens.ETH.balance, false),
        icon: '/tokens/crypto-icons-stack.svg#eth',
        usd: tokens.ETH.usd,
      },
      // {
      //   name: 'Ethereum',
      //   symbol: 'WETH',
      //   amount: fb4(tokens.WETH.balance, false),
      //   icon: '/tokens/crypto-icons-stack.svg#eth',
      //   usd: tokens.WETH.usd,
      // },
      {
        name: 'Fractional ETH',
        symbol: 'fETH',
        amount: fb4(tokens.fETH.balance, false),
        icon: '/images/f-logo.svg',
        usd: tokens.fETH.usd,
        showAdd: true,
      },
      {
        name: 'Leveraged ETH',
        symbol: 'xETH',
        amount: fb4(tokens.xETH.balance, false),
        icon: '/images/x-logo.svg',
        usd: tokens.xETH.usd,
        showAdd: true,
      },
    ]
    // if (route.includes('offering')) {
    //   return list.slice(0, 1)
    // }
    return list
  }, [tokens, route])

  const showSwitch = useMemo(() => route === '/home', [route])

  const handleAdd = (symbol) => {
    const map = {
      fETH: {
        address: config.tokens.fETH,
        symbol: 'fETH',
        decimals: 18,
        image: `${window.location.origin}/images/f-logo.svg`,
      },
      xETH: {
        address: config.tokens.xETH,
        symbol: 'xETH',
        decimals: 18,
        image: `${window.location.origin}/images/x-logo.svg`,
      },
    }
    addToMetamask(map[symbol])
  }

  const refMenu = useRef(null)
  const refMenuPanel = useRef(null)
  useClickAway(() => {
    if (showMenuPanel) {
      toggleShowMenuPanel()
    }
  }, [refMenu, refMenuPanel])

  const refAccount = useRef(null)
  const refAccountPanel = useRef(null)
  useClickAway(() => {
    if (showAccountPanel) {
      toggleShowAccountPanel()
    }
  }, [refAccount, refAccountPanel])

  const _account = useMemo(
    () =>
      currentAccount
        ? `${currentAccount.slice(0, 6)}...${currentAccount.slice(-6)}`
        : '',
    [currentAccount]
  )

  const historyUrl = useMemo(
    () =>
      currentAccount
        ? `https://sepolia.etherscan.io/address/${currentAccount}`
        : '',
    [currentAccount]
  )

  const handleDisconnect = () => {
    disconnect()
    toggleShowAccountPanel()
  }

  const handleConnect = () => {
    connect()
  }

  useEffect(() => {
    if (!isAllowChain) {
      switchChain()
    }
  }, [isAllowChain, switchChain])

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.left}>
          <Link href="/home">
            <img
              className={styles.logo}
              src={`/images/${theme === 'red' ? 'x' : 'f'}-logo.svg`}
            />
          </Link>
          {routers.map(([label, href]) => (
            <Link
              href={href}
              className={cn(
                styles.route,
                route.includes(href) && styles.active
              )}
            >
              {label}
            </Link>
          ))}
          <a
            className={styles.route}
            target="_blank"
            href="https://offering.aladdin.club/"
            rel="noreferrer"
          >
            Offering
          </a>
          <span className={styles.route} onClick={toggleFAQ}>
            FAQ
          </span>
        </div>
        <div className={styles.right}>
          <Select
            value={currentChainId}
            style={{ minWidth: '130px', marginRight: '16px' }}
            onChange={(val) => switchChain(val)}
            options={config.allowChains.map((item) => ({
              value: item.id,
              label: item.label,
            }))}
            disabled={settingChain}
          />
          <div
            onClick={currentAccount ? toggleShowAccountPanel : handleConnect}
            className={styles.account}
            ref={refAccount}
          >
            <p>{currentAccount ? _account : 'Connect Wallet'}</p>
          </div>
          <div className={styles.menu} onClick={toggleShowMenuPanel}>
            <MenuOutlined ref={refMenu} />
          </div>
        </div>

        {showAccountPanel ? (
          <div className={styles.accountPanel}>
            <div ref={refAccountPanel} className={styles.content}>
              <div className={styles.header}>
                <p>Account</p>
                <CloseOutlined onClick={toggleShowAccountPanel} />
              </div>
              <p className={styles.title}>{_account}</p>
              <a
                className={styles.histories}
                href={historyUrl}
                target="_blank"
                rel="noreferrer"
              >
                Transaction Histories <ShareAltOutlined />
              </a>
              <p className={styles.title}>Assets</p>
              {assets.map((item) => (
                <div className={styles.assetItem} key={item.symbol}>
                  <div className={styles.logo}>
                    <img src={item.icon} />
                  </div>
                  <div className={styles.main}>
                    <div>{item.name}</div>
                    <div className={styles.amount}>
                      {item.amount} {item.symbol}
                    </div>
                  </div>
                  {item.showAdd ? (
                    <div
                      className={styles.add}
                      onClick={() => handleAdd(item.symbol)}
                    >
                      Add to wallet
                    </div>
                  ) : null}
                  {/* <div className={styles.usd}>
                    {item.usd ? `~${item.usd}` : '-'}
                    </div> */}
                </div>
              ))}
              <div className={styles.disBtn} onClick={handleDisconnect}>
                Disconnect Wallet
              </div>
            </div>
          </div>
        ) : null}

        {showMenuPanel ? (
          <div className={styles.menuPanel}>
            <div ref={refMenuPanel} className={styles.content}>
              {showSwitch ? (
                <div className={styles.item}>
                  <div>
                    <LineChartOutlined />
                    System Statistics
                  </div>
                  <Switch
                    checked={showSystemStatistics}
                    onChange={toggleShowSystemStatistics}
                  />
                </div>
              ) : null}
              <div className={styles.item}>
                <div>
                  <SkinOutlined />
                  Theme
                </div>
                <div className={styles.btns}>
                  <div
                    className={styles.blue}
                    onClick={toggleTheme}
                    data-active={theme === 'blue'}
                  >
                    Dark
                  </div>
                  <div
                    className={styles.red}
                    onClick={toggleTheme}
                    data-active={theme === 'red'}
                  >
                    Light
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      {isAllowChain ? null : (
        <p className={styles.network}>
          Please switch your network to{' '}
          {config.allowChains.map((item) => item.label).join(' or ')}
        </p>
      )}
      <FAQ open={openFAQ} onCancel={toggleFAQ} />
    </div>
  )
}
