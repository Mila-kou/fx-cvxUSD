import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { cBN, fb4, checkNotZoroNum } from 'utils'
import Tabs from '@/modules/home/components/Tabs'
import styles from './styles.module.scss'
import DelegateShareModal from '../DelegateShareModal'

export default function DelegateShare({ refreshAction }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [showModal, setShowModal] = useState(false)

  const isShare = activeIndex === 1

  const typeList = [
    {
      title: 'Delegation',
      subTitle: 'These addresses are delegated to use your veFXN.',
      list: [1, 1, 1],
    },
    {
      title: 'Share',
      subTitle: 'These addresses can share your veFXN boosting.',
      list: [1, 1, 1],
    },
  ]

  const handleCancel = (item) => {
    if (isShare) {
      //
    }
  }

  return (
    <div>
      <Tabs
        selecedIndex={activeIndex}
        onChange={(v) => setActiveIndex(v)}
        tabs={typeList.map((item) => item.title)}
      />
      <div onClick={() => setShowModal(true)} className="cursor-pointer">
        <p className="text-[16px] mt-[16px] underline text-[var(--a-button-color)]">
          + New {typeList[activeIndex].title}
        </p>
        <p className="text-[16px] my-[16px]">
          {typeList[activeIndex].subTitle}
        </p>
      </div>

      <div className="bg-[var(--input-background-color)] p-[16px] rounded-[5px]">
        <div className="flex  justify-between">
          <div className="text-[14px]">Address</div>
          <div className="text-[14px]">Duration</div>
          <div className="text-[14px]">Action</div>
        </div>
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {typeList[activeIndex].list.length ? (
            typeList[activeIndex].list.map((item) => (
              <div className="flex mt-[8px]">
                <div className="flex-1 text-[16px]">0x1234...1234</div>
                <div className="flex-1 text-[16px]">2023-12-12 08:00:00</div>
                <div
                  className="text-[16px]  text-[var(--a-button-color)] cursor-pointer"
                  onClick={() => handleCancel(item)}
                >
                  Cancel
                </div>
              </div>
            ))
          ) : (
            <p
              style={{
                height: '30px',
                textAlign: 'center',
                fontSize: '14px',
              }}
            >
              No Data
            </p>
          )}
        </div>
      </div>

      {showModal ? (
        <DelegateShareModal
          onCancel={() => setShowModal(false)}
          isShare={isShare}
          refreshAction={refreshAction}
        />
      ) : null}
    </div>
  )
}
