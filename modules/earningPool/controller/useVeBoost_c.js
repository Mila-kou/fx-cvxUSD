import useWeb3 from '@/hooks/useWeb3'
import { useVeFXN } from '@/hooks/useContracts'
import { useVeBoost } from '@/hooks/calculator/useVeBoost'

const useVeBoost_c = (gaugeItem) => {
  const { lpGaugeContract } = gaugeItem
  const { currentAccount, isAllReady } = useWeb3()
  const { contract: veContract } = useVeFXN()
  const data = useVeBoost({
    veContract,
    lpContract: lpGaugeContract, // lp gauge contract
    depositAmount: 0, // lp deposit amount
    gaugeTotalSupply: 0, // lp totalSupply
    veTotalSupply: 0, // ve veTotalSupply
    userVeAmount: 0, // ve userVeCLEV
    veContractTargetAccount: currentAccount,
    gaugeContractTargetAccount: currentAccount, // gaugeContract working_balances targeAccount
  })
  console.log('ve-boost--', data)
  return data
}

export default useVeBoost_c
