import React, { useState, useCallback } from 'react'
import { useDebounceEffect } from 'ahooks'
import { Modal } from 'antd'
import Input from '@/components/Input'
import TokenSelectV1 from '@/components/TokenSelectV1'
import { useToken } from '@/hooks/useTokenInfo'
import config from '@/config/index'
import ZapInfo from '@/components/ZapInfo'
import useWeb3 from '@/hooks/useWeb3'
import useApprove from '@/hooks/useApprove'
import { cBN, formatBalance, checkNotZoroNum } from '@/utils/index'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import { useContract, useAllInOneGateway } from '@/hooks/useContracts'
import abi from '@/config/abi'
import styles from './styles.module.scss'

export default function DepositModal(props) {
  const { onCancel, info } = props
  const [slippage, setSlippage] = useState('0.3')
  const [minAmount, setMinAmount] = useState(0)
  const [minAmountTvl, setMinAmountTvl] = useState(0)
  const [inputReseter, setInputReseter] = useState(0)
  const [depositing, setDepositing] = useState(false)
  const { getContract } = useContract()
  const { currentAccount, isAllReady } = useWeb3()
  const {
    lpGaugeAddress,
    fromPlatform,
    platformUrl,
    lpTokenPrice,
    lp_decimals,
    logo,
    name,
  } = info
  const [selectToken, setSelectToken] = useState(info.zapTokens[0])

  const [depositAmount, setDepositAmount] = useState(0)
  const { contract: AllInOneGatewayContract } = useAllInOneGateway()

  const isSelfLp = info.lpAddress === selectToken.address
  const selectTokenInfo = useToken(
    selectToken.address,
    isSelfLp ? 'gauge' : 'gaugeZAP',
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
    if (!isSelfLp) {
      // console.log('let us try to switch token')
      handleZapDeposit()
      return
    }
    const lpContract = getContract(
      info.lpGaugeAddress,
      abi.AlaLiquidityGaugeV3ABI
    )
    const depositAmountInWei = cBN(depositAmount || 0).toFixed(0, 1)
    setDepositing(true)
    try {
      const apiCall = lpContract.methods.deposit(
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
      setDepositing(false)
      noPayableErrorAction(`error_deposit`, error)
    }
  }

  const handleZapDeposit = async () => {
    if (!isAllReady) return
    setDepositing(true)
    const depositAmountInWei = cBN(depositAmount || 0).toFixed(0, 1)
    const { shares: _minAmount } = await getMinout(true)
    const minOut = (cBN(_minAmount) || cBN(0))
      .multipliedBy(cBN(1).minus(cBN(slippage).dividedBy(100)))
      .toFixed(0)

    try {
      const _method =
        fromPlatform.toLowerCase() == 'curve'
          ? 'depositGaugeWithCurveLP'
          : 'depositGaugeWithBalancerLP'
      const apiCall = AllInOneGatewayContract.methods[_method](
        lpGaugeAddress,
        selectToken.address,
        depositAmountInWei,
        selectToken.routes,
        minOut
      )
      const estimatedGas = await apiCall.estimateGas({
        from: currentAccount,
        value:
          config.zeroAddress === selectToken.address ? depositAmountInWei : 0,
      })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(
        () =>
          apiCall.send({
            from: currentAccount,
            gas,
            value:
              config.zeroAddress === selectToken.address
                ? depositAmountInWei
                : 0,
          }),
        {
          key: 'farm',
          action: 'zapAndDeposit',
        }
      )
      setDepositing(false)
      onCancel()
    } catch (error) {
      console.log(error)
      setDepositing(false)
      noPayableErrorAction(`error_zapAndDeposit`, error)
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
          (canDeposit && !cBN(depositAmountInWei).isZero() && !isSelfLp) ||
          (isDeposit && !isSelfLp)
        ) {
          const _method =
            fromPlatform.toLowerCase() == 'curve'
              ? 'depositGaugeWithCurveLP'
              : 'depositGaugeWithBalancerLP'
          const shares = await AllInOneGatewayContract.methods[_method](
            lpGaugeAddress,
            selectToken.address,
            depositAmountInWei,
            selectToken.routes,
            0
          ).call({
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
    [depositAmount, AllInOneGatewayContract]
  )

  const handleTokenSelect = (token) => {
    setMinAmount(0)
    setSelectToken(token)
    setInputReseter((prev) => prev + 1)
  }
  const handleInputChange = (val) => setDepositAmount(val)
  const canSubmit =
    cBN(depositAmount).isGreaterThan(0) &&
    cBN(depositAmount).isLessThanOrEqualTo(cBN(userTokenBalance))

  return (
    <Modal visible centered onCancel={onCancel} footer={null} width={600}>
      <div className={styles.content}>
        <h2>Deposit fETH/ETH </h2>

        <TokenSelectV1
          title="Deposit token"
          onChange={(token) => handleTokenSelect(token)}
          value={selectToken}
          options={info.zapTokens}
        />
        <Input
          placeholder="Type the amount you want to deposit"
          balance={userTokenBalance}
          decimals={selectToken.decimals}
          token={selectToken.symbol}
          onChange={handleInputChange}
          reset={inputReseter}
        />
        {selectToken.needZap && (
          <ZapInfo
            zapTitle="Zap Transaction Info"
            slippage={slippage}
            slippageChange={(val) => setSlippage(val)}
            minAmount={formatBalance(minAmount, lp_decimals, 4)}
            minLpAmountTvl={formatBalance(minAmountTvl, lp_decimals, 4)}
            isLpMinAmount
            tokenName={name}
            zapType="Deposit"
          />
        )}
      </div>

      <div className="mt-[56px]">
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
