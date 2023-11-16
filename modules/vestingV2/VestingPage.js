import React, { useState } from 'react'
import cn from 'classnames'
import useVesting from './controller/useVesting'
import useGlobal from '@/hooks/useGlobal'
import FXN from './components/FXN'
import CVXFXN from './components/CVXFXN'
import SDFXN from './components/SDFXN'
import styles from './styles.module.scss'

export default function VestingPage() {
  const { theme } = useGlobal()
  const { newList, hasCVXFXN, hasSDFXN } = useVesting()

  const getSymbol = (type) => {
    if (type * 1 == 1) {
      return 'cvxFXN'
    } else if (type * 1 == 2) {
      return 'sdFXN'
    }
    return 'FXN'
  }
  return (
    <div className={styles.container}>
      <FXN />
      {hasCVXFXN && <CVXFXN />}
      {hasSDFXN && <SDFXN />}

      <div className={styles.content}>
        <h2 className="flex gap-[6px] mb-[32px]">FXN Vesting Detail</h2>
        <table
          className={cn(
            styles.table,
            'border-collapse border mx-auto',
            theme === 'blue' ? 'text-white' : 'text-[#231f20]'
          )}
        >
          <thead>
            <th className={cn('border py-4')}>Start Date</th>
            <th className={cn('border py-4')}>End Date</th>
            <th className={cn('border py-4')}>Total Tokens</th>
            <th className={cn('border py-4')}>% Vested</th>
          </thead>
          <tbody>
            {newList && newList.length ? (
              newList.map((item) => {
                return (
                  <tr>
                    <td className={cn('border py-4 text-center')}>
                      {item.startTime_text}
                    </td>
                    <td className={cn('border py-4 text-center')}>
                      {item.endTime_text}
                    </td>
                    <td className={cn('border py-4 text-center')}>
                      {item.vestingAmount_text} {getSymbol(item.managerIndex)}
                    </td>
                    <td className={cn('border py-4 text-center')}>
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
