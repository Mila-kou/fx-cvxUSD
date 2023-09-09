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
                Citizens or residents of OFAC-sanctionedcountries or the U.S.
                are not permitted touse Plutus in any capacity. By clickingagree
                below you certify you are neitherfrom an OFAC sanctioned
                country,nor a U.Scitizen or resident.
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
