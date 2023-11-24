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
  const { isAllReady, currentAccount } = useWeb3()
  const [openPanel, setOpenPanel] = useState(false)
  const [power, setPower] = useState(0)

  const canCast = useMemo(() => {
    if (voteData?.userPower) {
      const _remaining = remaining + voteData.userPower
      return voteData?.canVote && _remaining >= power
    }
    return power && voteData?.canVote && remaining >= power
  }, [voteData, power, remaining])

  const onChange = (v) => {
    setPower(Number(v))
  }

  const apyDom = useMemo(() => {
    return `${
      checkNotZoroNum(voteData?.gaugeApy?._thisWeek_apy)
        ? `${fb4(voteData.gaugeApy?._thisWeek_apy, false, 0, 2)} %`
        : '-'
    } -> ${
      checkNotZoroNum(voteData?.gaugeApy?._nextWeek_apy)
        ? `${fb4(voteData?.gaugeApy?._nextWeek_apy, false, 0, 2)} %`
        : '-'
    }`
  }, [cellData])

  return (
    <div key={cellData.id} className={styles.poolWrap}>
      <div className={styles.card} onClick={() => setOpenPanel(!openPanel)}>
        <div className="w-[120px]">
          <p>{cellData.name}</p>
        </div>
        <div className="w-[120px] text-[16px]">Rebalance Pool</div>
        <div className="w-[60px] text-[16px]">{voteData?.userPower}%</div>
        <div className="w-[180px]">{apyDom}</div>
        <div className="w-[150px] text-[16px]">
          {voteData?.thisWeekEstimateFXNEmissions} ->
          {voteData?.nextWeekEstimateFXNEmissions}
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
