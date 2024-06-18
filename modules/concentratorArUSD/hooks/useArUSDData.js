import { useCallback, useContext, useEffect, useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import abi from 'config/abi'
import { useContract } from '@/hooks/useContracts'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import useWeb3 from '@/hooks/useWeb3'
import {
  useArUSDWrap_contract,
  useArUSD_contract,
} from '@/hooks/useConcentratorContract'
import { cBN, checkNotZoroNum } from '@/utils/index'

const useArUSDData = () => {
  const { _currentAccount, web3, isAllReady, blockNumber } = useWeb3()
  const { getContract } = useContract()
  const multiCallsV2 = useMutiCallV2()
  const { contract: compounderTokenContract } = useArUSD_contract()
  const { contract: compounderTokenWrapContract, address } =
    useArUSDWrap_contract()

  const fetchBaseInfo = useCallback(
    async (arr) => {
      try {
        const {
          totalSupply,
          getTotalAssets,
          totalPendingBaseToken,
          exchangeRate,
          nav,
          getWithdrawFeePercentage,
          liquidated,
        } = compounderTokenContract.methods
        const goblinContracts = [
          totalSupply(),
          getTotalAssets(),
          totalPendingBaseToken(),
          exchangeRate(),
          nav(),
          getWithdrawFeePercentage(),
          liquidated(),
        ]
        const [
          totalSupplyRes,
          totalAssetsRes,
          totalPendingBaseTokenRes,
          exchangeRateRes,
          navRes,
          WithdrawFeeRes,
          liquidatedRes,
        ] = await multiCallsV2(goblinContracts)

        console.log(
          'arUSD--baseInfo, userInfo---data--',
          totalSupplyRes,
          totalAssetsRes,
          totalPendingBaseTokenRes,
          exchangeRateRes,
          navRes,
          WithdrawFeeRes,
          rate,
          liquidatedRes
        )
        const rate = checkNotZoroNum(exchangeRateRes)
          ? cBN(exchangeRateRes).div(1e18).toFixed(4, 1)
          : 1
        return {
          totalSupplyRes,
          totalAssetsRes,
          totalPendingBaseTokenRes,
          exchangeRateRes,
          navRes,
          WithdrawFeeRes,
          rate,
          liquidatedRes,
        }
      } catch (error) {
        console.log('arUSD--baseData----error', error)
        return []
      }
    },
    [getContract, multiCallsV2, _currentAccount]
  )

  const fetchUserInfo = async () => {
    try {
      const goblinContracts = [
        compounderTokenContract.methods.balanceOf(_currentAccount),
        compounderTokenWrapContract.methods.balanceOf(_currentAccount),
      ]
      const [walletBalance, wrapArUSDWalletBalance] = await multiCallsV2(
        goblinContracts
      )
      const tokenBalance = walletBalance

      return { walletBalance, tokenBalance, wrapArUSDWalletBalance }
    } catch (error) {
      console.log('arUSD--fetchUserInfo---error--', error)
    }
  }

  const [
    {
      data: baseInfo,
      refetch: refetchBaseInfo,
      isFetching: isFetchingBaseInfo,
    },
    {
      data: userInfo,
      refetch: refetchUserInfo,
      isFetching: isFetchingUserInfo,
    },
  ] = useQueries({
    queries: [
      {
        queryKey: ['baseInfo', _currentAccount],
        queryFn: () => fetchBaseInfo(),
        initialData: [],
      },
      {
        queryKey: ['userInfo', _currentAccount],
        queryFn: () => fetchUserInfo(),
        enabled: isAllReady,
        initialData: [],
      },
    ],
  })

  useEffect(() => {
    if (!isFetchingBaseInfo) refetchBaseInfo()
    if (!isFetchingUserInfo) refetchUserInfo()
  }, [_currentAccount, blockNumber])

  return { baseInfo, userInfo }
}

export default useArUSDData
