import React, { useEffect, useMemo, useState, useCallback } from 'react'
import cn from 'classnames'
import InputSelect from '@/components/InputSelect'
import styles from './styles.module.scss'
import { cBN, fb4 } from '@/utils/index'
import useGlobal from '@/hooks/useGlobal'
import FLogo from '../../public/images/f-s-logo.svg'
import XLogo from '../../public/images/x-s-logo.svg'

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
    withUsd = true,
    placeholder,
    clearTrigger,
    decimals,
    changeValue,
    maxAmount,
    className = '',
    icon,
    symbol,
    tip,
    disabled,
    type,
    color,
    rightSuffix,
    onChange = () => {},
    onSelected = () => {},
    options = [],
    onSymbolChanged = () => {},
  } = props
  const { theme } = useGlobal()

  const [val, setVal] = useState('')

  const handleInputChange = (e) => {
    let { value } = e.target

    const charReg = /[^\d.]/g

    if (charReg.test(value)) {
      value = value.replace(charReg, '')
    }

    setVal(value || '')
    onChange(cBN(value || '').shiftedBy(decimals ?? 18))
  }

  const setMax = () => {
    onChange(maxAmount)
    setVal(fb4(maxAmount, false, decimals ?? 18))
  }

  useEffect(() => {
    if (changeValue) {
      setVal(fb4(changeValue, false, decimals ?? 18))
      onChange(changeValue)
    }
  }, [changeValue])

  useEffect(() => {
    setVal('')
  }, [clearTrigger])

  const logoSrc = useMemo(() => {
    if (['fETH', 'xETH'].includes(symbol)) return ''
    if (['ETH', 'stETH'].includes(symbol))
      return '/tokens/crypto-icons-stack.svg#eth'
    return `/tokens/crypto-icons-stack.svg#${symbol.toLowerCase()}`
  }, [symbol])

  return (
    <div
      className={cn(styles.inputContent, className)}
      data-color={color}
      onClick={type == 'select' ? onSelected : () => {}}
    >
      <div className={styles.left}>
        {symbol === 'fETH' && <FLogo />}
        {symbol === 'xETH' && <XLogo />}
        {logoSrc && <img src={logoSrc} />}
      </div>
      <div className={styles.symbolWrap}>
        {options.length ? (
          <InputSelect
            value={symbol}
            style={{ minWidth: '130px', marginRight: '16px' }}
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
        {withUsd ? <p className={styles.usd}>(~{usd})</p> : null}
      </div>
      <div className={styles.right}>
        {type == 'select' ? null : (
          <>
            <input
              onChange={handleInputChange}
              value={val}
              placeholder={placeholder}
              disabled={disabled}
            />
            {balance && (
              <p className={styles.balanceWrap}>
                Balance: {balance}
                <span className={styles.max} onClick={setMax}>
                  MAX
                </span>
              </p>
            )}
            {rightSuffix ? (
              <p className={styles.balanceWrap}>{rightSuffix}</p>
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}
export default BalanceInput
