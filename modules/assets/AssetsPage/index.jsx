import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import AssetCell, { ComingAssetCell } from '../components/AssetCell'
import styles from './styles.module.scss'
import useGlobal from '@/hooks/useGlobal'

export default function AssetsPage() {
  const { fAssetList, xAssetList, tokens, theme } = useGlobal()

  const comingList = [
    {
      symbol: 'fxUSD',
      descrition: '',
      icon: '/tokens/fxusd.svg',
      isX: false,
    },
    {
      symbol: 'xstETH',
      descrition: '',
      icon: '/images/x-logo.svg',
      subIcon: '/tokens/steth.svg',
      isX: true,
    },
    {
      symbol: 'xfrxETH',
      descrition: '',
      icon: '/images/x-logo.svg',
      subIcon: '/tokens/frxeth.svg',
      isX: true,
    },
  ]

  return (
    <div className={styles.container}>
      {[
        [
          'Stable',
          fAssetList,
          false,
          `/assets/stable${theme === 'red' ? '' : '-white'}.svg`,
        ],
        [
          'Leverage',
          xAssetList,
          true,
          `/assets/leverage${theme === 'red' ? '' : '-white'}.svg`,
        ],
      ].map(([name, list, isX, icon]) => (
        <div className={`${styles.header} mt-[32px]`} key={name}>
          <div className={styles.headerTitle}>
            <img src={icon} />
            {name}
          </div>

          <div className="px-[16px] mt-[16px] flex justify-between">
            <div className="w-[200px]" />
            <div className="w-[140px] text-[14px]">
              {isX ? 'Leverage' : 'TVL'}
            </div>
            <div className="w-[90px] text-[14px]">Nav</div>
            <div className="w-[80px] text-[14px]">24h Change</div>
          </div>

          {comingList
            .filter((item) => !isX && !item.isX)
            .map((item) => (
              <div>
                <ComingAssetCell info={item} />
              </div>
            ))}

          {list.map((item) => (
            <Link href={`assets/${item.symbol}`}>
              <AssetCell info={item} token={tokens[item.symbol]} />
            </Link>
          ))}

          {comingList
            .filter((item) => isX && !!item.isX)
            .map((item) => (
              <div>
                <ComingAssetCell info={item} />
              </div>
            ))}
        </div>
      ))}
    </div>
  )
}
