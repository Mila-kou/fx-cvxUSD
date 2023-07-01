import moment from 'moment'

export const WEEK = 86400 * 7
export const YEARS = 86400 * 365

// align Thursday
export const calc4 = (m, isTimestamp = false) => {
  const params = m.clone()
  const unlock_time = Math.floor(params.unix() / WEEK) * WEEK

  return isTimestamp ? unlock_time : moment(unlock_time * 1000)
}

export const shortDate = [
  {
    lable: '4 years',
    value: 1460,
  },
  {
    lable: '1 year',
    value: 365,
  },
  {
    lable: '6 months',
    value: 180,
  },
  {
    lable: '3 months',
    value: 90,
  },
  {
    lable: '1 month',
    value: 30,
  },
  {
    lable: '1 week',
    value: 7,
  },
]
