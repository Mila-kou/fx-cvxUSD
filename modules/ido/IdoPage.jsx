import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from 'antd'
import Input from '@/components/AcceleratorInput'
import styles from './styles.module.scss'
import useIDO from './controller/useIDO'
import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import { cBN } from '@/utils/index'
import Countdown from './Countdown/index'
import { useToken } from '@/hooks/useTokenInfo'
import { tokensList } from '@/config/ido'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'

export default function IdoPage() {
  const PageData = useIDO()
  const { _currentAccount } = useWeb3()
  const [claiming, setClaiming] = useState(false)
  const [slippage, setSlippage] = useState(0.3)
  const [depositAmount, setDepositAmount] = useState('')
  const [inputVal, setInputVal] = useState('')
  const [minAmount, setMinAmount] = useState(0)
  const [buying, setBuying] = useState(false)

  const [clearInputTrigger, setClearInputTrigger] = useState(0)
  const [selectedToken, setSelectedToken] = useState('')
  console.log('tokensList----', tokensList)
  const { IdoSaleContract } = PageData

  const [depositTokenInfo, setDepositTokenInfo] = useState(
    tokensList.depositTokens[0]
  )

  const selectTokenInfo = useToken(depositTokenInfo.address, 'ido')
  console.log('selectTokenInfo-----', selectTokenInfo)

  const auctionTokenInfo = {
    decimals: 18,
    address: config.zeroAddress,
  }

  const isShowBuy = useMemo(() => {
    if ([2].indexOf(PageData.saleStatus * 1) > -1) {
      return true;
    }
    return true
  }, [PageData])

  const canClaim = useMemo(() => {
    PageData.saleStatus === 3 &&
      PageData.myShares * 1 &&
      !PageData.userInfo?.isClaimed
  }, [PageData])


  const canPay =
    cBN(depositAmount).isGreaterThan(0) &&
    cBN(selectTokenInfo?.balance).isGreaterThanOrEqualTo(depositAmount) &&
    [2].includes(PageData.saleStatus) &&
    !cBN(PageData.baseInfo.capAmount).isEqualTo(
      PageData.baseInfo.totalSoldAmount
    )

  const handleClaim = async () => {
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
        },
        () => {
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
    const payAmountInWei = cBN(depositAmount || 0)
      .toFixed(0, 1)
      .toString()
    if (canPay && !cBN(payAmountInWei).isZero()) {
      const shares = await IdoSaleContract.methods
        .buy(depositTokenInfo.address, payAmountInWei, 0)
        .call({
          from: _currentAccount,
          value:
            config.zeroAddress == depositTokenInfo.address ? payAmountInWei : 0,
        })
      const _slippage = slippage
      _minOut = (cBN(shares) || cBN(0))
        .multipliedBy(cBN(1).minus(cBN(_slippage).dividedBy(100)))
        .toFixed(0, 1)
    }
    setMinAmount(_minOut)
    return _minOut
  }

  const doPay = async () => {
    if (PageData.saleStatus == 1 && !PageData.userInfo?.isWhitelisted) {
      setErrMsg('!Account not eligible for invest')
      return
    }

    const minOut = await getMinAmount()

    const payAmountInWei = cBN(depositAmount || 0)
      .shiftedBy(depositTokenInfo.decimals ?? 18)
      .toFixed(0, 1)
      .toString()

    try {
      setBuying(true)
      const apiCall = IdoSaleContract.methods.buy(
        depositTokenInfo.address,
        payAmountInWei,
        0
      )
      const callValue =
        config.zeroAddress == depositTokenInfo.address ? payAmountInWei : 0
      const estimatedGas = await apiCall.estimateGas({
        from: _currentAccount,
        value: callValue,
      })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0

      await NoPayableAction(
        () => apiCall.send({ from: _currentAccount, gas, value: callValue }),
        {
          key: 'ido',
          action: 'buy',
        }
      )
      setDepositAmount('')
      setBuying(false)
      setRefreshTrigger((prev) => prev + 1)
    } catch (error) {
      console.log(error)
      setBuying(false)
      noPayableErrorAction(`error_buy`, error)
    }
  }

  const handleChange = (e) => {
    let { value } = e.target

    const charReg = /[^\d.]/g

    if (charReg.test(value)) {
      value = value.replace(charReg, '')
    }

    setInputVal(value || '')
  }

  const updateSetPropsRefreshTrigger = useCallback(() => {
    console.log("conCompleted----")
  })

  useEffect(() => {
    try {
      const _tokenInfo =
        tokensList.depositTokens.find((i) => i.symbol == selectedToken) ||
        tokensList.depositTokens[0]
      setSelectedToken(_tokenInfo.symbol)
      setDepositTokenInfo(_tokenInfo)
    } catch (error) { }
  }, [selectedToken, tokensList.depositTokens])
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <p className={styles.title}>f(x) Auction</p>
        <div className={styles.num}><Countdown endTime={PageData.countdown} onCompleted={updateSetPropsRefreshTrigger} /></div>
        <p className={styles.title}>{PageData.countdownTitle}</p>
        <p className={styles.num}>{PageData.capAmount} f(x)</p>
        <p className={styles.title}>Auction Amount</p>
        <div className={styles.bottomWrap}>
          <p className={styles.title}>
            Initial Price: <span>{PageData.currentPrice} ETH</span>
          </p>
          <p className={styles.title}>
            Total Funds Raised: <span>{PageData.totalFundsRaised} ETH</span>
          </p>
        </div>
      </div>
      {isShowBuy &&
        <div className={styles.card}>
          <p className={styles.title}>Invest</p>
          <div className={styles.inputWrap}>
            <div>ETH</div>
            <Input
              placeholder=""
              hidePercent
              showMax
              options={tokensList.depositTokens.map((i) => i.symbol)}
              maxAmount={selectTokenInfo?.balance}
              decimals={depositTokenInfo.decimals}
              selectedChange={(token) => setSelectedToken(token)}
              selectedToken={selectedToken}
              clearTrigger={clearInputTrigger}
              onChange={setDepositAmount}
            />
            {/* <Input
              value={inputVal}
              className={styles.input}
              bordered={false}
              onChange={handleChange}

            /> */}
          </div>

          {PageData.saleStatus}

          <Button onClick={doPay}>Buy</Button>
          <Button onClick={handleClaim}>Claim</Button>
          <div className={styles.bottomWrap}>
            <p className={styles.title}>
              myShares: <span>{PageData.myShares}</span>
            </p>
            <p className={styles.title}>
              Claim opening at: <span>2023/5/25 20:00 UTC</span>
            </p>
          </div>
        </div>
      }
    </div>
  )
}
