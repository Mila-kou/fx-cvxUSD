import React, { useState, useCallback } from 'react'
import { useDebounceEffect } from 'ahooks'
import { Modal } from 'antd'
import Input from '@/components/Input'
import TokenSelectV1 from '@/components/TokenSelectV1'
import { useToken } from '@/hooks/useTokenInfo'
import config from '@/config/index'
import ZapInfo from '@/components/ZapInfo'
import BalanceInput, { useClearInput } from '@/components/BalanceInput'
import useWeb3 from '@/hooks/useWeb3'
import useApprove from '@/hooks/useApprove'
import { cBN, formatBalance, checkNotZoroNum, fb4 } from '@/utils/index'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import {
  useContract,
  useAllInOneGateway,
  useFX_stabilityPool,
} from '@/hooks/useContracts'
import abi from '@/config/abi'
import styles from './styles.module.scss'

export default function DepositModal(props) {
  const { onCancel, info } = props
  const { contract: FX_StabilityPoolContract } = useFX_stabilityPool()
  const [slippage, setSlippage] = useState('0.3')
  const [minAmount, setMinAmount] = useState(0)
  const [minAmountTvl, setMinAmountTvl] = useState(0)
  const [inputReseter, setInputReseter] = useState(0)
  const [depositing, setDepositing] = useState(false)
  const { getContract } = useContract()
  const { currentAccount, isAllReady } = useWeb3()

  const { lpGaugeAddress, fromPlatform, lpTokenPrice, lp_decimals, name } = info
  const [selectToken, setSelectToken] = useState(info.zapTokens[0])

  const [depositAmount, setDepositAmount] = useState(0)
  const { contract: AllInOneGatewayContract } = useAllInOneGateway()

  const isNeedZap = selectToken.needZap
  const selectTokenInfo = useToken(
    selectToken.address,
    'fx_stabiltityPool',
    info
  )
  const tokenContract = selectTokenInfo.contract
  const tokenApproveContractAddress = selectTokenInfo.contractAddress
  const userTokenBalance = selectTokenInfo.balance
  const canDeposit =
    selectTokenInfo.allowance > 0 &&
    cBN(depositAmount).isLessThanOrEqualTo(selectTokenInfo.allowance)

  const { BtnWapper } = useApprove({
    approveAmount: depositAmount,
    allowance: selectTokenInfo.allowance,
    tokenContract,
    approveAddress: tokenApproveContractAddress,
  })

  const handleDeposit = async () => {
    if (!isAllReady) return
    const depositAmountInWei = cBN(depositAmount || 0).toFixed(0, 1)
    setDepositing(true)
    try {
      const apiCall = FX_StabilityPoolContract.methods.deposit(
        depositAmountInWei,
        currentAccount
      )
      const estimatedGas = await apiCall.estimateGas({ from: currentAccount })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(() => apiCall.send({ from: currentAccount, gas }), {
        key: 'lp',
        action: 'Deposit',
      })
      onCancel()
      setDepositing(false)
    } catch (error) {
      console.log('error_deposit---', error)
      setDepositing(false)
      noPayableErrorAction(`error_deposit`, error)
    }
  }

  useDebounceEffect(
    () => {
      getMinout().then(({ shares, sharesLpNum, sharesTvl }) => {
        setMinAmountTvl(sharesTvl.toFixed(0))
        setMinAmount(sharesLpNum.toFixed(0))
      })
    },
    [depositAmount, canDeposit, slippage, getMinout],
    {
      wait: 1000,
    }
  )

  const getMinout = useCallback(
    async (isDeposit) => {
      try {
        const depositAmountInWei = cBN(depositAmount || 0).toFixed(0, 1)
        if (
          (canDeposit && !cBN(depositAmountInWei).isZero() && !isNeedZap) ||
          (isDeposit && !isNeedZap)
        ) {
          const shares = await FX_StabilityPoolContract.methods
            .deposit(depositAmountInWei, currentAccount)
            .call({
              from: currentAccount,
              value:
                config.zeroAddress === selectToken.address
                  ? depositAmountInWei
                  : 0,
            })

          const _shares = checkNotZoroNum(shares) ? cBN(shares) : cBN(0)
          const _sharesTvl = _shares.times(lpTokenPrice)
          return {
            shares,
            sharesLpNum: _shares,
            sharesTvl: _sharesTvl,
          }
        }
        return {
          shares: cBN(0),
          sharesLpNum: cBN(0),
          sharesTvl: cBN(0),
        }
      } catch (e) {
        console.log(e)
        return {
          shares: cBN(0),
          sharesLpNum: cBN(0),
          sharesTvl: cBN(0),
        }
      }
    },
    [depositAmount, FX_StabilityPoolContract]
  )

  const handleInputChange = (val) => setDepositAmount(val)
  const canSubmit =
    cBN(depositAmount).isGreaterThan(0) &&
    cBN(depositAmount).isLessThanOrEqualTo(cBN(userTokenBalance))

  return (
    <Modal visible centered onCancel={onCancel} footer={null} width={500}>
      <div className={styles.content}>
        <h2 className="mb-[16px]">Deposit fETH/ETH </h2>

        <BalanceInput
          placeholder="0"
          symbol="fETH"
          balance={fb4(userTokenBalance, false)}
          maxAmount={userTokenBalance}
          onChange={handleInputChange}
          withUsd={false}
        />
      </div>

      <div className="mt-[40px]">
        <BtnWapper
          width="100%"
          loading={depositing}
          disabled={!canSubmit}
          onClick={handleDeposit}
        >
          Deposit
        </BtnWapper>
      </div>
    </Modal>
  )
}
