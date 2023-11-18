import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { useQuery } from '@tanstack/react-query'
import { checkNotZoroNum, cBN } from 'utils'
import { useMutiCall, useMutiCallV2 } from '@/hooks/useMutiCalls'

export const useVeBoost = (options) => {
  console.log('veBoost-----0', options)
  const multiCallsV2 = useMutiCallV2()
  const {
    veContract,
    lpContract: gaugeContract, // lp gauge contract
    depositAmount: l, // lp deposit amount
    gaugeTotalSupply, // lp totalSupply
    veTotalSupply, // ve veTotalSupply
    userVeAmount, // ve userVeCLEV
    veContractTargetAccount, // userAddress or contractAddress
    gaugeContractTargetAccount, // userAddress or contractAddress
    type = 'gauge',
  } = options

  const getLiquidityLimit = async () => {
    console.log('veBoost-----0-1')
    if (gaugeContract) {
      try {
        const calls = [
          veContract.methods.balanceOf(veContractTargetAccount),
          veContract.methods.totalSupply(),
          gaugeContract.methods.working_balances(gaugeContractTargetAccount),
          gaugeContract.methods.working_supply(),
          gaugeContract.methods.totalSupply(),
          gaugeContract.methods.balanceOf(gaugeContractTargetAccount),
        ]
        const decoded = await multiCallsV2(calls)
        console.log('curve-dao > calc-contract-info', decoded)
        const _userVeAmount = decoded[0]
        const _veTotalSupply = decoded[1]
        const working_balances = decoded[2]
        const working_supply = decoded[3]
        const _gaugeTotalSupply = decoded[4]
        const _userDepositAmount = decoded[5]

        let __l = l
        let __userVeAmount = userVeAmount
        let __veTotalSupply = veTotalSupply
        let __gaugeTotalSupply = gaugeTotalSupply
        console.log('veBoost-----1', type, l)
        if (type == 'calc') {
          if (cBN(l).isZero() || cBN(l).isNaN()) {
            return [0, 0]
          }
          // __userVeAmount = cBN(__userVeAmount).plus(_userVeAmount).toFixed(0)
        } else {
          __l = _userDepositAmount
          __userVeAmount = _userVeAmount
          __veTotalSupply = _veTotalSupply
          __gaugeTotalSupply = _gaugeTotalSupply
        }

        const L =
          type == 'calc'
            ? cBN(__gaugeTotalSupply).plus(__l)
            : cBN(__gaugeTotalSupply)
        console.log('veBoost-----2')
        const TOKENLESS_PRODUCTION = 40

        let lim = cBN(__l).multipliedBy(TOKENLESS_PRODUCTION / 100)

        lim = cBN(L)
          .multipliedBy(__userVeAmount)
          .div(__veTotalSupply)
          .multipliedBy((100 - TOKENLESS_PRODUCTION) / 100)
          .plus(lim)

        lim = BigNumber.minimum(lim, l)

        const old_bal = working_balances
        const noboost_lim = cBN(__l).multipliedBy(TOKENLESS_PRODUCTION).div(100)
        const noboost_supply = cBN(working_supply)
          .plus(noboost_lim)
          .minus(old_bal)
        const _working_supply = cBN(working_supply).plus(lim).minus(old_bal)

        const votingBoost = cBN(lim).div(noboost_lim).toString()
        const boots = cBN(lim)
          .div(_working_supply)
          .div(cBN(noboost_lim).div(noboost_supply))
          .toString()

        console.log('votingBoost-boots---', votingBoost, boots)

        const data = [
          _working_supply.toString(),
          checkNotZoroNum(boots) ? parseFloat(boots).toFixed(2) : 0,
          votingBoost,
        ]
        return data
      } catch (error) {
        console.log('veBoost---error', error)
      }
    }
  }

  const { data } = useQuery({
    queryKey: ['liquidityLimit'],
    // enabled: !!gaugeContract,
    queryFn: () => getLiquidityLimit(),
    initialData: [0, 0],
  })

  return data
}
