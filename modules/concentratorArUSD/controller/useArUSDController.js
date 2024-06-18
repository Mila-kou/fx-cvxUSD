import { useMemo, useState } from 'react'
import useWeb3 from '@/hooks/useWeb3'
import useArUSDData from '../hooks/useArUSDData'
import config from '@/config/index'
import concentratorConfig from '@/config/concentrator_token'
import { useGlobal } from '@/contexts/GlobalProvider'
import { cBN, checkNotZoroNumOption, fb4, formatBalance } from '@/utils/index'

const poolConfig = {
  icon: '/tokens/arUSD.svg',
  subIcon: '/images/compounder.svg',
  token: 'arUSD',
  name: 'arUSD',
  platform: 'Convex',
  address: concentratorConfig.CompounderConf.Aladdin_rUSD.tokenAddress,
  underlyingTokenUrl: 'https://fx.aladdin.club/assets/rUSD/',
  stakingAddress: '0xc2DeF1E39FF35367F2F2a312a793477C576fD4c3',
  apy: 0,
  aum: 0,
  aumUsd: 0,
  underlyingToken: 'rUSD',
  underlyingTokenAddress: config.tokens.rUSD,
  currentIndex: 1,
  userBalanceInfo: 0,
  myBalance: 0,
  myBalanceUsd: 0,
  config: concentratorConfig.CompounderConf.Aladdin_rUSD,
  userInfo: {},
  basicInfo: {},
  userTotalBalance: 0,
}
const useArUSDController = () => {
  const { baseInfo, userInfo } = useArUSDData()
  const { currentAccount, isAllReady, sendTransaction } = useWeb3()
  const { connvexFxPoolsData } = useGlobal()
  const [depositVisible, setDepositVisible] = useState(false)
  const [withdrawVisible, setWithdrawVisible] = useState(false)
  const {
    totalSupplyRes,
    totalAssetsRes,
    totalPendingBaseTokenRes,
    exchangeRateRes,
    navRes,
    WithdrawFeeRes,
  } = baseInfo
  const { tokenBalance, wrapArUSDWalletBalance } = userInfo
  const handleDeposit = () => {
    if (!isAllReady) return
    setDepositVisible(true)
  }
  const handleWithdraw = () => {
    if (!isAllReady) return
    setWithdrawVisible(true)
  }
  const lpPrice = 1
  const arUSDPrice = cBN(lpPrice).times(baseInfo.rate).toFixed(4, 1)
  const [convexPoolObj, apy] = useMemo(() => {
    let _convexPoolObj = false
    let _apy = 0
    if (connvexFxPoolsData.pools) {
      const { augmentedPoolData } = connvexFxPoolsData.pools
      _convexPoolObj = augmentedPoolData.find((item) => {
        return (
          item.stakingAddress.toLowerCase() ==
          poolConfig.stakingAddress.toLowerCase()
        )
      })

      if (_convexPoolObj) {
        const { rewardAprs } = _convexPoolObj
        const convexPoolApy = rewardAprs.reduce((pre, currentApy) => {
          return pre.plus(currentApy)
        }, cBN(0))
        _apy = cBN(convexPoolApy)
          .dividedBy(100)
          .dividedBy(52)
          .plus(1)
          .pow(52)
          .minus(1)
          .shiftedBy(2)
          .toFixed(2, 1)
      }
    }
    return [_convexPoolObj, _apy]
  }, [connvexFxPoolsData])

  const [withdrawFee] = useMemo(() => {
    const _withdrawFee = checkNotZoroNumOption(
      WithdrawFeeRes,
      formatBalance(WithdrawFeeRes, 6)
    )
    return [_withdrawFee]
  }, [baseInfo])

  const userTotalBalance = useMemo(() => {
    const totalTvl = cBN(tokenBalance).times(arUSDPrice)
    const totalTvl_text = checkNotZoroNumOption(totalTvl, fb4(totalTvl, true))

    const wrapArUSDWalletBalanceTvl = cBN(wrapArUSDWalletBalance).times(
      arUSDPrice
    )
    const wrapArUSDWalletBalanceTvl_text = checkNotZoroNumOption(
      wrapArUSDWalletBalance,
      fb4(wrapArUSDWalletBalance, true)
    )

    const tokenBalance_text = checkNotZoroNumOption(
      tokenBalance,
      fb4(tokenBalance)
    )
    const wrapArUSDWalletBalance_text = checkNotZoroNumOption(
      wrapArUSDWalletBalance,
      fb4(wrapArUSDWalletBalance)
    )
    return {
      totalTvl,
      totalTvl_text,
      tokenBalance_text,
      tokenBalance,
      wrapArUSDWalletBalanceTvl,
      wrapArUSDWalletBalanceTvl_text,
      wrapArUSDWalletBalance,
      wrapArUSDWalletBalance_text,
    }
  }, [baseInfo, currentAccount, userInfo])

  const aumUsd_wei = cBN(lpPrice).multipliedBy(totalAssetsRes)
  const aumUsd = checkNotZoroNumOption(aumUsd_wei, fb4(aumUsd_wei, true))
  const aum = checkNotZoroNumOption(totalAssetsRes, fb4(totalAssetsRes))

  return {
    baseInfo,
    userInfo,
    handleDeposit,
    handleWithdraw,
    depositVisible,
    setDepositVisible,
    withdrawVisible,
    setWithdrawVisible,
    poolConfig,
    withdrawFee,
    apy,
    userTotalBalance,
    aum,
    aumUsd,
  }
}

export default useArUSDController
