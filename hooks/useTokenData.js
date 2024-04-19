import React, { useMemo, useEffect, useContext, useRef } from 'react'
import { useDebounceEffect, useToggle } from 'ahooks'
import { useQuery, useQueries } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'
import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import { updateTokens, updateTokenPrice } from '@/store/slices/token'
import { useToken, useTokenBalance } from '@/hooks/useTokenInfo'
import { cBN, fb4 } from '@/utils/index'
import { getTokenListPrice, getLpPrice } from '@/services/dataInfo'

const useTokenData = () => {
  const { web3, blockNumber } = useWeb3()
  const dispatch = useDispatch()
  // const { fETH, xETH, fxUSD, rUSD, xstETH, xfrxETH, xeETH, fCVX, xCVX } =
  //   useSelector((state) => state.asset)
  const {
    fETH,
    xETH,
    fxUSD,
    rUSD,
    xstETH,
    xfrxETH,
    xeETH,
    xezETH,
    btcUSD,
    xWBTC,
  } = useSelector((state) => state.asset)

  const ethToken = useToken(config.tokens.eth)
  const wethToken = useTokenBalance(config.tokens.weth)
  const fETHToken = useTokenBalance(config.tokens.fETH)
  const xETHToken = useTokenBalance(config.tokens.xETH)
  const usdcToken = useTokenBalance(config.tokens.usdc)
  const usdtToken = useTokenBalance(config.tokens.usdt)
  const fxUSDToken = useTokenBalance(config.tokens.fxUSD)
  const fraxToken = useTokenBalance(config.tokens.frax)
  const crvUSDToken = useTokenBalance(config.tokens.crvUSD)

  const stETHToken = useTokenBalance(config.tokens.stETH)
  const wstETHToken = useTokenBalance(config.tokens.wstETH)
  const xstETHToken = useTokenBalance(config.tokens.xstETH)

  const sfrxETHToken = useTokenBalance(config.tokens.sfrxETH)
  const frxETHToken = useTokenBalance(config.tokens.frxETH)
  const xfrxETHToken = useTokenBalance(config.tokens.xfrxETH)

  const rUSDToken = useTokenBalance(config.tokens.rUSD)
  const xeETHToken = useTokenBalance(config.tokens.xeETH)
  const weETHToken = useTokenBalance(config.tokens.weETH)
  const eETHToken = useTokenBalance(config.tokens.eETH)

  const ezETHToken = useTokenBalance(config.tokens.ezETH)
  const xezETHToken = useTokenBalance(config.tokens.xezETH)

  // const aCVXToken = useTokenBalance(config.tokens.aCVX)
  // const xCVXToken = useTokenBalance(config.tokens.xCVX)
  // const fCVXToken = useTokenBalance(config.tokens.fCVX)

  const btcUSDToken = useTokenBalance(config.tokens.btcUSD)
  const WBTCToken = useTokenBalance(config.tokens.WBTC)
  const xWBTCToken = useTokenBalance(config.tokens.xWBTC)

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
          price: tokenPrice?.ETH?.usd?.toFixed(4) ?? 0,
        },
        fETH: {
          balance: fETHToken.balance,
          price: fb4(cBN(fETH.nav) || 0, false),
        },
        xETH: {
          balance: xETHToken.balance,
          price: fb4(cBN(xETH.nav) || 0, false),
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
          price: tokenPrice?.USDC?.usd?.toFixed(4) ?? 0,
        },
        USDT: {
          balance: usdtToken.balance,
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
        rUSD: {
          balance: rUSDToken.balance,
          price: fb4(cBN(rUSD.nav) || 0, false),
        },
        xeETH: {
          balance: xeETHToken.balance,
          price: fb4(cBN(xeETH.nav) || 0, false),
        },
        weETH: {
          balance: weETHToken.balance,
          price: tokenPrice?.['wrapped-eeth']?.usd?.toFixed(4) ?? 0,
        },
        eETH: {
          balance: eETHToken.balance,
          price: tokenPrice?.eETH?.usd?.toFixed(4) ?? 0,
        },
        ezETH: {
          balance: ezETHToken.balance,
          price: tokenPrice?.['renzo-restaked-eth']?.usd?.toFixed(4) ?? 0,
        },
        xezETH: {
          balance: xezETHToken.balance,
          price: fb4(cBN(xezETH.nav) || 0, false),
        },
        btcUSD: {
          balance: btcUSDToken.balance,
          price: fb4(cBN(btcUSD.nav) || 0, false),
        },
        WBTC: {
          balance: WBTCToken.balance,
          price: tokenPrice?.WBTC?.usd?.toFixed(4) ?? 0,
        },
        xWBTC: {
          balance: xWBTCToken.balance,
          price: fb4(cBN(xWBTC.nav) || 0, false),
        },
        // aCVX: {
        //   balance: aCVXToken.balance,
        //   price: tokenPrice?.CVX?.usd?.toFixed(4) ?? 0,
        // },
        // xCVX: {
        //   balance: xCVXToken.balance,
        //   price: fb4(cBN(xCVX.nav) || 0, false),
        // },
        // fCVX: {
        //   balance: fCVXToken.balance,
        //   price: fb4(cBN(fCVX.nav) || 0, false),
        // },
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
    wstETHToken,
    sfrxETHToken,
    frxETHToken,
    xstETHToken,
    xfrxETHToken,
    rUSDToken,
    xeETHToken,
    weETHToken,
    ezETHToken,
    xezETHToken,
    // aCVXToken,
    // xCVXToken,
    // fCVXToken,
    WBTCToken,
    xWBTCToken,
    fETH,
    xETH,
    fxUSD,
    rUSD,
    xstETH,
    xfrxETH,
    xeETH,
    xezETH,
    btcUSD,
    xWBTC,
  ])
}

export default useTokenData
