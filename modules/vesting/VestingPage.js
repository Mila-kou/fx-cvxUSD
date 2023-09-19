import React, { useState } from 'react'
import cn from 'classnames'
import Button from '@/components/Button'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import useVesting from './hook/useVesting'
import { useFXNVesting } from '@/hooks/useContracts'
import useWeb3 from '@/hooks/useWeb3'
import useGlobal from '@/hooks/useGlobal'
import styles from './styles.module.scss'

function InfoItem({ title, value, unit }) {
  return (
    <div className="my-2">
      {title}: <span className="text-[var(--blue-color)]">{value}</span> {unit}
    </div>
  )
}

export default function VestingPage() {
  const { theme } = useGlobal()
  const { currentAccount } = useWeb3()
  const [claiming, setClaiming] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const {
    canClaim,
    canClaimText,
    totalClaimAble,
    notYetVestedText,
    newList,
    startTime,
    startTimeText,
    latestTime,
    latestTimeText,
  } = useVesting(refreshTrigger)
  const { contract: vestContract } = useFXNVesting()

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

  const itemData = [
    {
      title: 'Total No of FXN Tokens',
      value: totalClaimAble,
    },
    {
      title: 'Claimable',
      value: canClaimText,
    },
    {
      title: 'Not Yet Vested',
      value: notYetVestedText,
    },
    {
      title: 'Claimed Amount',
      value: totalClaimAble,
    },
  ]

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2>Claim FXN Tokens</h2>
          <div className={styles.items}>
            {itemData.map((item) => (
              <div className={styles.item} key={item.title}>
                <p>{item.title}</p>
                <h2>{item.value}</h2>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-10 items-center">
            <div className="">
              {!!startTime && (
                <InfoItem title="Start Time" value={`${startTimeText}`} />
              )}
              {!!latestTime && (
                <InfoItem title="End Time" value={`${latestTimeText}`} />
              )}
            </div>
            {!!(canClaim * 1) && (
              <div className="flex justify-center">
                <Button width="200px" onClick={handleClaim} loading={claiming}>
                  Claim
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-[var(--background-color)] mt-8 p-[56px] rounded-[10px]">
        <table
          className={cn(
            'border-collapse border mx-auto',
            theme === 'blue' ? 'text-white' : 'text-[#231f20]'
          )}
        >
          <thead>
            <th className={cn('border py-4 px-12')}>Start Date</th>
            <th className={cn('border py-4 px-12')}>End Date</th>
            <th className={cn('border py-4 px-12')}>Total Tokens</th>
            <th className={cn('border py-4 px-12')}>% Vested</th>
          </thead>
          <tbody>
            {newList && newList.length ? (
              newList.map((item) => {
                return (
                  <tr>
                    <td className={cn('border py-4 px-12')}>
                      {item.startTime}
                    </td>
                    <td className={cn('border py-4 px-12')}>{item.endTime}</td>
                    <td className={cn('border py-4 px-12 text-center')}>
                      {item.vestingAmount} FXN
                    </td>
                    <td className={cn('border py-4 px-12 text-center')}>
                      {item.vestingAmountPercent}
                    </td>
                  </tr>
                )
              })
            ) : (
              <div className="p-[10px]">No record</div>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
