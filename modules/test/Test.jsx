import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from 'antd'
import SimpleInput from '@/components/SimpleInput'
import styles from './styles.module.scss'
import useIDO from './controller/useIDO'
import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import { cBN, fb4 } from '@/utils/index'
import Countdown from './Countdown/index'
import { useToken } from '@/hooks/useTokenInfo'
import { tokensList } from '@/config/ido'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import { getGas } from '@/utils/gas'

const depositTokenInfo = tokensList.depositTokens[0]

export default function IdoPage() {
  const PageData = useFxCommon()
  const [clearInputTrigger, setClearInputTrigger] = useState(0)

  const [commonData, setCommonData] = useState({
    f_ß: '0.1',
    n: '2',
    s0: '1800',
    s1: '1800',
    limitRatio: '1.3055',
    fNav_0: '1',
    xNav_0: '1',
  })

  const handleChange_Beta = (e) => {
    console.log(e)
    setCommonData((pre) => {
      return {
        ...pre,
        f_ß: e
      }
    })
  }

  const handleChange_ETHTotalsupply = (e) => {
    console.log(e)
    setCommonData((pre) => {
      return {
        ...pre,
        n: e
      }
    })
  }

  const handleChange_InitETHPrice = (e) => {
    console.log(e)
    setCommonData((pre) => {
      return {
        ...pre,
        s0: e
      }
    })
  }

  const handleChange_LimitRatio = (e) => {
    console.log(e)
    setCommonData((pre) => {
      return {
        ...pre,
        limitRatio: e
      }
    })
  }

  const handleChange_CurrentETHPrice = (e) => {
    console.log(e)
    setCommonData((pre) => {
      return {
        ...pre,
        s1: e
      }
    })
  }

  const pageData = useMemo(() => {

  }, [])
  return (
    <>
      <p className={styles.card}>
        fETH Beta系数 ，合约设置 (f_ß)
        <SimpleInput
          placeholder=""
          hidePercent
          onChange={handleChange_Beta}
          className={styles.input}
        />
      </p>
      <p className={styles.card}>
        ETH池子数量 (n)
        <SimpleInput
          placeholder=""
          hidePercent
          onChange={handleChange_ETHTotalsupply}
          className={styles.input}
        />
      </p>
      <p className={styles.card}>
        初始化ETH价格 (s_0)
        <SimpleInput
          placeholder=""
          onChange={handleChange_InitETHPrice}
          className={styles.input}
        />
      </p>
      <p className={styles.card}>
        触发稳定机制限制  (fETH Collecteral Ratio)
        <SimpleInput
          placeholder=""
          onChange={handleChange_LimitRatio}
          className={styles.input}
        />
      </p>

      <p>计算：</p>
      <p>
        当前ETH价格
        <SimpleInput
          placeholder=""
          onChange={handleChange_CurrentETHPrice}
          className={styles.input}
        />
      </p>
      <p>
        当前系统状态：<br />
        fNav:<br />
        n_f/fETH:<br />
        xNav:<br />
        n_x/xETH:<br />
        ρ_f(RHO):<br />
        r:<br />
        fETH Collecteral Ratio:<br />
      </p>

      <p>质押状况</p>
      <p>质押ETH数量(m_n)：</p>
      <p>铸造比例(m_r)：</p>
      <p>铸造fETH的数量(m_nf=m_n*s*m_r/f)：</p>
    </>
  )
}
