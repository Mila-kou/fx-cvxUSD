import { useMultiPathConverterContract } from '@/hooks/useContracts'
import { getFXUSDRouterByAddress } from '@/config/fxUSDRouter'
import config from '@/config/index'
import { zapTokens } from '@/config/tokens'
import { get1InchData } from '@/services/inch'

export const ROUTE_TYPE = {
  FX_ROUTE: 'fx route',
  INCH: '1inch',
  CURVE: 'curve',
}

export const useZapIn = () => {
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
    routeType,
  }) => {
    // let is1Inch = routeType === ROUTE_TYPE.INCH
    // switch (from) {
    //   case 'ETH':
    //     is1Inch = true
    //     break
    //   case 'stETH':
    //     is1Inch = true
    //     break
    //   case 'WETH':
    //     is1Inch = true
    //     break
    //   case 'frxETH':
    //     is1Inch = to !== 'sfrxETH'
    //     break

    //   default:
    //     break
    // }
    if (routeType === ROUTE_TYPE.INCH) {
      return get1InchData(
        zapTokens[from].address,
        zapTokens[to].address,
        amount,
        contract,
        slippage,
        minOut
      )
    }
    if (routeType === ROUTE_TYPE.CURVE) {
      return {
        amount,
        slippage,
        routeType,
      }
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
