import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { DownOutlined } from '@ant-design/icons'
import Button from '@/components/Button'
import BalanceInput, { useClearInput } from '@/components/BalanceInput'
import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import { cBN, checkNotZoroNum, checkNotZoroNumOption, fb4 } from '@/utils/index'
import { useToken } from '@/hooks/useTokenInfo'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import { getGas } from '@/utils/gas'
import useGlobal from '@/hooks/useGlobal'
import { DetailCell, NoticeCard } from '../Common'
import styles from './styles.module.scss'
import useETH from '../../controller/useETH'

export default function Mint({ slippage }) {
  const { _currentAccount } = useWeb3()
  const [selected, setSelected] = useState(0)
  const { tokens } = useGlobal()
  const [clearTrigger, clearInput] = useClearInput()
  // const [fee, setFee] = useState(0.01)
  // const [feeUsd, setFeeUsd] = useState(10)

  const [showDisabledNotice, setShowDisabledNotice] = useState(false)

  const minGas = 234854
  const [ETHtAmount, setETHtAmount] = useState(0)
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
    ethGatewayContract,
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

  const [isF, isX] = useMemo(() => [selected === 0, selected === 1], [selected])

  const [received, receivedTvl] = useMemo(
    () =>
      isF
        ? [FETHtAmount.minout_slippage, FETHtAmount.minout_slippage_tvl]
        : [XETHtAmount.minout_slippage, XETHtAmount.minout_slippage_tvl],
    [FETHtAmount, XETHtAmount, isF]
  )

  const [fee, feeUsd] = useMemo(() => {
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
    return [fb4(_fee), 1]
  }, [isF, systemStatus, ethPrice])

  const hanldeETHAmountChanged = (v) => {
    setETHtAmount(v.toString(10))
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
        if (cBN(ETHtAmount).plus(gasFee).isGreaterThan(tokens.ETH.balance)) {
          _ETHtAmountAndGas = cBN(tokens.ETH.balance)
            .minus(gasFee)
            .toFixed(0, 1)
            .toString()
        } else {
          _ETHtAmountAndGas = ETHtAmount
        }
        if (isF) {
          minout_ETH = await ethGatewayContract.methods
            .mintFToken(0)
            .call({ value: _ETHtAmountAndGas, from: _currentAccount })
        } else {
          minout_ETH = await ethGatewayContract.methods
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
    } catch (e) {
      console.log(e)
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
      if (cBN(ETHtAmount).plus(gasFee).isGreaterThan(tokens.ETH.balance)) {
        _ETHtAmountAndGas = cBN(tokens.ETH.balance)
          .minus(gasFee)
          .toFixed(0, 1)
          .toString()
      } else {
        _ETHtAmountAndGas = ETHtAmount
      }
      let apiCall
      if (isF) {
        apiCall = await ethGatewayContract.methods.mintFToken(_minOut)
      } else {
        apiCall = await ethGatewayContract.methods.mintXToken(_minOut)
      }
      const estimatedGas = await apiCall.estimateGas({
        from: _currentAccount,
        value: _ETHtAmountAndGas,
      })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      console.log('gas----', gas)
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

  const canMint = useMemo(() => {
    const _enableETH =
      cBN(ETHtAmount).isLessThanOrEqualTo(tokens.ETH.balance) &&
      cBN(ETHtAmount).isGreaterThan(0)
    let _fTokenMintInSystemStabilityModePaused = false
    if (isF) {
      _fTokenMintInSystemStabilityModePaused =
        fTokenMintInSystemStabilityModePaused && systemStatus * 1 > 0
    }
    // console.log('_fTokenMintInSystemStabilityModePaused---', !mintPaused, _enableETH, isF, systemStatus, fTokenMintInSystemStabilityModePaused, _fTokenMintInSystemStabilityModePaused)
    return !mintPaused && _enableETH & !_fTokenMintInSystemStabilityModePaused
  }, [ETHtAmount, mintPaused, isF, tokens.ETH.balance])

  useEffect(() => {
    getMinAmount()
    // handleGetAllMinAmount()
  }, [selected, slippage, ETHtAmount])

  return (
    <div className={styles.container}>
      <BalanceInput
        placeholder="0"
        symbol="ETH"
        balance={fb4(tokens.ETH.balance, false)}
        usd={`$${ethPrice_text}`}
        maxAmount={tokens.ETH.balance}
        clearTrigger={clearTrigger}
        onChange={hanldeETHAmountChanged}
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
      />
      <DetailCell title="Mint Fee:" content={[`${fee}%`]} />
      <DetailCell title="Min. Received:" content={[received, receivedTvl]} />

      <NoticeCard
        content={
          showDisabledNotice
            ? [
                'If the bonus is fully distributed, ',
                '1. You can receive part of the bonus and return the rest;',
                '2. Or your transaction will fail.',
              ]
            : [
                'fx governance decision to temporarily disabled Mint functionality.',
              ]
        }
      />

      <div className={styles.action}>
        <Button
          width="100%"
          loading={mintLoading}
          disabled={!canMint}
          onClick={handleMint}
        >
          Mint
        </Button>
      </div>
    </div>
  )
}
