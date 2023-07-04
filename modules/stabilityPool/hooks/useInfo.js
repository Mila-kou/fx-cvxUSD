import { useEffect, useState, useContext, useCallback } from 'react'
import { useQueries } from '@tanstack/react-query'
import moment from 'moment'
import {
  useContract,
  useFETH,
  useFX_Market,
  useFX_stETHTreasury,
  useFX_stabilityPool,
  useXETH,
} from 'hooks/useContracts'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import useWeb3 from '@/hooks/useWeb3'
import { cBN, fb4 } from '@/utils/index'

const useInfo = () => {
  const { _currentAccount, web3, blockNumber } = useWeb3()
  const { erc20Contract } = useContract()
  const multiCallsV2 = useMutiCallV2()
  const { contract: fx_stabilityPoolContract } = useFX_stabilityPool()
  const [maxAbleFToken, setMaxAbleFToken] = useState({})

  const fetchBaseInfo = useCallback(async () => {
    const { totalSupply: stabilityPoolTotalSupplyFn } =
      fx_stabilityPoolContract.methods
    try {
      const apiCalls = [stabilityPoolTotalSupplyFn()]
      const [stabilityPoolTotalSupplyRes] = await multiCallsV2(apiCalls)

      console.log(
        'BaseInfo222222',
        // fETHTotalSupplyRes, xETHTotalSupplyRes, CurrentNavRes, collateralRatioRes, totalBaseTokenRes,
        // fTokenMintFeeRatioRes, fTokenRedeemFeeRatioRes, xTokenMintFeeRatioRes, xTokenRedeemFeeRatioRes,
        //  betaRes,
        stabilityPoolTotalSupplyRes,
        _currentAccount
      )

      return {
        stabilityPoolTotalSupplyRes,
      }
    } catch (error) {
      console.log('baseInfoError==>', error)
      return {}
    }
  }, [fx_stabilityPoolContract, multiCallsV2, _currentAccount])

  const [
    { data: baseInfo, refetch: refetchBaseInfo },
    // { data: userInfo, refetch: refetchUserInfo },
  ] = useQueries({
    queries: [
      {
        queryKey: ['baseInfo', _currentAccount],
        queryFn: () => fetchBaseInfo(),
        initialData: {},
        enabled: !!web3,
      },
    ],
  })

  useEffect(() => {
    refetchBaseInfo()
  }, [_currentAccount, blockNumber])

  // useEffect(() => {
  //   getMaxAbleToken()
  // }, [blockNumber])

  return {
    baseInfo,
    // ...maxAbleFToken,
    // userInfo,
  }
}
export default useInfo
