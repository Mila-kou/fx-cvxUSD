import { useCallback, useContext, useEffect, useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { useV2FContract, useFXUSD_contract } from '@/hooks/useFXUSDContract'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import useWeb3 from '@/hooks/useWeb3'
import { cBN, fb4, checkNotZoroNumOption, dollarText } from '@/utils/index'
import { ASSET_MAP, tokens, BASE_TOKENS_MAP } from '@/config/tokens'
import { updateAsset } from '@/store/slices/asset'

const useBtcUSD = () => {
  const { blockNumber } = useWeb3()
  const multiCallsV2 = useMutiCallV2()
  const dispatch = useDispatch()
  const getFContract = useV2FContract()

  const { contract: fxUSDContract } = useFXUSD_contract('btcUSD')

  const { totalSupply: WBTC_fTokenTotalSupply } = getFContract(
    BASE_TOKENS_MAP.WBTC.contracts.fToken
  ).contract.methods

  // const { totalSupply: sfrxETH_fTokenTotalSupply } = getFContract(
  //   BASE_TOKENS_MAP.sfrxETH.contracts.fToken
  // ).contract.methods

  const fetchAssetsData = async (arr) => {
    try {
      const calls = arr.map((item) => {
        const { totalSupply, nav, markets } = fxUSDContract.methods

        return {
          symbol: item.symbol,
          totalSupplyRes: totalSupply(),
          nav: nav(),
          WBTC_fTokenTotalSupply: WBTC_fTokenTotalSupply(),
          // sfrxETH_fTokenTotalSupply: sfrxETH_fTokenTotalSupply(),
          markets: {
            WBTC: markets(tokens.WBTC),
            // sfrxETH: markets(tokens.sfrxETH),
          },
        }
      })

      const callData = await multiCallsV2(calls)

      const data = {}
      callData.forEach((item) => {
        const {
          WBTC_fTokenTotalSupply: _WBTC_fTokenTotalSupply,
          // sfrxETH_fTokenTotalSupply: _sfrxETH_fTokenTotalSupply,
          nav,
        } = item
        // const fxUSDAndAllFTotalSupply = cBN(_WBTC_fTokenTotalSupply || 0).plus(
        //   _sfrxETH_fTokenTotalSupply || 0
        // )
        const fxUSDAndAllFTotalSupply = cBN(_WBTC_fTokenTotalSupply || 0)

        const totalSupply_text = checkNotZoroNumOption(
          fxUSDAndAllFTotalSupply,
          fb4(fxUSDAndAllFTotalSupply)
        )
        const marketCap_text = fb4(
          cBN(fxUSDAndAllFTotalSupply).multipliedBy(nav).div(1e18),
          true
        )

        const asset = ASSET_MAP[item.symbol]

        data[item.symbol] = {
          ...item,
          ...asset,
          nav_text: checkNotZoroNumOption(
            nav,
            fb4(nav, false, asset.decimals, 2, false)
          ),
          totalSupply_text,
          marketCap_text,
        }
      })
      return data
    } catch (error) {
      console.log('btcUSD-AssetsData ----error', error)
      return {}
    }
  }

  const [{ data: assetsData, refetch: refetch1, isFetching: isFetching1 }] =
    useQueries({
      queries: [
        {
          queryKey: ['btcUSD'],
          queryFn: () => fetchAssetsData([ASSET_MAP.btcUSD]),
        },
      ],
    })

  useEffect(() => {
    if (!isFetching1) refetch1()
  }, [blockNumber])

  useEffect(() => {
    if (assetsData?.btcUSD) {
      dispatch(updateAsset(assetsData.btcUSD))
    }
  }, [assetsData, dispatch])
}

export default useBtcUSD
