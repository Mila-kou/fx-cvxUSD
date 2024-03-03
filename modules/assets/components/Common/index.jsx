import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import cn from 'classnames'
import { Tooltip } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import { dollarText } from '@/utils/index'
import styles from './styles.module.scss'

export function DetailCell({
  title,
  isGreen,
  content: [num1 = '', num2, num3],
  tooltip,
}) {
  return (
    <div className={cn(styles.detailCell, isGreen ? styles.green : '')}>
      <p>
        {title}
        {tooltip ? (
          <Tooltip
            placement="top"
            title={<p className="text-[16px] py-[8px]">{tooltip}</p>}
            arrow
            color="#000"
          >
            <InfoCircleOutlined />
          </Tooltip>
        ) : null}
      </p>
      <div className={styles.content}>
        <span>{num1}</span>{' '}
        {num2 && num2 !== '-' ? `(${dollarText(num2)})` : ''}
        {num3 || null}
      </div>
    </div>
  )
}

export function BonusCard({ title, amount, symbol }) {
  return (
    <div className={styles.bonusCard}>
      <p>{title}</p>
      <p>
        <span>{amount}</span> {symbol}
      </p>
    </div>
  )
}

export function NoticeCard({ content = [] }) {
  return (
    <div className={styles.noticeCard}>
      <p className={styles.title}>Notice</p>
      {content.map((item) => (
        <p>{item}</p>
      ))}
    </div>
  )
}

export function ChangedPrice({ value, sufix = '%', isRed }) {
  const color =
    value > 0
      ? 'text-[var(--green-color)]'
      : isRed
      ? 'text-[var(--red-color)]'
      : 'text-[var(--yellow-color)]'

  return (
    <span className={`${color} text-[16px]`}>
      {value > 0 ? '+' : ''}
      {value}
      {sufix}
    </span>
  )
}
