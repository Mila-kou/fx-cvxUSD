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

export const useFX_stETHTreasury = () => {
  const address = config.contracts.fx_stETHTreasury
  const { getContract } = useContract()
  return useMemo(
    () => ({
      contract: getContract(address, abi.FX_stETHTreasuryABI),
      address,
    }),
    [getContract]
  )
}

export const useFx_FxGateway = () => {
  const address = config.contracts.fx_FxGateway
  const { getContract } = useContract()
  return useMemo(
    () => ({
      contract: getContract(address, abi.Fx_Gateway),
      address,
    }),
    [getContract]
  )
}

export const useFx_ReservePool = () => {
  const address = config.contracts.fx_ReservePool
  const { getContract } = useContract()
  return useMemo(
    () => ({
      contract: getContract(address, abi.Fx_ReservePool),
      address,
    }),
    [getContract]
  )
}

export const useFx_FxETHTwapOracle = () => {
  const address = config.contracts.fx_FxETHTwapOracle
  const { getContract } = useContract()
  return useMemo(
    () => ({
      contract: getContract(address, abi.Fx_FxETHTwapOracle),
      address,
    }),
    [getContract]
  )
}

export const useFX_stETHGateway = () => {
  const address = config.contracts.fx_stETHGateway
  const { getContract } = useContract()
  return useMemo(
    () => ({
      contract: getContract(address, abi.FX_stETHGatewayABI),
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

export const useWstETH = () => {
  const address = config.tokens.wstETH
  const { getContract } = useContract()
  return useMemo(
    () => ({
      contract: getContract(address, abi.wstETHABI),
      address,
    }),
    [getContract]
  )
}

export const useStETH = () => {
  const address = config.tokens.stETH
  const { getContract } = useContract()
  return useMemo(
    () => ({
      contract: getContract(address, abi.stETHABI),
      address,
    }),
    [getContract]
  )
}

////////////////////////////////////////

export const useFXN = () => {
  const address = config.contracts.FXN
  const { getContract } = useContract()
  return useMemo(
    () => ({
      contract: getContract(address, abi.FXNABI),
      address,
      tokenInfo: config.TOKENS_INFO.fxn,
    }),
    [getContract]
  )
}

export const useFxGaugeController = () => {
  const address = config.contracts.fx_GaugeController
  const { getContract } = useContract()
  return useMemo(
    () => ({
      contract: getContract(address, abi.FX_GaugeControllerABI),
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

export const useVeFXN = () => {
  const address = config.contracts.veFXN
  const { getContract } = useContract()
  return useMemo(
    () => ({
      contract: getContract(address, abi.AlaVeCLEVABI),
      address,
      tokenInfo: config.TOKENS_INFO.veFXN,
    }),
    [getContract]
  )
}

export const useVeFXNFee = () => {
  const { contract: AladdinVeFeeContract } = useContract(
    config.contracts.fx_ve_FeeDistributor,
    abi.AlaFeeDistributor
  )
  return {
    contract: AladdinVeFeeContract,
    address: config.contracts.aladdinVeFeeForCVX,
    tokenInfo: config.TOKENS_INFO.vefee,
  }
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

/// Vesting ///
export const useFXNVesting = () => {
  const address = config.contracts.fx_Vesting
  const { getContract } = useContract()
  return useMemo(
    () => ({
      contract: getContract(address, abi.AladdinCLEVVestingABI),
      address,
    }),
    [getContract]
  )
}

export const useFX_ManageableVesting = () => {
  const address = config.contracts.fx_ManageableVesting
  const { getContract } = useContract()
  return useMemo(
    () => ({
      contract: getContract(address, abi.FX_ManageableVestingABI),
      address,
    }),
    [getContract]
  )
}

export const useConvex_cvxFxnStaking = () => {
  const address = config.contracts.convex_cvxFxnStaking
  const { getContract } = useContract()
  return useMemo(
    () => ({
      contract: getContract(address, abi.convex_cvxFxnStakingABI),
      address,
    }),
    [getContract]
  )
}

export const useStakeDao_sdFxnStaking = () => {
  const address = config.contracts.stakeDao_sdFxnStaking
  const { getContract } = useContract()
  return useMemo(
    () => ({
      contract: getContract(address, abi.stakeDao_sdFxnStakingABI),
      address,
    }),
    [getContract]
  )
}

/// Curve ///
export const useCurvefiSwap = () => {
  const address = config.contracts.CurvefiSwapRouterAddress
  const { getContract } = useContract()
  return useMemo(
    () => ({
      contract: getContract(address, abi.curveSwapABI),
      address,
    }),
    [getContract]
  )
}

export const useAladdinTree = () => {
  const address = config.contracts.aladdinTreeAddress
  const { getContract } = useContract()
  return useMemo(
    () => ({
      contract: getContract(address, abi.AladdinMerkleTreeABI),
      address,
    }),
    [getContract]
  )
}
