import React, { useEffect, useMemo, useState } from 'react'
import { DownOutlined } from '@ant-design/icons'
import BigNumber from 'bignumber.js'
import { useSelector } from 'react-redux'
import BalanceInput, { useClearInput } from '@/components/BalanceInput'
import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import { cBN, checkNotZoroNum, formatBalance, fb4 } from '@/utils/index'
import { useToken } from '@/hooks/useTokenInfo'
import noPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import styles from './styles.module.scss'
import useETH from '../../controller/useETH'
import useApprove from '@/hooks/useApprove'
import { useFx_FxGateway } from '@/hooks/useContracts'
import { DetailCell, NoticeCard, BonusCard } from '../Common'
import Button from '@/components/Button'
import useFxCommon_New from '../../hooks/useFxCommon_New'
import useOutAmount from '../../hooks/useOutAmount'

export default function Redeem({ slippage, assetInfo }) {
  const { _currentAccount, sendTransaction } = useWeb3()
  const [isLoading, setIsLoading] = useState(0)
  const { tokens } = useSelector((state) => state.token)
  const [clearTrigger, clearInput] = useClearInput()

  const fxCommonNew = useFxCommon_New()

  const [symbol, setSymbol] = useState('stETH')
  const { contract: FxGatewayContract } = useFx_FxGateway()

  const { updateOutAmount, resetOutAmount, minOutAmount } =
    useOutAmount(slippage)

  const [bouns, setBouns] = useState(0)

  const { isF, isX, symbol: fromSymbol, nav_text } = assetInfo

  const isSwap = useMemo(() => ['fETH', 'xETH'].includes(symbol), [symbol])

  const OPTIONS = [
    ['stETH', config.tokens.stETH],
    [
      'WETH',
      config.tokens.weth,
      ['0x277090c5ae6b80a3c525f09d7ae464a8fa83d9c08804'],
    ],
    [
      'USDC',
      config.tokens.usdc,
      [
        '0x277090c5ae6b80a3c525f09d7ae464a8fa83d9c08804',
        '0x49fe1afc5df753cd252e1068dfa0428d3755b20a6c08',
      ],
    ],
    [
      'USDT',
      config.tokens.usdt,
      [
        '0x277090c5ae6b80a3c525f09d7ae464a8fa83d9c08804',
        '0x4bd7d6e5d89150b5caa781bc12012fe06ea8578ad008',
      ],
    ],
    ['xETH', config.tokens.xETH],
    ['fETH', config.tokens.fETH],
  ].filter((item) => item[0] !== fromSymbol)

  const [pausedError, setPausedError] = useState(false)

  const {
    _mintFETHFee,
    _mintXETHFee,
    fETHAddress,
    xETHAddress,
    marketContract,
    _redeemFETHFee,
    _redeemXETHFee,
    ethPrice,
    ethPrice_text,
    fnav,
    xnav,
    redeemPaused,
    systemStatus,
    mintPaused,
    fTokenMintInSystemStabilityModePaused,
    xTokenRedeemInSystemStabilityModePaused,
    baseInfo,
    isFETHBouns,
    xETHBonus,
  } = useETH()

  const _isValidPrice = baseInfo?.fxETHTwapOraclePriceeInfo?._isValid

  const [fromAmount, setFromAmount] = useState(0)
  const [priceLoading, setPriceLoading] = useState(false)

  const [selectTokenAddress, tokenAmount] = useMemo(() => {
    let _selectTokenAddress
    let _tokenAmount = 0
    if (isF) {
      _selectTokenAddress = fETHAddress
      _tokenAmount = fromAmount
    } else {
      _selectTokenAddress = xETHAddress
      _tokenAmount = fromAmount
    }
    return [_selectTokenAddress, _tokenAmount]
  }, [isF, fromAmount, fromAmount])

  const bonus_text = useMemo(() => {
    const { reservePoolBalancesRes } = baseInfo

    if (isF && symbol === 'xETH') {
      return BigNumber.min(reservePoolBalancesRes, cBN(bouns), xETHBonus)
    }
    console.log('bouns--memo-', bouns.toString())
    return BigNumber.min(cBN(reservePoolBalancesRes), cBN(bouns))
  }, [bouns, baseInfo?.reservePoolBalancesRes, xETHBonus, symbol, isF])

  const [_fnav, _xnav, _ethPrice_text, _isPriceValid] = useMemo(() => {
    if (
      baseInfo.fxETHTwapOraclePriceeInfo &&
      !baseInfo.fxETHTwapOraclePriceeInfo._isValid
    ) {
      let _state
      if (isF) {
        _state = fxCommonNew._loadSwapState('RedeemFToken')
      } else {
        _state = fxCommonNew._loadSwapState('RedeemXToken')
      }
      return [
        fb4(_state.fNav),
        fb4(_state.xNav),
        fb4(_state.baseNav),
        baseInfo.fxETHTwapOraclePriceeInfo._isValid,
      ]
    }
    return [fnav, xnav, ethPrice_text, true]
  }, [baseInfo, isF])

  const canReceived = useMemo(() => {
    if (!minOutAmount.minout_slippage) return false
    if (isF) {
      return cBN(tokenAmount).isLessThanOrEqualTo(tokens.fETH.balance)
    }
    return cBN(tokenAmount).isLessThanOrEqualTo(tokens.xETH.balance)
  }, [
    tokenAmount,
    minOutAmount.minout_slippage,
    tokens.fETH.balance,
    tokens.xETH.balance,
    isF,
  ])

  const fee = useMemo(() => {
    let __redeemFETHFee = _redeemFETHFee
    let __redeemXETHFee = _redeemXETHFee
    if (systemStatus == 0) {
      __redeemFETHFee = baseInfo.fTokenRedeemFeeRatioRes?.defaultFeeRatio || 0
      __redeemXETHFee = baseInfo.xTokenRedeemFeeRatioRes?.defaultFeeRatio || 0
    }
    let _fee
    if (isF) {
      _fee = cBN(__redeemFETHFee)
        .plus(cBN(isSwap ? _mintXETHFee : 0))
        .multipliedBy(100)
        .toString(10)
    } else {
      _fee = cBN(__redeemXETHFee)
        .plus(cBN(isSwap ? _mintFETHFee : 0))
        .multipliedBy(100)
        .toString(10)
    }
    return formatBalance(_fee)
  }, [isF, systemStatus, isSwap])

  const hanldeFromAmountChanged = (v) => {
    setFromAmount(v.toString(10))
  }

  const selectTokenInfo = useToken(
    selectTokenAddress,
    symbol == 'stETH' ? 'fx_redeem' : 'fx_fxGateway'
  )

  const { BtnWapper, needApprove } = useApprove({
    approveAmount: tokenAmount,
    allowance: selectTokenInfo.allowance,
    tokenContract: selectTokenInfo.contract,
    approveAddress: selectTokenInfo.contractAddress,
  })

  const _account = useMemo(() => {
    const isInsufficient = cBN(tokenAmount).isGreaterThan(
      tokens[isF ? 'fETH' : 'xETH'].balance
    )

    if (isInsufficient) {
      return config.approvedAddress
    }
    return needApprove && symbol !== 'stETH'
      ? config.approvedAddress
      : _currentAccount
  }, [needApprove, _currentAccount, tokenAmount, isF, symbol])

  const checkPause = () => {
    let _xTokenRedeemInSystemStabilityModePaused = false
    let _fTokenMintInSystemStabilityModePaused = false
    const isCRLow130 = systemStatus * 1 > 0

    // redeem
    if (fromSymbol === 'xETH') {
      _xTokenRedeemInSystemStabilityModePaused =
        xTokenRedeemInSystemStabilityModePaused && isCRLow130
    }
    if (redeemPaused || _xTokenRedeemInSystemStabilityModePaused) {
      setPausedError(
        'f(x) governance decision to temporarily disable redemption.'
      )
      return true
    }

    if (isSwap) {
      // mint
      if (symbol === 'fETH') {
        _fTokenMintInSystemStabilityModePaused =
          fTokenMintInSystemStabilityModePaused && isCRLow130
      }
      if (
        mintPaused ||
        _fTokenMintInSystemStabilityModePaused ||
        !_isValidPrice
      ) {
        setPausedError(
          `f(x) governance decision to temporarily disable ${symbol} minting.`
        )
        return true
      }
    }
    setPausedError('')
    return false
  }

  const canRedeem = useMemo(() => {
    if (checkPause()) {
      return false
    }

    let _enableETH = cBN(tokenAmount).isGreaterThan(0)
    if (isF) {
      _enableETH =
        _enableETH && cBN(tokenAmount).isLessThanOrEqualTo(tokens.fETH.balance)
    } else {
      _enableETH =
        _enableETH && cBN(tokenAmount).isLessThanOrEqualTo(tokens.xETH.balance)
    }

    return _enableETH
  }, [
    isF,
    tokenAmount,
    isSwap,
    redeemPaused,
    mintPaused,
    fTokenMintInSystemStabilityModePaused,
    xTokenRedeemInSystemStabilityModePaused,
    tokens.ETH.balance,
    _isValidPrice,
  ])

  useEffect(() => {
    checkPause()
  }, [
    redeemPaused,
    mintPaused,
    fTokenMintInSystemStabilityModePaused,
    isX,
    isSwap,
    xTokenRedeemInSystemStabilityModePaused,
  ])

  useEffect(() => {
    resetOutAmount()
    setBouns(0)
  }, [symbol])

  const initPage = () => {
    setFromAmount(0)
    clearInput()
    resetOutAmount()
    setBouns(0)
  }

  const getMinAmount = async (needLoading) => {
    try {
      if (!checkNotZoroNum(tokenAmount)) {
        resetOutAmount()
        setBouns(0)
        return 0
      }
      if (needLoading) {
        setPriceLoading(true)
      }

      let _mockAmount = tokenAmount
      let _mockRatio = 1
      let __bonus = 0
      // 默认比例 0.01
      if (_account !== _currentAccount) {
        _mockAmount = cBN(1).shiftedBy(18).toString()
        _mockRatio = cBN(tokenAmount).div(cBN(10).pow(18)).toFixed(4, 1)
      }
      let minout_ETH
      let _fTokenIn = 0
      let _xTokenIn = 0
      if (isF) {
        _fTokenIn = _mockAmount
        _xTokenIn = 0
      } else {
        _xTokenIn = _mockAmount
        _fTokenIn = 0
      }

      if (isSwap) {
        const resData = await FxGatewayContract.methods
          .swap(_mockAmount, symbol === 'xETH', 0)
          .call({ from: _account })
        if (typeof resData === 'object') {
          minout_ETH = resData._amountOut
          __bonus = cBN(resData._bonus || 0)
        } else {
          minout_ETH = resData
        }
      } else if (symbol === 'stETH') {
        const { _baseOut, _bonus } = await marketContract.methods
          .redeem(_fTokenIn, _xTokenIn, _account, 0)
          .call({ from: _account })
        minout_ETH = _baseOut
        __bonus = cBN(_bonus || 0)
      } else {
        const route = OPTIONS.filter((item) => item[0] === symbol)[0][2]
        const { _dstOut, _bonus } = await FxGatewayContract.methods
          .redeem(
            [config.contracts.redeemConverter, route],
            _fTokenIn,
            _xTokenIn,
            0,
            0
          )
          .call({ from: _account })
        minout_ETH = _dstOut
        __bonus = cBN(_bonus || 0)
      }
      // 比例计算
      minout_ETH *= _mockRatio

      const _minOut = updateOutAmount(
        minout_ETH,
        toUsd,
        config.zapTokens[symbol].decimals
      )
      setBouns(__bonus.multipliedBy(_mockRatio))
      setPriceLoading(false)

      return _minOut
    } catch (error) {
      console.log(error)
      resetOutAmount()
      setBouns(0)
      setPriceLoading(false)
      if (
        error?.message &&
        error.message.includes('burn amount exceeds balance')
      ) {
        noPayableErrorAction(`error_mint`, 'ERC20: burn amount exceeds balance')
      }
      return 0
    }
  }

  const handleSwap = async () => {
    try {
      setIsLoading(true)

      const _minOut = await getMinAmount()

      const apiCall = await FxGatewayContract.methods.swap(
        fromAmount,
        symbol === 'xETH',
        _minOut
      )
      await noPayableAction(
        () =>
          sendTransaction({
            to: FxGatewayContract._address,
            data: apiCall.encodeABI(),
          }),
        {
          key: 'Redeem',
          action: 'Redeem',
        }
      )
      setIsLoading(false)
      initPage()
    } catch (error) {
      setIsLoading(false)
      noPayableErrorAction(`error_mint`, error)
    }
  }

  const handleRedeem = async () => {
    if (isSwap) {
      handleSwap()
      return
    }

    try {
      setIsLoading(true)
      const _minoutETH = await getMinAmount()
      let _fTokenIn = 0
      let _xTokenIn = 0
      if (isF) {
        _fTokenIn = tokenAmount
        _xTokenIn = 0
      } else {
        _xTokenIn = tokenAmount
        _fTokenIn = 0
      }

      let apiCall
      let to
      if (symbol === 'stETH') {
        to = marketContract._address
        apiCall = await marketContract.methods.redeem(
          _fTokenIn,
          _xTokenIn,
          _currentAccount,
          _minoutETH
        )
      } else {
        to = FxGatewayContract._address
        const route = OPTIONS.filter((item) => item[0] === symbol)[0][2]

        const { _dstOut, _baseOut } = await FxGatewayContract.methods
          .redeem(
            [config.contracts.redeemConverter, route],
            _fTokenIn,
            _xTokenIn,
            0,
            0
          )
          .call({ from: _currentAccount })
        const dstOut = (cBN(_dstOut) || cBN(0))
          .multipliedBy(cBN(1).minus(cBN(slippage).dividedBy(100)))
          .toFixed(0)
        const baseOut = (cBN(_baseOut) || cBN(0))
          .multipliedBy(cBN(1).minus(cBN(slippage).dividedBy(100)))
          .toFixed(0)
        // console.log(
        //   '_fTokenIn----',
        //   _fTokenIn,
        //   _xTokenIn,
        //   dstOut.toString(),
        //   baseOut.toString()
        // )
        // console.log('dstOut---', dstOut, baseOut)
        apiCall = await FxGatewayContract.methods.redeem(
          ['0xAF345c813CE17Cc5837BfD14a910D365223F3B95', route],
          _fTokenIn,
          _xTokenIn,
          baseOut.toString(),
          dstOut.toString()
        )
      }
      await noPayableAction(
        () =>
          sendTransaction({
            to,
            data: apiCall.encodeABI(),
          }),
        {
          key: 'Redeem',
          action: 'Redeem',
        }
      )
      setIsLoading(false)
      initPage()
    } catch (e) {
      console.log('redeem---error', e)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getMinAmount(true)
  }, [isF, slippage, tokenAmount, symbol, _account])

  const toUsd = useMemo(() => {
    if (symbol === 'fETH') {
      return _fnav
    }
    if (symbol === 'xETH') {
      return _xnav
    }
    if (['stETH', 'ETH'].includes(symbol)) {
      return _ethPrice_text
    }
    return tokens[symbol].price
  }, [symbol, _ethPrice_text, _fnav, _xnav])

  return (
    <div className={styles.container}>
      {isFETHBouns ? (
        <BonusCard
          title={`REDEEM fETH TO EARN ${fb4(
            cBN(baseInfo.bonusRatioRes).times(100),
            false,
            18,
            2
          )}% BONUS NOW`}
          amount=""
          symbol=""
        />
      ) : null}
      {isF ? (
        <BalanceInput
          placeholder="-"
          balance={fb4(tokens.fETH.balance, false)}
          symbol="fETH"
          color="blue"
          className={styles.inputItem}
          usd={nav_text}
          maxAmount={tokens.fETH.balance}
          onChange={hanldeFromAmountChanged}
          clearTrigger={clearTrigger}
        />
      ) : (
        <BalanceInput
          placeholder="-"
          balance={fb4(tokens.xETH.balance, false)}
          symbol="xETH"
          color="red"
          className={styles.inputItem}
          usd={nav_text}
          maxAmount={tokens.xETH.balance}
          onChange={hanldeFromAmountChanged}
          clearTrigger={clearTrigger}
        />
      )}
      <div className={styles.arrow}>
        <DownOutlined />
      </div>

      <BalanceInput
        symbol={symbol}
        placeholder={minOutAmount.minout}
        amountUSD={minOutAmount.minout_tvl}
        decimals={config.zapTokens[symbol].decimals}
        usd={toUsd}
        disabled
        loading={priceLoading}
        className={styles.inputItem}
        options={OPTIONS.map((item) => item[0])}
        onSymbolChanged={(v) => setSymbol(v)}
      />

      <DetailCell
        title="Redeem Fee: "
        content={[`${fee}%`]}
        tooltip="Subtracted from amount received"
      />
      {canReceived && (
        <DetailCell
          title="Min. Received:"
          content={[
            minOutAmount.minout_slippage,
            // minOutAmount.minout_slippage_tvl,
          ]}
        />
      )}

      {isFETHBouns && isF && bouns ? (
        <DetailCell
          title={`${symbol === 'xETH' ? 'Mint xETH' : 'Redeem fETH'} Bonus:`}
          content={[fb4(bonus_text), '', 'stETH']}
        />
      ) : null}

      {pausedError ? <NoticeCard content={[pausedError]} /> : null}
      {!_isPriceValid ? (
        <NoticeCard content={[`stETH price: $${_ethPrice_text}`]} />
      ) : null}

      <div className={styles.action}>
        {symbol === 'stETH' ? (
          <Button
            loading={isLoading}
            disabled={!canRedeem}
            onClick={handleRedeem}
            width="100%"
          >
            Redeem
          </Button>
        ) : (
          <BtnWapper
            loading={isLoading}
            disabled={!canRedeem}
            onClick={handleRedeem}
            width="100%"
            auto={false}
          >
            Redeem
          </BtnWapper>
        )}
      </div>
    </div>
  )
}
