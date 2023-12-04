import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Tooltip } from 'antd'
import { DotChartOutlined, InfoCircleOutlined } from '@ant-design/icons'
import cn from 'classnames'
import Button from '@/components/Button'
import DepositModal from '../DepositModal'
import WithdrawModal from '../WithdrawModal'
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
import { useFXNTokenMinter } from '@/hooks/useGaugeContracts'

const stETHImg = '/tokens/steth.svg'
const xETHImg = '/images/x-logo.svg'

export default function PoolCell({ cellData, ...pageOthers }) {
  const {
    userInfo = {},
    useFXNReward_text,
    lpGaugeAddress,
    lpGaugeContract,
  } = cellData
  const boostInfo = useVeBoost_c(cellData)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const { isAllReady, currentAccount } = useWeb3()
  const [claiming, setClaiming] = useState(false)
  const [openPanel, setOpenPanel] = useState(false)
  const { contract: FXNTokenMinterContract } = useFXNTokenMinter()

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

  const handleClaimFXN = async () => {
    if (!isAllReady) return
    try {
      setClaiming(true)
      const apiCall = FXNTokenMinterContract.methods.mint(lpGaugeAddress)
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
    // if (cellData?.apyInfo?.apyList.length) {
    //   console.log('apy-----page--', cellData.apyInfo, boostInfo)
    // }
    // const _projectApy = {
    //   convexLpApy: {},
    //   _allApy_min: cBN(0),
    //   _allApy_max: cBN(0),
    //   _min_FXN_Apy: 0,
    //   _max_FXN_Apy: 0,
    // }
    // const _currentApy = {
    //   convexLpApy: {},
    //   _allApy_min: cBN(0),
    //   _allApy_max: cBN(0),
    //   _min_FXN_Apy: 0,
    //   _max_FXN_Apy: 0,
    // }

    // const _allApy_min = cBN(0)
    // const _allApy_max = cBN(0)
    // const _min_FXN_Apy = 0
    // const _max_FXN_Apy = 0
    // const _tips = []
    // const { apyInfo } = cellData
    // if (apyInfo && apyInfo.convexLpApy && apyInfo.apyList.length) {
    //   _tips.push(`projectApy `)
    //   _tips.push(`-convexLpApy:${apyInfo.convexLpApy.apy.project} % `)
    //   _tips.push(`--base Apy: ${apyInfo.convexLpApy.curveApys.baseApy} %`)
    //   _tips.push(`--crvApy Apy: ${apyInfo.convexLpApy.curveApys.crvApy1} %`)
    //   _tips.push(`--cvxApy Apy: ${apyInfo.convexLpApy.curveApys.cvxApy} %`)

    //   _projectApy._allApy_min = cBN(apyInfo.convexLpApy.apy.project)
    //   _projectApy._allApy_max = cBN(apyInfo.convexLpApy.apy.project)
    //   apyInfo.apyList.map((item, index) => {
    //     console.log('gauge--apy----item', item)
    //     if (item.rewardToken[1] == config.tokens.FXN) {
    //       if (boostInfo.length) {
    //         _projectApy._min_FXN_Apy = cBN(item._projectApy)
    //           .times(boostInfo[3])
    //           .toFixed(2)
    //         _projectApy._max_FXN_Apy = cBN(item._projectApy)
    //           .times(boostInfo[2])
    //           .times(2.5)
    //           .toFixed(2)
    //       }
    //       _projectApy._allApy_min = _projectApy._allApy_min.plus(
    //         _projectApy._min_FXN_Apy
    //       )
    //       _projectApy._allApy_max = _projectApy._allApy_max.plus(
    //         _projectApy._max_FXN_Apy
    //       )
    //       _tips.push(
    //         `${item.rewardToken[3]} : ${_projectApy._min_FXN_Apy}% - ${_projectApy._max_FXN_Apy}%`
    //       )
    //     } else {
    //       _projectApy._allApy_min = _projectApy._allApy_min.plus(
    //         item._currentApy
    //       )
    //       _projectApy._allApy_max = _projectApy._allApy_max.plus(
    //         item._currentApy
    //       )
    //       _tips.push(`${item.rewardToken[3]} : ${item._currentApy}`)
    //     }
    //   })
    // }
    // if (checkNotZoroNum(_projectApy._allApy_min)) {
    //   return (
    //     <div className="flex gap-[6px] items-center text-[16px]">
    //       {_allApy_min.toFixed(2)}% - {_allApy_max.toFixed(2)}%
    //       <Tooltip
    //         placement="top"
    //         title={_tips.map((txt) => (
    //           <div>
    //             <p className="text-[14px]">{txt}</p>
    //           </div>
    //         ))}
    //         arrow
    //         color="#000"
    //       >
    //         <InfoCircleOutlined />
    //       </Tooltip>
    //     </div>
    //   )
    // }
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
          const isOnlineRewardToken =
            cellData.rewardDatas &&
            cellData.rewardDatas.length &&
            cellData.rewardDatas.find(
              (rewardToken) =>
                rewardToken.rewardAddress.toLowerCase() == item[1].toLowerCase()
            )
          const isFXNReward =
            item[1].toLowerCase() == config.tokens.FXN.toLowerCase()
          if (isOnlineRewardToken || isFXNReward) {
            return (
              <div className="flex gap-[6px] py-[2px]">
                <img
                  key={index}
                  className="h-[20px]"
                  src={item[4] ?? '/images/f-logo.svg'}
                />
                <p className="text-[16px]">
                  {isFXNReward ? useFXNReward_text : _reward_text}
                </p>
              </div>
            )
          }
          return ''
        })}
      </>
    )
  }, [cellData])
  return (
    <div key={cellData.id} className={styles.poolWrap}>
      <div className={styles.card} onClick={() => setOpenPanel(!openPanel)}>
        <div className="flex w-[160px] gap-[6px] items-center">
          <img className="w-[30px]" src={xETHImg} />
          <div>
            <p className="text-[16px]">{cellData.name}</p>
            <p className="text-[14px] text-[var(--second-text-color)]">
              {cellData.nameShow}
            </p>
          </div>
        </div>
        <div className="w-[90px] text-[16px]">{cellData.tvl_text}</div>
        <div className="w-[180px]">{apyDom}</div>
        <div className="w-[60px] text-[16px]">{cellData.userShare_text}</div>
        <div className="w-[120px]">{rewardTokenDom}</div>

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
            <Button size="small" onClick={() => setShowDepositModal(true)}>
              Deposit
            </Button>
            <Button size="small" onClick={() => setShowWithdrawModal(true)}>
              Withdraw
            </Button>
            <Button size="small" onClick={handleClaim} type="second">
              Claim
            </Button>
            <Button size="small" onClick={handleClaimFXN} type="second">
              Claim FXN
            </Button>
          </div>
        </div>
      ) : null}

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

      {showWithdrawModal && (
        <WithdrawModal
          // cellData={cellData}
          info={cellData}
          // contractType={contractType}
          // FX_RebalancePoolContract={FX_RebalancePoolContract}
          // poolData={stabilityPoolInfo}
          onCancel={() => setShowWithdrawModal(false)}
        />
      )}
    </div>
  )
}
