import React, { useEffect, useState, useCallback } from 'react'
import cn from 'classnames'
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons'
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

  // const setMax = () => {
  //   onChange(maxAmount)
  //   setVal(fb4(maxAmount, false, decimals ?? 18))
  // }

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
      {(balance || available) && (
        <div className={styles.header}>
          {balance && (
            <div>
              Balance: <span>{balance}</span>
            </div>
          )}
          {available && (
            <div>
              Available: <span>{available}</span>
            </div>
          )}
        </div>
      )}

      <div className={styles.inputContent}>
        {options && (
          <>
            <div className={styles.selectBox}>
              <div
                className={styles.select}
                onClick={() => setOptionVisible((prev) => !prev)}
              >
                <div>{selectedToken}</div>
                {optionVisible ? <CaretUpOutlined /> : <CaretDownOutlined />}
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

        {/* <a className={styles.max} onClick={setMax}>
          MAX
        </a> */}
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
