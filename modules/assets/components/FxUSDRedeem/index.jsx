import React, { useEffect, useMemo, useState, useRef } from 'react'
import { DownOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import BigNumber from 'bignumber.js'
import BalanceInput, { useClearInput } from '@/components/BalanceInput'
import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import {
  cBN,
  checkNotZoroNum,
  formatBalance,
  fb4,
  numberLess,
} from '@/utils/index'
import { useToken } from '@/hooks/useTokenInfo'
import noPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import styles from './styles.module.scss'
import useApprove from '@/hooks/useApprove'
import useGlobal from '@/hooks/useGlobal'
import { DetailCell, NoticeCard, BonusCard, NoticeMaxMinPrice } from '../Common'
import Button from '@/components/Button'
import {
  useFxUSD_GatewayRouter_contract,
  useFXUSD_contract,
} from '@/hooks/useFXUSDContract'
import { getZapOutParams, ROUTE_TYPE } from '@/hooks/useZap'
import useCurveSwapV2 from '@/hooks/useCurveSwapV2'
import RouteCard from '../RouteCard'
import useRouteList from '../RouteCard/useRouteList'
import useOutAmount from '../../hooks/useOutAmount'

const REDEEM_OPTIONS = {
  fxUSD: [
    ['stETH', config.tokens.stETH],
    ['frxETH', config.tokens.frxETH],
    ['WETH', config.tokens.weth],
    ['USDT', config.tokens.usdt],
    ['USDC', config.tokens.usdc],
    ['Frax', config.tokens.frax],
    ['crvUSD', config.tokens.crvUSD],
    ['wstETH', config.tokens.wstETH],
    ['sfrxETH', config.tokens.sfrxETH],
  ],
  rUSD: [
    // ['ETH', config.tokens.eth],
    // ['eETH', config.tokens.eETH],
    ['weETH', config.tokens.weETH],
    ['ezETH', config.tokens.ezETH],
    // ['USDT', config.tokens.usdt],
    // ['USDC', config.tokens.usdc],
    // ['crvUSD', config.tokens.crvUSD],
  ],
  btcUSD: [
    // ['ETH', config.tokens.eth],
    // ['USDT', config.tokens.usdt],
    // ['USDC', config.tokens.usdc],
    ['WBTC', config.tokens.WBTC],
  ],
}

export default function FxUSDRedeem({ slippage, assetInfo }) {
  const { showRouteCard } = useGlobal()
  const { _currentAccount, sendTransaction } = useWeb3()
  const [isLoading, setIsLoading] = useState(0)
  const { tokens } = useSelector((state) => state.token)
  const baseToken = useSelector((state) => state.baseToken)
  const [clearTrigger, clearInput] = useClearInput()

  const {
    symbol: fromSymbol,
    nav_text,
    isF,
    markets,
    baseTokenSymbols,
    address,
    baseList,
  } = assetInfo

  const { swapByCurve, getOutAmountByCurve } = useCurveSwapV2()
  const timerRef = useRef(null)

  const [symbol, setSymbol] = useState(baseTokenSymbols[0])
  const { contract: fxUSD_GatewayRouterContract } =
    useFxUSD_GatewayRouter_contract()

  const { contract: FXUSD_contract } = useFXUSD_contract(fromSymbol)

  const [bouns, setBonus] = useState([])

  const isSwap = false

  const [pausedError, setPausedError] = useState(false)
  const [showManaged, setShowManaged] = useState(false)

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

  const [baseSymbol, baseTokenData, managed, isRecap, isFXBouns] =
    useMemo(() => {
      const baseDataList = baseTokenSymbols.map((item) => baseToken[item].data)

      let _isRecap = false
      let _isFXBouns = false

      baseDataList.forEach((item) => {
        if (item.isRecap) {
          _isRecap = true
        }
        if (item.isFXBouns) {
          _isFXBouns = true
        }
      })

      if (baseTokenSymbols.includes(symbol)) {
        return [
          symbol,
          baseToken[symbol].data,
          cBN(markets?.[symbol]?.managed || 0),
          _isRecap,
          _isFXBouns,
        ]
      }

      if (fromSymbol === 'btcUSD') {
        const WBTC_m = cBN(markets?.WBTC?.managed || 0)

        return [
          'WBTC',
          baseToken[_baseSymbol].data,
          WBTC_m,
          _isRecap,
          _isFXBouns,
        ]
      }

      if (fromSymbol === 'rUSD') {
        const weETH_m = cBN(markets?.weETH?.managed || 0)
        const ezETH_m = cBN(markets?.ezETH?.managed || 0)

        if (['eETH'].includes(symbol)) {
          return ['weETH', baseToken.weETH.data, weETH_m, _isRecap, _isFXBouns]
        }

        const _baseSymbol = weETH_m.isGreaterThan(ezETH_m) ? 'weETH' : 'ezETH'

        return [
          _baseSymbol,
          baseToken[_baseSymbol].data,
          BigNumber.max(weETH_m, ezETH_m),
          _isRecap,
          _isFXBouns,
        ]
      }

      // fxUSD
      const wstETH_m = cBN(markets?.wstETH?.managed || 0)
      const sfrxETH_m = cBN(markets?.sfrxETH?.managed || 0)

      if (['stETH'].includes(symbol)) {
        return ['wstETH', baseToken.wstETH.data, wstETH_m, _isRecap, _isFXBouns]
      }
      if (['frxETH'].includes(symbol)) {
        return [
          'sfrxETH',
          baseToken.sfrxETH.data,
          sfrxETH_m,
          _isRecap,
          _isFXBouns,
        ]
      }
      const _baseSymbol = wstETH_m.isGreaterThan(sfrxETH_m)
        ? 'wstETH'
        : 'sfrxETH'

      return [
        _baseSymbol,
        baseToken[_baseSymbol].data,
        BigNumber.max(wstETH_m, sfrxETH_m),
        _isRecap,
        _isFXBouns,
      ]
    }, [baseToken, symbol, markets])

  const OPTIONS = REDEEM_OPTIONS[fromSymbol].filter(
    (item) => !(isRecap && baseTokenSymbols.includes(item[0]))
  )

  const {
    mintPaused,
    redeemPaused,
    fTokenMintPausedInStabilityMode,
    xTokenRedeemPausedInStabilityMode,

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
    reservePoolBalancesRes,
    price,
    bonusRatioRes,
    stabilityRatioRes,
    prices,
  } = baseTokenData

  const [fromAmount, setFromAmount] = useState(0)
  const [priceLoading, setPriceLoading] = useState(false)

  const { updateOutAmount, resetOutAmount, minOutAmount, getMinOutBySlippage } =
    useOutAmount(slippage)

  const [selectTokenAddress, tokenAmount] = useMemo(() => {
    let _tokenAmount = 0
    const _selectTokenAddress = address
    _tokenAmount = fromAmount
    return [_selectTokenAddress, _tokenAmount]
  }, [fromAmount])

  // const bonus_text = useMemo(() => {
  //   console.log('bouns--memo-', bouns.toString())
  //   return BigNumber.min(cBN(reservePoolBalancesRes), cBN(bouns))
  // }, [bouns, reservePoolBalancesRes, symbol])

  const canReceived = useMemo(() => {
    if (priceLoading) return false
    if (!minOutAmount.minout_slippage) return false
    return cBN(tokenAmount).isLessThanOrEqualTo(tokens[fromSymbol].balance)
  }, [
    tokenAmount,
    minOutAmount.minout_slippage,
    tokens[fromSymbol].balance,
    priceLoading,
  ])

  const fee = useMemo(() => {
    let _redeemFTokenFee = redeemFTokenFee
    let _redeemXTokenFee = redeemXTokenFee
    if (!isCRLow130) {
      _redeemFTokenFee = fTokenRedeemFeeRatioRes?.defaultFee || 0
      _redeemXTokenFee = xTokenRedeemFeeRatioRes?.defaultFee || 0
    }
    const _fee = cBN(_redeemFTokenFee)
      .plus(cBN(isSwap ? mintXTokenFee : 0))
      .multipliedBy(100)
      .toString(10)

    return formatBalance(_fee)
  }, [isCRLow130, isSwap, baseTokenData])

  const hanldeFromAmountChanged = (v) => {
    setFromAmount(v.toString(10))
  }

  const selectTokenInfo = useToken(selectTokenAddress, 'fxUSD_gateway_router')

  const { BtnWapper, needApprove } = useApprove({
    approveAmount: tokenAmount,
    allowance: selectTokenInfo.allowance,
    tokenContract: selectTokenInfo.contract,
    approveAddress: selectTokenInfo.contractAddress,
  })

  const _account = useMemo(() => {
    const isInsufficient = cBN(tokenAmount).isGreaterThan(
      tokens[fromSymbol].balance
    )

    if (isInsufficient) {
      return config.approvedAddress
    }

    if (symbol === baseSymbol) {
      return _currentAccount
    }
    return needApprove ? config.approvedAddress : _currentAccount
  }, [
    needApprove,
    _currentAccount,
    tokenAmount,
    symbol,
    baseSymbol,
    tokens[fromSymbol].balance,
  ])

  const checkPause = () => {
    let _fTokenMintPausedInStabilityMode = false

    // redeem
    if (redeemPaused) {
      setPausedError(
        'f(x) governance decision to temporarily disable redemption.'
      )
      return true
    }

    if (isSwap) {
      // mint
      if (symbol === 'fETH') {
        _fTokenMintPausedInStabilityMode =
          fTokenMintPausedInStabilityMode && isCRLow130
      }
      if (mintPaused || _fTokenMintPausedInStabilityMode) {
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
    if (checkPause() || priceLoading) {
      return false
    }
    let _enableETH = cBN(tokenAmount).isGreaterThan(0)

    _enableETH =
      _enableETH &&
      cBN(tokenAmount).isLessThanOrEqualTo(tokens[fromSymbol].balance)

    return _enableETH && (needApprove || minOutAmount.minout)
  }, [
    tokenAmount,
    redeemPaused,
    mintPaused,
    fTokenMintPausedInStabilityMode,
    xTokenRedeemPausedInStabilityMode,
    tokens[fromSymbol].balance,
    minOutAmount,
    priceLoading,
    needApprove,
  ])

  useEffect(() => {
    checkPause()
  }, [
    redeemPaused,
    mintPaused,
    fTokenMintPausedInStabilityMode,
    isSwap,
    xTokenRedeemPausedInStabilityMode,
  ])

  const initPage = () => {
    setFromAmount(0)
    clearInput()
    resetOutAmount()
    setBonus([])
    routeTypeRef.current = ''
  }

  useEffect(() => {
    resetOutAmount()
    setBonus([])
  }, [symbol])

  const getMinAmount = async (needLoading, _routeType) => {
    clearTimeout(timerRef.curent)
    timerRef.curent = setTimeout(() => {
      getMinAmount(true)
    }, 20000)

    setShowManaged(false)
    if (needLoading) {
      setPriceLoading(true)
      routeTypeRef.current = ''
    }

    setBonus([])
    let _mockAmount = tokenAmount
    let _mockRatio = 1
    const __bonus = []

    // 默认比例 0.01
    if (_account !== _currentAccount) {
      _mockAmount = cBN(1).shiftedBy(18).toString()
      _mockRatio = cBN(tokenAmount).div(cBN(10).pow(18)).toFixed(4, 1)
    }

    try {
      let minout_ETH
      let min_baseOuts = []
      const _symbolAddress = OPTIONS.find((item) => item[0] == symbol)[1]

      if (checkNotZoroNum(fromAmount)) {
        let resData
        if (isBaseSymbol) {
          resData = await FXUSD_contract.methods
            .redeem(config.tokens[symbol], _mockAmount, _account, 0)
            .call({
              from: _account,
            })

          minout_ETH = resData._amountOut * _mockRatio
          if (Number(resData._bonusOut)) {
            __bonus.push({
              bonus: cBN(resData._bonusOut),
              symbol,
            })
          }
        } else {
          let list
          if (_routeType && routeList.length) {
            list = routeList
            routeTypeRef.current = _routeType
          } else {
            list = await refreshRouteList(
              {
                from: fromSymbol,
                to: symbol,
                amount: _mockAmount,
                slippage,
                symbol,
                decimals: config.zapTokens[symbol].decimals,
                isZapIn: false,
                price: toUsd,
              },
              async (params) => {
                let res
                if (params?.routeType === ROUTE_TYPE.CURVE) {
                  res = await getOutAmountByCurve({
                    from: address,
                    decimals: 18,
                    to: config.zapTokens[symbol].address,
                    amount: _mockAmount,
                  })
                  res = {
                    _dstOut: cBN(res)
                      .multipliedBy(10 ** config.zapTokens[symbol].decimals)
                      .toString(),
                  }
                } else {
                  const convertParamsList = baseTokenSymbols.map((item) =>
                    getZapOutParams(config.tokens[item], _symbolAddress)
                  )

                  res = await fxUSD_GatewayRouterContract.methods
                    .fxAutoRedeemFxUSD(
                      convertParamsList,
                      address,
                      _mockAmount,
                      new Array(baseTokenSymbols.length).fill(0),
                      0
                    )
                    .call({
                      from: _account,
                    })
                }

                // 比例计算
                return {
                  outAmount: res._dstOut * _mockRatio,
                  result: res,
                }
              }
            )
          }

          const { amount, result } =
            list.find((item) => item.routeType === routeTypeRef.current) ||
            list[0]

          if (!routeTypeRef.current) {
            routeTypeRef.current = list[0].routeType
          }

          minout_ETH = amount

          const { _baseOuts = [], _bonusOuts = [] } = result
          min_baseOuts = _baseOuts
          _bonusOuts.forEach((item, index) => {
            if (Number(item)) {
              __bonus.push({
                bonus: cBN(item),
                symbol: baseTokenSymbols[index],
              })
            }
          })
        }
      } else {
        minout_ETH = 0
        min_baseOuts = []
      }

      const _minOut = updateOutAmount(
        minout_ETH,
        toUsd,
        config.zapTokens[symbol].decimals
      )

      setBonus(
        __bonus.map((item) => ({
          ...item,
          bonus: item.bonus.multipliedBy(_mockRatio),
        }))
      )
      setPriceLoading(false)

      return [_minOut, min_baseOuts]
    } catch (error) {
      resetOutAmount()
      setBonus([])
      setPriceLoading(false)
      if (
        error?.message &&
        error.message.includes('burn amount exceeds balance') &&
        managed.isLessThan(fromAmount)
      ) {
        setShowManaged(true)
      }
      return 0
    }
  }

  const handleRedeem = async () => {
    // if (isSwap) {
    //   handleSwap()
    //   return
    // }

    try {
      setIsLoading(true)
      if (routeTypeRef.current === ROUTE_TYPE.CURVE) {
        await swapByCurve({
          from: address,
          decimals: 18,
          to: config.zapTokens[symbol].address,
          amount: fromAmount,
          slippage,
        })
      } else {
        const [_minoutETH, min_baseOuts] = await getMinAmount()

        const _min_baseOuts = min_baseOuts.map((item) =>
          getMinOutBySlippage(item)
        )

        let apiCall
        let to

        if (isBaseSymbol) {
          to = FXUSD_contract._address
          apiCall = await FXUSD_contract.methods.redeem(
            config.tokens[symbol],
            fromAmount,
            _currentAccount,
            _minoutETH
          )
        } else {
          to = fxUSD_GatewayRouterContract._address
          const _symbolAddress = OPTIONS.find((item) => item[0] == symbol)[1]

          const t_list = baseTokenSymbols.map((item, index) =>
            cBN(min_baseOuts[index]).multipliedBy(tokens[item].price)
          )

          let sum = cBN(0)

          t_list.forEach((item) => {
            sum = sum.plus(item)
          })

          const minOut_list = t_list.map((item) =>
            item.multipliedBy(_minoutETH).dividedBy(sum).toFixed(0, 1)
          )

          const convertParamsList = baseTokenSymbols.map((item, index) =>
            getZapOutParams(
              config.tokens[item],
              _symbolAddress,
              minOut_list[index]
            )
          )

          apiCall = await fxUSD_GatewayRouterContract.methods.fxAutoRedeemFxUSD(
            convertParamsList,
            address,
            fromAmount,
            _min_baseOuts,
            _minoutETH
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
      }
      setIsLoading(false)
      initPage()
    } catch (e) {
      console.log('redeem---fxUSD--error', _currentAccount, e)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getMinAmount(true)
  }, [isF, slippage, tokenAmount, symbol, _account, showRouteCard])

  const toUsd = useMemo(() => {
    if (symbol === baseSymbol) {
      return baseTokenData?.baseTokenPrices?.inRedeemF
    }
    if (baseList.filter((item) => item !== 'ETH').includes(symbol)) {
      return baseTokenData.prices?.inRedeemF
    }
    return tokens[symbol].price
  }, [symbol, baseSymbol, tokens, baseToken, baseTokenData])

  return (
    <div className={styles.container}>
      {isFXBouns ? (
        <BonusCard
          title={`Redeem ${fromSymbol} could potentially earn ${fb4(
            cBN(bonusRatioRes),
            false,
            16
          )}% bonus when CR < ${fb4(stabilityRatioRes, false, 16)}%`}
          amount=""
          symbol=""
        />
      ) : null}
      <BalanceInput
        placeholder="-"
        balance={fb4(tokens[fromSymbol].balance, false)}
        symbol={fromSymbol}
        color="deep-green"
        className={styles.inputItem}
        usd={nav_text}
        maxAmount={tokens[fromSymbol].balance}
        onChange={hanldeFromAmountChanged}
        clearTrigger={clearTrigger}
      />
      <div className={styles.arrow}>
        <DownOutlined />
      </div>

      <BalanceInput
        symbol={symbol}
        placeholder={minOutAmount.minout}
        amountUSD={priceLoading ? '-' : minOutAmount.minout_tvl}
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
            minOutAmount.minout_slippage_tvl,
          ]}
        />
      )}
      {isFXBouns && bouns.length
        ? bouns.map((item, index) => (
            <DetailCell
              title={!index && `Redeem ${fromSymbol} Bonus:`}
              content={[
                numberLess(
                  fb4(item.bonus, false, config.TOKENS_INFO[item.symbol][2]),
                  0.01
                ),
                '',
                item.symbol,
              ]}
            />
          ))
        : null}
      {pausedError ? <NoticeCard content={[pausedError]} /> : null}
      {showManaged ? (
        <NoticeCard
          content={[
            `A maximum of ${fb4(managed)} ${fromSymbol} can be redeemed `,
          ]}
        />
      ) : null}

      {prices?.isShowErrorMaxMinPrice && (
        <NoticeMaxMinPrice
          maxPrice={prices.maxPrice}
          minPrice={prices.minPrice}
        />
      )}

      <div className={styles.action}>
        {routeTypeRef.current === ROUTE_TYPE.CURVE || symbol === baseSymbol ? (
          <Button
            style={{ fontSize: '20px' }}
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
