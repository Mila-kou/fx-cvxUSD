import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { DownOutlined } from '@ant-design/icons'
import Button from '@/components/Button'
import BalanceInput, { useClearInput } from '@/components/BalanceInput'
import useWeb3 from '@/hooks/useWeb3'
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

export default function Mint({ slippage }) {
  const { _currentAccount } = useWeb3()
  const [selected, setSelected] = useState(0)
  const { tokens } = useGlobal()
  const [clearTrigger, clearInput] = useClearInput()
  // const [fee, setFee] = useState(0.01)
  // const [feeUsd, setFeeUsd] = useState(10)

  const [showDisabledNotice, setShowDisabledNotice] = useState(false)
  const [errorMinout, setErrorMinout] = useState(false)
  const [symbol, setSymbol] = useState('ETH')

  const minGas = 234854
  const [ETHtAmount, setETHtAmount] = useState(0)
  const [fETHtAmountIn, setFETHtAmountIn] = useState(0)
  const [xETHtAmountIn, setXETHtAmountIn] = useState(0)
  const [manualNum, setManualNum] = useState(0)
  const [FETHtAmount, setFETHtAmount] = useState({
    minout_slippage: 0,
    minout_ETH: 0,
    minout_slippage_tvl: 0,
  })
  const [XETHtAmount, setXETHtAmount] = useState({
    minout_slippage: 0,
    minout_ETH: 0,
    minout_slippage_tvl: 0,
  })
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
    xETHBeta_text,
    systemStatus,
    baseInfo,
  } = useETH()

  const selectTokenAddress = useMemo(() => {
    return symbol == 'stETH' ? config.tokens.stETH : config.zeroAddress
  }, [symbol])
  const selectTokenInfo = useToken(selectTokenAddress, 'fx_stETH_mint')

  const { BtnWapper } = useApprove({
    approveAmount: ETHtAmount,
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

  const [fee, feeUsd, feeCBN] = useMemo(() => {
    let __mintFETHFee = _mintFETHFee
    let __mintXETHFee = _mintXETHFee
    if (systemStatus == 0) {
      __mintFETHFee = baseInfo.fTokenMintFeeRatioRes?.defaultFeeRatio || 0
      __mintXETHFee = baseInfo.xTokenMintFeeRatioRes?.defaultFeeRatio || 0
    }
    let _fee
    if (isF) {
      _fee = cBN(__mintFETHFee).multipliedBy(100).toString(10)
    } else {
      _fee = cBN(__mintXETHFee).multipliedBy(100).toString(10)
    }
    // const _feeUsd = cBN(_fee).multipliedBy(ethPrice)
    // console.log(
    //   'ETHtAmount---_newETHPrice--',
    //   _fee.toString(10),
    //   _feeUsd.toString(10),
    //   ethPrice
    // )
    return [fb4(_fee), 1, __mintXETHFee]
  }, [isF, systemStatus, ethPrice])

  const ethAmount = useMemo(() => {
    console.log(
      'ethAmount',
      manualNum,
      fETHtAmountIn,
      fnav,
      xETHtAmountIn,
      feeCBN
    )
    let _tokenAmountIn = isF ? fETHtAmountIn : xETHtAmountIn
    let _tokenNav = isF ? fnav : xnav
    const _needETH = cBN(_tokenAmountIn)
      .div(1e18)
      .times(_tokenNav)
      .times(cBN(1).minus(cBN(feeCBN).div(1e18)))
      .div(ethPrice)
    console.log('ethAmount', _needETH.toString(10))
    setETHtAmount(_needETH.times(1e18).toString(10))
  }, [fETHtAmountIn, xETHtAmountIn, manualNum])

  const hanldeETHAmountChanged = (v) => {
    setETHtAmount(v.toString(10))
  }
  const hanldefETHAmountChanged = (v) => {
    setFETHtAmountIn(v.toString(10))
    let _pre = manualNum + 1
    setManualNum(_pre)
  }
  const hanldexETHAmountChanged = (v) => {
    setXETHtAmountIn(v.toString(10))
    let _pre = manualNum + 1
    setManualNum(_pre)
  }
  const initPage = () => {
    clearInput()
    setETHtAmount(0)
  }

  const getMinAmount = async () => {
    try {
      let minout_ETH
      if (checkNotZoroNum(ETHtAmount)) {
        const getGasPrice = await getGas()
        const gasFee = cBN(minGas).times(1e9).times(getGasPrice).toFixed(0, 1)
        let _ETHtAmountAndGas
        if (cBN(ETHtAmount).plus(gasFee).isGreaterThan(tokens.ETH.balance) && symbol == 'ETH') {
          _ETHtAmountAndGas = cBN(tokens.ETH.balance)
            .minus(gasFee)
            .toFixed(0, 1)
            .toString()
        } else {
          _ETHtAmountAndGas = ETHtAmount
        }
        if (isF) {
          minout_ETH = await stETHGatewayContract.methods
            .mintFToken(0)
            .call({ value: _ETHtAmountAndGas, from: _currentAccount })
        } else {
          minout_ETH = await stETHGatewayContract.methods
            .mintXToken(0)
            .call({ value: _ETHtAmountAndGas, from: _currentAccount })
        }
      } else {
        minout_ETH = 0
      }
      console.log('minout_ETH----', minout_ETH)
      const _minOut_CBN = (cBN(minout_ETH) || cBN(0)).multipliedBy(
        cBN(1).minus(cBN(slippage).dividedBy(100))
      )
      if (isF) {
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
        })
      }
      return _minOut_CBN.toFixed(0, 1)
    } catch (error) {
      console.log(error)
      // if (error.message.indexOf('no cap to buy') > -1) {
      //   // noPayableErrorAction(`error_buy`, 'No cap to buy')
      // }
      return 0
    }
  }

  const handleMint = async () => {
    try {
      setMintLoading(true)
      const _minOut = await getMinAmount()
      const getGasPrice = await getGas()
      const gasFee = cBN(minGas).times(1e9).times(getGasPrice).toFixed(0, 1)
      let _ETHtAmountAndGas
      if (cBN(ETHtAmount).plus(gasFee).isGreaterThan(tokens.ETH.balance) && symbol == 'ETH') {
        _ETHtAmountAndGas = cBN(tokens.ETH.balance)
          .minus(gasFee)
          .toFixed(0, 1)
          .toString()
      } else {
        _ETHtAmountAndGas = ETHtAmount
      }
      let apiCall
      let estimatedGas;
      if (symbol == 'stETH') {
        if (isF) {
          apiCall = await marketContract.methods.mintFToken(_ETHtAmountAndGas, _currentAccount, _minOut)
        } else {
          apiCall = await marketContract.methods.mintXToken(_ETHtAmountAndGas, _currentAccount, _minOut)
        }
        estimatedGas = await apiCall.estimateGas({
          from: _currentAccount
        })
        const gas = parseInt(estimatedGas * 1.2, 10) || 0
        await NoPayableAction(
          () =>
            apiCall.send({
              from: _currentAccount,
              gas
            }),
          {
            key: 'Mint',
            action: 'Mint',
          }
        )
      } else {
        if (isF) {
          apiCall = await stETHGatewayContract.methods.mintFToken(_minOut)
        } else {
          apiCall = await stETHGatewayContract.methods.mintXToken(_minOut)
        }
        estimatedGas = await apiCall.estimateGas({
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
      }
      setMintLoading(false)
      initPage()
    } catch (error) {
      setMintLoading(false)
      noPayableErrorAction(`error_mint`, error)
    }
  }

  const canMint = useMemo(() => {
    let _enableETH = false
    if (symbol == 'stETH') {
      _enableETH =
        cBN(ETHtAmount).isLessThanOrEqualTo(tokens.stETH.balance) &&
        cBN(ETHtAmount).isGreaterThan(0)
    } else {
      _enableETH =
        cBN(ETHtAmount).isLessThanOrEqualTo(tokens.ETH.balance) &&
        cBN(ETHtAmount).isGreaterThan(0)
    }
    let _fTokenMintInSystemStabilityModePaused = false
    if (isF) {
      _fTokenMintInSystemStabilityModePaused =
        fTokenMintInSystemStabilityModePaused && systemStatus * 1 > 0
    }
    // console.log('_fTokenMintInSystemStabilityModePaused---', !mintPaused, _enableETH, isF, systemStatus, fTokenMintInSystemStabilityModePaused, _fTokenMintInSystemStabilityModePaused)
    return !mintPaused && _enableETH & !_fTokenMintInSystemStabilityModePaused
  }, [
    ETHtAmount,
    mintPaused,
    fTokenMintInSystemStabilityModePaused,
    isF,
    tokens.ETH.balance,
  ])

  useEffect(() => {
    let _fTokenMintInSystemStabilityModePaused = false
    if (isF) {
      _fTokenMintInSystemStabilityModePaused =
        fTokenMintInSystemStabilityModePaused && systemStatus * 1 > 0
    }
    setShowDisabledNotice(mintPaused || _fTokenMintInSystemStabilityModePaused)
  }, [mintPaused, isF, fTokenMintInSystemStabilityModePaused])

  useEffect(() => {
    getMinAmount()
    // handleGetAllMinAmount()
  }, [selected, slippage, ETHtAmount])

  return (
    <div className={styles.container}>
      <BalanceInput
        placeholder="-"
        symbol={symbol}
        balance={fb4(tokens[symbol].balance, false)}
        usd={`$${ethPrice_text}`}
        maxAmount={tokens[symbol].balance}
        clearTrigger={clearTrigger}
        onChange={hanldeETHAmountChanged}
        // changeValue={cBN(ETHtAmount)}
        options={['ETH', 'stETH']}
        onSymbolChanged={(v) => setSymbol(v)}
      />
      <div className={styles.arrow}>
        <DownOutlined />
      </div>
      <BalanceInput
        symbol="fETH"
        color={isF ? 'blue' : ''}
        placeholder={FETHtAmount.minout_ETH}
        disabled
        className={styles.inputItem}
        usd={`$${fnav}`}
        type={isF ? '' : 'select'}
        onSelected={() => setSelected(0)}
      // onChange={hanldefETHAmountChanged}
      // rightSuffix="Beta 0.1"
      />
      <BalanceInput
        symbol="xETH"
        // tip="Bonus+"
        color={isX ? 'red' : ''}
        placeholder={XETHtAmount.minout_ETH}
        disabled
        className={styles.inputItem}
        usd={`$${xnav}`}
        type={isX ? '' : 'select'}
        onSelected={() => setSelected(1)}
        rightSuffix={
          <span className={styles.yellow}>Leverage + {xETHBeta_text}x</span>
        }
      // onChange={hanldexETHAmountChanged}
      />
      <DetailCell title="Mint Fee:" content={[`${fee}%`]} />
      <DetailCell title="Min. Received:" content={[received, receivedTvl]} />

      {showDisabledNotice && (
        <NoticeCard
          content={[
            'fx governance decision to temporarily disabled Mint functionality.',
          ]}
        />
      )}

      <div className={styles.action}>
        <BtnWapper
          loading={mintLoading}
          disabled={!canMint}
          onClick={handleMint}
          width="100%"
        >
          Mint {isF ? 'Stable fETH' : 'Volatile xETH'}
        </BtnWapper>
        {/* <Button
          width="100%"
          loading={mintLoading}
          disabled={!canMint}
          onClick={handleMint}
        >
          Mint {isF ? 'Stable fETH' : 'Volatile xETH'}
        </Button> */}
      </div>
    </div>
  )
}
