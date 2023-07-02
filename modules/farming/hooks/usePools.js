import { useCallback, useMemo, useState } from 'react'
import { cBN, checkNotZoroNum, checkNotZoroNumOption, fb4 } from '@/utils/index'
import { POOLS_LIST } from '@/config/aladdinVault'
import { useClev } from '@/hooks/useContracts'
import useFarmPrice from './useFarmPrice'
import useFarmData from './useFarmData'
import useFarmApy from './useFarmApy'
import useGlobal from '@/hooks/useGlobal'

const yearS = 31536000
const usePools = () => {
  const { farmingPriceData } = useFarmPrice()

  const ClevPrice = useMemo(() => {
    let price = 0
    for (const key in farmingPriceData) {
      if (farmingPriceData[key] && farmingPriceData[key].ClevPrice * 1) {
        price = farmingPriceData[key].ClevPrice * 1
      }
    }
    return price
  }, [farmingPriceData])

  const { allPoolsInfo: basicInfo, allPoolsUserInfo: userInfo } = useFarmData()
  const { curveApy, balancerApy, concentratorAbcCVXBaseApy, ...allPoolsApys } =
    useFarmApy()
  const { ConvexVaultsAPY, concentratorInitData } = useGlobal()
  const { tokenInfo: clevTokenInfo } = useClev()
  const [publicInfo, setPublicInfo] = useState([])

  const clevUSD_FraxBP_apy = useMemo(() => {
    try {
      const _depositUrl =
        'https://curve.fi/#/ethereum/pools/factory-v2-237/deposit'
      const fraxBpAPY = ConvexVaultsAPY.find(
        (item) => item.depositInfo.url == _depositUrl
      )
      return fraxBpAPY.apy.project || 0
    } catch (error) {
      return 0
    }
  }, [ConvexVaultsAPY])

  const getApy = (item, tvl) => {
    // project apy = 区块排放量*每天区块数**价格365天/TVL
    // cBN(item.lp_gauge_clev_timestamp).times(priceInfo[config.contracts.aladdinCLEV.toLowerCase()]).times(365).div(tvl).times(100)
    const apyItem = allPoolsApys[item.lpAddress.toLowerCase()]
    const baseApyAll = curveApy
    const balancerBaseApyAll = balancerApy
    let baseApy = cBN(0)
    let baseApyWeekly = cBN(0)
    if (apyItem) {
      const _apy0 = cBN(apyItem.gauge_clev_timestamp)
        .times(cBN(yearS))
        .times(100)
      const _apy1 = cBN(tvl).shiftedBy(-item.stakeTokenDecimals)
      const _clevApy = _apy0.times(ClevPrice).div(_apy1)
      if (item.lpPoolToken && baseApyAll) {
        baseApy = baseApyAll[item.lpPoolToken.toLowerCase()].apy
        baseApyWeekly = baseApyAll[item.lpPoolToken.toLowerCase()].apyWeekly
        baseApy = checkNotZoroNum(baseApyWeekly) ? baseApyWeekly : baseApy
        baseApy = checkNotZoroNum(baseApy) ? cBN(baseApy) : cBN(0)
        baseApyWeekly = checkNotZoroNum(baseApyWeekly)
          ? cBN(baseApyWeekly)
          : cBN(0)
      }
      if (item.lpPoolId && balancerBaseApyAll) {
        baseApy = balancerBaseApyAll[item.lpPoolId.toLowerCase()].apy
        baseApy = checkNotZoroNum(baseApy) ? cBN(baseApy) : cBN(0)
      }
      if (item.name == 'abcCVX') {
        baseApy = concentratorAbcCVXBaseApy
        baseApyWeekly = concentratorAbcCVXBaseApy
      }

      return [_clevApy, baseApy, baseApyWeekly]
    }
    return [cBN(0), baseApy, baseApyWeekly]
  }

  const poolList = useMemo(() => {
    try {
      const newFramPrice = {
        ...farmingPriceData,
        '0xdec800c2b17c9673570fdf54450dc1bd79c8e359': {
          usd: concentratorInitData.abcCVXPrice,
        },
      }
      const list = basicInfo.map((item, index) => {
        const _lpPrice = newFramPrice[item.lpAddress.toLowerCase()]?.usd
        const otherTokenData =
          newFramPrice[item.lpAddress.toLowerCase()]?.otherTokenData
        const tvl = cBN(item.totalSupply).times(_lpPrice).toString(10)
        const tvlText = checkNotZoroNumOption(
          tvl,
          fb4(tvl, true, item.stakeTokenDecimals ?? 18)
        )
        // console.log('userInfo-----', userInfo)
        const _userInfo = userInfo[index]
          ? userInfo[index]
          : {
              userTokenAllowance: 0,
              userDeposited: 0,
              claimable: 0,
            }
        const userDepositedTvl = cBN(_userInfo.userDeposited)
          .times(_lpPrice)
          .toString(10)
        _userInfo.userDepositedTvl = userDepositedTvl
        _userInfo.userDepositedTvlText = checkNotZoroNumOption(
          userDepositedTvl,
          fb4(userDepositedTvl, true, item.stakeTokenDecimals ?? 18)
        )
        const claimableTvl = cBN(_userInfo.claimable_reward)
          .times(_lpPrice)
          .toString(10)
        _userInfo.claimableTvl = claimableTvl
        _userInfo.claimableTvlText = checkNotZoroNumOption(
          _userInfo.claimable_reward,
          fb4(
            _userInfo.claimable_reward,
            false,
            clevTokenInfo ? clevTokenInfo[2] : 18
          )
        )

        // project apy = 区块排放量*每天区块数**价格365天/TVL
        const rewardApy = getApy(item, tvl)[0]
        const rewardApyMin = rewardApy
        const rewardApyMax = rewardApy * 2.5
        let baseApy = getApy(item, tvl)[1]
        baseApy = checkNotZoroNum(baseApy) ? baseApy : 0
        let baseApyWeekly = getApy(item, tvl)[2]
        baseApyWeekly = checkNotZoroNum(baseApyWeekly) ? baseApyWeekly : 0
        const apy = cBN(rewardApy).plus(baseApy)
        const apyMin = cBN(rewardApyMin).plus(baseApy)
        const apyMax = cBN(rewardApyMax).plus(baseApy)
        const rewardApyText = checkNotZoroNumOption(
          rewardApy,
          `${rewardApy.toFixed(2)}%`
        )
        const rewardApyMinText = checkNotZoroNumOption(
          rewardApyMin,
          `${rewardApyMin.toFixed(2)}%`
        )
        const baseApyText = checkNotZoroNumOption(
          baseApy,
          `${baseApy.toFixed(2)}%`
        )
        const baseApyWeeklyText = checkNotZoroNumOption(
          baseApyWeekly,
          `${baseApyWeekly.toFixed(2)}%`
        )
        const apyText = checkNotZoroNumOption(apy, `${apy.toFixed(2)}%`)
        const apyMinText = checkNotZoroNumOption(
          apyMin,
          `${apyMin.toFixed(2)}%`
        )
        const apyMaxText = checkNotZoroNumOption(
          apyMax,
          `${apyMax.toFixed(2)}%`
        )
        const rewardApyMaxText = checkNotZoroNumOption(
          rewardApyMax,
          `${rewardApyMax.toFixed(2)}%`
        )
        // if (item.name == 'abcCVX') {
        //   console.log('apyMin--apyMax', baseApyText, apyMinText, apyMaxText)
        // }
        if (item.isStaticPool) {
          return {
            ...item,
            userInfo: {},
            tvl: 0,
            tvlText: 0,
            lpTokenPrice: _lpPrice,
            clevUSD_FraxBP_apy,
            rewardApy,
            baseApy,
            baseApyWeekly,
            rewardApyMin,
            rewardApyText,
            rewardApyMinText,
            baseApyText,
            baseApyWeeklyText,
            apyText,
            apyMin,
            apyMinText,
            apyMaxText,
            rewardApyMax,
            rewardApyMaxText,
            otherTokenData: {},
          }
        }
        return {
          ...item,
          userInfo: _userInfo,
          tvl,
          tvlText,
          lpTokenPrice: _lpPrice,
          clevUSD_FraxBP_apy,
          rewardApy,
          baseApy,
          baseApyWeekly,
          rewardApyMin,
          rewardApyText,
          rewardApyMinText,
          baseApyText,
          baseApyWeeklyText,
          apyText,
          apyMin,
          apyMinText,
          apyMaxText,
          rewardApyMax,
          rewardApyMaxText,
          otherTokenData,
        }
      })
      setPublicInfo(list)
      // console.log('poolList---success---', list)
      return list
    } catch (e) {
      console.log('poolList---error---', e)
      return POOLS_LIST
    }
  }, [
    concentratorAbcCVXBaseApy,
    balancerApy,
    curveApy,
    basicInfo,
    userInfo,
    ClevPrice,
    clevUSD_FraxBP_apy,
  ])

  return {
    poolList,
    publicInfo,
  }
}

export default usePools
