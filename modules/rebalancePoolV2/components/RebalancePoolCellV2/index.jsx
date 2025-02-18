import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Tooltip } from 'antd'
import Link from 'next/link'
import { InfoCircleOutlined } from '@ant-design/icons'
import Button from '@/components/Button'
import DepositModal from '../DepositModal'
import FETHWithdrawModal from '../WithdrawModal/fETH'
import FxUSDWithdrawModal from '../WithdrawModal/fxUSD'
import styles from './styles.module.scss'
import { cBN, checkNotZoroNum, checkNotZoroNumOption, fb4 } from '@/utils/index'
import { TOKEN_ICON_MAP, BASE_TOKENS_MAP, ASSET_MAP } from '@/config/tokens'
import { useFxUSD_Type_Treasury_contract } from '@/hooks/useFXUSDContract'
import { useContract } from '@/hooks/useContracts'
import noPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import abi from '@/config/abi'
import useWeb3 from '@/hooks/useWeb3'

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
  const { currentAccount, isAllReady, sendTransaction } = useWeb3()
  const [openPanel, setOpenPanel] = useState(false)
  const [harvesting, setHarvesting] = useState(false)
  const canClaim = checkNotZoroNum(userTotalClaimable)

  const { contract: treasuryContract } = useFxUSD_Type_Treasury_contract(
    _poolConfig.baseSymbol
  )
  const { getContract } = useContract()

  const rpGaugeClaimContract = getContract(
    _poolConfig.gaugeClaimer,
    abi.FX_RebalancePoolGaugeClaimerABI
  )

  const { rebalanceRewards, baseSymbol, poolType } = _poolConfig

  const handleHarvestType = useCallback(
    async (type) => {
      if (!isAllReady) return
      setHarvesting(true)
      try {
        let apiCall
        let to
        switch (type) {
          case 'LSDDOM':
          case 'LTRDOM':
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
        case 'LTRDOM':
          _text = 'Harvest LTR'
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

  const WithdrawModal = useMemo(
    () =>
      ['fxUSD', 'rUSD', 'btcUSD', 'cvxUSD'].includes(
        _poolConfig.withdrawDefaultToken
      )
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
        _apyList_current = [`FXN APR: ${userFxnCurrentApy_text} %`]
      } else {
        _apyAndBoostDom = `${minCurrentApy_text || '-'} % -> ${
          maxCurrentApy_text || '-'
        } %`
        _apyDom = _apyAndBoostDom
        _apyList = [
          // `APY: ${minApy_text} % -> ${maxApy_text} %`,
          `FXN APR: ${fxnApy_min_text} % -> ${fxnApy_max_text} %`,
        ]
        _apyList_current = [
          `FXN APR: ${fxnApy_current_min_text} % -> ${fxnApy_current_max_text} %`,
        ]
      }
      let _currentApy_text = rewardsData[baseSymbol].currentApy_text
      if (baseSymbol == 'WBTC') {
        const _currentApy = cBN(rewardsData[baseSymbol].currentApy).plus(
          rewardsData.aladdinWBTC.currentApy
        )
        _currentApy_text = checkNotZoroNumOption(
          _currentApy,
          `${fb4(_currentApy, false, 0, 2)} %`
        )
      }
      const baseText = `${baseSymbol} APR: ${_currentApy_text}`
      _apyList.push(baseText)
      _apyList_current.push(baseText)

      // if (checkNotZoroNum(minApy)) {
      _apyDetailDom = (
        <>
          <p>Current APR </p>{' '}
          {_apyList_current.map((apyText) => (
            <p className="text-[14px]">{apyText}</p>
          ))}
          <p style={{ marginTop: '15px' }}>Projected APR </p>{' '}
          {_apyList.map((apyText) => (
            <p className="text-[14px]">{apyText}</p>
          ))}
        </>
      )
      // }
      return [_apyAndBoostDom, _apyDom, _apyDetailDom]
    } catch (error) {
      return [_apyAndBoostDom, _apyDom, _apyDetailDom]
    }
  }, [poolData.apyObj, rebalanceRewards])

  const pointsText =
    _poolConfig.baseSymbol === 'ezETH'
      ? '~ 6x Renzo ezPoints'
      : '~ 6x ether.fi loyalty points'

  const subMessage = useMemo(() => {
    if (['fxUSD'].includes(poolType)) {
      return (
        <>
          {' '}
          then stake here to earn{' '}
          {/* <Tooltip
            placement="top"
            title={harvestTypeDom('LSDDOM')}
            arrow
            color="#000"
          >
            <span className="underline text-[var(--a-button-color)]">LSD</span>
          </Tooltip>{' '} */}
          LSD and{' '}
          {/* <Tooltip
            placement="top"
            title={harvestTypeDom('FXNDOM')}
            arrow
            color="#000"
          >
            <span className="underline text-[var(--a-button-color)]">FXN</span>
          </Tooltip>{' '} */}
          FXN rewards
        </>
      )
    }
    if (['btcUSD'].includes(poolType)) {
      return (
        <>
          {' '}
          then stake here to earn{' '}
          {/* <Tooltip
            placement="top"
            title={harvestTypeDom('LSDDOM')}
            arrow
            color="#000"
          >
            <span className="underline text-[var(--a-button-color)]">LSD</span>
          </Tooltip>{' '} */}
          WBTC and{' '}
          {/* <Tooltip
            placement="top"
            title={harvestTypeDom('FXNDOM')}
            arrow
            color="#000"
          >
            <span className="underline text-[var(--a-button-color)]">FXN</span>
          </Tooltip>{' '} */}
          FXN rewards
        </>
      )
    }
    if (poolType == 'rUSD') {
      return (
        <>
          {' '}
          then stake here to earn{' '}
          {/* <Tooltip
            placement="topLeft"
            title={harvestTypeDom('LTRDOM')}
            arrow
            color="#000"
          >
            <span className="underline text-[var(--a-button-color)]">LRT</span>
          </Tooltip>{' '} */}
          LRT yields, {pointsText}, ~ 2x EigenLayer Points and{' '}
          {/* <Tooltip
            placement="topLeft"
            title={harvestTypeDom('FXNDOM')}
            arrow
            color="#000"
          >
            <span className="underline text-[var(--a-button-color)]">FXN</span>
          </Tooltip>{' '} */}
          FXN rewards
        </>
      )
    }
  }, [poolType, harvestTypeDom])

  return (
    <div key={_poolConfig.infoKey} className={styles.poolWrap}>
      <div
        className={styles.card}
        style={{
          background: ['fxUSD', 'rUSD', 'btcUSD', 'cvxUSD'].includes(
            _poolConfig.poolType
          )
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
        <div className="w-[200px]">
          <div className="text-[16px] flex items-center">
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
          {poolType == 'rUSD' && (
            <p className="text-[14px] mt-[6px]">
              {pointsText}
              <br /> ~ 2x EigenLayer Points
            </p>
          )}
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
              , {subMessage}
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
