import React, { useState } from 'react'
import { useAsyncEffect } from 'ahooks'
import useWeb3 from '@/hooks/useWeb3'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import Visible from '@/components/Visible'
import Button from '@/components/Button'
import { checkNotZoroNum, fb4 } from '@/utils/index'
import config from '@/config/index'
import abi from '@/config/abi'
import { useContract } from '@/hooks/useContracts'
import Info from './Info'

const rewards = [
  {
    address: config.contracts.aladdinVeFeeForCVX,
    icon: '/assets/crypto-icons-stack.svg#cvx',
    symbol: 'CVX',
  },
  {
    address: config.contracts.aladdinVeFeeForFRAX,
    icon: '/assets/crypto-icons-stack.svg#frax',
    symbol: 'FRAX',
  },
]

function LockerUserInfo({ userData, userHasLocked, userLockExpired }) {
  const { currentAccount, isAllReady, blockNumber } = useWeb3()
  const [rewardTokens, setRewardTokens] = useState(rewards)
  const [claiming, setClaiming] = useState(false)
  const { getContract } = useContract()
  const { contract: rewardClaimHelperContract } = useContract(
    config.contracts.aladdinRewardClaimHelper,
    abi.RewardClaimHelperABI
  )

  useAsyncEffect(async () => {
    if (isAllReady) {
      try {
        const result = await Promise.all(
          rewards.map((i) =>
            getContract(i.address, abi.AlaFeeDistributor)
              .methods.claim(currentAccount)
              .call()
          )
        )
        setRewardTokens(
          rewards.map((i, index) => {
            return {
              ...i,
              amount: result[index],
              contract: getContract(i.address, abi.AlaFeeDistributor),
            }
          })
        )
      } catch (error) {}
    }
  }, [blockNumber, currentAccount, getContract])

  const claimable =
    rewardTokens.filter((i) => checkNotZoroNum(i.amount)).length > 0

  const handleClaim = async () => {
    if (!isAllReady) return

    try {
      setClaiming(true)
      console.log(rewards.map((i) => i.address))
      const apiCall = rewardClaimHelperContract.methods.claimVeRewards(
        currentAccount,
        rewards.map((i) => i.address)
      )
      const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(() => apiCall.send({ from: currentAccount, gas }), {
        key: 've_claim',
        action: 'claim',
      })
      setClaiming(false)
    } catch (error) {
      console.log(error)
      setClaiming(false)
      noPayableErrorAction(`error_ve_claim`, error)
    }
  }

  return (
    <div className="user-info p-8">
      <Visible visible={!userHasLocked}>
        <div className="text-lg">
          <div className="mb-2">Lock FXN to earn protocol fees.</div>
        </div>
      </Visible>
      <Visible visible={userHasLocked}>
        <div className="mb-6">
          {userData.map((i) => (
            <Visible
              key={i.title}
              visible={i.title === 'Claimable' ? userLockExpired : true}
            >
              <Info title={i.title} value={i.value} />
            </Visible>
          ))}
        </div>
        {/* <div className="mb-14">
          <div className="lock-rewards-title mb-3 text-xl">Lock Rewards</div>
          <div className="flex justify-between">
            {rewardTokens.map((item) => (
              <div key={item.symbol}>
                <div className="flex items-center gap-2">
                  <img src={item.icon} className="w-6" />
                  <div className="lock-rewards-title">
                    {fb4(item.amount)} {item.symbol}
                  </div>
                </div>
              </div>
            ))}
          </div>
            </div>

        <div className="flex justify-center">
          <Button
            disabled={!claimable}
            loading={claiming}
            onClick={handleClaim}
            width="200px"
          >
            Claim ALL
          </Button>
        </div>
         */}
      </Visible>
    </div>
  )
}

export default LockerUserInfo
