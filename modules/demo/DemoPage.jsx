import React, { useEffect, useMemo, useState } from 'react'
import { DotChartOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { fb4 } from '@/utils/index'

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
              <p className="mb-[20px]">
                {v?.__length__
                  ? Object.values(v)
                      .filter((_, i) => i < v.__length__)
                      .map((item) =>
                        Number(item) > 100000000000
                          ? fb4(item, false, 18, 18).replace(',', '')
                          : item
                      )
                      .join(',')
                  : null}
              </p>
              <p>
                {Number(v) > 100000000000
                  ? fb4(v, false, 18, 18).replace(',', '')
                  : JSON.stringify(v, null, 2)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
