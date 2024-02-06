import { useCallback, useContext, useEffect, useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import abi from 'config/abi'
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
import { ASSETS, BASE_TOKENS_MAP } from '@/config/tokens'

const useAssetsData = () => {
  const { _currentAccount, web3, isAllReady, blockNumber } = useWeb3()
  const { getContract } = useContract()
  const multiCallsV2 = useMutiCallV2()
  const [data, setData] = useState([])

  const getFContract = useFContract()
  const getXContract = useXContract()
  const getMarketContract = useMarketContract()
  const getTreasuryContract = useTreasuryContract()
  const getReservePoolContract = useReservePoolContract()

  const F_TOKENS = ASSETS.filter((item) => item.isF)
  const X_TOKENS = ASSETS.filter((item) => item.isX)

  const fetchAssetsData = useCallback(
    async (arr, isX) => {
      try {
        const calls = arr.map((item) => {
          const { totalSupply } = (
            isX ? getXContract(item.address) : getFContract(item.address)
          ).contract.methods

          return {
            totalSupplyRes: totalSupply(),
          }
        })

        const callData = await multiCallsV2(calls)

        const list = callData.map((item, index) => {
          const { totalSupplyRes } = item
          const totalSupply_text = checkNotZoroNumOption(
            totalSupplyRes,
            fb4(totalSupplyRes)
          )
          return {
            ...arr[index],
            ...item,
            totalSupply_text,
          }
        })
        console.log('fetchAssetsData----', isX, list)
        setData(list)
        return list
      } catch (error) {
        console.log('fetchAssetsData----error', isX, error)
        return []
      }
    },
    [
      getXContract,
      getFContract,
      multiCallsV2,
      _currentAccount,
      getTreasuryContract,
      getMarketContract,
    ]
  )

  const fetchBaseTokensData = useCallback(
    async (arr) => {
      try {
        const calls = arr.map((item) => {
          const { contracts } = BASE_TOKENS_MAP[item.baseSymbol]

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
            currentNavRes: getCurrentNav(),
            collateralRatioRes: collateralRatio(),
            betaRes: beta(),
            lastPermissionedPriceRes: lastPermissionedPrice(),
            totalBaseTokenRes: totalBaseToken(),
            baseTokenCapRes: baseTokenCap(),
          }
        })

        const callData = await multiCallsV2(calls)

        const list = callData.map((item, index) => {
          const { currentNavRes, ...other } = item

          const { _baseNav, _fNav, _xNav } = currentNavRes

          const baseNav_text = checkNotZoroNumOption(_baseNav, fb4(_baseNav))

          return {
            ...arr[index],
            ...other,

            _baseNav,
            _fNav,
            _xNav,
            baseNav_text,
          }
        })
        console.log('baseTokenList----', list)
        setData(list)
        return list
      } catch (error) {
        console.log('baseTokenList----error', error)
        return []
      }
    },
    [multiCallsV2, _currentAccount, getTreasuryContract, getMarketContract]
  )

  const [
    { data: fTokenList, refetch: refetch1, isFetching: isFetching1 },
    { data: xTokenList, refetch: refetch2, isFetching: isFetching2 },
    { data: baseTokenList, refetch: refetch3, isFetching: isFetching3 },
  ] = useQueries({
    queries: [
      {
        queryKey: ['fTokenList'],
        queryFn: () => fetchAssetsData(F_TOKENS),
        enabled: isAllReady,
        initialData: F_TOKENS,
      },
      {
        queryKey: ['xTokenList'],
        queryFn: () => fetchAssetsData(X_TOKENS, true),
        enabled: isAllReady,
        initialData: X_TOKENS,
      },
      {
        queryKey: ['baseTokenList'],
        queryFn: () =>
          fetchBaseTokensData(Object.values(BASE_TOKENS_MAP), true),
        enabled: isAllReady,
        initialData: Object.values(BASE_TOKENS_MAP),
      },
    ],
  })

  useEffect(() => {
    if (!isFetching1) refetch1()
    if (!isFetching2) refetch2()
    if (!isFetching3) refetch3()
  }, [_currentAccount, blockNumber])

  return { fTokenList, xTokenList, baseTokenList }
}

export default useAssetsData
