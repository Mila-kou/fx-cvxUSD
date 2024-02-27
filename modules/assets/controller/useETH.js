import { useMemo } from 'react'
import { cBN, checkNotZoroNum, checkNotZoroNumOption, fb4 } from '@/utils/index'
import {
  useFETH,
  useXETH,
  useFX_Market,
  useFX_stETHTreasury,
  useFX_stETHGateway,
} from '@/hooks/useContracts'
import useFxCommon, { getR } from '../hooks/useFxCommon'
import { useGlobal } from '@/contexts/GlobalProvider'

const useETH = () => {
  const { fx_info: fxInfo } = useGlobal()
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
    isXETHBouns,
    isFETHBouns,
  } = useFxCommon()
  const { contract: fETHContract, address: fETHAddress } = useFETH()
  const { contract: xETHContract, address: xETHAddress } = useXETH()
  const { contract: marketContract } = useFX_Market()
  const { contract: treasuryContract } = useFX_stETHTreasury()
  const { contract: stETHGatewayContract } = useFX_stETHGateway()

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
      const _baseTokenCap_text = checkNotZoroNumOption(
        fxInfo.baseInfo.baseTokenCapRes,
        fb4(fxInfo.baseInfo.baseTokenCapRes)
      )

      const _fMarketCap = fb4(
        cBN(fxInfo.baseInfo.fETHTotalSupplyRes).multipliedBy(_fnav),
        true
      )

      const _xMarketCap = fb4(
        cBN(fxInfo.baseInfo.xETHTotalSupplyRes).multipliedBy(_xnav),
        true
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

      const xETHBonus = checkNotZoroNumOption(
        fxInfo.maxMintableXTokenWithIncentiveRes?._maxBaseIn,
        cBN(fxInfo.maxMintableXTokenWithIncentiveRes?._maxBaseIn)
          .times(fxInfo.baseInfo?.bonusRatioRes)
          .div(1e18)
      )

      const maxETHBonus = getMaxETHBonus({
        MaxBaseInfETH:
          (fxInfo.maxLiquidatableRes?._maxFTokenLiquidatable || 0) / 1e18,
        redeemFETHFee: (_redeemFETHFee || 0) / 1e18,
      })

      console.log('maxETHBonus--', maxETHBonus)

      return {
        fnav: _fnav,
        xnav: _xnav,
        fMarketCap: _fMarketCap,
        xMarketCap: _xMarketCap,
        ethPrice,
        ethPrice_text: _ethPrice_text,
        baseTokenCap_text: _baseTokenCap_text,
        baseTokenCap: checkNotZoroNum(fxInfo.baseInfo?.baseTokenCapRes)
          ? fxInfo.baseInfo.baseTokenCapRes / 1e18
          : 0,
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

        systemStatus,
        lastPermissionedPrice,
        R: _R,
        mintPaused: fxInfo.baseInfo.mintPausedRes,
        redeemPaused: fxInfo.baseInfo.redeemPausedRes,
        fTokenMintInSystemStabilityModePaused:
          fxInfo.baseInfo.fTokenMintInSystemStabilityModePausedRes,
        xTokenRedeemInSystemStabilityModePaused:
          fxInfo.baseInfo.xTokenRedeemInSystemStabilityModePausedRes,

        maxXETHBonus,
        maxETHBonus,
        xETHBeta,
        xETHBeta_text,

        xETHBonus,
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
    isXETHBouns,
    isFETHBouns,
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
