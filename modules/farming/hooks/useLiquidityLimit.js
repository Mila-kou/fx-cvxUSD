import { useState, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { useQuery } from '@tanstack/react-query'
import { useMutiCall } from '@/hooks/useMutiCalls'
import useWeb3 from '@/hooks/useWeb3'
import { checkNotZoroNum, cBN } from '@/utils/index'
import { useVeClev } from '@/hooks/useContracts'

// useLiquidityLimitBak
const useLiquidityLimit = (minveCRV, options) => {
  const { currentAccount, isAllReady } = useWeb3()
  const { contract: veContract } = useVeClev()
  const multiCall = useMutiCall()

  const {
    lpContract: gaugeContract, // lp gauge contract
    depositAmount: l, // lp deposit amount
    poolLiquidity, // lp totalSupply
    totalveCLEV, // ve veTotalSupply
    veCLEVAmount, // ve userVeCLEV
  } = options

  const getLiquidityLimit = useCallback(async () => {
    if (isAllReady && gaugeContract) {
      if (cBN(l).isZero() || cBN(l).isNaN()) {
        return 0
      }
      const calls = [
        veContract.methods.balanceOf(currentAccount),
        veContract.methods.totalSupply(),
        gaugeContract.methods.period_timestamp(0),
        gaugeContract.methods.working_balances(currentAccount),
        gaugeContract.methods.working_supply(),
        gaugeContract.methods.totalSupply(),
      ]
      const decoded = await multiCall(...calls)
      console.log('curve-dao > calc-contract-info', decoded)

      const working_balances = +decoded[3]
      const working_supply = +decoded[4]
      const L = cBN(poolLiquidity).plus(l)

      const TOKENLESS_PRODUCTION = 40

      let lim = cBN(l).multipliedBy(TOKENLESS_PRODUCTION / 100)
      const veCRV = minveCRV || veCLEVAmount

      lim = cBN(L)
        .multipliedBy(veCRV)
        .div(totalveCLEV)
        .multipliedBy((100 - TOKENLESS_PRODUCTION) / 100)
        .plus(lim)

      lim = BigNumber.minimum(lim, l)

      const old_bal = working_balances
      const noboost_lim = cBN(l).multipliedBy(TOKENLESS_PRODUCTION).div(100)
      const noboost_supply = cBN(working_supply)
        .plus(noboost_lim)
        .minus(old_bal)
      const _working_supply = cBN(working_supply).plus(lim).minus(old_bal)

      const boots = cBN(lim)
        .div(_working_supply)
        .div(cBN(noboost_lim).div(noboost_supply))
        .toString()

      return checkNotZoroNum(boots) ? parseFloat(boots).toFixed(2) : 0
    }
    return 0
  }, [veContract, currentAccount, minveCRV, options])

  const { data } = useQuery({
    queryKey: [
      'liquidityLimit',
      minveCRV,
      gaugeContract?._address || '',
      l || '',
      poolLiquidity || '',
      totalveCLEV || '',
      veCLEVAmount || '',
    ],
    queryFn: getLiquidityLimit,
    initialData: 0,
  })

  return data
}

export default useLiquidityLimit
