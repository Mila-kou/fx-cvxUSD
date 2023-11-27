import React, {
  useEffect,
  useState,
  useMemo,
  createContext,
  useContext,
  useCallback,
  useRef,
} from 'react'
import { useDebounceEffect, useToggle } from 'ahooks'
import { useQuery, useQueries } from '@tanstack/react-query'
import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import { useTheme } from './ThemeProvider'
import { useToken, useTokenBalance } from '@/hooks/useTokenInfo'
import { cBN, checkNotZoroNumOption, fb4 } from '@/utils/index'
import {
  getTokenListPrice,
  getVaultsInfo,
  getConvexVaultsAPY,
  // getConcentratorInit,
  getLpPrice,
  getFX_cvxFXN_sdFXN_apy,
} from '@/services/dataInfo'
import useInfo from '@/modules/home/hooks/useInfo'
import useRebalancePoolUseInfo from '@/modules/rebalancePool/hooks/useRebalancePoolUseInfo'
import useBoostableRebalancePoolData from '@/modules/rebalancePoolV2/hooks/useBoostableRebalancePoolData'
import { getStETHRate } from '@/utils/stETHRate'
// import useGauge from '@/hooks/useGauge'

const GlobalContext = createContext(null)

function GlobalProvider({ children }) {
  const { web3, blockNumber } = useWeb3()
  const { theme, toggleTheme } = useTheme()
  const [showSystemStatistics, setShowSystemStatistics] = useState(false)
  const [showMenuPanel, { toggle: toggleShowMenuPanel }] = useToggle()

  const refMenu2 = useRef(null)

  const fx_info = useInfo()
  // const allGaugeBaseInfo = useGauge()
  const rebalancePool_info_A = useRebalancePoolUseInfo(
    config.contracts.fx_RebalancePool_A
  )
  // const rebalancePool_info_B = useRebalancePoolUseInfo(
  //   config.contracts.fx_RebalancePool_B
  // )
  // const rebalancePoolV2_info_A = useBoostableRebalancePoolData(
  //   config.contracts.fx_BoostableRebalancePool_APool
  // )
  // const rebalancePoolV2_info_B = useBoostableRebalancePoolData(
  //   config.contracts.fx_BoostableRebalancePool_BPool
  // )
  const ethToken = useToken(config.tokens.eth)
  const stETHToken = useTokenBalance(config.tokens.stETH)
  const fETHToken = useTokenBalance(config.tokens.fETH)
  const xETHToken = useTokenBalance(config.tokens.xETH)
  const usdcToken = useTokenBalance(config.tokens.usdc)
  const usdtToken = useTokenBalance(config.tokens.usdt)

  const [
    { data: tokenPrice, refetch: refetch1 },
    // { data: vaultsInfo, refetch: refetch2 },
    { data: ConvexVaultsAPY, refetch: refetch3 },
    // { data: concentratorInitData, refetch: refetch4 },
    { data: lpPrice, refetch: refetch5 },
    { data: stETHRate, refetch: refetch6 },
    { data: cvxFXN_sdFXN_apy, refetch: refetch7 },
  ] = useQueries({
    queries: [
      {
        queryKey: ['tokenPrice'],
        queryFn: getTokenListPrice,
        enabled: !!web3,
      },
      // {
      //   queryKey: ['vaultsInfo'],
      //   queryFn: getVaultsInfo,
      // },
      {
        queryKey: ['ConvexVaultsAPY'],
        queryFn: getConvexVaultsAPY,
        initialData: [],
      },
      // {
      //   queryKey: ['concentratorInitData'],
      //   queryFn: getConcentratorInit,
      //   initialData: {},
      // },
      {
        queryKey: ['lpPrice'],
        queryFn: getLpPrice,
        initialData: {},
      },
      {
        queryKey: ['stETHRate'],
        queryFn: getStETHRate,
        refetchInterval: 600000,
        initialData: 1,
      },
      {
        queryKey: ['cvxFXN_sdFXN_apy'],
        queryFn: getFX_cvxFXN_sdFXN_apy,
        refetchInterval: 600000,
        initialData: {},
      },
    ],
  })

  // const ifoVaultWithdrawFee = useMemo(() => {
  //   try {
  //     return (
  //       (Object.values(vaultsInfo.newVault)[0]?.withdrawFeePercentage ??
  //         500000) / 10e8
  //     )
  //   } catch (e) {
  //     return 0.0005
  //   }
  // }, [vaultsInfo])

  useDebounceEffect(
    () => {
      refetch1()
      // refetch2()
      refetch3()
      // refetch4()
      refetch5()
      refetch6()
      refetch7()
    },
    [blockNumber],
    { wait: 30000 }
  )

  useEffect(() => {
    setShowSystemStatistics(window.localStorage.getItem('hideSS') != 1)
  }, [])

  const toggleShowSystemStatistics = useCallback(() => {
    window.localStorage.setItem('hideSS', showSystemStatistics ? 1 : 0)
    setShowSystemStatistics(!showSystemStatistics)
  }, [setShowSystemStatistics, showSystemStatistics])

  const tokens = useMemo(() => {
    // ETH
    const { CurrentNavRes } = fx_info.baseInfo
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
      stETH: {
        ...stETHToken,
        usd: checkNotZoroNumOption(
          stETHToken.balance,
          fb4(
            cBN(stETHToken.balance)
              .multipliedBy(CurrentNavRes?._baseNav)
              .div(1e18) || 0,
            true
          )
        ),
        price: tokenPrice?.stETH?.usd?.toFixed(4) ?? 0,
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
      USDC: {
        ...usdcToken,
        usd: checkNotZoroNumOption(
          usdcToken.balance,
          fb4(cBN(usdcToken.balance).div(1e6) || 0, true)
        ),
        price: tokenPrice?.USDC?.usd?.toFixed(4) ?? 0,
      },
      USDT: {
        ...usdtToken,
        usd: checkNotZoroNumOption(
          usdtToken.balance,
          fb4(cBN(usdtToken.balance).div(1e6) || 0, true)
        ),
        // USDT 数据不正常，用DAI
        price: tokenPrice?.DAI?.usd?.toFixed(4) ?? 0,
      },
      WETH: {
        price: tokenPrice?.WETH?.usd?.toFixed(4) ?? 0,
      },
      wstETH: {
        price: tokenPrice?.wstETH?.usd?.toFixed(4) ?? 0,
      },
    }
  }, [
    ethToken,
    stETHToken,
    fETHToken,
    xETHToken,
    usdcToken,
    usdtToken,
    tokenPrice,
    fx_info.baseInfo,
  ])

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      showSystemStatistics,
      toggleShowSystemStatistics,
      showMenuPanel,
      toggleShowMenuPanel,
      refMenu2,

      tokens,
      tokenPrice,
      fx_info,
      rebalancePool_info_A,
      // rebalancePool_info_B,
      // rebalancePoolV2_info_A,
      // rebalancePoolV2_info_B,

      lpPrice,
      // vaultsInfo,
      ConvexVaultsAPY,
      // concentratorInitData,
      // ifoVaultWithdrawFee,
      stETHRate,
      cvxFXN_sdFXN_apy,
      // allGaugeBaseInfo,
    }),
    [
      theme,
      toggleTheme,
      showSystemStatistics,
      toggleShowSystemStatistics,
      showMenuPanel,
      toggleShowMenuPanel,
      refMenu2,

      tokens,
      tokenPrice,
      fx_info,
      rebalancePool_info_A,
      // rebalancePool_info_B,
      // rebalancePoolV2_info_A,
      // rebalancePoolV2_info_B,

      lpPrice,
      // vaultsInfo,
      ConvexVaultsAPY,
      // concentratorInitData,
      // ifoVaultWithdrawFee,
      cvxFXN_sdFXN_apy,
      // allGaugeBaseInfo,
    ]
  )

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  )
}

const useGlobal = () => useContext(GlobalContext)

export { GlobalContext, useGlobal }

export default GlobalProvider
