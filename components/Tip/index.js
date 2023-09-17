import React from 'react'
import useGlobal from '@/hooks/useGlobal'
import styles from './styles.module.scss'

export default function Tip({ title }) {
  const { handleTip } = useGlobal()

  const showTip = (e) => {
    handleTip({
      title,
      x: e.clientX,
      y: e.clientY,
    })
  }

  const hideTip = (e) => {
    if (e.relatedTarget.id === 'tipWrapper') {
      return
    }
    handleTip({
      title: '',
    })
  }

  return (
    <div className={styles.tip}>
      <img
        onMouseEnter={showTip}
        onMouseLeave={hideTip}
        src="/assets/tip.svg"
        className={styles.icon}
      />
    </div>
  )
}
