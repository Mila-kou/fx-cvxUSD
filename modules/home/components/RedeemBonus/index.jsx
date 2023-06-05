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
import useFxCommon from '../../hooks/useFxCommon'
import Button from '@/components/Button'
import { DetailCell, BonusCard, NoticeCard } from '../Common'

export default function RedeemBonus({ slippage }) {
  const { _currentAccount } = useWeb3()
  const [selected, setSelected] = useState(0)
  const [redeeming, setRedeeming] = useState(0)
  const { getMaxETHBonus } = useFxCommon()
  const { tokens } = useGlobal()
  const [clearTrigger, clearInput] = useClearInput()
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
    liquidationIncentiveRatio_text
  } = useETH()

  const [FETHtAmount, setFETHtAmount] = useState(0)
  const [XETHtAmount, setXETHtAmount] = useState(0)
  const [minOutETHtAmount, setMinOutETHtAmount] = useState({
    minout_ETH: '-',
    minout_slippage: 0,
    minout_slippage_tvl: 0,
  })
  const [detail, setDetail] = useState({
    // bonus: 75,
    // bonusRatio: 2.1,
    // ETH: 1,
    maxFTokenBaseIn: mode2_maxFTokenBaseIn_text,
    maxETHBonus_Text,
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
    // const _fee = cBN(minOutETHtAmount).multipliedBy(_redeemFee).div(1e18)
    const _fee = cBN(_redeemFee).multipliedBy(100)
    // const _feeUsd = cBN(_fee).multipliedBy(ethPrice)

    let _userETHBonus = 0
    if (cBN(tokenAmount).isGreaterThanOrEqualTo(mode2_maxFTokenBaseIn)) {
      _userETHBonus = maxETHBonus
    } else {
      _userETHBonus = getMaxETHBonus({
        MaxBaseInfETH: tokenAmount / 1e18,
        redeemFETHFee: (_redeemFETHFee || 0) / 1e18
      })
    }
    const _useETHBonus_text = checkNotZoroNum(_userETHBonus)
      ? fb4(_userETHBonus, false, 0)
      : 0

    // setDetail((pre) => {
    //   return {
    //     ...pre,
    //     useETHBonus: _useETHBonus_text,
    //   }
    // })
    return [fb4(_fee), _useETHBonus_text]
  }, [FETHtAmount, XETHtAmount, ethPrice, getMaxETHBonus])

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

  const canRedeem = useMemo(() => {
    let _enableETH = cBN(tokenAmount).isGreaterThan(0) && cBN(tokenAmount).isLessThanOrEqualTo(tokens.fETH.balance)
    return !redeemPaused && _enableETH
  }, [tokenAmount, redeemPaused, tokens.fETH.balance])

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
        minout_slippage: fb4(_minOut_CBN.toFixed(0, 1)),
        minout_slippage_tvl: _minOut_ETH_tvl,
      })
      // setDetail((pre) => {
      //   return {
      //     ...pre,
      //     ETH: fb4(_minOut_CBN.toString(10)),
      //     ETHTvl: _minOut_ETH_tvl,
      //   }
      // })
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
      const apiCall = await ethGatewayContract.methods.liquidate(
        tokenAmount,
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
      initPage()
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
      <BonusCard
        title={`${liquidationIncentiveRatio_text}% bonus ends after redeem`}
        amount={mode2_maxFTokenBaseIn_text}
        symbol="fETH"
      />

      <BalanceInput
        placeholder="0"
        balance={fb4(tokens.fETH.balance, false)}
        symbol="fETH"
        className={styles.inputItem}
        usd={`$${fnav}`}
        maxAmount={tokens.fETH.balance}
        onChange={hanldeFETHAmountChanged}
        onSelected={() => setSelected(0)}
        clearTrigger={clearTrigger}
      />

      <div className={styles.details}>
        <DetailCell title="Redeem Fee:" content={[`${fee}%`]} />
        <DetailCell
          title="Est. Received:"
          content={[minOutETHtAmount.minout_ETH]}
        />
        <DetailCell
          title="Min. Received:"
          content={[
            minOutETHtAmount.minout_slippage,
            minOutETHtAmount.minout_slippage_tvl,
          ]}
        />
        <DetailCell
          isGreen
          title="Max Bonus:"
          content={[`+${maxETHBonus_Text || 0} ETH`]}
        />
        <DetailCell
          isGreen
          title="User Bonus:"
          content={[`+${useETHBonus_text || 0} ETH`]}
        />
      </div>

      <NoticeCard />

      <div className={styles.action}>
        <BtnWapper
          loading={redeeming}
          disabled={!canRedeem}
          onClick={handleLiquidate}
          width="100%"
        >
          Redeem
        </BtnWapper>
      </div>
    </div>
  )
}
