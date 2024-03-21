import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { DownOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import BalanceInput, { useClearInput } from '@/components/BalanceInput'
import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import { cBN, checkNotZoroNum, checkNotZoroNumOption, fb4 } from '@/utils/index'
import { useToken } from '@/hooks/useTokenInfo'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import styles from './styles.module.scss'
import useApprove from '@/hooks/useApprove'
import { DetailCell, NoticeCard, BonusCard } from '../Common'
import {
  useFxUSD_GatewayRouter_contract,
  useV2MarketContract,
} from '@/hooks/useFXUSDContract'
import { getZapOutParams } from '@/hooks/useZap'

const MINT_OPTIONS = {
  fCVX: [
    ['aCVX', config.tokens.aCVX],
    ['ETH', config.tokens.eth],
    ['USDT', config.tokens.usdt],
    ['USDC', config.tokens.usdc],
    ['crvUSD', config.tokens.crvUSD],
  ],
}

export default function RedeemF({ slippage, assetInfo }) {
  const { _currentAccount, sendTransaction } = useWeb3()
  const [isLoading, setIsLoading] = useState(0)
  const { tokens } = useSelector((state) => state.token)
  const baseToken = useSelector((state) => state.baseToken)
  const [clearTrigger, clearInput] = useClearInput()
  const getMarketContract = useV2MarketContract()
  const {
    symbol: fromSymbol,
    nav_text,
    isF,
    markets,
    baseTokenInfo,
    baseList,
  } = assetInfo

  const OPTIONS = MINT_OPTIONS[fromSymbol]

  const [symbol, setSymbol] = useState(OPTIONS[0][0])
  const { contract: fxUSD_GatewayRouterContract } =
    useFxUSD_GatewayRouter_contract()

  const [bouns, setBonus] = useState(0)

  const { baseSymbol, contracts } = baseTokenInfo

  const MarketContract = getMarketContract(contracts.market).contract

  const isSwap = useMemo(() => ['xstETH', 'xfrxETH'].includes(symbol), [symbol])

  const [pausedError, setPausedError] = useState(false)
  const [showManaged, setShowManaged] = useState(false)

  const baseTokenData = useMemo(
    () => baseToken[baseSymbol].data,
    [baseToken, baseSymbol]
  )

  const managed = cBN(markets?.[baseSymbol]?.managed || 0)

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
    isFXBouns,
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

  // const bonus_text = useMemo(() => {
  //   console.log('bouns--memo-', bouns.toString())
  //   return BigNumber.min(cBN(reservePoolBalancesRes), cBN(bouns))
  // }, [bouns, reservePoolBalancesRes, symbol])

  const canReceived = useMemo(() => {
    if (priceLoading) return false
    if (!minOutETHtAmount.minout_slippage) return false
    return cBN(tokenAmount).isLessThanOrEqualTo(tokens[fromSymbol].balance)
  }, [
    tokenAmount,
    minOutETHtAmount.minout_slippage,
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

    return fb4(_fee)
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

  const _account = useMemo(() => {
    const isInsufficient = cBN(tokenAmount).isGreaterThan(
      tokens[fromSymbol].balance
    )

    if (isInsufficient) {
      return config.approvedAddress
    }
    return needApprove ? config.approvedAddress : _currentAccount
  }, [
    needApprove,
    _currentAccount,
    tokenAmount,
    symbol,
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

    return _enableETH && (needApprove || minOutETHtAmount.minout_ETH)
  }, [
    tokenAmount,
    redeemPaused,
    mintPaused,
    fTokenMintPausedInStabilityMode,
    xTokenRedeemPausedInStabilityMode,
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
    setBonus(0)
  }

  useEffect(() => {
    setMinOutETHtAmount({
      minout_ETH: '-',
      minout_slippage: 0,
      minout_slippage_tvl: 0,
    })
    setBonus(0)
  }, [symbol])

  const getMinAmount = async (needLoading) => {
    setShowManaged(false)
    if (needLoading) {
      setPriceLoading(true)
    }

    setBonus(0)
    let _mockAmount = tokenAmount
    let _mockRatio = 1
    let __bonus = 0

    // 默认比例 0.01
    if (_account !== _currentAccount) {
      _mockAmount = cBN(1).shiftedBy(18).toString()
      _mockRatio = cBN(tokenAmount).div(cBN(10).pow(18)).toFixed(4, 1)
    }

    try {
      let minout_ETH
      let baseOut
      const _symbolAddress = OPTIONS.find((item) => item[0] == symbol)[1]

      if (checkNotZoroNum(fromAmount)) {
        let resData
        if (symbol === baseSymbol) {
          resData = await MarketContract.methods
            .redeemFToken(_mockAmount, _account, 0)
            .call({
              from: _account,
            })

          minout_ETH = resData._baseOut
          baseOut = resData._baseOut
          __bonus = cBN(resData._bonus || 0)
        } else {
          const convertParams = getZapOutParams(
            config.tokens[baseSymbol],
            _symbolAddress
          )
          resData = await fxUSD_GatewayRouterContract.methods
            .fxRedeemFTokenV2(convertParams, contracts.market, _mockAmount, 0)
            .call({
              from: _account,
            })

          minout_ETH = resData._dstOut
          baseOut = resData._baseOut
          __bonus = resData._bonusOut
          console.log('redeemF--resData-', resData, minout_ETH)
        }
      } else {
        minout_ETH = 0
        baseOut = 0
        __bonus = 0
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

      setBonus(__bonus.multipliedBy(_mockRatio))

      setPriceLoading(false)

      const _minBaseOut_CBN = (cBN(baseOut) || cBN(0)).multipliedBy(
        cBN(1).minus(cBN(slippage).dividedBy(100))
      )

      return _minBaseOut_CBN.toFixed(0, 1)
    } catch (error) {
      setMinOutETHtAmount({
        minout_ETH: 0,
        minout_slippage: 0,
        minout_slippage_tvl: 0,
      })
      setBonus(0)
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

  const handleRedeem = async () => {
    // if (isSwap) {
    //   handleSwap()
    //   return
    // }

    try {
      setIsLoading(true)
      const _minBaseoutETH = await getMinAmount()

      let apiCall
      let to

      if (symbol === baseSymbol) {
        to = MarketContract._address
        apiCall = await MarketContract.methods.redeemFToken(
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

        apiCall = await fxUSD_GatewayRouterContract.methods.fxRedeemFTokenV2(
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
      console.log('redeemF--error', _currentAccount, e)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getMinAmount(true)
  }, [isF, slippage, tokenAmount, symbol, _account])

  const toUsd = useMemo(() => {
    if (symbol === baseSymbol) {
      return baseTokenData?.baseTokenPrices?.inRedeemF
    }
    if (baseList.filter((item) => item !== 'ETH').includes(symbol)) {
      return baseTokenData.prices?.inRedeemF
    }
    return tokens[symbol].price
  }, [symbol, tokens, baseSymbol, baseTokenData])

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
        color="blue"
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
      {isFXBouns && bouns ? (
        <DetailCell
          title={`Redeem ${fromSymbol} Bonus:`}
          content={[fb4(bouns), '', baseSymbol]}
        />
      ) : null}
      {pausedError ? <NoticeCard content={[pausedError]} /> : null}
      {showManaged ? (
        <NoticeCard
          content={[
            `A maximum of ${fb4(managed)} ${fromSymbol} can be redeemed `,
          ]}
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
