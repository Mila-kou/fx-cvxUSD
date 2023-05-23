import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from 'antd'
import { DownOutlined, LeftOutlined } from '@ant-design/icons'
import { useToggle, useClickAway } from 'ahooks'
import BalanceInput from '@/components/BalanceInput'
import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import { cBN, fb4 } from '@/utils/index'
import { useToken } from '@/hooks/useTokenInfo'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import { getGas } from '@/utils/gas'
import styles from './styles.module.scss'
import usefxETH from '../../controller/usefxETH'

export default function DetailCollapse({ title, detail, open = false }) {
  const [showContent, { toggle }] = useToggle(open)
  const PageData = usefxETH()
  return (
    <div className={styles.container}>
      <div className={styles.header} onClick={toggle}>
        {title}
        {showContent ? <DownOutlined /> : <LeftOutlined />}
      </div>

      {showContent ? (
        <div className={styles.content}>
          {/* <p>
            fETH Collecteral Ratio will be: <span>220%</span>
          </p> */}
          {/* <p>
            fETH Net Asset Value: <span>${PageData.fnav}</span>
          </p>
          <p>
            xETH Net Asset Value: <span>${PageData.xnav}</span>
          </p> */}

          <div className={styles.result}>
            {detail.maxBaseIn ? (
              <p>
                Max Base In ETH: <span>{detail.maxBaseIn} ETH</span>
              </p>
            ) : null}
            {/* {detail.maxBaseIn ? (
              <p>
                Max Token Mintable: <span>{detail.maxXTokenMintable}</span>
              </p>
            ) : null} */}

            {detail.maxXETHBonus ? (
              <p>
                System Bonus: :{' '}
                <span className={styles.green}>
                  +{detail.maxXETHBonus} xETH
                </span>
              </p>
            ) : null}
            {detail.useXETHBonus ? (
              <p>
                User Bonus: :{' '}
                <span className={styles.green}>
                  +{detail.useXETHBonus} xETH
                </span>
              </p>
            ) : null}

            {/* {detail.bonus ? (
              <p>
                System Bonus: :{' '}
                <span className={styles.green}>
                  +{detail.bonus} ETH ({detail.bonusRatio}%)
                </span>
              </p>
            ) : null} */}

            {detail.ETH ? (
              <p>
                Minimum received ETH: <span>{detail.ETH}</span>
              </p>
            ) : null}
            {detail.fETH ? (
              <p>
                Minimum received fETH: <span>{detail.fETH}</span>
              </p>
            ) : null}
            {detail.xETH ? (
              <p>
                Minimum received xETH: <span>{detail.xETH}</span>
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}
