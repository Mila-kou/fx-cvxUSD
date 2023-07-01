import { useMemo } from 'react'
import useGlobal from '@/hooks/useGlobal'
import { getConvexData } from '@/utils/index'

const useConvexInfo = (tokenName) => {
  const { ConvexVaultsAPY: connvexInfo } = useGlobal()

  const info = useMemo(() => {
    if (connvexInfo && connvexInfo.length) {
      return getConvexData(connvexInfo, tokenName)
    }
    return null
  }, [connvexInfo, tokenName])

  return info
}

export default useConvexInfo
