import React, { useState } from 'react'
import cn from 'classnames'
import Button from '@/components/Button'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import useVesting from './hook/useVesting'
import { useAladdinClevVest } from '@/hooks/useContracts'
import useWeb3 from '@/hooks/useWeb3'
import useGlobal from '@/hooks/useGlobal'

export default function VestingPage() {
  const { theme } = useGlobal()
  const { currentAccount } = useWeb3()
  const [claiming, setClaiming] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const {
    canClaim,
    canClaimText,
    claimedAmount,
    totalClaimAble,
    notYetVestedText,
    newList,
    startTime,
    startTimeText,
    latestTime,
    latestTimeText,
  } = useVesting(refreshTrigger)
  const { contract: vestContract } = useAladdinClevVest()

  const handleClaim = async () => {
    try {
      setClaiming(true)
      const apiCall = vestContract.methods.claim()
      const estimatedGas = await apiCall.estimateGas({
        from: currentAccount,
      })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(() => apiCall.send({ from: currentAccount, gas }), {
        key: 'Claim',
        action: 'Claim',
      })
      setClaiming(false)
      setRefreshTrigger((prev) => prev + 1)
    } catch (error) {
      setClaiming(false)
      noPayableErrorAction(`error_earn_approve`, error)
    }
  }

  function InfoItem({ title, value, unit }) {
    return (
      <div className="my-2">
        {title}:{' '}
        <span className={cn(theme === 'blue' ? 'text-red' : 'text-white')}>
          {value}
        </span>{' '}
        {unit}
      </div>
    )
  }

  return (
    <div className="container text-center text-lg md:text-xl">
      <div className="mt-32 mb-16 text-[36px]">
        FNX Token Offering participants can be claimed
      </div>
      <div className="mb-12">
        <div
          className={cn(
            'mb-4 font-bold',
            theme === 'blue' ? 'text-red' : 'text-white'
          )}
        >
          Your Vesting
        </div>
        <InfoItem
          title="Total of Your Airdrop"
          value={`${totalClaimAble}`}
          unit="FNX"
        />
        <InfoItem title="Claimable" value={`${canClaimText}`} unit="FNX" />
        <InfoItem
          title="Not Yet Vested"
          value={`${notYetVestedText}`}
          unit="FNX"
        />
        <InfoItem title="Claimed" value={`${claimedAmount}`} unit="FNX" />
        {!!startTime && (
          <InfoItem title="Start Time" value={`${startTimeText}`} />
        )}
        {!!latestTime && (
          <InfoItem title="End Time" value={`${latestTimeText}`} />
        )}
      </div>

      {!!(newList && newList.length) && (
        <table className={cn('border-collapse border mx-auto', 'text-white')}>
          <thead>
            <th className={cn('border p-4')}>Start Date</th>
            <th className={cn('border p-4')}>End Date</th>
            <th className={cn('border p-4')}>Total Tokens</th>
            <th className={cn('border p-4')}>% Vested</th>
          </thead>
          <tbody>
            {newList.map((item) => {
              return (
                <tr>
                  <td className={cn('border p-4')}>{item.startTime}</td>
                  <td className={cn('border p-4')}>{item.endTime}</td>
                  <td className={cn('border p-4')}>{item.vestingAmount} FNX</td>
                  <td className={cn('border p-4')}>
                    {item.vestingAmountPercent}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
      <br />
      <br />
      {!!(canClaim * 1) && (
        <div className="flex justify-center">
          <Button
            className="w-64"
            onClick={handleClaim}
            loading={claiming}
            theme="lightBlue"
          >
            Claim
          </Button>
        </div>
      )}
      <br />
    </div>
  )
}
