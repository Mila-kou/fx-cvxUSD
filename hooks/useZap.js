import { useMultiPathConverterContract } from '@/hooks/useContracts'
import { getFXUSDRouterByAddress } from '@/config/fxUSDRouter'
import config from '@/config/index'
import { zapTokens } from '@/config/tokens'
import { get1InchData } from '@/services/inch'

export const ROUTE_TYPE = {
  FX_ROUTE: 'f(x)',
  INCH: 'f(x)+1inch',
  CURVE: 'Curve',
  COWSWAP: 'Cow Swap',
}
export const ROUTE_MARKET_TYPE = [ROUTE_TYPE.CURVE, ROUTE_TYPE.COWSWAP]
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
      return [[fromAddress, amountIn, toAddress, '0x', minConvertOutAmount]]
    }

    const routerData = getFXUSDRouterByAddress(fromAddress, toAddress)
    if (!routerData.length) {
      return false
    }
    const _ConvertData = await MultiPathConverterContract.methods
      .convert(fromAddress, amountIn, routerData[3], routerData[2])
      .encodeABI()

    return [
      [
        fromAddress,
        amountIn,
        config.contracts.MultiPathConverter,
        _ConvertData,
        minConvertOutAmount,
      ],
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
      return [
        {
          amount,
          slippage,
          routeType,
        },
      ]
    }
    if (routeType === ROUTE_TYPE.COWSWAP) {
      return [
        {
          amount,
          slippage,
          routeType,
        },
      ]
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
