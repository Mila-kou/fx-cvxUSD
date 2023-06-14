import React from 'react'
import cn from 'classnames'
import { LoadingOutlined } from '@ant-design/icons'

import styles from './styles.module.scss'

export default function Button({
  width,
  onClick,
  loading,
  style,
  children,
  disabled,
  theme,
  size,
  type = 'default',
}) {
  const handClick = () => {
    if (!loading && !disabled && onClick) {
      onClick()
    }
  }

  return (
    <button
      className={cn(styles.btn, styles[theme], styles[size])}
      data-type={type}
      onClick={handClick}
      disabled={disabled || loading}
      style={{ width, ...style }}
    >
      {children} {loading ? <LoadingOutlined /> : null}
    </button>
  )
}
