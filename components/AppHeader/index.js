import React, { useContext, useCallback, useState, useEffect } from 'react'
import cn from 'classnames'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import useWeb3 from '@/hooks/useWeb3'
import useGlobal from '@/hooks/useGlobal'
import styles from './styles.module.scss'

export default function AppHeader() {
  const { theme, toggleTheme } = useGlobal()
  const { connect, disconnect, currentAccount } = useWeb3()
  const { route } = useRouter()

  return (
    <header className={cn(styles.appHeader, 'py-4')}>
      <div className="container">
        <div>
          <div>
            {currentAccount ? (
              <div className={styles.connectedWrapper}>
                <div style={{ fontWeight: '400' }}>
                  {currentAccount.slice(0, 4)}...{currentAccount.slice(-4)}
                </div>
                <div className={styles.menus}>
                  <div className={styles.menu} onClick={disconnect}>
                    Disconnect
                  </div>
                </div>
              </div>
            ) : (
              <div onClick={connect}>Connect Wallet</div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
