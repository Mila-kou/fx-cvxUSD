import { useCallback, useMemo, useState, useEffect } from 'react'
import config from '@/config/index'
import abi from '@/config/abi'
import useWeb3 from '@/hooks/useWeb3'

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
      address
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
      address
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
      address
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
      address
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
      address
    }),
    [getContract]
  )
}