import { useEffect, useMemo, useState } from 'react'
import { cBN, checkNotZoroNum, fb4 } from '@/utils/index'
import { useClev } from '@/hooks/useContracts'
import usePools from './usePools'

const useTvl = () => {
  const { tokenInfo: clevTokenInfo } = useClev()
  const { publicInfo: poolsInfo } = usePools()

  const tvl = useMemo(() => {
    if (!poolsInfo.length) {
      return {
        totalTvl: 0,
        totalTvlText: '-',
        myAsset: 0,
        myAssetText: '-',
        claimable: 0,
        claimableText: '-',
      }
    }
    const totalTvl = poolsInfo.reduce((prev, cur) => {
      return checkNotZoroNum(cur.tvl)
        ? cBN(cur.tvl ?? 0)
            .shiftedBy(-cur.stakeTokenDecimals ?? 18)
            .plus(prev)
        : cBN(prev)
    }, cBN(0))
    const totalTvlText = checkNotZoroNum(totalTvl)
      ? fb4(totalTvl.toString(10), true, 0, 2)
      : '-'
    const myAsset = poolsInfo.reduce((prev, cur) => {
      if (checkNotZoroNum(cur.userInfo?.userDepositedTvl)) {
        return cBN(cur.userInfo.userDepositedTvl ?? 0)
          .shiftedBy(-cur.stakeTokenDecimals ?? 18)
          .plus(prev)
      }
      return prev
    }, cBN(0))
    const myAssetText = checkNotZoroNum(myAsset)
      ? fb4(myAsset, true, 0, 2)
      : '-'
    const claimable = poolsInfo.reduce((prev, cur) => {
      if (checkNotZoroNum(cur.userInfo?.claimable_reward)) {
        return cBN(cur.userInfo.claimable_reward ?? 0)
          .shiftedBy(-(clevTokenInfo ? clevTokenInfo[2] : 18))
          .plus(prev)
      }
      return prev
    }, cBN(0))
    const claimableText = checkNotZoroNum(claimable)
      ? fb4(claimable, false, 0, 2)
      : '-'

    return {
      totalTvl,
      totalTvlText,
      myAsset,
      myAssetText,
      claimable,
      claimableText,
    }
  }, [poolsInfo, clevTokenInfo])

  return tvl
}

export default useTvl
