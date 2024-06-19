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
      `${fb4(leverage, false, 0, 2)}x`
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

const getPrices = ({ baseTokenType, twapPriceRes, priceRateRes }) => {
  const safePrice = twapPriceRes._safePrice / 1e18 ?? 0
  const safePrice_num = (twapPriceRes._safePrice / 1e18).toFixed(2) ?? 0
  const priceRate = priceRateRes / 10 ** 18 ?? 0

  // ETH 与 stETH/frxETH
  const maxPrice = twapPriceRes._maxUnsafePrice / 1e18 ?? 0
  const maxPrice_num = maxPrice.toFixed(2) ?? 0
  const minPrice = twapPriceRes._minUnsafePrice / 1e18 ?? 0
  const minPrice_num = minPrice.toFixed(2) ?? 0

  const isShowErrorMaxMinPrice =
    minPrice == 0 ? true : cBN(maxPrice).minus(minPrice).div(minPrice).gt(0.01)

  const isNewOralcePrice = true // ['fxUSD', 'rUSD'].includes(baseTokenType)

  const prices = {
    inMint: safePrice_num,
    inRedeemF: safePrice_num,
    inRedeemX: safePrice_num,
    inMintF: safePrice_num,
    inMintX: safePrice_num,
    maxPrice: maxPrice_num,
    minPrice: minPrice_num,
    isShowErrorMaxMinPrice: isShowErrorMaxMinPrice && isNewOralcePrice,
  }

  const baseSafePrice = cBN(safePrice).times(priceRate).toFixed(2) ?? 0
  // wstETH/sfrxETH
  const baseToken_maxPrice = cBN(maxPrice).times(priceRate).toFixed(2) ?? 0
  const baseToken_minPrice = cBN(minPrice).times(priceRate).toFixed(2) ?? 0

  const baseTokenPrices = {
    inMint: baseSafePrice,
    inRedeemF: baseSafePrice,
    inRedeemX: baseSafePrice,
    inMintF: baseSafePrice,
    inMintX: baseSafePrice,
    maxPrice: baseToken_maxPrice,
    minPrice: baseToken_minPrice,
  }

  if (isNewOralcePrice || !twapPriceRes._isValid) {
    prices.inMintF = minPrice_num
    prices.inRedeemX = minPrice_num
    prices.inMintX = maxPrice_num
    prices.inRedeemF = maxPrice_num

    baseTokenPrices.inMintF = baseToken_minPrice
    baseTokenPrices.inRedeemX = baseToken_minPrice
    baseTokenPrices.inMintX = baseToken_maxPrice
    baseTokenPrices.inRedeemF = baseToken_maxPrice
  }

  return {
    prices,
    baseTokenPrices,
  }
}

const getFundingRate = (
  { fundingRateRes, borrowRateSnapshotRes },
  blockTime
) => {
  try {
    const diff = blockTime - borrowRateSnapshotRes.timestamp
    // console.log(
    //   'blockTime----',
    //   new Date().getTime() / 1000,
    //   blockTime,
    //   borrowRateSnapshotRes.timestamp,
    //   diff
    // )
    if (diff <= 0) return 0

    const secRate = fundingRateRes / diff
    const fundingRate = (secRate * 60 * 60 * 8) / 1e16
    return fundingRate
  } catch (error) {
    return 0
  }
}

const processBaseToken = (data, blockTime) => {
  const baseTokens = []

  Object.values(data).forEach((baseToken) => {
    const { baseTokenType } = baseToken
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

    const restBaseTokenRes = cBN(baseToken.baseTokenCapRes)
      .minus(baseToken.totalBaseTokenRes)
      .div(baseToken.priceRateRes)
      .multipliedBy(10 ** baseToken.decimals)
      .toString()

    const collateralRatio_text = checkNotZoroNum(baseToken.collateralRatioRes)
      ? fb4(baseToken.collateralRatioRes * 100, false, 18, 2)
      : 200.0

    // systemStatus * 1 > 0
    const isCRLow130 = cBN(baseToken.collateralRatioRes).isLessThan(
      baseToken.stabilityRatioRes
    )
    // xNav = (totalBaseToken*baseTokenPrices-totalFToken*1)/totalXToken
    let _prices_maxPrice = prices.inMint
    let _prices_minPrice = prices.inMint
    const isNewOracle = true // ['fxUSD', 'rUSD'].includes(baseTokenType)
    if (isNewOracle) {
      _prices_maxPrice = prices.maxPrice
      _prices_minPrice = prices.minPrice
    }
    const xNav_max = checkNotZoroNum(baseToken.xTokenTotalSupplyRes)
      ? cBN(_prices_maxPrice)
          .times(baseToken.totalBaseTokenRes)
          .minus(baseToken.fTokenTotalSupplyRes)
          .div(baseToken.xTokenTotalSupplyRes)
          .times(1e18)
          .toFixed(0, 1)
      : 0
    const xNav_max_invalid = xNav_max < 0
    const xNav_max_text = xNav_max_invalid
      ? '0.00'
      : checkNotZoroNumOption(xNav_max, fb4(xNav_max, false, 18, 2, false))

    const xNav_min = checkNotZoroNum(baseToken.xTokenTotalSupplyRes)
      ? cBN(_prices_minPrice)
          .times(baseToken.totalBaseTokenRes)
          .minus(baseToken.fTokenTotalSupplyRes)
          .div(baseToken.xTokenTotalSupplyRes)
          .times(1e18)
          .toFixed(0, 1)
      : 0

    const xNav_min_invalid = xNav_min < 0
    const xNav_min_text = xNav_min_invalid
      ? '0.00'
      : checkNotZoroNumOption(xNav_min, fb4(xNav_min, false, 18, 2, false))

    baseTokens.push({
      ...baseToken,
      prices,
      baseTokenPrices,
      totalBaseToken,
      totalBaseTokenUSD_text,
      baseTokenCap,
      baseTokenCap_text,
      collateralRatio_text,
      restBaseTokenRes,
      isCRLow130,
      maxMintableFTokenRes: baseToken.maxMintableFTokenRes._maxFTokenMintable,
      maxRedeemableXTokenRes:
        baseToken.maxRedeemableXTokenRes._maxXTokenRedeemable,
      isFXBouns: getIsFXBouns(baseToken, isCRLow130),
      ...getLeverageData(baseToken),
      ...getFees(baseToken),
      fundingRate: getFundingRate(baseToken, blockTime),
      xNav_max,
      xNav_max_text,
      xNav_min,
      xNav_min_text,
      xNav_max_invalid,
      xNav_min_invalid,
    })
  })

  return baseTokens
}

export default processBaseToken
