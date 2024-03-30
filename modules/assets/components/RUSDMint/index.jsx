/* eslint-disable no-lonely-if */
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useSelector } from 'react-redux'
import { Switch } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import BalanceInput, { useClearInput } from '@/components/BalanceInput'
import useWeb3 from '@/hooks/useWeb3'
import { cBN, checkNotZoroNum, formatBalance, fb4 } from '@/utils/index'
import { useToken } from '@/hooks/useTokenInfo'
import noPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import { getGas } from '@/utils/gas'
import { DetailCell, NoticeCard, BonusCard } from '../Common'
import Select from '@/components/Select'
import styles from './styles.module.scss'
import config from '@/config/index'
import useApprove from '@/hooks/useApprove'
// import usePools from './usePools'
import { useZapIn } from '@/hooks/useZap'
import {
  useFXUSD_contract,
  useFxUSD_GatewayRouter_contract,
} from '@/hooks/useFXUSDContract'
import useOutAmount from '../../hooks/useOutAmount'

export default function RUSDMint({ slippage, assetInfo }) {
  const { _currentAccount, sendTransaction } = useWeb3()
  const { tokens } = useSelector((state) => state.token)
  const baseToken = useSelector((state) => state.baseToken)
  const [clearTrigger, clearInput] = useClearInput()
  const [isEarn, setIsEarn] = useState(false)
  const { getZapInParams } = useZapIn()

  const poolList = [] // usePools()

  const { isF, symbol: toSymbol, nav_text, markets, baseList } = assetInfo

  const OPTIONS = [
    // ['ETH', config.tokens.eth],
    // ['eETH', config.tokens.eETH],
    // ['USDT', config.tokens.usdt],
    // ['USDC', config.tokens.usdc],
    // ['crvUSD', config.tokens.crvUSD],
    ['weETH', config.tokens.weETH],
  ].filter((item) => item[0] !== toSymbol)

  const [pausedError, setPausedError] = useState(false)
  const [symbol, setSymbol] = useState('weETH')
  const { contract: fxUSD_GatewayRouterContract } =
    useFxUSD_GatewayRouter_contract()
  const { contract: RUSD_contract } = useFXUSD_contract('rUSD')
  const [baseSymbol, setBaseSymbol] = useState('weETH')

  const baseTokenData = useMemo(
    () => baseToken[baseSymbol].data,
    [baseToken, baseSymbol]
  )

  const isRecap = useMemo(() => {
    const wstETH_data = baseToken.weETH.data
    // const sfrxETH_data = baseToken.sfrxETH.data

    return wstETH_data?.isRecap // || sfrxETH_data?.isRecap
  }, [baseToken])

  const minGas = 234854
  const [fromAmount, setFromAmount] = useState(0)

  const { updateOutAmount, resetOutAmount, minOutAmount } =
    useOutAmount(slippage)

  const [priceLoading, setPriceLoading] = useState(false)
  const [mintLoading, setMintLoading] = useState(false)

  const POOL_LIST = poolList
    .filter((item) => ['weETH', 'sfrxETH'].includes(item.baseSymbol))
    .filter((item) => {
      if (['weETH'].includes(symbol)) {
        return item.baseSymbol === 'weETH'
      }
      if (['sfrxETH', 'frxETH'].includes(symbol)) {
        return item.baseSymbol === 'sfrxETH'
      }
      return true
    })
    .map((item) => ({
      label: item.nameShow,
      value: item.rebalancePoolAddress,
    }))

  const [poolAdddress, setPoolAdddress] = useState('')

  useEffect(() => {
    if (POOL_LIST.length) {
      setPoolAdddress(POOL_LIST[0].value)
    }
  }, [POOL_LIST.length])

  // useEffect(() => {
  //   const wstETH_data = baseToken.weETH.data
  //   const sfrxETH_data = baseToken.sfrxETH.data

  //   if (isEarnActive) {
  //     const pool = poolList.find(
  //       (item) => item.rebalancePoolAddress === poolAdddress
  //     )

  //     if (['weETH'].includes(symbol) && pool.baseSymbol !== 'weETH') {
  //       setPoolAdddress(POOL_LIST[0].value)
  //     }
  //     if (
  //       ['sfrxETH', 'frxETH'].includes(symbol) &&
  //       pool.baseSymbol !== 'sfrxETH'
  //     ) {
  //       setPoolAdddress(POOL_LIST[0].value)
  //     }
  //     setBaseSymbol(pool.baseSymbol)
  //     return
  //   }

  //   if (['weETH'].includes(symbol)) {
  //     setBaseSymbol('weETH')
  //     return
  //   }
  //   if (['frxETH', 'sfrxETH'].includes(symbol)) {
  //     setBaseSymbol('sfrxETH')
  //     return
  //   }

  //   if (
  //     cBN(wstETH_data.fTokenTotalSupplyRes).isGreaterThan(
  //       markets?.weETH.mintCap
  //     ) ||
  //     !wstETH_data.isBaseTokenPriceValid
  //   ) {
  //     setBaseSymbol('sfrxETH')
  //     return
  //   }

  //   if (
  //     cBN(sfrxETH_data.fTokenTotalSupplyRes).isGreaterThan(
  //       markets?.sfrxETH.mintCap
  //     ) ||
  //     !sfrxETH_data.isBaseTokenPriceValid
  //   ) {
  //     setBaseSymbol('weETH')
  //     return
  //   }

  //   const _baseSymbol = cBN(wstETH_data.collateralRatioRes).isGreaterThan(
  //     sfrxETH_data.collateralRatioRes
  //   )
  //     ? 'weETH'
  //     : 'sfrxETH'

  //   setBaseSymbol(_baseSymbol)
  // }, [
  //   baseToken,
  //   symbol,
  //   markets,
  //   isEarn,
  //   poolAdddress,
  //   POOL_LIST,
  //   setBaseSymbol,
  //   setPoolAdddress,
  // ])

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
  } = baseTokenData

  const isSwap = false

  const selectTokenAddress = useMemo(() => {
    return OPTIONS.find((item) => item[0] === symbol)[1]
  }, [symbol])

  useEffect(() => {
    initPage()
  }, [symbol])

  const getContractAddress = () => {
    if (['weETH', 'sfrxETH'].includes(symbol)) return 'rUSD'
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

  const initPage = () => {
    clearInput()
    setFromAmount('0')
  }

  const getMinAmount = async (needLoading) => {
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
    try {
      let minout_ETH
      if (checkNotZoroNum(fromAmount)) {
        let _ETHtAmountAndGas = _mockAmount
        let resData

        if (['weETH', 'sfrxETH'].includes(symbol)) {
          if (isEarnActive) {
            resData = await RUSD_contract.methods
              .mintAndEarn(poolAdddress, _ETHtAmountAndGas, _account, 0)
              .call({
                from: _account,
              })
          } else {
            resData = await RUSD_contract.methods
              .mint(config.tokens[symbol], _ETHtAmountAndGas, _account, 0)
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
              _ETHtAmountAndGas = cBN(tokens.ETH.balance)
                .minus(gasFee)
                .toFixed(0, 1)
            }
          }

          const convertParams = await getZapInParams({
            from: symbol,
            to: baseSymbol,
            amount: _ETHtAmountAndGas,
            slippage,
          })

          if (isEarnActive) {
            resData = await fxUSD_GatewayRouterContract.methods
              .fxMintFxUSDAndEarn(
                convertParams,
                // config.tokens.rUSD,
                poolAdddress,
                0
              )
              .call({
                from: _account,
                value: symbol == 'ETH' ? _ETHtAmountAndGas : 0,
              })
            console.log('fxMintFxUSD--resData-----', symbol, _account, resData)
          } else {
            console.log(
              'resData----',
              JSON.stringify(convertParams),
              baseSymbol
            )
            resData = await fxUSD_GatewayRouterContract.methods
              .fxMintFxUSD(
                convertParams,
                // config.tokens.rUSD,
                config.tokens[baseSymbol],
                0
              )
              .call({
                from: _account,
                value: symbol == 'ETH' ? _ETHtAmountAndGas : 0,
              })
            console.log('fxMintFxUSD--resData-', resData)
          }
        }

        minout_ETH = resData
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
      if (['weETH', 'sfrxETH'].includes(symbol)) {
        to = RUSD_contract._address
        if (isEarnActive) {
          apiCall = await RUSD_contract.methods.mintAndEarn(
            poolAdddress,
            _ETHtAmountAndGas,
            _currentAccount,
            _minOut
          )
        } else {
          apiCall = await RUSD_contract.methods.mint(
            config.tokens[symbol],
            _ETHtAmountAndGas,
            _currentAccount,
            _minOut
          )
        }
      } else {
        to = fxUSD_GatewayRouterContract._address
        const convertParams = await getZapInParams({
          from: symbol,
          to: baseSymbol,
          amount: _ETHtAmountAndGas,
          slippage,
        })

        if (isEarnActive) {
          apiCall =
            await fxUSD_GatewayRouterContract.methods.fxMintFxUSDAndEarn(
              convertParams,
              // config.tokens.rUSD,
              poolAdddress,
              _minOut
            )
        } else {
          apiCall = await fxUSD_GatewayRouterContract.methods.fxMintFxUSD(
            convertParams,
            // config.tokens.rUSD,
            config.tokens[baseSymbol],
            _minOut
          )
        }
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
      console.log('mint----rUSD---error---', _currentAccount, error)
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

    // console.log(
    //   'cBN(fTokenTotalSupplyRes).isGreaterThan(markets?.[baseSymbol].mintCap)---',
    //   cBN(fTokenTotalSupplyRes).isGreaterThan(markets?.[baseSymbol].mintCap),
    //   fTokenTotalSupplyRes,
    //   markets?.[baseSymbol].mintCap
    // )

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
  }, [isF, slippage, fromAmount, _account, isEarn, poolAdddress])

  const isEarnActive = useMemo(
    () => isEarn && poolAdddress,
    [isEarn, poolAdddress]
  )

  const fromUsd = useMemo(() => {
    if (symbol === baseSymbol) {
      return baseTokenData?.baseTokenPrices?.inMint
    }
    if (baseList.includes(symbol)) {
      return baseTokenData?.prices?.inMint
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
        symbol="rUSD"
        color="deep-green"
        placeholder={checkNotZoroNum(fromAmount) ? minOutAmount.minout : '-'}
        amountUSD={minOutAmount.minout_tvl}
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

      {/* <div className="flex justify-between mt-[16px]">
        <p className="text-[var(--yellow-color)]">
          Deposit into rebalance pool
        </p>

        <Switch checked={isEarn} onChange={setIsEarn} />
      </div> 
      {isEarn && (
        <Select
          className="mt-[16px] h-[58px]"
          style={{
            border: '1px solid #a6a6ae',
            borderRadius: '4px',
          }}
          options={POOL_LIST}
          value={poolAdddress}
          onChange={setPoolAdddress}
        />
      )}
      */}

      <div className={styles.action}>
        <BtnWapper
          loading={mintLoading}
          disabled={!canMint}
          onClick={handleMint}
          width="100%"
        >
          {isEarn ? 'Mint & Deposit' : 'Mint rUSD'}
        </BtnWapper>
      </div>
    </div>
  )
}
