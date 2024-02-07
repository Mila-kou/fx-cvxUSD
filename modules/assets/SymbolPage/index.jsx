import React, { useCallback, useEffect, useMemo, useState } from 'react'
// import { Button, InputNumber } from 'antd'
import { useRouter, useHis } from 'next/router'
import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import { cBN, checkNotZoroNum, checkNotZoroNumOption, fb4 } from '@/utils/index'
import useGlobal from '@/hooks/useGlobal'
import Swap from '../components/Swap'
import TokenStatistics from '../components/TokenStatistics'
import Tabs from '../components/Tabs'
import MoreCard from '../components/MoreCard'
import styles from './styles.module.scss'
import { ASSETS } from '@/config/tokens'

export default function SymbolPage() {
  const { query, push } = useRouter()
  const { symbol } = query

  const { fAssetList, xAssetList } = useGlobal()

  const assetInfo = useMemo(() => {
    const obj = [...fAssetList, ...xAssetList].find(
      (item) => item.symbol === symbol
    )

    console.log('obj---', obj)

    if (obj) return obj

    return ASSETS.find((item) => item.symbol === symbol)
  }, [fAssetList, xAssetList, symbol])

  const [pricePriceInfo, setPriceInfo] = useState({})

  const revAssetInfo = useMemo(() => {
    if (!assetInfo) return null

    return ASSETS.find(
      (item) =>
        item.baseSymbol === assetInfo.baseSymbol && item.symbol !== symbol
    )
  }, [assetInfo])

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
          <TokenStatistics assetInfo={assetInfo} />
        </div>
      </div>
    </div>
  )
}
