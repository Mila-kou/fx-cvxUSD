import { useEffect, useState, useContext, useCallback, useMemo } from 'react'
import useInfo from '../hooks/useInfo'
import { checkNotZoroNum, checkNotZoroNumOption, fb4 } from '@/utils/index'

const usefxETH = () => {
  const fxInfo = useInfo()
  console.log('fxInfo---', fxInfo);
  const pageData = useMemo(() => {

  }, [fxInfo])
  return fxInfo
}

export default usefxETH
