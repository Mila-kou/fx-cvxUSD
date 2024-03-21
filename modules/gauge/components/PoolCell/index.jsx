import React, { useRef, useMemo, useState } from 'react'
import Link from 'next/link'
import { Tooltip } from 'antd'
import { DotChartOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { NoticeCard } from '@/modules/assets/components/Common'
import Button from '@/components/Button'
import styles from './styles.module.scss'
import {
  cBN,
  checkNotZoroNum,
  checkNotZoroNumOption,
  dollarText,
  fb4,
} from '@/utils/index'
import NumberInput from '@/components/NumberInput'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'

import useWeb3 from '@/hooks/useWeb3'

export default function PoolCell({
  cellData,
  voteData,
  onCastVote,
  remaining,
  userVoteInfo
}) {
  const { isAllReady, currentAccount } = useWeb3()
  const [openPanel, setOpenPanel] = useState(false)
  const [power, setPower] = useState(0)

  const canCast = useMemo(() => {
    if (voteData?.userPower) {
      const _remaining = remaining + voteData.userPower
      return voteData?.canVote && _remaining >= power
    }
    return (
      power &&
      voteData?.canVote &&
      checkNotZoroNum(userVoteInfo?._remainingVotes) &&
      remaining >= power
    )
  }, [voteData, power, remaining])

  const onChange = (v) => {
    setPower(Number(v))
  }

  const apyDom = useMemo(() => {
    return `${
      checkNotZoroNum(voteData?.gaugeApy?._thisWeek_apy)
        ? `${fb4(voteData.gaugeApy?._thisWeek_apy, false, 0, 2)} %`
        : '-'
    } ${
      checkNotZoroNum(voteData?.gaugeApy?._nextWeek_apy)
        ? `-> ${fb4(voteData?.gaugeApy?._nextWeek_apy, false, 0, 2)} %`
        : '-'
    }`
  }, [voteData])

  return (
    <div key={cellData.id} className={styles.poolWrap}>
      <div
        className={styles.card}
        style={{
          background: ['fxUSD', 'rUSD'].includes(cellData.poolType)
            ? 'var(--deep-green-color)'
            : cellData.poolType == 'fETH'
            ? 'var(--f-bg-color)'
            : '',
        }}
        onClick={() => setOpenPanel(!openPanel)}
      >
        <div className="w-[200px] flex items-center gap-[26px]">
          <div className="flex items-center">
            {cellData.icons?.map((item) => (
              <div className="relative flex-shrink-0 mr-[-10px]">
                <img className="w-[30px]" src={item.icon} />
                <img
                  className="w-[18px] absolute right-[-8px] bottom-[-3px]"
                  src={item.subIcon}
                />
              </div>
            ))}
          </div>
          <span style={{ marginLeft: '5px' }}>{cellData.name}</span>
        </div>
        <div className="w-[180px] text-[16px]">{cellData.gaugeTypeName}</div>
        <div className="w-[100px] text-[16px]">
          {voteData?.userPower ? `${voteData?.userPower}%` : '-'}
        </div>
        <div className="w-[200px] text-[16px]">{apyDom}</div>
        <div className="w-[150px] text-[16px]">
          {voteData?.thisWeekEstimateFXNEmissions}
          {voteData?.nextWeekEstimateFXNEmissions
            ? ` -> ${voteData.nextWeekEstimateFXNEmissions}`
            : ''}
        </div>
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
                max={remaining + voteData?.userPower}
                className="w-[100px] h-[40px]"
                onChange={onChange}
                placeholder="0"
              />
              %
            </div>
            <Button
              size="small"
              disabled={!canCast}
              type="second"
              onClick={() => onCastVote(power)}
            >
              Cast Vote
            </Button>
          </div>
          {voteData?.canVote ? null : (
            <NoticeCard
              content={[
                `Cannot change weight votes more often than once in 10 days. You can vote after the ${voteData?.canVoteTime}`,
              ]}
            />
          )}
        </div>
      ) : null}
    </div>
  )
}
