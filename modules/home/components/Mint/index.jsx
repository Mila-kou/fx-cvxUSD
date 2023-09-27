/* eslint-disable no-lonely-if */
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { DownOutlined } from '@ant-design/icons'
import BalanceInput, { useClearInput } from '@/components/BalanceInput'
import useWeb3 from '@/hooks/useWeb3'

import { cBN, checkNotZoroNum, checkNotZoroNumOption, fb4 } from '@/utils/index'
import { useToken } from '@/hooks/useTokenInfo'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import { getGas } from '@/utils/gas'
import useGlobal from '@/hooks/useGlobal'
import { DetailCell, NoticeCard, BonusCard } from '../Common'
import styles from './styles.module.scss'
import useETH from '../../controller/useETH'
import config from '@/config/index'
import useApprove from '@/hooks/useApprove'
import { useFx_FxGateway } from '@/hooks/useContracts'
import useCurveSwap from '@/hooks/useCurveSwap'

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
  const { getCurveSwapABI, getCurveSwapMinout } = useCurveSwap()

  // const [fee, setFee] = useState(0.01)
  // const [feeUsd, setFeeUsd] = useState(10)

  const [showDisabledNotice, setShowDisabledNotice] = useState(false)
  const [showRetry, setShowRetry] = useState(false)
  const [symbol, setSymbol] = useState('ETH')
  const { contract: FxGatewayContract } = useFx_FxGateway()

  const minGas = 234854
  const [fromAmount, setFromAmount] = useState(0)
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
    xETHBonus,
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

  useEffect(() => {
    initPage()
  }, [symbol])

  const selectTokenInfo = useToken(
    selectTokenAddress,
    symbol == 'stETH' ? 'fx_stETH_mint' : 'fx_fxGateway'
  )

  const { BtnWapper, needApprove } = useApprove({
    approveAmount: fromAmount,
    allowance: selectTokenInfo.allowance,
    tokenContract: selectTokenInfo.contract,
    approveAddress: selectTokenInfo.contractAddress,
  })

  const _account = useMemo(
    () => (needApprove ? config.approvedAddress : _currentAccount),
    [needApprove, _currentAccount]
  )

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
      checkNotZoroNum(fromAmount) &&
      cBN(fromAmount).isLessThanOrEqualTo(tokens[symbol].balance) &&
      received,
    [fromAmount, tokens, symbol, received]
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
    setFromAmount('0')
    setMintXBouns(0)
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
            .call({ from: _account })
        } else if (symbol === 'stETH') {
          const resData = await stETHGatewayContract.methods[
            isF ? 'mintFToken' : 'mintXToken'
          ](0).call({
            value: _ETHtAmountAndGas,
            from: _account,
          })
          if (typeof resData === 'object') {
            minout_ETH = resData._xTokenMinted
            const _userXETHBonus = resData._bonus
            setMintXBouns(_userXETHBonus)
          } else {
            minout_ETH = resData
          }
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

          const res = await getCurveSwapABI({
            src:
              symbol == 'ETH'
                ? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
                : selectTokenAddress,
            dst: config.tokens.stETH,
            amount: _ETHtAmountAndGas.toString(),
            minout: 0,
          })
          console.log(
            '_resCurve----',
            selectTokenAddress,
            res,
            _ETHtAmountAndGas.toString()
          )

          // const res = await get1inchParams({
          //   src:
          //     symbol == 'ETH'
          //       ? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
          //       : selectTokenAddress,
          //   dst: config.tokens.stETH,
          //   amount: _ETHtAmountAndGas.toString(),
          //   from: fxGatewayContractAddress,
          //   slippage: Number(0),
          //   disableEstimate: true,
          //   allowPartialFill: false,
          //   protocols: 'CURVE',
          // }).catch((e) => {
          //   if (e?.response?.data?.description) {
          //     notify.error({
          //       description: e.response.data.description,
          //     })
          //   }
          //   setPriceLoading(false)
          //   setShowRetry(true)
          // })

          if (!res) return

          const { data } = res

          const resData = await FxGatewayContract.methods[
            isF ? 'mintFToken' : 'mintXToken'
          ](
            [selectTokenAddress, _ETHtAmountAndGas, data.tx.to, data.tx.data],
            0
          ).call({
            value: symbol == 'ETH' ? _ETHtAmountAndGas : 0,
            from: _account,
          })

          console.log('resData-----', resData)
          if (typeof resData === 'object') {
            minout_ETH = resData._xTokenMinted
            const _userXETHBonus = resData._bonus
            setMintXBouns(_userXETHBonus)
          } else {
            minout_ETH = resData
          }
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
        if (!checkNotZoroNum(minout_ETH)) {
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
        } else {
          _minOut_CBN = (cBN(minout_ETH) || cBN(0)).multipliedBy(
            cBN(1).minus(cBN(slippage).dividedBy(100))
          )

          const _minOut_xETH_tvl = fb4(
            _minOut_CBN.multipliedBy(xnav).toString(10)
          )
          setXETHtAmount({
            minout_ETH: checkNotZoroNumOption(
              minout_ETH,
              fb4(minout_ETH.toString(10))
            ),
            minout_slippage: fb4(_minOut_CBN.toString(10)),
            minout_slippage_tvl: _minOut_xETH_tvl,
            bonus: 0,
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
      if (error?.message && error.message.includes('Exceed total cap')) {
        noPayableErrorAction(`error_mint`, 'Exceed total cap')
      }
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
      const _minOut = await getMinAmount()
      const _curveCallOut = await getCurveSwapMinout(
        {
          src:
            symbol == 'ETH'
              ? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
              : selectTokenAddress,
          dst: config.tokens.stETH,
          amount: _ETHtAmountAndGas.toString(),
        },
        _account
      )

      const _curveMinout = cBN(_curveCallOut).multipliedBy(
        cBN(1).minus(cBN(slippage).dividedBy(100))
      )

      const { data } = await getCurveSwapABI({
        src:
          symbol == 'ETH'
            ? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
            : selectTokenAddress,
        dst: config.tokens.stETH,
        amount: _ETHtAmountAndGas.toString(),
        minout: _curveMinout.toFixed(0),
      })

      const apiCall = await FxGatewayContract.methods[
        isF ? 'mintFToken' : 'mintXToken'
      ](
        [selectTokenAddress, _ETHtAmountAndGas, data.tx.to, data.tx.data],
        _minOut
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

  const checkMintPaused = useCallback(() => {
    const _fTokenMintInSystemStabilityModePaused =
      fTokenMintInSystemStabilityModePaused && systemStatus * 1 > 0
    return _fTokenMintInSystemStabilityModePaused
  }, [fTokenMintInSystemStabilityModePaused, systemStatus])
  const checkMintRedeemPausedByType = useCallback(
    (type) => {
      let _fTokenMintInSystemStabilityModePaused = false
      let _xTokenRedeemInSystemStabilityModePaused = false
      if (type == 'swapTofETH') {
        _xTokenRedeemInSystemStabilityModePaused =
          xTokenRedeemInSystemStabilityModePaused && systemStatus * 1 > 0
        _fTokenMintInSystemStabilityModePaused = checkMintPaused()
        return (
          mintPaused ||
          _xTokenRedeemInSystemStabilityModePaused ||
          _fTokenMintInSystemStabilityModePaused ||
          !_isValidPrice
        )
      }
      // swapToXETH
      return mintPaused || redeemPaused || !_isValidPrice
    },
    [
      mintPaused,
      systemStatus,
      xTokenRedeemInSystemStabilityModePaused,
      fTokenMintInSystemStabilityModePaused,
    ]
  )
  const checkSwapPause = useCallback(() => {
    let isPaused = false
    if (symbol == 'xETH') {
      isPaused = checkMintRedeemPausedByType('swapTofETH')
    } else {
      isPaused = checkMintRedeemPausedByType('swapToXETH')
    }
    return mintPaused || redeemPaused || isPaused || !_isValidPrice
  }, [mintPaused, redeemPaused, !_isValidPrice])

  const checkPause = useCallback(() => {
    let isPaused = false
    if (isSwap) {
      isPaused = checkSwapPause()
    } else {
      if (isF) {
        const isPausedMintfETH = checkMintPaused()
        isPaused = mintPaused || isPausedMintfETH || !_isValidPrice
      } else {
        isPaused = mintPaused || !_isValidPrice
      }
    }
    console.log(
      'isPaused----',
      isPaused,
      isF,
      isSwap,
      mintPaused,
      !_isValidPrice
    )
    setShowDisabledNotice(isPaused)
    return isPaused
  }, [
    mintPaused,
    isSwap,
    isF,
    redeemPaused,
    !_isValidPrice,
    fTokenMintInSystemStabilityModePaused,
  ])

  const canMint = useMemo(() => {
    if (checkPause()) {
      return false
    }
    const _enableETH =
      cBN(fromAmount).isLessThanOrEqualTo(tokens[symbol].balance) &&
      cBN(fromAmount).isGreaterThan(0)
    // console.log('_fTokenMintInSystemStabilityModePaused---', !mintPaused, _enableETH, isF, systemStatus, fTokenMintInSystemStabilityModePaused, _fTokenMintInSystemStabilityModePaused)
    return !mintPaused && _enableETH
  }, [
    fromAmount,
    mintPaused,
    fTokenMintInSystemStabilityModePaused,
    isF,
    tokens.ETH.balance,
    _isValidPrice,
  ])

  useEffect(() => {
    checkPause()
  }, [
    mintPaused,
    isSwap,
    isF,
    redeemPaused,
    !_isValidPrice,
    fTokenMintInSystemStabilityModePaused,
  ])

  useEffect(() => {
    getMinAmount(true)
    // handleGetAllMinAmount()
  }, [isF, slippage, fromAmount])

  const fromUsd = useMemo(() => {
    if (symbol === 'fETH') {
      return fnav
    }
    if (symbol === 'xETH') {
      return xnav
    }
    if (['stETH', 'ETH'].includes(symbol)) {
      return ethPrice_text
    }
    return tokens[symbol].price
  }, [symbol, ethPrice_text, fnav, xnav])

  return (
    <div className={styles.container}>
      {isXETHBouns ? (
        <BonusCard
          title={`Minting xETH will earn ${fb4(
            cBN(baseInfo.bonusRatioRes).times(100),
            false,
            18,
            2
          )}% bonus now`}
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
        usd={`$${fromUsd}`}
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

      {isXETHBouns && isX && mintXBouns ? (
        <DetailCell
          title="Mint xETH Bonus:"
          content={[fb4(cBN(mintXBouns)), '', 'stETH']}
        />
      ) : null}

      <DetailCell title="Mint Fee:" content={[`${fee}%`]} />
      {showMinReceive ? (
        <DetailCell title="Min. Received:" content={[received, receivedTvl]} />
      ) : null}

      {showDisabledNotice ? (
        <NoticeCard
          content={['f(x) governance decision to temporarily disable minting.']}
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
