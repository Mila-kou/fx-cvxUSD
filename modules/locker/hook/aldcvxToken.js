import { useEffect, useState, useContext } from 'react'
import { useContract } from '@/hooks/useContracts'
import useWeb3 from '@/hooks/useWeb3'
import abis from '@/config/abi'
import config from '@/config/index'
import { useMutiCall } from '@/hooks/useMutiCalls'

const {
  aldCvx: aldCvxAddr,
  lockCvx: lockCvxAddr,
  transmuterCvx: transmuterCvxAddr,
} = config.contracts

const useAlaLending = () => {
  const { blockNumber, web3, currentAccount } = useWeb3()
  const multiCall = useMutiCall()
  const [userInfo, setUserInfo] = useState({
    userAldCvxAllowance: 0,
    userAldCvxWalletBalance: 0,
  })

  const { contract: aldCvxContract } = useContract(
    aldCvxAddr,
    abis.AladdinCVXABI
  )
  const { contract: lockCvxContract } = useContract(
    lockCvxAddr,
    abis.AladdinCVXLockerABI
  )
  const { contract: transmuterCvxContract } = useContract(
    transmuterCvxAddr,
    abis.TransmuterABI
  )

  const fetchUserInfo = async () => {
    try {
      const goblinContracts = [aldCvxContract.methods.balanceOf(currentAccount)]
      const [userAldCvxWalletBalance] = await multiCall(...goblinContracts)

      setUserInfo({
        userAldCvxWalletBalance,
      })
    } catch (error) {
      // console.log(error)
    }
  }

  useEffect(() => {
    if (aldCvxContract) {
      fetchUserInfo()
    }
  }, [web3, aldCvxContract, blockNumber])

  return {
    aldCvxContract,
    lockCvxContract,
    transmuterCvxContract,
    userInfo,
  }
}

export default useAlaLending
