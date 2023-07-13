import React, { useState } from 'react'
import cn from 'classnames'
import styles from './styles.module.scss'
import useTokens from '@/hooks/useTokenInfo'
import { formatBalance } from '@/utils/index'

const clevLogo = '/assets/tokens/clev.svg'

function Info({ name, value, nocolon }) {
  return (
    <div>
      <span className="color-light-blue">
        {name}
        {nocolon ?? ':'}
      </span>
      {value && <span>{value}</span>}
    </div>
  )
}

export default function TokenSelectV1(props) {
  const { hint, title, options, onChange, value } = props
  const [optionVisible, setOptionVisible] = useState(false)

  const { tokenBalance } = useTokens(options)

  const handleSelectChange = (token) => {
    if (onChange) {
      onChange(token)
      setOptionVisible(false)
    }
  }

  const renderIcon = (isLp, icon, hideCrv, option) => {
    const imgSrc = icon.includes('/assets')
      ? icon
      : `/assets/crypto-icons-stack.svg#${icon}`
    const _style = {
      background: '#fff',
      borderRadius: '100%',
    }
    const isBg = option.symbol.toLowerCase().indexOf('silo') > -1
    if (isLp) {
      return (
        <div className="relative">
          <img
            src={imgSrc}
            className="w-6 mr-2"
            alt="icon"
            style={isBg ? _style : { borderRadius: '100%' }}
          />
          {!hideCrv && (
            <div className="absolute bg-white right-1 bottom-0 p-1 w-4 h-4 rounded-full">
              {' '}
              <img src={clevLogo} className="w-2" alt="crv-logo" />
            </div>
          )}
        </div>
      )
    }

    return (
      <img
        src={imgSrc}
        className="w-6 mr-2"
        style={isBg ? _style : { borderRadius: '100%' }}
      />
    )
  }

  return (
    <div className={styles.selectWrapper}>
      <div className={styles.selectTop}>{title && <Info name={title} />}</div>
      <div className={styles.selectBox}>
        <div
          className={cn(styles.select, 'flex justify-between items-center')}
          onClick={() => setOptionVisible((prev) => !prev)}
        >
          <div className="flex items-center">
            {renderIcon(value.isLp, value?.icon, value?.hideCrv, value)}
            {value?.symbol}
          </div>
          <img src="/assets/arrow-down.svg" className="w-6" alt="arrow-down" />
        </div>
        <div className={cn(styles.options, optionVisible && styles.visible)}>
          {options
            .filter((item) => item.address)
            .map((option, index) => (
              <div
                key={option.address}
                onClick={() => handleSelectChange(option)}
                className={cn(
                  'flex items-center justify-between',
                  styles.option,
                  option.address === value.address && styles.active
                )}
              >
                <div className="flex items-center">
                  {renderIcon(
                    option.isLp,
                    option?.icon,
                    option?.hideCrv,
                    option
                  )}
                  {option?.symbol}
                </div>
                <div className="text-align-right">
                  <div>
                    {tokenBalance[index]
                      ? formatBalance(
                          tokenBalance[index],
                          option.decimals ?? 18,
                          4
                        )
                      : 0}
                  </div>
                  {/* <div className="text-xs">~$300,000</div> */}
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className={styles.selectBottom}>
        {hint && <Info nocolon name={hint} />}
      </div>
    </div>
  )
}
