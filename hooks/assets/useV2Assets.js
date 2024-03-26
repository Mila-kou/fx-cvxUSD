import { useCallback, useContext, useEffect, useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { useV2FContract, useV2XContract } from '@/hooks/useFXUSDContract'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import useWeb3 from '@/hooks/useWeb3'
import { cBN, fb4, checkNotZoroNumOption, dollarText } from '@/utils/index'
import { ASSET_MAP } from '@/config/tokens'
import { updateAsset } from '@/store/slices/asset'
import useFxUSDNavs from '@/modules/assets/hooks/useFxUSDNavs'

const useV2Assets = (arr) => {
  const { blockNumber } = useWeb3()
  const multiCallsV2 = useMutiCallV2()
  const dispatch = useDispatch()

  const getFContract = useV2FContract()
  const getXContract = useV2XContract()
  const { lastDayPrice } = useFxUSDNavs()

  const fetchAssetsData = async () => {
    try {
      const calls = arr.map((item) => {
        const { totalSupply, nav } = (
          item.isX ? getXContract(item.address) : getFContract(item.address)
        ).contract.methods

        const obj = {
          symbol: item.symbol,
          isX: item.isX,
          totalSupplyRes: totalSupply(),
          nav: nav(),
        }

        return obj
      })

      const callData = await multiCallsV2(calls)

      const data = {}
      callData.forEach((item) => {
        const { totalSupplyRes, nav, symbol } = item
        const totalSupply_text = checkNotZoroNumOption(
          totalSupplyRes,
          fb4(totalSupplyRes)
        )
        const marketCap_text = fb4(
          cBN(totalSupplyRes).multipliedBy(nav).div(1e18),
          true
        )

        const asset = ASSET_MAP[item.symbol]

        // change24h
        const _lastDayPrice = lastDayPrice[symbol]

        let change24h = 0
        if (_lastDayPrice && nav) {
          change24h = cBN(nav)
            .minus(cBN(_lastDayPrice))
            .multipliedBy(100)
            .div(cBN(_lastDayPrice))
            .toFixed(2)
        }

        data[item.symbol] = {
          ...item,
          ...asset,
          nav_text: checkNotZoroNumOption(
            nav,
            fb4(nav, false, asset.decimals, 2, false)
          ),
          totalSupply_text,
          marketCap_text,
          change24h,
        }
      })
      console.log('v2-AssetsData ----', data)
      return data
    } catch (error) {
      console.log('v2-AssetsData ----error', error)
      return {}
    }
  }

  const [{ data: assetsData, refetch: refetch1, isFetching: isFetching1 }] =
    useQueries({
      queries: [
        {
          queryKey: ['v2_assets'],
          queryFn: () => fetchAssetsData(),
        },
      ],
    })

  useEffect(() => {
    if (!isFetching1) refetch1()
  }, [blockNumber])

  useEffect(() => {
    if (assetsData) {
      Object.values(assetsData).forEach((item) => {
        dispatch(updateAsset(item))
      })
    }
  }, [assetsData, dispatch])
}

export default useV2Assets
