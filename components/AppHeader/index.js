import React, { useRef, useCallback, useState, useEffect, useMemo } from 'react'
import cn from 'classnames'
import Link from 'next/link'
import Image from 'next/image'
import { Button, Switch } from 'antd'
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
  } = useGlobal()
  const { web3, connect, disconnect, currentAccount, isRightChain } = useWeb3()
  const { route } = useRouter()
  const [showAccountPanel, { toggle: toggleShowAccountPanel }] = useToggle()
  const [showMenuPanel, { toggle: toggleShowMenuPanel }] = useToggle()

  const [ethBalance, setEthBalance] = useState(0)

  const showSwitch = useMemo(() => route === '/home', [route])

  useEffect(() => {
    if (currentAccount) {
      web3.eth.getBalance(currentAccount).then((res) => {
        setEthBalance(fb4(res, false))
      })
    }
  }, [currentAccount, showAccountPanel])

  const assets = [
    {
      name: 'Ethereum',
      symbol: 'ETH',
      amount: ethBalance,
      usd: '6480.98',
      icon: '/tokens/crypto-icons-stack.svg#eth',
    },
    // {
    //   name: 'Fractional ETH',
    //   symbol: 'fETH',
    //   amount: '2.9',
    //   usd: '4480.98',
    // },
    // {
    //   name: 'Leveraged ETH',
    //   symbol: 'xETH',
    //   amount: '1.6',
    //   usd: '1480.98',
    // },
  ]

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

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.logo}>
          <img src={`/images/${theme === 'red' ? 'x' : 'f'}-logo.webp`} />
        </div>
        <div className={styles.right}>
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
                <div className={styles.assetItem}>
                  <div className={styles.logo}>
                    <img src={item.icon} />
                  </div>
                  <div className={styles.main}>
                    <div>{item.name}</div>
                    <div>
                      {item.amount} {item.symbol}
                    </div>
                  </div>
                  {/* <div className={styles.usd}>~ ${item.usd}</div> */}
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
                    className={cn(
                      styles.blue,
                      theme === 'blue' ? styles.active : ''
                    )}
                    onClick={toggleTheme}
                  >
                    Dark
                  </div>
                  <div
                    className={cn(
                      styles.red,
                      theme === 'red' ? styles.active : ''
                    )}
                    onClick={toggleTheme}
                  >
                    Light
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      {isRightChain ? null : (
        <p className={styles.network}>
          Please switch your network to{' '}
          {config.CHAIN_MAPPING[config.CHAIN_ID] || 'mainnet-fork'}
        </p>
      )}
    </div>
  )
}
