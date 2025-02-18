import React, { useEffect, useMemo, useState } from 'react'
import Button from 'components/Button'
import config from 'config/index'
import { cBN, fb4, checkNotZoroNum } from 'utils'
import useWeb3 from 'hooks/useWeb3'
import styles from './styles.module.scss'
import useMerkleTreeData from './controller/useMerkleTreeData'
import { useAladdinTree } from '@/hooks/useContracts'
import noPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'

// FXN、wstETH、FXS
const tokenMap = {
  FXN: config.tokens.FXN,
  wstETH: config.tokens.wstETH,
  FXS: config.tokens.fxs,
}

const MerkleTree = ({
  title = 'Bonus Farming:',
  tokenName = 'FXN',
  alwaysShow,
}) => {
  const { currentAccount, sendTransaction } = useWeb3()

  const [data, setData] = useState({})
  const [claiming, setClaiming] = useState(false)

  const { getTreeByAddressAndTokenName } = useMerkleTreeData()

  const tokenAddress = tokenMap[tokenName]

  const { contract: AladdinMerkleTreeContract } = useAladdinTree()
  const startTime = 1705511700000
  const startTimeText = new Date(startTime).toLocaleString()

  const merkleData = getTreeByAddressAndTokenName(currentAccount, tokenName)

  const canClaimTime = useMemo(() => {
    const _time = new Date().getTime()
    if (cBN(_time).gt(startTime)) {
      return true
    }
    return false
  }, [new Date()])

  const handleClaim = async () => {
    setClaiming(true)

    // console.log(
    //   'claim----',
    //   tokenAddress,
    //   data.index,
    //   currentAccount,
    //   data.amount,
    //   JSON.stringify(data.proof)
    // )
    try {
      const apiCall = AladdinMerkleTreeContract.methods.claim(
        tokenAddress,
        data.index,
        currentAccount,
        data.amount,
        data.proof
      )
      await noPayableAction(
        () =>
          sendTransaction({
            to: AladdinMerkleTreeContract._address,
            data: apiCall.encodeABI(),
          }),
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
        .isClaimed(tokenAddress, merkleData.index)
        .call({ from: currentAccount })
    }

    setData({ ...merkleData, isClaimed })
  }

  useEffect(() => {
    CheckClaim()
  }, [currentAccount, claiming])

  if (!checkNotZoroNum(data.amount) && !alwaysShow) {
    return null
  }

  return (
    <div className={`${styles.content} `}>
      <div className="flex justify-between items-center">
        <p className="text-[18px]">{title}</p>
        <div className="flex justify-center gap-[32px] items-center">
          <div className="flex-1 flex gap-[6px]">
            {tokenName === 'FXN' && (
              <img src="/images/FXN.svg" className="w-[20px]" />
            )}
            <p>
              {data.amount
                ? `${fb4(data.amount)} ${tokenName}`
                : 'Nothing to claim'}
            </p>
          </div>
          <Button
            disabled={data.isClaimed || !checkNotZoroNum(data.amount)}
            className={styles.action}
            size="small"
            type="red"
            onClick={handleClaim}
            loading={claiming}
            width="120px"
          >
            {data.isClaimed ? `Claimed` : 'Claim'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default MerkleTree
