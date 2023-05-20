import { useState, useCallback, useMemo } from 'react'
import { Switch } from 'antd'
import Button from '@/components/Button'
import useWeb3 from '@/hooks/useWeb3'
import Visible from '@/components/Visible'
import config from '@/config/index'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import { cBN } from '@/utils/index'

/**
 *
 * @param allowance token.allowance
 * @param approveAmount token.approve.amount
 * @param tokenContract token.contract
 * @param approveAddress token.approveTo
 * @param disabledMaxSwitch
 *
 * needReset : when allowance < approve.amount，should reset approve，then approve
 * isApproveMax :
 *      Preapprove the contract to to be able to spend any amount of your coins.
 *      You will not need to approve again.
 * @returns
 */

export const useApprove = (props) => {
  const { currentAccount, web3, isAllReady } = useWeb3()
  const {
    allowance,
    approveAmount = 0,
    tokenContract,
    approveAddress,
    notVisibleMaxSwitch = false,
  } = props

  const [isApproveMax, setIsApproveMax] = useState(false)
  const [loading, setLoading] = useState(false)

  const allowAction = allowance > 0

  const needReset = useMemo(() => {
    if (approveAmount && allowance) {
      return (
        cBN(allowance).isGreaterThan(0) &&
        cBN(approveAmount).isGreaterThan(allowance)
      )
    }
    return false
  }, [approveAmount, allowance])

  const needApprove = useMemo(() => {
    return !allowAction || needReset
  }, [allowAction, needReset])

  const resetApprove = async () => {
    if (!isAllReady) {
      return
    }

    const apiCall = tokenContract.methods.approve(approveAddress, '0')
    const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
    const gas = parseInt(estimatedGas * 1.2, 10) || 0
    await NoPayableAction(() => apiCall.send({ from: currentAccount, gas }), {
      key: 'Approve',
      action: 'Reset Approve',
    })
  }

  const handleApprove = useCallback(
    async (confirmationCall) => {
      if (!isAllReady) {
        return
      }
      setLoading(true)
      if (needReset) {
        try {
          await resetApprove()
        } catch (error) {
          setLoading(false)
          return
        }
      }

      const maxWei = config.uint256Max //web3.utils.toWei('1000000000000000000', 'ether')
      const approveWei = isApproveMax
        ? maxWei
        : cBN(approveAmount).toFixed(0, 1)
      try {
        const apiCall = tokenContract.methods.approve(
          approveAddress,
          approveWei
        )
        const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
        const gas = parseInt(estimatedGas * 1.2, 10) || 0
        await NoPayableAction(
          () => apiCall.send({ from: currentAccount, gas }),
          {
            key: 'earn',
            action: 'approv',
          },
          () => {
            setLoading(false)
            confirmationCall?.()
          }
        )
      } catch (error) {
        setLoading(false)
        noPayableErrorAction(`error_earn_approve`, error)
      }
    },
    [
      currentAccount,
      needReset,
      approveAmount,
      isApproveMax,
      tokenContract,
      approveAddress,
    ]
  )

  function BtnWapper({
    loading: actionLoading,
    onClick: confirmationCall,
    children,
    switchStyle,
    size,
    ...other
  }) {
    const handleBtnClick = useCallback(() => {
      if (needApprove) {
        handleApprove(other.disabled ? null : confirmationCall)
        return
      }
      confirmationCall()
    }, [needApprove, handleApprove, confirmationCall, other])

    return useMemo(
      () => (
        <>
          <Visible visible={needApprove && !notVisibleMaxSwitch}>
            <div
              className="flex items-center justify-center gap-2 mb-3"
              style={switchStyle ?? {}}
            >
              <div>Unlimited Approve</div>
              <Switch checked={isApproveMax} onChange={setIsApproveMax} />
            </div>
          </Visible>
          <Button
            size={size}
            minWidth="280px"
            loading={actionLoading || loading}
            onClick={handleBtnClick}
            {...other}
          >
            {needApprove ? `Approve & ${children}` : children}
          </Button>
        </>
      ),
      [
        isApproveMax,
        setIsApproveMax,
        needApprove,
        notVisibleMaxSwitch,
        loading,
        handleBtnClick,
      ]
    )
  }

  return { BtnWapper }
}

export default useApprove
