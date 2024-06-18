import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { Modal } from 'antd'
import { useDebounceEffect } from 'ahooks'
import Button from '@/components/Button'
import noPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import useWeb3 from '@/hooks/useWeb3'
import BalanceInput, { useClearInput } from '@/components/BalanceInput'
import {
  cBN,
  formatBalance,
  checkNotZoroNum,
  fb4,
  checkNotZoroNumOption,
} from '@/utils/index'
import config from '@/config/index'
import styles from './styles.module.scss'
import {
  useArUSDWrap_contract,
  useArUSD_contract,
  useConcentratorHarvest_contract,
} from '@/hooks/useConcentratorContract'
import { DetailCell, NoticeCard } from '@/modules/assets/components/Common'

export default function Withdraw(props) {
  const { onCancel, info, poolData } = props
  const {
    config: { withdrawZapTokens },
    name,
  } = info
  const { baseInfo, userInfo } = poolData
  const { currentAccount, isAllReady, sendTransaction } = useWeb3()
  const { contract: AladdinHarvestContract, address: commonHarvester } =
    useConcentratorHarvest_contract()
  const {
    contract: compounderTokenWrapContract,
    address: compounderTokenWrapAddress,
  } = useArUSDWrap_contract()
  const { contract: compounderTokenContract, address: compounderTokenAddress } =
    useArUSD_contract()
  const [harvestMinoutNum, setHarvestMinoutNum] = useState([0, 0])
  const [withdrawAmount, setWithdrawAmount] = useState()
  const [minoutNum, setMinoutNum] = useState(0)
  const [withdrawing, setWithdrawing] = useState(false)
  const [symbol, setSymbol] = useState('rUSD')
  const [errorText, setErrorText] = useState('')

  const selectTokenAddress = useMemo(() => {
    return withdrawZapTokens.find((item) => item.symbol === symbol)
  }, [symbol])

  const handleInputChange = (val) => setWithdrawAmount(val)

  const handleWithdraw = async () => {
    const _minout = await handleMinout()
    let apiCall
    const _withdrawAmount = cBN(withdrawAmount).toFixed(0, 1)
    if (
      selectTokenAddress.address.toLowerCase() !=
      config.tokens.weETH.toLowerCase()
    ) {
      if (baseInfo.liquidatedRes) {
        noPayableErrorAction(
          `error_arUSD_redeem`,
          'The Stability Pool is undergoing liquidation, please withdraw weETH.'
        )
        return
      }
      apiCall = compounderTokenWrapContract.methods.redeem(
        _withdrawAmount,
        currentAccount,
        currentAccount
      )
    } else {
      apiCall = compounderTokenWrapContract.methods.redeemToBaseToken(
        _withdrawAmount,
        currentAccount,
        currentAccount,
        _minout
      )
    }
    if (!_minout) {
      noPayableErrorAction(`error_arUSD_redeem`, 'Unable to redeem arUSD.')
      return
    }
    try {
      await noPayableAction(
        () =>
          sendTransaction({
            to: compounderTokenWrapAddress,
            data: apiCall.encodeABI(),
          }),
        {
          key: 'arUSD',
          action: 'redeem',
        }
      )
      onCancel()
    } catch (error) {
      if (!error) {
        noPayableErrorAction(`error_arUSD_redeem`, 'Unable to redeem arUSD.')
      } else {
        noPayableErrorAction(`error_arUSD_redeem`, error)
      }
    }
  }

  const handleMinout = useCallback(async () => {
    try {
      if (checkNotZoroNum(withdrawAmount)) {
        let data
        let minoutAmount = 0
        const _withdrawAmount = cBN(withdrawAmount).toFixed(0, 1)
        if (selectTokenAddress.address != config.tokens.weETH) {
          data = await compounderTokenWrapContract.methods
            .previewRedeem(_withdrawAmount)
            .call({ from: currentAccount })
          minoutAmount = data
        } else {
          data = await compounderTokenWrapContract.methods
            .redeemToBaseToken(
              _withdrawAmount,
              currentAccount,
              currentAccount,
              0
            )
            .call({ from: currentAccount })
          minoutAmount = cBN(data)
            .times(1 - 0.003)
            .toFixed(0, 1)
        }

        setMinoutNum(minoutAmount)
        return minoutAmount
      }
      setMinoutNum(0)
      return 0
    } catch (error) {
      console.log(error)
      return false
    }
  }, [baseInfo, withdrawAmount, selectTokenAddress, currentAccount])

  useEffect(() => {
    if (
      baseInfo?.liquidatedRes &&
      selectTokenAddress.address.toLowerCase() !=
        config.tokens.weETH.toLowerCase()
    ) {
      setErrorText(
        `The Stability Pool is undergoing liquidation, please withdraw weETH.`
      )
    } else {
      setErrorText('')
    }
  }, [baseInfo, selectTokenAddress])

  useDebounceEffect(
    () => {
      handleMinout()
    },
    [withdrawAmount, selectTokenAddress, currentAccount],
    {
      wait: 1000,
    }
  )

  const canWithdraw = useMemo(() => {
    return (
      checkNotZoroNum(minoutNum) &&
      isAllReady &&
      !errorText &&
      cBN(withdrawAmount).lte(userInfo.wrapArUSDWalletBalance)
    )
  }, [minoutNum, errorText, isAllReady])

  return (
    <Modal visible centered onCancel={onCancel} footer={null} width={500}>
      <div className={styles.content}>
        <h2 className="mb-[16px]">{name}</h2>
        <BalanceInput
          placeholder="0"
          symbol={symbol}
          balance={fb4(userInfo.wrapArUSDWalletBalance, false)}
          maxAmount={userInfo.wrapArUSDWalletBalance}
          onChange={handleInputChange}
          options={withdrawZapTokens.map((item) => item.symbol)}
          onSymbolChanged={(v) => setSymbol(v)}
          withUsd={false}
        />
        <div className="mt-[10px]">
          {/* <DetailCell title="Harvest Minout:" content={[harvestWillGet]} /> */}
          <DetailCell
            title="Min. Received:"
            content={[
              checkNotZoroNumOption(minoutNum, fb4(minoutNum, false, 18, 4)),
            ]}
          />
        </div>
        {errorText ? <NoticeCard content={[errorText]} /> : null}
        <div className="mt-[20px] flex gap-[20px]">
          {/* <Button
            width="100%"
            size="small"
            disabled={!canHarvest}
            loading={harvesting}
            onClick={handleHarvest}
          >
            Harvest
          </Button> */}
          <Button
            width="100%"
            disabled={!canWithdraw}
            loading={withdrawing}
            onClick={handleWithdraw}
          >
            Withdraw
          </Button>
        </div>
      </div>
    </Modal>
  )
}
