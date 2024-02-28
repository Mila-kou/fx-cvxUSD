import React, { useEffect, useMemo, useState } from 'react'
import Button from 'components/Button'
import config from 'config/index'
import { cBN, fb4, checkNotZoroNum } from 'utils'
import useWeb3 from 'hooks/useWeb3'
import styles from './styles.module.scss'
import useMerkleTreeData from './controller/useMerkleTreeData'
import { useAladdinTree } from '@/hooks/useContracts'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'

const MerkleTree = () => {
  const { currentAccount } = useWeb3()

  const [data, setData] = useState({})
  const [claiming, setClaiming] = useState(false)

  const { getTreeByAddress } = useMerkleTreeData()

  const { contract: AladdinMerkleTreeContract } = useAladdinTree()
  const startTime = 1705511700000
  const startTimeText = new Date(startTime).toLocaleString()

  const merkleData = getTreeByAddress(currentAccount)

  const canClaimTime = useMemo(() => {
    const _time = new Date().getTime()
    if (cBN(_time).gt(startTime)) {
      return true
    }
    return false
  }, [new Date()])

  const handleClaim = async () => {
    setClaiming(true)
    try {
      const apiCall = AladdinMerkleTreeContract.methods.claim(
        config.tokens.FXN,
        data.index,
        currentAccount,
        data.amount,
        data.proof
      )
      const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
      const gas = parseInt(estimatedGas * 1, 10) || 0
      await NoPayableAction(
        () => apiCall.send({ from: currentAccount, gas }),
        {
          key: 'Claim',
          action: 'Claim',
        },
        () => {
          setClaiming(false)
        }
      )

      setClaiming(false)
    } catch (error) {
      console.log('error_Claim---', error)
      setClaiming(false)
      noPayableErrorAction(`error_Claim`, error)
    }
  }

  const CheckClaim = async () => {
    let isClaimed = false
    if (merkleData && Object.values(merkleData).length) {
      isClaimed = await AladdinMerkleTreeContract.methods
        .isClaimed(config.tokens.FXN, merkleData.index)
        .call({ from: currentAccount })
    }

    setData({ ...merkleData, isClaimed })
  }

  useEffect(() => {
    CheckClaim()
  }, [currentAccount, claiming])

  if (!checkNotZoroNum(data.amount)) {
    return null
  }

  return (
    <div className="flex justify-between mt-[32px] items-center">
      <p className="text-[18px]">Bonus Farming: </p>
      <div className="flex justify-center gap-[32px] items-center">
        <div className={styles.check}>
          <p>{data.amount ? `${fb4(data.amount)} FXN` : 'Nothing to claim'}</p>
        </div>
        <Button
          disabled={data.isClaimed}
          className={styles.action}
          size="small"
          onClick={handleClaim}
          loading={claiming}
        >
          {data.isClaimed ? `Claimed` : 'Claim'}
        </Button>
      </div>
    </div>
  )
}

export default MerkleTree
