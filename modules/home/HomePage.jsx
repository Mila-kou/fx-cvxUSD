import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
// import { Button, InputNumber } from 'antd'
import SimpleInput from '@/components/SimpleInput'
import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import { cBN, checkNotZoroNum, fb4 } from '@/utils/index'
import { useToken } from '@/hooks/useTokenInfo'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import { getGas } from '@/utils/gas'
import useGlobal from '@/hooks/useGlobal'
import Swap from './components/Swap'
import SystemStatistics from './components/SystemStatistics'
import styles from './styles.module.scss'
import Button from '@/components/Button'
import { useContract } from '@/hooks/useContracts'
import abi from '@/config/abi'

export default function HomePage() {
  const { showSystemStatistics } = useGlobal()
  const [ethPrice, setEthPrice] = useState(0)
  const [stEthPrice, setStEthPrice] = useState(0)

  const { _currentAccount } = useWeb3()
  const [priceLoading, setPriceLoading] = useState(0)
  const ethMockTwapOracleAddr = '0x84496fc45b3b3fda16cc8786bfa07674ac556e84'
  const stEthMockTwapOracleAddr = '0x0f9d2ba589a9257f8432e88ff6d12a2ff684dc3c'

  const { contract: ethMockTwapOracleContract } = useContract(
    ethMockTwapOracleAddr,
    abi.MockTwapOracleAbi
  )
  const { contract: stETHMockTwapOracleContract } = useContract(
    stEthMockTwapOracleAddr,
    abi.MockTwapOracleAbi
  )

  const handleSetPrice = async () => {
    try {
      setPriceLoading(true)
      const _minOut = cBN(ethPrice).toString(10)
      const apiCall = await ethMockTwapOracleContract.methods.setPrice(_minOut)

      const estimatedGas = await apiCall.estimateGas({
        from: _currentAccount,
      })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(
        () => apiCall.send({ from: _currentAccount, gas }),
        {
          key: 'Price',
          action: 'Price',
        }
      )
      setPriceLoading(false)
    } catch (error) {
      setPriceLoading(false)
      noPayableErrorAction(`error_mint`, error)
    }
  }
  const handleSetStETHPrice = async () => {
    try {
      setPriceLoading(true)
      const _minOut = cBN(ethPrice).toString(10)
      const apiCall = await stETHMockTwapOracleContract.methods.setPrice(
        _minOut
      )

      const estimatedGas = await apiCall.estimateGas({
        from: _currentAccount,
      })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await NoPayableAction(
        () => apiCall.send({ from: _currentAccount, gas }),
        {
          key: 'Price',
          action: 'Price',
        }
      )
      setPriceLoading(false)
    } catch (error) {
      setPriceLoading(false)
      noPayableErrorAction(`error_mint`, error)
    }
  }

  const handleChange_CurrentETHPrice = (v) => {
    if (checkNotZoroNum(v)) {
      setEthPrice(v.toString(10))
    }
  }
  const handleChange_CurrentStETHPrice = (v) => {
    if (checkNotZoroNum(v)) {
      setStEthPrice(v.toString(10))
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <Swap />
        New ETH Price: <SimpleInput onChange={handleChange_CurrentETHPrice} />
        <Button width="100%" loading={priceLoading} onClick={handleSetPrice}>
          ETH Price
        </Button>
        New stETH Price:{' '}
        <SimpleInput onChange={handleChange_CurrentStETHPrice} /> <br />
        <Button
          width="100%"
          loading={priceLoading}
          onClick={handleSetStETHPrice}
        >
          stETH Price
        </Button>
      </div>
      {showSystemStatistics ? (
        <div className={styles.item}>
          <SystemStatistics />
        </div>
      ) : null}
    </div>
  )
}
