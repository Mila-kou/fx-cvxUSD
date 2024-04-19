import { useEffect, useState, useCallback } from 'react'
import useWeb3 from '@/hooks/useWeb3'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import { useContract, useCurvefiSwap } from '@/hooks/useContracts'
import curveRouter_v1ABI from '../config/abi/fx/curveRouter_v1.json'
import config from '../config'
import { cBN } from '../utils'
import noPayableAction from '@/utils/noPayableAction'

const useCurveSwapV2 = () => {
  const { _currentAccount, web3, provider, sendTransaction, wallet } = useWeb3()
  const { contract: curveSwapContract, address } = useCurvefiSwap()
  const multiCallsV2 = useMutiCallV2()
  const { erc20Contract, getContract } = useContract()

  const CurveRouterContract = getContract(
    '0xf0d4c12a5768d806021f80a262b4d39d26c58b8d',
    curveRouter_v1ABI
  )

  const initCurve = async () => {
    window.fx_Curve = (await import('@curvefi/api')).default
    if (window.fx_Curve) {
      const Curve = window.fx_Curve
      if (provider) {
        await Curve.init(
          'Web3',
          { network: '1', externalProvider: provider },
          { chainId: '1' }
        )
      } else {
        await Curve.init(
          'JsonRpc',
          {
            url: config.chainInfo.rpcUrl,
          },
          { chainId: 1 }
        ).catch((e) => {
          console.log('e----', e)
        })
      }

      await Promise.allSettled([
        Curve.factory.fetchPools(),
        Curve.crvUSDFactory.fetchPools(),
        Curve.EYWAFactory.fetchPools(),
        Curve.cryptoFactory.fetchPools(),
        Curve.twocryptoFactory.fetchPools(),
        Curve.stableNgFactory.fetchPools(),
        Curve.tricryptoFactory.fetchPools(),
      ])
      console.log('Promise.allSettled---pools')
    }
  }

  const getOutAmountByCurve = async ({ from, decimals, to, amount }) => {
    const Curve = window.fx_Curve
    const _amount = cBN(amount)
      .dividedBy(10 ** decimals)
      .toString()
    const data = await Curve.router.getBestRouteAndOutput(from, to, _amount)
    return data.output
  }

  const swapByCurve = async ({ from, decimals, to, amount, slippage }) => {
    const Curve = window.fx_Curve
    const _amount = cBN(amount)
      .dividedBy(10 ** decimals)
      .toString()
    return Curve.router.swap(from, to, _amount, slippage)
  }

  const getRouter = async (from, to, amount) => {
    const Curve = window.fx_Curve
    const data = await Curve.router.getBestRouteAndOutput(from, to, amount)
    console.log('output---', data.route)
    // await Curve.router.isApproved(
    //   '0x6b175474e89094c44da98b954eedeac495271d0f',
    //   1000
    // )

    await Curve.router.swap(from, to, amount) // slippage
    // const { _pools, _route, _swapParams } = Curve.router.getArgs(data.route)
    // console.log('--args---')
    // const SwapCallData_0 = await CurveRouterContract.methods.exchange(
    //   _route,
    //   _swapParams,
    //   cBN(amount).times(1e6).toFixed(0),
    //   0,
    //   _pools
    // )
    // await noPayableAction(
    //   () =>
    //     sendTransaction({
    //       to: '0xf0d4c12a5768d806021f80a262b4d39d26c58b8d',
    //       data: SwapCallData_0.encodeABI(),
    //     }),
    //   {
    //     key: 'Mint',
    //     action: 'Mint',
    //   }
    // )
  }

  useEffect(() => {
    initCurve()
  }, [web3, provider])

  return {
    getRouter,
    getOutAmountByCurve,
    swapByCurve,
  }
}

export default useCurveSwapV2
