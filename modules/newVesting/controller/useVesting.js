import { useEffect, useState } from 'react'
import { cBN, fb4, checkNotZoroNum, checkNotZoroNumOption } from 'utils'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import useVestingData from '../hook/useVestingData_manageable'
import useWeb3 from '@/hooks/useWeb3'
import { useFX_ManageableVesting } from '@/hooks/useContracts'

const useVesting = (refreshTrigger) => {
  const { current, currentAccount } = useWeb3()
  const { canClaim, userVest, vestedData, convexRewards, statkeDaoRewards } =
    useVestingData(refreshTrigger)
  const { contract: ManageableVestingContract } = useFX_ManageableVesting()

  const [data, setData] = useState({
    canClaim: 0,
    // claimable: 0,
    claimedAmount: 0,
    totalClaimAble: 0,
    latestTime: 0,
    latestTimeText: '',
  })

  const getVestingInfo = () => {
    // const { cancleTime, claimedAmount, endTime, startTime, vestingAmount } = vestedData;
    let startTime = 0
    let latestTime = 0
    let claimedAmountInWei = cBN(0)
    let totalClaimAbleInWei = cBN(0)
    let hasCVXFXN = false
    let hasSDFXN = false
    const newList = []
    if (userVest.length) {
      userVest.forEach((item) => {
        const _newItem = {
          ...item,
        }
        if (item.managerIndex * 1 == 1) {
          hasCVXFXN = true
        }
        if (item.managerIndex * 1 == 2) {
          hasSDFXN = true
        }
        const {
          cancleTime,
          claimedAmount: _claimedAmount,
          endTime: _endTime,
          startTime: _startTime,
          vestingAmount: _vestingAmount,
        } = item
        if (latestTime == 0 || _endTime * 1 > latestTime * 1) {
          if (!checkNotZoroNum(cancleTime)) {
            latestTime = _endTime
          }
        }
        if (startTime == 0 || _startTime * 1 < startTime * 1) {
          if (!checkNotZoroNum(cancleTime)) {
            startTime = _startTime
          }
        }
        if (!checkNotZoroNum(cancleTime)) {
          totalClaimAbleInWei = totalClaimAbleInWei.plus(_vestingAmount)
        } else {
          totalClaimAbleInWei = totalClaimAbleInWei.plus(_claimedAmount)
        }
        claimedAmountInWei = claimedAmountInWei.plus(_claimedAmount)
        _newItem.startTime = new Date(_startTime * 1000).toLocaleString()
        _newItem.endTime = new Date(_endTime * 1000).toLocaleString()
        _newItem.vestingAmount = checkNotZoroNumOption(
          _vestingAmount,
          fb4(_vestingAmount)
        )
        const _percent =
          ((current.valueOf() - _startTime * 1000) /
            (_endTime * 1000 - _startTime * 1000)) *
          100
        _newItem.vestingAmountPercent =
          _percent >= 100
            ? `100%`
            : `${_percent <= 0 ? '0.00' : _percent.toFixed(2)}%`
        newList.push(_newItem)
      })
    }
    // const claimable = claimableInWei.shiftedBy(-18).toString(10)
    const claimedAmount = fb4(cBN(claimedAmountInWei).toString(10), false, 18)
    const totalClaimAble = fb4(cBN(totalClaimAbleInWei).toString(10), false, 18)
    const notYetVested = cBN(totalClaimAbleInWei)
      .minus(canClaim)
      .minus(claimedAmountInWei)
    const notYetVestedText = checkNotZoroNumOption(
      notYetVested,
      fb4(notYetVested)
    )
    // const startTimeText = startTime != 0 ? moment(startTime * 1000).format('LLLL') : 0
    // const latestTimeText = latestTime != 0 ? moment(latestTime * 1000).format('LLLL') : 0
    const startTimeText =
      startTime != 0 ? new Date(startTime * 1000).toLocaleString() : 0
    const latestTimeText =
      latestTime != 0 ? new Date(latestTime * 1000).toLocaleString() : 0
    const canClaimText = fb4(cBN(canClaim).toString(10), false, 18)
    setData((pre) => {
      return {
        ...pre,
        canClaim,
        canClaimText,
        claimedAmount,
        claimedAmountInWei,
        totalClaimAbleInWei,
        totalClaimAble,
        notYetVested,
        notYetVestedText,
        newList,
        latestTime,
        startTime,
        latestTimeText,
        startTimeText,
        convexRewards,
        statkeDaoRewards,
        hasCVXFXN,
        hasSDFXN,
      }
    })
  }

  const handleClaim = async (_index, loadingFn, setRefreshTriggerFn) => {
    try {
      loadingFn(true)
      let apiCall = ManageableVestingContract.methods.claim()
      if (_index) {
        apiCall = ManageableVestingContract.methods.claim(2)
      }

      const estimatedGas = await apiCall.estimateGas({
        from: currentAccount,
      })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(() => apiCall.send({ from: currentAccount, gas }), {
        key: 'Claim',
        action: 'Claim',
      })
      loadingFn(false)
      setRefreshTriggerFn((prev) => prev + 1)
    } catch (error) {
      loadingFn(false)
      noPayableErrorAction(`error_Claim`, error)
    }
  }

  const handleClaimReward = async (_index, loadingFn, setRefreshTriggerFn) => {
    const __index = _index
    try {
      loadingFn(true)
      const apiCall = ManageableVestingContract.methods.getReward(
        __index,
        currentAccount
      )
      const estimatedGas = await apiCall.estimateGas({
        from: currentAccount,
      })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(() => apiCall.send({ from: currentAccount, gas }), {
        key: 'ClaimReward',
        action: 'ClaimReward',
      })
      loadingFn(false)
      setRefreshTriggerFn((prev) => prev + 1)
    } catch (error) {
      loadingFn(false)
      noPayableErrorAction(`error_ClaimReward`, error)
    }
  }

  useEffect(() => {
    if (userVest && vestedData) {
      getVestingInfo()
    }
  }, [userVest, vestedData])

  return {
    ...data,
    handleClaim,
    handleClaimReward,
  }
}

export default useVesting
