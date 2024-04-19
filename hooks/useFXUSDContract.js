import { useCallback, useMemo, useState, useEffect } from 'react'
import config from '@/config/index'
import abi from '@/config/abi'
import { useContract } from './useContracts'

export const useFXUSD_contract = (symbol = 'fxUSD') => {
  const address = config.tokens[symbol]
  const { getContract } = useContract()
  return useMemo(
    () => ({
      contract: getContract(address, abi.FXUSD_FxUSD_ABI),
      address,
    }),
    [getContract]
  )
}

export const useFxUSD_Type_Treasury_contract = (baseTokenType) => {
  let address
  switch (baseTokenType) {
    case 'sfrxETH':
      address = config.contracts.fxUSD_sfrxETH_Treasury
      break
    case 'wstETH':
      address = config.contracts.fxUSD_wstETH_Treasury
      break
    default:
      address = config.contracts.fxUSD_sfrxETH_Treasury
      break
  }
  const { getContract } = useContract()
  return useMemo(
    () => ({
      contract: getContract(address, abi.FXUSD_TreasuryV2_ABI),
      address,
    }),
    [getContract]
  )
}

export const useFxUSD_GatewayRouter_contract = () => {
  const address = config.contracts.fxUSD_GatewayRouter
  const { getContract } = useContract()
  return useMemo(
    () => ({
      contract: getContract(
        address,
        []
          .concat(abi.FXUSD_FxMarketV1Facet_ABI)
          .concat(abi.FXUSD_FxUSDFacet_ABI)
      ),
      address,
    }),
    [getContract]
  )
}

export const useV2MarketContract = () => {
  const { getContract } = useContract()
  return useCallback(
    (address) => ({
      contract: getContract(address, abi.FXUSD_MarketWithFundingCost_ABI),
      address,
    }),
    [getContract]
  )
}

export const useV2TreasuryContract = () => {
  const { getContract } = useContract()
  return useCallback(
    (address) => ({
      contract: getContract(address, abi.FXUSD_TreasuryWithFundingCost_ABI),
      address,
    }),
    [getContract]
  )
}

export const useV2FContract = () => {
  const { getContract } = useContract()
  return useCallback(
    (address) => ({
      contract: getContract(address, abi.FXUSD_FractionalTokenV2_ABI),
      address,
    }),
    [getContract]
  )
}

export const useV2XContract = () => {
  const { getContract } = useContract()
  return useCallback(
    (address) => ({
      contract: getContract(address, abi.FXUSD_LeveragedTokenV2_ABI),
      address,
    }),
    [getContract]
  )
}

export const useInitialFundContract = () => {
  const { getContract } = useContract()
  return useCallback(
    (address) => ({
      contract: getContract(address, abi.FxInitialFund_ABI),
      address,
    }),
    [getContract]
  )
}

export const useRebalancePoolRegistry = () => {
  const { getContract } = useContract()
  return useCallback(
    (address) => ({
      contract: getContract(address, abi.FX_RebalancePoolRegistryABI),
      address,
    }),
    [getContract]
  )
}

export const useReservePoolV2 = () => {
  const address = config.contracts.fxUSD_ReservePoolV2
  const { getContract } = useContract()
  return useMemo(
    () => ({
      contract: getContract(address, abi.FXUSD_ReservePoolV2_ABI),
      address,
    }),
    [getContract]
  )
}

export const useETHTwapOracle = () => {
  const { getContract } = useContract()
  return useCallback(
    (address) => ({
      contract: getContract(address, abi.ETHTwapOracle_ABI),
      address,
    }),
    [getContract]
  )
}
