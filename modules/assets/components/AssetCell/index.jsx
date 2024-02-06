import React, { useCallback, useEffect, useMemo, useState } from 'react'
import cn from 'classnames'
import styles from './styles.module.scss'
import { ChangedPrice } from '../Common'

export default function AssetCell({ info, token }) {
  const {
    isX,
    totalSupply_text,
    marketCap_text,
    nav_text,
    leverage_text,
    change24h,
  } = info
  // console.log('token---', token, info)
  return (
    <div key={info.id} className={styles.poolWrap}>
      <div className={cn(styles.card, isX && styles.redbg)}>
        <div className="flex w-[200px] gap-[10px] items-center">
          <img className="w-[30px]" src={info.icon} />
          <div>
            <p className="text-[16px]">{info.symbol}</p>
            <p className="text-[14px] mt-[4px]">{info.descrition}</p>
          </div>
        </div>

        <div className="w-[140px] text-[16px]">
          {isX ? (
            leverage_text
          ) : (
            <div>
              <p className="text-[16px]">{marketCap_text}</p>
              <p className="text-[14px] mt-[4px] text-[var(--third-text-color)]">
                {totalSupply_text}
              </p>
            </div>
          )}
        </div>

        <div className="w-[90px] text-[16px]">{nav_text}</div>

        <div className="w-[80px] text-[16px]">
          {info.show24Change ? <ChangedPrice value={change24h} /> : '-'}
        </div>
      </div>
    </div>
  )
}

export function ComingAssetCell({ info }) {
  return (
    <div key={info.id} className={styles.poolWrap}>
      <div
        className={cn(styles.card, info.isX ? styles.redbg : styles.greenbg)}
      >
        <div className="flex w-[200px] gap-[16px] items-center">
          <div className="relative">
            <img className="w-[30px]" src={info.icon} />
            <img
              className="w-[18px] absolute right-[-8px] bottom-[-3px]"
              src={info.subIcon}
            />
          </div>
          <div>
            <p className="text-[16px]">{info.symbol}</p>
            <p className="text-[14px]">{info.descrition || 'Coming soon'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
