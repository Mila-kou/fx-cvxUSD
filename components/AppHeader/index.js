import React, { useContext, useCallback, useState, useEffect } from 'react'
import cn from 'classnames'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from 'antd'
import { useToggle } from 'ahooks'
import { MenuOutlined, CloseOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'
import useWeb3 from '@/hooks/useWeb3'
import useGlobal from '@/hooks/useGlobal'
import styles from './styles.module.scss'

const assets = [
  {
    name: 'Ethereum',
    symbol: 'ETH',
    amount: '3.6',
    usd: '6480.98',
  },
  {
    name: 'Fractional ETH',
    symbol: 'fETH',
    amount: '2.9',
    usd: '4480.98',
  },
  {
    name: 'Leveraged ETH',
    symbol: 'xETH',
    amount: '1.6',
    usd: '1480.98',
  },
]

export default function AppHeader() {
  const { theme, toggleTheme } = useGlobal()
  const { connect, disconnect, currentAccount } = useWeb3()
  const { route } = useRouter()
  const [showAccountPanel, { toggle: toggleShowAccountPanel }] = useToggle()

  const handleDisconnect = () => {
    disconnect()
    toggleShowAccountPanel()
  }

  const handleConnect = () => {
    connect()
  }

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <img src={`/images/${theme === 'red' ? 'x' : 'f'}-logo.webp`} />
      </div>
      <div className={styles.right}>
        <div className={styles.account}>
          {currentAccount ? (
            <div onClick={toggleShowAccountPanel}>
              {currentAccount.slice(0, 6)}...{currentAccount.slice(-6)}
            </div>
          ) : (
            <div onClick={handleConnect}>Connect Wallet</div>
          )}
        </div>
        <div className={styles.menu}>
          <MenuOutlined />
        </div>
      </div>

      {showAccountPanel ? (
        <div className={styles.accountPanel}>
          <div className={styles.content}>
            <div className={styles.header}>
              <p>Account</p>
              <CloseOutlined onClick={toggleShowAccountPanel} />
            </div>
            {assets.map((item) => (
              <div className={styles.assetItem}>
                <div className={styles.logo}>
                  <img src="/images/x-logo.webp" />
                </div>
                <div className={styles.main}>
                  <div>{item.name}</div>
                  <div>
                    {item.amount} {item.symbol}
                  </div>
                </div>
                <div className={styles.usd}>~ ${item.usd}</div>
              </div>
            ))}
            <div className={styles.disBtn} onClick={handleDisconnect}>
              Disconnect Wallet
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
