import React, { useEffect, useState, useCallback } from 'react'
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

  return (
    <div
      className={cn(styles.inputContent, className)}
      data-color={color}
      onClick={type == 'select' ? onSelected : () => {}}
    >
      <div className={styles.left}>
        {symbol === 'fETH' && <FLogo />}
        {symbol === 'xETH' && <XLogo />}
        {['ETH', 'stETH'].includes(symbol) && (
          <img src="/tokens/crypto-icons-stack.svg#eth" />
        )}
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
        <p className={styles.usd}>(~{usd})</p>
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
