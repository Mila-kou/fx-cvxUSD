import axios from 'axios'

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

  return axios.get(`/INCH_HOST/swap`, {
    headers: {
      Authorization: 'Bearer ViaMsaZ3WcPtcakj34tWvI8gqkYyOFXS',
      accept: 'application/json',
    },
    params,
  })
}
