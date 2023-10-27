import React, { useMemo, useState } from 'react'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import useVesting from '../controller/useVesting'
import { useFXNVesting, useFX_ManageableVesting } from '@/hooks/useContracts'
import useWeb3 from '@/hooks/useWeb3'
import Cell from './Cell'
import ConvertModal from './ConvertModal'

export default function FXN() {
  const { currentAccount } = useWeb3()
  const [claiming, setClaiming] = useState(false)
  const [showConvert, setShowConvert] = useState(false)
  const [converting, setConverting] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const {
    canClaim,
    canClaimText,
    getBatchsInfo,
    newList_fx,
    handleClaim: handleClaimFn,
  } = useVesting(refreshTrigger)

  const {
    startTime,
    latestTime,
    claimedAmountInWei,
    totalClaimAbleInWei,
    claimedAmount,
    totalClaimAble,
    notYetVested,
    notYetVestedText,
    startTimeText,
    latestTimeText,
  } = useMemo(() => {
    return getBatchsInfo(newList_fx, '0')
  }, [newList_fx])

  const { contract: ManageableVestingContract } = useFX_ManageableVesting()

  const handleClaim = async () => {
    const _index = 0
    handleClaimFn(_index, setClaiming, setRefreshTrigger)
  }

  const handleConvert = async (_index, _indices) => {
    setConverting(true)
    const __indices = _indices
    const __index = _index
    try {
      // setClaiming(true)
      const apiCall = ManageableVestingContract.methods.manage(
        __indices,
        __index
      )
      const estimatedGas = await apiCall.estimateGas({
        from: currentAccount,
      })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(() => apiCall.send({ from: currentAccount, gas }), {
        key: 'Manage',
        action: 'Manage',
      })
      setClaiming(false)
      setRefreshTrigger((prev) => prev + 1)
    } catch (error) {
      setClaiming(false)
      noPayableErrorAction(`error_Manage`, error)
      setConverting(false)
    }
  }

  const data = {
    canClaim,
    claiming,
    handleClaim,

    onConvert: () => {
      setShowConvert(true)
    },
    converting,

    totalClaimAble,
    canClaimText,
    notYetVestedText,
    claimedAmount,

    startTime,
    startTimeText,
    latestTime,
    latestTimeText,

    symbol: 'FXN',
  }

  return (
    <>
      <Cell {...data} title="Vesting FXN Tokens" />
      {showConvert ? (
        <ConvertModal
          onCancel={() => setShowConvert(false)}
          converting={converting}
          handleConvert={handleConvert}
        />
      ) : null}
    </>
  )
}
