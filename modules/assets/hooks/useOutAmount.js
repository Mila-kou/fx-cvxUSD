import React, { useEffect, useCallback, useState } from 'react'
import { cBN, checkNotZoroNum, checkNotZoroNumOption, fb4 } from '@/utils/index'

const useOutAmount = (slippage) => {
  const [minOutAmount, setMinOutAmount] = useState({
    minout: 0,
    minout_tvl: '',
    minout_slippage: 0,
    minout_slippage_tvl: 0,
  })

  const updateOutAmount = useCallback(
    (amount, price = '1', decimals = 18) => {
      const out_CBN = cBN(amount) || cBN(0)
      const _price = `${price}`.replace(/,/g, '')

      const _minOut_CBN = out_CBN.multipliedBy(
        cBN(1).minus(cBN(slippage).dividedBy(100))
      )

      setMinOutAmount({
        minout: fb4(out_CBN.toString(10), false, decimals),
        minout_tvl: fb4(
          out_CBN.multipliedBy(_price).toString(10),
          true,
          decimals
        ),
        minout_slippage: fb4(_minOut_CBN.toString(10), false, decimals),
        minout_slippage_tvl: fb4(
          _minOut_CBN.multipliedBy(_price).toString(10),
          false,
          decimals
        ),
      })

      return _minOut_CBN.toFixed(0, 1)
    },
    [setMinOutAmount, slippage]
  )

  const resetOutAmount = useCallback(() => {
    setMinOutAmount({
      minout: 0,
      minout_tvl: '',
      minout_slippage: 0,
      minout_slippage_tvl: 0,
    })
  }, [setMinOutAmount])

  const getMinOutBySlippage = (amount) => {
    const out_CBN = cBN(amount) || cBN(0)
    const _minOut_CBN = out_CBN.multipliedBy(
      cBN(1).minus(cBN(slippage).dividedBy(100))
    )
    return _minOut_CBN.toFixed(0, 1)
  }

  return {
    updateOutAmount,
    resetOutAmount,
    minOutAmount,
    getMinOutBySlippage,
  }
}

export default useOutAmount
