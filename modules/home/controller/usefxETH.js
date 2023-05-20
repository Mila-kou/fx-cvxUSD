import { useEffect, useState, useContext, useCallback, useMemo } from 'react'
import useInfo from '../hooks/useInfo'
import { cBN, checkNotZoroNum, checkNotZoroNumOption, fb4 } from '@/utils/index'
import { useFETH, useXETH, useFX_Market, useFX_Treasury, useFX_ETHGateway } from '@/hooks/useContracts'
import useETHPrice from '../hooks/useETHPrice'

const usefxETH = () => {
  const fxInfo = useInfo()
  const ethPrice = useETHPrice()
  const { contract: fETHContract } = useFETH
  const { contract: xETHContract } = useXETH()
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
      const _ethPrice = checkNotZoroNumOption(fxInfo.baseInfo.CurrentNavRes?._baseNav, fb4(fxInfo.baseInfo.CurrentNavRes?._baseNav))
      const _fETHTotalSupply = checkNotZoroNumOption(fxInfo.baseInfo.fETHTotalSupplyRes, fb4(fxInfo.baseInfo.fETHTotalSupplyRes))
      const _xETHTotalSupply = checkNotZoroNumOption(fxInfo.baseInfo.xETHTotalSupplyRes, fb4(fxInfo.baseInfo.xETHTotalSupplyRes))

      const _mintFETHFee = (checkNotZoroNum(fxInfo.baseInfo.fTokenMintFeeRatioRes?.defaultFeeRatio) || checkNotZoroNum(fxInfo.baseInfo.fTokenMintFeeRatioRes?.extraFeeRatio)) ? cBN(fxInfo.baseInfo.fTokenMintFeeRatioRes?.defaultFeeRatio).plus(fxInfo.baseInfo.fTokenMintFeeRatioRes?.extraFeeRatio).toString(10) : 0
      const _mintXETHFee = (checkNotZoroNum(fxInfo.baseInfo.xTokenMintFeeRatioRes?.defaultFeeRatio) || checkNotZoroNum(fxInfo.baseInfo.xTokenMintFeeRatioRes?.extraFeeRatio)) ? cBN(fxInfo.baseInfo.xTokenMintFeeRatioRes?.defaultFeeRatio).plus(fxInfo.baseInfo.xTokenMintFeeRatioRes?.extraFeeRatio).toString(10) : 0
      const _redeemFETHFee = (checkNotZoroNum(fxInfo.baseInfo.fTokenRedeemFeeRatioRes?.defaultFeeRatio) || checkNotZoroNum(fxInfo.baseInfo.fTokenRedeemFeeRatioRes?.extraFeeRatio)) ? cBN(fxInfo.baseInfo.fTokenRedeemFeeRatioRes?.defaultFeeRatio).plus(fxInfo.baseInfo.fTokenRedeemFeeRatioRes?.extraFeeRatio).toString(10) : 0
      const _redeemXETHFee = (checkNotZoroNum(fxInfo.baseInfo.xTokenRedeemFeeRatioRes?.defaultFeeRatio) || checkNotZoroNum(fxInfo.baseInfo.xTokenRedeemFeeRatioRes?.extraFeeRatio)) ? cBN(fxInfo.baseInfo.xTokenRedeemFeeRatioRes?.defaultFeeRatio).plus(fxInfo.baseInfo.xTokenRedeemFeeRatioRes?.extraFeeRatio).toString(10) : 0

      console.log('_fnav-_xnav-_fETHTotalSupply-_xETHTotalSupply-', fxInfo.baseInfo, _fnav, _xnav, _fETHTotalSupply, _xETHTotalSupply)

      console.log('_mintFETHFee-_mintXETHFee-_redeemFETHFee-_redeemXETHFee-', _mintFETHFee, _mintXETHFee, _redeemFETHFee, _redeemXETHFee)
      return {
        fnav: _fnav,
        xnav: _xnav,
        ethPrice: _ethPrice,
        fETHTotalSupply: _fETHTotalSupply,
        xETHTotalSupply: _xETHTotalSupply,
        _mintFETHFee,
        _mintXETHFee,
        _redeemFETHFee,
        _redeemXETHFee,
      }
    } catch (error) {

    }
  }, [fxInfo])
  return {
    ...fxInfo,
    fETHContract,
    xETHContract,
    marketContract,
    treasuryContract,
    ethGatewayContract,
    ...pageData,
    ethPrice
  }
}

export default usefxETH
