import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Tooltip } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import cn from 'classnames'
import Button from '@/components/Button'
import DepositModal from '../DepositModal'
import FETHWithdrawModal from '../WithdrawModal/fETH'
import FxUSDWithdrawModal from '../WithdrawModal/fxUSD'
import styles from './styles.module.scss'
import {
  cBN,
  checkNotZoroNum,
  checkNotZoroNumOption,
  dollarText,
} from '@/utils/index'
import { ASSET_MAP, contracts } from '@/config/tokens'
import { useContract, useFX_stETHTreasury } from '@/hooks/useContracts'
import noPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import useWeb3 from '@/hooks/useWeb3'
import abi from '@/config/abi'

const stETHImg = '/tokens/steth.svg'
const xETHImg = '/images/x-logo.svg'
const fxnImg = '/images/FXN.svg'

export default function RebalancePoolCell({
  handleDeposit,
  handleWithdraw,
  canUnlock,
  handleUnlock,
  claiming,
  handleClaim,

  boostableRebalancePoolInfo,
  userDeposit,
  userDepositTvl_text,
  myTotalValue_text,

  userWstETHClaimable_text,
  userWstETHClaimableTvl_text,
  userWstETH_x_Claimable_text,
  userWstETH_x_ClaimableTvl_text,
  userSfrxETHClaimable_text,
  userSfrxETHClaimableTvl_text,
  userSfrxETH_x_Claimable_text,
  userSfrxETH_x_ClaimableTvl_text,
  userXETHClaimable_text,
  userXETHClaimableTvl_text,
  userFXNClaimable_text,
  userFXNClaimableTvl_text,

  poolTotalSupplyTvl_text,
  userUnlockingBalance,
  userUnlockingUnlockAt,
  userUnlockedBalance,
  userTotalClaimable,
  userTotalClaimableTvl_text,

  depositVisible,
  setDepositVisible,
  withdrawVisible,
  setWithdrawVisible,

  FX_RebalancePoolContract,

  hasXETH,
  _poolConfig,
  ...poolData
}) {
  const [openPanel, setOpenPanel] = useState(false)
  const [harvesting, setHarvesting] = useState(false)
  const { currentAccount, isAllReady, sendTransaction } = useWeb3()
  const { getContract } = useContract()

  const canClaim = checkNotZoroNum(userTotalClaimable)
  const { contract: treasuryContract } = useFX_stETHTreasury()
  const rpGaugeClaimContract = getContract(
    _poolConfig.gaugeClaimer,
    abi.FX_RebalancePoolGaugeClaimerABI
  )

  const WithdrawModal = useMemo(
    () =>
      _poolConfig.withdrawDefaultToken === 'fxUSD'
        ? FxUSDWithdrawModal
        : FETHWithdrawModal,
    [_poolConfig, FxUSDWithdrawModal, FETHWithdrawModal]
  )

  const isWstETH = useMemo(() => {
    return [
      'rebalancePoolV2_info_A',
      'rebalancePoolV2_info_B',
      'rebalancePoolV2_info_fxUSD_wstETH',
      'rebalancePoolV2_info_fxUSD_xstETH',
    ].includes(_poolConfig.infoKey)
  }, [_poolConfig])

  const isWstETH_x = useMemo(() => {
    return ['rebalancePoolV2_info_fxUSD_xstETH'].includes(_poolConfig.infoKey)
  }, [_poolConfig])

  const getRewards = (props = {}) => (
    <div {...props}>
      <div className="flex gap-[16px] py-[2px]">
        <img alt="FXN" className="h-[20px] w-[20px]" src={fxnImg} />
        <p className="text-[16px]">{userFXNClaimable_text}</p>
      </div>

      {isWstETH ? (
        <div className="flex gap-[16px] py-[2px]">
          <img alt="wstETH" className="h-[20px] w-[20px]" src={stETHImg} />
          <p className="text-[16px]">{userWstETHClaimable_text}</p>
        </div>
      ) : null}

      {hasXETH ? (
        <div className="flex gap-[16px] py-[2px]">
          <div className="relative">
            <img className="w-[20px]" src={ASSET_MAP.xETH.icon} />
            <img
              className="w-[12px] absolute right-[-4px] bottom-[2px]"
              src={ASSET_MAP.xETH.subIcon}
            />
          </div>
          <p className="text-[16px]">{userXETHClaimable_text}</p>
        </div>
      ) : null}

      {isWstETH_x ? (
        <div className="flex gap-[16px] py-[2px]">
          <img alt="xstETH" className="h-[20px] w-[20px]" src={xETHImg} />
          <p className="text-[16px]">{userWstETH_x_Claimable_text}</p>
        </div>
      ) : null}
    </div>
  )

  const [apyAndBoostDom, apyDom, apyDetailDom] = useMemo(() => {
    let _apyAndBoostDom = '-'
    let _apyDom = '-'
    let _apyDetailDom = '-'
    try {
      const {
        fxnApyV1_text,
        boostLever_text,
        wstETHApy_text,
        fxnApy_min_text,
        fxnApy_current_min_text,
        fxnApy_max_text,
        fxnApy_current_max_text,
        userApy,
        userFxnApy_text,
        userFxnCurrentApy_text,
        userApy_text,
        userCurrentApy_text,
        minApy,
        minApy_text,
        minCurrentApy_text,
        maxApy_text,
        maxCurrentApy_text,
      } = poolData.apyObj
      let _apyList = []
      let _apyList_current = []
      if (checkNotZoroNum(userApy)) {
        _apyAndBoostDom = (
          <>
            <p>{userCurrentApy_text} %</p>
            <p>Boost: {boostLever_text}x</p>
          </>
        )
        _apyDom = `${userCurrentApy_text} %`
        _apyList = [`FXN APR: ${userFxnApy_text} %`]
        _apyList_current = [`FXN Current APR: ${userFxnCurrentApy_text} %`]
      } else if (checkNotZoroNum(minApy)) {
        _apyAndBoostDom = `${minCurrentApy_text} % -> ${maxCurrentApy_text} %`
        _apyDom = _apyAndBoostDom
        _apyList = [
          // `APY: ${minApy_text} % -> ${maxApy_text} %`,
          `FXN APR: ${fxnApy_min_text} % -> ${fxnApy_max_text} %`,
        ]
        _apyList_current = [
          `FXN Current APR: ${fxnApy_current_min_text} % -> ${fxnApy_current_max_text} %`,
        ]
      }

      if (isWstETH) {
        _apyList.push(`wstETH APR: ${wstETHApy_text}`)
        _apyList_current.push(`wstETH APR: ${wstETHApy_text}`)
      }
      if (checkNotZoroNum(minApy)) {
        _apyDetailDom = (
          <>
            <p>Current APR </p>{' '}
            {_apyList_current.map((apyText) => (
              <p className="text-[14px]">{apyText}</p>
            ))}
            <p>Project APR </p>{' '}
            {_apyList.map((apyText) => (
              <p className="text-[14px]">{apyText}</p>
            ))}
          </>
        )
      }
      return [_apyAndBoostDom, _apyDom, _apyDetailDom]
    } catch (error) {
      return [_apyAndBoostDom, _apyDom, _apyDetailDom]
    }
  }, [poolData.apyObj])

  const handleHarvestType = useCallback(
    async (type) => {
      if (!isAllReady) return
      setHarvesting(true)
      try {
        let apiCall
        let to
        switch (type) {
          case 'LSDDOM':
            to = treasuryContract._address
            apiCall = treasuryContract.methods.harvest()
            break
          case 'FXNDOM':
            to = rpGaugeClaimContract._address
            apiCall = rpGaugeClaimContract.methods.claim(currentAccount)
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
    [treasuryContract, rpGaugeClaimContract, currentAccount, sendTransaction]
  )

  const harvestTypeDom = useCallback(
    (type, gaugeAddress) => {
      let _text
      let _earnText
      switch (type) {
        case 'LSDDOM':
          _text = 'Harvest LSD'
          _earnText = '2%'
          break
        case 'FXNDOM':
          _text = 'Harvest FXN'
          _earnText = '2%'
          break
        case 'ConvexDOM':
          _text = 'Harvest Convex'
          _earnText = '2%'
          break
        default:
          _text = 'Harvest FXN'
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
    <div key={_poolConfig.infoKey} className={styles.poolWrap}>
      <div
        className={styles.card}
        style={{
          background:
            _poolConfig.poolType == 'fxUSD'
              ? 'var(--deep-green-color)'
              : 'var(--f-bg-color)',
        }}
        onClick={() => setOpenPanel(!openPanel)}
      >
        <div className="flex w-[230px] gap-[16px] items-center">
          <div className="relative flex-shrink-0">
            <img className="w-[30px]" src={_poolConfig.icon} />
            <img
              className="w-[18px] absolute right-[-8px] bottom-[-3px]"
              src={_poolConfig.subIcon}
            />
          </div>
          <div>
            <p className="text-[16px] h-[16px]">{poolData.title}</p>
            <div className="text-[14px] mt-[6px] text-[var(--second-text-color)]">
              {poolData.subTitle}
            </div>
          </div>
        </div>
        <div className="w-[120px] text-[16px]">
          <p className="text-[16px]">{poolTotalSupplyTvl_text}</p>
          <p className="text-[16px] mt-[6px] text-[var(--second-text-color)]">
            {poolData.poolTotalSupply}
          </p>
        </div>
        <div className="w-[200px] text-[16px]">
          {apyAndBoostDom}{' '}
          <Tooltip
            placement="topLeft"
            title={apyDetailDom}
            arrow
            color="#000"
            overlayInnerStyle={{ width: '300px' }}
          >
            <InfoCircleOutlined className="ml-[8px]" />
          </Tooltip>
        </div>
        <div className="w-[110px] text-[16px]">
          <p className="text-[16px]">{userDepositTvl_text}</p>
          <p className="text-[16px] mt-[6px] text-[var(--second-text-color)]">
            {userDeposit}
          </p>
        </div>
        <div className="w-[100px]">{userTotalClaimableTvl_text}</div>
        <div className="w-[20px] cursor-pointer">
          <img
            className={openPanel ? 'rotate-180' : ''}
            src="/images/arrow-down.svg"
          />
        </div>
      </div>
      {openPanel ? (
        <div className={`${styles.panel}`}>
          <div className={styles.content}>
            <p>
              Mint{' '}
              <Link
                href={`assets/${_poolConfig.poolType}`}
                className="text-[var(--blue-color)] underline"
              >
                {_poolConfig.poolType}
              </Link>{' '}
              , then stake here to earn LSD{' '}
              {/* <Tooltip
                placement="topLeft"
                title={harvestTypeDom('LSDDOM')}
                arrow
                color="#000"
              >
                <span className="underline text-[var(--a-button-color)]">
                  LSD
                </span>
              </Tooltip>{' '} */}
              and{' '}
              {/* <Tooltip
                placement="topLeft"
                title={harvestTypeDom('FXNDOM')}
                arrow
                color="#000"
              >
                <span className="underline text-[var(--a-button-color)]">
                  FXN
                </span>
              </Tooltip>{' '} */}
              FXN rewards
            </p>
            <div className="mt-[12px]">
              Current APR: {apyDom}{' '}
              <Tooltip
                placement="topLeft"
                title={apyDetailDom}
                arrow
                color="#000"
                overlayInnerStyle={{ width: '300px' }}
              >
                <InfoCircleOutlined className="ml-[8px]" />
              </Tooltip>
            </div>
            <div className={`${styles.item} mt-[12px]`}>
              <div>
                <div className="flex">
                  Earn: {getRewards({ className: 'flex gap-[32px] ml-[8px]' })}
                </div>
              </div>
              <div>
                <div className="flex gap-[32px]">
                  <Button size="small" type="second" onClick={handleDeposit}>
                    Deposit
                  </Button>
                  <Button size="small" type="second" onClick={handleWithdraw}>
                    Withdraw
                  </Button>
                  <Button
                    size="small"
                    type="red"
                    disabled={!canClaim}
                    loading={claiming}
                    onClick={() => handleClaim()}
                  >
                    Claim
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {depositVisible && (
        <DepositModal
          info={_poolConfig}
          FX_RebalancePoolContract={FX_RebalancePoolContract}
          poolData={boostableRebalancePoolInfo}
          onCancel={() => setDepositVisible(false)}
        />
      )}
      {withdrawVisible && (
        <WithdrawModal
          info={_poolConfig}
          FX_RebalancePoolContract={FX_RebalancePoolContract}
          poolData={boostableRebalancePoolInfo}
          onCancel={() => setWithdrawVisible(false)}
        />
      )}
    </div>
  )
}
