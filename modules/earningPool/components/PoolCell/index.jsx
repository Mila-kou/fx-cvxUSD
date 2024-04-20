import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Tooltip } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import Button from '@/components/Button'
import DepositModal from '../DepositModal'
import WithdrawModal from '../WithdrawModal'
import styles from './styles.module.scss'
import { cBN, checkNotZoroNum, checkNotZoroNumOption, fb4 } from '@/utils/index'
import noPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'

import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import { useFXNTokenMinter } from '@/hooks/useGaugeContracts'
import { useVeBoostAllGauge } from '@/hooks/calculator/useVeBoost_AllGauge'
import abi from '@/config/abi'
import { useContract } from '@/hooks/useContracts'

export default function PoolCell({ cellData }) {
  const {
    userInfo = {},
    useFXNClaimable,
    useFXNClaimable_text,
    useCRVClaimable_text,
    useCVXClaimable_text,
    lpGaugeAddress,
    lpGaugeContract,
    manageConvexGaugeAddress,
  } = cellData
  const [harvesting, setHarvesting] = useState(false)
  const veBoostAllData = useVeBoostAllGauge()
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const { isAllReady, currentAccount, sendTransaction } = useWeb3()
  const [claiming, setClaiming] = useState(false)
  const [openPanel, setOpenPanel] = useState(false)
  const { contract: FXNTokenMinterContract } = useFXNTokenMinter()
  const { getContract } = useContract()

  const manageConvexGaugeContract = getContract(
    manageConvexGaugeAddress,
    abi.FX_ConvexCurveManagerABI
  )
  const _rewardTokensList = [cellData.baseRewardToken].concat(
    cellData.rewardTokens
  )
  const boostInfo = useMemo(() => {
    let boost = [0, 0, 0, 0]
    try {
      if (
        veBoostAllData &&
        veBoostAllData.allGaugeVeBoost &&
        veBoostAllData.allGaugeVeBoost[lpGaugeAddress]
      ) {
        boost = veBoostAllData.allGaugeVeBoost[lpGaugeAddress]
      }
    } catch (error) {
      boost = [0, 0, 0, 0]
    }
    return boost
  }, [veBoostAllData])

  const handleClaim = async (symbol, wrap) => {
    if (!isAllReady) return
    try {
      setClaiming(true)
      const apiCall = lpGaugeContract.methods.claim(currentAccount)
      await noPayableAction(
        () =>
          sendTransaction({
            to: lpGaugeContract._address,
            data: apiCall.encodeABI(),
          }),
        {
          key: 'lp',
          action: 'Claim',
        }
      )
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
      await noPayableAction(
        () =>
          sendTransaction({
            to: FXNTokenMinterContract._address,
            data: apiCall.encodeABI(),
          }),
        {
          key: 'lp',
          action: 'Claim',
        }
      )
      setClaiming(false)
    } catch (error) {
      setClaiming(true)
      console.log('claim-error---', error)
      noPayableErrorAction(`error_claim`, error)
    }
  }

  const getTypeApy = useCallback(
    (_apyInfo, type) => {
      const { convexLpApy, fxnApy } = _apyInfo
      const _typeApy = {
        convexLpApy: {},
        _allApy_min: cBN(0),
        _allApy_max: cBN(0),
        _min_FXN_Apy: 0,
        _max_FXN_Apy: 0,
      }
      let _convexTypeApy = 0
      if (type == 'project') {
        _convexTypeApy = convexLpApy.apy.project
      } else {
        _convexTypeApy = convexLpApy.apy.current
      }
      _typeApy.convexLpApy = _apyInfo.convexLpApy
      _typeApy._allApy_min = cBN(_convexTypeApy)
      _typeApy._allApy_max = cBN(_convexTypeApy)

      if (_apyInfo?.fxnApy?.otherApy) {
        _typeApy._min_FXN_Apy = _apyInfo?.fxnApy?.otherApy
        _typeApy._max_FXN_Apy = _apyInfo?.fxnApy?.otherApy        
      } else {
        _typeApy._min_FXN_Apy = cBN(fxnApy._thisWeek_apy)
          .times(boostInfo[3])
          .toFixed(2)
        _typeApy._max_FXN_Apy = cBN(fxnApy._thisWeek_apy)
          .times(boostInfo[3])
          .times(2.5)
          .toFixed(2)
        _typeApy._allApy_min = cBN(_convexTypeApy).plus(_typeApy._min_FXN_Apy)
        _typeApy._allApy_max = cBN(_convexTypeApy).plus(_typeApy._max_FXN_Apy)
      }
      const boostLever = boostInfo[2]
      if (cBN(boostLever).gt(1)) {
        _typeApy.boostLever = boostLever
        const _userFxnApy = cBN(_typeApy._min_FXN_Apy).times(boostLever)
        const _userApy = cBN(_convexTypeApy).plus(_userFxnApy)
        _typeApy.userApy = _userApy
        _typeApy.userFxnApy = _userFxnApy
        _typeApy.userFxnApy_text = checkNotZoroNumOption(
          _userFxnApy,
          fb4(_userFxnApy, false, 0, 2)
        )
        _typeApy.userApy_text = checkNotZoroNumOption(
          _userApy,
          fb4(_userApy, false, 0, 2)
        )
      }
      _typeApy.boostLever_text = fb4(boostInfo[2], false, 0, 2)
      return _typeApy
    },
    [veBoostAllData]
  )

  const canClaim = useMemo(() => {
    let _isCanClaim = false
    if (userInfo.userClaimables && userInfo.userClaimables.length) {
      userInfo.userClaimables.map((item, index) => {
        if (checkNotZoroNum(item)) {
          _isCanClaim = true
        }
      })
    }
    return _isCanClaim
  }, [userInfo.userClaimables])

  const canClaimFXN = useMemo(() => {
    return checkNotZoroNum(useFXNClaimable)
  }, [useFXNClaimable])

  const [apyAndBoostDom, apyDom, apyDetalDom] = useMemo(() => {
    const { apyInfo } = cellData
    if (
      apyInfo &&
      apyInfo.convexLpApy &&
      apyInfo.convexLpApy.apy &&
      apyInfo.apyList.length
    ) {
      const _projectApy = getTypeApy(apyInfo, 'project')
      const _currentApy = getTypeApy(apyInfo, 'current')
      // console.log('apy----_currentApy---', _currentApy)
      let _apyAndBoostDom = '-'
      let _apyDom = '-'
      let _apyDetailDom = '-'
      if (checkNotZoroNum(_projectApy.userApy)) {
        _apyAndBoostDom = (
          <>
            <p>{_projectApy.userApy_text} %</p>
            <p>Boost: {_projectApy.boostLever_text}x</p>
          </>
        )
        _apyDom = `${_projectApy.userApy_text} %`
      } else if (apyInfo.fxnApy?.otherApy) {
        _apyAndBoostDom = `500 %+ -> 500 %+`
        _apyDom = _apyAndBoostDom
      } else if (checkNotZoroNum(_projectApy._allApy_min)) {
        _apyAndBoostDom = `${fb4(
          _projectApy._allApy_min,
          false,
          0,
          2
        )} % -> ${fb4(_projectApy._allApy_max, false, 0, 2)} %`
        _apyDom = _apyAndBoostDom
      }
      _apyDetailDom = (
        <div>
          <p>Convex APR</p>
          <p>
            &nbsp;&nbsp; base APR :{' '}
            {cBN(_projectApy.convexLpApy.projectApys.baseApy).toFixed(2)} %
          </p>
          <p>
            &nbsp;&nbsp; CRV :{' '}
            {cBN(_projectApy.convexLpApy.projectApys.crvApy1).toFixed(2)} %
          </p>
          <p>
            &nbsp;&nbsp; CVX :{' '}
            {cBN(_projectApy.convexLpApy.projectApys.cvxApy).toFixed(2)} %
          </p>
          <p>FXN APR</p>
          <p>&nbsp;&nbsp; Min APR : {_projectApy._min_FXN_Apy} %</p>
          <p>&nbsp;&nbsp; Max APR : {_projectApy._max_FXN_Apy} %</p>
        </div>
      )
      return [_apyAndBoostDom, _apyDom, _apyDetailDom]
    }
    return ['-', '-', '-']
  }, [cellData.apyInfo, boostInfo])

  const rewardTokenDom = useMemo(() => {
    return (
      <>
        {_rewardTokensList.map((item, index) => {
          let _reward_text = '-'
          if (item[1].toLowerCase() == config.tokens.FXN.toLowerCase()) {
            _reward_text = useFXNClaimable_text
          } else if (item[1].toLowerCase() == config.tokens.crv.toLowerCase()) {
            _reward_text = useCRVClaimable_text
          } else if (item[1].toLowerCase() == config.tokens.cvx.toLowerCase()) {
            _reward_text = useCVXClaimable_text
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
              <div className="flex gap-[6px] py-[2px] ml-[8px]">
                <img
                  key={index}
                  className="h-[20px]"
                  src={item[4] ?? '/images/f-logo.svg'}
                />
                <p className="text-[16px]">
                  {isFXNReward ? useFXNClaimable_text : _reward_text}
                </p>
              </div>
            )
          }
          return ''
        })}
      </>
    )
  }, [cellData])

  const handleHarvestType = useCallback(
    async (type) => {
      if (!isAllReady) return
      setHarvesting(true)
      try {
        let apiCall
        let to
        switch (type) {
          case 'manageConvexDOM':
            to = manageConvexGaugeContract._address
            apiCall = manageConvexGaugeContract.methods.harvest(currentAccount)
            break
          default:
            break
        }
        await noPayableAction(
          () =>
            sendTransaction({
              to,
              data: apiCall.encodeABI(),
            }),
          {
            key: 'lp',
            action: 'Harvest',
          }
        )
        setHarvesting(false)
      } catch (error) {
        console.log('error_harvest---', error)
        setHarvesting(false)
        noPayableErrorAction(`error_harvest`, error)
      }
    },
    [manageConvexGaugeContract, currentAccount, sendTransaction]
  )

  const harvestTypeDom = useCallback(
    (type) => {
      let _text
      let _earnText
      switch (type) {
        case 'manageConvexDOM':
          _text = 'Harvest Convex Reward'
          _earnText = '2%'
          break
        default:
          _text = 'Harvest Convex Reward'
          _earnText = '2%'
          break
      }
      return (
        <>
          {/* <p>Earn {_earnText}</p> */}
          <Button
            size="small"
            type="second"
            onClick={() => {
              handleHarvestType(type)
            }}
          >
            {_text}
          </Button>
        </>
      )
    },
    [handleHarvestType]
  )

  return (
    <div key={cellData.id} className={styles.poolWrap}>
      <div className={styles.card} onClick={() => setOpenPanel(!openPanel)}>
        <div className="flex w-[230px] gap-[26px] items-center">
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
          <div>
            <p className="text-[16px]">{cellData.name}</p>

            {cellData.nameShow.map((item) => (
              <p className="text-[14px] text-[var(--second-text-color)]">
                {item}
              </p>
            ))}
          </div>
        </div>
        <div className="w-[120px] text-[16px]">
          {cellData.tvl_text} <br /> {cellData.totalSupply_text}
        </div>
        <div className="w-[200px] text-[16px]">{apyAndBoostDom}</div>
        <div className="w-[110px] text-[16px]">
          {cellData.userShare_tvl_text} <br /> {cellData.userShare_text}{' '}
        </div>
        <div className="w-[100px] text-[16px]">
          {cellData.userTotalClaimable_text}
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
          <p className="text-[var(--second-text-color)]">
            Deposit liquidity into the{' '}
            <a
              className="text-[var(--a-button-color)] underline cursor-pointer"
              href={cellData.platformUrl}
              target="_blank"
              rel="noreferrer"
            >
              {cellData.fromPlatform} {cellData.name} pool
            </a>
            , and then stake your LP tokens here to earn rewards
            {/* <Tooltip
              placement="top"
              title={harvestTypeDom('manageConvexDOM')}
              arrow
              color="#000"
            >
              <span className="underline text-[var(--a-button-color)]">
                rewards
              </span>
            </Tooltip> */}
          </p>
          <div className="mt-[12px]">
            Projected APR: {apyDom}{' '}
            <Tooltip
              placement="topLeft"
              title={apyDetalDom}
              arrow
              color="#000"
              overlayInnerStyle={{ width: '300px' }}
            >
              <InfoCircleOutlined className="ml-[8px]" />
            </Tooltip>
          </div>
          <div className="flex">Earn: {rewardTokenDom}</div>
          <div className={`${styles.content} gap-[32px]`}>
            <Button
              size="small"
              type="second"
              onClick={() => setShowDepositModal(true)}
            >
              Deposit
            </Button>
            <Button
              size="small"
              type="second"
              onClick={() => setShowWithdrawModal(true)}
            >
              Withdraw
            </Button>
            <Button
              size="small"
              type="red"
              disabled={!canClaimFXN}
              onClick={handleClaimFXN}
            >
              Claim FXN
            </Button>
            <Button
              size="small"
              type="red"
              disabled={!canClaim}
              onClick={handleClaim}
            >
              Claim CRV&CVX
            </Button>
          </div>
        </div>
      ) : null}
      {showDepositModal && (
        <DepositModal
          info={cellData}
          onCancel={() => setShowDepositModal(false)}
        />
      )}
      {showWithdrawModal && (
        <WithdrawModal
          info={cellData}
          onCancel={() => setShowWithdrawModal(false)}
        />
      )}
    </div>
  )
}
