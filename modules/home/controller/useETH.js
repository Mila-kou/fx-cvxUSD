import { useEffect, useState, useContext, useCallback, useMemo } from 'react'
import { cBN, checkNotZoroNum, checkNotZoroNumOption, fb4 } from '@/utils/index'
import {
  useFETH,
  useXETH,
  useFX_Market,
  useFX_stETHTreasury,
  useFX_stETHGateway,
} from '@/hooks/useContracts'
import useETHPrice from '../hooks/useETHPrice'
import useFxCommon, { getR } from '../hooks/useFxCommon'
import { useGlobal } from '@/contexts/GlobalProvider'

const useETH = () => {
  const { fx_info: fxInfo } = useGlobal()
  // const ethPrice = useETHPrice()
  const {
    systemStatus,
    getMaxXETHBonus,
    getMaxETHBonus,
    getStabilityModePrice,
    getUserLiquidationModePrice,
    protocolLiquidationModePrice,
    xETHBeta,
    xETHBeta_text,
    ethPrice,
  } = useFxCommon()
  const { contract: fETHContract, address: fETHAddress } = useFETH()
  const { contract: xETHContract, address: xETHAddress } = useXETH()
  const { contract: marketContract } = useFX_Market()
  const { contract: treasuryContract } = useFX_stETHTreasury()
  const { contract: stETHGatewayContract } = useFX_stETHGateway()
  const [mintLoading, setMintLoading] = useState(false)
  const [feeUsd, setFeeUsd] = useState(10)

  const handleMintFETH = async () => {
    setMintLoading(false)
    // fETHContract
  }

  const handleMintXETH = async () => { }

  const pageData = useMemo(() => {
    try {
      const _fnav = checkNotZoroNumOption(
        fxInfo.baseInfo.CurrentNavRes?._fNav,
        fb4(fxInfo.baseInfo.CurrentNavRes?._fNav)
      )
      const _xnav = checkNotZoroNumOption(
        fxInfo.baseInfo.CurrentNavRes?._xNav,
        fb4(fxInfo.baseInfo.CurrentNavRes?._xNav)
      )
      const _ethPrice_text = checkNotZoroNumOption(
        fxInfo.baseInfo.CurrentNavRes?._baseNav,
        fb4(fxInfo.baseInfo.CurrentNavRes?._baseNav, false, 18, 2)
      )
      const _fETHTotalSupply = checkNotZoroNumOption(
        fxInfo.baseInfo.fETHTotalSupplyRes,
        fb4(fxInfo.baseInfo.fETHTotalSupplyRes)
      )
      const _xETHTotalSupply = checkNotZoroNumOption(
        fxInfo.baseInfo.xETHTotalSupplyRes,
        fb4(fxInfo.baseInfo.xETHTotalSupplyRes)
      )

      const _mintFETHFee =
        checkNotZoroNum(
          fxInfo.baseInfo.fTokenMintFeeRatioRes?.defaultFeeRatio
        ) ||
          checkNotZoroNum(fxInfo.baseInfo.fTokenMintFeeRatioRes?.extraFeeRatio)
          ? cBN(fxInfo.baseInfo.fTokenMintFeeRatioRes?.defaultFeeRatio)
            .plus(fxInfo.baseInfo.fTokenMintFeeRatioRes?.extraFeeRatio)
            .toString(10)
          : 0
      const _mintXETHFee =
        checkNotZoroNum(
          fxInfo.baseInfo.xTokenMintFeeRatioRes?.defaultFeeRatio
        ) ||
          checkNotZoroNum(fxInfo.baseInfo.xTokenMintFeeRatioRes?.extraFeeRatio)
          ? cBN(fxInfo.baseInfo.xTokenMintFeeRatioRes?.defaultFeeRatio)
            .plus(fxInfo.baseInfo.xTokenMintFeeRatioRes?.extraFeeRatio)
            .toString(10)
          : 0
      const _redeemFETHFee =
        checkNotZoroNum(
          fxInfo.baseInfo.fTokenRedeemFeeRatioRes?.defaultFeeRatio
        ) ||
          checkNotZoroNum(fxInfo.baseInfo.fTokenRedeemFeeRatioRes?.extraFeeRatio)
          ? cBN(fxInfo.baseInfo.fTokenRedeemFeeRatioRes?.defaultFeeRatio)
            .plus(fxInfo.baseInfo.fTokenRedeemFeeRatioRes?.extraFeeRatio)
            .toString(10)
          : 0
      const _redeemXETHFee =
        checkNotZoroNum(
          fxInfo.baseInfo.xTokenRedeemFeeRatioRes?.defaultFeeRatio
        ) ||
          checkNotZoroNum(fxInfo.baseInfo.xTokenRedeemFeeRatioRes?.extraFeeRatio)
          ? cBN(fxInfo.baseInfo.xTokenRedeemFeeRatioRes?.defaultFeeRatio)
            .plus(fxInfo.baseInfo.xTokenRedeemFeeRatioRes?.extraFeeRatio)
            .toString(10)
          : 0

      const _totalBaseToken = checkNotZoroNum(fxInfo.baseInfo.totalBaseTokenRes)
        ? fb4(fxInfo.baseInfo.totalBaseTokenRes)
        : 0
      const _totalBaseTokenTvl = checkNotZoroNum(
        fxInfo.baseInfo.totalBaseTokenRes
      )
        ? fb4(
          cBN(fxInfo.baseInfo.totalBaseTokenRes)
            .multipliedBy(
              cBN(fxInfo.baseInfo.CurrentNavRes?._baseNav).div(1e18)
            )
            .toFixed(0, 1)
        )
        : 0

      const _collateralRatio = checkNotZoroNum(
        fxInfo.baseInfo.collateralRatioRes
      )
        ? fb4(fxInfo.baseInfo.collateralRatioRes * 100, false, 18, 2)
        : 200.0
      const _p_f = checkNotZoroNum(fxInfo.baseInfo.collateralRatioRes)
        ? fb4(
          cBN(1e18)
            .div(fxInfo.baseInfo.collateralRatioRes)
            .multipliedBy(1e20)
            .toFixed(0, 1),
          false,
          18,
          2
        )
        : 0
      const _p_x = checkNotZoroNum(fxInfo.baseInfo.collateralRatioRes)
        ? fb4(
          cBN(1e20)
            .minus(
              cBN(1e18)
                .div(fxInfo.baseInfo.collateralRatioRes)
                .multipliedBy(1e20)
            )
            .toFixed(0, 1),
          false,
          18,
          2
        )
        : 0

      console.log(
        '_fnav-_xnav-_fETHTotalSupply-_xETHTotalSupply-',
        fxInfo.baseInfo,
        _fnav,
        _xnav,
        _fETHTotalSupply,
        _xETHTotalSupply,
        _totalBaseToken
      )

      console.log(
        '_mintFETHFee-_mintXETHFee-_redeemFETHFee-_redeemXETHFee-',
        _mintFETHFee,
        _mintXETHFee,
        _redeemFETHFee,
        _redeemXETHFee
      )

      let StabilityModePrice = getStabilityModePrice({
        p_f: cBN(1e18).div(fxInfo.baseInfo.collateralRatioRes).toString(10),
        beta: fxInfo.baseInfo.betaRes / 1e18,
        s: ethPrice,
      })
      StabilityModePrice = checkNotZoroNumOption(
        StabilityModePrice,
        fb4(StabilityModePrice, false, 0, 2)
      )
      let UserLiquidationModePrice = getUserLiquidationModePrice({
        p_f: cBN(1e18).div(fxInfo.baseInfo.collateralRatioRes).toString(10),
        beta: fxInfo.baseInfo.betaRes / 1e18,
        s: ethPrice,
      })
      UserLiquidationModePrice = checkNotZoroNumOption(
        UserLiquidationModePrice,
        fb4(UserLiquidationModePrice, false, 0, 2)
      )
      const ProtocolLiquidationModePrice = checkNotZoroNumOption(
        protocolLiquidationModePrice,
        fb4(protocolLiquidationModePrice, false, 0, 2)
      )

      const lastPermissionedPrice = checkNotZoroNumOption(
        fxInfo.baseInfo.lastPermissionedPriceRes,
        fb4(fxInfo.baseInfo.lastPermissionedPriceRes, false, 18, 2)
      )

      let _R = getR({
        s: fxInfo.baseInfo.CurrentNavRes?._baseNav,
        s0: fxInfo.baseInfo.lastPermissionedPriceRes,
      })
      _R = fb4(checkNotZoroNumOption(_R, _R * 100), false, 0, 2)

      const maxXETHBonus = getMaxXETHBonus({
        MaxBaseInETH:
          (fxInfo.maxMintableXTokenWithIncentiveRes?._maxBaseIn || 0) / 1e18,
        mintXETHFee: (_mintXETHFee || 0) / 1e18,
      })
      console.log('maxXETHBonus---', maxXETHBonus)
      const maxXETHBonus_text = checkNotZoroNumOption(
        maxXETHBonus,
        fb4(maxXETHBonus, false, 0)
      )
      const mode1_maxBaseIn =
        fxInfo.maxMintableXTokenWithIncentiveRes?._maxBaseIn
      const mode1_maxBaseIn_text = checkNotZoroNumOption(
        fxInfo.maxMintableXTokenWithIncentiveRes?._maxBaseIn,
        fb4(fxInfo.maxMintableXTokenWithIncentiveRes?._maxBaseIn)
      )
      const mode1_maxXTokenMintable_text = checkNotZoroNumOption(
        fxInfo.maxMintableXTokenWithIncentiveRes?._maxXTokenMintable,
        fb4(fxInfo.maxMintableXTokenWithIncentiveRes?._maxXTokenMintable)
      )

      const mode2_maxFTokenBaseIn =
        fxInfo.maxLiquidatableRes?._maxFTokenLiquidatable
      const mode2_maxFTokenBaseIn_text = checkNotZoroNumOption(
        mode2_maxFTokenBaseIn,
        fb4(mode2_maxFTokenBaseIn)
      )
      const mode2_maxETHBaseOut = fxInfo.maxLiquidatableRes?._maxBaseOut
      const mode2_maxETHBaseOut_text = checkNotZoroNumOption(
        mode2_maxETHBaseOut,
        fb4(mode2_maxETHBaseOut)
      )

      const maxETHBonus = getMaxETHBonus({
        MaxBaseInfETH:
          (fxInfo.maxLiquidatableRes?._maxFTokenLiquidatable || 0) / 1e18,
        redeemFETHFee: (_redeemFETHFee || 0) / 1e18,
      })
      const maxETHBonus_Text = checkNotZoroNumOption(
        maxETHBonus,
        fb4(maxETHBonus, false, 0)
      )

      console.log('fxInfo.incentiveConfigRes---', fxInfo)
      const stabilityIncentiveRatio_text = checkNotZoroNumOption(
        fxInfo.baseInfo.incentiveConfigRes?.stabilityIncentiveRatio,
        fb4(fxInfo.baseInfo.incentiveConfigRes?.stabilityIncentiveRatio * 100)
      )
      const liquidationIncentiveRatio_text = checkNotZoroNumOption(
        fxInfo.baseInfo.incentiveConfigRes?.liquidationIncentiveRatio,
        fb4(fxInfo.baseInfo.incentiveConfigRes?.liquidationIncentiveRatio * 100)
      )
      console.log('maxETHBonus--', maxETHBonus, maxETHBonus_Text)
      let isShowBonusTab = false
      if (checkNotZoroNum(fxInfo.baseInfo.incentiveConfigRes?.stabilityIncentiveRatio) && checkNotZoroNum(fxInfo.baseInfo.incentiveConfigRes?.liquidationIncentiveRatio)) {
        isShowBonusTab = true
      }

      return {
        fnav: _fnav,
        xnav: _xnav,
        ethPrice,
        ethPrice_text: _ethPrice_text,
        fETHTotalSupply: _fETHTotalSupply,
        xETHTotalSupply: _xETHTotalSupply,
        _mintFETHFee,
        _mintXETHFee,
        _redeemFETHFee,
        _redeemXETHFee,
        totalBaseToken: _totalBaseToken,
        totalBaseTokenTvl: _totalBaseTokenTvl,
        collateralRatio: _collateralRatio,
        p_f: _p_f,
        p_x: _p_x,

        StabilityModePrice,
        UserLiquidationModePrice,
        ProtocolLiquidationModePrice,
        systemStatus,
        lastPermissionedPrice,
        R: _R,
        mintPaused: fxInfo.baseInfo.mintPausedRes,
        redeemPaused: fxInfo.baseInfo.redeemPausedRes,
        fTokenMintInSystemStabilityModePaused:
          fxInfo.baseInfo.fTokenMintInSystemStabilityModePausedRes,
        xTokenRedeemInSystemStabilityModePaused:
          fxInfo.baseInfo.xTokenRedeemInSystemStabilityModePausedRes,

        mode1_maxBaseIn,
        mode1_maxBaseIn_text,
        mode1_maxXTokenMintable_text,
        maxXETHBonus,
        maxXETHBonus_text,
        mode2_maxFTokenBaseIn,
        mode2_maxFTokenBaseIn_text,
        mode2_maxETHBaseOut,
        mode2_maxETHBaseOut_text,
        maxETHBonus,
        maxETHBonus_Text,
        xETHBeta,
        xETHBeta_text,

        stabilityIncentiveRatio_text,
        liquidationIncentiveRatio_text,
        isShowBonusTab
      }
    } catch (error) {
      return {
        fnav: '-',
        xnav: '-',
        ethPrice: 1,
        ethPrice_text: '-',
      }
    }
  }, [
    fxInfo,
    getStabilityModePrice,
    xETHBeta,
    xETHBeta_text,
    getUserLiquidationModePrice,
    protocolLiquidationModePrice,
    systemStatus,
    getMaxETHBonus,
    getMaxXETHBonus,
    ethPrice,
  ])
  return {
    ...fxInfo,
    fETHAddress,
    xETHAddress,
    fETHContract,
    xETHContract,
    marketContract,
    treasuryContract,
    stETHGatewayContract,
    ...pageData,
  }
}

export default useETH
