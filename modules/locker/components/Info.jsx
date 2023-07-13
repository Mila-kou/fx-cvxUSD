import React from 'react'
import { Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'

export default function Info({ title, value }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <div>{title}</div>
      {value && <div className="color-blue">{value}</div>}
    </div>
  )
}

export function VeLockerRules({ status }) {
  return (
    <div className=" form-label text-xl mb-3 flex items-center gap-3 mt-4">
      <div>{status == 'no-lock' ? 'Duration' : 'Extend To'}</div>
      <Tooltip
        overlayClassName="lock-to-tooltip"
        title={
          <div>
            Locking CLEV will receive veCLEV. <br />
            The longer the lock time, the more veCLEV received.
            <br />
            1 CLEV locked for 4 years = 1 veCLEV
            <br />
            1 CLEV locked for 3 years = 0.75 veCLEV
            <br />
            1 CLEV locked for 2 years = 0.5 veCLEV
            <br />1 CLEV locked for 1 year = 0.25 veCLEV
          </div>
        }
      >
        <QuestionCircleOutlined />
      </Tooltip>
    </div>
  )
}
