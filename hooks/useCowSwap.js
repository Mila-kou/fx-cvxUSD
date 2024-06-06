import { useEffect, useState, useCallback } from 'react'
import {
  OrderBookApi,
  OrderSigningUtils,
  SubgraphApi,
} from '@cowprotocol/cow-sdk'
import useWeb3 from '@/hooks/useWeb3'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import { useContract, useCurvefiSwap } from '@/hooks/useContracts'
import curveRouter_v1ABI from '../config/abi/fx/curveRouter_v1.json'
import config from '../config'
import { cBN } from '../utils'
import noPayableAction from '@/utils/noPayableAction'

const useCowSwap = () => {
  const {
    _currentAccount,
    web3,
    provider,
    currentChainId,
    sendTransaction,
    wallet,
  } = useWeb3()
  const { contract: curveSwapContract, address } = useCurvefiSwap()
  const multiCallsV2 = useMutiCallV2()
  const { erc20Contract, getContract } = useContract()

  const getOutAmountByCowSwap = async ({ from, to, decimals, amount }) => {
    const orderBookApi = new OrderBookApi({
      chainId: 1,
      env: 'prod',
    })
    try {
      const quoteRequest = {
        sellToken: from,
        buyToken: to,
        from: _currentAccount,
        receiver: _currentAccount,
        sellAmountBeforeFee: amount,
        kind: 'sell',
      }
      const { quote } = await orderBookApi.getQuote(quoteRequest)
      const { buyAmount, sellAmount } = quote
      const _amount = cBN(amount).times(buyAmount).div(sellAmount).toFixed(0)
      return _amount
    } catch (error) {
      console.log('quote---error--', error)
    }
  }

  return {
    getOutAmountByCowSwap,
  }
}

export default useCowSwap
