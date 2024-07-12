import { useCallback, useContext, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { useContract } from 'hooks/useContracts'
import {
  useV2MarketContract,
  useV2TreasuryContract,
  useV2FContract,
  useV2XContract,
  useRebalancePoolRegistry,
  useReservePoolV2,
  useETHTwapOracle,
} from '@/hooks/useFXUSDContract'
import config from '@/config/index'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import { updateDataList } from '@/store/slices/baseToken'
import processBaseToken from './processBaseToken'
import { BASE_TOKENS_MAP } from '@/config/tokens'
import useWeb3 from '@/hooks/useWeb3'

const useBaseToken = () => {
  const multiCallsV2 = useMutiCallV2()
  const dispatch = useDispatch()
  const { blockTime } = useWeb3()

  const { erc20Contract } = useContract()
  const getMarketContract = useV2MarketContract()
  const getTreasuryContract = useV2TreasuryContract()
  const getFContract = useV2FContract()
  const getXContract = useV2XContract()
  const getRebalancePoolRegistryContract = useRebalancePoolRegistry()
  const { contract: reservePoolContract } = useReservePoolV2()
  const getETHTwapOracleContract = useETHTwapOracle()

  const fetchBaseTokensData = async (arr) => {
    try {
      const calls = arr.map((item) => {
        const {
          contracts,
          baseSymbol,
          baseTokenType,
          decimals = 18,
          hasFundingCost,
        } = item
        const { nav: fNav, totalSupply: fTokenTotalSupply } = getFContract(
          contracts.fToken
        ).contract.methods
        const { nav: xNav, totalSupply: xTokenTotalSupply } = getXContract(
          contracts.xToken
        ).contract.methods

        const { bonusRatio } = reservePoolContract.methods

        const {
          fTokenMintPausedInStabilityMode,
          xTokenRedeemPausedInStabilityMode,
          mintPaused,
          redeemPaused,
          fTokenMintFeeRatio,
          fTokenRedeemFeeRatio,
          xTokenMintFeeRatio,
          xTokenRedeemFeeRatio,
          stabilityRatio,
        } = getMarketContract(contracts.market).contract.methods

        const {
          collateralRatio,
          totalBaseToken,
          baseTokenCap,
          currentBaseTokenPrice,
          referenceBaseTokenPrice,
          isBaseTokenPriceValid,
          isUnderCollateral,
          getUnderlyingValue,
          borrowRateSnapshot,
          getFundingRate,
        } = getTreasuryContract(contracts.treasury).contract.methods

        const { getPrice } = getETHTwapOracleContract(contracts.twapOracle)
          .contract.methods

        const { totalSupply: RebalancePoolRegistryPoolTotalSupply } =
          getRebalancePoolRegistryContract(contracts.rebalancePoolRegistry)
            .contract.methods

        return {
          decimals,
          baseSymbol,
          baseTokenType,
          twapPriceRes: getPrice(),
          priceRateRes: getUnderlyingValue((10 ** decimals).toString()),
          fNav: fNav(),
          xNav: xNav(),
          collateralRatioRes: collateralRatio(),
          totalBaseTokenRes: totalBaseToken(),
          baseTokenCapRes: baseTokenCap(),
          currentBaseTokenPriceRes: currentBaseTokenPrice(),
          referenceBaseTokenPriceRes: referenceBaseTokenPrice(),
          isBaseTokenPriceValid: isBaseTokenPriceValid(),

          fTokenMintPausedInStabilityMode: fTokenMintPausedInStabilityMode(),
          xTokenRedeemPausedInStabilityMode:
            xTokenRedeemPausedInStabilityMode(),

          reservePoolBalancesRes: erc20Contract(
            config.tokens[baseSymbol]
          ).methods.balanceOf(config.contracts.fxUSD_ReservePoolV2),
          bonusRatioRes: bonusRatio(config.tokens[baseSymbol]),
          RebalancePoolRegistryPoolTotalSupplyRes:
            RebalancePoolRegistryPoolTotalSupply(),

          mintPaused: mintPaused(),
          redeemPaused: redeemPaused(),
          fTokenMintFeeRatioRes: fTokenMintFeeRatio(),
          fTokenRedeemFeeRatioRes: fTokenRedeemFeeRatio(),
          xTokenMintFeeRatioRes: xTokenMintFeeRatio(),
          xTokenRedeemFeeRatioRes: xTokenRedeemFeeRatio(),

          stabilityRatioRes: stabilityRatio(),
          isRecap: isUnderCollateral(),

          fTokenTotalSupplyRes: fTokenTotalSupply(),
          xTokenTotalSupplyRes: xTokenTotalSupply(),

          borrowRateSnapshotRes: hasFundingCost ? borrowRateSnapshot() : null,
          fundingRateRes: hasFundingCost ? getFundingRate() : 0,
        }
      })

      const callData = await multiCallsV2(calls)

      const calls_2 = callData.map((item) => {
        const { baseSymbol, stabilityRatioRes, isBaseTokenPriceValid } = item
        const { contracts } = BASE_TOKENS_MAP[baseSymbol]

        const { maxMintableFToken, maxRedeemableXToken } = getTreasuryContract(
          contracts.treasury
        ).contract.methods

        return {
          baseSymbol,
          maxMintableFTokenRes: isBaseTokenPriceValid
            ? maxMintableFToken(stabilityRatioRes)
            : { _maxFTokenMintable: 0 },
          maxRedeemableXTokenRes: isBaseTokenPriceValid
            ? maxRedeemableXToken(stabilityRatioRes)
            : { _maxXTokenRedeemable: 0 },
        }
      })

      const callData2 = await multiCallsV2(calls_2)

      const data = {}

      callData.forEach((item) => {
        data[item.baseSymbol] = {
          ...item,
        }
      })
      callData2.forEach((item) => {
        Object.assign(data[item.baseSymbol], item)
      })

      const list = processBaseToken(data, blockTime)
      dispatch(updateDataList(list))
      return list
    } catch (error) {
      console.log(
        'baseTokenData----error',
        arr.map((item) => item.baseSymbol),
        error
      )
      return {}
    }
  }

  return { fetchBaseTokensData }
}

export default useBaseToken
