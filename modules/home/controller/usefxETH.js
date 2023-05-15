import { useEffect, useState, useContext, useCallback, useMemo } from 'react'
import useInfo from '../hooks/useInfo'
import { checkNotZoroNum, checkNotZoroNumOption, fb4 } from '@/utils/index'

const usefxETH = () => {
  const fxInfo = useInfo()
  const { contract: fETHContract } = useFETH()
  const { contract: xETHContract } = useXETH()
  const { contract: marketContract } = useFX_Market()
  const { contract: treasuryContract } = useFX_Treasury()
  const [mintLoading, setMintLoading] = useState(false)
  const [feeUsd, setFeeUsd] = useState(10)

  const handleMintFETH = async () => {
    setMintLoading(false)
    fETHContract
  }

  const handleMintXETH = async () => {

  }

  const pageData = useMemo(() => {

  }, [fxInfo])
  return {
    ...fxInfo,
    fETHContract,
    xETHContract,
    marketContract,
    treasuryContract
  }
}

export default usefxETH
