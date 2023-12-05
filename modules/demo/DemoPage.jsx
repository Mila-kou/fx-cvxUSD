import React, { useEffect, useMemo, useState } from 'react'
import { DotChartOutlined, InfoCircleOutlined } from '@ant-design/icons'

import styles from './styles.module.scss'
import useData from './hooks/useData'

export default function DemoPage() {
  const rebalancePoolV2_info_A = useData('rebalancePoolV2_info_A')

  return (
    <div className={styles.container}>
      <div className={`${styles.header} mt-[32px]`}>
        <div>
          {Object.entries(rebalancePoolV2_info_A?.baseInfo).map(([k, v]) => (
            <div className="mb-[20px]">
              <p>{k}</p>
              <p>{JSON.stringify(v, null, 2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
