import React, { useEffect, useState } from 'react'
import { DatePicker, Tooltip } from 'antd'
import moment from 'moment'
import useWeb3 from '@/hooks/useWeb3'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import Button from '@/components/Button'
import Tabs from '@/modules/home/components/Tabs'
import useApprove from '@/hooks/useApprove'
import config from '@/config/index'
import Visible from '@/components/Visible'
import BalanceInput, { useClearInput } from '@/components/BalanceInput'
import { cBN, fb4 } from '@/utils/index'
import useCreateLock from '../hook/useCreateLock'
import { VeLockerRules } from './Info'
import UserInfo from './UserInfo'
import { calc4, FOURYEARS } from '../util'
import { useErc20Token } from '@/hooks/useContracts'

function VELockCom({
  data: {
    status,
    contractInfo,
    userData,
    contracts: { veContract },
  },
  actions,
}) {
  const { isAllReady, currentAccount, current } = useWeb3()
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [tabsActinveKey, setTabsActinveKey] = useState(0)
  const [lockAmount, setLockAmount] = useState(0)
  const [lockTo, setLockTo] = useState(moment().add(1, 'day'))
  const [startTime, setStartTime] = useState(moment())

  const [userHasLocked, setUserHasLocked] = useState(false)
  const [userLockExpired, setUserLockExpired] = useState(false)
  const [clearInputTrigger, setClearInputTrigger] = useState(0)

  // Get FXN token info
  const { tokenContract: fxnContract, tokenInfo: fxnTokenInfo } = useErc20Token(
    config.contracts.FXN,
    config.contracts.veFXN
  )
  const { BtnWapper } = useApprove({
    approveAmount: lockAmount,
    allowance: fxnTokenInfo.allowance,
    tokenContract: fxnContract,
    approveAddress: config.contracts.veFXN,
  })

  useEffect(() => {
    setLockAmount('')
  }, [clearInputTrigger])

  const lockCb = () => {
    setClearInputTrigger((prev) => prev + 1)
  }

  useEffect(() => {
    if (status === 'no-lock') {
      setUserHasLocked(false)
      setUserLockExpired(false)
    }

    if (status === 'ing') {
      setUserHasLocked(true)
      setUserLockExpired(false)
    }
    if (status === 'expired') {
      setUserHasLocked(true)
      setUserLockExpired(true)
    }
  }, [status])

  // VE create lock  && increase lock
  const {
    createLockLoading,
    vePower,
    extendVePower,
    lockMoreVePower,
    shortDate,
    extendDays,
    handleCreateLock,
    handleIncreaseTime,
    handleIncreaseAmount,
  } = useCreateLock({
    veContract,
    actions: { setLockTo, setStartTime },
    refresh: () => {
      setRefreshTrigger((prev) => prev + 1)
      actions?.setRefreshTrigger((prev) => prev + 1)
    },
    lockAmount,
    lockTo,
    userLocked: contractInfo.userLocked,
    status,
    startTime,
  })

  const disabledDate = (_current) => {
    if (status === 'no-lock') {
      return (
        _current &&
        !_current.isBetween(
          startTime.clone().subtract(1, 'day'),
          calc4(moment(startTime.clone().add(FOURYEARS, 'day')))
        )
      )
    }
    if (status === 'ing') {
      if (!contractInfo.userLocked?.end) {
        return false
      }
      return (
        _current &&
        !_current.isBetween(
          startTime,
          calc4(_current.clone().add(FOURYEARS, 'day'))
        )
      )
    }
  }

  const canCreateLock =
    cBN(lockAmount).isGreaterThan(0) &&
    cBN(lockAmount).isLessThanOrEqualTo(fxnTokenInfo.balance)

  const addTime = ({ value: days, disabledDate: disabled }) => {
    if (disabled) {
      return
    }
    if (status === 'no-lock') {
      setLockTo(calc4(moment(startTime.clone().add(days, 'day'))))
    } else if (status === 'ing') {
      setLockTo(calc4(moment(current.clone().add(days, 'day'))))
    }
  }

  const handleClaim = async () => {
    if (!isAllReady) return
    try {
      const apiCall = veContract.methods.withdraw()
      const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(() => apiCall.send({ from: currentAccount, gas }), {
        key: 've_claim',
        action: 'claim',
      })
      setRefreshTrigger((prev) => prev + 1)
      actions?.setRefreshTrigger((prev) => prev + 1)
    } catch (error) {
      noPayableErrorAction(`error_ve_claim`, error)
    }
  }

  return (
    <div className="w-full flex flex-col gap-8">
      <UserInfo
        userData={userData}
        userHasLocked={userHasLocked}
        userLockExpired={userLockExpired}
      />

      <div
        className={`relative bg-[var(--background-color)]  p-[56px] rounded-[10px] ${
          !userHasLocked ? 'user-not-locked' : ''
        }`}
      >
        <Visible visible={userHasLocked}>
          <Tabs
            tabs={['Lock', 'Extend']}
            onChange={(index) => setTabsActinveKey(index)}
            selecedIndex={tabsActinveKey}
          />
        </Visible>
        <Visible visible={!userHasLocked}>
          <div className="title text-3xl mb-8 font-semibold">Lock FXN</div>
        </Visible>

        <Visible visible={userLockExpired}>
          <div className="text-center mt-32">
            <Button onClick={handleClaim}>Claim</Button>
          </div>
        </Visible>

        <Visible visible={!userLockExpired}>
          <Visible visible={tabsActinveKey === 0 || status == 'no-lock'}>
            <div className="pt-[16px]">
              <BalanceInput
                placeholder="0"
                symbol="FXN"
                balance={fb4(fxnTokenInfo.balance, false)}
                maxAmount={fxnTokenInfo.balance}
                onChange={setLockAmount}
                withUsd={false}
              />
            </div>
            <div className="mt-4 text-[16px]">
              <Visible visible={status === 'ing'}>
                Your starting voting power will be:{' '}
                <span className="color-blue">{fb4(lockMoreVePower)} veFXN</span>
              </Visible>
            </div>

            <Visible visible={userHasLocked}>
              <div className="flex justify-center mt-5">
                <div width="100%">
                  <BtnWapper
                    disabled={cBN(lockAmount).isLessThanOrEqualTo(0)}
                    onClick={() => {
                      handleIncreaseAmount(lockCb)
                    }}
                    width="300px"
                  >
                    Lock More
                  </BtnWapper>
                </div>
              </div>
            </Visible>
          </Visible>

          <Visible visible={tabsActinveKey === 1 || status == 'no-lock'}>
            <VeLockerRules status={status} />
            <div className="flex gap-4 items-center ">
              <DatePicker
                value={lockTo}
                disabledDate={disabledDate}
                onChange={setLockTo}
                className="datePicker"
                showTime={false}
                showToday={false}
                renderExtraFooter={() => (
                  <div className="flex justify-between flex-wrap">
                    {shortDate.map((i) => (
                      <div
                        key={i.value}
                        onClick={() => addTime(i)}
                        className={`text-center w-2/6 underline ${
                          i.disabledDate
                            ? 'text-[var(--second-text-color)] cursor-not-allowed'
                            : 'text-[var(--main-text-color)] cursor-pointer'
                        }`}
                      >
                        {i.lable}
                      </div>
                    ))}
                  </div>
                )}
                dropdownClassName="datePickerDropdown"
              />
            </div>

            <div className="text-base leading-normal mt-2">
              <div className="text-[16px]">
                Your starting voting power will be:{' '}
                <span className="color-blue">
                  {fb4(status === 'no-lock' ? vePower : extendVePower)} veFXN
                </span>
              </div>

              <Visible visible={!userHasLocked}>
                <div className="text-[16px]">
                  You can only claim your FXN after lock expiration.
                </div>
              </Visible>
              {/* 
              <div>
                After creating your lock, you will need to{' '}
                <Tooltip title="If your boost level hasn't changed after locking veFXN, you will need to conduct one transaction (deposit, withdraw or claim) from the gauge that you are providing liquidity to update your boost.">
                  <span className="underline">apply your boost</span>
                </Tooltip>
                .
                </div>
              */}
            </div>

            <Visible visible={userHasLocked}>
              <div className="flex justify-center pt-[26px]">
                <Button
                  width="300px"
                  disabled={extendDays > FOURYEARS}
                  onClick={handleIncreaseTime}
                  loading={createLockLoading}
                >
                  Extend
                </Button>
              </div>
            </Visible>
          </Visible>
        </Visible>

        <Visible visible={status === 'no-lock'}>
          <div className="text-center mt-10">
            <BtnWapper
              width="100%"
              loading={createLockLoading}
              disabled={!canCreateLock}
              onClick={() => handleCreateLock(lockCb)}
            >
              Create Lock
            </BtnWapper>
          </div>
        </Visible>
      </div>
    </div>
  )
}

export default VELockCom
