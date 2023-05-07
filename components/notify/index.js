import React from 'react'
import { notification } from 'antd'
import { LoadingOutlined, CheckCircleOutlined } from '@ant-design/icons'
import TxLink from '@/components/TxLink'

const info = (obj) => {
  notification.info({
    ...obj,
    icon: <LoadingOutlined />,
    duration: null,
  })
}

const success = (obj) => {
  notification.success({
    ...obj,
    description: <TxLink txHash={obj.txHash} />,
    icon: <CheckCircleOutlined style={{ color: 'green' }} />,
  })
}

const txnSubmitted = (obj) => {
  notification.info({
    ...obj,
    description: <TxLink txHash={obj.txHash} />,
    icon: <LoadingOutlined style={{ color: 'green' }} />,
    duration: null,
  })
}

const error = (obj) => {
  notification.error({
    ...obj,
    description: `An error occurred: ${obj.description.toString()}`,
    icon: <CheckCircleOutlined style={{ color: 'red' }} />,
  })
}

const close = (key) => {
  notification.destroy(key)
}

export default {
  info,
  success,
  error,
  close,
  txnSubmitted,
}
