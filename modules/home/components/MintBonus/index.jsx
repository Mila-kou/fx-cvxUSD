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
import useFxCommon from '../../hooks/useFxCommon'

export default function MintBonus() {
  const { _currentAccount } = useWeb3()
  const [selected, setSelected] = useState(1)
  const { tokens } = useGlobal()
  const { getMaxXETHBonus } = useFxCommon()
  const [slippage, setSlippage] = useState(0.3)
  // const [fee, setFee] = useState(0.01)
  // const [feeUsd, setFeeUsd] = useState(10)
  const [ETHtAmount, setETHtAmount] = useState(0)
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
    mode1_maxBaseIn,
    mode1_maxBaseIn_text,
    mode1_maxXTokenMintable_text,
    maxXETHBonus,
    maxXETHBonus_text,
  } = usefxETH()
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
    maxBaseIn: mode1_maxBaseIn_text,
    maxXTokenMintable: mode1_maxXTokenMintable_text,
    maxXETHBonus: maxXETHBonus_text,
  })

  const [isF, isX] = useMemo(() => [selected === 0, selected === 1], [selected])

  const [fee, useXETHBonus_text] = useMemo(() => {
    const _fee = cBN(_mintFETHFee).multipliedBy(100).toString(10)
    // const _fee = cBN(ETHtAmount).multipliedBy(_mintFETHFee).div(1e18)
    // const _feeUsd = cBN(_fee).multipliedBy(ethPrice)
    // console.log(
    //   'ETHtAmount---_newETHPrice--',
    //   _fee.toString(10),
    //   _feeUsd.toString(10),
    //   ethPrice
    // )
    let _useXETHBonus = 0
    if (cBN(ETHtAmount).isGreaterThanOrEqualTo(mode1_maxBaseIn)) {
      _useXETHBonus = maxXETHBonus
    } else {
      _useXETHBonus = getMaxXETHBonus({
        MaxBaseInETH: ETHtAmount / 1e18,
      })
    }
    const _useXETHBonus_text = checkNotZoroNum(_useXETHBonus)
      ? fb4(_useXETHBonus, false, 0)
      : 0
    setDetail((pre) => {
      return {
        ...pre,
        useXETHBonus: useXETHBonus_text,
      }
    })

    return [fb4(_fee), _useXETHBonus_text]
  }, [ETHtAmount, maxXETHBonus, mode1_maxBaseIn, ethPrice])

  const hanldeETHAmountChanged = (v) => {
    setETHtAmount(v.toString(10))
  }

  const getMinAmount = async () => {
    try {
      if (!checkNotZoroNum(ETHtAmount)) {
        return 0
      }
      let minout_ETH
      let bonuse_ETH
      if (isF) {
        minout_ETH = await ethGatewayContract.methods
          .mintFToken(0)
          .call({ value: ETHtAmount })
      } else {
        // minout_ETH = await ethGatewayContract.methods
        //   .mintXToken(0)
        //   .call({ value: ETHtAmount })
        minout_ETH = await ethGatewayContract.methods
          .addBaseToken(0)
          .call({ value: ETHtAmount })
        console.log('minout_ETH__bonuse_ETH--', minout_ETH, bonuse_ETH)
      }
      const _minOut_CBN = (cBN(minout_ETH) || cBN(0)).multipliedBy(
        cBN(1).minus(cBN(slippage).dividedBy(100))
      )
      if (isF) {
        const _minOut_fETH_tvl = fb4(
          _minOut_CBN.multipliedBy(fnav).toString(10)
        )
        setFETHtAmount({
          minout: fb4(_minOut_CBN.toString(10)),
          tvl: _minOut_fETH_tvl,
        })
        setXETHtAmount({
          minout: 0,
          tvl: 0,
        })
        setDetail((pre) => {
          return {
            ...pre,
            fETH: _minOut_fETH_tvl,
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
            xETH: _minOut_xETH_tvl,
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
      let apiCall
      if (isF) {
        apiCall = await ethGatewayContract.methods.mintFToken(_minOut)
      } else {
        apiCall = await ethGatewayContract.methods.addBaseToken(_minOut)
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

  const canMint = useMemo(() => {
    let _enableETH =
      cBN(ETHtAmount).isLessThanOrEqualTo(tokens.ETH.balance) &&
      cBN(ETHtAmount).isGreaterThan(0)
    return !mintPaused && _enableETH
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
        usd={`$${ethPrice_text}`}
        maxAmount={tokens.ETH.balance}
        onChange={hanldeETHAmountChanged}
      />
      <div className={styles.arrow}>
        <DownOutlined />
      </div>

      {/* <BalanceInput
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
      /> */}
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
        usd={`$${xnav}`}
        onSelected={() => setSelected(1)}
      />

      <DetailCollapse open title={`Mint Fee: ${fee}%`} detail={detail} />

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
