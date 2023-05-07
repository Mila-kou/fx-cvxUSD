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

function AcceleratorInput(props) {
  const {
    title,
    balance,
    available,
    placeholder,
    options,
    selectedToken,
    clearTrigger,
    decimals,
    selectedChange,
    changeValue,
    maxAmount,
    errMsg,
    moreInfo,
    onChange = () => {},
  } = props
  const [optionVisible, setOptionVisible] = useState(false)
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

  const handleSelectChange = (value) => {
    setVal('')
    onChange(0)
    selectedChange(value)
    setOptionVisible(false)
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
    <div className={cn(styles.inputWrapper, errMsg && styles.error)}>
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
        {options && (
          <>
            <div className={styles.selectBox}>
              <div
                className={cn(
                  styles.select,
                  'flex justify-between items-center'
                )}
                onClick={() => setOptionVisible((prev) => !prev)}
              >
                <div>{selectedToken}</div>
                <img
                  src={
                    theme === 'default'
                      ? '/assets/arrow-down-default.svg'
                      : '/assets/arrow-down-dark.svg'
                  }
                  className={cn('w-6', optionVisible && styles.reverse)}
                />
              </div>
              <div
                className={cn(styles.options, optionVisible && styles.visible)}
              >
                {options.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectChange(option)}
                    className={cn(
                      styles.option,
                      option === selectedToken && styles.active
                    )}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.divider} />
          </>
        )}
        <input
          onChange={handleInputChange}
          value={val}
          placeholder={placeholder}
        />

        <a className={styles.max} onClick={setMax}>
          MAX
        </a>
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
export default AcceleratorInput
