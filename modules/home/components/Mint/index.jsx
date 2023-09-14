/* eslint-disable no-lonely-if */
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { DownOutlined } from '@ant-design/icons'

import Button from '@/components/Button'
import BalanceInput, { useClearInput } from '@/components/BalanceInput'
import useWeb3 from '@/hooks/useWeb3'
import { get1inchParams } from '@/services/inch'

import { cBN, checkNotZoroNum, checkNotZoroNumOption, fb4 } from '@/utils/index'
import { useToken } from '@/hooks/useTokenInfo'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import { getGas } from '@/utils/gas'
import useGlobal from '@/hooks/useGlobal'
import { DetailCell, NoticeCard } from '../Common'
import styles from './styles.module.scss'
import useETH from '../../controller/useETH'
import config from '@/config/index'
import useApprove from '@/hooks/useApprove'
import { useFx_FxGateway } from '@/hooks/useContracts'
import notify from '@/components/notify'

const OPTIONS = [
  ['ETH', config.tokens.eth],
  ['stETH', config.tokens.stETH],
  ['fETH', config.tokens.fETH],
  ['xETH', config.tokens.xETH],
  ['USDC', config.tokens.usdc],
  ['USDT', config.tokens.usdt],
]

export default function Mint({ slippage }) {
  const { _currentAccount } = useWeb3()
  const [selected, setSelected] = useState(0)
  const { tokens } = useGlobal()
  const [clearTrigger, clearInput] = useClearInput()

  // const [fee, setFee] = useState(0.01)
  // const [feeUsd, setFeeUsd] = useState(10)

  const [showDisabledNotice, setShowDisabledNotice] = useState(false)
  const [showRetry, setShowRetry] = useState(false)
  const [symbol, setSymbol] = useState('ETH')
  const { contract: FxGatewayContract, address: fxGatewayContractAddress } =
    useFx_FxGateway()

  const minGas = 234854
  const [fromAmount, setFromAmount] = useState(0)
  const [fETHtAmountIn, setFETHtAmountIn] = useState(0)
  const [xETHtAmountIn, setXETHtAmountIn] = useState(0)
  const [mintXBouns, setMintXBouns] = useState(0)
  const [FETHtAmount, setFETHtAmount] = useState({
    minout_slippage: 0,
    minout_ETH: 0,
    minout_slippage_tvl: 0,
  })
  const [XETHtAmount, setXETHtAmount] = useState({
    minout_slippage: 0,
    minout_ETH: 0,
    minout_slippage_tvl: 0,
    bonus: 0,
  })
  const [priceLoading, setPriceLoading] = useState(false)
  const [mintLoading, setMintLoading] = useState(false)
  const {
    fETHContract,
    xETHContract,
    marketContract,
    treasuryContract,
    _mintFETHFee,
    stETHGatewayContract,
    _mintXETHFee,
    ethPrice,
    ethPrice_text,
    fnav,
    xnav,
    mintPaused,
    redeemPaused,
    fTokenMintInSystemStabilityModePaused,
    xTokenRedeemInSystemStabilityModePaused,
    xETHBeta_text,
    systemStatus,
    baseInfo,
    _redeemFETHFee,
    _redeemXETHFee,
    isXETHBouns,
  } = useETH()

  const _isValidPrice = baseInfo?.fxETHTwapOraclePriceeInfo?._isValid

  const isSwap = useMemo(() => {
    if (symbol === 'fETH') {
      setSelected(1)
      return true
    }
    if (symbol === 'xETH') {
      setSelected(0)
      return true
    }
    return false
  }, [symbol])

  useEffect(() => {
    if (
      (symbol == 'fETH' && selected === 0) ||
      (symbol == 'xETH' && selected === 1)
    ) {
      setSymbol('ETH')
    }
  }, [symbol, selected])

  const selectTokenAddress = useMemo(() => {
    return OPTIONS.find((item) => item[0] === symbol)[1]
  }, [symbol])

  const selectTokenInfo = useToken(
    selectTokenAddress,
    symbol == 'stETH' ? 'fx_stETH_mint' : 'fx_fxGateway'
  )

  const { BtnWapper } = useApprove({
    approveAmount: fromAmount,
    allowance: selectTokenInfo.allowance,
    tokenContract: selectTokenInfo.contract,
    approveAddress: selectTokenInfo.contractAddress,
  })

  const [isF, isX] = useMemo(() => [selected === 0, selected === 1], [selected])

  const [received, receivedTvl] = useMemo(
    () =>
      isF
        ? [FETHtAmount.minout_slippage, FETHtAmount.minout_slippage_tvl]
        : [XETHtAmount.minout_slippage, XETHtAmount.minout_slippage_tvl],
    [FETHtAmount, XETHtAmount, isF]
  )

  const canReceived = useMemo(
    () =>
      cBN(fromAmount).isLessThanOrEqualTo(tokens[symbol].balance) && received,
    [FETHtAmount, tokens, symbol, received]
  )

  const [fee, feeUsd, feeCBN] = useMemo(() => {
    let __mintFETHFee = _mintFETHFee
    let __mintXETHFee = _mintXETHFee
    let __redeemFETHFee = _redeemFETHFee
    let __redeemXETHFee = _redeemXETHFee
    if (systemStatus == 0) {
      __mintFETHFee = baseInfo.fTokenMintFeeRatioRes?.defaultFeeRatio || 0
      __mintXETHFee = baseInfo.xTokenMintFeeRatioRes?.defaultFeeRatio || 0

      if (isSwap) {
        __redeemFETHFee = baseInfo.fTokenRedeemFeeRatioRes?.defaultFeeRatio || 0
        __redeemXETHFee = baseInfo.xTokenRedeemFeeRatioRes?.defaultFeeRatio || 0
      }
    }

    let _fee
    if (isF) {
      _fee = cBN(__mintFETHFee)
        .plus(cBN(isSwap ? __redeemXETHFee : 0))
        .multipliedBy(100)
        .toString(10)
    } else {
      _fee = cBN(__mintXETHFee)
        .plus(cBN(isSwap ? __redeemFETHFee : 0))
        .multipliedBy(100)
        .toString(10)
    }
    // const _feeUsd = cBN(_fee).multipliedBy(ethPrice)
    // console.log(
    //   'fromAmount---_newETHPrice--',
    //   _fee.toString(10),
    //   _feeUsd.toString(10),
    //   ethPrice
    // )
    return [fb4(_fee), 1, __mintXETHFee]
  }, [isF, systemStatus, ethPrice, isSwap])

  const hanldeETHAmountChanged = (v) => {
    setFromAmount(v.toString(10))
  }

  const initPage = () => {
    clearInput()
    setFromAmount(0)
  }

  const getMinAmount = async (needLoading) => {
    setShowRetry(false)

    if (needLoading) {
      setPriceLoading(true)
    }

    try {
      let minout_ETH
      if (checkNotZoroNum(fromAmount)) {
        let _ETHtAmountAndGas = fromAmount

        if (isSwap) {
          minout_ETH = await FxGatewayContract.methods
            .swap(_ETHtAmountAndGas, symbol === 'fETH', 0)
            .call({ from: _currentAccount })
          if (isX) {
            // 用 market 的 mintXToken 算 bonus
          }
        } else if (symbol === 'stETH') {
          minout_ETH = await stETHGatewayContract.methods[
            isF ? 'mintFToken' : 'mintXToken'
          ](0).call({ value: _ETHtAmountAndGas, from: _currentAccount })
        } else {
          if (symbol == 'ETH') {
            const getGasPrice = await getGas()
            const gasFee = cBN(minGas)
              .times(1e9)
              .times(getGasPrice)
              .toFixed(0, 1)
            if (
              cBN(fromAmount).plus(gasFee).isGreaterThan(tokens.ETH.balance)
            ) {
              _ETHtAmountAndGas = cBN(tokens.ETH.balance)
                .minus(gasFee)
                .toFixed(0, 1)
                .toString()
            }
          }
          const res = await get1inchParams({
            src:
              symbol == 'ETH'
                ? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
                : selectTokenAddress,
            dst: config.tokens.stETH,
            amount: _ETHtAmountAndGas.toString(),
            from: fxGatewayContractAddress,
            slippage: Number(0),
            disableEstimate: true,
            allowPartialFill: false,
            protocols: 'CURVE',
          }).catch((e) => {
            if (e?.response?.data?.description) {
              notify.error({
                description: e.response.data.description,
              })
            }
            setPriceLoading(false)
            setShowRetry(true)
          })

          if (!res) return

          const { data } = res

          minout_ETH = await FxGatewayContract.methods[
            isF ? 'mintFToken' : 'mintXToken'
          ](
            [selectTokenAddress, _ETHtAmountAndGas, data.tx.to, data.tx.data],
            0
          ).call({
            value: _ETHtAmountAndGas,
            from: _currentAccount,
          })
        }
      } else {
        minout_ETH = 0
      }
      console.log('minout_ETH----', minout_ETH)

      let _minOut_CBN = cBN(0)
      if (isF) {
        _minOut_CBN = (cBN(minout_ETH) || cBN(0)).multipliedBy(
          cBN(1).minus(cBN(slippage).dividedBy(100))
        )

        const _minOut_fETH_tvl = fb4(
          _minOut_CBN.multipliedBy(fnav).toString(10)
        )
        setFETHtAmount({
          minout_ETH: checkNotZoroNumOption(
            minout_ETH,
            fb4(minout_ETH.toString(10))
          ),
          minout_slippage: fb4(_minOut_CBN.toString(10)),
          minout_slippage_tvl: _minOut_fETH_tvl,
        })
      } else {
        if (typeof minout_ETH !== 'number') {
          const { _bonus, _xTokenMinted } = minout_ETH || {}
          _minOut_CBN = (cBN(_xTokenMinted) || cBN(0)).multipliedBy(
            cBN(1).minus(cBN(slippage).dividedBy(100))
          )

          const _minOut_xETH_tvl = fb4(
            _minOut_CBN.multipliedBy(xnav).toString(10)
          )
          setXETHtAmount({
            minout_ETH: checkNotZoroNumOption(
              _xTokenMinted,
              fb4(_xTokenMinted.toString(10))
            ),
            minout_slippage: fb4(_minOut_CBN.toString(10)),
            minout_slippage_tvl: _minOut_xETH_tvl,
            bonus: checkNotZoroNumOption(_bonus, fb4(_bonus.toString(10))),
          })
        }
      }

      setPriceLoading(false)
      return _minOut_CBN.toFixed(0, 1)
    } catch (error) {
      console.log('minout_ETH------', error)
      setFETHtAmount({
        minout_ETH: 0,
        minout_slippage: 0,
        minout_slippage_tvl: 0,
      })
      setXETHtAmount({
        minout_ETH: 0,
        minout_slippage: 0,
        minout_slippage_tvl: 0,
      })
      setPriceLoading(false)
      return 0
    }
  }

  const handleSwap = async () => {
    try {
      setMintLoading(true)

      const _minOut = await getMinAmount()

      const apiCall = await FxGatewayContract.methods.swap(
        fromAmount,
        symbol === 'fETH',
        _minOut
      )
      const estimatedGas = await apiCall.estimateGas({
        from: _currentAccount,
      })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(
        () =>
          apiCall.send({
            from: _currentAccount,
            gas,
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
      noPayableErrorAction(`error_mint`, error)
    }
  }

  const handleZap = async () => {
    try {
      setMintLoading(true)
      const getGasPrice = await getGas()
      const gasFee = cBN(minGas).times(1e9).times(getGasPrice).toFixed(0, 1)
      let _ETHtAmountAndGas
      if (
        cBN(fromAmount).plus(gasFee).isGreaterThan(tokens.ETH.balance) &&
        symbol == 'ETH'
      ) {
        _ETHtAmountAndGas = cBN(tokens.ETH.balance)
          .minus(gasFee)
          .toFixed(0, 1)
          .toString()
      } else {
        _ETHtAmountAndGas = fromAmount
      }

      const { data } = await get1inchParams({
        src:
          symbol == 'ETH'
            ? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
            : selectTokenAddress,
        dst: config.tokens.stETH,
        amount: _ETHtAmountAndGas.toString(),
        from: fxGatewayContractAddress,
        slippage: Number(slippage),
        disableEstimate: true,
        allowPartialFill: false,
      })

      const apiCall = await FxGatewayContract.methods[
        isF ? 'mintFToken' : 'mintXToken'
      ](
        [selectTokenAddress, _ETHtAmountAndGas, data.tx.to, data.tx.data],
        _ETHtAmountAndGas
      )

      const estimatedGas = await apiCall.estimateGas({
        from: _currentAccount,
        value: _ETHtAmountAndGas,
      })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(
        () =>
          apiCall.send({
            from: _currentAccount,
            gas,
            value: _ETHtAmountAndGas,
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
      noPayableErrorAction(`error_mint`, error)
    }
  }

  const handleMint = async () => {
    if (isSwap) {
      handleSwap()
      return
    }

    if (symbol !== 'stETH') {
      handleZap()
      return
    }

    try {
      setMintLoading(true)
      const _minOut = await getMinAmount()

      const _ETHtAmountAndGas = fromAmount
      let apiCall

      if (isF) {
        apiCall = await marketContract.methods.mintFToken(
          _ETHtAmountAndGas,
          _currentAccount,
          _minOut
        )
      } else {
        apiCall = await marketContract.methods.mintXToken(
          _ETHtAmountAndGas,
          _currentAccount,
          _minOut
        )
      }
      const estimatedGas = await apiCall.estimateGas({
        from: _currentAccount,
      })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(
        () =>
          apiCall.send({
            from: _currentAccount,
            gas,
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
      noPayableErrorAction(`error_mint`, error)
    }
  }

  const showMinReceive = useMemo(
    () =>
      canReceived &&
      cBN(selectTokenInfo.allowance).isGreaterThanOrEqualTo(fromAmount),
    [canReceived, selectTokenInfo.allowance, fromAmount]
  )

  const checkMintPausedByType = useCallback(
    (type) => {
      let _fTokenMintInSystemStabilityModePaused = false
      if (type == 'mintXETH') {
        return mintPaused
      }
      _fTokenMintInSystemStabilityModePaused =
        fTokenMintInSystemStabilityModePaused && systemStatus * 1 > 0
      return _fTokenMintInSystemStabilityModePaused || mintPaused
    },
    [mintPaused, systemStatus, fTokenMintInSystemStabilityModePaused]
  )

  const checkRedeemPausedByType = useCallback(
    (type) => {
      let _xTokenRedeemInSystemStabilityModePaused = false

      if (type == 'redeemXETH') {
        _xTokenRedeemInSystemStabilityModePaused =
          _xTokenRedeemInSystemStabilityModePaused && systemStatus * 1 > 0
        return _xTokenRedeemInSystemStabilityModePaused || mintPaused
      }
      return mintPaused
    },
    [mintPaused, systemStatus, xTokenRedeemInSystemStabilityModePaused]
  )
  const checkSwapPause = useCallback(() => {
    let isPaused = false
    if (symbol == 'xETH') {
      isPaused = checkRedeemPausedByType('redeemXETH')
    } else {
      isPaused = checkMintPausedByType('mintfETH')
    }
    return mintPaused || redeemPaused || isPaused || !_isValidPrice
  }, [mintPaused, redeemPaused, !_isValidPrice])

  const canMint = useMemo(() => {
    if (!_isValidPrice) {
      return false
    }

    const _enableETH =
      cBN(fromAmount).isLessThanOrEqualTo(tokens[symbol].balance) &&
      cBN(fromAmount).isGreaterThan(0)
    let isPausedMint = false
    if (isF) {
      isPausedMint = checkMintPausedByType('mintfETH')
    }
    if (isSwap) {
      isPausedMint = checkSwapPause()
    }
    // console.log('_fTokenMintInSystemStabilityModePaused---', !mintPaused, _enableETH, isF, systemStatus, fTokenMintInSystemStabilityModePaused, _fTokenMintInSystemStabilityModePaused)
    return !mintPaused && _enableETH && !isPausedMint
  }, [
    fromAmount,
    mintPaused,
    fTokenMintInSystemStabilityModePaused,
    isF,
    tokens.ETH.balance,
    _isValidPrice,
  ])

  useEffect(() => {
    const isPausedMintfETH = checkMintPausedByType('mintfETH')
    if (isSwap) {
      setShowDisabledNotice(checkSwapPause())
    } else {
      setShowDisabledNotice(mintPaused || isPausedMintfETH || !_isValidPrice)
    }
  }, [mintPaused, isF, fTokenMintInSystemStabilityModePaused, isSwap])

  useEffect(() => {
    getMinAmount(true)
    // handleGetAllMinAmount()
  }, [isF, slippage, fromAmount, symbol])

  return (
    <div className={styles.container}>
      {isXETHBouns ? (
        <DetailCell
          title={`${fb4(
            cBN(baseInfo.bonusRatioRes).times(100),
            false,
            18,
            2
          )}% bonus ends after mint xETH`}
          content={['']}
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
        usd={`$${ethPrice_text}`}
        maxAmount={tokens[symbol].balance}
        clearTrigger={clearTrigger}
        onChange={hanldeETHAmountChanged}
        // changeValue={cBN(fromAmount)}
        options={OPTIONS.map((item) => item[0])}
        onSymbolChanged={(v) => setSymbol(v)}
      />
      <div className={styles.arrow}>
        <DownOutlined />
      </div>
      <BalanceInput
        symbol="fETH"
        color={isF ? 'blue' : ''}
        placeholder={canReceived ? FETHtAmount.minout_ETH : '-'}
        disabled
        className={styles.inputItem}
        usd={`$${fnav}`}
        type={isF ? '' : 'select'}
        onSelected={() => setSelected(0)}
        loading={isF && priceLoading}
        showRetry={isF && showRetry}
        onRetry={getMinAmount}
        // onChange={hanldefETHAmountChanged}
        // rightSuffix="Beta 0.1"
      />
      <BalanceInput
        symbol="xETH"
        // tip="Bonus+"
        color={isX ? 'red' : ''}
        placeholder={canReceived ? XETHtAmount.minout_ETH : '-'}
        disabled
        className={styles.inputItem}
        usd={`$${xnav}`}
        type={isX ? '' : 'select'}
        onSelected={() => setSelected(1)}
        rightSuffix={
          <span className={styles.yellow}>Leverage + {xETHBeta_text}x</span>
        }
        loading={isX && priceLoading}
        showRetry={isF && showRetry}
        onRetry={getMinAmount}
        // onChange={hanldexETHAmountChanged}
      />

      {isXETHBouns ? (
        <DetailCell title="Mint xETH Bouns:" content={[mintXBouns]} />
      ) : null}

      <DetailCell title="Mint Fee:" content={[`${fee}%`]} />
      {showMinReceive ? (
        <DetailCell title="Min. Received:" content={[received, receivedTvl]} />
      ) : null}

      {showDisabledNotice ? (
        <NoticeCard
          content={[
            'fx governance decision to temporarily disabled Mint functionality.',
          ]}
        />
      ) : null}

      <div className={styles.action}>
        <BtnWapper
          loading={mintLoading}
          disabled={!canMint}
          onClick={handleMint}
          width="100%"
        >
          {isF ? 'Mint Stable fETH' : 'Mint Leveraged Long xETH'}
        </BtnWapper>
      </div>
    </div>
  )
}
