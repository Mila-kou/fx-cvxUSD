import moment from 'moment'

export const WEEK = 86400 * 7
export const YEARS = 86400 * 365
export const FOURYEARS = 365 * 4

// align Thursday
export const calc4 = (m, isTimestamp = false) => {
  const params = m.clone()
  // console.log('addtime:current', params.format('lll'), params.weekday())
  // if (params.weekday() < 4) {
  //   params = params.add(4 - params.weekday(), 'day')
  // } else if (params.weekday() > 4) {
  //   params = params.add(7 - params.weekday() + 4, 'day')
  // }
  // console.log('addtime', params.format('lll'), params.weekday(), params.unix(), params.unix() % (86400 * 7))

  const unlock_time = Math.floor(params.unix() / WEEK) * WEEK
  // console.log('addtime', moment(unlock_time * 1000).format('lll'), moment(unlock_time * 1000).weekday(), moment(unlock_time * 1000).unix(), moment(unlock_time * 1000).unix() % (86400 * 7))
  return isTimestamp ? unlock_time : moment(unlock_time * 1000)
}

// next week day wedenesday
export const nextWeekWed = (m) => {
  const currentWednesday = m.clone().weekday(3).startOf('day').add(12, 'h')
  if (m.utc().isBefore(currentWednesday)) {
    return currentWednesday
  }
  const nextWeekDay = m.clone().add(1, 'week')
  const weekOfDay = nextWeekDay.format('E')
  const nextWeekWednesday = nextWeekDay.subtract(weekOfDay - 3, 'd')
  return nextWeekWednesday
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

export const tipText = `Locking CTR will receive veCTR. The longer the lock time, the more veCTR received.<br/>
1 CTR locked for 4 years = 1 veCTR<br/>
1 CTR locked for 3 years = 0.75 veCTR<br/>
1 CTR locked for 2 years = 0.5 veCTR<br/>
1 CTR locked for 1 year = 0.25 veCTR`

export const lockTimeTipText = `Locks are grouped into weekly "epochs" which start at 00:00 UTC every Thursday`
