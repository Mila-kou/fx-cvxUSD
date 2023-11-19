import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Tooltip, InfoCircleOutlined } from 'antd'
import cn from 'classnames'
import Button from '@/components/Button'
import { POOLS_LIST } from '@/config/aladdinVault'
import DepositModal from '../DepositModal'
import styles from './styles.module.scss'
import {
  cBN,
  checkNotZoroNum,
  checkNotZoroNumOption,
  dollarText,
  fb4,
} from '@/utils/index'
import useVeBoost_c from '../../controller/useVeBoost_c'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'

import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import { NoticeCard } from '@/modules/home/components/Common'

const stETHImg = '/tokens/steth.svg'

export default function PoolCell({ cellData, ...pageOthers }) {
  const { userInfo = {}, lpGaugeContract } = cellData
  const boostInfo = useVeBoost_c(cellData)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const { isAllReady, currentAccount } = useWeb3()
  const [claiming, setClaiming] = useState(false)

  const handleClaim = async (symbol, wrap) => {
    if (!isAllReady) return
    try {
      setClaiming(true)

      console.log('handleClaim-----', symbol, wrap)

      const apiCall = lpGaugeContract.methods.claim(currentAccount)
      const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(() => apiCall.send({ from: currentAccount, gas }), {
        key: 'lp',
        action: 'Claim',
      })
      setClaiming(false)
    } catch (error) {
      setClaiming(true)

      console.log('claim-error---', error)
      noPayableErrorAction(`error_claim`, error)
    }
  }

  const apyDom = useMemo(() => {
    console.log('apy------', cellData.apyInfo, boostInfo)
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
            `${item.rewardToken[3]} : ${_min_FXN_Apy} % - ${_allApy_max} %`
          )
        } else {
          _allApy_max = _allApy_max.plus(item._apy)
          _tips.push(`${item.rewardToken[3]} : ${item._apy}`)
        }
      })
    }
    if (checkNotZoroNum(_allApy_min)) {
      return (
        <>
          {_allApy_min.toFixed(2)}%-{_allApy_max.toFixed(2)}%{' '}
          <NoticeCard content={_tips} />
          {/* <Tooltip placement="top" title={_tips} arrow color="#000">
            <InfoCircleOutlined />
          </Tooltip> */}
        </>
      )
    }
    return '-'
  }, [cellData, boostInfo])
  console.log('cellData----', cellData, apyDom)

  const rewardTokenDom = useMemo(() => {
    return (
      <>
        {cellData.rewardTokens.map((item, index) => {
          let _reward_text = '-'
          if (userInfo.userClaimables && userInfo.userClaimables.length) {
            _reward_text = checkNotZoroNumOption(
              userInfo.userClaimables[index],
              fb4(userInfo?.userClaimables[index])
            )
          }
          return (
            <>
              <img
                key={index}
                className="h-[30px]"
                src={item[4] ?? '/images/f-logo.svg'}
              />
              {_reward_text}
            </>
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
          <div
            className="underline cursor-pointer text-[var(--a-button-color)]"
            onClick={() => handleClaim()}
          >
            Claim
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
