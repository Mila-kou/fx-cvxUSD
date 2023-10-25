import React, { useEffect, useMemo, useState } from 'react'
import { Modal, Checkbox } from 'antd'
import moment from 'moment'
import { cBN, fb4, checkNotZoroNum } from 'utils'
import { NoticeCard } from '@/modules/home/components/Common'
import Button from '@/components/Button'
import Tabs from '@/modules/home/components/Tabs'
import styles from './styles.module.scss'
import useVesting from '../../controller/useVesting'

export default function ConvertModal({ onCancel, converting, handleConvert }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [showDetail, setShowDetail] = useState(false)
  const [selected, setSelected] = useState([])
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const {
    newList,
    handleClaim: handleClaimFn,
    handleClaimReward: handleClaimRewardFn,
  } = useVesting(refreshTrigger)

  const strategy = [
    {
      title: 'cvxFXN',
      apy: '100',
      rewards: [
        {
          token: 'CVX',
          apy: '100',
        },
        {
          token: 'FXN',
          apy: '0',
        },
        {
          token: 'wstETH',
          apy: '0',
        },
      ],
    },
    {
      title: 'sdFXN',
      apy: '100',
      rewards: [
        {
          token: 'SDT',
          apy: '100',
        },
      ],
    },
  ]

  const [batchs, total_batchs_amonut] = useMemo(() => {
    let _total_batchs_amonut = cBN(0)
    if (newList && newList.length) {
      const _newList = newList.filter((item) => {
        if (item.managerIndex * 1 == 0) {
          _total_batchs_amonut = _total_batchs_amonut.plus(item.vestingAmount)
          return true
        }
      })
      return [_newList, fb4(_total_batchs_amonut)]
    }
    return [[], 0]
  }, [newList])

  const handleConvertFn = () => {
    const _indices = selected
    handleConvert(activeIndex + 1, _indices)
  }
  const onChange = (e) => {
    const { checked, value } = e.target
    if (checked) {
      setSelected([...new Set(selected).add(value)])
    } else {
      setSelected([...selected.filter((item) => item !== value)])
    }
  }

  console.log('selected----', selected)
  const _currentStrategy = useMemo(() => {
    return strategy[activeIndex]
  }, [activeIndex])

  const canConvert = useMemo(() => {
    return selected.length
  }, [selected])
  return (
    <Modal onCancel={onCancel} visible footer={null} width="600px">
      <div className={styles.info}>
        <div className="color-white">Convert Vesting FXN</div>
      </div>

      <p className="text-[16px] text-[var(--second-text-color)]">
        Convert your vesting $FXN to $cvxFXN or $sdFXN to earn extra rewards.
      </p>
      <h2 className="text-[20px] my-[16px]">Select a strategy</h2>

      <Tabs
        selecedIndex={activeIndex}
        onChange={(v) => setActiveIndex(v)}
        tabs={strategy.map((item) => item.title)}
      />
      <div className="flex cursor-pointer">
        {strategy.map((item, index) => (
          <div
            className={`flex-1 ${
              activeIndex === index ? 'bg-[var(--input-background-color)]' : ''
            } py-[8px] px-[32px] rounded-[5px]`}
            onClick={() => setActiveIndex(index)}
          >
            <div className="pt-[8px]">
              <div>APY: {item.apy}%</div>
              {item.rewards.map((reward) => (
                <div className="ml-[16px] text-[16px]">
                  - {reward.token}: {reward.apy}%
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-[32px] mb-[16px] flex justify-between">
        <p>Vesting FXN Amount: {total_batchs_amonut}</p>
        <p
          className="cursor-pointer text-[var(--a-button-color)]"
          onClick={() => setShowDetail(!showDetail)}
        >
          {showDetail ? 'Default' : 'Advance'}
          {' >'}
        </p>
      </div>

      {showDetail ? (
        <div className="bg-[var(--input-background-color)] p-[16px] rounded-[5px]">
          <p>Select vesting batch</p>
          <div className="flex pl-[60px] justify-between">
            <div className="text-[14px]">End Date</div>
            <div className="text-[14px]">Not Yet Vested</div>
          </div>
          {batchs.map((item) => (
            <div className="flex mt-[8px]">
              <Checkbox
                className="w-[60px]"
                value={item.index}
                onChange={onChange}
              />
              <div className="flex-1 text-[16px]">{item.endTime}</div>
              <div className="text-[16px]">{fb4(item.vestingAmount)} FXN</div>
            </div>
          ))}
        </div>
      ) : null}

      <NoticeCard
        content={[
          `Once you convert, your vesting FXN will convert to ${_currentStrategy.title}, and you will receive extra rewards. This action is irreversible.`,
        ]}
      />

      <Button
        className="mt-[32px]"
        width="100%"
        height="56px"
        onClick={handleConvertFn}
        loading={converting}
        disabled={!canConvert}
      >
        Convert
      </Button>
    </Modal>
  )
}
