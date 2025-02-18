import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from 'antd'
import { useSelector } from 'react-redux'
import SimpleInput from '@/components/SimpleInput'
import styles from './styles.module.scss'
import useIDO from './controller/useIDO'
import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import { cBN, checkNotZoroNum, fb4 } from '@/utils/index'
import Countdown from './Countdown/index'
import { useToken } from '@/hooks/useTokenInfo'
import { tokensList } from '@/config/ido'
import noPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import { getGas } from '@/utils/gas'

const depositTokenInfo = tokensList.depositTokens[0]

export default function IdoPage() {
  const PageData = useIDO()
  console.log('PageData---', PageData)
  const { _currentAccount, sendTransaction } = useWeb3()
  const [claiming, setClaiming] = useState(false)
  const [slippage, setSlippage] = useState(0)
  const [depositAmount, setDepositAmount] = useState(0)
  const [minAmount, setMinAmount] = useState(0)
  const [buying, setBuying] = useState(false)
  const { tokens } = useSelector((state) => state.token)

  const [clearInputTrigger, setClearInputTrigger] = useState(0)
  const { IdoSaleContract } = PageData
  const minGas = 527336 * 1

  const selectTokenInfo = useToken(depositTokenInfo.address, 'ido')

  const _currentTime = Math.floor(+new Date() / 1000)
  const newStatus = useMemo(() => {
    let _newStatus = PageData.saleStatus
    return _newStatus
  }, [PageData, _currentTime])

  const isWhiteListSoldEndSale = useMemo(() => {
    // if (
    //   [1, 2].indexOf(newStatus) > -1 &&
    //   cBN(PageData.baseInfo.capAmount).isLessThanOrEqualTo(
    //     PageData.baseInfo.totalSoldAmount
    //   )
    // ) {
    //   return true
    // }
    return false
  }, [PageData])

  const isEndSale = useMemo(() => {
    if (
      (newStatus >= 1 &&
        cBN(PageData.baseInfo.capAmount).isLessThanOrEqualTo(
          PageData.baseInfo.totalSoldAmount
        )) ||
      newStatus == 3
    ) {
      return true
    }
    return false
  }, [PageData])
  const isEndSaleAndFail = useMemo(() => {
    if (
      newStatus == 3 &&
      cBN(PageData.baseInfo.totalSoldAmount).isLessThanOrEqualTo(
        PageData.baseInfo.capAmount
      )
    ) {
      return true
    }
    return false
  }, [PageData])
  // console.log('PageData.baseInfo.saleTime---', PageData.baseInfo.saleTime)

  const canClaim = useMemo(() => {
    return (
      newStatus == 3 &&
      PageData.userInfo.myShares * 1 &&
      !PageData.userInfo?.isClaimed
    )
  }, [PageData])
  console.log(
    'newStatus-',
    newStatus,
    PageData.userInfo.myShares,
    PageData.userInfo?.isClaimed,
    canClaim
  )

  const canPay = useMemo(
    () =>
      cBN(depositAmount).isGreaterThan(0) &&
      cBN(selectTokenInfo?.balance).isGreaterThanOrEqualTo(depositAmount) &&
      [1, 2].includes(newStatus) &&
      cBN(PageData.baseInfo.totalSoldAmount).isLessThan(
        PageData.baseInfo.capAmount
      ),
    [depositAmount, selectTokenInfo]
  )

  const handleClaim = async () => {
    try {
      setClaiming(true)
      const apiCall = IdoSaleContract.methods.claim()
      await noPayableAction(
        () =>
          sendTransaction({
            to: IdoSaleContract._address,
            data: apiCall.encodeABI(),
          }),
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
    let payAmountInWei = cBN(depositAmount || 0)
      // .shiftedBy(depositTokenInfo.decimals ?? 18)
      .toFixed(0, 1)
      .toString()
    // if (
    //   cBN(depositAmount).plus(gasFee).isGreaterThan(selectTokenInfo.balance)
    // ) {
    //   payAmountInWei = cBN(selectTokenInfo.balance)
    //     .minus(gasFee)
    //     .toFixed(0, 1)
    //     .toString()
    // } else {
    //   payAmountInWei = cBN(depositAmount || 0)
    //     // .shiftedBy(depositTokenInfo.decimals ?? 18)
    //     .toFixed(0, 1)
    //     .toString()
    // }
    try {
      if (canPay && !cBN(payAmountInWei).isZero()) {
        const shares = await IdoSaleContract.methods
          .buy(depositTokenInfo.address, payAmountInWei, 0)
          .call({
            from: _currentAccount,
            value:
              config.zeroAddress == depositTokenInfo.address
                ? payAmountInWei
                : 0,
          })
        const _slippage = slippage
        _minOut = (cBN(shares) || cBN(0))
          .multipliedBy(cBN(1).minus(cBN(_slippage).dividedBy(100)))
          .toFixed(0, 1)
      }
      console.log('setMinAmount----', _minOut)
      setMinAmount(_minOut)
      return _minOut
    } catch (error) {
      if (error.message.indexOf('no cap to buy') > -1) {
        noPayableErrorAction(`error_buy`, 'No cap to buy')
      }
      return
    }
  }

  const doPay = async () => {
    if (newStatus == 1 && !PageData.userInfo?.isWhitelisted) {
      noPayableErrorAction(`error_buy`, 'No cap to buy')
      return
    }

    const getGasPrice = await getGas()
    const minOut = await getMinAmount()
    const gasFee = cBN(minGas).times(1e9).times(getGasPrice).toFixed(0, 1)
    console.log('gasFee--', gasFee, getGasPrice)
    let payAmountInWei = cBN(depositAmount || 0)
      // .shiftedBy(depositTokenInfo.decimals ?? 18)
      .toFixed(0, 1)
      .toString()
    // if (
    //   cBN(depositAmount).plus(gasFee).isGreaterThan(selectTokenInfo.balance)
    // ) {
    //   payAmountInWei = cBN(selectTokenInfo.balance)
    //     .minus(gasFee)
    //     .toFixed(0, 1)
    //     .toString()
    // } else {
    //   payAmountInWei = cBN(depositAmount || 0)
    //     // .shiftedBy(depositTokenInfo.decimals ?? 18)
    //     .toFixed(0, 1)
    //     .toString()
    // }

    try {
      setBuying(true)
      const apiCall = IdoSaleContract.methods.buy(
        depositTokenInfo.address,
        payAmountInWei,
        0
      )
      const callValue =
        config.zeroAddress == depositTokenInfo.address ? payAmountInWei : 0

      await noPayableAction(
        () =>
          sendTransaction({
            to: IdoSaleContract._address,
            value: callValue,
            data: apiCall.encodeABI(),
          }),
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
    } catch (error) {}
  }, [depositAmount])

  const hanldeAmountChanged = (v) => {
    setDepositAmount(v)
  }

  return (
    <>
      {!isEndSale && !isWhiteListSoldEndSale && newStatus * 1 >= 0 && (
        <div className={styles.container}>
          {[0].includes(newStatus) && (
            <div className={styles.card}>
              <p className={styles.title}>FX AladdinDAO Offering Round 2</p>

              <p className={styles.num}>{PageData.capAmount} FX</p>
              <p className={styles.title}>Offering Amount</p>

              <div className={styles.num}>
                <Countdown
                  endTime={PageData.countdown}
                  onCompleted={updateSetPropsRefreshTrigger}
                />
              </div>
              <p className={styles.title}>{PageData.countdownTitle}</p>

              <p className={styles.num}>{PageData.currentPrice} ETH</p>
              <p className={styles.title}>Price</p>
            </div>
          )}
          {[1, 2].includes(newStatus) && (
            <div className={styles.card}>
              <p className={styles.title}>
                FX {newStatus == 1 ? 'AladdinDAO' : 'Public'} Offering
              </p>

              <p className={styles.num}>
                {PageData.totalSoldAmount} / {PageData.capAmount}
              </p>
              <p className={styles.title}>Sold / Offering Amount</p>

              <div className={styles.num}>
                <Countdown
                  endTime={PageData.countdown}
                  onCompleted={updateSetPropsRefreshTrigger}
                />
              </div>
              <p className={styles.title}>{PageData.countdownTitle}</p>

              <div className={styles.bottomWrap}>
                <p className={styles.title}>
                  Price: <span>{PageData.currentPrice} ETH Per FX</span>
                </p>
                <p className={styles.title}>
                  Raised: <span>{PageData.totalFundsRaised} ETH</span>
                </p>

                {[1].includes(newStatus) && (
                  <p className={styles.tip}>
                    🔥 Holders of 10,000 $ALD or $xALD
                  </p>
                )}
              </div>
            </div>
          )}

          <div className={styles.card}>
            <p className={styles.title}>Invest</p>

            <SimpleInput
              placeholder=""
              hidePercent
              symbol="ETH"
              maxAmount={selectTokenInfo?.balance}
              decimals={depositTokenInfo.decimals}
              onChange={hanldeAmountChanged}
              clearTrigger={clearInputTrigger}
              className={styles.input}
            />
            <p className={styles.balance}>
              Balance: {fb4(tokens.ETH.balance, false)}
            </p>

            <p className={styles.forWrap}>
              Est. Received: <span>{fb4(minAmount)} FX</span>
            </p>

            <Button
              className={styles.buy}
              onClick={doPay}
              disabled={!canPay}
              loading={buying}
            >
              {newStatus == 1 && !PageData.userInfo?.isWhitelisted
                ? 'Address Not AladdinDAO'
                : 'Purchase'}
            </Button>

            <div className={styles.bottomWrap}>
              <p className={styles.title}>
                My Shares: <span>{PageData.myShares} FX</span>
              </p>
              {/* <p className={styles.title}>
                Claim opening at: <span>2023/5/25 20:00 UTC</span>
              </p> */}
            </div>
          </div>
        </div>
      )}

      {!!isWhiteListSoldEndSale && (
        <div className={styles.container}>
          <div className={styles.card}>
            <p className={styles.title}>FX AladdinDAO Offering Round 2</p>

            <p className={styles.num}>Sold Out</p>
            <p className={styles.title}>
              Offering Amount {PageData.capAmount} FX
            </p>
            <p className={styles.num}>
              {newStatus == 2 ? null : (
                <Countdown
                  endTime={PageData.countdown}
                  onCompleted={updateSetPropsRefreshTrigger}
                />
              )}
            </p>
            <p className={styles.title}>Public Offering</p>
            <p className={styles.title}>
              Offering Amount {PageData.totalFundsRaised} FX
            </p>
            <p className={styles.title}>
              Starting at{' '}
              {PageData.baseInfo?.timeObj.publicSaleStartTime.toLocaleString()}
            </p>
            <div className={styles.bottomWrap}>
              <p className={styles.title}>
                Price: <span>{PageData.currentPrice} ETH</span>
              </p>
              <p className={styles.title}>
                Raised: <span>{PageData.totalFundsRaised} ETH</span>
              </p>
            </div>
          </div>

          <div className={styles.card}>
            <p className={styles.title}>Invest</p>
            <SimpleInput
              placeholder=""
              hidePercent
              symbol="ETH"
              maxAmount={selectTokenInfo?.balance}
              decimals={depositTokenInfo.decimals}
              onChange={hanldeAmountChanged}
              clearTrigger={clearInputTrigger}
              className={styles.input}
            />
            <p className={styles.balance}>
              Balance: {fb4(tokens.ETH.balance, false)}
            </p>

            <p className={styles.forWrap}>
              Est. Received: <span>{fb4(minAmount)} FX</span>
            </p>

            <Button
              className={styles.buy}
              onClick={doPay}
              disabled
              loading={buying}
            >
              Purchase
            </Button>
            <div className={styles.bottomWrap}>
              <p className={styles.title}>
                My Shares: <span>{PageData.myShares} FX</span>
              </p>
              {/* <p className={styles.title}>
                Claim opening at: <span>2023/5/25 20:00 UTC</span>
              </p> */}
            </div>
            {/* <Button
              className={styles.buy}
              onClick={handleClaim}
              disabled={!canClaim}
              loading={claiming}
            >
              Claim
            </Button> */}
          </div>
        </div>
      )}

      {!!isEndSale && (
        <div className={styles.container}>
          <div className={styles.card}>
            <p className={styles.title}>FX Offering</p>

            <p className={styles.num}>Sold Out! 🎉</p>

            <p className={styles.num}>
              {' '}
              {PageData.capAmount_round1}
              <span style={{ fontSize: 20, color: '#fff' }}> (Round 1)</span>
            </p>
            <p className={styles.num1}>
              {' '}
              {PageData.capAmount}
              <span style={{ fontSize: 20, color: '#fff' }}> (Round 2)</span>
            </p>

            <p className={styles.title}>Offering Amount</p>
            <p className={styles.num}>
              {' '}
              {300}
              <span style={{ fontSize: 20, color: '#fff' }}> (Round 1)</span>
            </p>
            <p className={styles.num1}>
              {' '}
              {300}
              <span style={{ fontSize: 20, color: '#fff' }}> (Round 2)</span>
            </p>
            <p className={styles.title}>Total Raised</p>
          </div>

          <div className={styles.card}>
            <p className={styles.title}>Invest</p>
            <div className={styles.bottomWrap}>
              <p className={styles.title}>
                Round 1 My Shares: <span>{PageData.myShares_round1} FX</span>
              </p>
              <p className={styles.title}>
                Round 2 My Shares: <span>{PageData.myShares} FX</span>
              </p>
              {/* <p className={styles.title}>
                Claim opening at: <span>2023/5/25 20:00 UTC</span>
              </p> */}
            </div>
            {/* <Button
              className={styles.buy}
              onClick={handleClaim}
              disabled={!canClaim}
              loading={claiming}
            >
              Claim
            </Button> */}
          </div>
        </div>
      )}
    </>
  )
}
