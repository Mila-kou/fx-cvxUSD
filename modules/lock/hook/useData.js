import { useEffect, useState } from 'react'
import moment from 'moment'
import config from 'config'
import { cBN } from 'utils'
import {
  useVeFXNFee,
  useVeFXN,
  useFXN,
  useErc20Token,
} from '@/hooks/useContracts'
import useWeb3 from '@/hooks/useWeb3'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'

const useData = (refreshTrigger) => {
  const { _currentAccount, blockNumber, current } = useWeb3()
  const { contract: veFXNContract, address: veFXNAddress } = useVeFXN()
  const { contract: FXNContract } = useFXN()
  const { contract: veFXNFeeContract, address: veFXNFeeAddress } = useVeFXNFee()
  const { tokenContract: stETHContract } = useErc20Token(
    config.tokens.stETH,
    veFXNFeeAddress
  )

  const multiCallsV2 = useMutiCallV2()

  const [contractInfo, setContractInfo] = useState({
    veTotalSupply: 0,
    veLockedCTR: 0,
    userLocked: {},
    userVeShare: 0,
    tokensPerWeek: 0,
    userVeRewards: 0,
    feeBalance: 0,
    veFXNFeeAcrv: 0,
    veFXNFeeTokenLastBalance: 0,
  })

  const fetchCotractInfo = async () => {
    const { totalSupply, balanceOf: veFXNBalanceOf } = veFXNContract.methods
    const { balanceOf, totalSupply: fxnTotalSupply } = FXNContract.methods

    try {
      const abiCalls = [
        totalSupply(),
        balanceOf(veFXNAddress),
        balanceOf(config.contracts.fx_Vesting),
        balanceOf(config.contracts.fx_FXN_treasury), //TODO check address
        veFXNBalanceOf(_currentAccount),
        fxnTotalSupply(),
      ]

      const [
        veTotalSupply,
        veLockedFXN,
        fxnVested,
        fxnTreasury,
        userVeShare,
        fxnTotalAmount,
      ] = await multiCallsV2(abiCalls) // [0,0,0,0,0,0]
      const thisWeekTimestamp =
        Math.floor(current.unix() / (7 * 86400)) * 7 * 86400
      const preWeekTimestamp =
        Math.floor(current.unix() / (7 * 86400)) * 7 * 86400 - 86400 * 7

      const tokensInfoList = [
        veFXNContract.methods.locked(_currentAccount),
        veFXNFeeContract.methods.tokens_per_week(thisWeekTimestamp),
        veFXNFeeContract.methods.tokens_per_week(preWeekTimestamp),
        stETHContract.methods.balanceOf(config.contracts.fx_PlatformFeeSpliter),
        stETHContract.methods.balanceOf(config.contracts.fx_ve_FeeDistributor),
        // veCTRFee.methods.claim(_currentAccount),
        veFXNFeeContract.methods.token_last_balance(),
        // veFXNFeeContract.methods.claim(_currentAccount),
        // veFXNFeeContract.methods.claim(_currentAccount),
        // veFXNFeeContract.methods.claim(_currentAccount),
        // veFXNFeeContract.methods.claim(_currentAccount),
        // veFXNFeeContract.methods.claim(_currentAccount),
      ]
      const [
        { amount, end },
        tokensThisWeek,
        tokensPerWeek,
        platformFeeSpliterStETH,
        feeBalance,
        // userVeRewards,
        veFXNFeeTokenLastBalance,
        userVeRewards,
        // userVeRewards1,
        // userVeRewards2,
        // userVeRewards3,
        // userVeRewards4,
      ] = await multiCallsV2(tokensInfoList)
      console.log(
        'timestamp---tokensThisWeek--tokensPerWeek--platformFeeSpliterStETH--feeBalance--veFXNFeeTokenLastBalance--userVeRewards--',
        thisWeekTimestamp,
        tokensThisWeek,
        tokensPerWeek,
        platformFeeSpliterStETH,
        feeBalance,
        veFXNFeeTokenLastBalance,
        userVeRewards
        // userVeRewards1,
        // userVeRewards2
      )
      console.log('timestamp---tokensPerWeek', preWeekTimestamp, tokensPerWeek)
      const fxnCirculationSupply = cBN(fxnTotalAmount)
        .minus(fxnVested)
        .minus(fxnTreasury)

      setContractInfo({
        feeBalance,
        veTotalSupply,
        veLockedFXN,
        userVeShare,
        tokensThisWeek,
        tokensPerWeek,
        userVeRewards,
        // userVeRewards1,
        // userVeRewards2,
        // userVeRewards3,
        // userVeRewards4,
        fxnCirculationSupply,
        userLocked: { amount, end: moment(end * 1000).unix() },
        platformFeeSpliterStETH,
        veFXNFeeTokenLastBalance,
      })
    } catch (error) {
      console.log(
        'timestamp---tokensThisWeek--platformFeeSpliterStETH--veFXNFeeTokenLastBalance--feeBalance--error',
        error
      )
    }
  }

  useEffect(() => {
    fetchCotractInfo()
  }, [_currentAccount, blockNumber, current, refreshTrigger])

  return {
    info: contractInfo,
    contract: {
      veFXNContract,
      FXNContract,
      veFXNFeeContract,
    },
  }
}

export default useData
