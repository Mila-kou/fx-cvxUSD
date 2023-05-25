import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import Button from '@/components/Button'
import { DownOutlined } from '@ant-design/icons'
import BalanceInput from '@/components/BalanceInput'
import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import { cBN, checkNotZoroNum, fb4 } from '@/utils/index'
import { useToken } from '@/hooks/useTokenInfo'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import { getGas } from '@/utils/gas'
import useGlobal from '@/hooks/useGlobal'
import DetailCollapse from '../DetailCollapse'
import styles from './styles.module.scss'
import usefxETH from '../../controller/usefxETH'
import Tabs from '../Tabs'

export default function Mint() {
  const { _currentAccount } = useWeb3()
  const [selected, setSelected] = useState(0)
  const { tokens } = useGlobal()
  const [slippage, setSlippage] = useState(0.3)
  // const [fee, setFee] = useState(0.01)
  // const [feeUsd, setFeeUsd] = useState(10)

  const minGas = 234854
  const [ETHtAmount, setETHtAmount] = useState(0)
  const [FETHtAmount, setFETHtAmount] = useState({
    amount: 0,
    tvl: 0,
  })
  const [XETHtAmount, setXETHtAmount] = useState({
    amount: 0,
    tvl: 0,
  })
  const [mintLoading, setMintLoading] = useState(false)
  const [detail, setDetail] = useState({
    // bonus: 75,
    // bonusRatio: 2.1,
    // fETH: 2,
    // xETH: 3,
  })
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
    xETHBeta_text
  } = usefxETH()

  const [isF, isX] = useMemo(() => [selected === 0, selected === 1], [selected])

  const [fee, feeUsd] = useMemo(() => {
    const _fee = cBN(_mintFETHFee).multipliedBy(100).toString(10)
    // const _feeUsd = cBN(_fee).multipliedBy(ethPrice)
    // console.log(
    //   'ETHtAmount---_newETHPrice--',
    //   _fee.toString(10),
    //   _feeUsd.toString(10),
    //   ethPrice
    // )
    return [fb4(_fee), 1]
  }, [ETHtAmount, ethPrice])

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
      let minout_ETH
      let _ETHtAmountAndGas
      if (
        cBN(ETHtAmount).plus(gasFee).isGreaterThan(tokens.ETH.balance)
      ) {
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
          .call({ value: _ETHtAmountAndGas })
      } else {
        minout_ETH = await ethGatewayContract.methods
          .mintXToken(0)
          .call({ value: _ETHtAmountAndGas })
      }
      const _minOut_CBN = (cBN(minout_ETH) || cBN(0)).multipliedBy(
        cBN(1).minus(cBN(slippage).dividedBy(100))
      )
      if (isF) {
        const _minOut_fETH_tvl = fb4(
          _minOut_CBN.multipliedBy(fnav).toString(10)
        )
        setFETHtAmount({
          minout: fb4(_minOut_CBN.toFixed(10)),
          tvl: _minOut_fETH_tvl,
        })
        setXETHtAmount({
          minout: 0,
          tvl: 0,
        })
        setDetail((pre) => {
          return {
            ...pre,
            fETH: fb4(_minOut_CBN.toFixed(10)),
            fETHTvl: _minOut_fETH_tvl,
            xETH: 0,
          }
        })
      } else {
        const _minOut_xETH_tvl = fb4(
          _minOut_CBN.multipliedBy(xnav).toString(10)
        )
        setXETHtAmount({
          minout: fb4(_minOut_CBN.toString(10)),
          tvl: _minOut_xETH_tvl,
        })
        setFETHtAmount({
          minout: 0,
          tvl: 0,
        })
        setDetail((pre) => {
          return {
            ...pre,
            fETH: 0,
            xETH: fb4(_minOut_CBN.toString(10)),
            xETHTvl: _minOut_xETH_tvl,
          }
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
      if (
        cBN(ETHtAmount).plus(gasFee).isGreaterThan(tokens.ETH.balance)
      ) {
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
        () => apiCall.send({ from: _currentAccount, gas, value: _ETHtAmountAndGas }),
        {
          key: 'Mint',
          action: 'Mint',
        }
      )
      setMintLoading(false)
    } catch (error) {
      setMintLoading(false)
      noPayableErrorAction(`error_mint`, error)
    }
  }

  const canMint = useMemo(() => {
    let _enableETH =
      cBN(ETHtAmount).isLessThanOrEqualTo(tokens.ETH.balance) &&
      cBN(ETHtAmount).isGreaterThan(0)
    return !mintPaused && _enableETH && !fTokenMintInSystemStabilityModePaused
  }, [ETHtAmount, mintPaused, tokens.ETH.balance])

  useEffect(() => {
    getMinAmount()
    // handleGetAllMinAmount()
  }, [selected, ETHtAmount])

  return (
    <div className={styles.container}>
      <BalanceInput
        placeholder="0"
        symbol="ETH"
        balance={fb4(tokens.ETH.balance, false)}
        // usd={tokens.ETH.usd}
        usd={`$${ethPrice_text}`}
        maxAmount={tokens.ETH.balance}
        onChange={hanldeETHAmountChanged}
      />
      <div className={styles.arrow}>
        <DownOutlined />
      </div>

      <Tabs selecedIndex={selected} onChange={(index) => setSelected(index)} />

      {isF && (
        <BalanceInput
          symbol="fETH"
          icon="/images/f-s-logo-white.svg"
          color="blue"
          placeholder={FETHtAmount.minout}
          disabled
          className={styles.inputItem}
          usd={`$${fnav}`}
        // onChange={hanldeFETHAmountChanged}
        // onSelected={() => setSelected(0)}
        />
      )}
      {isX && (
        <BalanceInput
          symbol="xETH"
          // tip="Bonus+"
          icon="/images/x-s-logo-white.svg"
          color="red"
          selectColor="red"
          placeholder={XETHtAmount.minout}
          disabled
          className={styles.inputItem}
          usd={`$${xnav} x${xETHBeta_text}`}
        // onSelected={() => setSelected(1)}
        />
      )}

      <DetailCollapse title={`Mint Fee: ${fee}%`} detail={detail} />

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
