import React from 'react'
import styles from './styles.module.scss'

export default function Tabs({
  selecedIndex = 0,
  tabs = ['fETH', 'xETH'],
  disabledIndexs = [],
  onChange,
}) {
  return (
    <div className={styles.tabs}>
      {tabs.map((item, index) => (
        <div
          className={styles.tab}
          data-active={selecedIndex === index}
          onClick={() => {
            if (disabledIndexs.includes(index)) return
            onChange(index)
          }}
        >
          {item}
        </div>
      ))}
    </div>
  )
}
