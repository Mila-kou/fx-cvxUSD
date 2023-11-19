import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Tooltip } from 'antd'
import cn from 'classnames'
import Button from '@/components/Button'
import { POOLS_LIST } from '@/config/aladdinVault'
import styles from './styles.module.scss'
import {
  cBN,
  checkNotZoroNum,
  checkNotZoroNumOption,
  dollarText,
  fb4,
} from '@/utils/index'
import NumberInput from '@/components/NumberInput'
import useVeBoost_c from '../../controller/useVeBoost_c'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'

import useWeb3 from '@/hooks/useWeb3'

const stETHImg = '/tokens/steth.svg'

export default function PoolCell({ cellData, ...pageOthers }) {
  const { userInfo = {}, lpGaugeContract } = cellData
  const boost = useVeBoost_c(cellData)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const { isAllReady, currentAccount } = useWeb3()
  const [openPanel, setOpenPanel] = useState(false)

  const onChange = (v) => {
    console.log(v)
  }

  return (
    <div key={cellData.id} className={styles.poolWrap}>
      <div className={styles.card} onClick={() => setOpenPanel(!openPanel)}>
        <div className="w-[120px]">
          <p>{cellData.name}</p>
        </div>
        <div className="w-[140px]">Rebalance Pool</div>
        <div className="w-[60px]">0.0%</div>
        <div className="w-[150px]">50.12% -> 53.21%</div>
        <div className="w-[150px]">800.11k -> 700.99k</div>
        <div className="w-[20px] cursor-pointer">
          <img src="/images/arrow-down.svg" />
        </div>
      </div>

      {openPanel ? (
        <div className={`${styles.panel}`}>
          <div>
            <p>
              Voting for <b>{cellData.name}</b>
            </p>
            <p className="text-[16px]">Previous vote: 0.0% (0 Votes)</p>
          </div>
          <NumberInput
            className="w-[300px]"
            onChange={onChange}
            placeholder="Enter an amount"
          />
        </div>
      ) : null}
    </div>
  )
}
