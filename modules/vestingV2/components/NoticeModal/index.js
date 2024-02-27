import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Modal, Checkbox } from 'antd'
import Button from '@/components/Button'
import styles from './styles.module.scss'

export default function NoticeModal({ onCancel, goConvert, goClaim }) {
  return (
    <Modal onCancel={onCancel} visible footer={null} width="500px">
      <div className={styles.info}>Get More Reward ?</div>

      <p className="text-[18px] ">
        Recommended convert your vesting $FXN to $cvxFXN or $sdFXN to earn extra
        rewards.
      </p>
      <Button width="100%" className="mt-[48px]" onClick={goConvert}>
        Go To Convert
      </Button>
      <Button
        type="second"
        width="100%"
        className="mt-[16px]"
        onClick={goClaim}
      >
        Continue To Claim
      </Button>
    </Modal>
  )
}
