import { useEffect, useState } from 'react'
import { cBN, fb4, checkNotZoroNum, checkNotZoroNumOption } from 'utils'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import useVestingData from '../hook/useVestingData_manageable'
import useWeb3 from '@/hooks/useWeb3'
import { useFX_ManageableVesting } from '@/hooks/useContracts'

const useVesting = (refreshTrigger) => {
  const { current, currentAccount } = useWeb3()
  const {
    canClaim,
    canClaim_1,
    canClaim_2,
    userVest,
    vestedData,
    convexRewards,
    statkeDaoRewards,
    statkeDaoWstETHRewards,
    cvxFxnStakingBalances,
    sdFxnStakingBalances,
  } = useVestingData(refreshTrigger)
  console.log(
    'canClaim,canClaim_1,canClaim_2,userVest,vestedData,convexRewards,statkeDaoRewards,cvxFxnStakingBalances,sdFxnStakingBalances,',
    canClaim,
    canClaim_1,
    canClaim_2,
    userVest,
    vestedData,
    convexRewards,
    statkeDaoRewards,
    cvxFxnStakingBalances,
    sdFxnStakingBalances
  )
  const { contract: ManageableVestingContract } = useFX_ManageableVesting()

  const [data, setData] = useState({
    canClaim: 0,
    // claimable: 0,
    claimedAmount: 0,
    totalClaimAble: 0,
    latestTime: 0,
    latestTimeText: '',
  })

  const getClaimedInfo = (item) => {
    const {
      lastClaimTime,
      finishTime: _endTime,
      startTime: _startTime,
      vestingAmount: _vestingAmount,
    } = item
    let _claimedAmount = 0
    if (lastClaimTime && cBN(lastClaimTime).gt(_startTime)) {
      if (cBN(lastClaimTime).gt(_endTime)) {
        _claimedAmount = _vestingAmount
      } else {
        _claimedAmount = cBN(lastClaimTime)
          .minus(_startTime)
          .div(cBN(_endTime).minus(_startTime))
          .times(_vestingAmount)
          .toFixed(0)
      }
    }
    return _claimedAmount
  }
  const getBatchsInfo = (BatchList, type = 'all') => {
    let startTime = 0
    let latestTime = 0
    let claimedAmountInWei = cBN(0)
    let totalClaimAbleInWei = cBN(0)
    if (BatchList && BatchList.length) {
      BatchList.forEach((item) => {
        const {
          cancleTime,
          lastClaimTime,
          // endTime: _endTime,
          finishTime: _endTime,
          startTime: _startTime,
          vestingAmount: _vestingAmount,
        } = item
        const _claimedAmount = getClaimedInfo(item)

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
      })
    }
    let _canClaim = canClaim
    let _totalClaimAbleInWei = totalClaimAbleInWei
    switch (type) {
      case '1':
        _canClaim = canClaim_1
        _totalClaimAbleInWei = cvxFxnStakingBalances
        break
      case '2':
        _canClaim = canClaim_2
        _totalClaimAbleInWei = sdFxnStakingBalances
        break
      default:
        _canClaim = canClaim
        _totalClaimAbleInWei = totalClaimAbleInWei
        break
    }
    // const claimable = claimableInWei.shiftedBy(-18).toString(10)
    const claimedAmount = fb4(cBN(claimedAmountInWei).toString(10), false, 18)
    const totalClaimAble = fb4(
      cBN(_totalClaimAbleInWei).toString(10),
      false,
      18
    )
    let notYetVested = cBN(_totalClaimAbleInWei).minus(_canClaim)
    if (type == '0') {
      notYetVested = cBN(_totalClaimAbleInWei)
        .minus(_canClaim)
        .minus(claimedAmountInWei)
    }

    const notYetVestedText = checkNotZoroNumOption(
      notYetVested,
      fb4(notYetVested)
    )

    const startTimeText =
      startTime != 0 ? new Date(startTime * 1000).toLocaleString() : 0
    const latestTimeText =
      latestTime != 0 ? new Date(latestTime * 1000).toLocaleString() : 0

    return {
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
    }
  }

  const getVestingInfo = () => {
    let hasCVXFXN = false
    let hasSDFXN = false
    const newList = []
    const newList_fx = []
    const newList_convex = []
    const newList_stakeDao = []
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
    } = getBatchsInfo(userVest)
    if (userVest.length) {
      userVest.forEach((item, index) => {
        const _newItem = {
          ...item,
        }
        const {
          cancleTime,
          // endTime: _endTime,
          finishTime: _endTime,
          startTime: _startTime,
          vestingAmount: _vestingAmount,
          managerIndex,
        } = item
        _newItem.startTime_text = new Date(_startTime * 1000).toLocaleString()
        _newItem.endTime_text = new Date(_endTime * 1000).toLocaleString()
        _newItem.vestingAmount_text = checkNotZoroNumOption(
          _vestingAmount,
          fb4(_vestingAmount)
        )
        _newItem.index = index
        let _percent =
          ((current.valueOf() - _startTime * 1000) /
            (_endTime * 1000 - _startTime * 1000)) *
          100
        _percent = Math.min(100, _percent)
        _percent = Math.max(0, _percent)
        _newItem.vestingAmountPercent = `${_percent.toFixed(2)}%`
        _newItem.lastAmount = cBN(_vestingAmount)
          .times(100 - _percent)
          .div(100)
          .toFixed(0)
        const _claimedAmount = getClaimedInfo(item)
        _newItem.claimedAmount = _claimedAmount
        _newItem.unClaimedAmount = cBN(_vestingAmount)
          .minus(_claimedAmount)
          .toFixed(0)

        newList.push(_newItem)
        if (managerIndex * 1 == 1) {
          newList_convex.push(_newItem)
        } else if (managerIndex * 1 == 2) {
          newList_stakeDao.push(_newItem)
        } else {
          newList_fx.push(_newItem)
        }
        if (newList_convex.length) {
          hasCVXFXN = true
        }
        if (newList_stakeDao.length) {
          hasSDFXN = true
        }
      })
    }
    const canClaimText = fb4(cBN(canClaim).toString(10), false, 18)
    const canClaim_1_Text = fb4(cBN(canClaim_1).toString(10), false, 18)
    const canClaim_2_Text = fb4(cBN(canClaim_2).toString(10), false, 18)

    setData((pre) => {
      return {
        ...pre,
        canClaim,
        canClaimText,
        canClaim_1,
        canClaim_1_Text,
        canClaim_2,
        canClaim_2_Text,
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
        statkeDaoWstETHRewards,
        newList_fx,
        newList_convex,
        newList_stakeDao,
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
        apiCall = ManageableVestingContract.methods.claim(_index)
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
    getBatchsInfo,
  }
}

export default useVesting
