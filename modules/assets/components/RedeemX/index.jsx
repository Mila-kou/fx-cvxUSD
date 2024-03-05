import React, { useEffect, useMemo, useState } from 'react'
import { DownOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import BalanceInput, { useClearInput } from '@/components/BalanceInput'
import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import { cBN, checkNotZoroNum, checkNotZoroNumOption, fb4 } from '@/utils/index'
import { useToken } from '@/hooks/useTokenInfo'
import NoPayableAction from '@/utils/noPayableAction'
import styles from './styles.module.scss'
import useApprove from '@/hooks/useApprove'
import { DetailCell, NoticeCard, BonusCard } from '../Common'
import {
  useV2MarketContract,
  useFxUSD_GatewayRouter_contract,
} from '@/hooks/useFXUSDContract'
import { getZapOutParams } from '@/hooks/useZap'

export default function RedeemX({ slippage, assetInfo }) {
  const { _currentAccount, sendTransaction } = useWeb3()
  const [isLoading, setIsLoading] = useState(0)
  const { tokens } = useSelector((state) => state.token)
  const baseToken = useSelector((state) => state.baseToken)
  const [clearTrigger, clearInput] = useClearInput()
  const getMarketContract = useV2MarketContract()

  const { symbol: fromSymbol, nav_text, baseTokenInfo } = assetInfo

  const { baseSymbol, contracts } = baseTokenInfo

  const MarketContract = getMarketContract(contracts.market).contract

  const [symbol, setSymbol] = useState(baseSymbol)
  const { contract: fxUSD_GatewayRouterContract } =
    useFxUSD_GatewayRouter_contract()

  const isSwap = useMemo(() => ['xstETH', 'xfrxETH'].includes(symbol), [symbol])

  const OPTIONS = [
    [baseSymbol, config.tokens[baseSymbol]],
    ['stETH', config.tokens.stETH],
    ['frxETH', config.tokens.frxETH],
    ['WETH', config.tokens.weth],
    ['USDT', config.tokens.usdt],
    ['USDC', config.tokens.usdc],
    ['Frax', config.tokens.frax],
    ['crvUSD', config.tokens.crvUSD],
  ].filter(([item]) => {
    if (baseSymbol === 'wstETH') {
      return item !== 'frxETH'
    }
    if (baseSymbol === 'sfrxETH') {
      return item !== 'stETH'
    }
    return true
  })

  const [pausedError, setPausedError] = useState('')
  const [maxError, setMaxError] = useState('')

  const baseTokenData = useMemo(
    () => baseToken[baseSymbol].data,
    [baseToken, baseSymbol]
  )

  const {
    mintPaused,
    redeemPaused,
    fTokenMintPausedInStabilityMode,
    xTokenRedeemPausedInStabilityMode,

    mintFTokenFee,
    redeemFTokenFee,
    redeemXTokenFee,
    fTokenMintFeeRatioRes,
    xTokenMintFeeRatioRes,
    fTokenRedeemFeeRatioRes,
    xTokenRedeemFeeRatioRes,

    isCRLow130,
    isBaseTokenPriceValid,
    isFXBouns,
    reservePoolBalancesRes,
    price,
    maxRedeemableXTokenRes,
    isRecap,
  } = baseTokenData

  const [fromAmount, setFromAmount] = useState(0)
  const [priceLoading, setPriceLoading] = useState(false)
  const [minOutETHtAmount, setMinOutETHtAmount] = useState({
    minout_slippage: 0,
    minout_slippage_tvl: 0,
  })

  const [selectTokenAddress, tokenAmount] = useMemo(() => {
    let _tokenAmount = 0
    const _selectTokenAddress = config.tokens[fromSymbol]
    _tokenAmount = fromAmount
    return [_selectTokenAddress, _tokenAmount]
  }, [fromAmount])

  const canReceived = useMemo(() => {
    if (priceLoading) return false
    if (!minOutETHtAmount.minout_slippage) return false
    return cBN(tokenAmount).isLessThanOrEqualTo(tokens[fromSymbol].balance)
  }, [
    tokenAmount,
    minOutETHtAmount.minout_slippage,
    fromSymbol,
    tokens,
    priceLoading,
  ])

  const fee = useMemo(() => {
    let _redeemFTokenFee = redeemFTokenFee
    let _redeemXTokenFee = redeemXTokenFee
    if (!isCRLow130) {
      _redeemFTokenFee = fTokenRedeemFeeRatioRes?.defaultFee || 0
      _redeemXTokenFee = xTokenRedeemFeeRatioRes?.defaultFee || 0
    }
    const _fee = cBN(_redeemXTokenFee)
      .plus(cBN(isSwap ? mintFTokenFee : 0))
      .multipliedBy(100)
      .toString(10)

    return fb4(_fee)
  }, [isCRLow130, isSwap])

  const hanldeFromAmountChanged = (v) => {
    setFromAmount(v.toString(10))
  }

  const getContractAddress = () => {
    if (symbol === 'wstETH') {
      return 'fxUSD_wstETH_Market'
    }
    if (symbol === 'sfrxETH') {
      return 'fxUSD_sfrxETH_Market'
    }
    return 'fxUSD_gateway_router'
  }

  const selectTokenInfo = useToken(selectTokenAddress, getContractAddress())

  const { BtnWapper, needApprove } = useApprove({
    approveAmount: tokenAmount,
    allowance: selectTokenInfo.allowance,
    tokenContract: selectTokenInfo.contract,
    approveAddress: selectTokenInfo.contractAddress,
  })

  console.log('selectTokenInfo----', selectTokenInfo)

  const _account = useMemo(() => {
    const isInsufficient = cBN(tokenAmount).isGreaterThan(
      tokens[fromSymbol].balance
    )

    if (isInsufficient) {
      return config.approvedAddress
    }
    return needApprove ? config.approvedAddress : _currentAccount
  }, [needApprove, _currentAccount, tokenAmount, symbol])

  const checkPause = () => {
    let _fTokenMintPausedInStabilityMode = false

    // redeem
    if (redeemPaused || isRecap) {
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

    if (needApprove && _enableETH) return true

    return _enableETH && minOutETHtAmount.minout_ETH
  }, [
    tokenAmount,
    isSwap,
    redeemPaused,
    mintPaused,
    fTokenMintPausedInStabilityMode,
    xTokenRedeemPausedInStabilityMode,
    // maxRedeemableXTokenRes,
    tokens[fromSymbol].balance,
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
  }

  useEffect(() => {
    setMinOutETHtAmount({
      minout_ETH: '-',
      minout_slippage: 0,
      minout_slippage_tvl: 0,
    })
  }, [symbol])

  const getMinAmount = async (needLoading) => {
    // if (cBN(fromAmount).isGreaterThan(maxRedeemableXTokenRes)) {
    //   setMaxError(
    //     `A maximum of ${fb4(
    //       maxRedeemableXTokenRes
    //     )} ${fromSymbol} can be redeemed `
    //   )
    //   setMinOutETHtAmount({
    //     minout_ETH: 0,
    //     minout_slippage: 0,
    //     minout_slippage_tvl: 0,
    //   })
    //   return
    // }

    if (needLoading) {
      setPriceLoading(true)
    }

    let _mockAmount = tokenAmount
    let _mockRatio = 1

    console.log('_account----', _account)
    // 默认比例 0.01
    if (_account !== _currentAccount) {
      _mockAmount = cBN(1).shiftedBy(18).toString()
      _mockRatio = cBN(tokenAmount).div(cBN(10).pow(18)).toFixed(4, 1)
    }

    try {
      let minout_ETH
      let baseOut
      const _symbolAddress = OPTIONS.find((item) => item[0] == symbol)[1]
      if (checkNotZoroNum(_mockAmount)) {
        let resData
        if (['wstETH', 'sfrxETH'].includes(symbol)) {
          console.log(
            'MarketContract-----',
            MarketContract,
            contracts.market,
            _account
          )
          resData = await MarketContract.methods
            .redeemXToken(_mockAmount, _account, 0)
            .call({
              from: _account,
            })
          minout_ETH = resData
          baseOut = resData
        } else {
          const convertParams = getZapOutParams(
            config.tokens[baseSymbol],
            _symbolAddress
          )

          resData = await fxUSD_GatewayRouterContract.methods
            .fxRedeemXTokenV2(convertParams, contracts.market, _mockAmount, 0)
            .call({
              from: _account,
              value: symbol == 'ETH' ? _mockAmount : 0,
            })

          minout_ETH = resData._dstOut
          baseOut = resData._baseOut
          console.log('redeemX--resData-', resData, minout_ETH)
        }
      } else {
        minout_ETH = 0
        baseOut = 0
      }

      // 比例计算
      minout_ETH *= _mockRatio
      baseOut *= _mockRatio

      const _minOut_CBN = (cBN(minout_ETH) || cBN(0)).multipliedBy(
        cBN(1).minus(cBN(slippage).dividedBy(100))
      )
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
        minout_slippage_tvl: fb4(
          _minOut_CBN.multipliedBy(toUsd).toString(10),
          false,
          config.zapTokens[symbol].decimals
        ),
      })

      const _minBaseOut_CBN = (cBN(baseOut) || cBN(0)).multipliedBy(
        cBN(1).minus(cBN(slippage).dividedBy(100))
      )

      setPriceLoading(false)
      return _minBaseOut_CBN.toFixed(0, 1)
    } catch (error) {
      console.log('fxMintFxUSD----error--', error)
      setMinOutETHtAmount({
        minout_ETH: 0,
        minout_slippage: 0,
        minout_slippage_tvl: 0,
      })
      setPriceLoading(false)
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
      const _minBaseoutETH = await getMinAmount()

      if (!checkNotZoroNum(_minBaseoutETH)) {
        setIsLoading(false)
        return
      }

      let apiCall
      let to

      if (['wstETH', 'sfrxETH'].includes(symbol)) {
        to = MarketContract._address
        apiCall = await MarketContract.methods.redeemXToken(
          fromAmount,
          _currentAccount,
          _minBaseoutETH
        )
      } else {
        to = fxUSD_GatewayRouterContract._address
        const _symbolAddress = OPTIONS.find((item) => item[0] == symbol)[1]
        const convertParams = getZapOutParams(
          config.tokens[baseSymbol],
          _symbolAddress
        )

        apiCall = await fxUSD_GatewayRouterContract.methods.fxRedeemXTokenV2(
          convertParams,
          contracts.market,
          fromAmount,
          _minBaseoutETH
        )
      }
      await NoPayableAction(
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
      console.log('redeem---error', _currentAccount, e)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getMinAmount(true)
  }, [slippage, tokenAmount, symbol, _account])

  const toUsd = useMemo(() => {
    if (symbol === 'wstETH') {
      return baseToken.wstETH.data?.baseTokenPrices?.inRedeemX
    }
    if (symbol === 'stETH') {
      return baseToken.wstETH.data?.prices?.inRedeemX
    }
    if (symbol === 'sfrxETH') {
      return baseToken.sfrxETH.data?.baseTokenPrices?.inRedeemX
    }
    if (symbol === 'frxETH') {
      return baseToken.sfrxETH.data?.prices?.inRedeemX
    }
    // if (symbol === 'ETH') {
    //   return baseTokenData?.prices?.inRedeemX
    // }
    return tokens[symbol].price
  }, [symbol, tokens, baseToken, baseTokenData])

  return (
    <div className={styles.container}>
      <BalanceInput
        placeholder="-"
        balance={fb4(tokens[fromSymbol].balance, false)}
        symbol={fromSymbol}
        color="red"
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
        placeholder={minOutETHtAmount.minout_ETH}
        decimals={config.zapTokens[symbol].decimals}
        usd={`$${toUsd}`}
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
            minOutETHtAmount.minout_slippage,
            minOutETHtAmount.minout_slippage_tvl,
          ]}
        />
      )}
      {pausedError ? <NoticeCard content={[pausedError]} /> : null}
      {maxError ? <NoticeCard content={[maxError]} /> : null}
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
