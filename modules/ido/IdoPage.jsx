import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from 'antd'
import SimpleInput from '@/components/SimpleInput'
import styles from './styles.module.scss'
import useIDO from './controller/useIDO'
import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import { cBN, fb4 } from '@/utils/index'
import Countdown from './Countdown/index'
import { useToken } from '@/hooks/useTokenInfo'
import { tokensList } from '@/config/ido'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import { getGas } from '@/utils/gas'

const depositTokenInfo = tokensList.depositTokens[0]

export default function IdoPage() {
  const PageData = useIDO()
  const { _currentAccount } = useWeb3()
  const [claiming, setClaiming] = useState(false)
  const [slippage, setSlippage] = useState(0.3)
  const [depositAmount, setDepositAmount] = useState(0)
  const [minAmount, setMinAmount] = useState(0)
  const [buying, setBuying] = useState(false)

  const [clearInputTrigger, setClearInputTrigger] = useState(0)
  const { IdoSaleContract } = PageData
  const minGas = 527336

  const selectTokenInfo = useToken(depositTokenInfo.address, 'ido')
  // console.log('selectTokenInfo-----', selectTokenInfo)

  const canClaim = useMemo(
    () =>
      PageData.saleStatus === 3 &&
      PageData.myShares * 1 &&
      !PageData.userInfo?.isClaimed,
    [PageData]
  )

  const canPay = useMemo(
    () =>
      cBN(depositAmount).isGreaterThan(0) &&
      cBN(selectTokenInfo?.balance).isGreaterThanOrEqualTo(depositAmount) &&
      [2].includes(PageData.saleStatus) &&
      !cBN(PageData.baseInfo.capAmount).isEqualTo(
        PageData.baseInfo.totalSoldAmount
      ),
    [depositAmount, selectTokenInfo]
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
        }
      )
    } catch (error) {
      setClaiming(false)
      noPayableErrorAction(`error_earn_approve`, error)
    }
  }

  const getMinAmount = async () => {
    let _minOut = 0
    const getGasPrice = await getGas()
    const gasFee = cBN(minGas).times(1e9).times(getGasPrice).toFixed(0, 1)
    console.log('gasFee--', gasFee, getGasPrice)
    let payAmountInWei
    if (
      cBN(depositAmount).plus(gasFee).isGreaterThan(selectTokenInfo.balance)
    ) {
      payAmountInWei = cBN(selectTokenInfo.balance)
        .minus(gasFee)
        .toFixed(0, 1)
        .toString()
    } else {
      payAmountInWei = cBN(depositAmount || 0)
        // .shiftedBy(depositTokenInfo.decimals ?? 18)
        .toFixed(0, 1)
        .toString()
    }
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
    console.log('setMinAmount----', _minOut)
    setMinAmount(_minOut)
    return _minOut
  }

  const doPay = async () => {
    if (PageData.saleStatus == 1 && !PageData.userInfo?.isWhitelisted) {
      setErrMsg('!Account not eligible for invest')
      return
    }

    const getGasPrice = await getGas()
    const minOut = await getMinAmount()
    const gasFee = cBN(minGas).times(1e9).times(getGasPrice).toFixed(0, 1)
    console.log('gasFee--', gasFee, getGasPrice)
    let payAmountInWei
    if (
      cBN(depositAmount).plus(gasFee).isGreaterThan(selectTokenInfo.balance)
    ) {
      payAmountInWei = cBN(selectTokenInfo.balance)
        .minus(gasFee)
        .toFixed(0, 1)
        .toString()
    } else {
      payAmountInWei = cBN(depositAmount || 0)
        // .shiftedBy(depositTokenInfo.decimals ?? 18)
        .toFixed(0, 1)
        .toString()
    }

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
      setClearInputTrigger((prev) => prev + 1)
    } catch (error) {
      console.log(error)
      setBuying(false)
      noPayableErrorAction(`error_buy`, error)
    }
  }

  const updateSetPropsRefreshTrigger = useCallback(() => {
    console.log('conCompleted----')
  })

  useEffect(() => {
    try {
      getMinAmount()
    } catch (error) { }
  }, [depositAmount])

  const InitialRender = () => {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <p className={styles.title}>f(x) Auction</p>
          <div className={styles.num}>
            <Countdown
              endTime={PageData.countdown}
              onCompleted={updateSetPropsRefreshTrigger}
            />
          </div>
          <p className={styles.title}>{PageData.countdownTitle}</p>
          <p className={styles.num}>{PageData.capAmount} f(x)</p>
          <p className={styles.title}>Auction Amount</p>
          <p className={styles.title}>
            <span>{PageData.currentPrice} ETH</span>
            <br />
            Initial Price
          </p>
        </div>
      </div>
    )
  }

  const CompletedRender = () => {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <p className={styles.title}>f(x) Auction</p>
          <p className={styles.title}>Completed!</p>
          <p className={styles.num}>{PageData.capAmount} f(x)</p>
          <p className={styles.title}>Auction Amount</p>
          <div className={styles.bottomWrap}>
            <p className={styles.title}>
              Total Funds Raised: <span>{PageData.totalFundsRaised} ETH</span>
            </p>
          </div>
        </div>

        <div className={styles.card}>
          <p className={styles.title}>Invest</p>
          <div className={styles.bottomWrap}>
            <p className={styles.title}>
              myShares: <span>{PageData.myShares} f(x)ETH</span>
            </p>
            <p className={styles.title}>
              Claim opening at: <span>2023/5/25 20:00 UTC</span>
            </p>
          </div>
          <Button
            className={styles.buy}
            onClick={handleClaim}
            disabled={canClaim}
            loading={claiming}
          >
            Claim
          </Button>
        </div>
      </div>
    )
  }

  const hanldeAmountChanged = (v) => {
    setDepositAmount(v)
  }

  return (
    <>
      {!!([0, 1].indexOf(PageData.saleStatus) > -1 || !PageData.saleStatus) && <InitialRender />}
      {!!(PageData.saleStatus == 2) && (
        <div className={styles.container}>
          <div className={styles.card}>
            <p className={styles.title}>f(x) Auction</p>
            <div className={styles.num}>
              <Countdown
                endTime={PageData.countdown}
                onCompleted={updateSetPropsRefreshTrigger}
              />
            </div>
            <p className={styles.title}>{PageData.countdownTitle}</p>
            <p className={styles.num}>
              {PageData.totalSoldAmount}/{PageData.capAmount} f(x)
            </p>
            <p className={styles.title}>Remaining/Auction Amount</p>

            <div className={styles.bottomWrap}>
              <p className={styles.title}>
                Current Price: <span>{PageData.currentPrice} ETH</span>
              </p>
              <p className={styles.title}>
                Total Funds Raised: <span>{PageData.totalFundsRaised} ETH</span>
              </p>
            </div>
          </div>

          <div className={styles.card}>
            <p className={styles.title}>Invest</p>
            <SimpleInput
              placeholder=""
              hidePercent
              showMax
              symbol="ETH"
              maxAmount={selectTokenInfo?.balance}
              decimals={depositTokenInfo.decimals}
              onChange={hanldeAmountChanged}
              clearTrigger={clearInputTrigger}
              className={styles.input}
            />
            <p className={styles.forWrap}>
              For: <span>{fb4(minAmount)} f(x)</span>
            </p>

            <Button
              className={styles.buy}
              onClick={doPay}
              disabled={!canPay}
              loading={buying}
            >
              Purchase
            </Button>

            <div className={styles.bottomWrap}>
              <p className={styles.title}>
                myShares: <span>{PageData.myShares} f(x)</span>
              </p>
              <p className={styles.title}>
                Claim opening at: <span>2023/5/25 20:00 UTC</span>
              </p>
            </div>
          </div>
        </div>
      )}
      {!!(PageData.saleStatus == 3) && <CompletedRender />}
    </>
  )
}
