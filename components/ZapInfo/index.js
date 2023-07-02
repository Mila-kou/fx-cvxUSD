import React from 'react'
import cn from 'classnames'
import { Info } from '@/components/Input'
import SlippageInfo from '@/components/SlippageInfo'
import styles from './styles.module.scss'

export default function ZapInfo({
  zapTitle,
  slippage,
  slippageChange,
  zapType,
  minAmount,
  isShowMinAmount = true,
  isLpMinAmount = false,
  tokenName,
  minLpAmountTvl,
}) {
  return (
    <div className={cn(styles.zapInfo, 'mb-1')}>
      {zapTitle && <div className="font-semibold mt-6">{zapTitle}</div>}
      {isShowMinAmount
        ? minAmount && (
            <Info
              name={`Minimum ${zapType}`}
              value={`${minAmount === 0 ? '-' : minAmount} ${
                isLpMinAmount
                  ? `${tokenName}  ${
                      minAmount === 0 ? '' : `~$${minLpAmountTvl}`
                    }`
                  : ''
              }`}
            />
          )
        : ''}
      {slippage && (
        <SlippageInfo slippage={slippage} slippageChange={slippageChange} />
      )}
    </div>
  )
}
