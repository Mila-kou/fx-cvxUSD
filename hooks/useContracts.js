import { useCallback, useMemo, useState, useEffect } from 'react'
import config from '@/config/index'
import abi from '@/config/abi'
import useWeb3 from '@/hooks/useWeb3'
import { useMutiCall } from '@/hooks/useMutiCalls'

export const useContract = (theAddr, theAbi) => {
  const { web3 } = useWeb3()

  const getContract = useCallback(
    (_address, _abi) => new web3.eth.Contract(_abi, _address),
    [web3]
  )

  const erc20Contract = useCallback(
    (_address) => getContract(_address, abi.erc20ABI),
    [getContract]
  )

  const contract = useMemo(() => {
    if (theAddr && theAbi) {
      return getContract(theAddr, theAbi)
    }
    return null
  }, [theAddr, theAbi, getContract])

  return { getContract, erc20Contract, contract }
}

export const useFETH = () => {
  const address = config.contracts.fETH
  const { getContract } = useContract()
  return useMemo(
    () => ({
      contract: getContract(address, abi.FX_FractionalToken),
      address,
    }),
    [getContract]
  )
}

export const useXETH = () => {
  const address = config.contracts.xETH
  const { getContract } = useContract()
  return useMemo(
    () => ({
      contract: getContract(address, abi.FX_LeveragedToken),
      address,
    }),
    [getContract]
  )
}

export const useFX_Market = () => {
  const address = config.contracts.fx_Market
  const { getContract } = useContract()
  return useMemo(
    () => ({
      contract: getContract(address, abi.FX_Market),
      address,
    }),
    [getContract]
  )
}

export const useFX_Treasury = () => {
  const address = config.contracts.fx_Treasury
  const { getContract } = useContract()
  return useMemo(
    () => ({
      contract: getContract(address, abi.FX_Treasury),
      address,
    }),
    [getContract]
  )
}

export const useFX_ETHGateway = () => {
  const address = config.contracts.fx_ETHGateway
  const { getContract } = useContract()
  return useMemo(
    () => ({
      contract: getContract(address, abi.FX_ETHGateway),
      address,
    }),
    [getContract]
  )
}

export const useClev = () => {
  const address = config.contracts.aladdinCLEV
  const { getContract } = useContract()
  return useMemo(
    () => ({
      contract: getContract(address, abi.AlaCLEV),
      address,
      tokenInfo: config.TOKENS_INFO.clev,
    }),
    [getContract]
  )
}

export const useAbcCVX = () => {
  const address = config.tokens.abcCVX
  const { getContract } = useContract()
  return useMemo(
    () => ({
      contract: getContract(address, abi.AladdinbcCVXABI),
      address,
    }),
    [getContract]
  )
}

export const useClevGaugeController = () => {
  const address = config.contracts.aladdinGaugeController
  const { getContract } = useContract()
  return useMemo(
    () => ({
      contract: getContract(address, abi.AlaGaugeControllerABI),
      address,
    }),
    [getContract]
  )
}

export const useClevMinter = () => {
  const address = config.contracts.aladdinCLEVMinter
  const { getContract } = useContract()
  return useMemo(
    () => ({
      contract: getContract(address, abi.AlaMinterABI),
      address,
    }),
    [getContract]
  )
}

export const useVeClev = () => {
  const address = config.contracts.aladdinVeCLEV
  const { getContract } = useContract()
  return useMemo(
    () => ({
      contract: getContract(address, abi.AlaVeCLEVABI),
      address,
      tokenInfo: config.TOKENS_INFO.veclev,
    }),
    [getContract]
  )
}

export const useVeFee = () => {
  const { contract: AladdinVeFeeContract } = useContract(
    config.contracts.aladdinVeFeeForCVX,
    abi.AlaFeeDistributor
  )
  const { contract: AladdinVeFeeForFraxContract } = useContract(
    config.contracts.aladdinVeFeeForFRAX,
    abi.AlaFeeDistributor
  )
  return {
    feeContractForFrax: AladdinVeFeeForFraxContract,
    feeContractForCVX: AladdinVeFeeContract,
    cvxFeeDistributor: config.contracts.aladdinVeFeeForCVX,
    fraxFeeDistributor: config.contracts.aladdinVeFeeForFRAX,
    address: config.contracts.aladdinVeFeeForCVX,
    tokenInfo: config.TOKENS_INFO.vefee,
  }
}

export const usePlatformFeeDistributor = () => {
  const address = config.contracts.PlatformFeeDistributor
  const { getContract } = useContract()
  return useMemo(
    () => ({
      contract: getContract(address, abi.PlatformFeeDistributorABI),
      address,
    }),
    [getContract]
  )
}

export const useAllInOneGateway = () => {
  const address = config.contracts.aladdinAllInOneGateway
  const { getContract } = useContract()
  return useMemo(
    () => ({
      contract: getContract(address, abi.AlaAllInOneGatewayABI),
      address,
    }),
    [getContract]
  )
}

export const useErc20Token = (tokenAddr, approveForAddr) => {
  const multiCall = useMutiCall()

  const { blockNumber, _currentAccount, web3 } = useWeb3()
  const [tokenInfo, setTokenInfo] = useState({ balance: 0, allowance: 0 })

  const { contract: tokenContract } = useContract(tokenAddr, abi.erc20ABI)

  const fetchTokenInfo = async () => {
    const { balanceOf: tokenBalanceOf, allowance: tokenAllowance } =
      tokenContract.methods
    try {
      const calls = [
        tokenBalanceOf(_currentAccount),
        tokenAllowance(_currentAccount, approveForAddr),
      ]
      const [balance, allowance] = await multiCall(...calls)

      setTokenInfo({ balance, allowance })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (web3 && tokenContract) {
      fetchTokenInfo()
    }
  }, [web3, blockNumber, tokenContract, _currentAccount])

  return {
    tokenContract,
    tokenInfo,
  }
}
