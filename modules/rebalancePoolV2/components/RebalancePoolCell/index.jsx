import React, { useEffect, useMemo, useState } from 'react'
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

const stETHImg = '/tokens/steth.svg'
const sfrxEthImg = '/tokens/sfrxEth.svg'
const xETHImg = '/images/x-logo.svg'
const xfrxETHImg = '/images/x-logo.svg'
const fETHImg = '/images/f-logo.svg'
const fxnImg = '/images/FXN.svg'

export default function RebalancePoolCell({
  harvesting,
  handleHarvest,
  handleLiquidatorWithBonus,

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

  contractType,
  FX_RebalancePoolContract,

  hasXETH,
  _poolConfig,
  ...poolData
}) {
  const [openPanel, setOpenPanel] = useState(false)

  const canClaim = checkNotZoroNum(userTotalClaimable)

  const isFXUSDPool = _poolConfig.withdrawDefaultToken === 'fxUSD'

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

  const isSfrxETH = useMemo(() => {
    return [
      'rebalancePoolV2_info_fxUSD_sfrxETH',
      'rebalancePoolV2_info_fxUSD_xfrxETH',
    ].includes(_poolConfig.infoKey)
  }, [_poolConfig])

  const isSfrxETH_x = useMemo(() => {
    return ['rebalancePoolV2_info_fxUSD_xfrxETH'].includes(_poolConfig.infoKey)
  }, [_poolConfig])

  const getRewards = (props = {}) => (
    <div {...props}>
      <div className="flex gap-[6px] py-[2px]">
        <img alt="FXN" className="h-[20px] w-[20px]" src={fxnImg} />
        <p className="text-[16px]">{userFXNClaimable_text}</p>
      </div>

      {isWstETH ? (
        <div className="flex gap-[6px] py-[2px]">
          <img alt="wstETH" className="h-[20px] w-[20px]" src={stETHImg} />
          <p className="text-[16px]">{userWstETHClaimable_text}</p>
        </div>
      ) : null}

      {isSfrxETH ? (
        <div className="flex gap-[6px] py-[2px]">
          <img alt="sfrxETH" className="h-[20px] w-[20px]" src={sfrxEthImg} />
          <p className="text-[16px]">{userSfrxETHClaimable_text}</p>
        </div>
      ) : null}

      {hasXETH ? (
        <div className="flex gap-[6px] py-[2px]">
          <img alt="xETH" className="h-[20px] w-[20px]" src={xETHImg} />
          <p className="text-[16px]">{userXETHClaimable_text}</p>
        </div>
      ) : null}

      {isWstETH_x ? (
        <div className="flex gap-[6px] py-[2px]">
          <img alt="xstETH" className="h-[20px] w-[20px]" src={xETHImg} />
          <p className="text-[16px]">{userWstETH_x_Claimable_text}</p>
        </div>
      ) : null}

      {isSfrxETH_x ? (
        <div className="flex gap-[6px] py-[2px]">
          <img alt="xfrxETH" className="h-[20px] w-[20px]" src={xfrxETHImg} />
          <p className="text-[16px]">{userSfrxETH_x_Claimable_text}</p>
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
        apy_text,
        fxnApyV1_text,
        boostLever_text,
        wstETHApy_text,
        sfrxETHApy_text,
        fxnApy_min_text,
        fxnApy_max_text,
        userApy,
        userFxnApy_text,
        userApy_text,
        minApy,
        minApy_text,
        maxApy_text,
      } = poolData.apyObj
      let _apyList = []
      if (!isFXUSDPool) {
        _apyAndBoostDom = `${apy_text} %`
        _apyDom = _apyAndBoostDom
        _apyList = [`FXN APR: ${fxnApyV1_text} %`]
      } else if (checkNotZoroNum(userApy)) {
        _apyAndBoostDom = (
          <>
            <p>{userApy_text} %</p>
            <p>Boost: {boostLever_text}x</p>
          </>
        )
        _apyDom = `${userApy_text} %`
        _apyList = [`FXN APR: ${userFxnApy_text} %`]
      } else if (checkNotZoroNum(minApy)) {
        _apyAndBoostDom = `${minApy_text} % -> ${maxApy_text} %`
        _apyDom = _apyAndBoostDom
        _apyList = [
          // `APY: ${minApy_text} % -> ${maxApy_text} %`,
          `FXN APR: ${fxnApy_min_text} % -> ${fxnApy_max_text} %`,
        ]
      }

      if (isWstETH) {
        _apyList.push(`wstETH APR: ${wstETHApy_text}`)
      }
      if (isSfrxETH) {
        _apyList.push(`sfrxETH APR: ${sfrxETHApy_text}`)
      }
      if (checkNotZoroNum(minApy)) {
        _apyDetailDom = _apyList.map((apyText) => {
          return <p className="text-[14px]">{apyText}</p>
        })
      }
      return [_apyAndBoostDom, _apyDom, _apyDetailDom]
    } catch (error) {
      return [_apyAndBoostDom, _apyDom, _apyDetailDom]
    }
  }, [poolData.apyObj])
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
        <div className="w-[170px]">{apyAndBoostDom}</div>
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
            <div className="flex items-center">
              {`CR < 130% ${
                isFXUSDPool ? 'fxUSD' : 'fETH'
              } will be used for rebalance`}
            </div>
            <div className="mt-[12px]">
              Projected APY: {apyDom}{' '}
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
                  <Button size="small" onClick={handleDeposit}>
                    Deposit
                  </Button>
                  <Button size="small" onClick={handleWithdraw} type="second">
                    Withdraw
                  </Button>
                  <Button
                    size="small"
                    disabled={!canClaim}
                    loading={claiming}
                    onClick={() => handleClaim()}
                  >
                    Claim
                  </Button>
                </div>
                {/* 
                <div className="flex gap-[32px]">
                  <Button
                    size="small"
                    onClick={handleLiquidatorWithBonus}
                    type="second"
                  >
                    Liquidator
                  </Button>
                </div>
                <Button
                  size="small"
                  loading={harvesting}
                  onClick={handleHarvest}
                  type="second"
                >
                  Harvest
                </Button> */}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {depositVisible && (
        <DepositModal
          info={_poolConfig}
          contractType={contractType}
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
