import React, { useCallback, useEffect, useMemo, useState } from 'react'
// import { Button, InputNumber } from 'antd'
import { useRouter, useHis } from 'next/router'
import { useSelector } from 'react-redux'
import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import { cBN, checkNotZoroNum, checkNotZoroNumOption, fb4 } from '@/utils/index'
import useGlobal from '@/hooks/useGlobal'
import Swap from '../components/Swap'
import TokenStatistics from '../components/TokenStatistics'
import TokenStatisticsV2 from '../components/TokenStatisticsV2'
import Tabs from '../components/Tabs'
import MoreCard from '../components/MoreCard'
import styles from './styles.module.scss'
import { ASSETS, ASSET_MAP } from '@/config/tokens'

export default function SymbolPage() {
  const asset = useSelector((state) => state.asset)
  const baseToken = useSelector((state) => state.baseToken)

  const { query, push } = useRouter()
  const { symbol } = query

  const baseTokens = useMemo(() => {
    if (symbol === 'fxUSD') return [baseToken.wstETH, baseToken.sfrxETH]

    if (symbol === 'xstETH') return [baseToken.wstETH]

    if (symbol === 'xfrxETH') return [baseToken.sfrxETH]
    return []
  }, [symbol, baseToken])

  console.log('baseToken----', baseToken, baseTokens)

  const isV2 = !['fETH', 'xETH'].includes(symbol)

  const assetInfo = Object.values(asset).find((item) => item.symbol === symbol)

  const [pricePriceInfo, setPriceInfo] = useState({})

  if (!assetInfo) return null

  const selecedIndex = assetInfo.isF ? 0 : 1

  return (
    <div className={styles.container}>
      {/* <p className={styles.title}>{['Stable', 'Leverage'][selecedIndex]}</p> */}
      <div className={styles.content}>
        <div className={styles.item} key={assetInfo.symbol}>
          <Swap isValidPrice={pricePriceInfo._isValid} assetInfo={assetInfo} />
          {/*
          <MoreCard assetInfo={assetInfo} />
  */}
        </div>
        <div className={styles.item}>
          {isV2 ? (
            <TokenStatisticsV2 assetInfo={assetInfo} baseTokens={baseTokens} />
          ) : (
            <TokenStatistics assetInfo={assetInfo} />
          )}
        </div>
      </div>
    </div>
  )
}
