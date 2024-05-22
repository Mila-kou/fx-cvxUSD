import React from 'react'
import { getTokenIcon } from '@/config/tokens'
import styles from './styles.module.scss'

export default function PointsPerToken() {
  return (
    <div>
      <div className="flex justify-between mt-[10px]">
        <div className={styles.imgCell}>
          <div>
            {['fxUSD', 'rUSD', 'fETH'].map((icon) => (
              <img src={getTokenIcon(icon)} />
            ))}
          </div>
          <p>Mint Fractional Token</p>
        </div>
        <p>
          <span className="text-[var(--yellow-color)] ">1x Points</span> per
          Token
        </p>
      </div>
      <div className="flex justify-between mt-[10px]">
        <div className={styles.imgCell}>
          <div>
            {['xETH'].map((icon) => (
              <img src={getTokenIcon(icon)} />
            ))}
          </div>
          <p>Mint Leveraged Token</p>
        </div>
        <p>
          <span className="text-[var(--yellow-color)] ">2x Points</span> per
          Token
        </p>
      </div>
    </div>
  )
}
