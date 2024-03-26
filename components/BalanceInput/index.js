import React, { useEffect, useMemo, useState, useCallback } from 'react'
import cn from 'classnames'
import { useDebounceEffect } from 'ahooks'
import { SyncOutlined } from '@ant-design/icons'
import InputSelect from '@/components/InputSelect'
import styles from './styles.module.scss'
import { cBN, fb4 } from '@/utils/index'
import { ASSET_MAP, TOKEN_ICON_MAP } from '@/config/tokens'

export const useClearInput = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const clearInput = useCallback(() => {
    setRefreshTrigger((pre) => pre + 1)
  }, [setRefreshTrigger])

  return [refreshTrigger, clearInput]
}

function BalanceInput(props) {
  const {
    balance,
    usd = '-',
    amountUSD,
    withUsd = true,
    placeholder,
    clearTrigger,
    decimals,
    changeValue,
    maxAmount,
    className = '',
    symbol = '',
    hideLogo,
    tip,
    disabled,
    type,
    color,
    rightSuffix,
    onChange = () => {},
    onSelected = () => {},
    options = [],
    onSymbolChanged = () => {},
    loading,
    showRetry,
    onRetry = () => {},
  } = props

  const [val, setVal] = useState('')

  useDebounceEffect(
    () => {
      onChange(cBN(val || '').shiftedBy(decimals ?? 18))
    },
    [val, decimals],
    {
      wait: 500,
    }
  )

  const handleInputChange = (e) => {
    let { value } = e.target

    const charReg = /[^\d.]/g

    if (charReg.test(value)) {
      value = value.replace(charReg, '')
    }

    setVal(value || '')
  }

  const setMax = () => {
    setVal(fb4(maxAmount, false, decimals ?? 18).replace(/,/g, ''))
  }

  useEffect(() => {
    if (changeValue) {
      setVal(fb4(changeValue, false, decimals ?? 18).replace(/,/g, ''))
    }
  }, [changeValue])

  useEffect(() => {
    setVal('')
  }, [clearTrigger])

  const logoSrc = useMemo(() => {
    if (['fETH', 'FXN', 'fCVX'].includes(symbol)) {
      return '/images/f-logo.svg'
    }
    if (['xETH', 'xstETH', 'xfrxETH', 'xeETH', 'xCVX'].includes(symbol)) {
      return '/images/x-logo.svg'
    }
    if (['fxUSD'].includes(symbol)) {
      return '/tokens/fxusd.svg'
    }
    if (symbol === 'crvUSD') {
      return '/tokens/crvUSD.png'
    }
    if (['stETH', 'wstETH'].includes(symbol)) {
      return '/tokens/steth.svg'
    }
    if (symbol === 'ETH') {
      return '/tokens/crypto-icons-stack.svg#eth'
    }
    if (symbol === 'rUSD') {
      return '/tokens/rUSD.svg'
    }
    if (symbol === 'frxETH') {
      return '/tokens/frxeth.svg'
    }
    if (symbol === 'sfrxETH') {
      return '/tokens/sfrxeth.svg'
    }
    if (['weETH', 'eETH'].includes(symbol)) {
      return '/tokens/eETH.svg'
    }
    if (['aCVX'].includes(symbol)) {
      return `/tokens/crypto-icons-stack.svg#cvx`
    }
    return `/tokens/crypto-icons-stack.svg#${symbol.toLowerCase()}`
  }, [symbol])

  const subIcon = useMemo(() => ASSET_MAP[symbol]?.subIcon, [symbol])

  return (
    <div
      className={cn(styles.inputContent, className)}
      data-color={color}
      onClick={type == 'select' ? onSelected : () => {}}
    >
      {hideLogo ? null : (
        <div className={styles.left}>
          {logoSrc && (
            <div className="relative">
              <img className="w-[30px]" src={logoSrc} />
              {subIcon && (
                <img
                  className="w-[18px] absolute right-[-3px] bottom-[-3px]"
                  src={subIcon}
                />
              )}
            </div>
          )}
        </div>
      )}
      <div className={styles.symbolWrap}>
        {options.length ? (
          <InputSelect
            value={symbol}
            style={{ width: '130px', marginRight: '16px' }}
            onChange={(v) => onSymbolChanged(v)}
            options={options.map((item) => ({
              value: item,
              label: item,
            }))}
          />
        ) : (
          <p className={styles.symbol}>
            {symbol} <span className={styles.tip}>{tip}</span>
          </p>
        )}
        {withUsd ? <p className={styles.usd}>(~{`$${usd || '-'}`})</p> : null}
      </div>
      <div className={styles.right}>
        {type == 'select' ? null : (
          <>
            {loading || showRetry ? (
              loading ? (
                <SyncOutlined spin />
              ) : (
                <span className="text-[16px] text-stone-300" onClick={onRetry}>
                  Retry
                </span>
              )
            ) : (
              <>
                <input
                  onChange={handleInputChange}
                  value={val}
                  placeholder={placeholder}
                  disabled={disabled}
                />
                {rightSuffix ? (
                  <p className={styles.balanceWrap}>{rightSuffix}</p>
                ) : null}
              </>
            )}
            {balance && (
              <p className={styles.balanceWrap}>
                Balance: {balance}
                <span className={styles.max} onClick={setMax}>
                  MAX
                </span>
              </p>
            )}
            {!balance && amountUSD && (
              <p className={styles.balanceWrap}>{amountUSD}</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
export default BalanceInput
