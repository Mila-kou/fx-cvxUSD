import moment from 'moment'
import { cBN } from 'utils'
import { useState, useEffect } from 'react'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import useWeb3 from '@/hooks/useWeb3'
import { useVeFXN } from '@/hooks/useContracts'

const useChart = () => {
  const { _currentAccount, blockTime } = useWeb3()
  const { contract: veContract } = useVeFXN()
  const multiCallsV2 = useMutiCallV2()
  const [list, setList] = useState([])

  const fetchData = async () => {
    let now = blockTime
    const lastUnlockTime = moment(now * 1000)
      .add(4, 'years')
      .unix()

    const calls = []
    let i = 0

    while (now < lastUnlockTime) {
      calls.push(veContract.methods.totalSupply(now))
      now += i ** 4 * 86400
      i++
    }

    const res = await multiCallsV2(calls)

    const x = calls.map((n) => n.arguments[0])
    const _list = res.map((j, index) => {
      return [x[index] * 1000, parseFloat(cBN(j).shiftedBy(-18).toFixed(2))]
    })
    setList(_list)
  }

  useEffect(() => {
    if ((multiCallsV2, veContract)) fetchData()
  }, [_currentAccount, multiCallsV2, blockTime, veContract])

  return list
}

export default useChart
