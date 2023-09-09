import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import curve from '@curvefi/api'

// import { Button, InputNumber } from 'antd'
import { ethers, Contract, Networkish, BigNumberish, Numeric } from 'ethers'
import SimpleInput from '@/components/SimpleInput'
import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import { cBN, checkNotZoroNum, checkNotZoroNumOption, fb4 } from '@/utils/index'
import { useToken } from '@/hooks/useTokenInfo'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import { getGas } from '@/utils/gas'
import useGlobal from '@/hooks/useGlobal'
import Swap from './components/Swap'
import SystemStatistics from './components/SystemStatistics'
import styles from './styles.module.scss'
import Button from '@/components/Button'

import {
  useContract,
  useErc20Token,
  useFETH,
  useFX_stETHTreasury,
  useFx_FxETHTwapOracle,
  useFx_ReservePool,
} from '@/hooks/useContracts'
import useETH from './controller/useETH'
import { get1inchParams } from '@/services/inch'
import abi from '@/config/abi'

const { stETH, fETH } = config.tokens

export default function HomePage() {
  const { showSystemStatistics } = useGlobal()
  const [ethPrice, setEthPrice] = useState(0)
  const [stEthPrice, setStEthPrice] = useState(0)
  const [pricePriceInfo, setPriceInfo] = useState({})
  const [emaPriceInfo, setEmaPrice] = useState({})
  const {
    fnav,
    xnav,
    collateralRatio,
    p_f,
    p_x,
    fETHTotalSupply,
    xETHTotalSupply,
    totalBaseToken,
    totalBaseTokenTvl,

    StabilityModePrice,
    UserLiquidationModePrice,
    ProtocolLiquidationModePrice,
    systemStatus,
    ethPrice_text,
    lastPermissionedPrice,
    R,

    xETHBeta_text,

    isETHPriceGreatThanETHLastPrice,
    baseTokenCap,
    baseTokenCap_text,
    baseInfo,
  } = useETH()

  const { contract: fxETHTwapOracle } = useFx_FxETHTwapOracle()
  const { contract: FETHContract } = useFETH()

  const { contract: ReservePoolContract, address: ReservePoolAddress } =
    useFx_ReservePool()

  const { tokenContract: stETHContract } = useErc20Token(
    config.tokens.stETH,
    ReservePoolAddress
  )
  const { contract: treasuryContract } = useFX_stETHTreasury()

  const { getContract } = useContract()

  const { _currentAccount, web3 } = useWeb3()
  const [priceLoading, setPriceLoading] = useState(0)
  const ethMockTwapOracleAddr = '0x84496fc45b3b3fda16cc8786bfa07674ac556e84'
  const stEthMockTwapOracleAddr = '0x0f9d2ba589a9257f8432e88ff6d12a2ff684dc3c'
  const CurvefiSwapRouterAddress = '0x99a58482bd75cbab83b27ec03ca68ff489b5788f'

  const { contract: CurvefiSwapContract } = useContract(
    CurvefiSwapRouterAddress,
    abi.curveSwapABI
  )

  // const { contract: ethMockTwapOracleContract } = useContract(
  //   ethMockTwapOracleAddr,
  //   abi.MockTwapOracleAbi
  // )
  // const { contract: stETHMockTwapOracleContract } = useContract(
  //   stEthMockTwapOracleAddr,
  //   abi.MockTwapOracleAbi
  // )
  // 定义一个编码函数
  const encodeTransaction = async (to, data) => {
    const encodedTx = await web3.eth.abi.encodeParameters(
      ['address', 'bytes'],
      [to, data]
    )
    // console.log('encodedTx---', encodedTx)
    return encodedTx
  }

  const _getExchangeMultipleArgs = (route) => {
    let _route = []
    if (route.length > 0) _route.push(route[0].inputCoinAddress)
    let _swapParams = []
    let _factorySwapAddresses = []
    for (const routeStep of route) {
      _route.push(routeStep.poolAddress, routeStep.outputCoinAddress)
      _swapParams.push([routeStep.i, routeStep.j, routeStep.swapType])
      _factorySwapAddresses.push(routeStep.swapAddress)
    }
    _route = _route.concat(Array(9 - _route.length).fill(config.zeroAddress))
    _swapParams = _swapParams.concat(
      Array(4 - _swapParams.length).fill([0, 0, 0])
    )
    _factorySwapAddresses = _factorySwapAddresses.concat(
      Array(4 - _factorySwapAddresses.length).fill(config.zeroAddress)
    )

    return { _route, _swapParams, _factorySwapAddresses }
  }

  const { maxLiquidatable } = treasuryContract.methods

  const _stabilityRatio = baseInfo.marketConfigRes?.stabilityRatio || 0
  const _liquidationRatio = baseInfo.marketConfigRes?.liquidationRatio || 0
  const _liquidationIncentiveRatio =
    baseInfo.incentiveConfigRes?.liquidationIncentiveRatio || 0

  // const aa = await ReservePoolContract.methods.liquidate()

  console.log(
    '_stabilityRatio,_liquidationRatio',
    _stabilityRatio,
    _liquidationRatio,
    _liquidationIncentiveRatio
  )

  const handlePool = async () => {
    await curve.init(
      'JsonRpc',
      {
        // url: 'http://13.229.217.38:10548',
        url: 'https://eth-mainnet.alchemyapi.io/v2/NYoZTYs7oGkwlUItqoSHJeqpjqtlRT6m',
        privateKey:
          // Aladdin test 账号
          '9aebaf40af161432e131cb91d49179bca54e25866e565f7daa120b3a08b45fe3',
      },
      // {
      //   externalProvider: web3,
      // },
      { gasPrice: 0, maxFeePerGas: 0, maxPriorityFeePerGas: 0 }
    )

    await curve.factory.fetchPools()
    await curve.cryptoFactory.fetchPools()
    await curve.crvUSDFactory.fetchPools()
    await curve.EYWAFactory.fetchPools()
    await curve.tricryptoFactory.fetchPools()

    const stETH_balance = await curve.getBalances([stETH])
    const fETH_balance = await curve.getBalances([fETH])

    console.log(
      '---stETH_balance, fETH_balance----',
      stETH_balance.toString(),
      fETH_balance.toString()
    )

    const amount = 0.1
    const amountString = cBN(amount).times(1e18).toString(10)

    const { route, output } = await curve.router.getBestRouteAndOutput(
      stETH,
      fETH,
      amount
    )

    const { _route, _swapParams, _factorySwapAddresses } =
      _getExchangeMultipleArgs(route)

    console.log(
      '_route, _swapParams, _factorySwapAddresses',
      _route,
      _swapParams,
      _factorySwapAddresses
    )
    const gasLimit =
      await CurvefiSwapContract.methods.exchange_multiple.estimateGas(
        _route,
        _swapParams,
        amountString,
        0,
        _factorySwapAddresses,
        { value: 0 }
      )
    console.log('gasLimit____', gasLimit)
    return
    const testSwapCall = await CurvefiSwapContract.methods.exchange_multiple(
      _route,
      _swapParams,
      amountString,
      0,
      _factorySwapAddresses
    )
    return
    console.log('ss---route---', route, output)

    const isApproved = await curve.router.isApproved(stETH, amount)

    console.log('ss---isApproved---', isApproved)

    // if (!isApproved) {
    //   await curve.router.approve(stETH, amount)
    // }
    debugger

    const swapTx = await curve.router.swap(stETH, fETH, amount)

    console.log('ss---swapTx---', swapTx)

    return
    const swappedAmount = await curve.router.getSwappedAmount(swapTx, fETH)

    console.log('ss---swappedAmount---', swappedAmount)

    const stETH_balance2 = await curve.getBalances([stETH])
    const fETH_balance2 = await curve.getBalances([fETH])

    console.log(
      'ss---tETH_balance, fETH_balance--2--',
      stETH_balance2.toString(),
      fETH_balance2.toString()
    )

    // const aaa = await pool.wallet.lpTokenBalances()

    // const { route, output } = await curve.router.getBestRouteAndOutput(
    //   '0xae7ab96520de3a18e5e111b5eaab095312d7fe84',
    //   '0x53805a76e1f5ebbfe7115f16f9c87c2f7e633726',
    //   '0.01'
    // )
    // console.log('route--output--', route)

    // try {
    //   const _lpPoolCurveToken = '0x6c280db098db673d30d5b34ec04b6387185d3620' // CLEV/ETH

    //   // const _api = CurveContract.methods.exchange(
    //   //   lpSwapAddress,
    //   //   token0Address,
    //   //   token1Address,
    //   //   _num.toString(10),
    //   //   0,
    //   //   fx_Market
    //   // )
    //   // const exchage_amount = await _api.call({ from: fx_Market })

    //   return
    //   const _stETHBalance = await stETHContract.methods
    //     .balanceOf(ReservePoolAddress)
    //     .call()

    //   const { _maxBaseOut: __maxLiquidateETHNum, _maxFTokenLiquidatable } =
    //     await maxLiquidatable(
    //       _liquidationRatio,
    //       _liquidationIncentiveRatio
    //     ).call()

    //   let _swapStETHNum
    //   if (cBN(_stETHBalance).gte(__maxLiquidateETHNum)) {
    //     _swapStETHNum = __maxLiquidateETHNum
    //   } else {
    //     _swapStETHNum = _stETHBalance
    //   }
    //   console.log('data--data--', _swapStETHNum)

    //   const { data } = await get1inchParams({
    //     src: config.tokens.stETH,
    //     dst: config.tokens.fETH,
    //     amount: cBN(1).times(1e18).toString(10),
    //     from: ReservePoolAddress,
    //     slippage: Number(0),
    //     disableEstimate: true,
    //     allowPartialFill: false,
    //   })
    //   console.log('data--data--', data)
    // } catch (error) {
    //   console.log('data--data--', error)
    // }
  }
  const handleSendPool = async () => {}

  const handleGetPoolAmount = async () => {
    console.log('handleGetPoolAmount')
    // fToken
    const _fETHBalance = await FETHContract.methods
      .balanceOf(ReservePoolAddress)
      .call()
    const _stETHBalance = await stETHContract.methods
      .balanceOf(ReservePoolAddress)
      .call()

    console.log(
      '_fETHBalance----fNAV---xnav--_stETHBalance',
      _fETHBalance,
      fnav,
      xnav,
      _stETHBalance
    )
  }
  return (
    <div className={styles.container}>
      <div className={styles.item}>
        {/* min fETH: <SimpleInput onChange={handleChange_minFETH} />
        min fETH: <SimpleInput onChange={handleChange_CurrentETHPrice} />
        <Button width="100%" loading={priceLoading} onClick={handlePrice}>
          getPrice
        </Button> */}
        ;
        <Button width="100%" loading={priceLoading} onClick={handlePool}>
          Liquidate
        </Button>
        <br />
        <Button
          width="100%"
          loading={priceLoading}
          onClick={handleGetPoolAmount}
        >
          getPoolInfo
        </Button>
      </div>
    </div>
  )
}
