import React, {
  useEffect,
  useState,
  useMemo,
  createContext,
  useContext,
  useCallback,
} from 'react'
import { useDebounceEffect } from 'ahooks'
import { useQuery, useQueries } from '@tanstack/react-query'
import useWeb3 from '@/hooks/useWeb3'
import { useTheme } from './ThemeProvider'

const GlobalContext = createContext(null)

function GlobalProvider({ children }) {
  const { web3, blockNumber } = useWeb3()
  const { theme, toggleTheme } = useTheme()

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
    }),
    [theme, toggleTheme]
  )

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  )
}

const useGlobal = () => useContext(GlobalContext)

export { GlobalContext, useGlobal }

export default GlobalProvider
