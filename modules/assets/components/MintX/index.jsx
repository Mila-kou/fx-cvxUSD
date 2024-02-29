/* eslint-disable no-lonely-if */
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useSelector } from 'react-redux'
import { DownOutlined } from '@ant-design/icons'
import BalanceInput, { useClearInput } from '@/components/BalanceInput'
import useWeb3 from '@/hooks/useWeb3'
import { cBN, checkNotZoroNum, checkNotZoroNumOption, fb4 } from '@/utils/index'
import { useToken } from '@/hooks/useTokenInfo'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import { getGas } from '@/utils/gas'
import { DetailCell, NoticeCard, BonusCard } from '../Common'
import styles from './styles.module.scss'
import config from '@/config/index'
import useApprove from '@/hooks/useApprove'
import {
  useV2MarketContract,
  useFxUSD_GatewayRouter_contract,
} from '@/hooks/useFXUSDContract'
import { useZapIn } from '@/hooks/useZap'

export default function MintX({ slippage, assetInfo }) {
  const { _currentAccount } = useWeb3()
  const { tokens } = useSelector((state) => state.token)
  const baseToken = useSelector((state) => state.baseToken)
  const [clearTrigger, clearInput] = useClearInput()
  const getMarketContract = useV2MarketContract()
  const { getZapInParams } = useZapIn()

  const { isF, symbol: toSymbol, nav_text, baseTokenInfo } = assetInfo

  const { baseSymbol, contracts } = baseTokenInfo

  const MarketContract = getMarketContract(contracts.market).contract

  const [pausedError, setPausedError] = useState(false)
  const [symbol, setSymbol] = useState('ETH')
  const { contract: fxUSD_GatewayRouterContract } =
    useFxUSD_GatewayRouter_contract()

  const baseTokenData = useMemo(
    () => baseToken[baseSymbol].data,
    [baseToken, baseSymbol]
  )

  const minGas = 234854
  const [fromAmount, setFromAmount] = useState(0)
  const [mintXBouns, setMintXBouns] = useState(0)

  const [minOutAmount, setMinOutAmount] = useState({
    minout_slippage: 0,
    minout_ETH: 0,
    minout_slippage_tvl: 0,
  })
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
    isFXBouns,
    bonusRatioRes,
    isRecap,
    stabilityRatioRes,
  } = baseTokenData

  const isSwap = false

  const OPTIONS = [
    ['ETH', config.tokens.eth],
    ['stETH', config.tokens.stETH],
    ['frxETH', config.tokens.frxETH],
    ['USDT', config.tokens.usdt],
    ['USDC', config.tokens.usdc],
    ['Frax', config.tokens.frax],
    ['crvUSD', config.tokens.crvUSD],
    [baseSymbol, config.tokens[baseSymbol]],
  ]
    .filter((item) => !(isRecap && ['wstETH', 'sfrxETH'].includes(item[0])))
    .filter(([item]) => {
      if (baseSymbol === 'wstETH') {
        return item !== 'frxETH'
      }
      if (baseSymbol === 'sfrxETH') {
        return item !== 'stETH'
      }
      return true
    })

  const selectTokenAddress = useMemo(() => {
    return OPTIONS.find((item) => item[0] === symbol)[1]
  }, [symbol])

  useEffect(() => {
    initPage()
  }, [symbol])

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

  console.log('selectTokenInfo-----', selectTokenInfo)

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
    return fb4(_fee)
  }, [isF, isCRLow130, isSwap])

  const hanldeETHAmountChanged = (v) => {
    setFromAmount(v.toString(10))
  }

  const initPage = () => {
    clearInput()
    setFromAmount('0')
    setMintXBouns(0)
  }

  const getMinAmount = async (needLoading) => {
    setMintXBouns(0)
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

    console.log('_mockAmount-----', _mockAmount, symbol)
    try {
      let minout_ETH
      if (checkNotZoroNum(fromAmount)) {
        let resData

        if (['wstETH', 'sfrxETH'].includes(symbol)) {
          resData = await MarketContract.methods
            .mintXToken(_mockAmount, _account, 0)
            .call({
              from: _account,
            })

          minout_ETH = resData._xTokenMinted
          const _userXETHBonus = cBN(resData._bonus || 0)
          setMintXBouns(_userXETHBonus.multipliedBy(_mockRatio))
          console.log('fxMintXTokenV2--resData----', resData)
        } else {
          const convertParams = await getZapInParams({
            from: symbol,
            to: baseSymbol,
            amount: _mockAmount,
            slippage,
          })
          console.log('fxMintXTokenV2--convertParams----', convertParams)

          resData = await fxUSD_GatewayRouterContract.methods
            .fxMintXTokenV2(convertParams, contracts.market, 0)
            .call({
              from: _account,
              value: symbol == 'ETH' ? _mockAmount : 0,
            })
          console.log('fxMintXTokenV2--resData----', resData)
          minout_ETH = resData._xTokenMinted
          const _userXETHBonus = cBN(resData._bonusOut || 0)
          setMintXBouns(_userXETHBonus.multipliedBy(_mockRatio))
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
      setMinOutAmount({
        minout_ETH: checkNotZoroNumOption(
          minout_ETH,
          fb4(minout_ETH.toString(10))
        ),
        minout_slippage: fb4(_minOut_CBN.toString(10)),
        minout_slippage_tvl: _minOut_fETH_tvl,
      })

      setPriceLoading(false)
      return _minOut_CBN.toFixed(0, 1)
    } catch (error) {
      console.log('mintX----error--', error)
      setMinOutAmount({
        minout_ETH: 0,
        minout_slippage: 0,
        minout_slippage_tvl: 0,
      })
      setPriceLoading(false)
      return 0
    }
  }

  // const bonus_text = useMemo(() => {
  //   const { reservePoolBalancesRes } = baseInfo

  //   return BigNumber.min(reservePoolBalancesRes, mintXBouns, xETHBonus)
  // }, [mintXBouns, baseInfo?.reservePoolBalancesRes, xETHBonus])

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
      if (['wstETH', 'sfrxETH'].includes(symbol)) {
        apiCall = await MarketContract.methods.mintXToken(
          _ETHtAmountAndGas,
          _currentAccount,
          _minOut
        )
      } else {
        const convertParams = await getZapInParams({
          from: symbol,
          to: baseSymbol,
          amount: _ETHtAmountAndGas,
          slippage,
        })

        apiCall = await fxUSD_GatewayRouterContract.methods.fxMintXTokenV2(
          convertParams,
          contracts.market,
          _minOut
        )
      }
      const estimatedGas = await apiCall.estimateGas({
        from: _currentAccount,
        value: symbol == 'ETH' ? _ETHtAmountAndGas : 0,
      })
      const gas = parseInt(estimatedGas * 1, 10) || 0
      await NoPayableAction(
        () =>
          apiCall.send({
            from: _currentAccount,
            gas,
            value: symbol == 'ETH' ? _ETHtAmountAndGas : 0,
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
      console.log('mintX---error----', _currentAccount, error)
      noPayableErrorAction(`error_mint`, error)
    }
  }

  const showMinReceive = useMemo(
    () =>
      !priceLoading &&
      canReceived &&
      cBN(selectTokenInfo.allowance).isGreaterThanOrEqualTo(fromAmount),
    [
      canReceived,
      selectTokenInfo.allowance,
      fromAmount,
      mintLoading,
      priceLoading,
    ]
  )

  const checkPause = () => {
    if (mintPaused || !isBaseTokenPriceValid || isRecap) {
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
    return !mintPaused && _enableETH && minOutAmount.minout_ETH !== '-'
  }, [
    fromAmount,
    mintPaused,
    symbol,
    fTokenMintPausedInStabilityMode,
    minOutAmount,
    priceLoading,
  ])

  useEffect(() => {
    checkPause()
  }, [
    mintPaused,
    isF,
    redeemPaused,
    isBaseTokenPriceValid,
    fTokenMintPausedInStabilityMode,
    isRecap,
  ])

  useEffect(() => {
    getMinAmount(true)
  }, [isF, slippage, fromAmount, _account])

  const fromUsd = useMemo(() => {
    if (symbol === 'wstETH') {
      return baseToken.wstETH.data?.baseTokenPrices?.inMint
    }
    if (symbol === 'stETH') {
      return baseToken.wstETH.data?.prices?.inMint
    }
    if (symbol === 'sfrxETH') {
      return baseToken.sfrxETH.data?.baseTokenPrices?.inMint
    }
    if (symbol === 'frxETH') {
      return baseToken.sfrxETH.data?.prices?.inMint
    }
    if (symbol === 'ETH') {
      return baseTokenData?.prices?.inMint
    }
    return tokens[symbol].price
  }, [symbol, tokens, baseToken, baseTokenData])

  return (
    <div className={styles.container}>
      {isFXBouns ? (
        <BonusCard
          title={`Mint ${toSymbol} could potentially earn ${fb4(
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
        symbol={symbol}
        decimals={config.zapTokens[symbol].decimals}
        balance={fb4(
          tokens[symbol].balance,
          false,
          config.zapTokens[symbol].decimals
        )}
        usd={`$${fromUsd || '-'}`}
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
        color="red"
        placeholder={
          checkNotZoroNum(fromAmount) ? minOutAmount.minout_ETH : '-'
        }
        disabled
        className={styles.inputItem}
        usd={nav_text}
        loading={priceLoading}
      />

      <DetailCell title="Mint Fee:" content={[`${fee}%`]} />
      {showMinReceive ? (
        <DetailCell title="Min. Received:" content={[received, receivedTvl]} />
      ) : null}

      {isFXBouns && Number(mintXBouns) ? (
        <DetailCell
          title={`Mint ${toSymbol} Bonus:`}
          content={[fb4(mintXBouns), '', baseSymbol]}
        />
      ) : null}
      {pausedError ? <NoticeCard content={[pausedError]} /> : null}

      <div className={styles.action}>
        <BtnWapper
          loading={mintLoading}
          disabled={!canMint}
          onClick={handleMint}
          width="100%"
        >
          {`Mint Leveraged Long ${toSymbol}`}
        </BtnWapper>
      </div>
    </div>
  )
}
