import axios from 'axios'
import config from '../config'

// const INCH_HOST =
//   process.env.NODE_ENV === 'production'
//     ? 'https://api.1inch.dev/swap/v5.2/1'
//     : '/INCH_HOST'
const INCH_HOST = '/INCH_HOST'

export const get1inchParams = (params) => {
  // for test
  // const testParams = {
  //   src: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  //   dst: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84',
  //   amount: '100000000000000000',
  //   from: '0xf3e0974a5fecfe4173e454993406243b2188eeed',
  //   slippage: 1,
  //   disableEstimate: true,
  //   allowPartialFill: false,
  // }
  // params = testParams

  return axios.get(`${INCH_HOST}/swap`, {
    headers: {
      // Authorization: 'Bearer jKzO36s1w1XN7DeRYOByvKfFTfvMV9A5',
      Authorization: 'Bearer ViaMsaZ3WcPtcakj34tWvI8gqkYyOFXS',
      'Cache-Control': 'no-cache',

      accept: 'application/json',
    },
    params,
  })
}

export const get1InchData = async (
  fromAddress,
  toAddress,
  amountIn,
  fxUSD_GatewayRouter,
  slippage,
  minConvertOutAmount = 0
) => {
  console.log(
    'fromAddress--toAddress--',
    fromAddress,
    toAddress,
    amountIn,
    fxUSD_GatewayRouter
  )

  const { data } = await get1inchParams({
    src:
      fromAddress == config.zeroAddress
        ? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
        : fromAddress,
    dst: toAddress,
    amount: amountIn,
    from: fxUSD_GatewayRouter,
    slippage,
    disableEstimate: true,
    allowPartialFill: false,
  })

  console.log('fromAddress--toAddress-res------', data)

  if (!data) return null

  const { tx } = data

  return [fromAddress, amountIn, tx.to, tx.data, minConvertOutAmount]
}
