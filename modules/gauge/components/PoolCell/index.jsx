import React, { useRef, useMemo, useState } from 'react'
import Link from 'next/link'
import { Tooltip } from 'antd'
import { DotChartOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { NoticeCard } from '@/modules/home/components/Common'
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
import useVeBoost_c from '@/modules/earningPool/controller/useVeBoost_c'
import NumberInput from '@/components/NumberInput'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'

import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'

const stETHImg = '/tokens/steth.svg'

export default function PoolCell({
  cellData,
  voteData,
  onCastVote,
  remaining,
  ...pageOthers
}) {
  const { userInfo = {}, lpGaugeContract } = cellData
  const boostInfo = useVeBoost_c(cellData)
  const { isAllReady, currentAccount } = useWeb3()
  const [openPanel, setOpenPanel] = useState(false)
  const [power, setPower] = useState(0)

  const canCast = useMemo(
    () => power && voteData.canVote && remaining >= power,
    [voteData, power]
  )

  const onChange = (v) => {
    setPower(Number(v))
  }

  const apyDom = useMemo(() => {
    let _allApy_min = cBN(0)
    let _allApy_max = cBN(0)
    let _min_FXN_Apy = 0
    let _max_FXN_Apy = 0
    const _tips = []
    if (cellData.apyInfo && cellData.apyInfo.apyList.length) {
      _tips.push(`convexLpApy : ${cellData.apyInfo.convexLpApy.project} %`)
      _allApy_min = cBN(cellData.apyInfo.convexLpApy.project)
      _allApy_max = cBN(cellData.apyInfo.convexLpApy.project)
      cellData.apyInfo.apyList.map((item, index) => {
        if (item.rewardToken[1] == config.tokens.FXN) {
          if (boostInfo.length) {
            _min_FXN_Apy = cBN(item._apy).times(boostInfo[3]).toFixed(2)
            _max_FXN_Apy = cBN(item._apy)
              .times(boostInfo[2])
              .times(2.5)
              .toFixed(2)
          }
          _allApy_min = _allApy_min.plus(_min_FXN_Apy)
          _allApy_max = _allApy_max.plus(_max_FXN_Apy)
          _tips.push(
            `${item.rewardToken[3]} : ${_min_FXN_Apy}% - ${_allApy_max}%`
          )
        } else {
          _allApy_max = _allApy_max.plus(item._apy)
          _tips.push(`${item.rewardToken[3]} : ${item._apy}`)
        }
      })
    }
    if (checkNotZoroNum(_allApy_min)) {
      return (
        <div className="flex gap-[6px] items-center text-[16px]">
          {_allApy_min.toFixed(2)}% - {_allApy_max.toFixed(2)}%
          <Tooltip
            placement="top"
            title={_tips.map((txt) => (
              <div>
                <p className="text-[14px]">{txt}</p>
              </div>
            ))}
            arrow
            color="#000"
          >
            <InfoCircleOutlined />
          </Tooltip>
        </div>
      )
    }
    return '-'
  }, [cellData, boostInfo])

  return (
    <div key={cellData.id} className={styles.poolWrap}>
      <div className={styles.card} onClick={() => setOpenPanel(!openPanel)}>
        <div className="w-[120px]">
          <p>{cellData.name}</p>
        </div>
        <div className="w-[120px] text-[16px]">Rebalance Pool</div>
        <div className="w-[60px] text-[16px]">{voteData?.userPower}%</div>
        <div className="w-[180px]">{apyDom}</div>
        <div className="w-[150px] text-[16px]">800.11k -> 700.99k</div>
        <div className="w-[20px] cursor-pointer">
          <img
            className={openPanel ? 'rotate-180' : ''}
            src="/images/arrow-down.svg"
          />
        </div>
      </div>

      {openPanel ? (
        <div className={`${styles.panel}`}>
          <div className={`${styles.content} gap-[32px]`}>
            <div className="flex-1">
              <p>
                Voting for{' '}
                <span className="text-[var(--primary-color)]">
                  {cellData.name}
                </span>
              </p>
              <p className="text-[16px]">
                Previous vote: {voteData?.userPower}% ({voteData?.userVote}{' '}
                Votes)
              </p>
            </div>
            <div className="flex items-center gap-[6px]">
              <NumberInput
                max={remaining}
                className="w-[100px]"
                onChange={onChange}
                placeholder="0"
              />
              %
            </div>
            <Button
              width="140px"
              height="40px"
              style={{ fontSize: '20px' }}
              disabled={!canCast}
              onClick={() => onCastVote(power)}
            >
              Cast Vote
            </Button>
          </div>
          {voteData.canVote ? null : (
            <NoticeCard
              content={[
                `Cannot change weight votes more often than once in 10 days. You can vote after the ${voteData.canVoteTime}`,
              ]}
            />
          )}
        </div>
      ) : null}
    </div>
  )
}
