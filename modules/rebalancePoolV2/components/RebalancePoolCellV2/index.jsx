import React, { useEffect, useMemo, useState } from 'react'
import { Tooltip } from 'antd'
import Link from 'next/link'
import { InfoCircleOutlined } from '@ant-design/icons'
import Button from '@/components/Button'
import DepositModal from '../DepositModal'
import FETHWithdrawModal from '../WithdrawModal/fETH'
import FxUSDWithdrawModal from '../WithdrawModal/fxUSD'
import styles from './styles.module.scss'
import { checkNotZoroNum } from '@/utils/index'
import { TOKEN_ICON_MAP, BASE_TOKENS_MAP, ASSET_MAP } from '@/config/tokens'

export default function RebalancePoolCellV2({
  handleDeposit,
  handleWithdraw,
  canUnlock,
  handleUnlock,
  claiming,
  handleClaim,

  claimableData,

  boostableRebalancePoolInfo,
  userDeposit,
  userDepositTvl_text,

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

  _poolConfig,
  ...poolData
}) {
  const [openPanel, setOpenPanel] = useState(false)

  const canClaim = checkNotZoroNum(userTotalClaimable)

  const { rebalanceRewards, baseSymbol } = _poolConfig

  const WithdrawModal = useMemo(
    () =>
      ['fxUSD', 'rUSD'].includes(_poolConfig.withdrawDefaultToken)
        ? FxUSDWithdrawModal
        : FETHWithdrawModal,
    [_poolConfig, FxUSDWithdrawModal, FETHWithdrawModal]
  )

  const getIcon = (symbol) => {
    if (ASSET_MAP[symbol]) {
      const { icon, subIcon } = ASSET_MAP[symbol]
      return (
        <div className="relative">
          <img className="w-[20px]" src={icon} />
          <img
            className="w-[12px] absolute right-[-4px] bottom-[2px]"
            src={subIcon}
          />
        </div>
      )
    }
    return <img className="h-[20px] w-[20px]" src={TOKEN_ICON_MAP[symbol]} />
  }

  const [apyAndBoostDom, apyDom, apyDetailDom] = useMemo(() => {
    let _apyAndBoostDom = '-'
    let _apyDom = '-'
    let _apyDetailDom = '-'
    try {
      const {
        rewardsData,
        boostLever_text,
        fxnApy_min_text,
        fxnApy_current_min_text,
        fxnApy_max_text,
        fxnApy_current_max_text,
        userApy,
        userFxnApy_text,
        userFxnCurrentApy_text,
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
            <p className="text-[16px]">{userCurrentApy_text} %</p>
            <p className="text-[16px]">Boost: {boostLever_text}x</p>
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

      const baseText = `${baseSymbol} APR: ${rewardsData[baseSymbol].currentApy_text}`
      _apyList.push(baseText)
      _apyList_current.push(baseText)

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
  }, [poolData.apyObj, rebalanceRewards])

  return (
    <div key={_poolConfig.infoKey} className={styles.poolWrap}>
      <div
        className={styles.card}
        style={{
          background: ['fxUSD', 'rUSD'].includes(_poolConfig.poolType)
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
        <div className="w-[200px] text-[16px] flex items-center">
          <div className="text-[16px]">{apyAndBoostDom}</div>
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
              with{' '}
              {BASE_TOKENS_MAP[_poolConfig.baseSymbol]?.baseName || 'stETH'},
              then stake here to earn LSD and FXN rewards
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
                  Earn:
                  <div className="flex gap-[32px] ml-[8px]">
                    {rebalanceRewards.map((item) => (
                      <div className="flex gap-[16px] py-[2px]">
                        {getIcon(item)}
                        <p className="text-[16px]">
                          {claimableData?.[item]?.claimable_text || '-'}
                        </p>
                      </div>
                    ))}
                  </div>
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
