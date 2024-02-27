import React, { useState } from 'react'
import styles from './styles.module.scss'

export default function SlippageInfo({ slippage, slippageChange }) {
  const [slippageEditable, setSlippageEditable] = useState(false)
  const [stagedSlippage, setStagedSlippage] = useState(0)
  const toggleSlippage = () => {
    if (slippageEditable) {
      slippageChange(stagedSlippage)
      setSlippageEditable(false)
    } else {
      setStagedSlippage(slippage)
      setSlippageEditable(true)
    }
  }

  const cancelEditSlippage = () => {
    setSlippageEditable(false)
  }

  const stagedSlippageChange = (num) => {
    if (num <= 50) {
      setStagedSlippage(num)
    }
  }

  return (
    <div className={styles.slippageInfo}>
      <span className="text-[var(--second-text-color)]">Slippage: </span>
      {slippageEditable ? (
        <span>
          <input
            value={stagedSlippage}
            type="text"
            className={styles.slippageInput}
            onChange={(e) => stagedSlippageChange(e.target.value)}
          />{' '}
          %
        </span>
      ) : (
        <span className="color-blue">{slippage} %</span>
      )}
      <a className="color-blue ml-2 underline" onClick={toggleSlippage}>
        {slippageEditable ? 'Confirm' : 'Edit'}
      </a>
      {slippageEditable && (
        <a className="color-blue ml-2" onClick={cancelEditSlippage}>
          Cancel
        </a>
      )}
    </div>
  )
}
