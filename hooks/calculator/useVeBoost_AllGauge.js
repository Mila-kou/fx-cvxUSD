import { useCallback, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { useQuery } from '@tanstack/react-query'
import { checkNotZoroNum, cBN } from 'utils'
import abi from 'config/abi'
import { useContract, useVeFXN } from '@/hooks/useContracts'
import { useMutiCall, useMutiCallV2 } from '@/hooks/useMutiCalls'
import { POOLS_LIST } from '@/config/aladdinVault'
import useWeb3 from '../useWeb3'

export const useVeBoostAllGauge = () => {
  const multiCallsV2 = useMutiCallV2()
  const { getContract } = useContract()
  const { _currentAccount, web3, blockNumber, isAllReady } = useWeb3()
  const { contract: veContract } = useVeFXN()

  const getGaugeContract = useCallback(
    (lpGaugeAddress) => {
      const _lpGaugeContract = getContract(
        lpGaugeAddress,
        abi.FX_fx_SharedLiquidityGaugeABI
      )
      return _lpGaugeContract
    },
    [getContract]
  )
  const getLiquidityLimit = async () => {
    try {
      const gaugeListCalls = POOLS_LIST.map((item) => {
        const _gaugeContract = getGaugeContract(item.lpGaugeAddress)
        const { workingBalanceOf, workingSupply, totalSupply, balanceOf } =
          _gaugeContract.methods
        return {
          lpGaugeAddress: item.lpGaugeAddress,
          working_balancesRES: workingBalanceOf(_currentAccount),
          working_supplyRES: workingSupply(),
          gaugeTotalSupplyRES: totalSupply(),
          userDepositAmountRES: balanceOf(_currentAccount),
        }
      })
      const calls = {
        userVeAmountRES: veContract.methods.balanceOf(_currentAccount),
        veTotalSupplyRES: veContract.methods.totalSupply(),
        gaugeList: gaugeListCalls,
      }
      const decoded = await multiCallsV2(calls)
      const gaugeListBooster = {}
      if (decoded.gaugeList.length) {
        const { userVeAmountRES, veTotalSupplyRES, gaugeList } = decoded
        gaugeList.map((item) => {
          const { lpGaugeAddress } = item
          const _gaugeData = calcBoost({
            userVeAmount: userVeAmountRES,
            veTotalSupply: veTotalSupplyRES,
            gaugeInfo: item,
          })
          gaugeListBooster[lpGaugeAddress] = _gaugeData
        })
      }
      return gaugeListBooster
    } catch (error) {
      console.log('veBoostAllGauge---error', error)
      return [0, 0, 0, 0]
    }
  }

  const calcBoost = (boostData) => {
    try {
      const { userVeAmount, veTotalSupply, gaugeInfo } = boostData
      const {
        working_balancesRES: working_balances,
        working_supplyRES: working_supply,
        gaugeTotalSupplyRES,
        userDepositAmountRES,
      } = gaugeInfo
      const __l = userDepositAmountRES
      const __userVeAmount = userVeAmount
      const __veTotalSupply = veTotalSupply
      const __gaugeTotalSupply = gaugeTotalSupplyRES

      const L = __gaugeTotalSupply
      const TOKENLESS_PRODUCTION = 40

      let lim = cBN(__l).multipliedBy(TOKENLESS_PRODUCTION / 100)

      lim = cBN(L)
        .multipliedBy(__userVeAmount)
        .div(__veTotalSupply)
        .multipliedBy((100 - TOKENLESS_PRODUCTION) / 100)
        .plus(lim)

      lim = BigNumber.minimum(lim, __l)
      const old_bal = working_balances
      const noboost_lim = cBN(__l).multipliedBy(TOKENLESS_PRODUCTION).div(100)
      const noboost_supply = cBN(L).multipliedBy(TOKENLESS_PRODUCTION).div(100)
      let votingBoost
      let repairBoost = 1 // 修正值
      if (!checkNotZoroNum(noboost_lim)) {
        votingBoost = 1
      } else {
        votingBoost = cBN(lim).div(noboost_lim).toString()
      }
      repairBoost = checkNotZoroNum(working_supply)
        ? cBN(noboost_supply).div(working_supply).toFixed(2)
        : 1
      const data = [working_supply.toString(), 0, votingBoost, repairBoost]
      return data
    } catch (error) {
      console.log('veBoostAllGauge-----error1---', error)
      return [0, 0, 0, 0]
    }
  }

  const {
    data,
    refetch: refetchUserInfo,
    isFetching,
  } = useQuery({
    queryKey: ['veBoostAllGauge'],
    queryFn: () => getLiquidityLimit(),
    enabled: isAllReady,
    initialData: [0, 0, 0, 0],
  })

  useEffect(() => {
    if (isFetching) return
    refetchUserInfo()
  }, [_currentAccount, blockNumber])
  return { allGaugeVeBoost: data }
}
