import { useEffect, useState, useContext, useCallback } from 'react'
import { useQueries } from '@tanstack/react-query'
import {
  useContract,
  useFETH,
  useFX_Market,
  useFX_stETHTreasury,
  useFx_FxETHTwapOracle,
  useFx_ReservePool,
  useXETH,
} from 'hooks/useContracts'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import { useRebalancePoolRegistryPool } from '@/hooks/useGaugeContracts'

const useInfo = () => {
  const { _currentAccount, web3, blockNumber } = useWeb3()
  const { erc20Contract } = useContract()
  const multiCallsV2 = useMutiCallV2()
  const { contract: fETHContract } = useFETH()
  const { contract: xETHContract } = useXETH()
  const { contract: marketContract } = useFX_Market()
  const { contract: treasuryContract } = useFX_stETHTreasury()
  const { contract: reservePoolContract } = useFx_ReservePool()
  const { contract: fxETHTwapOracle } = useFx_FxETHTwapOracle()
  const { contract: RebalancePoolRegistryPoolContract } =
    useRebalancePoolRegistryPool()
  const stETHContract = erc20Contract(config.tokens.stETH)
  const [maxAbleFToken, setMaxAbleFToken] = useState({})
  const fetchBaseInfo = useCallback(async () => {
    const {
      nav,
      totalSupply: fETHTotalSupplyFn,
      balanceOf: fETHBalanceOf,
    } = fETHContract.methods
    const { totalSupply: xETHTotalSupplyFn } = xETHContract.methods
    const { totalSupply: RebalancePoolRegistryPoolTotalSupply } =
      RebalancePoolRegistryPoolContract.methods
    const {
      getCurrentNav,
      collateralRatio,
      totalBaseToken,
      beta,
      lastPermissionedPrice,
      baseTokenCap,
    } = treasuryContract.methods
    const {
      fTokenMintInSystemStabilityModePaused,
      xTokenRedeemInSystemStabilityModePaused,
      fTokenMintFeeRatio,
      fTokenRedeemFeeRatio,
      xTokenMintFeeRatio,
      xTokenRedeemFeeRatio,
      marketConfig,
      incentiveConfig,
      mintPaused,
      redeemPaused,
    } = marketContract.methods
    const { bonusRatio } = reservePoolContract.methods
    try {
      const apiCalls = [
        fETHTotalSupplyFn(),
        xETHTotalSupplyFn(),
        getCurrentNav(),
        collateralRatio(),
        totalBaseToken(),

        fTokenMintFeeRatio(),
        fTokenRedeemFeeRatio(),
        xTokenMintFeeRatio(),
        xTokenRedeemFeeRatio(),

        beta(),
        lastPermissionedPrice(),
        marketConfig(),
        incentiveConfig(),
        mintPaused(),
        redeemPaused(),
        fTokenMintInSystemStabilityModePaused(),
        xTokenRedeemInSystemStabilityModePaused(),
        nav(),
        baseTokenCap(),
        stETHContract.methods.balanceOf(config.contracts.fx_ReservePool),
        bonusRatio(config.tokens.stETH),
        fxETHTwapOracle.methods.getPrice(),
        RebalancePoolRegistryPoolTotalSupply(),
      ]
      const [
        fETHTotalSupplyRes,
        xETHTotalSupplyRes,
        CurrentNavRes,
        collateralRatioRes,
        totalBaseTokenRes,
        fTokenMintFeeRatioRes,
        fTokenRedeemFeeRatioRes,
        xTokenMintFeeRatioRes,
        xTokenRedeemFeeRatioRes,
        betaRes,
        lastPermissionedPriceRes,
        marketConfigRes,
        incentiveConfigRes,
        mintPausedRes,
        redeemPausedRes,
        fTokenMintInSystemStabilityModePausedRes,
        xTokenRedeemInSystemStabilityModePausedRes,
        fNav0Res,
        baseTokenCapRes,
        reservePoolBalancesRes,
        bonusRatioRes,
        fxETHTwapOraclePriceeInfo,
        RebalancePoolRegistryPoolTotalSupplyRes,
      ] = await multiCallsV2(apiCalls)
      // const reservePoolBalancesRes = 1e18
      // const bonusRatioRes = 1e18
      console.log(
        'BaseInfo11111',
        // fETHTotalSupplyRes, xETHTotalSupplyRes, CurrentNavRes, collateralRatioRes, totalBaseTokenRes,
        // fTokenMintFeeRatioRes, fTokenRedeemFeeRatioRes, xTokenMintFeeRatioRes, xTokenRedeemFeeRatioRes,
        //  betaRes,
        lastPermissionedPriceRes,
        marketConfigRes,
        incentiveConfigRes,
        // mintPausedRes, redeemPausedRes,
        // fTokenMintInSystemStabilityModePausedRes,
        // xTokenRedeemInSystemStabilityModePausedRes,
        fNav0Res,
        baseTokenCapRes,
        reservePoolBalancesRes,
        bonusRatioRes,
        fxETHTwapOraclePriceeInfo,
        RebalancePoolRegistryPoolTotalSupplyRes
      )

      return {
        fETHTotalSupplyRes,
        xETHTotalSupplyRes,
        CurrentNavRes,
        collateralRatioRes,
        totalBaseTokenRes,
        fTokenMintFeeRatioRes,
        fTokenRedeemFeeRatioRes,
        xTokenMintFeeRatioRes,
        xTokenRedeemFeeRatioRes,
        betaRes,
        lastPermissionedPriceRes,
        marketConfigRes,
        incentiveConfigRes,
        mintPausedRes,
        redeemPausedRes,
        fTokenMintInSystemStabilityModePausedRes,
        xTokenRedeemInSystemStabilityModePausedRes,
        fNav0Res,
        baseTokenCapRes,
        reservePoolBalancesRes,
        bonusRatioRes,
        fxETHTwapOraclePriceeInfo,
        RebalancePoolRegistryPoolTotalSupplyRes,
      }
    } catch (error) {
      console.log('baseInfoError==>', error)
      return {}
    }
  }, [
    fETHContract,
    xETHContract,
    marketContract,
    treasuryContract,
    multiCallsV2,
    _currentAccount,
    web3,
  ])

  const getMaxAbleToken = async () => {
    const {
      maxMintableFToken,
      maxMintableXToken,
      maxRedeemableFToken,
      maxRedeemableXToken,
      maxMintableXTokenWithIncentive,
      maxLiquidatable,
    } = treasuryContract.methods
    const _stabilityRatio = baseInfo.marketConfigRes?.stabilityRatio || 0
    const _liquidationRatio = baseInfo.marketConfigRes?.liquidationRatio || 0
    const _stabilityIncentiveRatio =
      baseInfo.incentiveConfigRes?.stabilityIncentiveRatio || 0
    const _liquidationIncentiveRatio =
      baseInfo.incentiveConfigRes?.liquidationIncentiveRatio || 0
    try {
      const apiCalls = [
        maxMintableFToken(_stabilityRatio),
        maxMintableXToken(_stabilityRatio),
        maxRedeemableFToken(_stabilityRatio),
        maxRedeemableXToken(_stabilityRatio),
        maxMintableXTokenWithIncentive(
          _stabilityRatio,
          _stabilityIncentiveRatio
        ),
        maxLiquidatable(_liquidationRatio, _liquidationIncentiveRatio),
      ]
      const [
        maxMintableFTokenRes,
        maxMintableXTokenRes,
        maxRedeemableFTokenRes,
        maxRedeemableXTokenRes,
        maxMintableXTokenWithIncentiveRes,
        maxLiquidatableRes,
      ] = await multiCallsV2(apiCalls)
      console.log(
        'maxMintableFTokenRes, maxMintableXTokenRes, maxRedeemableFTokenRes, maxRedeemableXTokenRes--',
        _stabilityRatio,
        maxMintableFTokenRes,
        maxMintableXTokenRes,
        maxRedeemableFTokenRes,
        maxRedeemableXTokenRes,
        maxMintableXTokenWithIncentiveRes,
        maxLiquidatableRes
      )
      setMaxAbleFToken((pre) => {
        return {
          ...pre,
          maxMintableXTokenWithIncentiveRes,
          maxLiquidatableRes,
          maxMintableFTokenRes,
        }
      })
    } catch (e) {
      console.log('getMaxAbleToken--', e)
    }
  }

  const [
    { data: baseInfo, refetch: refetchBaseInfo },
    // { data: userInfo, refetch: refetchUserInfo },
  ] = useQueries({
    queries: [
      {
        queryKey: ['baseInfo'],
        queryFn: () => fetchBaseInfo(),
        initialData: {},
      },
    ],
  })

  useEffect(() => {
    refetchBaseInfo()
  }, [_currentAccount, blockNumber])

  useEffect(() => {
    getMaxAbleToken()
  }, [blockNumber])

  return {
    baseInfo,
    ...maxAbleFToken,
    // userInfo,
  }
}
export default useInfo
