import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import AssetCell, { ComingAssetCell } from '../components/AssetCell'
import styles from './styles.module.scss'
import useGlobal from '@/hooks/useGlobal'
import { ASSETS } from '@/config/tokens'
import SimpleInput from '@/components/SimpleInput'
import Button from '@/components/Button'
import { cBN, checkNotZoroNum } from '@/utils/index'
import useWeb3 from '@/hooks/useWeb3'
import noPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import { useContract } from '@/hooks/useContracts'
import MockTwapOracleABI from '@/config/abi/common/MockTwapOracle'
import usePools from '../components/FxUSDMint/usePools'

export default function AssetsPage() {
  const { theme } = useGlobal()
  const { _currentAccount } = useWeb3()
  const { fETH, xETH, fxUSD, xstETH, xfrxETH } = useSelector(
    (state) => state.asset
  )

  usePools()

  const comingList = ASSETS.filter((item) => item.isComing)
  const [stEthPrice, setStEthPrice] = useState(0)
  const [frxEthPrice, setFrxEthPrice] = useState(0)
  const [priceLoading, setPriceLoading] = useState(0)
  const handleChange_CurrentStETHPrice = (v) => {
    if (checkNotZoroNum(v)) {
      setStEthPrice(v.toString(10))
    }
  }
  const handleChange_CurrentFrxETHPrice = (v) => {
    if (checkNotZoroNum(v)) {
      setFrxEthPrice(v.toString(10))
    }
  }
  const { contract: stETHMockTwapOracleContract } = useContract(
    '0x3A6337AB482280E0FBF46e3493F3626ddecBABB8', // mockstETH
    MockTwapOracleABI
  )
  const { contract: frxETHMockTwapOracleContract } = useContract(
    '0x4abbd445a93E5881389355e225Ae776Cb4d5D37C', // mockfrxETH
    MockTwapOracleABI
  )
  const handleSetStETHPrice = async (type) => {
    try {
      setPriceLoading(true)
      let _price = stEthPrice
      let _contract = stETHMockTwapOracleContract
      if (type == 'stETH') {
        _price = stEthPrice
        _contract = stETHMockTwapOracleContract
      } else if (type == 'frxETH') {
        _price = frxEthPrice
        _contract = frxETHMockTwapOracleContract
      }
      const _minOut = cBN(_price).toString(10)
      const apiCall = await _contract.methods.setPrice(_minOut)

      const estimatedGas = await apiCall.estimateGas({
        from: _currentAccount,
      })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await noPayableAction(
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
  const handleSetStETHPriceIsValid = async (type) => {
    try {
      setPriceLoading(true)
      let _contract = frxETHMockTwapOracleContract
      if (type == 'stETH') {
        _contract = stETHMockTwapOracleContract
      } else if (type == 'frxETH') {
        _contract = frxETHMockTwapOracleContract
      }

      const apiCall = await _contract.methods.setIsValid(true)

      const estimatedGas = await apiCall.estimateGas({
        from: _currentAccount,
      })
      const gas = parseInt(estimatedGas * 1.2, 10) || 0
      await noPayableAction(
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

  return (
    <>
      <div className={styles.container}>
        {[
          [
            'Stable Assets',
            [fxUSD, fETH],
            false,
            `/assets/stable${theme === 'red' ? '' : '-white'}.svg`,
          ],
          [
            'Leveraged Assets',
            [xETH, xstETH, xfrxETH],
            true,
            `/assets/leverage${theme === 'red' ? '' : '-white'}.svg`,
          ],
        ].map(([name, list, isX, icon]) => (
          <div className={`${styles.header} mt-[32px]`} key={name}>
            <div className={styles.headerTitle}>
              <img src={icon} />
              {name}
            </div>

            <div className="px-[16px] mt-[16px] flex justify-between">
              <div className="w-[200px]" />
              <div className="w-[120px] text-[14px]">
                {isX ? 'Leverage' : 'TVL'}
              </div>
              <div className="w-[60px] text-[14px]">Nav</div>
              <div className="w-[72px] text-[14px]">24h Change</div>
            </div>

            {list.map((item) => (
              <Link href={`assets/${item.symbol}`}>
                <AssetCell info={item} />
              </Link>
            ))}

            {comingList
              .filter((item) => !!item.isX === !!isX)
              .map((item) => (
                <div>
                  <ComingAssetCell info={item} />
                </div>
              ))}
          </div>
        ))}
      </div>
      {/* <div className={styles.container}>
        <SimpleInput onChange={handleChange_CurrentStETHPrice} /> <br />
        <Button
          width="100%"
          loading={priceLoading}
          onClick={() => {
            handleSetStETHPrice('stETH')
          }}
        >
          stETH Price
        </Button>
        <Button
          width="100%"
          loading={priceLoading}
          onClick={() => {
            handleSetStETHPriceIsValid('stETH')
          }}
        >
          stETH IsValid
        </Button>
      </div>
      <div className={styles.container}>
        <SimpleInput onChange={handleChange_CurrentFrxETHPrice} /> <br />
        <Button
          width="100%"
          loading={priceLoading}
          onClick={() => {
            handleSetStETHPrice('frxETH')
          }}
        >
          frxETH Price
        </Button>
        <Button
          width="100%"
          loading={priceLoading}
          onClick={() => {
            handleSetStETHPriceIsValid('frxETH')
          }}
        >
          frxETH IsValid
        </Button>
      </div> */}
    </>
  )
}
