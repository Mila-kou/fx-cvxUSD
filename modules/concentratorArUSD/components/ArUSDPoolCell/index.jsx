import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Button from '@/components/Button'
import DepositModal from '../DepositModal'
import FxUSDWithdrawModal from '../WithdrawModal'
import styles from './styles.module.scss'
import { checkNotZoroNum, checkNotZoroNumOption } from '@/utils/index'
import useWeb3 from '@/hooks/useWeb3'

export default function ArUSDPoolCell({
  handleDeposit,
  handleWithdraw,

  depositVisible,
  setDepositVisible,
  withdrawVisible,
  setWithdrawVisible,

  poolConfig,
  userTotalBalance,
  baseInfo,
  ...poolData
}) {
  const { currentAccount, isAllReady, sendTransaction } = useWeb3()
  const [openPanel, setOpenPanel] = useState(false)

  const [apyAndBoostDom, apyDom, apyDetailDom] = useMemo(() => {
    const _apyAndBoostDom = checkNotZoroNumOption(
      poolData.apy,
      `${poolData.apy} %`
    )
    const _apyDom = poolData.apy
    const _apyDetailDom = poolData.apy
    return [_apyAndBoostDom, _apyDom, _apyDetailDom]
  }, [poolData])

  const CurrentIndexDom = useCallback(() => {
    return checkNotZoroNumOption(baseInfo.rate, baseInfo.rate)
  }, [baseInfo, currentAccount])

  return (
    <div key={poolConfig.infoKey} className={styles.poolWrap}>
      <div
        className={styles.card}
        style={{
          background: 'var(--deep-green-color)',
        }}
        onClick={() => setOpenPanel(!openPanel)}
      >
        <div className="flex w-[230px] gap-[16px] items-center">
          <div className="relative flex-shrink-0">
            <img className="w-[30px]" src={poolConfig.icon} />
            <img
              className="w-[18px] absolute right-[-8px] bottom-[-3px]"
              src={poolConfig.subIcon}
            />
          </div>
          <div>
            <p className="text-[16px] h-[16px]">{poolData.title}</p>
            <div className="text-[14px] mt-[6px] text-[var(--second-text-color)]">
              {poolData.subTitle}
            </div>
          </div>
        </div>
        <div className="w-[120px]">
          <p className="text-[16px]">{poolData.aumUsd}</p>
          <p className="text-[16px] mt-[6px] text-[var(--second-text-color)]">
            {poolData.aum} rUSD
          </p>
        </div>
        <div className="w-[200px] text-[16px]">
          <p className="text-[16px]">{apyAndBoostDom}</p>
          <p className="text-[14px] mt-[6px]">
            ~ 6x ether.fi loyalty points
            <br /> ~ 2x EigenLayer Points
          </p>
        </div>
        <div className="w-[110px] text-[16px]">
          <p className="text-[16px]">{CurrentIndexDom()}</p>
        </div>
        <div className="w-[100px]">
          <p className="text-[16px]">
            {userTotalBalance.wrapArUSDWalletBalanceTvl_text}
          </p>
          <p className="text-[16px] mt-[6px] text-[var(--second-text-color)]">
            {userTotalBalance.wrapArUSDWalletBalance_text}
          </p>
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
          <div className={styles.content}>
            <div className="flex items-center gap-[6px]">
              Concentrator{' '}
              <Link
                href="https://fx.convexfinance.com/stake/ethereum/19"
                target="_blank"
                className="text-[var(--blue-color)] underline"
              >
                arUSD
              </Link>{' '}
              is an auto-compounding asset, no need to claim frequently. Powered
              by{' '}
              <a
                href="https://concentrator.aladdin.club/vaults/"
                target="_blank"
                rel="noreferrer"
              >
                <img className="h-[30px]" src="/assets/concentrator-logo.svg" />
              </a>
            </div>
            <p className="my-[10px]">
              Earn up to ~ 6x ether.fi loyalty points and ~ 2x EigenLayer points
              by depositing rUSD.
            </p>
            <p>
              The underlying asset of arUSD is{' '}
              <Link
                href={`${poolConfig.underlyingTokenUrl}`}
                target="_blank"
                className="text-[var(--blue-color)] underline"
              >
                {poolConfig.underlyingToken}
              </Link>
            </p>
            {/* <div className="mt-[12px]">
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
            </div> */}
            <div className={`${styles.item} mt-[12px]`}>
              <div>
                {/* <div className="flex">
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
                </div> */}
              </div>
              <div>
                <div className="flex gap-[32px]">
                  <Button size="small" type="second" onClick={handleDeposit}>
                    Deposit
                  </Button>
                  <Button size="small" type="second" onClick={handleWithdraw}>
                    Withdraw
                  </Button>
                  {/* <Button
                    size="small"
                    type="red"
                    disabled={!canClaim}
                    loading={claiming}
                    onClick={() => handleClaim()}
                  >
                    Claim
                  </Button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {depositVisible && (
        <DepositModal
          info={poolConfig}
          poolData={{ ...poolData, baseInfo }}
          onCancel={() => setDepositVisible(false)}
        />
      )}
      {withdrawVisible && (
        <FxUSDWithdrawModal
          info={poolConfig}
          poolData={{ ...poolData, baseInfo }}
          onCancel={() => setWithdrawVisible(false)}
        />
      )}
    </div>
  )
}
