import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { DownOutlined } from '@ant-design/icons'
import BalanceInput from '@/components/BalanceInput'
import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import { cBN, fb4 } from '@/utils/index'
import { useToken } from '@/hooks/useTokenInfo'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import { getGas } from '@/utils/gas'
import useGlobal from '@/hooks/useGlobal'
import DetailCollapse from '../DetailCollapse'
import styles from './styles.module.scss'
import usefxETH from '../../controller/usefxETH'
import useApprove from '@/hooks/useApprove'

export default function Redeem() {
  const [selected, setSelected] = useState(0)
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
  }, [selected])

  const [fee, feeUsd] = useMemo(() => {
    let _redeemFee = _redeemFETHFee
    if (isF) {
      _redeemFee = _redeemFETHFee
    } else {
      _redeemFee = _redeemXETHFee
    }
    const _fee = cBN(tokenAmount).multipliedBy(_redeemFee)
    const _feeUsd = cBN(_fee).multipliedBy(1 || 1)
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
    // try {
    //   if (!checkNotZoroNum(ETHtAmount)) {
    //     return 0
    //   }
    //   let minout_ETH;
    //   if (isF) {
    //     minout_ETH = await ethGatewayContract.methods
    //       .mintFToken(0)
    //       .call({ value: ETHtAmount })
    //   } else {
    //     minout_ETH = await ethGatewayContract.methods
    //       .mintXToken(0)
    //       .call({ value: ETHtAmount })
    //   }
    //   const _minOut_CBN = (cBN(minout_ETH) || cBN(0))
    //     .multipliedBy(cBN(1).minus(cBN(slippage).dividedBy(100)))
    //   if (isF) {
    //     const _minOut_fETH_tvl = fb4(_minOut_CBN.multipliedBy(fnav).toString(10))
    //     setFETHtAmount({
    //       minout: fb4(_minOut_CBN.toFixed(0, 1)),
    //       tvl: _minOut_fETH_tvl
    //     })
    //     setXETHtAmount({
    //       minout: 0,
    //       tvl: 0
    //     })
    //   } else {
    //     const _minOut_xETH_tvl = fb4(_minOut_CBN.multipliedBy(xnav).toString(10))
    //     setXETHtAmount({
    //       minout: fb4(_minOut_CBN.toFixed(0, 1)),
    //       tvl: _minOut_xETH_tvl
    //     })
    //     setFETHtAmount({
    //       minout: 0,
    //       tvl: 0
    //     })
    //   }
    //   return _minOut_CBN.toFixed(0, 1)
    // } catch (e) {
    //   console.log(e)
    //   return 0
    // }
  }

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
        placeholder="124.3"
        usd="1800.24"
        disabled
        className={styles.inputItem}
      />
      <DetailCollapse
        title={`Redeem Fee: ${fee}ETH ~ $${feeUsd}`}
        detail={detail}
      />

      <div className={styles.action}>
        <BtnWapper width="100%">Redeem</BtnWapper>
      </div>
    </div>
  )
}
