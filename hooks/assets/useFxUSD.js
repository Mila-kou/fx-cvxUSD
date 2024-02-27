import { useCallback, useContext, useEffect, useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { useFXUSD_contract } from '@/hooks/useFXUSDContract'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import useWeb3 from '@/hooks/useWeb3'
import { cBN, fb4, checkNotZoroNumOption, dollarText } from '@/utils/index'
import { ASSET_MAP, tokens } from '@/config/tokens'
import { updateAsset } from '@/store/slices/asset'

const useFxUSD = () => {
  const { blockNumber } = useWeb3()
  const multiCallsV2 = useMutiCallV2()
  const dispatch = useDispatch()

  const { contract: fxUSDContract } = useFXUSD_contract()

  const fetchAssetsData = async (arr) => {
    try {
      const calls = arr.map((item) => {
        const { totalSupply, nav, markets } = fxUSDContract.methods

        return {
          symbol: item.symbol,
          totalSupplyRes: totalSupply(),
          nav: nav(),
          markets: {
            wstETH: markets(tokens.wstETH),
            sfrxETH: markets(tokens.sfrxETH),
          },
        }
      })

      const callData = await multiCallsV2(calls)

      const data = {}
      callData.forEach((item) => {
        const { totalSupplyRes, nav } = item
        const totalSupply_text = checkNotZoroNumOption(
          totalSupplyRes,
          fb4(totalSupplyRes)
        )
        const marketCap_text = fb4(
          cBN(totalSupplyRes).multipliedBy(nav).div(1e18),
          true
        )

        const asset = ASSET_MAP[item.symbol]

        data[item.symbol] = {
          ...item,
          ...asset,
          nav_text: checkNotZoroNumOption(
            nav,
            fb4(nav, true, asset.decimals, 4, false)
          ),
          totalSupply_text,
          marketCap_text,
        }
      })
      console.log('fxUSD-AssetsData ----', data)
      return data
    } catch (error) {
      console.log('fxUSD-AssetsData ----error', error)
      return {}
    }
  }

  const [{ data: assetsData, refetch: refetch1, isFetching: isFetching1 }] =
    useQueries({
      queries: [
        {
          queryKey: ['fxUSD'],
          queryFn: () => fetchAssetsData([ASSET_MAP.fxUSD]),
        },
      ],
    })

  useEffect(() => {
    if (!isFetching1) refetch1()
  }, [blockNumber])

  useEffect(() => {
    if (assetsData?.fxUSD) {
      dispatch(updateAsset(assetsData.fxUSD))
    }
  }, [assetsData, dispatch])
}

export default useFxUSD
