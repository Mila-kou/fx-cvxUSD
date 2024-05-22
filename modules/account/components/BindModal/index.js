import React, { useState, useEffect } from 'react'
import { Modal } from 'antd'
import PointsPerToken from '../PointsPerToken'
import Button from '@/components/Button'
import useGlobal from '@/hooks/useGlobal'

import styles from './styles.module.scss'

export default function BindModal({ onCancel }) {
  const [errText, setErrText] = useState('')
  const [loading, setLoading] = useState(false)

  const { code, setCode, processSign } = useGlobal()

  const bind = async () => {
    setErrText('')
    setLoading(true)
    const err = await processSign()
    setLoading(false)
    setErrText(err)
    if (!err) {
      onCancel()
    }
  }

  return (
    <Modal visible centered onCancel={onCancel} footer={null} width={600}>
      <div className={styles.content}>
        {/* <h2 className="mb-[16px]">FX Points Season</h2>

        <p className="text-[16px]">Welcome to FX Protocol Points Season.</p> */}
        <h2 className="flex gap-[6px] mb-[16px]">How to earn?</h2>
        {/* <p className="mt-[10px] text-[16px]">
          Now if you binding a referral code, you will receive Points when you
          mint fx Token.
        </p> */}
        <p className="mt-[10px]">
          4 FX/day for 1 fToken staked in any Stability Pool and/or LP on
          Convex/f(x).
        </p>
        <p className="mt-[10px]">
          2 FX/day for 1 xToken held in wallet and/or LP on Curve/Convex/f(x).
        </p>
        <p className="mt-[10px]">
          50% - 50% FX split between referrer and referral.
        </p>

        {/* <p className="mt-[32px]">Invitees</p>
        <PointsPerToken />
        <p className="mt-[32px]">Inviter</p>
        <PointsPerToken /> */}

        <p className="mt-[32px] mb-[10px]">Enter a code</p>
        <input
          value={code}
          onChange={(e) => {
            setCode(e.target.value)
            setErrText('')
          }}
          maxLength={10}
        />
        <p className="mt-[6px] text-[14px] text-[var(--red-color)]">
          {errText}
        </p>
        <Button
          disabled={code.length < 4}
          className="w-full mt-[32px]"
          onClick={bind}
          loading={loading}
        >
          Binding
        </Button>
      </div>
    </Modal>
  )
}
