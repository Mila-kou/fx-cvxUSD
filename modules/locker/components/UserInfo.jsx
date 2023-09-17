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

const token = {
  address: config.contracts.veFXN,
  symbol: 'stETH',
}

function LockerUserInfo({ userData, userHasLocked, userLockExpired }) {
  const { currentAccount, isAllReady, blockNumber } = useWeb3()
  const [rewardToken, setRewardToken] = useState(token)
  const [claiming, setClaiming] = useState(false)
  const { getContract } = useContract()
  // TODO:
  const { contract: rewardClaimHelperContract } = useContract(
    config.contracts.aladdinRewardClaimHelper,
    abi.RewardClaimHelperABI
  )

  useAsyncEffect(async () => {
    if (isAllReady) {
      try {
        const result = await getContract(
          rewardToken.address,
          abi.FeeDistributor
        )
          .methods.claim(currentAccount)
          .call()
        setRewardToken({
          ...rewardToken,
          amount: result,
          contract: getContract(rewardToken.address, abi.FeeDistributor),
        })
      } catch (error) {
        console.log(error)
      }
    }
  }, [blockNumber, currentAccount, getContract])

  const claimable = checkNotZoroNum(rewardToken.amount) > 0

  const handleClaim = async () => {
    if (!isAllReady) return

    try {
      setClaiming(true)
      // TODO:
      const apiCall = rewardClaimHelperContract.methods.claimVeRewards(
        currentAccount,
        rewardToken.address
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
    <div className="bg-[var(--background-color)] p-[56px] rounded-[10px]">
      <h2>Lock</h2>
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
          <Info
            title="Lock Rewards"
            value={`${fb4(rewardToken.amount)} ${rewardToken.symbol}`}
          />
        </div>

        <div className="flex justify-center">
          <Button
            disabled={!claimable}
            loading={claiming}
            onClick={handleClaim}
            width="300px"
          >
            Claim ALL
          </Button>
        </div>
      </Visible>
    </div>
  )
}

export default LockerUserInfo
