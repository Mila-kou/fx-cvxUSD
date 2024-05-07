/* eslint-disable no-lonely-if */
import React, { useEffect, useMemo, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { DownOutlined } from '@ant-design/icons'
import BigNumber from 'bignumber.js'
import BalanceInput, { useClearInput } from '@/components/BalanceInput'
import useWeb3 from '@/hooks/useWeb3'
import { cBN, checkNotZoroNum, formatBalance, fb4 } from '@/utils/index'
import { useToken } from '@/hooks/useTokenInfo'
import noPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import { getGas } from '@/utils/gas'
import { DetailCell, NoticeCard, BonusCard } from '../Common'
import styles from './styles.module.scss'
import config from '@/config/index'
import useApprove from '@/hooks/useApprove'
import { ROUTE_TYPE, useZapIn } from '@/hooks/useZap'
import {
  useFXUSD_contract,
  useFxUSD_GatewayRouter_contract,
} from '@/hooks/useFXUSDContract'
import useGlobal from '@/hooks/useGlobal'
import useOutAmount from '../../hooks/useOutAmount'
import useCurveSwapV2 from '@/hooks/useCurveSwapV2'
import RouteCard from '../RouteCard'
import useRouteList from '../RouteCard/useRouteList'
import Button from '@/components/Button'

const MINT_OPTIONS = {
  fxUSD: [
    ['ETH', config.tokens.eth],
    ['stETH', config.tokens.stETH],
    ['frxETH', config.tokens.frxETH],
    ['USDT', config.tokens.usdt],
    ['USDC', config.tokens.usdc],
    ['Frax', config.tokens.frax],
    ['crvUSD', config.tokens.crvUSD],
    ['wstETH', config.tokens.wstETH],
    ['sfrxETH', config.tokens.sfrxETH],
  ],
  rUSD: [
    ['ETH', config.tokens.eth],
    ['eETH', config.tokens.eETH],
    ['USDT', config.tokens.usdt],
    ['USDC', config.tokens.usdc],
    ['crvUSD', config.tokens.crvUSD],
    ['weETH', config.tokens.weETH],
    ['ezETH', config.tokens.ezETH],
  ],
  btcUSD: [
    ['ETH', config.tokens.eth],
    ['USDT', config.tokens.usdt],
    ['USDC', config.tokens.usdc],
    ['WBTC', config.tokens.WBTC],
  ],
}

export default function FxUSDMint({ slippage, assetInfo }) {
  const { showRouteCard } = useGlobal()
  const { _currentAccount, sendTransaction } = useWeb3()
  const { tokens } = useSelector((state) => state.token)
  const baseToken = useSelector((state) => state.baseToken)
  const [clearTrigger, clearInput] = useClearInput()
  const { getZapInParams } = useZapIn()
  const { swapByCurve, getOutAmountByCurve } = useCurveSwapV2()
  const timerRef = useRef(null)

  const {
    isF,
    symbol: toSymbol,
    nav_text,
    markets,
    baseList,
    address,
    baseTokenSymbols,
  } = assetInfo

  const OPTIONS = MINT_OPTIONS[toSymbol].filter((item) => item[0] !== toSymbol)

  const [pausedError, setPausedError] = useState(false)
  const [symbol, setSymbol] = useState(baseTokenSymbols[0])
  const { contract: fxUSD_GatewayRouterContract } =
    useFxUSD_GatewayRouter_contract()
  const { contract: FXUSD_contract } = useFXUSD_contract(toSymbol)
  const [baseSymbol, setBaseSymbol] = useState(baseTokenSymbols[0])

  const baseTokenData = useMemo(
    () => baseToken[baseSymbol].data,
    [baseToken, baseSymbol]
  )

  const isRecap = useMemo(() => {
    let flag = false

    baseTokenSymbols.forEach((item) => {
      if (baseToken[item].data?.isRecap) {
        flag = true
      }
    })

    return flag
  }, [baseToken])

  const minGas = 234854
  const [fromAmount, setFromAmount] = useState(0)

  const { updateOutAmount, resetOutAmount, minOutAmount } =
    useOutAmount(slippage)

  const [priceLoading, setPriceLoading] = useState(false)
  const [mintLoading, setMintLoading] = useState(false)

  const routeTypeRef = useRef(null)
  const { routeList, refreshRouteList } = useRouteList()

  const isBaseSymbol = useMemo(
    () => baseTokenSymbols.includes(symbol),
    [symbol]
  )

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.curent)
    }
  }, [])

  useEffect(() => {
    if (toSymbol === 'fxUSD') {
      const wstETH_data = baseToken.wstETH.data
      const sfrxETH_data = baseToken.sfrxETH.data

      if (['stETH', 'wstETH'].includes(symbol)) {
        setBaseSymbol('wstETH')
        return
      }
      if (['frxETH', 'sfrxETH'].includes(symbol)) {
        setBaseSymbol('sfrxETH')
        return
      }

      if (
        cBN(wstETH_data.fTokenTotalSupplyRes).isGreaterThan(
          markets?.wstETH.mintCap
        ) ||
        !wstETH_data.isBaseTokenPriceValid
      ) {
        setBaseSymbol('sfrxETH')
        return
      }

      if (
        cBN(sfrxETH_data.fTokenTotalSupplyRes).isGreaterThan(
          markets?.sfrxETH.mintCap
        ) ||
        !sfrxETH_data.isBaseTokenPriceValid
      ) {
        setBaseSymbol('wstETH')
        return
      }

      const _baseSymbol = cBN(wstETH_data.collateralRatioRes).isGreaterThan(
        sfrxETH_data.collateralRatioRes
      )
        ? 'wstETH'
        : 'sfrxETH'

      setBaseSymbol(_baseSymbol)
    }

    if (toSymbol === 'rUSD') {
      const weETH_data = baseToken.weETH.data
      const ezETH_data = baseToken.ezETH.data

      if (['weETH'].includes(symbol)) {
        setBaseSymbol('weETH')
        return
      }
      if (['ezETH'].includes(symbol)) {
        setBaseSymbol('ezETH')
        return
      }

      if (
        cBN(weETH_data.fTokenTotalSupplyRes).isGreaterThan(
          markets?.weETH.mintCap
        ) ||
        !weETH_data.isBaseTokenPriceValid
      ) {
        setBaseSymbol('ezETH')
        return
      }

      if (
        cBN(ezETH_data.fTokenTotalSupplyRes).isGreaterThan(
          markets?.ezETH.mintCap
        ) ||
        !ezETH_data.isBaseTokenPriceValid
      ) {
        setBaseSymbol('weETH')
        return
      }

      const _baseSymbol = cBN(weETH_data.collateralRatioRes).isGreaterThan(
        ezETH_data.collateralRatioRes
      )
        ? 'weETH'
        : 'ezETH'

      setBaseSymbol(_baseSymbol)
    }

    if (toSymbol === 'btcUSD') {
      setBaseSymbol('WBTC')
    }
  }, [baseToken, symbol, markets, setBaseSymbol, toSymbol])

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
    maxMintableFTokenRes,
  } = baseTokenData

  const isSwap = false

  const selectTokenAddress = useMemo(() => {
    return OPTIONS.find((item) => item[0] === symbol)[1]
  }, [symbol])

  useEffect(() => {
    initPage()
  }, [symbol])

  const getContractAddress = () => {
    if (isBaseSymbol) return toSymbol
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
  }, [isF, isCRLow130, isSwap, baseTokenData])

  const hanldeETHAmountChanged = (v) => {
    setFromAmount(v.toString(10))
  }

  const initPage = () => {
    clearInput()
    setFromAmount('0')
    resetOutAmount()
    routeTypeRef.current = ''
  }

  const getMinAmount = async (needLoading, _routeType) => {
    clearTimeout(timerRef.curent)
    timerRef.curent = setTimeout(() => {
      getMinAmount(true)
    }, 20000)

    if (needLoading) {
      setPriceLoading(true)
      routeTypeRef.current = ''
    }

    let _mockAmount = fromAmount
    let _mockRatio = 1

    let isBTCMock = false

    // 默认比例 0.01
    if (_account !== _currentAccount) {
      isBTCMock = !isBaseSymbol && toSymbol === 'btcUSD'
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
        let resData

        if (isBaseSymbol) {
          resData = await FXUSD_contract.methods
            .mint(config.tokens[symbol], _ETHtAmountAndGas, _account, 0)
            .call({
              from: _account,
            })
          minout_ETH = resData * _mockRatio
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
              _ETHtAmountAndGas = cBN(tokens.ETH.balance)
                .minus(gasFee)
                .toFixed(0, 1)
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
                amount: isBTCMock ? fromAmount : _ETHtAmountAndGas,
                slippage,
                symbol: toSymbol,
              },
              async ([convertParams, baseOutAmount]) => {
                let res
                if (convertParams?.routeType === ROUTE_TYPE.CURVE) {
                  res = await getOutAmountByCurve({
                    from: config.zapTokens[symbol].address,
                    decimals: config.zapTokens[symbol].decimals,
                    to: address,
                    amount: _ETHtAmountAndGas,
                  })
                  res = cBN(res).multipliedBy(1e18).toString()
                } else {
                  console.log(
                    'fxUSD_GatewayRouterContract--传参--',
                    JSON.stringify([
                      convertParams,
                      address,
                      config.tokens[baseSymbol],
                      0,
                    ])
                  )
                  if (isBTCMock) {
                    const { decimals } = config.zapTokens[baseSymbol]
                    resData = await FXUSD_contract.methods
                      .mint(
                        config.tokens[baseSymbol],
                        cBN(0.01).shiftedBy(decimals).toString(),
                        _account,
                        0
                      )
                      .call({
                        from: _account,
                      })
                    res =
                      resData *
                      cBN(baseOutAmount).div(cBN(0.01).shiftedBy(decimals))
                  } else {
                    res = await fxUSD_GatewayRouterContract.methods
                      .fxMintFxUSD(
                        convertParams,
                        address,
                        config.tokens[baseSymbol],
                        0
                      )
                      .call({
                        from: _account,
                        value: symbol == 'ETH' ? _ETHtAmountAndGas : 0,
                      })
                  }
                }
                // 比例计算
                return {
                  outAmount: isBTCMock ? res : res * _mockRatio,
                  result: res,
                }
              }
            )
          }

          const { amount } =
            list.find((item) => item.routeType === routeTypeRef.current) ||
            list[0]

          if (!routeTypeRef.current) {
            routeTypeRef.current = list[0].routeType
          }
          minout_ETH = amount
        }
      } else {
        minout_ETH = 0
      }

      if (_account !== _currentAccount) {
        minout_ETH = BigNumber.min(
          cBN(maxMintableFTokenRes),
          cBN(minout_ETH)
        ).toString()
      }

      const _minOut = updateOutAmount(minout_ETH, 1)

      setPriceLoading(false)
      return _minOut
    } catch (error) {
      console.log('fxMintFxUSD--finnal--error--', _account, error)
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

      if (routeTypeRef.current === ROUTE_TYPE.CURVE) {
        await swapByCurve({
          from: config.zapTokens[symbol].address,
          decimals: config.zapTokens[symbol].decimals,
          to: address,
          amount: _ETHtAmountAndGas,
          slippage,
        })
      } else {
        const _minOut = await getMinAmount()

        if (!checkNotZoroNum(_minOut)) {
          setMintLoading(false)
          return
        }
        let apiCall
        let to
        if (isBaseSymbol) {
          to = FXUSD_contract._address

          apiCall = await FXUSD_contract.methods.mint(
            config.tokens[symbol],
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
            routeType: routeTypeRef.current,
          })

          apiCall = await fxUSD_GatewayRouterContract.methods.fxMintFxUSD(
            convertParams,
            address,
            config.tokens[baseSymbol],
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
      }

      setMintLoading(false)
      initPage()
    } catch (error) {
      console.log('mint----fxUSD---error---', _currentAccount, error)
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
      !isBaseTokenPriceValid ||
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
  }, [isF, slippage, fromAmount, _account, showRouteCard])

  const fromUsd = useMemo(() => {
    if (symbol === baseSymbol) {
      return baseTokenData?.baseTokenPrices?.inMint
    }

    if (baseList.includes(symbol)) {
      return baseTokenData?.prices?.inMint
    }

    return tokens[symbol].price
  }, [symbol, tokens, baseToken, baseTokenData])

  return (
    <div className={styles.container}>
      <BalanceInput
        placeholder="-"
        symbol={symbol}
        decimals={config.zapTokens[symbol].decimals}
        balance={fb4(
          tokens[symbol].balance,
          false,
          config.zapTokens[symbol].decimals,
          config.zapTokens[symbol].decimals === 8 ? 4 : 2
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
        color="deep-green"
        placeholder={checkNotZoroNum(fromAmount) ? minOutAmount.minout : '-'}
        amountUSD={
          priceLoading || !checkNotZoroNum(fromAmount)
            ? '-'
            : minOutAmount.minout_tvl
        }
        disabled
        className={styles.inputItem}
        usd={nav_text}
        loading={priceLoading}
        // showRetry={minOutAmount.minout == '-'}
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

      <div className={styles.action}>
        {routeTypeRef.current === ROUTE_TYPE.CURVE ? (
          <Button
            style={{ fontSize: '20px' }}
            loading={mintLoading}
            disabled={!canMint}
            onClick={handleMint}
            width="100%"
          >
            {`Mint ${toSymbol}`}
          </Button>
        ) : (
          <BtnWapper
            loading={mintLoading}
            disabled={!canMint}
            onClick={handleMint}
            width="100%"
            auto={false}
          >
            {`Mint ${toSymbol}`}
          </BtnWapper>
        )}
      </div>

      {showRouteCard && !isBaseSymbol && (
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
