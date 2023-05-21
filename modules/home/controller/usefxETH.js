import { useEffect, useState, useContext, useCallback, useMemo } from 'react'
import useInfo from '../hooks/useInfo'
import { cBN, checkNotZoroNum, checkNotZoroNumOption, fb4 } from '@/utils/index'
import { useFETH, useXETH, useFX_Market, useFX_Treasury, useFX_ETHGateway } from '@/hooks/useContracts'
import useETHPrice from '../hooks/useETHPrice'
import useFxCommon from '../hooks/useFxCommon'

const usefxETH = () => {
  const fxInfo = useInfo()
  // const ethPrice = useETHPrice()
  const { getSystemStatus, getStabilityModePrice, getUserLiquidationModePrice, getProtocolLiquidationModePrice } = useFxCommon()
  const { contract: fETHContract, address: fETHAddress } = useFETH
  const { contract: xETHContract, address: xETHAddress } = useXETH()
  const { contract: marketContract } = useFX_Market()
  const { contract: treasuryContract } = useFX_Treasury()
  const { contract: ethGatewayContract } = useFX_ETHGateway()
  const [mintLoading, setMintLoading] = useState(false)
  const [feeUsd, setFeeUsd] = useState(10)

  const handleMintFETH = async () => {
    setMintLoading(false)
    fETHContract
  }

  const handleMintXETH = async () => {

  }

  const pageData = useMemo(() => {
    try {
      const _fnav = checkNotZoroNumOption(fxInfo.baseInfo.CurrentNavRes?._fNav, fb4(fxInfo.baseInfo.CurrentNavRes?._fNav))
      const _xnav = checkNotZoroNumOption(fxInfo.baseInfo.CurrentNavRes?._xNav, fb4(fxInfo.baseInfo.CurrentNavRes?._xNav))
      const _ethPrice = checkNotZoroNumOption(fxInfo.baseInfo.CurrentNavRes?._baseNav, fxInfo.baseInfo.CurrentNavRes?._baseNav / 1e18)
      const _ethPrice_text = checkNotZoroNumOption(fxInfo.baseInfo.CurrentNavRes?._baseNav, fb4(fxInfo.baseInfo.CurrentNavRes?._baseNav))
      const _fETHTotalSupply = checkNotZoroNumOption(fxInfo.baseInfo.fETHTotalSupplyRes, fb4(fxInfo.baseInfo.fETHTotalSupplyRes))
      const _xETHTotalSupply = checkNotZoroNumOption(fxInfo.baseInfo.xETHTotalSupplyRes, fb4(fxInfo.baseInfo.xETHTotalSupplyRes))

      const _mintFETHFee = (checkNotZoroNum(fxInfo.baseInfo.fTokenMintFeeRatioRes?.defaultFeeRatio) || checkNotZoroNum(fxInfo.baseInfo.fTokenMintFeeRatioRes?.extraFeeRatio)) ? cBN(fxInfo.baseInfo.fTokenMintFeeRatioRes?.defaultFeeRatio).plus(fxInfo.baseInfo.fTokenMintFeeRatioRes?.extraFeeRatio).toString(10) : 0
      const _mintXETHFee = (checkNotZoroNum(fxInfo.baseInfo.xTokenMintFeeRatioRes?.defaultFeeRatio) || checkNotZoroNum(fxInfo.baseInfo.xTokenMintFeeRatioRes?.extraFeeRatio)) ? cBN(fxInfo.baseInfo.xTokenMintFeeRatioRes?.defaultFeeRatio).plus(fxInfo.baseInfo.xTokenMintFeeRatioRes?.extraFeeRatio).toString(10) : 0
      const _redeemFETHFee = (checkNotZoroNum(fxInfo.baseInfo.fTokenRedeemFeeRatioRes?.defaultFeeRatio) || checkNotZoroNum(fxInfo.baseInfo.fTokenRedeemFeeRatioRes?.extraFeeRatio)) ? cBN(fxInfo.baseInfo.fTokenRedeemFeeRatioRes?.defaultFeeRatio).plus(fxInfo.baseInfo.fTokenRedeemFeeRatioRes?.extraFeeRatio).toString(10) : 0
      const _redeemXETHFee = (checkNotZoroNum(fxInfo.baseInfo.xTokenRedeemFeeRatioRes?.defaultFeeRatio) || checkNotZoroNum(fxInfo.baseInfo.xTokenRedeemFeeRatioRes?.extraFeeRatio)) ? cBN(fxInfo.baseInfo.xTokenRedeemFeeRatioRes?.defaultFeeRatio).plus(fxInfo.baseInfo.xTokenRedeemFeeRatioRes?.extraFeeRatio).toString(10) : 0

      const _totalBaseToken = checkNotZoroNum(fxInfo.baseInfo.totalBaseTokenRes) ? fb4(fxInfo.baseInfo.totalBaseTokenRes) : 0
      const _totalBaseTokenTvl = checkNotZoroNum(fxInfo.baseInfo.totalBaseTokenRes) ? fb4(cBN(fxInfo.baseInfo.totalBaseTokenRes).multipliedBy(cBN(fxInfo.baseInfo.CurrentNavRes?._baseNav).div(1e18)).toFixed(0, 1)) : 0

      const _collateralRatio = checkNotZoroNum(fxInfo.baseInfo.collateralRatioRes) ? fb4(fxInfo.baseInfo.collateralRatioRes * 100) : 200;
      const _p_f = checkNotZoroNum(fxInfo.baseInfo.collateralRatioRes) ? fb4(cBN(1e18).div(fxInfo.baseInfo.collateralRatioRes).multipliedBy(1e20).toFixed(0, 1)) : 0

      console.log('_fnav-_xnav-_fETHTotalSupply-_xETHTotalSupply-', fxInfo.baseInfo, _fnav, _xnav, _fETHTotalSupply, _xETHTotalSupply, _totalBaseToken)

      console.log('_mintFETHFee-_mintXETHFee-_redeemFETHFee-_redeemXETHFee-', _mintFETHFee, _mintXETHFee, _redeemFETHFee, _redeemXETHFee)

      let StabilityModePrice = getStabilityModePrice({
        fNav: fxInfo.baseInfo.CurrentNavRes._fNav / 1e18,
        n_f: fxInfo.baseInfo.fETHTotalSupplyRes / 1e18,
        n: fxInfo.baseInfo.totalBaseTokenRes / 1e18
      })
      StabilityModePrice = checkNotZoroNumOption(StabilityModePrice, fb4(StabilityModePrice, false, 0, 2))
      let UserLiquidationModePrice = getUserLiquidationModePrice({
        fNav: fxInfo.baseInfo.CurrentNavRes._fNav / 1e18,
        n_f: fxInfo.baseInfo.fETHTotalSupplyRes / 1e18,
        n: fxInfo.baseInfo.totalBaseTokenRes / 1e18
      })
      UserLiquidationModePrice = checkNotZoroNumOption(UserLiquidationModePrice, fb4(UserLiquidationModePrice, false, 0, 2))
      let ProtocolLiquidationModePrice = getProtocolLiquidationModePrice({
        fNav: fxInfo.baseInfo.CurrentNavRes._fNav / 1e18,
        n_f: fxInfo.baseInfo.fETHTotalSupplyRes / 1e18,
        n: fxInfo.baseInfo.totalBaseTokenRes / 1e18
      })
      ProtocolLiquidationModePrice = checkNotZoroNumOption(ProtocolLiquidationModePrice, fb4(ProtocolLiquidationModePrice, false, 0, 2))

      const _systemStatus = getSystemStatus({
        limitCollecteralRatio: fxInfo.baseInfo.collateralRatioRes / 1e18
      })
      return {
        fnav: _fnav,
        xnav: _xnav,
        ethPrice: _ethPrice,
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

        StabilityModePrice,
        UserLiquidationModePrice,
        ProtocolLiquidationModePrice,
        systemStatus: _systemStatus
      }
    } catch (error) {

    }
  }, [fxInfo])
  return {
    ...fxInfo,
    fETHAddress,
    xETHAddress,
    fETHContract,
    xETHContract,
    marketContract,
    treasuryContract,
    ethGatewayContract,
    ...pageData,
  }
}

export default usefxETH
