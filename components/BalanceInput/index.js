import React, { useEffect, useState, useCallback } from 'react'
import cn from 'classnames'
import styles from './styles.module.scss'
import { cBN, fb4 } from '@/utils/index'
import useGlobal from '@/hooks/useGlobal'

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
    selectColor,
    onChange = () => {},
    onSelected = () => {},
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
    <div className={cn(styles.inputContent, className)} data-color={color}>
      <div className={styles.left}>
        <img src={icon || '/tokens/crypto-icons-stack.svg#eth'} />
      </div>
      <div className={styles.symbolWrap}>
        <p className={styles.symbol}>
          {symbol} <span className={styles.tip}>{tip}</span>
        </p>
        <p className={styles.usd}>(~${usd})</p>
      </div>
      <div className={styles.right}>
        {type == 'select' ? (
          <div
            className={styles.select}
            onClick={onSelected}
            data-color={selectColor}
          >
            Select
          </div>
        ) : (
          <>
            {balance && (
              <p className={styles.balanceWrap}>
                Balance: {balance}
                <span className={styles.max} onClick={setMax}>
                  MAX
                </span>
              </p>
            )}
            <input
              onChange={handleInputChange}
              value={val}
              placeholder={placeholder}
              disabled={disabled}
            />
          </>
        )}
      </div>
    </div>
  )
}
export default BalanceInput
