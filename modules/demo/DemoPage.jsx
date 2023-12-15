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
        <p>userRewardSnapshot_FXN这组</p>
        <div>{(rebalancePoolV2_info_A?.baseInfo?.spList || []).join(',')}</div>

        <div className="mt-[40px]">
          {(rebalancePoolV2_info_A?.baseInfo?.dataList || []).map((v, i) => (
            <span>
              {Number(v) > 100000000000
                ? fb4(v, false, 18, 18).replace(',', '')
                : v}
              ,
            </span>
          ))}
        </div>

        <div className="mt-[40px]">
          {Object.entries(rebalancePoolV2_info_A?.baseInfo?.dataObj || {}).map(
            ([k, v]) => (
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
            )
          )}
        </div>
      </div>
    </div>
  )
}
