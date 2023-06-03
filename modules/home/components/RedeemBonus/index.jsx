import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { DownOutlined } from '@ant-design/icons'
import BalanceInput from '@/components/BalanceInput'
import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import { cBN, checkNotZoroNum, checkNotZoroNumOption, fb4 } from '@/utils/index'
import { useToken } from '@/hooks/useTokenInfo'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import { getGas } from '@/utils/gas'
import useGlobal from '@/hooks/useGlobal'
import DetailCollapse from '../DetailCollapse'
import styles from './styles.module.scss'
import useFxETH from '../../controller/useFxETH'
import useApprove from '@/hooks/useApprove'
import useFxCommon from '../../hooks/useFxCommon'
import Button from '@/components/Button'

export default function RedeemBonus({ slippage }) {
  const { _currentAccount } = useWeb3()
  const [selected, setSelected] = useState(0)
  const [redeeming, setRedeeming] = useState(0)
  const { getMaxETHBonus } = useFxCommon()
  const { tokens } = useGlobal()
  const {
    fETHAddress,
    xETHAddress,
    fETHContract,
    xETHContract,
    marketContract,
    treasuryContract,
    _mintFETHFee,
    ethGatewayContract,
    _redeemFETHFee,
    _redeemXETHFee,
    ethPrice,
    ethPrice_text,
    fnav,
    xnav,
    mintPaused,
    redeemPaused,
    mode2_maxFTokenBaseIn,
    mode2_maxFTokenBaseIn_text,
    mode2_maxETHBaseOut,
    mode2_maxETHBaseOut_text,
    maxETHBonus,
    maxETHBonus_Text,
  } = useFxETH()

  const [FETHtAmount, setFETHtAmount] = useState(0)
  const [XETHtAmount, setXETHtAmount] = useState(0)
  const [minOutETHtAmount, setMinOutETHtAmount] = useState({
    minout: 0,
    tvl: 0,
  })
  const [detail, setDetail] = useState({
    // bonus: 75,
    // bonusRatio: 2.1,
    // ETH: 1,
    maxFTokenBaseIn: mode2_maxFTokenBaseIn_text,
    maxETHBonus_Text: maxETHBonus_Text,
  })

  const [isF, isX, selectTokenAddress, tokenAmount] = useMemo(() => {
    let _isF = false
    let _selectTokenAddress
    let _tokenAmount = 0
    if (selected === 0) {
      _isF = true
      _selectTokenAddress = fETHAddress
      _tokenAmount = FETHtAmount
    } else {
      _selectTokenAddress = xETHAddress
      _tokenAmount = XETHtAmount
    }
    return [_isF, !_isF, _selectTokenAddress, _tokenAmount]
  }, [selected, FETHtAmount, XETHtAmount])

  const [fee, useETHBonus_text] = useMemo(() => {
    let _redeemFee = _redeemFETHFee
    if (isF) {
      _redeemFee = _redeemFETHFee
    } else {
      _redeemFee = _redeemXETHFee
    }
    // const _fee = cBN(minOutETHtAmount).multipliedBy(_redeemFee).div(1e18)
    const _fee = cBN(_redeemFee).multipliedBy(100)
    // const _feeUsd = cBN(_fee).multipliedBy(ethPrice)

    let _userETHBonus = 0
    if (cBN(tokenAmount).isGreaterThanOrEqualTo(mode2_maxFTokenBaseIn)) {
      _userETHBonus = maxETHBonus
    } else {
      _userETHBonus = getMaxETHBonus({
        MaxBaseInfETH: tokenAmount / 1e18,
      })
    }
    const _useETHBonus_text = checkNotZoroNum(_userETHBonus)
      ? fb4(_userETHBonus, false, 0)
      : 0

    setDetail((pre) => {
      return {
        ...pre,
        useETHBonus: _useETHBonus_text,
      }
    })
    return [fb4(_fee), _useETHBonus_text]
  }, [isF, FETHtAmount, XETHtAmount, ethPrice, getMaxETHBonus])

  const hanldeFETHAmountChanged = (v) => {
    setFETHtAmount(v.toString(10))
  }

  const hanldeXETHAmountChanged = (v) => {
    setXETHtAmount(v.toString(10))
  }

  const selectTokenInfo = useToken(selectTokenAddress, 'fx_redeem')

  const { BtnWapper } = useApprove({
    approveAmount: tokenAmount,
    allowance: selectTokenInfo.allowance,
    tokenContract: selectTokenInfo.contract,
    approveAddress: selectTokenInfo.contractAddress,
  })

  const initPage = () => {
    setFETHtAmount(0)
    setXETHtAmount(0)
    setMinOutETHtAmount({
      minout_ETH: '-',
      minout: 0,
      tvl: 0,
    })
    setDetail((pre) => {
      return {
        ETH: 0,
        ETHTvl: 0,
      }
    })
  }

  const canRedeem = useMemo(() => {
    let _enableETH = cBN(tokenAmount).isGreaterThan(0)
    if (isF) {
      _enableETH =
        _enableETH && cBN(tokenAmount).isLessThanOrEqualTo(tokens.fETH.balance)
    } else {
      _enableETH =
        _enableETH && cBN(tokenAmount).isLessThanOrEqualTo(tokens.xETH.balance)
    }
    return !redeemPaused && _enableETH
  }, [tokenAmount, redeemPaused, tokens.ETH.balance])

  const getMinAmount = async () => {
    try {
      if (!checkNotZoroNum(tokenAmount)) {
        return 0
      }
      let minout_ETH
      minout_ETH = await marketContract.methods
        .liquidate(tokenAmount, _currentAccount, 0)
        .call({ from: _currentAccount })
      console.log('minout_ETH----', tokenAmount, minout_ETH)
      const _minOut_CBN = (cBN(minout_ETH) || cBN(0)).multipliedBy(
        cBN(1).minus(cBN(slippage).dividedBy(100))
      )
      const _minOut_ETH_tvl = fb4(_minOut_CBN.times(ethPrice).toFixed(0, 1))
      setMinOutETHtAmount({
        minout_ETH: checkNotZoroNumOption(
          minout_ETH,
          fb4(minout_ETH.toString(10))
        ),
        minout: fb4(_minOut_CBN.toFixed(0, 1)),
        tvl: _minOut_ETH_tvl,
      })
      setDetail((pre) => {
        return {
          ...pre,
          ETH: fb4(_minOut_CBN.toString(10)),
          ETHTvl: _minOut_ETH_tvl,
        }
      })
      return _minOut_CBN.toFixed(0, 1)
    } catch (e) {
      console.log(e)
      return 0
    }
  }

  const handleLiquidate = async () => {
    try {
      setRedeeming(true)
      const _minoutETH = await getMinAmount()
      const apiCall = await marketContract.methods.liquidate(
        tokenAmount,
        _currentAccount,
        _minoutETH
      )
      const estimatedGas = await apiCall.estimateGas({
        from: _currentAccount,
      })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(
        () => apiCall.send({ from: _currentAccount, gas }),
        {
          key: 'Liquidate',
          action: 'Liquidate',
        }
      )
      setRedeeming(false)
    } catch (e) {
      setRedeeming(false)
    }
  }

  useEffect(() => {
    initPage()
  }, [selected])

  useEffect(() => {
    getMinAmount()
  }, [selected, slippage, tokenAmount])

  return (
    <div className={styles.container}>
      <BalanceInput
        placeholder="0"
        balance={fb4(tokens.fETH.balance, false)}
        symbol="fETH"
        tip="Bonus+"
        icon={`/images/f-s-logo${isF ? '-white' : ''}.svg`}
        color={isF ? 'blue' : undefined}
        type={isF ? '' : 'select'}
        className={styles.inputItem}
        usd={`$${fnav}`}
        maxAmount={tokens.fETH.balance}
        onChange={hanldeFETHAmountChanged}
        onSelected={() => setSelected(0)}
      />
      {/* <BalanceInput
        placeholder="0"
        balance={fb4(tokens.xETH.balance, false)}
        symbol="xETH"
        tip="Bonus+"
        icon={`/images/x-s-logo${isX ? '-white' : ''}.svg`}
        color={isX ? 'red' : undefined}
        selectColor="red"
        type={isX ? '' : 'select'}
        className={styles.inputItem}
        usd={tokens.xETH.usd}
        maxAmount={tokens.xETH.balance}
        onChange={hanldeXETHAmountChanged}
        onSelected={() => setSelected(1)}
      /> */}
      <div className={styles.arrow}>
        <DownOutlined />
      </div>

      <BalanceInput
        symbol="ETH"
        placeholder={minOutETHtAmount.minout_ETH}
        usd={`$${ethPrice_text}`}
        disabled
        className={styles.inputItem}
      />
      <DetailCollapse title={`Redeem Fee: ${fee}%`} detail={detail} />

      <div className={styles.action}>
        <Button
          loading={redeeming}
          disabled={!canRedeem}
          onClick={handleLiquidate}
          width="100%"
        >
          Redeem
        </Button>
      </div>
    </div>
  )
}
