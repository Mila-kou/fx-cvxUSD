import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Tooltip } from 'antd'
import cn from 'classnames'
import Button from '@/components/Button'
import { POOLS_LIST } from '@/config/aladdinVault'
import ManageModal from '../ManageModal'
import styles from './styles.module.scss'
import { cBN, checkNotZoroNum, dollarText } from '@/utils/index'

const stETHImg = '/tokens/steth.svg'
const xETHImg = '/images/x-logo.svg'

const item = POOLS_LIST[0]

export default function MyDepositCell({ cellData }) {
  const [showManageModal, setShowManageModal] = useState(false)
  return (
    <div className={styles.poolWrap}>
      <div className="flex justify-between items-center">
        <div className="w-[180px]">
          <p>{cellData.title}</p>
        </div>
        <div className="w-[180px]">
          12.6%{' '}
          <span className="ml-[6px] text-[14px] underline">Boost to 30%</span>
        </div>
        <div className="w-[140px]">$100,000</div>
        <div className="w-[80px]">
          <img className="h-[30px]" src="/images/f-logo.svg" />
        </div>
        <div className="w-[80px]">
          <div
            className="underline cursor-pointer text-[var(--a-button-color)]"
            onClick={() => setShowManageModal(true)}
          >
            Manage
          </div>
        </div>
      </div>

      {showManageModal && (
        <ManageModal info={item} onCancel={() => setShowManageModal(false)} />
      )}
    </div>
  )
}
