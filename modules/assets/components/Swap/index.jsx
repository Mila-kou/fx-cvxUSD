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

// import Select from '@/components/Select'
// import useGlobal from '@/hooks/useGlobal'

// const ROUTES = [
//   { label: 'Converter', value: '' },
//   { label: '1inch', value: '1inch' },
// ]

const AUTO = 0.3

export default function Swap({ isValidPrice, assetInfo }) {
  const [tab, setTab] = useState(0)

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
      {!!(tab == 0) && <MintCmp slippage={slippage} assetInfo={assetInfo} />}
      {!!(tab == 1) && (
        <RedeemCmp
          slippage={slippage}
          isValidPrice={isValidPrice}
          assetInfo={assetInfo}
        />
      )}

      <SlippageModal {...slippageProps} />
    </div>
  )
}
