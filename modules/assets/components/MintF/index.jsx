/* eslint-disable no-lonely-if */
import React, { memo, useRef, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { DownOutlined } from '@ant-design/icons'
import BalanceInput, { useClearInput } from '@/components/BalanceInput'
import useWeb3 from '@/hooks/useWeb3'
import { cBN, checkNotZoroNum, formatBalance, fb4 } from '@/utils/index'
import { useToken } from '@/hooks/useTokenInfo'
import noPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import { getGas } from '@/utils/gas'
import { DetailCell, NoticeCard, NoticeMaxMinPrice, BonusCard } from '../Common'
import styles from './styles.module.scss'
import config from '@/config/index'
import useApprove from '@/hooks/useApprove'
import { useZapIn } from '@/hooks/useZap'
import {
  useFxUSD_GatewayRouter_contract,
  useV2MarketContract,
} from '@/hooks/useFXUSDContract'
import useGlobal from '@/hooks/useGlobal'
import useOutAmount from '../../hooks/useOutAmount'
import RouteCard from '../RouteCard'
import useRouteList from '../RouteCard/useRouteList'

const MINT_OPTIONS = {
  cvxUSD: [
    ['ETH', config.tokens.eth],
    ['USDT', config.tokens.usdt],
    ['USDC', config.tokens.usdc],
    ['crvUSD', config.tokens.crvUSD],
    ['aCVX', config.tokens.aCVX],
  ],
}

export default function MintF({ slippage, assetInfo, children }) {
  const { showRouteCard } = useGlobal()
  const { _currentAccount, sendTransaction } = useWeb3()
  const { tokens } = useSelector((state) => state.token)
  const baseToken = useSelector((state) => state.baseToken)
  const [clearTrigger, clearInput] = useClearInput()
  const getMarketContract = useV2MarketContract()
  const { getZapInParams } = useZapIn()
  const timerRef = useRef(null)

  const { updateOutAmount, resetOutAmount, minOutAmount } =
    useOutAmount(slippage)

  const {
    isF,
    symbol: toSymbol,
    nav_text,
    markets,
    baseTokenInfo,
    baseList,
  } = assetInfo

  const { baseSymbol, contracts } = baseTokenInfo

  const OPTIONS = MINT_OPTIONS[toSymbol]

  const [pausedError, setPausedError] = useState(false)
  const [showCapReachedError, setShowCapReachedError] = useState(false)
  const [symbol, setSymbol] = useState(baseSymbol)
  const { contract: fxUSD_GatewayRouterContract } =
    useFxUSD_GatewayRouter_contract()

  const MarketContract = getMarketContract(contracts.market).contract

  const baseTokenData = useMemo(
    () => baseToken[baseSymbol].data,
    [baseToken, baseSymbol]
  )

  const minGas = 234854
  const [fromAmount, setFromAmount] = useState(0)

  const [priceLoading, setPriceLoading] = useState(false)
  const [mintLoading, setMintLoading] = useState(false)

  const {
    mintPaused,
    redeemPaused,
    fTokenMintPausedInStabilityMode,
    xTokenRedeemPausedInStabilityMode,
    // baseInfo,

    mintFTokenFee,
    redeemFTokenFee,
    mintXTokenFee,
    redeemXTokenFee,
    fTokenMintFeeRatioRes,
    xTokenMintFeeRatioRes,
    fTokenRedeemFeeRatioRes,
    xTokenRedeemFeeRatioRes,

    isCRLow130,
    isBaseTokenPriceValid,

    fTokenTotalSupplyRes,
    isRecap,
    prices,
  } = baseTokenData

  const isSwap = false

  const selectTokenAddress = useMemo(() => {
    return OPTIONS.find((item) => item[0] === symbol)[1]
  }, [symbol])

  const routeTypeRef = useRef(null)
  const { routeList, refreshRouteList } = useRouteList()

  useEffect(() => {
    initPage()
  }, [symbol])

  const getContractAddress = () => {
    if (symbol === baseSymbol) {
      return contracts.market
    }
    return 'fxUSD_gateway_router'
  }

  const selectTokenInfo = useToken(selectTokenAddress, getContractAddress())

  // console.log('selectTokenInfo-----', selectTokenInfo)

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
    let _mintFTokenFee = mintFTokenFee
    let _mintXTokenFee = mintXTokenFee
    let _redeemFTokenFee = redeemFTokenFee
    let _redeemXTokenFee = redeemXTokenFee
    if (!isCRLow130) {
      _mintFTokenFee = fTokenMintFeeRatioRes?.defaultFee || 0
      _mintXTokenFee = xTokenMintFeeRatioRes?.defaultFee || 0

      if (isSwap) {
        _redeemFTokenFee = fTokenRedeemFeeRatioRes?.defaultFee || 0
        _redeemXTokenFee = xTokenRedeemFeeRatioRes?.defaultFee || 0
      }
    }

    let _fee
    if (isF) {
      _fee = cBN(_mintFTokenFee)
        .plus(cBN(isSwap ? _redeemXTokenFee : 0))
        .multipliedBy(100)
        .toString(10)
    } else {
      _fee = cBN(_mintXTokenFee)
        .plus(cBN(isSwap ? _redeemFTokenFee : 0))
        .multipliedBy(100)
        .toString(10)
    }
    return formatBalance(_fee)
  }, [isF, isCRLow130, isSwap])

  const hanldeETHAmountChanged = (v) => {
    setFromAmount(v.toString(10))
  }

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.curent)
    }
  }, [])

  const initPage = () => {
    clearInput()
    setFromAmount('0')
    routeTypeRef.current = ''
  }

  const getMinAmount = async (needLoading) => {
    clearTimeout(timerRef.curent)
    timerRef.curent = setTimeout(() => {
      getMinAmount(true)
    }, 30000)

    if (needLoading) {
      setPriceLoading(true)
      routeTypeRef.current = ''
    }

    let _mockAmount = fromAmount
    let _mockRatio = 1

    setShowCapReachedError(false)

    // 默认比例 0.01
    if (_account !== _currentAccount) {
      _mockAmount = cBN(0.01)
        .shiftedBy(config.zapTokens[symbol].decimals)
        .toString()
      _mockRatio = cBN(fromAmount)
        .div(cBN(10).pow(config.zapTokens[symbol].decimals))
        .multipliedBy(100)
        .toString()
      // console.log('fromAmount----', _mockAmount, _mockRatio)
    }
    try {
      let minout_ETH
      if (checkNotZoroNum(fromAmount)) {
        if (symbol === baseSymbol) {
          if (cBN(fromAmount).isGreaterThan(baseTokenData.restBaseTokenRes)) {
            setShowCapReachedError(true)
            minout_ETH = 0
            setMintXBouns(0)
          } else {
            resData = await MarketContract.methods
              .mintFToken(_mockAmount, _account, 0)
              .call({
                from: _account,
              })
          }
        } else {
          if (symbol === 'ETH') {
            const getGasPrice = await getGas()
            const gasFee = cBN(minGas)
              .times(1e9)
              .times(getGasPrice)
              .toFixed(0, 1)
            if (
              _account === _currentAccount &&
              cBN(fromAmount).plus(gasFee).isGreaterThan(tokens.ETH.balance)
            ) {
              _mockAmount = cBN(tokens.ETH.balance).minus(gasFee).toFixed(0, 1)
            }
          }

          let list
          if (_routeType && routeList.length) {
            list = routeList
            routeTypeRef.current = _routeType
          } else {
            list = await refreshRouteList(
              {
                from: symbol,
                to: baseSymbol,
                amount: isBTCMock ? fromAmount : _mockAmount,
                slippage,
                symbol: toSymbol,
                price: nav_text,
              },
              async ([convertParams]) => {
                let res
                // const call =
                //   await fxUSD_GatewayRouterContract.methods.fxMintXTokenV2(
                //     convertParams,
                //     contracts.market,
                //     0
                //   )
                // console.log(
                //   'fxMintXTokenV2-----',
                //   fxUSD_GatewayRouterContract._address,
                //   call.encodeABI()
                // )
                res = await fxUSD_GatewayRouterContract.methods
                  .fxMintFTokenV2(convertParams, contracts.market, 0)
                  .call({
                    from: _account,
                    value: symbol == 'ETH' ? _mockAmount : 0,
                  })

                // 比例计算
                return {
                  outAmount: res._fTokenMinted * _mockRatio,
                  result: res,
                }
              }
            )
          }

          const { amount, result } =
            list.find((item) => item.routeType === routeTypeRef.current) ||
            list[0]

          console.log('fxMintFTokenV2--resData----', result)

          if (!routeTypeRef.current) {
            routeTypeRef.current = list[0].routeType
          }

          minout_ETH = amount
        }
      } else {
        minout_ETH = 0
      }

      // 比例计算
      minout_ETH *= _mockRatio

      const _minOut = updateOutAmount(minout_ETH, 1)

      setPriceLoading(false)
      return _minOut
    } catch (error) {
      console.log('fxMintFxUSD--finnal--error--', _account, error)

      if (error?.message.includes('0x2cbf45d6')) {
        setShowCapReachedError(true)
      }

      resetOutAmount()
      setPriceLoading(false)
      return [0]
    }
  }

  const getMintGas = async (_fromAmount) => {
    const getGasPrice = await getGas()
    const gasFee = cBN(minGas).times(1e9).times(getGasPrice).toFixed(0, 1)
    let _ETHtAmountAndGas
    if (
      cBN(_fromAmount).plus(gasFee).isGreaterThan(tokens.ETH.balance) &&
      symbol == 'ETH'
    ) {
      _ETHtAmountAndGas = cBN(tokens.ETH.balance)
        .minus(gasFee)
        .toFixed(0, 1)
        .toString(10)
    } else {
      _ETHtAmountAndGas = cBN(_fromAmount).toString(10)
    }
    return _ETHtAmountAndGas
  }

  const handleMint = async () => {
    try {
      setMintLoading(true)

      const _ETHtAmountAndGas = await getMintGas(fromAmount)
      const _minOut = await getMinAmount()

      if (!checkNotZoroNum(_minOut)) {
        setMintLoading(false)
        return
      }

      let apiCall
      let to
      if (symbol === baseSymbol) {
        to = MarketContract._address

        apiCall = await MarketContract.methods.mintFToken(
          _ETHtAmountAndGas,
          _currentAccount,
          _minOut
        )
      } else {
        to = fxUSD_GatewayRouterContract._address
        const [convertParams] = await getZapInParams({
          from: symbol,
          to: baseSymbol,
          amount: _ETHtAmountAndGas,
          slippage,
        })

        apiCall = await fxUSD_GatewayRouterContract.methods.fxMintFTokenV2(
          convertParams,
          contracts.market,
          _minOut
        )
      }

      await noPayableAction(
        () =>
          sendTransaction({
            to,
            value: symbol == 'ETH' ? _ETHtAmountAndGas : 0,
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
      console.log('mint---error---', _currentAccount, error)
      setMintLoading(false)
      noPayableErrorAction(`error_mint`, error)
    }
  }

  const showMinReceive = useMemo(
    () =>
      !priceLoading &&
      canReceived &&
      cBN(selectTokenInfo.allowance).isGreaterThanOrEqualTo(fromAmount),
    [canReceived, selectTokenInfo.allowance, fromAmount, priceLoading]
  )

  const checkPause = () => {
    let _fTokenMintPausedInStabilityMode = false

    _fTokenMintPausedInStabilityMode =
      fTokenMintPausedInStabilityMode && isCRLow130

    if (
      isRecap ||
      mintPaused ||
      _fTokenMintPausedInStabilityMode ||
      // !isBaseTokenPriceValid ||
      cBN(fTokenTotalSupplyRes).isGreaterThan(markets?.[baseSymbol].mintCap)
    ) {
      setPausedError(`f(x) governance decision to temporarily disable minting.`)
      return true
    }

    setPausedError('')
    return false
  }

  const canMint = useMemo(() => {
    if (checkPause() || priceLoading) {
      return false
    }
    const _enableETH =
      cBN(fromAmount).isLessThanOrEqualTo(tokens[symbol].balance) &&
      cBN(fromAmount).isGreaterThan(0)

    if (needApprove && _enableETH) return true
    // console.log('_fTokenMintInSystemStabilityModePaused---', !mintPaused, _enableETH, isF, systemStatus, fTokenMintInSystemStabilityModePaused, _fTokenMintInSystemStabilityModePaused)
    return !mintPaused && _enableETH && minOutAmount.minout !== '-'
  }, [
    fromAmount,
    mintPaused,
    symbol,
    fTokenMintPausedInStabilityMode,
    minOutAmount,
    needApprove,
    priceLoading,
  ])

  useEffect(() => {
    checkPause()
  }, [
    mintPaused,
    baseSymbol,
    redeemPaused,
    isBaseTokenPriceValid,
    fTokenMintPausedInStabilityMode,
    isRecap,
  ])

  useEffect(() => {
    getMinAmount(true)
  }, [isF, slippage, fromAmount, _account])

  const fromUsd = useMemo(() => {
    if (symbol === baseSymbol) {
      return baseTokenData?.baseTokenPrices?.inMintF
    }
    if (baseList.includes(symbol)) {
      return baseTokenData?.prices?.inMintF
    }
    return tokens[symbol].price
  }, [symbol, tokens, baseSymbol, baseTokenData])

  return (
    <div className={styles.container}>
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
      <BalanceInput
        symbol={toSymbol}
        color="blue"
        placeholder={checkNotZoroNum(fromAmount) ? minOutAmount.minout : '-'}
        amountUSD={minOutAmount.minout_tvl}
        disabled
        className={styles.inputItem}
        usd={nav_text}
        loading={priceLoading}
        // showRetry={minOutAmount.minout_ETH == '-'}
        // onRetry={() => getMinAmount(true)}
      />

      <DetailCell
        title="Mint Fee: "
        content={[`${fee}%`]}
        tooltip="Subtracted from amount received"
      />
      {showMinReceive ? (
        <DetailCell title="Min. Received:" content={[received, receivedTvl]} />
      ) : null}

      {pausedError ? <NoticeCard content={[pausedError]} /> : null}

      {showCapReachedError ||
      routeList.find((item) => item.routeType === routeTypeRef.current)
        ?.isCapReached ? (
        <NoticeCard content={[`${baseSymbol} cap has been reached.`]} />
      ) : null}

      {prices?.isShowErrorMaxMinPrice && (
        <NoticeMaxMinPrice
          maxPrice={prices.maxPrice}
          minPrice={prices.minPrice}
          isMint
        />
      )}

      <div className={styles.action}>
        {children}
        <BtnWapper
          loading={mintLoading}
          disabled={!canMint}
          onClick={handleMint}
          width="100%"
          auto={false}
        >
          {`Mint ${toSymbol}`}
        </BtnWapper>
      </div>

      {showRouteCard && symbol !== baseSymbol && (
        <RouteCard
          onRefresh={getMinAmount}
          options={routeList}
          routeType={routeTypeRef.current}
          onSelect={(_routeType) => {
            getMinAmount(false, _routeType)
          }}
          loading={priceLoading || !checkNotZoroNum(fromAmount)}
        />
      )}
    </div>
  )
}
