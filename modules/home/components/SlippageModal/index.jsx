import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Modal } from 'antd'
import { useToggle, useSetState } from 'ahooks'
import styles from './styles.module.scss'

export function useSlippage(initSlippage = 0) {
  const [visible, { toggle }] = useToggle()
  const [slippage, setSlippage] = useState(initSlippage)

  return useMemo(
    () => ({
      visible,
      toggle,
      slippage,
      setSlippage,
      initSlippage,
    }),
    [visible, toggle, slippage, setSlippage, initSlippage]
  )
}

export default function SlippageModal(props) {
  const { visible, toggle, slippage, setSlippage, initSlippage } = props
  const [slippageTab, setSlippageTab] = useState(0)

  const [val, setVal] = useState(slippage)

  useEffect(() => {
    if (slippageTab == 0) {
      setVal(initSlippage)
      setSlippage(initSlippage)
    }
  }, [slippageTab])

  const handleInputChange = (e) => {
    let { value } = e.target

    const charReg = /[^\d.]/g

    if (charReg.test(value)) {
      value = value.replace(charReg, '')
    }

    const _val = Number(value)

    if (_val.isNaN) {
      setVal('')
    } else if (_val > 5) {
      setVal(5)
    } else {
      setVal(value)
    }
  }

  const close = () => {
    setSlippage(Number(val))
    toggle()
  }

  return (
    <Modal
      centered
      visible={visible}
      closable={false}
      onCancel={close}
      footer={null}
      width={440}
    >
      <div className={styles.content}>
        <p>Max Slippage</p>
        <div className={styles.tabs}>
          {['Auto', 'Custom'].map((item, index) => (
            <div
              key={item}
              className={styles.tab}
              data-active={slippageTab === index}
              onClick={() => {
                setSlippageTab(index)
              }}
            >
              {item}
            </div>
          ))}
        </div>
        <div className={styles.inputContent}>
          <input
            onChange={handleInputChange}
            value={val}
            disabled={slippageTab == 0}
          />
          <div className={styles.suffix}>%</div>
        </div>
      </div>
    </Modal>
  )
}
