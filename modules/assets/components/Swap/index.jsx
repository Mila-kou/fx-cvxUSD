import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useToggle, useSetState } from 'ahooks'
import { SettingOutlined } from '@ant-design/icons'
import styles from './styles.module.scss'
import Mint from '../Mint'
import Redeem from '../Redeem'
import FxUSDMint from '../FxUSDMint'
import FxUSDRedeem from '../FxUSDRedeem'
import MintX from '../MintX'
import RedeemX from '../RedeemX'
import MintF from '../MintF'
import RedeemF from '../RedeemF'
import SlippageModal, { useSlippage } from '../SlippageModal'
import useGlobal from '@/hooks/useGlobal'
import BindModal from '../../../account/components/BindModal'

// import Select from '@/components/Select'

// const ROUTES = [
//   { label: 'Converter', value: '' },
//   { label: '1inch', value: '1inch' },
// ]

const AUTO = 0.3

export default function Swap({ isValidPrice, assetInfo }) {
  const [tab, setTab] = useState(0)
  const [showBindModal, setShowBindModal] = useState(false)
  const { myInviter } = useGlobal()

  const slippageProps = useSlippage(AUTO)

  const [MintCmp, RedeemCmp] = useMemo(() => {
    if (['fETH', 'xETH'].includes(assetInfo.symbol)) {
      return [Mint, Redeem]
    }

    if (['fxUSD', 'rUSD', 'btcUSD'].includes(assetInfo.symbol)) {
      return [FxUSDMint, FxUSDRedeem]
    }

    if (['fCVX'].includes(assetInfo.symbol)) {
      return [MintF, RedeemF]
    }

    return [MintX, RedeemX]
  }, [assetInfo.symbol])

  const { slippage, toggle } = slippageProps

  return (
    <div className={styles.container}>
      <div
        className={styles.setting}
        onClick={toggle}
        data-auto={AUTO === slippage}
      >
        <span className={styles.custom}>{slippage}% slippage</span>
        <SettingOutlined />
      </div>
      <div className={styles.tabs}>
        {['Mint', 'Redeem'].map((item, index) => (
          <div
            key={item}
            className={styles.tab}
            data-active={tab === index}
            onClick={() => {
              setTab(index)
            }}
          >
            {item}
          </div>
        ))}
      </div>
      {!!(tab == 0) && (
        <MintCmp slippage={slippage} assetInfo={assetInfo}>
          {!myInviter && (
            <div className="flex gap-[6px] mb-[16px] text-[var(--yellow-color)] justify-between">
              Earn FX Points
              <p
                className="text-[var(--a-button-color)] cursor-pointer"
                onClick={() => setShowBindModal(true)}
              >
                Enter a Referral Code
              </p>
            </div>
          )}
        </MintCmp>
      )}
      {!!(tab == 1) && (
        <RedeemCmp
          slippage={slippage}
          isValidPrice={isValidPrice}
          assetInfo={assetInfo}
        />
      )}

      <SlippageModal {...slippageProps} />

      {showBindModal && <BindModal onCancel={() => setShowBindModal(false)} />}
    </div>
  )
}
