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
  const [showSystemStatistics, { toggle: toggleShowSystemStatistics }] =
    useToggle()

  const fx_info = useInfo()
  const ethToken = useToken(config.tokens.eth)
  const fETHToken = useToken(config.tokens.fETH)
  const xETHToken = useToken(config.tokens.xETH)

  const [{ data: tokenPrice, refetch: refetch1 }] = useQueries({
    queries: [
      {
        queryKey: ['tokenPrice'],
        queryFn: getTokenListPrice,
        enabled: !!web3,
      },
    ],
  })

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

  useDebounceEffect(
    () => {
      refetch1()
    },
    [blockNumber],
    { wait: 3000 }
  )

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      showSystemStatistics,
      toggleShowSystemStatistics,
      tokens,
      tokenPrice,
      fx_info,
    }),
    [
      theme,
      toggleTheme,
      showSystemStatistics,
      toggleShowSystemStatistics,
      tokens,
      tokenPrice,
      fx_info,
    ]
  )

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  )
}

const useGlobal = () => useContext(GlobalContext)

export { GlobalContext, useGlobal }

export default GlobalProvider
