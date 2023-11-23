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

export const useBoostableRebalancePool = (gaugeAddress) => {
  const address = gaugeAddress
  const { getContract } = useContract()
  return useMemo(
    () => ({
      contract: getContract(address, abi.FX_BoostableRebalancePoolABI),
      address,
    }),
    [getContract]
  )
}

export const useRebalanceWithBonusToken = (token) => {
  const address = token
  const { getContract } = useContract()
  return useMemo(
    () => ({
      contract: getContract(address, abi.FX_RebalanceWithBonusTokenABI),
      address,
    }),
    [getContract]
  )
}
