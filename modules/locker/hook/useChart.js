import moment from 'moment'
import { cBN } from 'utils'
import { useState, useEffect } from 'react'
import { useMutiCall } from '@/hooks/useMutiCalls'
import useWeb3 from '@/hooks/useWeb3'
import { useVeClev } from '@/hooks/useContracts'

const useChart = () => {
  const { currentAccount, blockTime } = useWeb3()
  const { contract: veContract } = useVeClev()
  const multiCall = useMutiCall()
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

    const res = await multiCall(...calls)

    const x = calls.map((n) => n.arguments[0])
    const _list = res.map((j, index) => {
      return [x[index] * 1000, parseFloat(cBN(j).shiftedBy(-18).toFixed(2))]
    })
    setList(_list)
  }

  useEffect(() => {
    if ((multiCall, veContract)) fetchData()
  }, [currentAccount, multiCall, blockTime, veContract])

  return list
}

export default useChart
