import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from 'antd'
import SimpleInput from '@/components/SimpleInput'
import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import { cBN, fb4 } from '@/utils/index'
import { useToken } from '@/hooks/useTokenInfo'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import { getGas } from '@/utils/gas'
import useGlobal from '@/hooks/useGlobal'
import Swap from './components/Swap'
import SystemStatistics from './components/SystemStatistics'
import styles from './styles.module.scss'

export default function HomePage() {
  const { showSystemStatistics } = useGlobal()
  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <Swap />
      </div>
      {showSystemStatistics ? (
        <div className={styles.item}>
          <SystemStatistics />
        </div>
      ) : null}
    </div>
  )
}
