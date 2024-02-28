import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { DownOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import BigNumber from 'bignumber.js'
import BalanceInput, { useClearInput } from '@/components/BalanceInput'
import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import { cBN, checkNotZoroNum, checkNotZoroNumOption, fb4 } from '@/utils/index'
import { useToken } from '@/hooks/useTokenInfo'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import styles from './styles.module.scss'
import useApprove from '@/hooks/useApprove'
import { DetailCell, NoticeCard, BonusCard } from '../Common'
import Button from '@/components/Button'
import {
  useFxUSD_GatewayRouter_contract,
  useFXUSD_contract,
} from '@/hooks/useFXUSDContract'
import { getZapOutParams } from '@/hooks/useZap'

/**
 * 选择baseToken时，展示其最大的可Redeem数量： managed
 * zap时，展示两种managed 之和
 */

/**
 * isRecap 时，没有baseToken选项
 */

/**
 * ------ redeem
 *（Redeem）wstETH     sfrxETH  （baseToken）
 * WETH        有           有
 * stETH       有           无
 * frxETH      无           有
 * USDT        无           无
 * USDC        有           有
 * Frax        无           无
 * crvUSD      无           无
 * wstETH
 * sfrxETH
 */

export default function FxUSDRedeem({ slippage, assetInfo }) {
  const { _currentAccount } = useWeb3()
  const [isLoading, setIsLoading] = useState(0)
  const { tokens } = useSelector((state) => state.token)
  const baseToken = useSelector((state) => state.baseToken)
  const [clearTrigger, clearInput] = useClearInput()

  const [symbol, setSymbol] = useState('stETH')
  const { contract: fxUSD_GatewayRouterContract } =
    useFxUSD_GatewayRouter_contract()

  const { contract: FXUSD_contract } = useFXUSD_contract()

  const [bouns, setBonus] = useState([])

  const { nav_text, isF, markets } = assetInfo

  const isSwap = useMemo(() => ['xstETH', 'xfrxETH'].includes(symbol), [symbol])

  const [pausedError, setPausedError] = useState(false)
  const [showManaged, setShowManaged] = useState(false)

  const [baseSymbol, baseTokenData, managed, isRecap, isFXBouns] =
    useMemo(() => {
      const wstETH_m = cBN(markets?.wstETH?.managed || 0)
      const sfrxETH_m = cBN(markets?.sfrxETH?.managed || 0)

      const _isRecap =
        baseToken.wstETH.data?.isRecap || baseToken.sfrxETH.data?.isRecap

      const _isFXBouns =
        baseToken.wstETH.data?.isFXBouns || baseToken.sfrxETH.data?.isFXBouns

      if (['wstETH', 'stETH'].includes(symbol)) {
        return ['wstETH', baseToken.wstETH.data, wstETH_m, _isRecap, _isFXBouns]
      }
      if (symbol == 'sfrxETH') {
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

  const OPTIONS = [
    ['stETH', config.tokens.stETH],
    ['frxETH', config.tokens.frxETH],
    ['WETH', config.tokens.weth],
    ['USDT', config.tokens.usdt],
    ['USDC', config.tokens.usdc],
    ['Frax', config.tokens.frax],
    ['crvUSD', config.tokens.crvUSD],
    ['wstETH', config.tokens.wstETH],
    ['sfrxETH', config.tokens.sfrxETH],
  ].filter((item) => !(isRecap && ['wstETH', 'sfrxETH'].includes(item[0])))

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
  } = baseTokenData

  const [fromAmount, setFromAmount] = useState(0)
  const [priceLoading, setPriceLoading] = useState(false)
  const [minOutETHtAmount, setMinOutETHtAmount] = useState({
    minout_slippage: 0,
    minout_slippage_tvl: 0,
  })

  const [selectTokenAddress, tokenAmount] = useMemo(() => {
    let _tokenAmount = 0
    const _selectTokenAddress = config.tokens.fxUSD
    _tokenAmount = fromAmount
    return [_selectTokenAddress, _tokenAmount]
  }, [fromAmount])

  // const bonus_text = useMemo(() => {
  //   console.log('bouns--memo-', bouns.toString())
  //   return BigNumber.min(cBN(reservePoolBalancesRes), cBN(bouns))
  // }, [bouns, reservePoolBalancesRes, symbol])

  const canReceived = useMemo(() => {
    if (priceLoading) return false
    if (!minOutETHtAmount.minout_slippage) return false
    return cBN(tokenAmount).isLessThanOrEqualTo(tokens.fxUSD.balance)
  }, [
    tokenAmount,
    minOutETHtAmount.minout_slippage,
    tokens.fxUSD.balance,
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

    return fb4(_fee)
  }, [isCRLow130, isSwap])

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
    const isInsufficient = cBN(tokenAmount).isGreaterThan(tokens.fxUSD.balance)

    if (isInsufficient) {
      return config.approvedAddress
    }
    return needApprove ? config.approvedAddress : _currentAccount
  }, [needApprove, _currentAccount, tokenAmount, symbol, tokens.fxUSD.balance])

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
      _enableETH && cBN(tokenAmount).isLessThanOrEqualTo(tokens.fxUSD.balance)

    return _enableETH && (needApprove || minOutETHtAmount.minout_ETH)
  }, [
    tokenAmount,
    redeemPaused,
    mintPaused,
    fTokenMintPausedInStabilityMode,
    xTokenRedeemPausedInStabilityMode,
    tokens.fxUSD.balance,
    minOutETHtAmount,
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
    setMinOutETHtAmount({
      minout_ETH: '-',
      minout_slippage: 0,
      minout_slippage_tvl: 0,
    })
    setBonus([])
  }

  useEffect(() => {
    setMinOutETHtAmount({
      minout_ETH: '-',
      minout_slippage: 0,
      minout_slippage_tvl: 0,
    })
    setBonus([])
  }, [symbol])

  const getMinAmount = async (needLoading) => {
    setShowManaged(false)
    if (needLoading) {
      setPriceLoading(true)
    }

    setBonus([])
    let _mockAmount = tokenAmount
    let _mockRatio = 1
    const __bonus = []

    console.log('_account----', _account)
    // 默认比例 0.01
    if (_account !== _currentAccount) {
      _mockAmount = cBN(1).shiftedBy(18).toString()
      _mockRatio = cBN(tokenAmount).div(cBN(10).pow(18)).toFixed(4, 1)
    }

    try {
      let minout_ETH
      const _symbolAddress = OPTIONS.find((item) => item[0] == symbol)[1]

      console.log('_symbolAddress--', symbol, _symbolAddress)
      if (checkNotZoroNum(fromAmount)) {
        let resData
        if (['wstETH', 'sfrxETH'].includes(symbol)) {
          // if (isRecap) {
          //   resData = await FXUSD_contract.methods
          //     .autoRedeem(fromAmount, _account, [0, 0])
          //     .call({
          //       from: _account,
          //     })
          //   console.log('resData----', resData)
          //   minout_ETH = cBN(resData._amountOuts[0]).plus(
          //     resData._amountOuts[1]
          //   )
          //   __bonus = cBN(resData._bonusOuts[0])
          // } else {
          console.log('redeem----', _account, fromAmount)
          resData = await FXUSD_contract.methods
            .redeem(config.tokens[symbol], fromAmount, _account, 0)
            .call({
              from: _account,
            })

          console.log('resData----', _account, fromAmount, resData)
          minout_ETH = resData._amountOut
          if (Number(resData._bonusOut)) {
            __bonus.push({
              bonus: cBN(resData._bonusOut),
              symbol,
            })
          }
          // }
        } else {
          console.log('fxAutoRedeemFxUSD-----', _account, fromAmount)
          const convertParams_baseToken_1 = getZapOutParams(
            config.tokens.wstETH,
            _symbolAddress
          )

          const convertParams_baseToken_2 = getZapOutParams(
            config.tokens.sfrxETH,
            _symbolAddress
          )
          console.log(
            'convertParams_baseToken----',
            convertParams_baseToken_1,
            convertParams_baseToken_2
          )

          resData = await fxUSD_GatewayRouterContract.methods
            .fxAutoRedeemFxUSD(
              [convertParams_baseToken_1, convertParams_baseToken_2],
              _mockAmount,
              [0, 0]
            )
            .call({
              from: _account,
            })

          minout_ETH = resData._dstOut

          resData._bonusOuts.forEach((item, index) => {
            if (Number(item)) {
              __bonus.push({
                bonus: cBN(item),
                symbol: index ? 'sfrxETH' : 'wstETH',
              })
            }
          })
          console.log(
            'fxAutoRedeemFxUSD--resData-',
            _account,
            resData,
            minout_ETH
          )
        }
      } else {
        minout_ETH = 0
      }

      // 比例计算
      minout_ETH *= _mockRatio

      const _minOut_CBN = (cBN(minout_ETH) || cBN(0)).multipliedBy(
        cBN(1).minus(cBN(slippage).dividedBy(100))
      )
      const _minOut_fETH_tvl = fb4(_minOut_CBN.multipliedBy(1).toString(10))
      setMinOutETHtAmount({
        minout_ETH: checkNotZoroNumOption(
          minout_ETH,
          fb4(minout_ETH.toString(10), false, config.zapTokens[symbol].decimals)
        ),
        minout_slippage: fb4(
          _minOut_CBN.toString(10),
          false,
          config.zapTokens[symbol].decimals
        ),
        minout_slippage_tvl: _minOut_fETH_tvl,
      })

      setBonus(
        __bonus.map((item) => ({
          ...item,
          bonus: item.bonus.multipliedBy(_mockRatio),
        }))
      )
      setPriceLoading(false)
      return _minOut_CBN.toFixed(0, 1)
    } catch (error) {
      setMinOutETHtAmount({
        minout_ETH: 0,
        minout_slippage: 0,
        minout_slippage_tvl: 0,
      })
      setBonus([])
      setPriceLoading(false)
      // if (
      //   error?.message &&
      //   error.message.includes('burn amount exceeds balance')
      // ) {
      //   setShowManaged(true)
      // }
      return 0
    }
  }

  const handleSwap = async () => {
    // try {
    //   setIsLoading(true)
    //   const _minOut = await getMinAmount()
    //   const apiCall = await FxGatewayContract.methods.swap(
    //     fromAmount,
    //     symbol === 'xETH',
    //     _minOut
    //   )
    //   const estimatedGas = await apiCall.estimateGas({
    //     from: _currentAccount,
    //   })
    //   const gas = parseInt(estimatedGas * 1, 10) || 0
    //   await NoPayableAction(
    //     () =>
    //       apiCall.send({
    //         from: _currentAccount,
    //         gas,
    //       }),
    //     {
    //       key: 'Redeem',
    //       action: 'Redeem',
    //     }
    //   )
    //   setIsLoading(false)
    //   initPage()
    // } catch (error) {
    //   setIsLoading(false)
    //   noPayableErrorAction(`error_mint`, error)
    // }
  }

  const handleRedeem = async () => {
    // if (isSwap) {
    //   handleSwap()
    //   return
    // }

    try {
      setIsLoading(true)
      const _minoutETH = await getMinAmount()

      let apiCall

      if (['wstETH', 'sfrxETH'].includes(symbol)) {
        // if (isRecap) {
        //   apiCall = await FXUSD_contract.methods.autoRedeem(
        //     fromAmount,
        //     _currentAccount,
        //     [0, 0]
        //   )
        // } else {
        apiCall = await FXUSD_contract.methods.redeem(
          config.tokens[symbol],
          fromAmount,
          _currentAccount,
          _minoutETH
        )
        // }
      } else {
        const _symbolAddress = OPTIONS.find((item) => item[0] == symbol)[1]
        const convertParams_baseToken_1 = getZapOutParams(
          config.tokens.wstETH,
          _symbolAddress
        )

        const convertParams_baseToken_2 = getZapOutParams(
          config.tokens.sfrxETH,
          _symbolAddress
        )

        apiCall = await fxUSD_GatewayRouterContract.methods.fxAutoRedeemFxUSD(
          [convertParams_baseToken_1, convertParams_baseToken_2],
          fromAmount,
          [0, 0]
        )
      }

      console.log('apiCall--apiCall--', apiCall.encodeABI())
      const estimatedGas = await apiCall.estimateGas({
        from: _currentAccount,
      })
      const gas = parseInt(estimatedGas * 1, 10) || 0
      await NoPayableAction(
        () => apiCall.send({ from: _currentAccount, gas }),
        {
          key: 'Redeem',
          action: 'Redeem',
        }
      )
      setIsLoading(false)
      initPage()
    } catch (e) {
      console.log('redeem---fxUSD--error', _currentAccount, e)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getMinAmount(true)
  }, [isF, slippage, tokenAmount, symbol, _account])

  const toUsd = useMemo(() => {
    if (symbol === 'wstETH') {
      return baseToken.wstETH.data?.baseTokenPrices?.inRedeemF
    }
    if (symbol === 'stETH') {
      return baseToken.wstETH.data?.prices?.inRedeemF
    }
    if (symbol === 'sfrxETH') {
      return baseToken.sfrxETH.data?.baseTokenPrices?.inRedeemF
    }
    if (symbol === 'frxETH') {
      return baseToken.sfrxETH.data?.prices?.inRedeemF
    }
    // if (symbol === 'ETH') {
    //   return tokens[symbol].price
    // }
    return tokens[symbol].price
  }, [symbol, tokens, baseToken, baseTokenData])

  console.log('bouns----', bouns)

  return (
    <div className={styles.container}>
      {isFXBouns ? (
        <BonusCard
          title={`Redeem fxUSD could potentially earn ${fb4(
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
        balance={fb4(tokens.fxUSD.balance, false)}
        symbol="fxUSD"
        color="deep-green"
        className={styles.inputItem}
        usd={nav_text}
        maxAmount={tokens.fxUSD.balance}
        onChange={hanldeFromAmountChanged}
        clearTrigger={clearTrigger}
      />
      <div className={styles.arrow}>
        <DownOutlined />
      </div>

      <BalanceInput
        symbol={symbol}
        placeholder={minOutETHtAmount.minout_ETH}
        decimals={config.zapTokens[symbol].decimals}
        usd={`$${toUsd}`}
        disabled
        loading={priceLoading}
        className={styles.inputItem}
        options={OPTIONS.map((item) => item[0])}
        onSymbolChanged={(v) => setSymbol(v)}
      />
      <DetailCell title="Redeem Fee:" content={[`${fee}%`]} />
      {canReceived && (
        <DetailCell
          title="Min. Received:"
          content={[
            minOutETHtAmount.minout_slippage,
            // minOutETHtAmount.minout_slippage_tvl,
          ]}
        />
      )}
      {isFXBouns && bouns.length
        ? bouns.map((item, index) => (
            <DetailCell
              title={!index && 'Redeem fxUSD Bonus:'}
              content={[fb4(item.bonus), '', item.symbol]}
            />
          ))
        : null}
      {pausedError ? <NoticeCard content={[pausedError]} /> : null}
      {showManaged ? (
        <NoticeCard
          content={[`A maximum of ${fb4(managed)} fxUSD can be redeemed `]}
        />
      ) : null}
      <div className={styles.action}>
        <BtnWapper
          loading={isLoading}
          disabled={!canRedeem}
          onClick={handleRedeem}
          width="100%"
        >
          Redeem
        </BtnWapper>
      </div>
    </div>
  )
}
