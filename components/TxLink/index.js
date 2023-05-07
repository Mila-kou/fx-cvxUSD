import React from 'react'
import config from '@/config/index'

export default function TxLink(props) {
  const { txHash } = props
  return (
    <div>
      Tx Hash is{' '}
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`${config.explorerUri}/tx/${txHash}`}
      >
        {txHash}
      </a>
    </div>
  )
}
