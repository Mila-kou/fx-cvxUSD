import React from 'react'
import { Popover } from 'antd'
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
    <div className="text-xl mb-3 flex items-center gap-3 mt-4">
      <div>{status == 'no-lock' ? 'Duration' : 'Extend To'}</div>
      <Popover
        color="rgba(0, 0, 0, 0.8)"
        content={
          <div style={{ color: '#fff' }}>
            Locking FXN will receive veFXN. <br />
            The longer the lock time, the more veFXN received.
            <br />
            1 FXN locked for 4 years = 1 veFXN
            <br />
            1 FXN locked for 3 years = 0.75 veFXN
            <br />
            1 FXN locked for 2 years = 0.5 veFXN
            <br />1 FXN locked for 1 year = 0.25 veFXN
          </div>
        }
      >
        <QuestionCircleOutlined />
      </Popover>
    </div>
  )
}
