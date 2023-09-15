import { useEffect, useState } from 'react'
import moment from 'moment'
import { checkNotZoroNum, cBN, fb4 } from '@/utils/index'
import useLockData from './useLockData'
import useGlobal from '@/hooks/useGlobal'
import useWeb3 from '@/hooks/useWeb3'
import { calc4 } from '../util'

const calcThisWeekAmount = (info, current, cvxPrice, fraxPrice) => {
  const {
    tokensPerWeekForCVX,
    tokensPerWeekForFRAX,
    tokensThisWeekForCVX,
    tokensThisWeekForFRAX,
    cvxFeeTokenLastBalance,
    fraxFeeTokenLastBalance,
    cvxRewardRate,
    fraxRewardRate,
    feeDistributorCVXBalance,
    platformFeeDistributorCVXBalance,
    feeDistributorFRAXBalance,
    platformFeeDistributorFRAXBalance,
  } = info

  const cvxWeekAmount = cBN(tokensThisWeekForCVX)
    .plus(feeDistributorCVXBalance)
    .minus(cvxFeeTokenLastBalance)
    .plus(cBN(platformFeeDistributorCVXBalance).times(cvxRewardRate))
  const fraxWeekAmount = cBN(tokensThisWeekForFRAX)
    .plus(feeDistributorFRAXBalance)
    .minus(fraxFeeTokenLastBalance)
    .plus(cBN(platformFeeDistributorFRAXBalance).times(fraxRewardRate))

  return {
    cvxWeekAmount,
    fraxWeekAmount,
    lastCvxWeekAmount: tokensPerWeekForCVX,
    lastFraxWeekAmount: tokensPerWeekForFRAX,
    cvxRewardRate,
    fraxRewardRate,
    cvxPrice,
    fraxPrice,
    untilTime: moment(calc4(current) + (86400 * 7 - 1) * 1000).format('lll'),
    startTime: moment(calc4(current)).format('lll'),
  }
}

// controller
const useInfo = () => {
  const { info, contracts } = useLockData()
  const { current: currentTime } = useWeb3()
  const { tokenPrice } = useGlobal()
  const cvxPrice = tokenPrice?.['convex-finance']?.usd ?? 0
  const fraxPrice = tokenPrice?.frax?.usd ?? 0
  const clevPrice = tokenPrice?.CLEV?.usd ?? 0

  const [pageData, setPageData] = useState({
    dashboard: {
      info: [
        {
          title: 'Locking APR',
          value: '0',
        },
        {
          title: 'FXN Locked',
          value: '0',
          desc: '20% of FXN Supply',
        },
        {
          title: 'veFXN',
          value: '0',
          desc: '2.7 Years Average Lock',
        },
      ],
      chart: [],
    },
    totalInfo: {},
    status: 'no-lock',
    userData: [
      {
        title: 'Your Locked',
        value: '0',
      },
      {
        title: 'Locked Until',
        value: '0',
      },
      {
        title: 'Claimable',
        value: '0',
      },
    ],
    contracts,
    contractInfo: info,
  })

  useEffect(() => {
    const {
      veTotalSupply,
      veLockedCLEV,
      userVeShare,
      clevCirculationSupply,
      userLocked,
      tokensPerWeekForCVX,
      tokensPerWeekForFRAX,
      tokensPerTwoWeeksForCVX,
      tokensPerTwoWeeksForFRAX,
    } = info

    // const apr =
    //   ((tokensPerWeekForCVX * 52 * cvxPrice +
    //     tokensPerWeekForFRAX * 52 * fraxPrice) /
    //     (veTotalSupply * clevPrice)) *
    //   100
    const _weekCVXNum = cBN(tokensPerWeekForCVX).plus(tokensPerTwoWeeksForCVX)
    const _weekFraxNum = cBN(tokensPerWeekForFRAX).plus(
      tokensPerTwoWeeksForFRAX
    )
    const apr = cBN(_weekCVXNum)
      .multipliedBy(52 / 2)
      .multipliedBy(cvxPrice)
      .plus(
        cBN(_weekFraxNum)
          .multipliedBy(52 / 2)
          .multipliedBy(fraxPrice)
      )
      .div(cBN(veTotalSupply).multipliedBy(clevPrice))
      .multipliedBy(100)

    const totalInfo = calcThisWeekAmount(info, currentTime, cvxPrice, fraxPrice)
    const percentage = cBN(veLockedCLEV)
      .div(clevCirculationSupply)
      .multipliedBy(100)
      .toFixed(2)
    const avgTime = () => {
      const years = cBN(veLockedCLEV).isZero()
        ? 0
        : cBN(4).multipliedBy(veTotalSupply).div(veLockedCLEV)
      if (!years) {
        return '-'
      }

      if (years.isGreaterThan(1)) {
        return `${years.toFixed(2)} Years`
      }
      if (years.isGreaterThan(cBN(1).div(12))) {
        return `${years.multipliedBy(12).toFixed(2)} Months`
      }

      if (years.isZero() || years.isNaN()) {
        return '-'
      }
      return `${years.multipliedBy(365).toFixed(2)} Days`
    }
    const { amount, end } = userLocked
    let status = ''
    if (veLockedCLEV) {
      status = 'no-lock'

      if (end != 0 && end != undefined) {
        status = 'ing'
        if (moment(end * 1000).isBefore(currentTime)) {
          status = 'expired'
        }
      }
    }

    setPageData((prev) => ({
      ...prev,
      totalInfo,
      dashboard: {
        info: [
          {
            title: 'Locking APR',
            value: '0', // apr ? `${apr.toFixed(4)}%` : '-',
          },
          {
            title: 'FXN Locked',
            value: fb4(veLockedCLEV),
            desc: `${
              checkNotZoroNum(percentage) ? `${percentage}%` : '-'
            } of FXN Supply`,
          },
          {
            title: 'veFXN',
            value: fb4(veTotalSupply),
            desc: `${avgTime()} Average Lock`,
          },
        ],
        chart: [],
      },
      contracts,
      status,
      contractInfo: info,
      userData: [
        {
          title: 'Your Locked',
          value: `${fb4(amount)} FXN`,
        },
        {
          title: 'Your Voting Power',
          value: `${fb4(userVeShare)} veFXN`,
        },
        {
          title: 'Locked Until',
          value:
            end != 0 && end != undefined
              ? moment(end * 1000).format('lll')
              : '-',
        },
      ],
    }))
  }, [info, cvxPrice, fraxPrice, clevPrice, currentTime])

  return pageData
}

export default useInfo
