import React, { useEffect, useState, useRef, useMemo } from 'react'
import cn from 'classnames'
import { useToggle, useClickAway } from 'ahooks'
import { DownOutlined } from '@ant-design/icons'
import styles from './styles.module.scss'

function Select(props) {
  const { className = '', label, options = [], value = '', ...other } = props

  const [isOpen, { toggle }] = useToggle()

  const ref = useRef(null)
  useClickAway(() => {
    if (isOpen) {
      toggle()
    }
  }, [ref])

  const handleOpen = () => {
    toggle()
  }

  const handleClick = (cb) => {
    toggle()
    cb?.()
  }

  return (
    <div className={cn(styles.container, className)} ref={ref} {...other}>
      <div className={styles.content} onClick={handleOpen}>
        <p>{label || ''}</p>
      </div>
      {isOpen ? (
        <div className={styles.dropdown}>
          {options.map((item) => (
            <p
              className={cn(styles.item, item.value === value && styles.active)}
              onClick={() => handleClick(item.onClick)}
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
