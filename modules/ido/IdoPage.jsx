import React, { useEffect, useMemo, useState } from 'react'
import styles from './styles.module.scss'
import useIDO from './controller/useIDO'
import useWeb3 from '@/hooks/useWeb3'
import { Button } from 'antd'
import config from '@/config/index'
import { cBN } from '@/utils/index'

export default function IdoPage() {
  const PageData = useIDO()
  const { _currentAccount } = useWeb3()
  const [claiming, setClaiming] = useState(false)
  const [auctionAmount, setAuctionAmount] = useState("");
  const [slippage, setSlippage] = useState(3);
  console.log(PageData)
  const auctionTokenInfo = {
    decimals: 18,
    address: config.zeroAddress
  }

  const canClaim = useMemo(() => {
    PageData.saleStatus === 3 && (PageData.myShares * 1) && (!PageData.userInfo?.isClaimed)
  }, [PageData])

  const canPay = cBN(auctionAmount).isGreaterThan(0)
    && cBN(balance).isGreaterThanOrEqualTo(cBN(auctionAmount).shiftedBy(auctionTokenInfo.decimals))
    && [2].includes(PageData.saleStatus)
    && !cBN(PageData.baseInfo.capAmount).isEqualTo(PageData.baseInfo.totalSoldAmount)

  const handleClaim = async () => {
    const { IdoSaleContract } = PageData
    try {
      setClaiming(true)
      const apiCall = IdoSaleContract.methods.claim()
      const estimatedGas = await apiCall.estimateGas({ from: _currentAccount })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(
        () => apiCall.send({ from: _currentAccount, gas }),
        {
          key: 'Claim',
          action: 'Claim',
        }, () => {
          setClaiming(false)
          refresh()
        }
      )

    } catch (error) {
      setClaiming(false)
      noPayableErrorAction(`error_earn_approve`, error)
    }
  }

  const getMinAmount = async () => {
    let _minOut = 0
    const payAmountInWei = cBN(auctionAmount || 0).shiftedBy(auctionTokenInfo.decimals).toFixed(0, 1).toString()
    if (canPay && !cBN(payAmountInWei).isZero()) {
      const shares = await IdoSaleContract.methods
        .buy(auctionTokenInfo.address, payAmountInWei, 0)
        .call({ from: _currentAccount, value: config.zeroAddress == auctionTokenInfo.address ? payAmountInWei : 0 })
      const _slippage = slippage
      _minOut = (cBN(shares) || cBN(0)).multipliedBy(cBN(1).minus(cBN(_slippage).dividedBy(100))).toFixed(0)
    }
    setMinAmount(_minOut)
    return _minOut
  }
  const doPay = async () => {
    if (PageData.saleStatus == 1 && !PageData.userInfo?.isWhitelisted) {
      setErrMsg("!Account not eligible for invest");
      return
    }

    const minOut = await getMinAmount()

    const payAmountInWei = cBN(auctionAmount || 0).shiftedBy(auctionTokenInfo.decimals).toFixed(0, 1).toString()

    try {
      setBuying(true)
      const apiCall = IdoSaleContract.methods.buy(auctionTokenInfo.address, payAmountInWei, isETH ? 0 : minOut)
      const callValue = config.zeroAddress == auctionTokenInfo.address ? payAmountInWei : 0
      const estimatedGas = await apiCall.estimateGas({ from: _currentAccount, value: callValue })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0

      await NoPayableAction(() => apiCall.send({ from: _currentAccount, gas, value: callValue }), {
        key: 'ido',
        action: 'buy',
      })
      setAuctionAmount('')
      setBuying(false)
      setRefreshTrigger(prev => prev + 1)
    } catch (error) {
      console.log(error)
      setBuying(false)
      noPayableErrorAction(`error_buy`, error)
    }
  };

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
      {PageData.saleStatus}



      <br />
      <br />
      <br />
      myShares: {PageData.myShares}
      <Button onClick={doPay}>Buy</Button>
      <Button onClick={handleClaim}>Claim</Button>
    </div>
  )
}
