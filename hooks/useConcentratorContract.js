import { useCallback, useMemo, useState, useEffect } from 'react'
import { contracts } from '@/config/concentrator_token'
import abi from '@/config/abi'
import { useContract } from './useContracts'

export const useArUSD_contract = () => {
  const address = contracts.arUSD
  const { getContract } = useContract()
  return useMemo(
    () => ({
      contract: getContract(address, abi.concentrator_fxCompounder_ABI),
      address,
    }),
    [getContract]
  )
}

export const useArUSDWrap_contract = () => {
  const address = contracts.arUSDWrap
  const { getContract } = useContract()
  return useMemo(
    () => ({
      contract: getContract(address, abi.concentrator_fxCompounder4626_ABI),
      address,
    }),
    [getContract]
  )
}

export const useConcentratorHarvest_contract = () => {
  const address = contracts.aladdin_common_harvest
  const { getContract } = useContract()
  return useMemo(
    () => ({
      contract: getContract(
        address,
        abi.concentrator_FxCompounderHarvestFacet_ABI
      ),
      address,
    }),
    [getContract]
  )
}
