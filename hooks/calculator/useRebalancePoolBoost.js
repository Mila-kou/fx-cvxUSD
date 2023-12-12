import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { useQuery } from '@tanstack/react-query'
import { checkNotZoroNum, cBN } from 'utils'
import { useMutiCall, useMutiCallV2 } from '@/hooks/useMutiCalls'

export const useRebalancePoolBoost = (options) => {
  console.log('RebalancePoolBoost-----0', options)
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
    try {
      if (gaugeContract) {
        console.log('veBoost-----0-2')
        const calls = [
          veContract.methods.balanceOf(veContractTargetAccount),
          veContract.methods.totalSupply(),
          gaugeContract.methods.totalSupply(),
          gaugeContract.methods.balanceOf(gaugeContractTargetAccount),
        ]
        const decoded = await multiCallsV2(calls)
        console.log('veBoost-----0-3', decoded)
        console.log('curve-dao > calc-contract-info', decoded)
        const [
          _userVeAmount,
          _veTotalSupply,
          _gaugeTotalSupply,
          _userDepositAmount,
        ] = decoded

        let __l = l
        let __userVeAmount = userVeAmount
        let __veTotalSupply = veTotalSupply
        let __gaugeTotalSupply = gaugeTotalSupply
        console.log('veBoost-----1', type, l)
        if (type == 'calc') {
          if (cBN(l).isZero() || cBN(l).isNaN()) {
            return [0, 0, 0]
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
        const TOKENLESS_PRODUCTION = 40

        const user_nowork = cBN(__l).multipliedBy(TOKENLESS_PRODUCTION / 100)
        const user_work = cBN((100 - TOKENLESS_PRODUCTION) / 100)
          .multipliedBy(__gaugeTotalSupply)
          .multipliedBy(__userVeAmount)
          .div(__veTotalSupply)
        const _userWorkbalance = BigNumber.minimum(
          user_nowork.plus(user_work),
          __l
        )

        const boostratio = _userWorkbalance / __l
        const boost = boostratio / 0.4
        const maxVeAmount = cBN(_userDepositAmount)
          .div(_gaugeTotalSupply)
          .multipliedBy(_veTotalSupply)

        const data = { boostratio, boost, maxVeAmount }
        return data
      }
    } catch (error) {
      console.log('veBoost---error', error)
      return []
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
