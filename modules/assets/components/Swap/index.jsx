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
import useETH from '../../controller/useETH'
import SlippageModal, { useSlippage } from '../SlippageModal'

// import Select from '@/components/Select'
// import useGlobal from '@/hooks/useGlobal'

// const ROUTES = [
//   { label: 'Converter', value: '' },
//   { label: '1inch', value: '1inch' },
// ]

const AUTO = 0.3

export default function Swap({ isValidPrice, assetInfo }) {
  const { systemStatus } = useETH()
  const [tab, setTab] = useState(0)
  // const { routeType, setRouteType } = useGlobal()

  const slippageProps = useSlippage(AUTO)

  const [MintCmp, RedeemCmp] = useMemo(() => {
    if (assetInfo.symbol === 'fxUSD') {
      return [FxUSDMint, FxUSDRedeem]
    }
    if (['xstETH', 'xfrxETH'].includes(assetInfo.symbol)) {
      return [MintX, RedeemX]
    }
    return [Mint, Redeem]
  }, [assetInfo.symbol])

  const { slippage, toggle } = slippageProps

  const tabs = useMemo(() => {
    const _tabs = ['Mint', 'Redeem']

    if (tab >= _tabs.length) setTab(0)
    return _tabs
  }, [systemStatus])

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
        {tabs.map((item, index) => (
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

      {/* <Select
        className="mt-[16px] h-[58px] w-[200px] mx-auto"
        style={{
          border: '1px solid #a6a6ae',
          borderRadius: '4px',
        }}
        options={ROUTES}
        value={routeType}
        onChange={setRouteType}
      /> */}
    </div>
  )
}
