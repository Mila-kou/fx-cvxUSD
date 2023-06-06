import React, { useRef, useCallback, useState, useEffect, useMemo } from 'react'
import cn from 'classnames'
import Link from 'next/link'
import Image from 'next/image'
import { Select, Switch } from 'antd'
import { useToggle, useClickAway } from 'ahooks'
import {
  MenuOutlined,
  CloseOutlined,
  LineChartOutlined,
  SkinOutlined,
} from '@ant-design/icons'
import { useRouter } from 'next/router'
import useWeb3 from '@/hooks/useWeb3'
import useGlobal from '@/hooks/useGlobal'
import styles from './styles.module.scss'
import config from '@/config/index'
import { cBN, fb4 } from '@/utils/index'

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

  const assets = useMemo(() => {
    const list = [
      {
        name: 'Ethereum',
        symbol: 'ETH',
        amount: fb4(tokens.ETH.balance, false),
        icon: '/tokens/crypto-icons-stack.svg#eth',
        usd: tokens.ETH.usd,
      },
      {
        name: 'Ethereum',
        symbol: 'WETH',
        amount: fb4(tokens.WETH.balance, false),
        icon: '/tokens/crypto-icons-stack.svg#eth',
        usd: tokens.WETH.usd,
      },
      {
        name: 'Fractional ETH',
        symbol: 'fETH',
        amount: fb4(tokens.fETH.balance, false),
        icon: '/images/f-logo.svg',
        usd: tokens.fETH.usd,
      },
      {
        name: 'Leveraged ETH',
        symbol: 'xETH',
        amount: fb4(tokens.xETH.balance, false),
        icon: '/images/x-logo.svg',
        usd: tokens.xETH.usd,
      },
    ]
    if (route.includes('offering')) {
      return list.slice(0, 1)
    }
    return list
  }, [tokens, route])

  const showSwitch = useMemo(() => route === '/home', [route])

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
        <img
          className={styles.logo}
          src={`/images/${theme === 'red' ? 'x' : 'f'}-logo.svg`}
        />
        <div className={styles.right}>
          <Select
            value={currentChainId}
            style={{ width: '150px', marginRight: '16px' }}
            onChange={(val) => switchChain(val)}
            options={config.allowChains.map((item) => ({
              value: item.id,
              label: item.label,
            }))}
            disabled={settingChain}
          />
          <div className={styles.account} ref={refAccount}>
            {currentAccount ? (
              <div onClick={toggleShowAccountPanel}>{_account}</div>
            ) : (
              <div onClick={handleConnect}>Connect Wallet</div>
            )}
          </div>
          <div className={styles.menu}>
            <MenuOutlined ref={refMenu} onClick={toggleShowMenuPanel} />
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
    </div>
  )
}
