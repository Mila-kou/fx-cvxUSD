import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
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
import useApprove from '@/hooks/useApprove'

export default function Redeem() {
  const { _currentAccount } = useWeb3()
  const [selected, setSelected] = useState(0)
  const [redeeming, setRedeeming] = useState(0)
  const [slippage, setSlippage] = useState(0.3)
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
    fnav,
    xnav,
  } = usefxETH()

  const [FETHtAmount, setFETHtAmount] = useState(0)
  const [XETHtAmount, setXETHtAmount] = useState(0)
  const [minOutETHtAmount, setMinOutETHtAmount] = useState({
    minout: 0,
    tvl: 0,
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

  const [fee, feeUsd] = useMemo(() => {
    let _redeemFee = _redeemFETHFee
    if (isF) {
      _redeemFee = _redeemFETHFee
    } else {
      _redeemFee = _redeemXETHFee
    }
    const _fee = cBN(tokenAmount).multipliedBy(_redeemFee)
    const _feeUsd = cBN(_fee).multipliedBy(ethPrice)
    return [fb4(_fee), fb4(_feeUsd)]
  }, [isF, FETHtAmount, XETHtAmount, ethPrice])

  const hanldeFETHAmountChanged = (v) => {
    setFETHtAmount(v.toString(10))
  }

  const hanldeXETHAmountChanged = (v) => {
    setXETHtAmount(v.toString(10))
  }

  const [detail, setDetail] = useState({
    bonus: 75,
    bonusRatio: 2.1,
    ETH: 1,
  })

  const selectTokenInfo = useToken(selectTokenAddress, 'fx_redeem')

  const { BtnWapper } = useApprove({
    approveAmount: tokenAmount,
    allowance: selectTokenInfo.allowance,
    tokenContract: selectTokenInfo.contract,
    approveAddress: selectTokenInfo.contractAddress,
  })

  const getMinAmount = async () => {
    try {
      if (!checkNotZoroNum(tokenAmount)) {
        return 0
      }
      let minout_ETH
      let _fTokenIn = 0
      let _xTokenIn = 0
      if (isF) {
        _fTokenIn = tokenAmount
        _xTokenIn = 0
      } else {
        _xTokenIn = tokenAmount
        _fTokenIn = 0
      }
      minout_ETH = await marketContract.methods
        .redeem(_fTokenIn, _xTokenIn, _currentAccount, 0)
        .call({ from: _currentAccount })

      console.log('minout_ETH---', minout_ETH)
      const _minOut_CBN = (cBN(minout_ETH) || cBN(0)).multipliedBy(
        cBN(1).minus(cBN(slippage).dividedBy(100))
      )
      const _minOut_ETH_tvl = fb4(_minOut_CBN.times(ethPrice).toFixed(0, 1))
      setMinOutETHtAmount({
        minout: fb4(_minOut_CBN.toFixed(0, 1)),
        tvl: _minOut_ETH_tvl,
      })
      return _minOut_CBN.toFixed(0, 1)
    } catch (e) {
      console.log(e)
      return 0
    }
  }

  const handleRedeem = async () => {
    try {
      setRedeeming(true)
      const _minoutETH = await getMinAmount()
      let _fTokenIn = 0
      let _xTokenIn = 0
      if (isF) {
        _fTokenIn = tokenAmount
        _xTokenIn = 0
      } else {
        _xTokenIn = tokenAmount
        _fTokenIn = 0
      }
      const apiCall = await marketContract.methods
        .redeem(_fTokenIn, _xTokenIn, _currentAccount, _minoutETH)
      const estimatedGas = await apiCall.estimateGas({
        from: _currentAccount
      })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(
        () => apiCall.send({ from: _currentAccount, gas }),
        {
          key: 'Redeem',
          action: 'Redeem',
        }
      )
      setRedeeming(false)
    } catch (e) {
      setRedeeming(false)
    }
  }

  useEffect(() => {
    getMinAmount()
  }, [selected, tokenAmount])

  return (
    <div className={styles.container}>
      <BalanceInput
        placeholder="0"
        balance={fb4(tokens.fETH.balance, false)}
        symbol="fETH"
        icon={`/images/f-s-logo${isF ? '-white' : ''}.svg`}
        color={isF ? 'blue' : undefined}
        type={isF ? '' : 'select'}
        className={styles.inputItem}
        usd={tokens.fETH.usd}
        maxAmount={tokens.fETH.balance}
        onChange={hanldeFETHAmountChanged}
        onSelected={() => setSelected(0)}
      />
      <BalanceInput
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
      />
      <div className={styles.arrow}>
        <DownOutlined />
      </div>

      <BalanceInput
        symbol="ETH"
        placeholder={minOutETHtAmount.minout}
        usd={minOutETHtAmount.tvl}
        disabled
        className={styles.inputItem}
      />
      <DetailCollapse
        title={`Redeem Fee: ${fee}ETH ~ $${feeUsd}`}
        detail={detail}
      />

      <div className={styles.action}>
        <BtnWapper loading={redeeming}  onClick={handleRedeem} width="100%">
          Redeem
        </BtnWapper>
      </div>
    </div>
  )
}
