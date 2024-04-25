import React, {
  useMemo,
  createContext,
  useContext,
  useRef,
  useState,
} from 'react'
import { useDebounceEffect, useToggle } from 'ahooks'
import { useQueries } from '@tanstack/react-query'
import useWeb3 from '@/hooks/useWeb3'
import { useTheme } from './ThemeProvider'
import {
  getConvexVaultsAPY,
  getLpPrice,
  getFX_cvxFXN_sdFXN_apy,
} from '@/services/dataInfo'
import useInfo from '@/modules/assets/hooks/useInfo'
import useFxETH from '@/hooks/assets/useFxETH'
import useFxUSD from '@/hooks/assets/useFxUSD'
import useRUSD from '@/hooks/assets/useRUSD'
import useBtcUSD from '@/hooks/assets/useBtcUSD'
import useTokenData from '@/hooks/useTokenData'
import useV2Assets from '@/hooks/assets/useV2Assets'
import useBaseToken from '@/hooks/assets/useBaseToken'
import { ASSET_MAP, BASE_TOKENS_MAP } from '@/config/tokens'
import useGauge from '@/hooks/useGauge'
import useSignCode from '@/hooks/useSignCode'

const GlobalContext = createContext(null)

function GlobalProvider({ children }) {
  const { blockNumber } = useWeb3()
  const { theme, toggleTheme } = useTheme()
  const [showMenuPanel, { toggle: toggleShowMenuPanel }] = useToggle()
  const [showRouteCard, setShowRouteCard] = useState('')

  const { fetchBaseTokensData } = useBaseToken()

  useFxETH()
  useFxUSD()
  useRUSD()
  useBtcUSD()

  fetchBaseTokensData(ASSET_MAP.fxUSD.baseTokenInfos)
  fetchBaseTokensData([BASE_TOKENS_MAP.weETH])
  fetchBaseTokensData([BASE_TOKENS_MAP.ezETH])
  fetchBaseTokensData(ASSET_MAP.btcUSD.baseTokenInfos)

  useV2Assets([ASSET_MAP.xstETH, ASSET_MAP.xfrxETH, ASSET_MAP.xeETH])

  useV2Assets([
    ASSET_MAP.xezETH,
    // ASSET_MAP.fCVX,
    // ASSET_MAP.xCVX,
  ])
  useV2Assets([ASSET_MAP.xWBTC])

  useTokenData()

  const refMenu2 = useRef(null)

  const fx_info = useInfo()
  const allGaugeBaseInfo = useGauge()

  // useSignCode()

  const [
    { data: ConvexVaultsAPY, refetch: refetch3 },
    { data: lpPrice, refetch: refetch5 },
    { data: cvxFXN_sdFXN_apy, refetch: refetch7 },
  ] = useQueries({
    queries: [
      {
        queryKey: ['ConvexVaultsAPY'],
        queryFn: getConvexVaultsAPY,
        initialData: [],
      },
      {
        queryKey: ['lpPrice'],
        queryFn: getLpPrice,
        initialData: {},
      },
      {
        queryKey: ['cvxFXN_sdFXN_apy'],
        queryFn: getFX_cvxFXN_sdFXN_apy,
        refetchInterval: 600000,
        initialData: {},
      },
    ],
  })

  useDebounceEffect(
    () => {
      refetch3()
      refetch5()
      refetch7()
    },
    [blockNumber],
    { wait: 30000 }
  )

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      showMenuPanel,
      toggleShowMenuPanel,
      refMenu2,

      fx_info,

      lpPrice,
      ConvexVaultsAPY,
      cvxFXN_sdFXN_apy,
      allGaugeBaseInfo,

      fAssetList: [],
      xAssetList: [],

      showRouteCard,
      setShowRouteCard,
    }),
    [
      theme,
      toggleTheme,
      showMenuPanel,
      toggleShowMenuPanel,
      refMenu2,

      fx_info,

      lpPrice,
      ConvexVaultsAPY,
      cvxFXN_sdFXN_apy,
      allGaugeBaseInfo,

      showRouteCard,
      setShowRouteCard,
    ]
  )

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  )
}

const useGlobal = () => useContext(GlobalContext)

export { GlobalContext, useGlobal }

export default GlobalProvider
