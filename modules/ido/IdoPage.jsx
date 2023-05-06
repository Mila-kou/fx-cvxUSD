import React, { useEffect, useMemo, useState } from 'react'
import styles from './styles.module.scss'
import useIDO from './controller/useIDO'

export default function IdoPage() {
  const PageDate = useIDO()
  return (
    <div>
      f(x) Auction
      <br />
      100,000 f(x)
      Auction Amount
      <br />
      0.01 ETH
      Initial Price

      Total Funds Raised: 3,000ETH
    </div>
  )
}
