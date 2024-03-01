import { useEffect, useState, useContext, useCallback, useMemo } from 'react'
import { cBN, checkNotZoroNum, checkNotZoroNumOption, fb4 } from '@/utils/index'
import useAssetsData from '../hooks/useAssetsData'
import useNavs from '../hooks/useNavs'

const getR = (params) => {
  return cBN(params.s).div(params.s0).minus(1).toString(10)
}

const useAssetsController = () => {
  const { fTokenList, xTokenList, baseTokenList } = useAssetsData()
  const { lastDayPrice } = useNavs()

  const [fAssetList, xAssetList] = useMemo(() => {
    const list = [...fTokenList, ...xTokenList].map((asset) => {
      const { isX, symbol } = asset
      const baseToken = baseTokenList.find(
        (_item) => _item.baseSymbol === asset.baseSymbol
      )

      // change24h
      const nav = asset.isF ? baseToken._fNav : baseToken._xNav

      const _lastDayPrice = lastDayPrice[symbol]

      let change24h = 0
      if (_lastDayPrice && nav) {
        change24h = cBN(nav)
          .minus(cBN(_lastDayPrice))
          .multipliedBy(100)
          .div(cBN(_lastDayPrice))
          .toFixed(2)
      }

      // leverage
      if (isX) {
        const {
          collateralRatioRes,
          betaRes,
          _baseNav,
          lastPermissionedPriceRes,
        } = baseToken
        const r = getR({
          s: _baseNav,
          s0: lastPermissionedPriceRes,
        })
        const CR = cBN(collateralRatioRes).div(1e18)
        const beta = cBN(betaRes).div(1e18)
        const p1 = cBN(1).minus(
          cBN(1).div(CR).multipliedBy(cBN(1).plus(r)).multipliedBy(beta)
        )
        const p2 = cBN(1).minus(cBN(1).div(CR))
        const leverage = p1.div(p2).toString(10)

        baseToken.leverage = leverage
        baseToken.leverage_text = checkNotZoroNumOption(
          leverage,
          `x${fb4(leverage, false, 0, 2)}`
        )
      }

      const marketCap_text = fb4(
        cBN(asset.totalSupplyRes).multipliedBy(nav).div(1e18),
        true
      )

      const totalBaseToken = checkNotZoroNum(baseToken.totalBaseTokenRes)
        ? fb4(baseToken.totalBaseTokenRes)
        : 0
      const totalBaseTokenUSD_text = checkNotZoroNum(
        baseToken.totalBaseTokenRes
      )
        ? fb4(
            cBN(baseToken.totalBaseTokenRes)
              .multipliedBy(cBN(baseToken._baseNav).div(1e18))
              .toFixed(0, 1),
            false,
            18,
            2,
            false
          )
        : 0

      const baseTokenCap = checkNotZoroNum(baseToken.baseTokenCapRes)
        ? baseToken.baseTokenCapRes / 1e18
        : 0
      const baseTokenCap_text = checkNotZoroNum(baseToken.baseTokenCapRes)
        ? fb4(baseToken.baseTokenCapRes)
        : 0

      const collateralRatio_text = checkNotZoroNum(baseToken.collateralRatioRes)
        ? fb4(baseToken.collateralRatioRes * 100, false, 18, 2)
        : 200.0

      return {
        ...asset,
        ...baseToken,
        nav,
        nav_text: checkNotZoroNumOption(nav, fb4(nav, true, asset.decimals, 4)),
        marketCap_text,
        totalBaseToken,
        totalBaseTokenUSD_text,
        baseTokenCap,
        baseTokenCap_text,
        collateralRatio_text,
        change24h,
      }
    })

    const fList = list.filter((item) => item.isF)
    const xList = list.filter((item) => item.isX)

    return [fList, xList]
  }, [fTokenList, xTokenList, baseTokenList, lastDayPrice])

  return {
    fAssetList,
    xAssetList,
  }
}

export default useAssetsController
