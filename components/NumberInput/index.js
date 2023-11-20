import React, { useEffect, useMemo, useState, useCallback } from 'react'
import cn from 'classnames'
import styles from './styles.module.scss'

export const useClearInput = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const clearInput = useCallback(() => {
    setRefreshTrigger((pre) => pre + 1)
  }, [setRefreshTrigger])

  return [refreshTrigger, clearInput]
}

function NumberInput(props) {
  const {
    placeholder = '',
    clearTrigger,
    changeValue,
    className = '',
    disabled,
    type,
    color,
    max,
    onChange = () => {},
    onSelected = () => {},
  } = props

  const [val, setVal] = useState('')

  const handleInputChange = (e) => {
    let { value } = e.target

    const charReg = /[^\d.]/g

    if (charReg.test(value)) {
      value = value.replace(charReg, '')
    }

    if (max) {
      value = Math.min(Number(value), max)
    }
    setVal(value || '')
    onChange(value || '')
  }

  useEffect(() => {
    if (changeValue) {
      setVal(changeValue)
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
      <div className={styles.right}>
        <input
          placeholder={placeholder}
          onChange={handleInputChange}
          value={val}
          disabled={disabled}
        />
      </div>
    </div>
  )
}
export default NumberInput
