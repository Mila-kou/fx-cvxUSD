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
            Locking f(x) will receive vef(x). <br />
            The longer the lock time, the more vef(x) received.
            <br />
            1 f(x) locked for 4 years = 1 vef(x)
            <br />
            1 f(x) locked for 3 years = 0.75 vef(x)
            <br />
            1 f(x) locked for 2 years = 0.5 vef(x)
            <br />1 f(x) locked for 1 year = 0.25 vef(x)
          </div>
        }
      >
        <QuestionCircleOutlined />
      </Tooltip>
    </div>
  )
}
