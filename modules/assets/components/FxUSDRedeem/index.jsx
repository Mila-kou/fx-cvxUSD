import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
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
import useOutAmount from '../../hooks/useOutAmount'

export default function FxUSDRedeem({ slippage, assetInfo }) {
  const { _currentAccount, sendTransaction } = useWeb3()
  const [isLoading, setIsLoading] = useState(0)
  const { tokens } = useSelector((state) => state.token)
  const baseToken = useSelector((state) => state.baseToken)
  const [clearTrigger, clearInput] = useClearInput()

  const [symbol, setSymbol] = useState('stETH')
  const { contract: fxUSD_GatewayRouterContract } =
    useFxUSD_GatewayRouter_contract()

  const { contract: FXUSD_contract } = useFXUSD_contract()

  const [bouns, setBonus] = useState([])

  const { symbol: fromSymbol, nav_text, isF, markets } = assetInfo

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

  const { updateOutAmount, resetOutAmount, minOutAmount, getMinOutBySlippage } =
    useOutAmount(slippage)

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
    if (!minOutAmount.minout_slippage) return false
    return cBN(tokenAmount).isLessThanOrEqualTo(tokens.fxUSD.balance)
  }, [
    tokenAmount,
    minOutAmount.minout_slippage,
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

    return formatBalance(_fee)
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

    return _enableETH && (needApprove || minOutAmount.minout)
  }, [
    tokenAmount,
    redeemPaused,
    mintPaused,
    fTokenMintPausedInStabilityMode,
    xTokenRedeemPausedInStabilityMode,
    tokens.fxUSD.balance,
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
  }

  useEffect(() => {
    resetOutAmount()
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
        if (['wstETH', 'sfrxETH'].includes(symbol)) {
          resData = await FXUSD_contract.methods
            .redeem(config.tokens[symbol], _mockAmount, _account, 0)
            .call({
              from: _account,
            })

          minout_ETH = resData._amountOut
          if (Number(resData._bonusOut)) {
            __bonus.push({
              bonus: cBN(resData._bonusOut),
              symbol,
            })
          }
          // }
        } else {
          const convertParams_baseToken_1 = getZapOutParams(
            config.tokens.wstETH,
            _symbolAddress
          )

          const convertParams_baseToken_2 = getZapOutParams(
            config.tokens.sfrxETH,
            _symbolAddress
          )
          resData = await fxUSD_GatewayRouterContract.methods
            .fxAutoRedeemFxUSD(
              [convertParams_baseToken_1, convertParams_baseToken_2],
              // config.tokens.fxUSD,
              _mockAmount,
              [0, 0]
            )
            .call({
              from: _account,
            })

          minout_ETH = resData._dstOut
          min_baseOuts = resData._baseOuts

          resData._bonusOuts.forEach((item, index) => {
            if (Number(item)) {
              __bonus.push({
                bonus: cBN(item),
                symbol: index ? 'sfrxETH' : 'wstETH',
              })
            }
          })
        }
      } else {
        minout_ETH = 0
        min_baseOuts = []
      }

      // 比例计算
      minout_ETH *= _mockRatio

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

      const _min_baseOuts = min_baseOuts.map((item) =>
        getMinOutBySlippage(item)
      )

      return [_minOut, _min_baseOuts]
    } catch (error) {
      resetOutAmount()
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

  const handleRedeem = async () => {
    // if (isSwap) {
    //   handleSwap()
    //   return
    // }

    try {
      setIsLoading(true)
      const [_minoutETH, _min_baseOuts] = await getMinAmount()

      let apiCall
      let to

      if (['wstETH', 'sfrxETH'].includes(symbol)) {
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
        const convertParams_baseToken_1 = getZapOutParams(
          config.tokens.wstETH,
          _symbolAddress
        )

        const convertParams_baseToken_2 = getZapOutParams(
          config.tokens.sfrxETH,
          _symbolAddress
        )

        console.log('_min_baseOuts----', _min_baseOuts)

        apiCall = await fxUSD_GatewayRouterContract.methods.fxAutoRedeemFxUSD(
          [convertParams_baseToken_1, convertParams_baseToken_2],
          // config.tokens.fxUSD,
          fromAmount,
          _min_baseOuts
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
      {isFXBouns && bouns.length
        ? bouns.map((item, index) => (
            <DetailCell
              title={!index && 'Redeem fxUSD Bonus:'}
              content={[numberLess(fb4(item.bonus), 0.01), '', item.symbol]}
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
