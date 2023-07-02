import moment from 'moment'

export const WEEK = 86400 * 7
export const YEARS = 86400 * 365
export const FOURYEARS = 365 * 4

// align Thursday
export const calc4 = (m) => {
  const params = m.clone()
  const unlock_time = Math.floor(params.unix() / WEEK) * WEEK
  return moment(unlock_time * 1000)
    .startOf('day')
    .add(8, 'hours')
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
