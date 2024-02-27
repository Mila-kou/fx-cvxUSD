import { useMultiPathConverterContract } from '@/hooks/useContracts'
import { getFXUSDRouterByAddress } from '@/config/fxUSDRouter'
import config from '@/config/index'
import { zapTokens } from '@/config/tokens'
import { get1InchData } from '@/services/inch'
import useGlobal from '@/hooks/useGlobal'

export const useZapIn = () => {
  const { routeType } = useGlobal()

  const { contract: MultiPathConverterContract } =
    useMultiPathConverterContract()

  const getConvertParams = async (
    fromAddress,
    toAddress,
    amountIn,
    minConvertOutAmount = 0
  ) => {
    if (fromAddress == config.zeroAddress) {
      return [fromAddress, amountIn, toAddress, '0x', minConvertOutAmount]
    }

    const routerData = getFXUSDRouterByAddress(fromAddress, toAddress)
    if (!routerData.length) {
      return false
    }
    const _ConvertData = await MultiPathConverterContract.methods
      .convert(fromAddress, amountIn, routerData[3], routerData[2])
      .encodeABI()

    return [
      fromAddress,
      amountIn,
      config.contracts.MultiPathConverter,
      _ConvertData,
      minConvertOutAmount,
    ]
  }

  const getZapInParams = ({
    from,
    to,
    amount,
    minOut = 0,
    contract = config.contracts.fxUSD_GatewayRouter,
    slippage,
  }) => {
    let is1Inch = routeType === '1inch'
    switch (from) {
      case 'ETH':
        is1Inch = to !== 'wstETH'
        break
      case 'stETH':
        is1Inch = to !== 'wstETH'
        break
      // case 'Frax':
      //   is1Inch = true
      //   break
      // case 'crvUSD':
      //   is1Inch = true
      //   break
      case 'frxETH':
        is1Inch = to !== 'sfrxETH'
        break

      default:
        break
    }
    if (is1Inch) {
      return get1InchData(
        zapTokens[from].address,
        zapTokens[to].address,
        amount,
        contract,
        slippage,
        minOut
      )
    }
    return getConvertParams(
      zapTokens[from].address,
      zapTokens[to].address,
      amount,
      minOut
    )
  }

  return { getZapInParams }
}

export const getZapOutParams = (fromAddress, toAddress, minOut = 0) => {
  if (fromAddress === toAddress) {
    return [config.contracts.redeemConverter, minOut, []]
  }
  const routerData = getFXUSDRouterByAddress(fromAddress, toAddress)
  if (!routerData.length) {
    return false
  }
  return [config.contracts.redeemConverter, minOut, routerData[2]]
}
