import React, { useState, useEffect } from 'react'
import { Modal } from 'antd'
import PointsPerToken from '../PointsPerToken'
import Button from '@/components/Button'
import useGlobal from '@/hooks/useGlobal'

import styles from './styles.module.scss'

export default function CreateModal({ onCancel }) {
  const { processCreate } = useGlobal()
  const [loading, setLoading] = useState(false)
  const [errText, setErrText] = useState('')
  const [inputVal, setInputVal] = useState('')

  const create = async () => {
    setErrText('')
    setLoading(true)
    const err = await processCreate(inputVal)
    setLoading(false)
    setErrText(err)
    if (!err) {
      onCancel()
    }
  }

  return (
    <Modal visible centered onCancel={onCancel} footer={null} width={600}>
      <div className={styles.content}>
        <h2 className="mb-[16px]">Create Referral Link</h2>

        {/* <p>
          Anyone who mint fx asset using this referral link, you will get fx
          points.
        </p> */}
        {/* <PointsPerToken /> */}

        <p className="mt-[32px] mb-[10px]">Set Your Referral Code</p>
        <input
          value={inputVal}
          onChange={(e) => {
            setInputVal(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))
            setErrText('')
          }}
          placeholder="Create a random referral code"
          maxLength={10}
        />
        <p className="mt-[6px] text-[14px] text-[var(--red-color)]">
          {errText}
        </p>

        <p className="text-[16px] text-[var(--second-text-color)] mt-[16px]">
          1. Min 4 characters and max 10 characters, use numbers and letters
          only. <br />
          2. Once set, the referral code is permanent and cannot be changed.
        </p>
        <Button
          className="w-full mt-[32px]"
          disabled={inputVal.length > 0 && inputVal.length < 4}
          onClick={create}
          loading={loading}
        >
          Create
        </Button>
      </div>
    </Modal>
  )
}
