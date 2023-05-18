import React, { useEffect, useState, useCallback } from 'react'
import cn from 'classnames'
import styles from './styles.module.scss'
import { cBN, checkNotZoroNum, fb4 } from '@/utils/index'
import useGlobal from '@/hooks/useGlobal'

export const useClearInput = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const clearInput = useCallback(() => {
    setRefreshTrigger((pre) => pre + 1)
  }, [setRefreshTrigger])

  return [refreshTrigger, clearInput]
}

function SimpleInput(props) {
  const {
    title,
    balance,
    available,
    placeholder,
    clearTrigger,
    decimals,
    changeValue,
    maxAmount,
    errMsg,
    symbol,
    moreInfo,
    className = '',
    onChange = () => { },
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
    onChange(checkNotZoroNum(value) ? cBN(value).shiftedBy(decimals ?? 18).toString(10) : '')
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
    <div className={cn(styles.inputWrapper, errMsg && styles.error, className)}>
      {(title || balance || available) && (
        <div className="flex items-center justify-between mb-2 color-white">
          {title && <div className="">{title}</div>}
          {balance && (
            <div>
              Balance: <span className="color-blue">{balance}</span>
            </div>
          )}
          {available && (
            <div>
              Available: <span className="color-blue">{available}</span>
            </div>
          )}
        </div>
      )}

      <div className={styles.inputContent}>
        {symbol ? <div className={styles.symbol}>{symbol}</div> : null}
        <input
          onChange={handleInputChange}
          value={val}
          placeholder={placeholder}
        />

        <div className={styles.max} onClick={setMax}>
          MAX
        </div>
      </div>

      {errMsg && <div className={styles.errMsg}>{errMsg}</div>}

      {moreInfo && (
        <div className={styles.inputBottom}>
          {moreInfo.map((item, index) => (
            <div key={index} className={styles.moreInfoItem}>
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
export default SimpleInput
