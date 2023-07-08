import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import Button from '@/components/Button'
import BalanceInput, { useClearInput } from '@/components/BalanceInput'
import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import { cBN, checkNotZoroNum, checkNotZoroNumOption, fb4 } from '@/utils/index'
import { useToken } from '@/hooks/useTokenInfo'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import { getGas } from '@/utils/gas'
import useGlobal from '@/hooks/useGlobal'
import styles from './styles.module.scss'
import useETH from '../../controller/useETH'
import useFxCommon from '../../hooks/useFxCommon'
import { DetailCell, BonusCard, NoticeCard } from '../Common'
import useApprove from '@/hooks/useApprove'

export default function MintBonus({ slippage }) {
  const { _currentAccount } = useWeb3()
  const [selected, setSelected] = useState(1)
  const { tokens } = useGlobal()
  const { getMaxXETHBonus } = useFxCommon()
  const [clearTrigger, clearInput] = useClearInput()
  const [showDisabledNotice, setShowDisabledNotice] = useState(false)
  // const [fee, setFee] = useState(0.01)
  // const [feeUsd, setFeeUsd] = useState(10)
  const minGas = 260325
  const [ETHtAmount, setETHtAmount] = useState(0)
  const [symbol, setSymbol] = useState('ETH')
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
    mode1_maxBaseIn,
    mode1_maxBaseIn_text,
    mode1_maxXTokenMintable_text,
    maxXETHBonus,
    maxXETHBonus_text,
    xETHBeta_text,
    baseInfo,
    systemStatus,
    stabilityIncentiveRatio_text,
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


  const [XETHtAmount, setXETHtAmount] = useState({
    minout_ETH: '-',
    minout_slippage: 0,
    minout_slippage_tvl: 0,
  })
  const [mintLoading, setMintLoading] = useState(false)

  const [fee, useXETHBonus_text] = useMemo(() => {
    const _fee = cBN(_mintXETHFee).multipliedBy(100).toString(10)
    let _useXETHBonus = 0
    let _useXETHBonus_text = '-'
    _useXETHBonus = getMaxXETHBonus({
      MaxBaseInETH: ETHtAmount / 1e18,
      mintXETHFee: (_mintXETHFee || 0) / 1e18,
      maxXETHBonus,
      isUserType: true,
    })
    _useXETHBonus_text = checkNotZoroNumOption(
      _useXETHBonus,
      fb4(_useXETHBonus, false, 0)
    )
    return [fb4(_fee), _useXETHBonus_text]
  }, [ETHtAmount, maxXETHBonus, mode1_maxBaseIn, ethPrice, getMaxXETHBonus])

  const initPage = () => {
    setETHtAmount(0)
    clearInput()
    setXETHtAmount({
      minout_ETH: '-',
      minout_slippage: 0,
      minout_slippage_tvl: 0,
    })
  }

  const hanldeETHAmountChanged = (v) => {
    setETHtAmount(v.toString(10))
  }

  const getMinAmount = async () => {
    try {
      if (!checkNotZoroNum(ETHtAmount)) {
        return 0
      }
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
      let minout_ETH = await stETHGatewayContract.methods
        .addBaseToken(0)
        .call({ value: _ETHtAmountAndGas, from: _currentAccount })
      console.log('minout_ETH----', minout_ETH)
      const _minOut_CBN = (cBN(minout_ETH) || cBN(0)).multipliedBy(
        cBN(1).minus(cBN(slippage).dividedBy(100))
      )
      const _minOut_xETH_tvl = fb4(_minOut_CBN.multipliedBy(xnav).toString(10))
      setXETHtAmount({
        minout_ETH: checkNotZoroNumOption(
          minout_ETH,
          fb4(minout_ETH.toString(10))
        ),
        minout_slippage: fb4(_minOut_CBN.toString(10)),
        minout_slippage_tvl: _minOut_xETH_tvl,
      })

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
    let _enableETH =
      cBN(ETHtAmount).isLessThanOrEqualTo(tokens.ETH.balance) &&
      cBN(ETHtAmount).isGreaterThan(0)
    return !mintPaused && _enableETH
  }, [ETHtAmount, mintPaused, tokens.ETH.balance])

  useEffect(() => {
    setShowDisabledNotice(mintPaused)
  }, [mintPaused])

  useEffect(() => {
    initPage()
  }, [selected])

  useEffect(() => {
    getMinAmount()
    // handleGetAllMinAmount()
  }, [selected, slippage, ETHtAmount])

  return (
    <div className={styles.container}>
      <BonusCard
        title={`${stabilityIncentiveRatio_text}% bonus ends after mint`}
        amount={mode1_maxXTokenMintable_text}
        symbol="xETH"
      />

      <BalanceInput
        placeholder="-"
        symbol={symbol}
        balance={fb4(tokens[symbol].balance, false)}
        usd={`$${ethPrice_text}`}
        maxAmount={tokens[symbol].balance}
        clearTrigger={clearTrigger}
        onChange={hanldeETHAmountChanged}
        options={['ETH', 'stETH']}
        onSymbolChanged={(v) => setSymbol(v)}
      />

      <div className={styles.details}>
        <DetailCell title="Mint Fee:" content={[`${fee}%`]} />
        <DetailCell title="Est. Received:" content={[XETHtAmount.minout_ETH]} />
        <DetailCell
          title="Min. Received:"
          content={[
            XETHtAmount.minout_slippage,
            XETHtAmount.minout_slippage_tvl,
          ]}
        />
        <DetailCell
          isGreen
          title="Max Bonus:"
          content={[`+${maxXETHBonus_text} xETH`]}
        />
        <DetailCell
          isGreen
          title="User Bonus:"
          content={[`+${useXETHBonus_text} xETH`]}
        />
      </div>

      <NoticeCard
        content={
          showDisabledNotice
            ? [
              'fx governance decision to temporarily disabled Mint functionality.',
            ]
            : [
              'Excess payments will be refunded if rewards are fully allocated.',
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
          Mint Volatile xETH
        </Button>
      </div>
    </div>
  )
}
