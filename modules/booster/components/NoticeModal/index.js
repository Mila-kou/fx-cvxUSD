import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Modal, Checkbox } from 'antd'
import moment from 'moment'
import { cBN, fb4, checkNotZoroNum } from 'utils'
import { NoticeCard } from '@/modules/home/components/Common'
import Button from '@/components/Button'
import Tabs from '@/modules/home/components/Tabs'
import styles from './styles.module.scss'
import useVesting from '../../controller/useVesting'
import { useGlobal } from '@/contexts/GlobalProvider'

export default function NoticeModal({ onCancel, goConvert, goClaim }) {
  return (
    <Modal onCancel={onCancel} visible footer={null} width="500px">
      <div className={styles.info}>Get More Reward ?</div>

      <p className="text-[18px] ">
        Convert $FXN to $cvxFXN or $sdFXN to earn extra rewards
      </p>
      <Button width="100%" className="mt-[48px]" onClick={goConvert}>
        Convert
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
