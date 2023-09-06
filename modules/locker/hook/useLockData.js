import { useEffect, useState } from 'react'
import moment from 'moment'
import config from '@/config/index'
import useWeb3 from '@/hooks/useWeb3'
import abi from '@/config/abi'
import {
  useVeClev,
  useVeFee,
  useClev,
  usePlatformFeeDistributor,
  useContract,
} from '@/hooks/useContracts'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import { cBN } from '@/utils/index'

const initContractInfo = {
  veTotalSupply: 0,
  veLockedClev: 0,
  userLocked: {},
  userVeShare: 0,
  userVeRewards: 0,
  clevCirculationSupply: 1,
}

// hook
const useData = () => {
  const { _currentAccount, current, isAllReady } = useWeb3()
  const multiCallsV2 = useMutiCallV2()
  const { contract: veContract, address: veAddress } = useVeClev()
  const { contract: clevContract } = useClev()
  const {
    feeContractForCVX,
    feeContractForFrax,
    cvxFeeDistributor,
    fraxFeeDistributor,
  } = useVeFee()
  const {
    contract: platformFeeDistributorContract,
    address: platformFeeDistributor,
  } = usePlatformFeeDistributor()

  const { contract: cvxContract } = useContract(config.tokens.cvx, abi.erc20ABI)
  const { contract: fraxContract } = useContract(
    config.tokens.frax,
    abi.erc20ABI
  )

  const [contractInfo, seTContractInfo] = useState(initContractInfo)

  const fetchCotractInfo = async () => {
    try {
      const thisWeekTimestamp =
        Math.floor(current.unix() / (7 * 86400)) * 7 * 86400
      const preWeekTimestamp =
        Math.floor(current.unix() / (7 * 86400)) * 7 * 86400 - 86400 * 7
      const preTwoWeeksTimestamp =
        Math.floor(current.unix() / (7 * 86400)) * 7 * 86400 - 86400 * 14
      // console.log('preWeekTimestamp---', preWeekTimestamp, preTwoWeeksTimestamp)

      const { totalSupply, balanceOf: veBalanceOf } = veContract.methods
      const { balanceOf, totalSupply: clevTotalSupply } = clevContract.methods

      const abiCalls = [
        totalSupply(),
        veBalanceOf(_currentAccount),
        balanceOf(veAddress),
        clevTotalSupply(),
        balanceOf(config.contracts.aladdinCLEVVest),
        balanceOf(config.contracts.clevHoderTreasuyry),
        feeContractForCVX.methods.tokens_per_week(thisWeekTimestamp),
        feeContractForCVX.methods.tokens_per_week(preWeekTimestamp),
        feeContractForCVX.methods.tokens_per_week(preTwoWeeksTimestamp),
        feeContractForFrax.methods.tokens_per_week(thisWeekTimestamp),
        feeContractForFrax.methods.tokens_per_week(preWeekTimestamp),
        feeContractForFrax.methods.tokens_per_week(preTwoWeeksTimestamp),
        feeContractForCVX.methods.token_last_balance(),
        feeContractForFrax.methods.token_last_balance(),
        platformFeeDistributorContract.methods.rewards(0),
        platformFeeDistributorContract.methods.rewards(1),
        cvxContract.methods.balanceOf(cvxFeeDistributor),
        cvxContract.methods.balanceOf(platformFeeDistributor),
        fraxContract.methods.balanceOf(fraxFeeDistributor),
        fraxContract.methods.balanceOf(platformFeeDistributor),
      ]
      const { amount, end } = await veContract.methods
        .locked(_currentAccount)
        .call()

      const [
        veTotalSupply,
        userVeShare,
        veLockedCLEV,
        clevTotalAmount,
        clevVested,
        clevHoderTreasuyry,
        tokensThisWeekForCVX,
        tokensPerWeekForCVX,
        tokensPerTwoWeeksForCVX,
        tokensThisWeekForFRAX,
        tokensPerWeekForFRAX,
        tokensPerTwoWeeksForFRAX,
        cvxFeeTokenLastBalance,
        fraxFeeTokenLastBalance,
        cvxRewardInfo,
        fraxRewardInfo,
        feeDistributorCVXBalance,
        platformFeeDistributorCVXBalance,
        feeDistributorFRAXBalance,
        platformFeeDistributorFRAXBalance,
      ] = await multiCallsV2(abiCalls)
      const clevCirculationSupply = cBN(clevTotalAmount)
        .minus(clevVested)
        .minus(clevHoderTreasuyry)

      const cvxRewardRate =
        1 -
        cvxRewardInfo.gaugePercentage / 10e8 -
        cvxRewardInfo.treasuryPercentage / 10e8
      const fraxRewardRate =
        1 -
        fraxRewardInfo.gaugePercentage / 10e8 -
        fraxRewardInfo.treasuryPercentage / 10e8
      seTContractInfo({
        veTotalSupply,
        veLockedCLEV,
        clevCirculationSupply,
        userVeShare,
        userLocked: { amount, end: moment(end * 1000).unix() },
        tokensThisWeekForCVX,
        tokensPerWeekForCVX,
        tokensPerTwoWeeksForCVX,
        tokensThisWeekForFRAX,
        tokensPerWeekForFRAX,
        tokensPerTwoWeeksForFRAX,
        cvxFeeTokenLastBalance,
        fraxFeeTokenLastBalance,
        cvxRewardRate,
        fraxRewardRate,
        feeDistributorCVXBalance,
        platformFeeDistributorCVXBalance,
        feeDistributorFRAXBalance,
        platformFeeDistributorFRAXBalance,
      })
    } catch (error) {}
  }

  useEffect(() => {
    if (cvxContract && fraxContract) {
      fetchCotractInfo()
    } else {
      seTContractInfo(initContractInfo)
    }
  }, [_currentAccount, current, cvxContract, fraxContract])

  return {
    info: contractInfo,
    contracts: { veContract, clevContract },
  }
}

export default useData
