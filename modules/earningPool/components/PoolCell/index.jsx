import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Tooltip } from 'antd'
import cn from 'classnames'
import Button from '@/components/Button'
import { POOLS_LIST } from '@/config/aladdinVault'
import DepositModal from '../DepositModal'
import styles from './styles.module.scss'
import { cBN, checkNotZoroNum, dollarText } from '@/utils/index'

const stETHImg = '/tokens/steth.svg'
const xETHImg = '/images/x-logo.svg'

const item = POOLS_LIST[0]

export default function PoolCell({ cellData, ...pageOthers }) {
  const [showDepositModal, setShowDepositModal] = useState(false)
  return (
    <div key={cellData.id} className={styles.poolWrap}>
      <div className="flex justify-between items-center">
        <div className="w-[180px]">
          <p>{cellData.name}</p>
          <p>{cellData.nameShow}</p>
        </div>
        <div className="w-[140px]">{cellData.tvl_text}</div>
        <div className="w-[150px]">12.6% ~ 30.7%</div>
        <div className="w-[80px]">{cellData.userShare_text}</div>
        <div className="w-[80px]">
          <img className="h-[30px]" src={stETHImg} />
          <img className="h-[30px]" src="/images/f-logo.svg" />
        </div>
        <div className="w-[80px]">
          <div
            className="underline cursor-pointer text-[var(--a-button-color)]"
            onClick={() => setShowDepositModal(true)}
          >
            Deposit
          </div>
        </div>
      </div>

      {showDepositModal && (
        <DepositModal
          // cellData={cellData}
          info={cellData}
          // contractType={contractType}
          // FX_RebalancePoolContract={FX_RebalancePoolContract}
          // poolData={stabilityPoolInfo}
          onCancel={() => setShowDepositModal(false)}
        />
      )}
    </div>
  )
}
