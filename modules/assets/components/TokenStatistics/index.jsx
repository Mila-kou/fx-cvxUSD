import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Tooltip } from 'antd'
import useNavs from '../../hooks/useNavs'
import NavChart from '../NavChart'
import BreakdownChart from '../BreakdownChart'
import BackendAssetValueChart from '../BackendAssetValueChart'
import { ChangedPrice } from '../Common'
import styles from './styles.module.scss'

export default function TokenStatistics({ assetInfo }) {
  const {
    symbol,
    nav_text,
    totalSupply_text,
    marketCap_text,
    leverage_text,
    collateralRatio_text,
    change24h,
    isBreakdownChart,
    isX,
    icon,
    subIcon,

    totalBaseToken,
    totalBaseTokenUSD_text,
    baseTokenCap,
    baseTokenCap_text,
  } = assetInfo

  const navsData = useNavs()
  const navList = navsData.navList[symbol]

  const totalBaseTokenNumber = (totalBaseToken || '').replace(',', '')

  return (
    <div className={styles.container}>
      <div className="flex gap-[8px] items-center mb-[24px]">
        <div className="relative">
          <img className="w-[28px]" src={icon} />
          {subIcon ? (
            <img
              className="w-[18px] absolute right-[-8px] bottom-[-3px]"
              src={subIcon}
            />
          ) : null}
        </div>
        <p>
          {symbol} <span className="mx-[8px]">{nav_text}</span>
          <ChangedPrice value={change24h} isRed />
        </p>
      </div>

      <div className={styles.wrap}>
        <div className={styles.item}>
          <div className={styles.card}>
            <div className={styles.title}>Reserve Asset Value</div>
            <div className={styles.nums}>
              ${totalBaseTokenUSD_text}
              <div className={styles.processWrap}>
                <p>
                  {totalBaseToken} / {baseTokenCap_text}
                </p>
                <progress value={totalBaseTokenNumber} max={baseTokenCap} />
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.title}>
              {symbol} {isX ? 'Leverage' : 'Collateral Ratio'}
            </div>
            <div className={styles.nums}>
              {isX ? leverage_text : `${collateralRatio_text}%`}
            </div>
          </div>
        </div>

        <p className="mt-[24px] text-[16px]">
          Total Supply
          <span className="ml-[16px] text-[var(--primary-color)]">
            {totalSupply_text || '-'} {symbol}
          </span>
        </p>
        <p className="mt-[4px] text-[16px]">
          Market Cap
          <span className="ml-[16px] text-[var(--primary-color)]">
            {marketCap_text}
          </span>
        </p>

        <p className="mt-[16px]">NAV (USD)</p>
        <div className={styles.chart}>
          <NavChart dateList={navsData.dateList} navs={navList} />
        </div>

        <p className="mt-[24px]">
          {isBreakdownChart ? 'Backed Asset Breakdown' : 'Reserve Asset Value'}
        </p>
        <div className={styles.chart}>
          {isBreakdownChart ? (
            <BreakdownChart
              dateList={navsData.dateList}
              navs={navList}
              assetInfo={assetInfo}
            />
          ) : (
            <BackendAssetValueChart
              dateList={navsData.dateList}
              list={navsData.totalBaseTokenList}
              assetInfo={assetInfo}
            />
          )}
        </div>
      </div>
    </div>
  )
}
