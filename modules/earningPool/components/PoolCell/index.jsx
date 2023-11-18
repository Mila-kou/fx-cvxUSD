import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Tooltip } from 'antd'
import cn from 'classnames'
import Button from '@/components/Button'
import { POOLS_LIST } from '@/config/aladdinVault'
import DepositModal from '../DepositModal'
import styles from './styles.module.scss'
import { cBN, checkNotZoroNum, dollarText } from '@/utils/index'
import useVeBoost_c from '../../controller/useVeBoost_c'

const stETHImg = '/tokens/steth.svg'

export default function PoolCell({ cellData, ...pageOthers }) {
  const boost = useVeBoost_c(cellData)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const apyDom = useMemo(() => {
    if (checkNotZoroNum(cellData.apyInfo?.allApy)) {
      return `${cellData.apyInfo?.allApy}%`
    }
    return '-'
  }, [cellData])
  console.log('cellData----', cellData, apyDom)

  const rewardTokenDom = useMemo(() => {
    return (
      <>
        {cellData.rewardTokens.map((item, index) => {
          return (
            <img
              key={index}
              className="h-[30px]"
              src={item[4] ?? '/images/f-logo.svg'}
            />
          )
        })}
      </>
    )
  }, [cellData])
  return (
    <div key={cellData.id} className={styles.poolWrap}>
      <div className="flex justify-between items-center">
        <div className="w-[180px]">
          <p>{cellData.name}</p>
          <p>{cellData.nameShow}</p>
        </div>
        <div className="w-[140px]">{cellData.tvl_text}</div>
        <div className="w-[150px]">{apyDom}</div>
        <div className="w-[80px]">{cellData.userShare_text}</div>
        <div className="w-[80px]">{rewardTokenDom}</div>
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
