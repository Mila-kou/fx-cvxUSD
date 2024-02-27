import React, { useMemo, useEffect, useContext, useRef } from 'react'
import { useDebounceEffect, useToggle } from 'ahooks'
import { useQuery, useQueries } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'
import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import { updateTokens, updateTokenPrice } from '@/store/slices/token'
import { useToken, useTokenBalance } from '@/hooks/useTokenInfo'
import { cBN, checkNotZoroNumOption, fb4 } from '@/utils/index'
import { getTokenListPrice, getLpPrice } from '@/services/dataInfo'

const useTokenData = () => {
  const { web3, blockNumber } = useWeb3()
  const dispatch = useDispatch()
  const { fETH, xETH, fxUSD, xstETH, xfrxETH } = useSelector(
    (state) => state.asset
  )

  const ethToken = useToken(config.tokens.eth)
  const wethToken = useTokenBalance(config.tokens.weth)
  const stETHToken = useTokenBalance(config.tokens.stETH)
  const fETHToken = useTokenBalance(config.tokens.fETH)
  const xETHToken = useTokenBalance(config.tokens.xETH)
  const usdcToken = useTokenBalance(config.tokens.usdc)
  const usdtToken = useTokenBalance(config.tokens.usdt)
  const fxUSDToken = useTokenBalance(config.tokens.fxUSD)
  const fraxToken = useTokenBalance(config.tokens.frax)
  const crvUSDToken = useTokenBalance(config.tokens.crvUSD)
  const wstETHToken = useTokenBalance(config.tokens.wstETH)
  const sfrxETHToken = useTokenBalance(config.tokens.sfrxETH)
  const frxETHToken = useTokenBalance(config.tokens.frxETH)
  const xstETHToken = useTokenBalance(config.tokens.xstETH)
  const xfrxETHToken = useTokenBalance(config.tokens.xfrxETH)

  const { data: tokenPrice, refetch: refetch1 } = useQuery({
    queryKey: ['tokenPrice'],
    queryFn: getTokenListPrice,
    enabled: !!web3,
  })

  useDebounceEffect(
    () => {
      refetch1()
    },
    [blockNumber],
    { wait: 30000 }
  )

  useEffect(() => {
    if (tokenPrice) {
      dispatch(updateTokenPrice(tokenPrice))
    }
  }, [tokenPrice])

  useEffect(() => {
    if (tokenPrice) {
      const data = {
        ETH: {
          balance: ethToken.balance,
          price: fb4(cBN(fETH._baseNav) || 0, false),
          // usd: checkNotZoroNumOption(
          //   ethToken.balance,
          //   fb4(
          //     cBN(ethToken.balance).multipliedBy(fETH?._baseNav).div(1e18) || 0,
          //     true
          //   )
          // ),
        },
        fETH: {
          balance: fETHToken.balance,
          price: fb4(cBN(fETH.nav) || 0, false),
          // usd: checkNotZoroNumOption(
          //   fETHToken.balance,
          //   fb4(
          //     cBN(fETHToken.balance).multipliedBy(fETH?._fNav).div(1e18) || 0,
          //     true
          //   )
          // ),
        },
        xETH: {
          balance: xETHToken.balance,
          price: fb4(cBN(xETH.nav) || 0, false),
          // usd: checkNotZoroNumOption(
          //   xETHToken.balance,
          //   fb4(
          //     cBN(xETHToken.balance).multipliedBy(xETH?._xNav).div(1e18) || 0,
          //     true
          //   )
          // ),
        },
        fxUSD: {
          balance: fxUSDToken.balance,
          price: fb4(cBN(fxUSD.nav) || 0, false),
        },
        xstETH: {
          balance: xstETHToken.balance,
          price: fb4(cBN(xstETH.nav) || 0, false),
        },
        xfrxETH: {
          balance: xfrxETHToken.balance,
          price: fb4(cBN(xfrxETH.nav) || 0, false),
        },
        stETH: {
          balance: stETHToken.balance,
          price: tokenPrice?.stETH?.usd?.toFixed(4) ?? 0,
        },
        USDC: {
          balance: usdcToken.balance,
          // usd: checkNotZoroNumOption(
          //   usdcToken.balance,
          //   fb4(cBN(usdcToken.balance).div(1e6) || 0, true)
          // ),
          price: tokenPrice?.USDC?.usd?.toFixed(4) ?? 0,
        },
        USDT: {
          balance: usdtToken.balance,
          // usd: checkNotZoroNumOption(
          //   usdtToken.balance,
          //   fb4(cBN(usdtToken.balance).div(1e6) || 0, true)
          // ),
          // USDT 数据不正常，用DAI
          price: tokenPrice?.DAI?.usd?.toFixed(4) ?? 0,
        },
        WETH: {
          balance: wethToken.balance,
          price: tokenPrice?.WETH?.usd?.toFixed(4) ?? 0,
        },
        FXN: {
          price: tokenPrice?.FXN?.usd?.toFixed(4) ?? 0,
        },
        Frax: {
          balance: fraxToken.balance,
          price: tokenPrice?.frax?.usd?.toFixed(4) ?? 0,
        },
        crvUSD: {
          balance: crvUSDToken.balance,
          price: tokenPrice?.crvUSD?.usd?.toFixed(4) ?? 0,
        },
        wstETH: {
          balance: wstETHToken.balance,
          price: tokenPrice?.wstETH?.usd?.toFixed(4) ?? 0,
        },
        sfrxETH: {
          balance: sfrxETHToken.balance,
          price: tokenPrice?.sfrxETH?.usd?.toFixed(4) ?? 0,
        },
        frxETH: {
          balance: frxETHToken.balance,
          price: tokenPrice?.frxETH?.usd?.toFixed(4) ?? 0,
        },
      }

      dispatch(updateTokens(data))
    }
  }, [
    tokenPrice,
    ethToken,
    stETHToken,
    fETHToken,
    xETHToken,
    usdcToken,
    usdtToken,
    fxUSDToken,
    fraxToken,
    crvUSDToken,
    fETH,
    xETH,
    fxUSD,
  ])

  // tokens,
  //     tokenPrice,
}

export default useTokenData
