import React, { useState } from 'react'
import cn from 'classnames'
import Lock from './components/Lock'
import LockerChart from './components/lockerChart'
import styles from './styles.module.scss'
import useInfo from './controllers/useInfo'

function LockerPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const pageData = useInfo(refreshTrigger)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>FXN Locker</h2>
        <div className={styles.items}>
          {pageData.dashboard.info.map((item) => (
            <div className={styles.item} key={item.title}>
              <p>{item.title}</p>
              <h2>{item.value}</h2>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.left}>
          <h2>veFXN Voting Power</h2>
          <LockerChart
            data={pageData.dashboard?.chart}
            contracts={pageData.contracts}
          />
        </div>
        <div className={styles.right}>
          <Lock data={pageData} actions={{ setRefreshTrigger }} />
        </div>
      </div>
    </div>
  )
}

export default LockerPage
