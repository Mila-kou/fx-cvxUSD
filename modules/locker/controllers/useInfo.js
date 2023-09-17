import { useEffect, useState } from 'react'
import { cBN, checkNotZoroNum, fb4 } from 'utils'
import moment from 'moment'
import useData from '../hook/useLockData'
import { calc4 } from '../util'
import useGlobal from '@/hooks/useGlobal'
import useWeb3 from '@/hooks/useWeb3'

const useInfo = (refreshTrigger) => {
  const { global } = useGlobal()
  const { initDataInfo: initData, tokenPrice } = global
  const cvxPrice = tokenPrice['convex-finance']?.usd ?? 0
  const { info, contract } = useData(refreshTrigger)
  const { current, currentAccount } = useWeb3()

  const rewardRate = 0.5
  const [pageData, setPageData] = useState({
    overview: [
      {
        title: 'APR',
        value: '-',
      },
      {
        title: 'CTR Locked',
        value: '-',
      },
      {
        title: 'Total veCTR',
        value: '-',
        desc: '- average lock',
      },
    ],
    status: 'no-lock',
    userData: [
      {
        title: 'Your Locked',
        value: '0',
      },
      {
        title: 'Your Share',
        value: '0',
      },
      {
        title: 'Locked to',
        value: '0',
      },
      {
        title: 'aCRV Rewards',
        amount: 0,
        value: '0',
      },
    ],
    weekReabte: {
      weekAmount: '-',
      untilTime: '-',
    },
    preWeekReabte: {
      weekAmount: '-',
      untilTime: '-',
    },
    contract,
    contractInfo: info,
  })

  useEffect(() => {
    const {
      feeBalance,
      tokensThisWeek,
      tokensPerWeek,
      veTotalSupply,
      veLockedFXN,
      fxnCirculationSupply,
      userLocked,
      userVeShare,
      userVeRewards,
      userVeRewards1,
      userVeRewards2,
      userVeRewards3,
      userVeRewards4,
      veFXNFeeStEth,
      veFXNFeeTokenLastBalance,
    } = info
    const _tokensPerWeek = tokensPerWeek
    const apr =
      ((_tokensPerWeek * 52 * cvxPrice) / (veTotalSupply * cvxPrice)) * 100
    const percentage = cBN(veLockedFXN)
      .div(fxnCirculationSupply)
      .multipliedBy(100)
      .toFixed(2)
    const avgTime = () => {
      const years = cBN(veLockedFXN).isZero()
        ? 0
        : cBN(4).multipliedBy(veTotalSupply).div(veLockedFXN)
      if (!years) {
        return '-'
      }

      if (years.isGreaterThan(1)) {
        return `${years.toFixed(2)} Years`
      }
      if (years.isGreaterThan(cBN(1).div(12))) {
        return `${years.multipliedBy(12).toFixed(2)} Months`
      }

      return `${years.multipliedBy(365).toFixed(2)} Days`
    }
    const { amount, end } = userLocked
    let status = ''
    if (veLockedFXN) {
      status = 'no-lock'

      if (end != 0 && end != undefined) {
        status = 'ing'
        if (moment(end * 1000).isBefore(moment())) {
          status = 'expired'
        }
      }
    }

    setPageData((prev) => ({
      ...prev,
      overview: [
        {
          title: 'APR',
          value: apr ? `${apr.toFixed(2)}%` : '-',
        },
        {
          title: 'CTR Locked',
          value: fb4(veLockedFXN),
          desc: `${
            checkNotZoroNum(percentage) ? `${percentage}%` : '-'
          } of CTR Circulating Supply`,
        },
        {
          title: 'Total veCTR',
          value: fb4(veTotalSupply),
          desc: `${avgTime()} Average Lock`,
        },
      ],
      status,
      contractInfo: info,
      weekReabte: {
        weekAmount: cBN(tokensThisWeek)
          .plus(veFXNFeeStEth)
          .minus(veFXNFeeTokenLastBalance)
          .plus(cBN(feeBalance).times(rewardRate)),
        weekVal: cBN(tokensThisWeek)
          .plus(veFXNFeeStEth)
          .minus(veFXNFeeTokenLastBalance)
          .plus(cBN(feeBalance).times(rewardRate))
          .multipliedBy(initData?.initDataInfo?.acrvPrice ?? 1),
        untilTime: moment(
          calc4(current, true) * 1000 + (86400 * 7 - 1) * 1000
        ).format('lll'),
        startTime: moment(calc4(current, true) * 1000).format('lll'),
      },
      preWeekReabte: {
        weekAmount: cBN(_tokensPerWeek),
        weekVal: cBN(_tokensPerWeek).multipliedBy(
          initData?.initDataInfo?.acrvPrice ?? 1
        ),
      },
      userData: [
        {
          title: 'Your Locked',
          value: `${fb4(amount)} CTR`,
        },
        {
          title: 'Your Share',
          value: `${fb4(userVeShare)} veCTR`,
        },
        {
          title: 'Locked to',
          value:
            end != 0 && end != undefined
              ? moment(end * 1000).format('lll')
              : '-',
        },
        {
          title: 'aCRV Rewards',
          amount: userVeRewards,
          value: (
            <>
              <p>{fb4(userVeRewards)} aCRV</p>
              {checkNotZoroNum(userVeRewards1) && (
                <p>{fb4(userVeRewards1)} aCRV</p>
              )}
              {checkNotZoroNum(userVeRewards2) && (
                <p>{fb4(userVeRewards2)} aCRV</p>
              )}
              {checkNotZoroNum(userVeRewards3) && (
                <p>{fb4(userVeRewards3)} aCRV</p>
              )}
              {checkNotZoroNum(userVeRewards4) && (
                <p>{fb4(userVeRewards4)} aCRV</p>
              )}
            </>
          ),
        },
      ],
    }))
  }, [info, initData, current])

  useEffect(() => {
    if (!currentAccount) {
      setPageData((prev) => ({
        ...prev,
        status: 'no-lock',
        userData: [
          {
            title: 'Your Locked',
            value: `- CTR`,
          },
          {
            title: 'Your Share',
            value: `-veCTR`,
          },
          {
            title: 'Locked to',
            value: '-',
          },
          {
            title: 'aCRV Rewards',
            amount: 0,
            value: ` aCRV`,
          },
        ],
      }))
    }
  }, [currentAccount])

  return pageData
}

export default useInfo
