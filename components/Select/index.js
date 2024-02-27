import React, { useEffect, useState, useRef, useMemo } from 'react'
import cn from 'classnames'
import { useToggle, useClickAway } from 'ahooks'
import { DownOutlined, LoadingOutlined } from '@ant-design/icons'
import styles from './styles.module.scss'

function Select(props) {
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
        <p>
          {selected.label || (
            <p>
              <LoadingOutlined />{' '}
              <span className="text-[var(--second-text-color)]">
                Loading...
              </span>
            </p>
          )}
        </p>
        <DownOutlined />
      </div>
      {isOpen ? (
        <div className={styles.dropdown}>
          {options.map((item) => (
            <p
              className={cn(styles.item, item.value === value && styles.active)}
              onClick={() => handleClick(item.value)}
            >
              {item.label}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  )
}
export default Select
