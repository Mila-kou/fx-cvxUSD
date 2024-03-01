import { useCallback, useContext, useEffect, useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import useFxNavs from '@/modules/assets/hooks/useFxNavs'
import {
  useContract,
  useFContract,
  useXContract,
  useMarketContract,
  useTreasuryContract,
  useReservePoolContract,
} from '@/hooks/useContracts'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import useWeb3 from '@/hooks/useWeb3'
import { cBN, fb4, checkNotZoroNumOption, dollarText } from '@/utils/index'
import { ASSET_MAP, BASE_TOKENS_MAP } from '@/config/tokens'
import { updateFETH, updateXETH } from '@/store/slices/asset'
import processFxETH from './processFxETH'

const useFxETH = () => {
  const { _currentAccount, web3, isAllReady, blockNumber } = useWeb3()
  const { lastDayPrice } = useFxNavs()
  const multiCallsV2 = useMutiCallV2()
  const dispatch = useDispatch()

  const getFContract = useFContract()
  const getXContract = useXContract()
  const getMarketContract = useMarketContract()
  const getTreasuryContract = useTreasuryContract()
  const getReservePoolContract = useReservePoolContract()

  const fetchAssetsData = async (arr) => {
    try {
      const calls = arr.map((item) => {
        const { totalSupply } = (
          item.isX ? getXContract(item.address) : getFContract(item.address)
        ).contract.methods

        return {
          symbol: item.symbol,
          totalSupplyRes: totalSupply(),
        }
      })

      const callData = await multiCallsV2(calls)

      const data = {}
      callData.forEach((item) => {
        const { totalSupplyRes } = item
        const totalSupply_text = checkNotZoroNumOption(
          totalSupplyRes,
          fb4(totalSupplyRes, false, 18, 4)
        )
        data[item.symbol] = {
          ...ASSET_MAP[item.symbol],
          totalSupplyRes,
          totalSupply_text,
        }
      })
      console.log('fetchAssetsData----', data)
      return data
    } catch (error) {
      console.log('fetchAssetsData----error', error)
      return {}
    }
  }

  const fetchBaseTokensData = async (arr) => {
    try {
      const calls = arr.map((item) => {
        const { contracts } = item

        const {
          getCurrentNav,
          collateralRatio,
          totalBaseToken,
          beta,
          lastPermissionedPrice,
          baseTokenCap,
        } = getTreasuryContract(contracts.treasury).contract.methods

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
        } = getMarketContract(contracts.market).contract.methods

        return {
          baseSymbol: item.baseSymbol,
          currentNavRes: getCurrentNav(),
          collateralRatioRes: collateralRatio(),
          betaRes: beta(),
          lastPermissionedPriceRes: lastPermissionedPrice(),
          totalBaseTokenRes: totalBaseToken(),
          baseTokenCapRes: baseTokenCap(),
        }
      })

      const callData = await multiCallsV2(calls)

      const data = {}

      callData.forEach((item) => {
        const { currentNavRes, ...other } = item

        const { _baseNav, _fNav, _xNav } = currentNavRes

        const baseNav_text = checkNotZoroNumOption(_baseNav, fb4(_baseNav))

        data[item.baseSymbol] = {
          ...other,

          _baseNav,
          _fNav,
          _xNav,
          baseNav_text,
        }
      })
      return data
    } catch (error) {
      console.log('baseTokenData----error', error)
      return {}
    }
  }

  const [
    { data: assetsData, refetch: refetch1, isFetching: isFetching1 },
    { data: baseTokenData, refetch: refetch3, isFetching: isFetching2 },
  ] = useQueries({
    queries: [
      {
        queryKey: ['FETH', 'xETH'],
        queryFn: () => fetchAssetsData([ASSET_MAP.fETH, ASSET_MAP.xETH]),
        enabled: isAllReady,
      },
      {
        queryKey: ['fxETH'],
        queryFn: () => fetchBaseTokensData([BASE_TOKENS_MAP.fxETH], true),
        enabled: isAllReady,
      },
    ],
  })

  useEffect(() => {
    if (!isFetching1) refetch1()
    if (!isFetching2) refetch3()
  }, [_currentAccount, blockNumber])

  useEffect(() => {
    const baseToken = baseTokenData?.fxETH

    if (assetsData?.fETH && baseToken) {
      const data = processFxETH(assetsData.fETH, baseToken, lastDayPrice)
      dispatch(updateFETH(data))
    }
    if (assetsData?.xETH && baseToken) {
      const data = processFxETH(assetsData.xETH, baseToken, lastDayPrice)
      dispatch(updateXETH(data))
    }
  }, [assetsData, baseTokenData, lastDayPrice, dispatch])
}

export default useFxETH
