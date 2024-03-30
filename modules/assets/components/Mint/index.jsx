/* eslint-disable no-lonely-if */
import React, { useEffect, useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useSelector } from 'react-redux'
import { DownOutlined } from '@ant-design/icons'
import BalanceInput, { useClearInput } from '@/components/BalanceInput'
import useWeb3 from '@/hooks/useWeb3'

import { cBN, checkNotZoroNum, fb4, formatBalance } from '@/utils/index'
import { useToken } from '@/hooks/useTokenInfo'
import noPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import { getGas } from '@/utils/gas'
import { DetailCell, NoticeCard, BonusCard } from '../Common'
import styles from './styles.module.scss'
import useETH from '../../controller/useETH'
import config from '@/config/index'
import useApprove from '@/hooks/useApprove'
import { useFx_FxGateway } from '@/hooks/useContracts'
import useCurveSwap from '@/hooks/useCurveSwap'
import useOutAmount from '../../hooks/useOutAmount'

export default function Mint({ slippage, assetInfo }) {
  const { _currentAccount, sendTransaction } = useWeb3()
  const { tokens } = useSelector((state) => state.token)
  const [clearTrigger, clearInput] = useClearInput()
  const { getCurveSwapABI, getCurveSwapMinout } = useCurveSwap()

  const { updateOutAmount, resetOutAmount, minOutAmount } =
    useOutAmount(slippage)

  const { isF, isX, symbol: toSymbol, nav_text, leverage_text } = assetInfo

  const OPTIONS = [
    ['ETH', config.tokens.eth],
    ['stETH', config.tokens.stETH],
    ['fETH', config.tokens.fETH],
    ['xETH', config.tokens.xETH],
    ['USDC', config.tokens.usdc],
    ['USDT', config.tokens.usdt],
  ].filter((item) => item[0] !== toSymbol)

  const [pausedError, setPausedError] = useState(false)
  const [symbol, setSymbol] = useState('ETH')
  const { contract: FxGatewayContract } = useFx_FxGateway()

  const minGas = 234854
  const [fromAmount, setFromAmount] = useState(0)
  const [mintXBouns, setMintXBouns] = useState(0)

  const [priceLoading, setPriceLoading] = useState(false)
  const [mintLoading, setMintLoading] = useState(false)
  const {
    marketContract,
    _mintFETHFee,
    _mintXETHFee,
    ethPrice_text,
    fnav,
    xnav,
    mintPaused,
    redeemPaused,
    fTokenMintInSystemStabilityModePaused,
    xTokenRedeemInSystemStabilityModePaused,
    systemStatus,
    baseInfo,
    _redeemFETHFee,
    _redeemXETHFee,
    isXETHBouns,
    xETHBonus,
    maxMintableFTokenRes,
  } = useETH()

  const _isValidPrice = baseInfo?.fxETHTwapOraclePriceeInfo?._isValid

  const isSwap = useMemo(() => ['fETH', 'xETH'].includes(symbol), [symbol])

  const selectTokenAddress = useMemo(() => {
    return OPTIONS.find((item) => item[0] === symbol)[1]
  }, [symbol])

  const bonus_text = useMemo(() => {
    const { reservePoolBalancesRes } = baseInfo

    return BigNumber.min(reservePoolBalancesRes, mintXBouns, xETHBonus)
  }, [mintXBouns, baseInfo?.reservePoolBalancesRes, xETHBonus])

  useEffect(() => {
    initPage()
  }, [symbol])

  const selectTokenInfo = useToken(
    selectTokenAddress,
    symbol == 'stETH' ? 'fx_stETH_mint' : 'fx_fxGateway'
  )

  const { BtnWapper, needApprove } = useApprove({
    approveAmount: fromAmount,
    allowance: selectTokenInfo.allowance,
    tokenContract: selectTokenInfo.contract,
    approveAddress: selectTokenInfo.contractAddress,
  })

  const _account = useMemo(() => {
    const isInsufficient = cBN(fromAmount).isGreaterThan(tokens[symbol].balance)
    if (isInsufficient) {
      return config.approvedAddress
    }
    return needApprove ? config.approvedAddress : _currentAccount
  }, [needApprove, fromAmount, symbol, _currentAccount])

  const [received, receivedTvl] = useMemo(
    () => [minOutAmount.minout_slippage, minOutAmount.minout_slippage_tvl],
    [minOutAmount]
  )

  const canReceived = useMemo(
    () =>
      checkNotZoroNum(fromAmount) &&
      cBN(fromAmount).isLessThanOrEqualTo(tokens[symbol].balance) &&
      received !== '-',
    [fromAmount, tokens, symbol, received]
  )

  const fee = useMemo(() => {
    let __mintFETHFee = _mintFETHFee
    let __mintXETHFee = _mintXETHFee
    let __redeemFETHFee = _redeemFETHFee
    let __redeemXETHFee = _redeemXETHFee
    if (systemStatus == 0) {
      __mintFETHFee = baseInfo.fTokenMintFeeRatioRes?.defaultFeeRatio || 0
      __mintXETHFee = baseInfo.xTokenMintFeeRatioRes?.defaultFeeRatio || 0

      if (isSwap) {
        __redeemFETHFee = baseInfo.fTokenRedeemFeeRatioRes?.defaultFeeRatio || 0
        __redeemXETHFee = baseInfo.xTokenRedeemFeeRatioRes?.defaultFeeRatio || 0
      }
    }

    let _fee
    if (isF) {
      _fee = cBN(__mintFETHFee)
        .plus(cBN(isSwap ? __redeemXETHFee : 0))
        .multipliedBy(100)
        .toString(10)
    } else {
      _fee = cBN(__mintXETHFee)
        .plus(cBN(isSwap ? __redeemFETHFee : 0))
        .multipliedBy(100)
        .toString(10)
    }
    return formatBalance(_fee)
  }, [isF, systemStatus, isSwap])

  const hanldeETHAmountChanged = (v) => {
    setFromAmount(v.toString(10))
  }

  const initPage = () => {
    clearInput()
    setFromAmount('0')
    setMintXBouns(0)
  }

  const getMinAmount = async (needLoading) => {
    if (needLoading) {
      setPriceLoading(true)
    }

    let _mockAmount = fromAmount
    let _mockRatio = 1
    // 默认比例 0.01
    if (_account !== _currentAccount) {
      _mockAmount = cBN(0.01)
        .shiftedBy(config.zapTokens[symbol].decimals)
        .toString()
      _mockRatio = cBN(fromAmount)
        .div(cBN(10).pow(config.zapTokens[symbol].decimals))
        .multipliedBy(100)
        .toFixed(4, 1)
      // console.log('fromAmount----', _mockAmount, _mockRatio)
    }

    try {
      let minout_ETH
      if (checkNotZoroNum(fromAmount)) {
        let _ETHtAmountAndGas = _mockAmount

        if (isSwap) {
          const resData = await FxGatewayContract.methods
            .swap(_ETHtAmountAndGas, symbol === 'fETH', 0)
            .call({ from: _account })
          if (typeof resData === 'object') {
            minout_ETH = resData._amountOut
            const _userXETHBonus = cBN(resData._bonus || 0)
            setMintXBouns(_userXETHBonus.multipliedBy(_mockRatio))
          } else {
            minout_ETH = resData
          }
        } else if (symbol === 'stETH') {
          const resData = await marketContract.methods[
            isF ? 'mintFToken' : 'mintXToken'
          ](_ETHtAmountAndGas, _account, 0).call({
            from: _account,
          })
          if (typeof resData === 'object') {
            minout_ETH = resData._xTokenMinted
            const _userXETHBonus = cBN(resData._bonus || 0)
            setMintXBouns(_userXETHBonus.multipliedBy(_mockRatio))
          } else {
            minout_ETH = resData
          }
        } else {
          const getGasPrice = await getGas()
          const gasFee = cBN(minGas).times(1e9).times(getGasPrice).toFixed(0, 1)
          if (
            _account === _currentAccount &&
            cBN(fromAmount).plus(gasFee).isGreaterThan(tokens.ETH.balance)
          ) {
            _ETHtAmountAndGas = cBN(tokens.ETH.balance)
              .minus(gasFee)
              .toFixed(0, 1)
          }
          const res = await getCurveSwapABI({
            src:
              symbol == 'ETH'
                ? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
                : selectTokenAddress,
            dst: config.tokens.stETH,
            amount: _ETHtAmountAndGas.toString(),
            minout: 0,
          })
          console.log(
            '_resCurve----',
            selectTokenAddress,
            res,
            _ETHtAmountAndGas.toString()
          )

          if (!res) return

          const { data } = res

          const resData = await FxGatewayContract.methods[
            isF ? 'mintFToken' : 'mintXToken'
          ](
            [selectTokenAddress, _ETHtAmountAndGas, data.tx.to, data.tx.data],
            0
          ).call({
            value: symbol == 'ETH' ? _ETHtAmountAndGas : 0,
            from: _account,
          })

          console.log('resData-----', resData)
          if (typeof resData === 'object') {
            minout_ETH = resData._xTokenMinted
            const _userXETHBonus = cBN(resData._bonus || 0)
            setMintXBouns(_userXETHBonus.multipliedBy(_mockRatio))
          } else {
            minout_ETH = resData
          }
        }
      } else {
        minout_ETH = 0
        setMintXBouns(0)
      }
      console.log('minout_ETH----', minout_ETH)

      // 比例计算
      minout_ETH *= _mockRatio

      let _minOut = 0

      if (isF) {
        minout_ETH = BigNumber.min(
          maxMintableFTokenRes?._maxFTokenMintable,
          minout_ETH
        )

        _minOut = updateOutAmount(minout_ETH, fnav)
      } else {
        if (!checkNotZoroNum(minout_ETH)) {
          const { _xTokenMinted } = minout_ETH || {}

          _minOut = updateOutAmount(_xTokenMinted, xnav)
        } else {
          _minOut = updateOutAmount(minout_ETH, xnav)
        }
      }

      setPriceLoading(false)
      return _minOut
    } catch (error) {
      console.log('minout_ETH--error----', error)
      resetOutAmount()
      setPriceLoading(false)
      if (error?.message && error.message.includes('Exceed total cap')) {
        noPayableErrorAction(`error_mint`, 'Exceed total cap')
      }
      return 0
    }
  }

  const handleSwap = async () => {
    try {
      setMintLoading(true)

      const _minOut = await getMinAmount()

      const apiCall = await FxGatewayContract.methods.swap(
        fromAmount,
        symbol === 'fETH',
        _minOut
      )
      await noPayableAction(
        () =>
          sendTransaction({
            to: FxGatewayContract._address,
            data: apiCall.encodeABI(),
          }),
        {
          key: 'Mint',
          action: 'Mint',
        }
      )
      setMintLoading(false)
      initPage()
    } catch (error) {
      setMintLoading(false)
      noPayableErrorAction(`error_mint`, error)
    }
  }

  const handleZap = async () => {
    try {
      setMintLoading(true)
      const getGasPrice = await getGas()
      const gasFee = cBN(minGas).times(1e9).times(getGasPrice).toFixed(0, 1)
      let _ETHtAmountAndGas
      if (
        cBN(fromAmount).plus(gasFee).isGreaterThan(tokens.ETH.balance) &&
        symbol == 'ETH'
      ) {
        _ETHtAmountAndGas = cBN(tokens.ETH.balance)
          .minus(gasFee)
          .toFixed(0, 1)
          .toString()
      } else {
        _ETHtAmountAndGas = fromAmount
      }
      const _minOut = await getMinAmount()
      const _curveCallOut = await getCurveSwapMinout(
        {
          src:
            symbol == 'ETH'
              ? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
              : selectTokenAddress,
          dst: config.tokens.stETH,
          amount: _ETHtAmountAndGas.toString(),
        },
        _account
      )

      const _curveMinout = cBN(_curveCallOut).multipliedBy(
        cBN(1).minus(cBN(slippage).dividedBy(100))
      )

      const { data } = await getCurveSwapABI({
        src:
          symbol == 'ETH'
            ? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
            : selectTokenAddress,
        dst: config.tokens.stETH,
        amount: _ETHtAmountAndGas.toString(),
        minout: _curveMinout.toFixed(0),
      })

      const apiCall = await FxGatewayContract.methods[
        isF ? 'mintFToken' : 'mintXToken'
      ](
        [selectTokenAddress, _ETHtAmountAndGas, data.tx.to, data.tx.data],
        _minOut
      )

      await noPayableAction(
        () =>
          sendTransaction({
            to: FxGatewayContract._address,
            data: apiCall.encodeABI(),
            value: _ETHtAmountAndGas,
          }),
        {
          key: 'Mint',
          action: 'Mint',
        }
      )
      setMintLoading(false)
      initPage()
    } catch (error) {
      setMintLoading(false)
      noPayableErrorAction(`error_mint`, error)
    }
  }

  const handleMint = async () => {
    if (isSwap) {
      handleSwap()
      return
    }

    if (symbol !== 'stETH') {
      handleZap()
      return
    }

    try {
      setMintLoading(true)
      const _minOut = await getMinAmount()

      const _ETHtAmountAndGas = fromAmount
      const apiCall = await marketContract.methods[
        isF ? 'mintFToken' : 'mintXToken'
      ](_ETHtAmountAndGas, _currentAccount, _minOut)

      await noPayableAction(
        () =>
          sendTransaction({
            to: marketContract._address,
            data: apiCall.encodeABI(),
          }),
        {
          key: 'Mint',
          action: 'Mint',
        }
      )
      setMintLoading(false)
      initPage()
    } catch (error) {
      setMintLoading(false)
      noPayableErrorAction(`error_mint`, error)
    }
  }

  const showMinReceive = useMemo(
    () =>
      canReceived &&
      cBN(selectTokenInfo.allowance).isGreaterThanOrEqualTo(fromAmount),
    [canReceived, selectTokenInfo.allowance, fromAmount]
  )

  const checkPause = () => {
    let _xTokenRedeemInSystemStabilityModePaused = false
    let _fTokenMintInSystemStabilityModePaused = false
    const isCRLow130 = systemStatus * 1 > 0

    // mint
    if (toSymbol === 'fETH') {
      _fTokenMintInSystemStabilityModePaused =
        fTokenMintInSystemStabilityModePaused && isCRLow130
    }
    if (
      mintPaused ||
      _fTokenMintInSystemStabilityModePaused ||
      !_isValidPrice
    ) {
      setPausedError(`f(x) governance decision to temporarily disable minting.`)
      return true
    }

    if (isSwap) {
      // redeem
      if (symbol === 'xETH') {
        _xTokenRedeemInSystemStabilityModePaused =
          xTokenRedeemInSystemStabilityModePaused && isCRLow130
      }
      if (redeemPaused || _xTokenRedeemInSystemStabilityModePaused) {
        setPausedError(
          `f(x) governance decision to temporarily disable ${symbol} redemption.`
        )
        return true
      }
    }
    setPausedError('')
    return false
  }

  const canMint = useMemo(() => {
    if (checkPause()) {
      return false
    }
    const _enableETH =
      cBN(fromAmount).isLessThanOrEqualTo(tokens[symbol].balance) &&
      cBN(fromAmount).isGreaterThan(0)
    // console.log('_fTokenMintInSystemStabilityModePaused---', !mintPaused, _enableETH, isF, systemStatus, fTokenMintInSystemStabilityModePaused, _fTokenMintInSystemStabilityModePaused)
    return !mintPaused && _enableETH && minOutAmount.minout !== '-'
  }, [
    fromAmount,
    mintPaused,
    fTokenMintInSystemStabilityModePaused,
    isF,
    tokens.ETH.balance,
    _isValidPrice,
    minOutAmount,
  ])

  useEffect(() => {
    checkPause()
  }, [
    mintPaused,
    isSwap,
    isF,
    redeemPaused,
    !_isValidPrice,
    fTokenMintInSystemStabilityModePaused,
  ])

  useEffect(() => {
    getMinAmount(true)
  }, [isF, slippage, fromAmount, _account])

  const fromUsd = useMemo(() => {
    if (symbol === 'fETH') {
      return fnav
    }
    if (symbol === 'xETH') {
      return xnav
    }
    if (['stETH', 'ETH'].includes(symbol)) {
      return ethPrice_text
    }
    return tokens[symbol].price
  }, [symbol, ethPrice_text, fnav, xnav])

  return (
    <div className={styles.container}>
      {isXETHBouns ? (
        <BonusCard
          title={`MINT xETH TO EARN ${fb4(
            cBN(baseInfo.bonusRatioRes).times(100),
            false,
            18,
            2
          )}% BONUS NOW`}
          amount=""
          symbol=""
        />
      ) : null}

      <BalanceInput
        placeholder="-"
        symbol={symbol}
        decimals={config.zapTokens[symbol].decimals}
        balance={fb4(
          tokens[symbol].balance,
          false,
          config.zapTokens[symbol].decimals
        )}
        usd={fromUsd}
        maxAmount={tokens[symbol].balance}
        clearTrigger={clearTrigger}
        onChange={hanldeETHAmountChanged}
        options={OPTIONS.map((item) => item[0])}
        onSymbolChanged={(v) => setSymbol(v)}
      />
      <div className={styles.arrow}>
        <DownOutlined />
      </div>
      {isF ? (
        <BalanceInput
          symbol="fETH"
          color="blue"
          placeholder={checkNotZoroNum(fromAmount) ? minOutAmount.minout : '-'}
          amountUSD={minOutAmount.minout_tvl}
          disabled
          className={styles.inputItem}
          usd={nav_text}
          loading={isF && priceLoading}
          onRetry={getMinAmount}
        />
      ) : (
        <BalanceInput
          symbol="xETH"
          // tip="Bonus+"
          color="red"
          placeholder={checkNotZoroNum(fromAmount) ? minOutAmount.minout : '-'}
          amountUSD={minOutAmount.minout_tvl}
          disabled
          className={styles.inputItem}
          usd={nav_text}
          rightSuffix={
            <span className={styles.yellow}>Leverage + {leverage_text}</span>
          }
          loading={isX && priceLoading}
          onRetry={getMinAmount}
        />
      )}

      {isXETHBouns && isX && mintXBouns ? (
        <DetailCell
          title="Mint xETH Bonus:"
          content={[fb4(bonus_text), '', 'stETH']}
        />
      ) : null}

      <DetailCell
        title="Mint Fee: "
        content={[`${fee}%`]}
        tooltip="Subtracted from amount received"
      />
      {showMinReceive ? (
        <DetailCell title="Min. Received:" content={[received, receivedTvl]} />
      ) : null}

      {pausedError ? <NoticeCard content={[pausedError]} /> : null}

      <div className={styles.action}>
        <BtnWapper
          loading={mintLoading}
          disabled={!canMint}
          onClick={handleMint}
          width="100%"
        >
          {isF ? `Mint Stable ${toSymbol}` : `Mint Leveraged Long ${toSymbol}`}
        </BtnWapper>
      </div>
    </div>
  )
}
