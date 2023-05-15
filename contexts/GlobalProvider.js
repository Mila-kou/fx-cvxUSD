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
import { cBN, fb4 } from '@/utils/index'
import {
  getTokenListPrice,
  getVaultsInfo,
  getConvexVaultsAPY,
  getConcentratorInit,
  getLpPrice,
} from '@/services/dataInfo'

const GlobalContext = createContext(null)

function GlobalProvider({ children }) {
  const { web3, blockNumber } = useWeb3()
  const { theme, toggleTheme } = useTheme()
  const [showSystemStatistics, { toggle: toggleShowSystemStatistics }] =
    useToggle()

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
    return {
      ETH: {
        ...ethToken,
        usd: fb4(
          cBN(ethToken.balance).multipliedBy(tokenPrice?.ETH?.usd) || 0,
          true
        ),
      },
      fETH: fETHToken,
      xETH: xETHToken,
    }
  }, [ethToken, fETHToken, xETHToken, tokenPrice])

  useDebounceEffect(
    () => {
      refetch1()
    },
    [blockNumber],
    { wait: 30000 }
  )

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      showSystemStatistics,
      toggleShowSystemStatistics,
      tokens,
      tokenPrice,
    }),
    [
      theme,
      toggleTheme,
      showSystemStatistics,
      toggleShowSystemStatistics,
      tokens,
      tokenPrice,
    ]
  )

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  )
}

const useGlobal = () => useContext(GlobalContext)

export { GlobalContext, useGlobal }

export default GlobalProvider
