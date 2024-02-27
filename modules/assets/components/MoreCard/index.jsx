import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import cn from 'classnames'
import Link from 'next/link'
import styles from './styles.module.scss'
import { useSelector } from '@/store/index'
import { ChangedPrice } from '../Common'

export default function MoreCard({ assetInfo }) {
  const { isF } = assetInfo
  const { fETH, xETH } = useSelector((state) => state.asset)

  const list = isF ? [xETH] : [fETH]

  return (
    <div className={styles.container}>
      <h2>{isF ? 'Leverage' : 'Stable'}</h2>
      <p className={styles.subTitle}>
        {isF
          ? 'These tokens bear the risk of price fluctuations, and enjoy the dividends from the appreciation of backed assets.'
          : 'The asset is less volatile but gives up the upside gains of a back-up asset.'}
      </p>

      {list.map((item) => (
        <Link href={`/assets/${item.symbol}`}>
          <div className={cn(styles.cell, item.isX ? styles.xbg : styles.fbg)}>
            <img src={item.icon} className="w-[24px]" />
            <div className="flex-1">
              <p>{item.symbol}</p>
              <p>
                {item.isX
                  ? `Leverage ${item.leverage_text}`
                  : `CR ${item.collateralRatio_text}%`}
              </p>
            </div>
            <div>
              <p>{item.nav_text}</p>
              {item.isShow24Change ? (
                <ChangedPrice value={item.change24h} />
              ) : null}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
