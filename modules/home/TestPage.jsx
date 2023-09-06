import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import curve from '@curvefi/api'

// import { Button, InputNumber } from 'antd'
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
import abi from '@/config/abi'
import useETH from './controller/useETH'
import { get1inchParams } from '@/services/inch'

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

  // const { contract: ethMockTwapOracleContract } = useContract(
  //   ethMockTwapOracleAddr,
  //   abi.MockTwapOracleAbi
  // )
  // const { contract: stETHMockTwapOracleContract } = useContract(
  //   stEthMockTwapOracleAddr,
  //   abi.MockTwapOracleAbi
  // )

  const { maxLiquidatable } = treasuryContract.methods

  const _stabilityRatio = baseInfo.marketConfigRes?.stabilityRatio || 0
  const _liquidationRatio = baseInfo.marketConfigRes?.liquidationRatio || 0
  const _liquidationIncentiveRatio =
    baseInfo.incentiveConfigRes?.liquidationIncentiveRatio || 0

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
        url: 'https://eth-mainnet.alchemyapi.io/v2/NYoZTYs7oGkwlUItqoSHJeqpjqtlRT6m',
      },
      { gasPrice: 0, maxFeePerGas: 0, maxPriorityFeePerGas: 0 }
    )

    const pool1 = await curve.getPool('factory-crypto-299')
    // const pool = await curve.getPool('mim')
    const poolList = await curve.getPoolList()

    // const aaa = await pool.wallet.lpTokenBalances()

    console.log('pool---', poolList, pool1)

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
