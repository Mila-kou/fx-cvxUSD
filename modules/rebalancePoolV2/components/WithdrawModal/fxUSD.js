import React, { useState, useEffect, useMemo } from 'react'
import { Modal } from 'antd'
import { useSelector } from 'react-redux'
import Button from '@/components/Button'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import useWeb3 from '@/hooks/useWeb3'
import BalanceInput, { useClearInput } from '@/components/BalanceInput'
import { cBN, formatBalance, checkNotZoroNum, fb4 } from '@/utils/index'
import styles from './styles.module.scss'
import { useFxUSD_GatewayRouter_contract } from '@/hooks/useFXUSDContract'
import { NoticeCard } from '@/modules/assets/components/Common'
import config from '@/config/index'
import { getZapOutParams } from '@/hooks/useZap'
import SlippageInfo from '@/components/SlippageInfo'

export default function WithdrawModal(props) {
  const { onCancel, info, poolData } = props

  const { currentAccount, isAllReady, sendTransaction } = useWeb3()
  const [withdrawAmount, setWithdrawAmount] = useState()
  const [slippage, setSlippage] = useState(0.3)

  const baseToken = useSelector((state) => state.baseToken)
  const [withdrawing, setWithdrawing] = useState(false)
  const { logo, stakeTokenDecimals, withdrawDefaultToken, baseSymbol } = info
  const [symbol, setSymbol] = useState(withdrawDefaultToken)
  const { userInfo } = poolData
  const { contract: fxUSD_GatewayRouterContract } =
    useFxUSD_GatewayRouter_contract()

  const [errorText, setErrorText] = useState('')

  const OPTIONS = [
    ['fxUSD', config.tokens.fxUSD],
    ['WETH', config.tokens.weth],
    ['stETH', config.tokens.stETH],
    ['frxETH', config.tokens.frxETH],
    ['USDT', config.tokens.usdt],
    ['USDC', config.tokens.usdc],
    ['Frax', config.tokens.frax],
    ['crvUSD', config.tokens.crvUSD],
    // ['wstETH', config.tokens.wstETH],
    // ['sfrxETH', config.tokens.sfrxETH],
  ].filter(([item]) => {
    if (baseSymbol === 'wstETH') {
      return item !== 'frxETH'
    }
    if (baseSymbol === 'sfrxETH') {
      return item !== 'stETH'
    }
    return true
  })

  const selectTokenAddress = useMemo(() => {
    return OPTIONS.find((item) => item[0] === symbol)[1]
  }, [symbol])

  const handleInputChange = (val) => setWithdrawAmount(val)

  const canWithdraw = useMemo(() => {
    return (
      !!(withdrawAmount * 1) &&
      isAllReady &&
      cBN(withdrawAmount).isLessThanOrEqualTo(
        userInfo.BoostableRebalancePoolBalanceOfRes
      ) &&
      !errorText
    )
  }, [withdrawAmount, isAllReady, errorText])

  useEffect(() => {
    if (
      !baseToken[baseSymbol].data?.isBaseTokenPriceValid &&
      symbol === 'fxUSD'
    ) {
      setErrorText(
        `f(x) governance decision to temporarily disable ${symbol} redemption.`
      )
    } else {
      setErrorText('')
    }
  }, [baseToken, baseSymbol, symbol])

  const handleWithdraw = async () => {
    if (!isAllReady) return

    setWithdrawing(true)
    let sharesInWei = cBN(withdrawAmount || 0).toFixed(0, 1)
    try {
      if (
        cBN(userInfo.BoostableRebalancePoolBalanceOfRes).isLessThanOrEqualTo(
          sharesInWei
        )
      ) {
        sharesInWei = userInfo.BoostableRebalancePoolBalanceOfRes
      }

      let apiCall

      if (symbol === 'fxUSD') {
        apiCall = fxUSD_GatewayRouterContract.methods.fxRebalancePoolWithdraw(
          info.rebalancePoolAddress,
          sharesInWei
        )
      } else {
        const _convertParams = getZapOutParams(
          config.tokens[baseSymbol],
          selectTokenAddress,
          0
        )
        const _amountOut = await fxUSD_GatewayRouterContract.methods
          .fxRebalancePoolWithdrawAs(
            _convertParams,
            info.rebalancePoolAddress,
            sharesInWei
          )
          .call({
            from: currentAccount,
          })
        const _minOut_CBN = (cBN(_amountOut) || cBN(0)).multipliedBy(
          cBN(1).minus(cBN(slippage).dividedBy(100))
        )

        const convertParams = getZapOutParams(
          config.tokens[baseSymbol],
          selectTokenAddress,
          _minOut_CBN.toFixed(0, 1)
        )

        apiCall = fxUSD_GatewayRouterContract.methods.fxRebalancePoolWithdrawAs(
          convertParams,
          info.rebalancePoolAddress,
          sharesInWei
        )
      }
      await NoPayableAction(
        () =>
          sendTransaction({
            to: fxUSD_GatewayRouterContract._address,
            data: apiCall.encodeABI(),
          }),
        {
          key: 'earn',
          action: 'Withdraw',
        }
      )
      onCancel()
      setWithdrawing(false)
    } catch (error) {
      console.log('error_earn_withdraw----', error)
      setWithdrawing(false)
      noPayableErrorAction(`error_earn_withdraw`, error)
    }
  }
  return (
    <Modal visible centered onCancel={onCancel} footer={null} width={500}>
      <div className={styles.content}>
        <h2 className="mb-[16px]">Withdraw fxUSD </h2>
        <BalanceInput
          placeholder="0"
          symbol={symbol}
          balance={fb4(userInfo.BoostableRebalancePoolBalanceOfRes, false)}
          maxAmount={userInfo.BoostableRebalancePoolBalanceOfRes}
          onChange={handleInputChange}
          options={OPTIONS.map((item) => item[0])}
          onSymbolChanged={(v) => setSymbol(v)}
          withUsd={false}
        />
      </div>

      {errorText ? <NoticeCard content={[errorText]} /> : null}

      {symbol !== 'fxUSD' && (
        <div className="my-[16px]">
          <SlippageInfo slippage={slippage} slippageChange={setSlippage} />
        </div>
      )}

      <div className="mt-[40px]">
        <Button
          width="100%"
          disabled={!canWithdraw}
          loading={withdrawing}
          onClick={handleWithdraw}
        >
          Withdraw
        </Button>
      </div>
    </Modal>
  )
}
