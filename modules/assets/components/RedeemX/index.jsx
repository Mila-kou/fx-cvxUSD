import React, { useEffect, useMemo, useState, useRef } from 'react'
import { DownOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import BalanceInput, { useClearInput } from '@/components/BalanceInput'
import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import { cBN, checkNotZoroNum, formatBalance, fb4 } from '@/utils/index'
import { useToken } from '@/hooks/useTokenInfo'
import noPayableAction from '@/utils/noPayableAction'
import styles from './styles.module.scss'
import useApprove from '@/hooks/useApprove'
import { DetailCell, NoticeCard, NoticeMaxMinPrice, BonusCard } from '../Common'
import {
  useV2MarketContract,
  useFxUSD_GatewayRouter_contract,
} from '@/hooks/useFXUSDContract'
import { getZapOutParams } from '@/hooks/useZap'
import useOutAmount from '../../hooks/useOutAmount'

const MINT_OPTIONS = {
  xstETH: [
    ['wstETH', config.tokens.wstETH],
    ['stETH', config.tokens.stETH],
    ['USDT', config.tokens.usdt],
    ['USDC', config.tokens.usdc],
    ['Frax', config.tokens.frax],
    ['crvUSD', config.tokens.crvUSD],
  ],
  xfrxETH: [
    ['sfrxETH', config.tokens.sfrxETH],
    ['frxETH', config.tokens.frxETH],
    ['USDT', config.tokens.usdt],
    ['USDC', config.tokens.usdc],
    ['Frax', config.tokens.frax],
    ['crvUSD', config.tokens.crvUSD],
  ],
  xeETH: [
    ['weETH', config.tokens.weETH],
    // ['ETH', config.tokens.eth],
    ['USDT', config.tokens.usdt],
    ['USDC', config.tokens.usdc],
    // ['crvUSD', config.tokens.crvUSD],
    // ['eETH', config.tokens.eETH],
  ],
  xezETH: [
    ['ezETH', config.tokens.ezETH],
    // ['ETH', config.tokens.eth],
    // ['USDT', config.tokens.usdt],
    // ['USDC', config.tokens.usdc],
    // ['crvUSD', config.tokens.crvUSD],
  ],
  xCVX: [
    ['aCVX', config.tokens.aCVX],
    ['USDT', config.tokens.usdt],
    ['USDC', config.tokens.usdc],
    ['crvUSD', config.tokens.crvUSD],
    ['WETH', config.tokens.weth],
    ['wstETH', config.tokens.wstETH],
  ],
  xWBTC: [
    // ['USDT', config.tokens.usdt],
    // ['USDC', config.tokens.usdc],
    // ['crvUSD', config.tokens.crvUSD],
    ['WBTC', config.tokens.WBTC],
  ],
}

export default function RedeemX({ slippage, assetInfo }) {
  const { _currentAccount, sendTransaction, blockTime } = useWeb3()
  const [isLoading, setIsLoading] = useState(0)
  const { tokens } = useSelector((state) => state.token)
  const baseToken = useSelector((state) => state.baseToken)
  const [clearTrigger, clearInput] = useClearInput()
  const getMarketContract = useV2MarketContract()
  const timerRef = useRef(null)

  const { updateOutAmount, resetOutAmount, minOutAmount, getMinOutBySlippage } =
    useOutAmount(slippage)

  const {
    symbol: fromSymbol,
    baseTokenInfo,
    baseList,
    mintAtRes,
    coolingOffPeriodRes,
  } = assetInfo

  const { baseSymbol, contracts } = baseTokenInfo

  const MarketContract = getMarketContract(contracts.market).contract

  const [symbol, setSymbol] = useState(baseSymbol)
  const { contract: fxUSD_GatewayRouterContract } =
    useFxUSD_GatewayRouter_contract()

  const isSwap = false

  const [pausedError, setPausedError] = useState('')
  const [maxError, setMaxError] = useState('')

  const baseTokenData = useMemo(
    () => baseToken[baseSymbol].data,
    [baseToken, baseSymbol]
  )

  const OPTIONS = MINT_OPTIONS[fromSymbol]

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
    prices,
    maxRedeemableXTokenRes,
    isRecap,
    xNav_min,
    xNav_min_text,
    xNav_min_invalid,
  } = baseTokenData

  const [nav, nav_text] = useMemo(() => {
    return [xNav_min, xNav_min_text]
  }, [xNav_min, xNav_min_text])

  const [fromAmount, setFromAmount] = useState(0)
  const [priceLoading, setPriceLoading] = useState(false)

  const [selectTokenAddress, tokenAmount] = useMemo(() => {
    let _tokenAmount = 0
    const _selectTokenAddress = config.tokens[fromSymbol]
    _tokenAmount = fromAmount
    return [_selectTokenAddress, _tokenAmount]
  }, [fromAmount])

  const canReceived = useMemo(() => {
    if (priceLoading) return false
    if (!minOutAmount.minout_slippage) return false
    return cBN(tokenAmount).isLessThanOrEqualTo(tokens[fromSymbol].balance)
  }, [
    tokenAmount,
    minOutAmount.minout_slippage,
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

    return formatBalance(_fee)
  }, [isCRLow130, isSwap])

  const hanldeFromAmountChanged = (v) => {
    setFromAmount(v.toString(10))
  }

  const getContractAddress = () => {
    if (symbol === baseSymbol) {
      return contracts.market
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

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.curent)
    }
  }, [])

  // console.log('selectTokenInfo----', selectTokenInfo)

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
    // let _fTokenMintPausedInStabilityMode = false

    // redeem
    if (redeemPaused || isRecap || xNav_min_invalid) {
      setPausedError(
        'f(x) governance decision to temporarily disable redemption.'
      )
      return true
    }

    // if (isSwap) {
    //   // mint
    //   if (symbol === 'fETH') {
    //     _fTokenMintPausedInStabilityMode =
    //       fTokenMintPausedInStabilityMode && isCRLow130
    //   }
    //   if (mintPaused || _fTokenMintPausedInStabilityMode) {
    //     setPausedError(
    //       `f(x) governance decision to temporarily disable ${symbol} minting.`
    //     )
    //     return true
    //   }
    // }
    setPausedError('')
    return false
  }

  const [isLockRedeem = false, mintAtEnd] = useMemo(() => {
    const _mintAtEnd = cBN(mintAtRes).plus(coolingOffPeriodRes)
    let _isLockRedeem = false
    if (cBN(blockTime).lt(_mintAtEnd)) {
      _isLockRedeem = true
    }
    const _mintAtEnd_text = new Date(
      _mintAtEnd.toString(10) * 1000
    ).toLocaleString()
    return [_isLockRedeem, _mintAtEnd_text]
  }, [mintAtRes, coolingOffPeriodRes, blockTime])

  const canRedeem = useMemo(() => {
    if (checkPause() || priceLoading || isLockRedeem) {
      return false
    }
    let _enableETH = cBN(tokenAmount).isGreaterThan(0)

    _enableETH =
      _enableETH &&
      cBN(tokenAmount).isLessThanOrEqualTo(tokens[fromSymbol].balance)

    if (needApprove && _enableETH) return true

    return _enableETH && minOutAmount.minout
  }, [
    tokenAmount,
    isSwap,
    redeemPaused,
    mintPaused,
    fTokenMintPausedInStabilityMode,
    xTokenRedeemPausedInStabilityMode,
    // maxRedeemableXTokenRes,
    tokens[fromSymbol].balance,
    minOutAmount,
    priceLoading,
    needApprove,
    isLockRedeem,
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
  }

  useEffect(() => {
    resetOutAmount()
  }, [symbol])

  const getMinAmount = async (needLoading) => {
    clearTimeout(timerRef.curent)
    timerRef.curent = setTimeout(() => {
      getMinAmount(true)
    }, 30000)

    // if (cBN(fromAmount).isGreaterThan(maxRedeemableXTokenRes)) {
    //   setMaxError(
    //     `A maximum of ${fb4(
    //       maxRedeemableXTokenRes
    //     )} ${fromSymbol} can be redeemed `
    //   )
    //   resetOutAmount()
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
      _mockRatio = cBN(tokenAmount).div(cBN(10).pow(18)).toString()
    }

    try {
      let minout_ETH
      let baseOut
      const _symbolAddress = OPTIONS.find((item) => item[0] == symbol)[1]
      if (checkNotZoroNum(_mockAmount)) {
        let resData
        if (symbol === baseSymbol) {
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

      const _minout_ETH = updateOutAmount(
        minout_ETH,
        toUsd,
        config.zapTokens[symbol].decimals
      )

      setPriceLoading(false)
      return [_minout_ETH, getMinOutBySlippage(baseOut)]
    } catch (error) {
      console.log('RedeemX----error--', error)
      resetOutAmount()
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
      const [_minout_ETH, _minBaseoutETH] = await getMinAmount()

      if (!checkNotZoroNum(_minBaseoutETH)) {
        setIsLoading(false)
        return
      }

      let apiCall
      let to

      if (symbol === baseSymbol) {
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
          _symbolAddress,
          _minout_ETH
        )

        apiCall = await fxUSD_GatewayRouterContract.methods.fxRedeemXTokenV2(
          convertParams,
          contracts.market,
          fromAmount,
          _minBaseoutETH
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
      console.log('redeem---error', _currentAccount, e)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getMinAmount(true)
  }, [slippage, tokenAmount, symbol, _account])

  const toUsd = useMemo(() => {
    if (symbol === baseSymbol) {
      return baseTokenData?.baseTokenPrices?.inRedeemX
    }
    if (baseList.includes(symbol)) {
      return baseTokenData.prices?.inRedeemX
    }
    return tokens[symbol].price
  }, [symbol, tokens, baseSymbol, baseTokenData])

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
            minOutAmount.minout_slippage_tvl,
          ]}
        />
      )}

      {isLockRedeem && (
        <NoticeCard
          tooltip="New minted xTokens are non-transferable for 30 minutes"
          content={[
            `Since you recently minted xTokens, please wait until ${mintAtEnd} to redeem`,
          ]}
        />
      )}
      {pausedError ? <NoticeCard content={[pausedError]} /> : null}
      {maxError ? <NoticeCard content={[maxError]} /> : null}
      {prices?.isShowErrorMaxMinPrice && (
        <NoticeMaxMinPrice
          maxPrice={prices.maxPrice}
          minPrice={prices.minPrice}
        />
      )}
      <div className={styles.action}>
        <BtnWapper
          loading={isLoading}
          disabled={!canRedeem}
          onClick={handleRedeem}
          width="100%"
          auto={false}
        >
          Redeem
        </BtnWapper>
      </div>
    </div>
  )
}
