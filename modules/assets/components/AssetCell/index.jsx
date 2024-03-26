import React, { useCallback, useEffect, useMemo, useState } from 'react'
import cn from 'classnames'
import { useSelector } from 'react-redux'
import styles from './styles.module.scss'
import { ChangedPrice } from '../Common'

export default function AssetCell({ info }) {
  const baseToken = useSelector((state) => state.baseToken)
  const {
    isX,
    baseSymbol,
    totalSupply_text,
    marketCap_text,
    nav_text,
    leverage_text,
    change24h,
    background,
  } = info

  const _leverage_text =
    baseToken[baseSymbol]?.data?.leverage_text || leverage_text

  return (
    <div key={info.id} className={styles.poolWrap}>
      <div
        className={cn(styles.card, isX && styles.redbg)}
        style={{ background: background || '' }}
      >
        <div className="flex w-[200px] gap-[14px] items-center">
          <div className="relative">
            <img className="w-[30px]" src={info.icon} />
            <img
              className="w-[18px] absolute right-[-8px] bottom-[-3px]"
              src={info.subIcon}
            />
          </div>
          <div>
            <p className="text-[16px]">{info.name || info.symbol}</p>
            <p className="text-[14px] mt-[4px]">{info.descrition}</p>
          </div>
        </div>

        <div className="w-[120px] text-[16px]">
          {isX ? (
            _leverage_text
          ) : (
            <div>
              <p className="text-[16px]">{marketCap_text}</p>
              {!['fxUSD', 'rUSD'].includes(info.symbol) ? (
                <p className="text-[14px] mt-[4px] text-[var(--third-text-color)]">
                  {totalSupply_text}
                </p>
              ) : null}
            </div>
          )}
        </div>

        <div className="w-[60px] text-[16px]">{nav_text}</div>

        <div className="w-[72px] text-[16px] text-center">
          {info.isShow24Change ? <ChangedPrice value={change24h} /> : '-'}
        </div>
      </div>
    </div>
  )
}

export function ComingAssetCell({ info }) {
  return (
    <div key={info.id} className={styles.poolWrap}>
      <div className={cn(styles.card, info.isX ? styles.redbg : styles.bluebg)}>
        <div className="flex w-[220px] gap-[16px] items-center">
          <div className="relative">
            <img className="w-[30px]" src={info.icon} />
            <img
              className="w-[18px] absolute right-[-8px] bottom-[-3px]"
              src={info.subIcon}
            />
          </div>
          <div>
            <p className="text-[16px] text-[#fff]">
              {info.name || info.symbol}
            </p>
            <p className="text-[14px] text-[#fff]">Coming soon</p>
          </div>
        </div>
      </div>
    </div>
  )
}
