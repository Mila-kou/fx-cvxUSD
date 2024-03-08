import React, { useRef, useCallback, useState, useEffect, useMemo } from 'react'
import cn from 'classnames'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { useToggle, useClickAway } from 'ahooks'
import {
  MenuOutlined,
  CloseOutlined,
  ShareAltOutlined,
} from '@ant-design/icons'
import { useRouter } from 'next/router'
import useWeb3 from '@/hooks/useWeb3'
import useGlobal from '@/hooks/useGlobal'
import styles from './styles.module.scss'
import config from '@/config/index'
import { addToMetamask, fb4 } from '@/utils/index'
import Select from '@/components/Select'
import Menu from '@/components/menu'
import FAQ from '@/components/FAQ'
import useLlamaNFT from './useLlamaNFT'

const routers = [
  ['Mint & Redeem', '/assets'],
  // ['f(x) Protocol', '/home'],
  ['Staking Pools', '/staking'],
  ['Gauge Vote', '/gauge'],
  // ['Farming', '/farming'],
  ['Genesis', '/genesis'],
  // ['Vesting', '/vesting'],
  // ['Vesting V2', '/vestingV2'],
  ['Lock', '/lock'],
  // ['Offering', '/offering'],
]

export default function AppHeader() {
  const { tokens } = useSelector((state) => state.token)
  const { theme, toggleTheme, showMenuPanel, toggleShowMenuPanel } = useGlobal()
  const LlamaNFT = useLlamaNFT()
  const {
    connect,
    disconnect,
    currentAccount,
    switchChain,
    currentChainId,
    settingChain,
    isAllowChain,
    blockTime,
  } = useWeb3()
  const { route, push } = useRouter()
  const [showAccountPanel, { toggle: toggleShowAccountPanel }] = useToggle()
  const [openFAQ, { toggle: toggleFAQ }] = useToggle()

  const assets = useMemo(() => {
    const list = [
      {
        name: 'Ethereum',
        symbol: 'ETH',
        amount: fb4(tokens.ETH.balance, false),
        icon: '/tokens/crypto-icons-stack.svg#eth',
      },
      {
        name: 'Fractional ETH',
        symbol: 'fETH',
        amount: fb4(tokens.fETH.balance, false),
        icon: '/images/f-logo.svg',
        showAdd: true,
      },
      {
        name: 'Leveraged ETH',
        symbol: 'xETH',
        amount: fb4(tokens.xETH.balance, false),
        icon: '/images/x-logo.svg',
        showAdd: true,
      },
      {
        name: 'fxUSD',
        symbol: 'fxUSD',
        amount: fb4(tokens.fxUSD.balance, false),
        icon: '/tokens/fxusd.svg',
        showAdd: true,
      },
    ]
    // if (route.includes('offering')) {
    //   return list.slice(0, 1)
    // }
    return list
  }, [tokens, route])

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
      stETH: {
        address: config.tokens.stETH,
        symbol: 'stETH',
        decimals: 18,
        image: `/tokens/crypto-icons-stack.svg#eth`,
      },
    }
    addToMetamask(map[symbol])
  }

  const refMenu = useRef(null)
  const refMenuMobile = useRef(null)
  const refMenuPanel = useRef(null)

  const targets = [refMenu, refMenuMobile, refMenuPanel]

  useClickAway(() => {
    if (showMenuPanel) {
      toggleShowMenuPanel()
    }
  }, targets)

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
      currentAccount ? `https://etherscan.io/address/${currentAccount}` : '',
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

  const showNotice = useMemo(
    () => new Date().getTime() < 1695906000000,
    [blockTime]
  )

  const MORE_LIST = [
    {
      label: 'Booster',
      onClick: () => push('/booster'),
      url: '/booster',
    },
    {
      label: 'Vesting',
      onClick: () => push('/vesting'),
      url: '/vesting',
    },
    {
      label: 'Rebalance Pool (Deprecated)',
      onClick: () => push('/rebalance-pool'),
      url: '/rebalance-pool',
    },
    {
      label: 'Governance',
      onClick: () => window.open('https://snapshot.org/#/fxn.eth', '_blank'),
    },
  ]

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.mobile}>
          <Link href="/assets">
            <img className={styles.logo} src="/images/FXN.svg" />
          </Link>
          <div
            onClick={currentAccount ? toggleShowAccountPanel : handleConnect}
            className={styles.account}
            ref={refAccount}
          >
            <p>{currentAccount ? _account : 'Connect Wallet'}</p>
          </div>
          <div className={styles.menu} onClick={toggleShowMenuPanel}>
            <MenuOutlined ref={refMenuMobile} />
          </div>
        </div>

        <div className={styles.left}>
          <Link href="/assets">
            <img className={styles.logo} src="/images/FXN.svg" />
          </Link>
          {routers.map(([label, href, tag]) => (
            <Link
              href={href}
              className={cn(
                styles.route,
                route.includes(href) && styles.active
              )}
            >
              {label} {tag ? <p className={styles.tag}>{tag}</p> : null}
            </Link>
          ))}
          <a
            className={styles.route}
            target="_blank"
            href="https://bridge.aladdin.club?source=fx"
            rel="noreferrer"
          >
            Bridge
          </a>
          <span
            className={cn(styles.route, styles.canHide)}
            onClick={toggleFAQ}
          >
            FAQ
          </span>
          <Menu label="More" options={MORE_LIST} />
        </div>
        <div className={styles.right}>
          {/* <a
            className={styles.faucet}
            target="_blank"
            href="https://docs.google.com/forms/d/e/1FAIpQLScewYkjwJ5pdxQDD0GGSiVbQTE4GgDJ8tf-l5wRIEGpHjwFTw/viewform"
            rel="noreferrer"
          >
            Faucet
          </a> */}
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
            {LlamaNFT ? <img src={LlamaNFT} /> : null}
            <p>{currentAccount ? _account : 'Connect Wallet'}</p>
          </div>
          <div className="w-0" onClick={toggleShowMenuPanel} ref={refMenu} />
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
                    <img src={item.icon} className="w-[35px] h-[35px]" />
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
              <div className={styles.mobileLinks}>
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
                  href="https://bridge.aladdin.club?source=fx"
                  rel="noreferrer"
                >
                  Bridge
                </a>
                <p className={styles.route} onClick={toggleFAQ}>
                  FAQ
                </p>
                {MORE_LIST.map((item) => (
                  <p
                    className={cn(
                      styles.route,
                      route.includes(item?.url) && styles.active
                    )}
                    onClick={item.onClick}
                  >
                    {item.label}
                  </p>
                ))}
              </div>

              {/* <div className={styles.item}>
                <div>Theme</div>
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
                    </div> */}
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
      {showNotice ? (
        <p className={styles.notice}>
          🎉 The TGE for $FXN will take place at 1pm UTC 28th Sept!
        </p>
      ) : null}

      <FAQ open={openFAQ} onCancel={toggleFAQ} />
    </div>
  )
}
