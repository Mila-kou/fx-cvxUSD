import React from 'react'
import cn from 'classnames'
import styles from './styles.module.scss'

export default function Modal(props) {
  const { children, onCancel, width, overflowVisible } = props
  return (
    <div className={styles.modalWrapper}>
      <div className={styles.modal} style={{ width }}>
        <span className={styles.close} onClick={onCancel}>
          <img src="/assets/close.svg" className="w-6 z-50" alt="close" />
        </span>
        <div
          className={cn(
            styles.modalContent,
            overflowVisible && styles.overflowVisible
          )}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
