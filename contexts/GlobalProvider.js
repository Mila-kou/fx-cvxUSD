import React, {
  useEffect,
  useState,
  useMemo,
  createContext,
  useContext,
  useCallback,
} from 'react'
import { useDebounceEffect, useToggle } from 'ahooks'
import { useQuery, useQueries } from '@tanstack/react-query'
import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import { useTheme } from './ThemeProvider'
import { useToken } from '@/hooks/useTokenInfo'
import { cBN, checkNotZoroNumOption, fb4 } from '@/utils/index'
import {
  getTokenListPrice,
  getVaultsInfo,
  getConvexVaultsAPY,
  getConcentratorInit,
  getLpPrice,
} from '@/services/dataInfo'
import useInfo from '@/modules/home/hooks/useInfo'

const GlobalContext = createContext(null)

function GlobalProvider({ children }) {
  const { web3, blockNumber } = useWeb3()
  const { theme, toggleTheme } = useTheme()
  const [showSystemStatistics, setShowSystemStatistics] = useState(false)

  const fx_info = useInfo()
  const ethToken = useToken(config.tokens.eth)
  // const wethToken = useToken(config.tokens.weth)
  const fETHToken = useToken(config.tokens.fETH)
  const xETHToken = useToken(config.tokens.xETH)

  const [
    { data: tokenPrice, refetch: refetch1 },
    { data: vaultsInfo, refetch: refetch2 },
    { data: ConvexVaultsAPY, refetch: refetch3 },
    { data: concentratorInitData, refetch: refetch4 },
    { data: lpPrice, refetch: refetch5 },
  ] = useQueries({
    queries: [
      {
        queryKey: ['tokenPrice'],
        queryFn: getTokenListPrice,
        enabled: !!web3,
      },
      {
        queryKey: ['vaultsInfo'],
        queryFn: getVaultsInfo,
      },
      {
        queryKey: ['ConvexVaultsAPY'],
        queryFn: getConvexVaultsAPY,
        initialData: [],
      },
      {
        queryKey: ['concentratorInitData'],
        queryFn: getConcentratorInit,
        initialData: {},
      },
      {
        queryKey: ['lpPrice'],
        queryFn: getLpPrice,
        initialData: {},
      },
    ],
  })

  const ifoVaultWithdrawFee = useMemo(() => {
    try {
      return (
        (Object.values(vaultsInfo.newVault)[0]?.withdrawFeePercentage ??
          500000) / 10e8
      )
    } catch (e) {
      return 0.0005
    }
  }, [vaultsInfo])

  useDebounceEffect(
    () => {
      refetch1()
      refetch2()
      refetch3()
      refetch4()
      refetch5()
    },
    [blockNumber],
    { wait: 30000 }
  )

  useEffect(() => {
    setShowSystemStatistics(window.localStorage.getItem('showSS') == 1)
  }, [])

  const toggleShowSystemStatistics = useCallback(() => {
    window.localStorage.setItem('showSS', showSystemStatistics ? 0 : 1)
    setShowSystemStatistics(!showSystemStatistics)
  }, [setShowSystemStatistics, showSystemStatistics])

  const tokens = useMemo(() => {
    // ETH
    const { CurrentNavRes } = fx_info.baseInfo
    console.log('CurrentNavRes---', CurrentNavRes)
    return {
      ETH: {
        ...ethToken,
        usd: checkNotZoroNumOption(
          ethToken.balance,
          fb4(
            cBN(ethToken.balance)
              .multipliedBy(CurrentNavRes?._baseNav)
              .div(1e18) || 0,
            true
          )
        ),
      },
      // WETH: {
      //   ...wethToken,
      //   usd: checkNotZoroNumOption(
      //     wethToken.balance,
      //     fb4(
      //       cBN(wethToken.balance)
      //         .multipliedBy(CurrentNavRes?._baseNav)
      //         .div(1e18) || 0,
      //       true
      //     )
      //   ),
      // },
      fETH: {
        ...fETHToken,
        usd: checkNotZoroNumOption(
          fETHToken.balance,
          fb4(
            cBN(fETHToken.balance)
              .multipliedBy(CurrentNavRes?._fNav)
              .div(1e18) || 0,
            true
          )
        ),
      },
      xETH: {
        ...xETHToken,
        usd: checkNotZoroNumOption(
          xETHToken.balance,
          fb4(
            cBN(xETHToken.balance)
              .multipliedBy(CurrentNavRes?._xNav)
              .div(1e18) || 0,
            true
          )
        ),
      },
    }
  }, [ethToken, fETHToken, xETHToken, tokenPrice, fx_info.baseInfo])

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      showSystemStatistics,
      toggleShowSystemStatistics,
      tokens,
      tokenPrice,
      fx_info,

      lpPrice,
      vaultsInfo,
      ConvexVaultsAPY,
      concentratorInitData,
      ifoVaultWithdrawFee,
    }),
    [
      theme,
      toggleTheme,
      showSystemStatistics,
      toggleShowSystemStatistics,
      tokens,
      tokenPrice,
      fx_info,

      lpPrice,
      vaultsInfo,
      ConvexVaultsAPY,
      concentratorInitData,
      ifoVaultWithdrawFee,
    ]
  )

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  )
}

const useGlobal = () => useContext(GlobalContext)

export { GlobalContext, useGlobal }

export default GlobalProvider
