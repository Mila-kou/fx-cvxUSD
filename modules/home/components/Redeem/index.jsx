import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { DownOutlined } from '@ant-design/icons'
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
import useApprove from '@/hooks/useApprove'
import { DetailCell, NoticeCard } from '../Common'

export default function Redeem({ slippage }) {
  const { _currentAccount } = useWeb3()
  const [selected, setSelected] = useState(0)
  const [redeeming, setRedeeming] = useState(0)
  const { tokens } = useGlobal()
  const [clearTrigger, clearInput] = useClearInput()

  const [showDisabledNotice, setShowDisabledNotice] = useState(false)

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
    systemStatus,
    xTokenRedeemInSystemStabilityModePaused,
    xETHBeta_text,
    baseInfo,
  } = useETH()

  const [FETHtAmount, setFETHtAmount] = useState(0)
  const [XETHtAmount, setXETHtAmount] = useState(0)
  const [minOutETHtAmount, setMinOutETHtAmount] = useState({
    minout_slippage: 0,
    minout_slippage_tvl: 0,
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
    let __redeemFETHFee = _redeemFETHFee
    let __redeemXETHFee = _redeemXETHFee
    if (systemStatus == 0) {
      __redeemFETHFee = baseInfo.fTokenRedeemFeeRatioRes?.defaultFeeRatio || 0
      __redeemXETHFee = baseInfo.xTokenRedeemFeeRatioRes?.defaultFeeRatio || 0
    }
    let _fee
    if (isF) {
      _fee = cBN(__redeemFETHFee).multipliedBy(100).toString(10)
    } else {
      _fee = cBN(__redeemXETHFee).multipliedBy(100).toString(10)
    }
    const _feeUsd = cBN(_fee).multipliedBy(ethPrice)
    return [fb4(_fee), fb4(_feeUsd)]
  }, [isF, systemStatus, ethPrice])

  const hanldeFETHAmountChanged = (v) => {
    setFETHtAmount(v.toString(10))
  }

  const hanldeXETHAmountChanged = (v) => {
    setXETHtAmount(v.toString(10))
  }

  const selectTokenInfo = useToken(selectTokenAddress, 'fx_ethGateway')

  const { BtnWapper } = useApprove({
    approveAmount: tokenAmount,
    allowance: selectTokenInfo.allowance,
    tokenContract: selectTokenInfo.contract,
    approveAddress: selectTokenInfo.contractAddress,
  })

  const canRedeem = useMemo(() => {
    let _enableETH = cBN(tokenAmount).isGreaterThan(0)
    if (isF) {
      _enableETH =
        _enableETH && cBN(tokenAmount).isLessThanOrEqualTo(tokens.fETH.balance)
    } else {
      _enableETH =
        _enableETH && cBN(tokenAmount).isLessThanOrEqualTo(tokens.xETH.balance)
    }
    let _xTokenRedeemInSystemStabilityModePaused = false
    if (isX) {
      _xTokenRedeemInSystemStabilityModePaused =
        xTokenRedeemInSystemStabilityModePaused && systemStatus * 1 > 0
    }
    return (
      !redeemPaused && _enableETH && !_xTokenRedeemInSystemStabilityModePaused
    )
  }, [
    tokenAmount,
    redeemPaused,
    xTokenRedeemInSystemStabilityModePaused,
    tokens.ETH.balance,
  ])

  useEffect(() => {
    let _xTokenRedeemInSystemStabilityModePaused = false
    if (isX) {
      _xTokenRedeemInSystemStabilityModePaused =
        xTokenRedeemInSystemStabilityModePaused && systemStatus * 1 > 0
    }
    setShowDisabledNotice(redeemPaused || _xTokenRedeemInSystemStabilityModePaused)
  }, [redeemPaused, isX, xTokenRedeemInSystemStabilityModePaused])

  const initPage = () => {
    setFETHtAmount(0)
    setXETHtAmount(0)
    clearInput()
    setMinOutETHtAmount({
      minout_ETH: '-',
      minout_slippage: 0,
      minout_slippage_tvl: 0,
    })
  }

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
        .call({ from: _currentAccount, from: _currentAccount })

      console.log('minout_ETH----', minout_ETH)
      const _minOut_CBN = (cBN(minout_ETH) || cBN(0)).multipliedBy(
        cBN(1).minus(cBN(slippage).dividedBy(100))
      )
      const _minOut_ETH_tvl = fb4(_minOut_CBN.times(ethPrice).toString(10))
      setMinOutETHtAmount({
        minout_ETH: checkNotZoroNumOption(
          minout_ETH,
          fb4(minout_ETH.toString(10))
        ),
        minout_slippage: fb4(_minOut_CBN.toString(10)),
        minout_slippage_tvl: _minOut_ETH_tvl,
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
      const apiCall = await ethGatewayContract.methods.redeem(
        _fTokenIn,
        _xTokenIn,
        _minoutETH
      )
      const estimatedGas = await apiCall.estimateGas({
        from: _currentAccount,
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
      initPage()
    } catch (e) {
      console.log('eeee---', e)
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
        placeholder="-"
        balance={fb4(tokens.fETH.balance, false)}
        symbol="fETH"
        color={isF ? 'blue' : ''}
        className={styles.inputItem}
        usd={`$${fnav}`}
        type={isF ? '' : 'select'}
        maxAmount={tokens.fETH.balance}
        onChange={hanldeFETHAmountChanged}
        onSelected={() => setSelected(0)}
        clearTrigger={clearTrigger}
      />
      <BalanceInput
        placeholder="-"
        balance={fb4(tokens.xETH.balance, false)}
        symbol="xETH"
        type={isX ? '' : 'select'}
        color={isX ? 'red' : ''}
        className={styles.inputItem}
        usd={`$${xnav}`}
        maxAmount={tokens.xETH.balance}
        onChange={hanldeXETHAmountChanged}
        onSelected={() => setSelected(1)}
        clearTrigger={clearTrigger}
      />
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

      <DetailCell title="Redeem Fee:" content={[`${fee}%`]} />
      <DetailCell
        title="Min. Received:"
        content={[
          minOutETHtAmount.minout_slippage,
          minOutETHtAmount.minout_slippage_tvl,
        ]}
      />

      {showDisabledNotice && <NoticeCard
        content={[
          'fx governance decision to temporarily disabled Redeem functionality.',
        ]
        }
      />
      }


      <div className={styles.action}>
        <BtnWapper
          loading={redeeming}
          disabled={!canRedeem}
          onClick={handleRedeem}
          width="100%"
        >
          Redeem
        </BtnWapper>
      </div>
    </div>
  )
}
