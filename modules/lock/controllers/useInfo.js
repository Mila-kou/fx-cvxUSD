import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { cBN, checkNotZoroNum, fb4, numberLess } from 'utils'
import moment from 'moment'
import useData from '../hook/useData'
import { calc4 } from '../util'
import useWeb3 from '@/hooks/useWeb3'

const useInfo = (refreshTrigger) => {
  const { tokens } = useSelector((state) => state.token)
  const wstETHPrice = tokens.wstETH.price
  const fxnPrice = tokens.FXN.price
  const sfrxETHPrice = tokens.sfrxETH.price
  const { info, contract } = useData(refreshTrigger)
  const { current, currentAccount } = useWeb3()

  const platformFeeSpliterStETH_rewardRate = 0.75
  const [pageData, setPageData] = useState({
    overview: [
      {
        title: 'APR',
        value: '-',
      },
      {
        title: 'FXN Locked',
        value: '-',
      },
      {
        title: 'Total veFXN',
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
        title: 'stETH Rewards',
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
  const getSfrxETHToWstETHNum = useCallback(
    (sfrxETHNum) => {
      if (checkNotZoroNum(sfrxETHNum) && checkNotZoroNum(wstETHPrice)) {
        const _wstETHNum = cBN(sfrxETHNum).times(sfrxETHPrice).div(wstETHPrice)
        return _wstETHNum
      }
      return 0
    },
    [sfrxETHPrice, wstETHPrice]
  )
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
      platformFeeSpliterStETH,
      PlatformFeeBurnerStETH,
      platformFeeSpliterSfrxETH,
      PlatformFeeBurnerSfrxETH,
      platformFeeSpliterwstETH,
      PlatformFeeBurnerwstETH,
      platformFeeSpliterweETH,
      PlatformFeeBurnerweETH,
      veFXNFeeTokenLastBalance,
      stETHTowstETHRate,
      weETHToeETHRate,
    } = info
    const _tokensPerWeek = tokensPerWeek
    // const ___tokensPerWeek = cBN(3.207).times(1e18).toFixed(0)
    const apr =
      ((_tokensPerWeek * 52 * wstETHPrice) / (veTotalSupply * fxnPrice)) * 100
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

    const _PlatformFeeSfrxETHToWstETHNum = getSfrxETHToWstETHNum(
      platformFeeSpliterSfrxETH
    )
    // console.log(
    //   '_PlatformFeeSfrxETHToWstETHNum---',
    //   _PlatformFeeSfrxETHToWstETHNum.toString(10)
    // )
    const _weekAmount = cBN(tokensThisWeek)
      .plus(
        cBN(platformFeeSpliterStETH)
          .times(platformFeeSpliterStETH_rewardRate)
          .div(cBN(stETHTowstETHRate).div(1e18)) // to wstETH
      )
      .plus(
        cBN(PlatformFeeBurnerStETH)
          .times(platformFeeSpliterStETH_rewardRate)
          .div(cBN(stETHTowstETHRate).div(1e18)) // to wstETH
      )
      .plus(
        cBN(_PlatformFeeSfrxETHToWstETHNum).times(
          platformFeeSpliterStETH_rewardRate
        )
      )
      .plus(
        cBN(PlatformFeeBurnerSfrxETH).times(platformFeeSpliterStETH_rewardRate)
      )
      .plus(
        cBN(platformFeeSpliterwstETH).times(platformFeeSpliterStETH_rewardRate)
      )
      .plus(
        cBN(PlatformFeeBurnerwstETH).times(platformFeeSpliterStETH_rewardRate)
      )
      .plus(
        cBN(platformFeeSpliterweETH)
          .times(weETHToeETHRate)
          .div(1e18)
          .times(platformFeeSpliterStETH_rewardRate)
      )
      .plus(
        cBN(PlatformFeeBurnerweETH)
          .times(weETHToeETHRate)
          .div(1e18)
          .times(platformFeeSpliterStETH_rewardRate)
      )
      .minus(veFXNFeeTokenLastBalance)
      .plus(feeBalance)

    setPageData((prev) => ({
      ...prev,
      overview: [
        {
          title: 'APR',
          value: checkNotZoroNum(apr) ? `${apr.toFixed(2)}%` : '-',
        },
        {
          title: 'FXN Locked',
          value: fb4(veLockedFXN),
          desc: `${
            checkNotZoroNum(percentage) ? `${percentage}%` : '-'
          } of FXN Circulating Supply`,
        },
        {
          title: 'Total veFXN',
          value: fb4(veTotalSupply),
          desc: `${avgTime()} Average Lock`,
        },
      ],
      status,
      contractInfo: info,
      weekReabte: {
        weekAmount: _weekAmount,
        weekVal: _weekAmount.multipliedBy(wstETHPrice),
        untilTime: moment(
          calc4(current, true) * 1000 + (86400 * 7 - 1) * 1000
        ).format('lll'),
        startTime: moment(calc4(current, true) * 1000).format('lll'),
      },
      preWeekReabte: {
        weekAmount: cBN(_tokensPerWeek),
        weekVal: cBN(_tokensPerWeek).multipliedBy(wstETHPrice),
      },
      userData: [
        {
          title: 'Your Locked',
          value: `${fb4(amount)} FXN`,
        },
        {
          title: 'Your Share',
          value: `${fb4(userVeShare)} veFXN`,
        },
        {
          title: 'Locked to',
          value:
            end != 0 && end != undefined
              ? moment(end * 1000).format('lll')
              : '-',
        },
        {
          title: 'wstETH Rewards',
          amount: userVeRewards,
          value: (
            <>
              <p>{numberLess(fb4(userVeRewards), 0.01)} wstETH</p>
              {checkNotZoroNum(userVeRewards1) && (
                <p>{numberLess(fb4(userVeRewards1), 0.01)} wstETH</p>
              )}
              {checkNotZoroNum(userVeRewards2) && (
                <p>{numberLess(fb4(userVeRewards2), 0.01)} wstETH</p>
              )}
              {checkNotZoroNum(userVeRewards3) && (
                <p>{numberLess(fb4(userVeRewards3), 0.01)} wstETH</p>
              )}
              {checkNotZoroNum(userVeRewards4) && (
                <p>{numberLess(fb4(userVeRewards4), 0.01)} wstETH</p>
              )}
            </>
          ),
        },
      ],
    }))
  }, [info, current])

  useEffect(() => {
    if (!currentAccount) {
      setPageData((prev) => ({
        ...prev,
        status: 'no-lock',
        userData: [
          {
            title: 'Your Locked',
            value: `- FXN`,
          },
          {
            title: 'Your Share',
            value: `-veFXN`,
          },
          {
            title: 'Locked to',
            value: '-',
          },
          {
            title: 'stETH Rewards',
            amount: 0,
            value: ` stETH`,
          },
        ],
      }))
    }
  }, [currentAccount])

  return pageData
}

export default useInfo
