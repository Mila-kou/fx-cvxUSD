import { useEffect, useState, useContext, useCallback, useMemo } from 'react'
import { cBN, checkNotZoroNum, checkNotZoroNumOption, fb4 } from '@/utils/index'

const getR = (params) => {
  return cBN(params.s).div(params.s0).minus(1).toString(10)
}

const getLeverageData = (baseToken) => {
  const {
    collateralRatioRes,
    currentBaseTokenPriceRes,
    referenceBaseTokenPriceRes,
  } = baseToken
  const r = getR({
    s: currentBaseTokenPriceRes,
    s0: referenceBaseTokenPriceRes,
  })
  const CR = cBN(collateralRatioRes).div(1e18)
  const beta = cBN(0).div(1e18)
  const p1 = cBN(1).minus(
    cBN(1).div(CR).multipliedBy(cBN(1).plus(r)).multipliedBy(beta)
  )
  const p2 = cBN(1).minus(cBN(1).div(CR))
  const leverage = p1.div(p2).toString(10)

  return {
    leverage,
    leverage_text: checkNotZoroNumOption(
      leverage,
      `x${fb4(leverage, false, 0, 2)}`
    ),
  }
}

const getFees = (baseToken) => {
  const mintFTokenFee =
    checkNotZoroNum(baseToken.fTokenMintFeeRatioRes?.defaultFee) ||
    checkNotZoroNum(baseToken.fTokenMintFeeRatioRes?.deltaFee)
      ? cBN(baseToken.fTokenMintFeeRatioRes?.defaultFee)
          .plus(baseToken.fTokenMintFeeRatioRes?.deltaFee)
          .toString(10)
      : 0
  const mintXTokenFee =
    checkNotZoroNum(baseToken.xTokenMintFeeRatioRes?.defaultFee) ||
    checkNotZoroNum(baseToken.xTokenMintFeeRatioRes?.deltaFee)
      ? cBN(baseToken.xTokenMintFeeRatioRes?.defaultFee)
          .plus(baseToken.xTokenMintFeeRatioRes?.deltaFee)
          .toString(10)
      : 0
  const redeemFTokenFee =
    checkNotZoroNum(baseToken.fTokenRedeemFeeRatioRes?.defaultFee) ||
    checkNotZoroNum(baseToken.fTokenRedeemFeeRatioRes?.deltaFee)
      ? cBN(baseToken.fTokenRedeemFeeRatioRes?.defaultFee)
          .plus(baseToken.fTokenRedeemFeeRatioRes?.deltaFee)
          .toString(10)
      : 0
  const redeemXTokenFee =
    checkNotZoroNum(baseToken.xTokenRedeemFeeRatioRes?.defaultFee) ||
    checkNotZoroNum(baseToken.xTokenRedeemFeeRatioRes?.deltaFee)
      ? cBN(baseToken.xTokenRedeemFeeRatioRes?.defaultFee)
          .plus(baseToken.xTokenRedeemFeeRatioRes?.deltaFee)
          .toString(10)
      : 0

  return {
    mintFTokenFee,
    redeemFTokenFee,
    mintXTokenFee,
    redeemXTokenFee,
  }
}

const getIsFXBouns = (baseToken, isCRLow130) => {
  if (
    isCRLow130 &&
    cBN(baseToken.reservePoolBalancesRes).isGreaterThan(0) &&
    cBN(baseToken.RebalancePoolRegistryPoolTotalSupplyRes).isEqualTo(0)
  ) {
    return true
  }
  return false
}

const getPrices = ({ twapPriceRes, priceRateRes }) => {
  const safePrice = (twapPriceRes._safePrice / 1e18).toFixed(2) ?? 0
  const priceRate = priceRateRes / 1e18 ?? 0

  // ETH 与 stETH/frxETH
  const prices = {
    inMint: safePrice,
    inRedeemF: safePrice,
    inRedeemX: safePrice,
  }

  const baseSafePrice = (safePrice * priceRate).toFixed(2) ?? 0
  // wstETH/sfrxETH
  const baseTokenPrices = {
    inMint: baseSafePrice,
    inRedeemF: baseSafePrice,
    inRedeemX: baseSafePrice,
  }

  if (!twapPriceRes._isValid) {
    const minPrice = (twapPriceRes._minUnsafePrice / 1e18).toFixed(2) ?? 0
    const maxPrice = (twapPriceRes._maxUnsafePrice / 1e18).toFixed(2) ?? 0

    prices.inRedeemF = maxPrice
    prices.inRedeemX = minPrice

    baseTokenPrices.inRedeemF = (maxPrice * priceRate).toFixed(2) ?? 0
    baseTokenPrices.inRedeemX = (minPrice * priceRate).toFixed(2) ?? 0
  }

  return {
    prices,
    baseTokenPrices,
  }
}

const processBaseToken = (data) => {
  const baseTokens = []

  Object.values(data).forEach((baseToken) => {
    const { prices, baseTokenPrices } = getPrices(baseToken)

    const totalBaseToken = checkNotZoroNum(baseToken.totalBaseTokenRes)
      ? fb4(baseToken.totalBaseTokenRes)
      : 0
    const totalBaseTokenUSD_text = checkNotZoroNum(baseToken.totalBaseTokenRes)
      ? fb4(
          cBN(baseToken.totalBaseTokenRes)
            .multipliedBy(cBN(prices.inMint))
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

    const restBaseToken = cBN(baseToken.baseTokenCapRes)
      .minus(baseToken.totalBaseTokenRes)
      .dividedBy(1e18)
      .toFixed(4, 1)

    const collateralRatio_text = checkNotZoroNum(baseToken.collateralRatioRes)
      ? fb4(baseToken.collateralRatioRes * 100, false, 18, 2)
      : 200.0

    // systemStatus * 1 > 0
    const isCRLow130 = cBN(baseToken.collateralRatioRes).isLessThan(
      baseToken.stabilityRatioRes
    )

    baseTokens.push({
      ...baseToken,
      prices,
      baseTokenPrices,
      totalBaseToken,
      totalBaseTokenUSD_text,
      baseTokenCap,
      baseTokenCap_text,
      collateralRatio_text,
      restBaseToken,
      isCRLow130,
      maxMintableFTokenRes: baseToken.maxMintableFTokenRes._maxFTokenMintable,
      maxRedeemableXTokenRes:
        baseToken.maxRedeemableXTokenRes._maxXTokenRedeemable,
      isFXBouns: getIsFXBouns(baseToken, isCRLow130),
      ...getLeverageData(baseToken),
      ...getFees(baseToken),
    })
  })

  return baseTokens
}

export default processBaseToken
