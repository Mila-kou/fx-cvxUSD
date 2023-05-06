import React, { useEffect, useMemo, useState } from 'react'
import styles from './styles.module.scss'
import useIDO from './controller/useIDO'

export default function IdoPage() {
  const PageData = useIDO()
  console.log(PageData)
  return (
    <div>
      f(x) Auction
      <br />
      {PageData.capAmount} f(x)
      <br />
      Auction Amount
      <br />
      {PageData.currentPrice} ETH
      <br />
      Initial Price
      <br />
      Total Funds Raised: {PageData.totalFundsRaised}ETH

      <br />
      {PageData.baseInfo?.timeObj.saleStatus}



      <br />
      <br />
      <br />
      myShares: {PageData.myShares}
    </div>
  )
}
