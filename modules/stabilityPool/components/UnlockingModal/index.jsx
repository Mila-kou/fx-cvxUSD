import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Modal } from 'antd'
import styles from './styles.module.scss'

export default function UnlockingModal({ visible, toggle, list = [] }) {
  return (
    <Modal
      centered
      visible={visible}
      onCancel={toggle}
      footer={null}
      width={440}
    >
      <div className={styles.content}>
        <h2>Unlocking fETH</h2>
        <div className={styles.header}>
          <p>Amount</p>
          <p>Unlock Time</p>
        </div>
        {list.map((item, i) => (
          <div key={i} className={styles.items}>
            <p>{item.amount} fETH</p>
            <p>{item.unlockTime}</p>
          </div>
        ))}
      </div>
    </Modal>
  )
}
