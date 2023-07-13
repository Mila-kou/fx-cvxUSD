import React, { useEffect, useMemo, useState } from 'react'
import PoolItem from './components/PoolItem'
import styles from './styles.module.scss'
import usePools from './hooks/usePools'

export default function FarmingPage() {
  const { poolList } = usePools()

  return (
    <div className={styles.container}>
      {poolList.map((item, index) => (
        <PoolItem key={index} item={item} />
      ))}
    </div>
  )
}
