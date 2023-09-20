import { useEffect, useState, useCallback } from 'react'
import useWeb3 from '@/hooks/useWeb3'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import { useContract, useCurvefiSwap } from '@/hooks/useContracts'

const curveRouter = {
  '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee_0xae7ab96520de3a18e5e111b5eaab095312d7fe84':
    {
      name: 'ETH-stETH',
      route: [
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        '0xdc24316b9ae028f1497c275eb9192a3ea0f67022',
        '0xae7ab96520de3a18e5e111b5eaab095312d7fe84',
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
      ],
      swapParams: [
        [0, 1, 1],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ],
      factorySwapAddresses: [
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
      ],
    },
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48_0xae7ab96520de3a18e5e111b5eaab095312d7fe84':
    {
      name: 'USDC-stETH',
      route: [
        '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        '0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7',
        '0xdac17f958d2ee523a2206206994597c13d831ec7',
        '0xd51a44d3fae010294c616388b506acda1bfaae46',
        '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        '0x21e27a5e5513d6e65c4f830167390997aa84843a',
        '0xae7ab96520de3a18e5e111b5eaab095312d7fe84',
      ],
      swapParams: [
        [1, 2, 1],
        [0, 2, 3],
        [0, 0, 15],
        [0, 1, 1],
      ],
      factorySwapAddresses: [
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
      ],
    },
  '0xdac17f958d2ee523a2206206994597c13d831ec7_0xae7ab96520de3a18e5e111b5eaab095312d7fe84':
    {
      name: 'USDT-stETH',
      route: [
        '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        '0xf5f5B97624542D72A9E06f04804Bf81baA15e2B4',
        '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        '0xDC24316b9AE028F1497c275EB9192a3Ea0f67022',
        '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
      ],
      swapParams: [
        [0, 2, 3],
        [0, 1, 1],
        [0, 0, 0],
        [0, 0, 0],
      ],
      factorySwapAddresses: [
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000',
      ],
    },
}
const useCurveSwap = () => {
  const { _currentAccount, web3 } = useWeb3()
  const { contract: curveSwapContract, address } = useCurvefiSwap()
  const multiCallsV2 = useMutiCallV2()
  const { erc20Contract } = useContract()

  const getCurveSwapMinout = useCallback(
    async (src, dst, amount) => {
      const swapData =
        curveRouter[`${src.toLocaleLowerCase()}_${dst.toLocaleLowerCase()}`]
      const minout =
        await curveSwapContract.methods.get_exchange_multiple_amount(
          swapData.route,
          swapData.swapParams,
          amount
        )
      return minout
    },
    [multiCallsV2, erc20Contract, _currentAccount, web3]
  )

  const getCurveSwapABI = useCallback(
    async ({ src, dst, amount, minout }) => {
      try {
        const swapData =
          curveRouter[`${src.toLocaleLowerCase()}_${dst.toLocaleLowerCase()}`]
        const SwapCallData = await curveSwapContract.methods
          .exchange_multiple(
            swapData.route,
            swapData.swapParams,
            amount,
            minout,
            swapData.factorySwapAddresses
          )
          .encodeABI()
        return {
          data: {
            tx: {
              to: address,
              data: SwapCallData,
            },
          },
        }
      } catch (error) {
        console.log(error)
        return false
      }
    },
    [multiCallsV2, erc20Contract, _currentAccount, web3]
  )

  return {
    curveSwapContract,
    getCurveSwapABI,
    getCurveSwapMinout,
  }
}

export default useCurveSwap
