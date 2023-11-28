import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { DownOutlined } from '@ant-design/icons'
import BigNumber from 'bignumber.js'
import BalanceInput, { useClearInput } from '@/components/BalanceInput'
import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import { cBN, checkNotZoroNum, checkNotZoroNumOption, fb4 } from '@/utils/index'
import { useToken } from '@/hooks/useTokenInfo'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import useGlobal from '@/hooks/useGlobal'
import styles from './styles.module.scss'
import useETH from '../../controller/useETH'
import useApprove from '@/hooks/useApprove'
import { useFx_FxGateway } from '@/hooks/useContracts'
import { DetailCell, NoticeCard, BonusCard } from '../Common'
import Button from '@/components/Button'
import useFxCommon_New from '../../hooks/useFxCommon_New'

const OPTIONS = [
  ['stETH', config.tokens.stETH],
  [
    'WETH',
    config.tokens.weth,
    ['0x277090c5ae6b80a3c525f09d7ae464a8fa83d9c08804'],
  ],
  [
    'USDC',
    config.tokens.usdc,
    [
      '0x277090c5ae6b80a3c525f09d7ae464a8fa83d9c08804',
      '0x49fe1afc5df753cd252e1068dfa0428d3755b20a6c08',
    ],
  ],
  [
    'USDT',
    config.tokens.usdt,
    [
      '0x277090c5ae6b80a3c525f09d7ae464a8fa83d9c08804',
      '0x4bd7d6e5d89150b5caa781bc12012fe06ea8578ad008',
    ],
  ],
]

export default function Redeem({ slippage }) {
  const { _currentAccount } = useWeb3()
  const [selected, setSelected] = useState(0)
  const [redeeming, setRedeeming] = useState(0)
  const { tokens } = useGlobal()
  const [clearTrigger, clearInput] = useClearInput()

  const fxCommonNew = useFxCommon_New()

  const [symbol, setSymbol] = useState('stETH')
  const { contract: FxGatewayContract, address: fxGatewayContractAddress } =
    useFx_FxGateway()

  const [redeemBouns, setRedeemBouns] = useState(0)

  const [showDisabledNotice, setShowDisabledNotice] = useState(false)

  const {
    fETHAddress,
    xETHAddress,
    fETHContract,
    xETHContract,
    marketContract,
    treasuryContract,
    _mintFETHFee,
    stETHGatewayContract,
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
    isFETHBouns,
  } = useETH()

  const [FETHtAmount, setFETHtAmount] = useState(0)
  const [XETHtAmount, setXETHtAmount] = useState(0)
  const [priceLoading, setPriceLoading] = useState(false)
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

  const bonus_text = useMemo(() => {
    const { reservePoolBalancesRes } = baseInfo

    // console.log('baseInfo.bonusRatioRes---', baseInfo.bonusRatioRes)
    return BigNumber.min(cBN(reservePoolBalancesRes), cBN(redeemBouns))
  }, [redeemBouns, baseInfo?.reservePoolBalancesRes])

  const [_fnav, _xnav, _ethPrice_text, _isPriceValid] = useMemo(() => {
    if (
      baseInfo.fxETHTwapOraclePriceeInfo &&
      !baseInfo.fxETHTwapOraclePriceeInfo._isValid
    ) {
      let _state
      if (isF) {
        _state = fxCommonNew._loadSwapState('RedeemFToken')
      } else {
        _state = fxCommonNew._loadSwapState('RedeemXToken')
      }
      return [
        fb4(_state.fNav),
        fb4(_state.xNav),
        fb4(_state.baseNav),
        baseInfo.fxETHTwapOraclePriceeInfo._isValid,
      ]
    }
    return [fnav, xnav, ethPrice_text, true]
  }, [baseInfo, isF])

  const canReceived = useMemo(() => {
    if (!minOutETHtAmount.minout_slippage) return false
    if (isF) {
      return cBN(tokenAmount).isLessThanOrEqualTo(tokens.fETH.balance)
    }
    return cBN(tokenAmount).isLessThanOrEqualTo(tokens.xETH.balance)
  }, [
    tokenAmount,
    minOutETHtAmount.minout_slippage,
    tokens.fETH.balance,
    tokens.xETH.balance,
    isF,
  ])

  const [fee, feeUsd, feeCBN] = useMemo(() => {
    let __redeemFETHFee = _redeemFETHFee
    let __redeemXETHFee = _redeemXETHFee
    if (systemStatus == 0) {
      __redeemFETHFee = baseInfo.fTokenRedeemFeeRatioRes?.defaultFeeRatio || 0
      __redeemXETHFee = baseInfo.xTokenRedeemFeeRatioRes?.defaultFeeRatio || 0
    }
    let _fee
    let _feeCBN
    if (isF) {
      _fee = cBN(__redeemFETHFee).multipliedBy(100).toString(10)
      _feeCBN = __redeemFETHFee
    } else {
      _fee = cBN(__redeemXETHFee).multipliedBy(100).toString(10)
      _feeCBN = __redeemXETHFee
    }
    const _feeUsd = cBN(_fee).multipliedBy(ethPrice)
    return [fb4(_fee), fb4(_feeUsd), _feeCBN]
  }, [isF, systemStatus, ethPrice])

  // const fxTokenAmount = useMemo(() => {
  //   console.log('ethAmount', manualNum, ETHtAmountIn, fnav, feeCBN)
  //   const _tokenAmountIn = ETHtAmountIn
  //   const _tokenNav = isF ? fnav : xnav
  //   const _needETH = cBN(_tokenAmountIn)
  //     .div(1e18)
  //     .times(ethPrice)
  //     .times(cBN(1).minus(cBN(feeCBN).div(1e18)))
  //     .div(_tokenNav)
  //   console.log('ethAmount', _needETH.toString(10))
  //   // setETHtAmount(_needETH.times(1e18).toString(10))
  // }, [ETHtAmountIn, manualNum])

  // const hanldeETHAmountChanged = (v) => {
  //   setETHtAmountIn(v.toString(10))
  //   const _pre = manualNum + 1
  //   setManualNum(_pre)
  // }

  const hanldeFETHAmountChanged = (v) => {
    setFETHtAmount(v.toString(10))
  }

  const hanldeXETHAmountChanged = (v) => {
    setXETHtAmount(v.toString(10))
  }

  const selectTokenInfo = useToken(
    selectTokenAddress,
    symbol == 'stETH' ? 'fx_redeem' : 'fx_fxGateway'
  )

  const { BtnWapper, needApprove } = useApprove({
    approveAmount: tokenAmount,
    allowance: selectTokenInfo.allowance,
    tokenContract: selectTokenInfo.contract,
    approveAddress: selectTokenInfo.contractAddress,
  })

  const _account = useMemo(() => {
    const isInsufficient = cBN(tokenAmount).isGreaterThan(
      tokens[isF ? 'fETH' : 'xETH'].balance
    )

    if (isInsufficient) {
      return config.approvedAddress
    }
    return needApprove && symbol !== 'stETH'
      ? config.approvedAddress
      : _currentAccount
  }, [needApprove, _currentAccount, tokenAmount, isF, symbol == 'stETH'])

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
    // console.log(
    //   'redeemPaused---',
    //   redeemPaused,
    //   xTokenRedeemInSystemStabilityModePaused,
    //   systemStatus,
    //   _xTokenRedeemInSystemStabilityModePaused
    // )
    setShowDisabledNotice(
      redeemPaused || _xTokenRedeemInSystemStabilityModePaused
    )
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
    setRedeemBouns(0)
  }

  const getMinAmount = async (needLoading) => {
    try {
      if (!checkNotZoroNum(tokenAmount)) {
        setMinOutETHtAmount({
          minout_ETH: 0,
          minout_slippage: 0,
          minout_slippage_tvl: 0,
        })
        setRedeemBouns(0)
        return 0
      }
      if (needLoading) {
        setPriceLoading(true)
      }

      let _mockAmount = tokenAmount
      let _mockRatio = 1
      let _redeemBonus = 0

      console.log('_account----', _account)
      // 默认比例 0.01
      if (_account !== _currentAccount) {
        _mockAmount = cBN(1).shiftedBy(18).toString()
        _mockRatio = cBN(tokenAmount).div(cBN(10).pow(18)).toFixed(4, 1)
      }
      console.log('fromAmount----', _mockAmount, _mockRatio)

      let minout_ETH
      let _fTokenIn = 0
      let _xTokenIn = 0
      if (isF) {
        _fTokenIn = _mockAmount
        _xTokenIn = 0
      } else {
        _xTokenIn = _mockAmount
        _fTokenIn = 0
      }
      if (symbol === 'stETH') {
        const { _baseOut, _bonus } = await marketContract.methods
          .redeem(_fTokenIn, _xTokenIn, _account, 0)
          .call({ from: _account })
        minout_ETH = _baseOut
        _redeemBonus = cBN(_bonus || 0)
      } else {
        const route = OPTIONS.filter((item) => item[0] === symbol)[0][2]
        const { _dstOut, _bonus } = await FxGatewayContract.methods
          .redeem(
            [config.contracts.redeemConverter, route],
            _fTokenIn,
            _xTokenIn,
            0,
            0
          )
          .call({ from: _account })
        minout_ETH = _dstOut
        _redeemBonus = cBN(_bonus || 0)
      }
      // 比例计算
      minout_ETH *= _mockRatio
      const _minOut_CBN = (cBN(minout_ETH) || cBN(0)).multipliedBy(
        cBN(1).minus(cBN(slippage).dividedBy(100))
      )
      const _minOut_ETH_tvl = fb4(_minOut_CBN.times(ethPrice).toString(10))
      setMinOutETHtAmount({
        minout_ETH: checkNotZoroNumOption(
          minout_ETH,
          fb4(minout_ETH.toString(10), false, config.zapTokens[symbol].decimals)
        ),
        minout_slippage: fb4(
          _minOut_CBN.toString(10),
          false,
          config.zapTokens[symbol].decimals
        ),
        minout_slippage_tvl: _minOut_ETH_tvl,
      })
      setRedeemBouns(_redeemBonus.multipliedBy(_mockRatio))
      setPriceLoading(false)
      return _minOut_CBN.toFixed(0, 1)
    } catch (error) {
      console.log(error)
      setMinOutETHtAmount({
        minout_ETH: 0,
        minout_slippage: 0,
        minout_slippage_tvl: 0,
      })
      setRedeemBouns(0)
      setPriceLoading(false)
      if (
        error?.message &&
        error.message.includes('burn amount exceeds balance')
      ) {
        noPayableErrorAction(`error_mint`, 'ERC20: burn amount exceeds balance')
      }
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

      let apiCall
      if (symbol === 'stETH') {
        apiCall = await marketContract.methods.redeem(
          _fTokenIn,
          _xTokenIn,
          _currentAccount,
          _minoutETH
        )
      } else {
        const route = OPTIONS.filter((item) => item[0] === symbol)[0][2]

        const { _dstOut, _baseOut } = await FxGatewayContract.methods
          .redeem(
            [config.contracts.redeemConverter, route],
            _fTokenIn,
            _xTokenIn,
            0,
            0
          )
          .call({ from: _currentAccount })
        const dstOut = (cBN(_dstOut) || cBN(0))
          .multipliedBy(cBN(1).minus(cBN(slippage).dividedBy(100)))
          .toFixed(0)
        const baseOut = (cBN(_baseOut) || cBN(0))
          .multipliedBy(cBN(1).minus(cBN(slippage).dividedBy(100)))
          .toFixed(0)
        // console.log(
        //   '_fTokenIn----',
        //   _fTokenIn,
        //   _xTokenIn,
        //   dstOut.toString(),
        //   baseOut.toString()
        // )
        // console.log('dstOut---', dstOut, baseOut)
        apiCall = await FxGatewayContract.methods.redeem(
          ['0xAF345c813CE17Cc5837BfD14a910D365223F3B95', route],
          _fTokenIn,
          _xTokenIn,
          baseOut.toString(),
          dstOut.toString()
        )
      }
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
      console.log('redeem---error', e)
      setRedeeming(false)
    }
  }
  useEffect(() => {
    initPage()
  }, [selected])

  useEffect(() => {
    getMinAmount(true)
  }, [isF, slippage, tokenAmount, symbol])

  const toUsd = useMemo(() => {
    if (symbol === 'fETH') {
      return _fnav
    }
    if (symbol === 'xETH') {
      return _xnav
    }
    if (['stETH', 'ETH'].includes(symbol)) {
      return _ethPrice_text
    }
    return tokens[symbol].price
  }, [symbol, _ethPrice_text, _fnav, _xnav])

  return (
    <div className={styles.container}>
      {isFETHBouns ? (
        <BonusCard
          title={`Redeem fETH will earn ${fb4(
            cBN(baseInfo.bonusRatioRes).times(100),
            false,
            18,
            2
          )}% bonus now`}
          amount=""
          symbol=""
        />
      ) : null}
      <BalanceInput
        placeholder="-"
        balance={fb4(tokens.fETH.balance, false)}
        symbol="fETH"
        color={isF ? 'blue' : ''}
        className={styles.inputItem}
        usd={`$${_fnav}`}
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
        usd={`$${_xnav}`}
        maxAmount={tokens.xETH.balance}
        onChange={hanldeXETHAmountChanged}
        onSelected={() => setSelected(1)}
        clearTrigger={clearTrigger}
      />
      <div className={styles.arrow}>
        <DownOutlined />
      </div>

      <BalanceInput
        symbol={symbol}
        placeholder={minOutETHtAmount.minout_ETH}
        decimals={config.zapTokens[symbol].decimals}
        usd={`$${toUsd}`}
        disabled
        loading={priceLoading}
        className={styles.inputItem}
        options={OPTIONS.map((item) => item[0])}
        onSymbolChanged={(v) => setSymbol(v)}
      />

      <DetailCell title="Redeem Fee:" content={[`${fee}%`]} />
      {canReceived && (
        <DetailCell
          title="Min. Received:"
          content={[
            minOutETHtAmount.minout_slippage,
            // minOutETHtAmount.minout_slippage_tvl,
          ]}
        />
      )}
      {isFETHBouns && isF && redeemBouns ? (
        <DetailCell
          title="Redeem fETH Bonus:"
          content={[fb4(bonus_text), '', 'stETH']}
        />
      ) : null}

      {showDisabledNotice ? (
        <NoticeCard
          content={[
            ' f(x) governance decision to temporarily disable redemption.',
          ]}
        />
      ) : null}
      {!_isPriceValid ? (
        <NoticeCard content={[`stETH price: $${_ethPrice_text}`]} />
      ) : null}

      <div className={styles.action}>
        {symbol === 'stETH' ? (
          <Button
            loading={redeeming}
            disabled={!canRedeem}
            onClick={handleRedeem}
            width="100%"
          >
            Redeem
          </Button>
        ) : (
          <BtnWapper
            loading={redeeming}
            disabled={!canRedeem}
            onClick={handleRedeem}
            width="100%"
          >
            Redeem
          </BtnWapper>
        )}
      </div>
    </div>
  )
}
