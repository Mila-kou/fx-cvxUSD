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

export default function Mint() {
  const { _currentAccount } = useWeb3()
  const [selected, setSelected] = useState(0)
  const { tokens } = useGlobal()
  const [slippage, setSlippage] = useState(0.3)
  // const [fee, setFee] = useState(0.01)
  // const [feeUsd, setFeeUsd] = useState(10)
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
    bonus: 75,
    bonusRatio: 2.1,
    fETH: 2,
    xETH: 3,
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
    fnav,
    xnav,
  } = usefxETH()

  const [isF, isX] = useMemo(() => [selected === 0, selected === 1], [selected])

  const [fee, feeUsd] = useMemo(() => {
    const _fee = cBN(ETHtAmount).multipliedBy(_mintFETHFee)
    const _feeUsd = cBN(_fee).multipliedBy(ethPrice)
    console.log(
      'ETHtAmount---_newETHPrice--',
      _fee.toString(10),
      _feeUsd.toString(10),
      ethPrice
    )
    return [fb4(_fee), fb4(_feeUsd)]
  }, [ETHtAmount, ethPrice])

  const hanldeETHAmountChanged = (v) => {
    if (checkNotZoroNum(v)) {
      console.log('vv------', v.toString(10))
      setETHtAmount(v.toString(10))
    }
  }

  const getMinAmount = async () => {
    try {
      if (!checkNotZoroNum(ETHtAmount)) {
        return 0
      }
      let minout_ETH
      if (isF) {
        minout_ETH = await ethGatewayContract.methods
          .mintFToken(0)
          .call({ value: ETHtAmount })
      } else {
        minout_ETH = await ethGatewayContract.methods
          .mintXToken(0)
          .call({ value: ETHtAmount })
      }
      const _minOut_CBN = (cBN(minout_ETH) || cBN(0)).multipliedBy(
        cBN(1).minus(cBN(slippage).dividedBy(100))
      )
      if (isF) {
        const _minOut_fETH_tvl = fb4(
          _minOut_CBN.multipliedBy(fnav).toString(10)
        )
        setFETHtAmount({
          minout: fb4(_minOut_CBN.toFixed(0, 1)),
          tvl: _minOut_fETH_tvl,
        })
        setXETHtAmount({
          minout: 0,
          tvl: 0,
        })
      } else {
        const _minOut_xETH_tvl = fb4(
          _minOut_CBN.multipliedBy(xnav).toString(10)
        )
        setXETHtAmount({
          minout: fb4(_minOut_CBN.toFixed(0, 1)),
          tvl: _minOut_xETH_tvl,
        })
        setFETHtAmount({
          minout: 0,
          tvl: 0,
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
      let apiCall
      if (isF) {
        apiCall = await ethGatewayContract.methods.mintFToken(_minOut)
      } else {
        apiCall = await ethGatewayContract.methods.mintXToken(_minOut)
      }
      const estimatedGas = await apiCall.estimateGas({
        from: _currentAccount,
        value: ETHtAmount,
      })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(
        () => apiCall.send({ from: _currentAccount, gas, value: ETHtAmount }),
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
        usd={tokens.ETH.usd}
        maxAmount={tokens.ETH.balance}
        onChange={hanldeETHAmountChanged}
      />
      <div className={styles.arrow}>
        <DownOutlined />
      </div>

      <BalanceInput
        symbol="fETH"
        icon={`/images/f-s-logo${isF ? '-white' : ''}.svg`}
        color={isF ? 'blue' : undefined}
        placeholder={FETHtAmount.minout}
        disabled
        type={isF ? '' : 'select'}
        className={styles.inputItem}
        usd={`$${FETHtAmount.tvl}`}
        // onChange={hanldeFETHAmountChanged}
        onSelected={() => setSelected(0)}
      />
      <BalanceInput
        symbol="xETH"
        tip="Bonus+"
        icon={`/images/x-s-logo${isX ? '-white' : ''}.svg`}
        color={isX ? 'red' : undefined}
        selectColor="red"
        placeholder={XETHtAmount.minout}
        disabled
        type={isX ? '' : 'select'}
        className={styles.inputItem}
        usd={`$${XETHtAmount.tvl}`}
        onSelected={() => setSelected(1)}
      />

      <DetailCollapse
        title={`Mint Fee: ${fee}ETH ~ $${feeUsd}`}
        detail={detail}
      />

      <div className={styles.action}>
        <Button width="100%" loading={mintLoading} onClick={handleMint}>
          Mint
        </Button>
      </div>
    </div>
  )
}
