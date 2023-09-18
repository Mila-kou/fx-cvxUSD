import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Button from '@/components/Button'

import styles from './styles.module.scss'

export default function AggressModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    axios.get('https://api.ip.sb/geoip').then(({ data }) => {
      if (data.country_code === 'US') {
        setOpen(true)
      }
    })
  }, [])

  return (
    <div>
      {open ? (
        <div className={styles.modal}>
          <div className={styles.container}>
            <div className={styles.content}>
              <h2>Warning</h2>
              <p>
                Citizens or residents of OFAC-sanctioned countries or the U.S.
                are not permitted to use f(x) Protocol in any capacity. By
                clicking agree below you certify you are neither from an OFAC
                sanctioned country, nor a U.S citizen or resident.
              </p>

              <Button width="100%" onClick={() => setOpen(false)}>
                AGREE
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
