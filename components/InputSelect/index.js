import React, { useEffect, useState, useRef, useMemo } from 'react'
import cn from 'classnames'
import { useToggle, useClickAway } from 'ahooks'
import { DownOutlined } from '@ant-design/icons'
import styles from './styles.module.scss'
import { TOKEN_MAP } from '@/config/tokens'

function InputSelect(props) {
  const {
    className = '',
    options = [],
    value = '',
    onChange,
    disabled,
    ...other
  } = props

  const [isOpen, { toggle }] = useToggle()

  const ref = useRef(null)
  useClickAway(() => {
    if (isOpen) {
      toggle()
    }
  }, [ref])

  const handleOpen = () => {
    if (disabled) return
    toggle()
  }

  const selected = useMemo(
    () => options.find((item) => item.value === value) || {},
    [value, options]
  )

  const handleClick = (_v) => {
    toggle()
    if (_v === value) {
      return
    }
    onChange?.(_v)
  }

  return (
    <div className={cn(styles.container, className)} ref={ref} {...other}>
      <div className={styles.content} onClick={handleOpen}>
        <p>{selected.label || ''}</p>
        <DownOutlined />
      </div>
      {isOpen ? (
        <div className={styles.dropdown}>
          {options.map((item) => (
            <div className="flex gap-[10px] items-center py-[4px]">
              {TOKEN_MAP[item.icon || item.label] ? (
                <img
                  className="w-[20px] h-[20px]"
                  src={TOKEN_MAP[item.icon || item.label]}
                />
              ) : null}
              <p
                className={cn(
                  styles.item,
                  item.value === value && styles.active
                )}
                onClick={() => handleClick(item.value)}
              >
                {item.label}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
export default InputSelect
