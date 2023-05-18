import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from 'antd'
import SimpleInput from '@/components/SimpleInput'
import styles from './styles.module.scss'
import useWeb3 from '@/hooks/useWeb3'
import config from '@/config/index'
import { cBN, checkNotZoroNum, fb4 } from '@/utils/index'
import { useToken } from '@/hooks/useTokenInfo'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import { getGas } from '@/utils/gas'
import useFxCommon from '../home/hooks/useFxCommon'


export default function TestPage() {
  const {
    getR,
    getFNav,
    getXNav,
    getN_F,
    getN_X,
    getP_F,
    getp_x,
    getM_NF,
    getM_NX,
    _computeMultiple,
    get_fETH_Collecteral_Ratio,

    getMax_n_s,
    getMax_n_s_eth,
    getRx1,
    getRf1,
    fETHCollecteralRatio
  } = useFxCommon()
  const [clearInputTrigger, setClearInputTrigger] = useState(0)

  const [commonData, setCommonData] = useState({
    f_ß: '0.1',
    n: '2',
    s0: '1890.00',
    s1: '1890',
    limitRatio: '1.3055',
    fNav_0: '1',
    xNav_0: '1',
  })

  const [newCommonData, setNewCommonData] = useState({
    f_ß: '0.1',
    n: '2',
    s0: '1890.00',
    s1: '1890',
    limitRatio: '1.3055',
    fNav_0: '1',
    xNav_0: '1',
  })
  const [systemData, setSystemData] = useState({
    r: "0",
    n_f: ''
  })
  const [newSystemData, setNewSystemData] = useState({
    r: "0",
    n_f: ''
  })
  const [mintType, setMintType] = useState('fETH')
  const [mintETHNum, setMintETHNum] = useState(0)

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
    console.log('CurrentETHPrice--', e.toString(10))
    setCommonData((pre) => {
      return {
        ...pre,
        s1: e
      }
    })
  }

  /////////////////// Mint /////////////////////  
  const handleChange_mintETHNum = (e) => {
    console.log('mintETHNum--', e)
    const _n = cBN(commonData.n).plus(e).toString(10)
    setNewCommonData((pre) => {
      return {
        ...pre,
        n: _n
      }
    })
    setMintETHNum(e)
  }

  const pageData = useMemo(() => {
    const _r = getR({
      s0: commonData.s0,
      s: commonData.s1
    })
    const _fNav = getFNav({
      f_ß: commonData.f_ß,
      r: _r,
      initFNav: commonData.fNav_0
    })
    const _p_f = getP_F({
      fNav: _fNav,
      n_f: systemData.n_f,
      s: commonData.s1,
      n: commonData.n,
    })
    const _n_f = getN_F({
      n: commonData.n,
      s0: commonData.s0,
      p_f: _p_f,
      fNav: _fNav
    })
    const _xNav = getXNav({
      f_ß: commonData.f_ß,
      r: _r,
      initXNav: commonData.xNav_0
    })
    const _n_x = getN_X({
      n: commonData.n,
      s0: commonData.s0,
      p_f: _p_f,
      xNav: _xNav
    })
    const _fETH_Collecteral_Ratio = get_fETH_Collecteral_Ratio({
      p_f: _p_f
    })
    setSystemData((pre) => {
      return {
        ...pre,
        n_f: checkNotZoroNum(pre.n_f) ? pre.n_f : _n_f,
        n_x: checkNotZoroNum(pre.n_x) ? pre.n_x : _n_x
      }
    })
    return {
      r: _r,
      p_f: _p_f,
      n_f: checkNotZoroNum(systemData.n_f) ? systemData.n_f : _n_f,
      fNav: _fNav,
      xNav: _xNav,
      n_x: checkNotZoroNum(systemData.n_x) ? systemData.n_x : _n_x,
      fETH_Collecteral_Ratio: _fETH_Collecteral_Ratio
    }
  }, [commonData])

  const mintPageData = useMemo(() => {
    const _r = getR({
      s0: commonData.s0,
      s: commonData.s1
    })

    const _fNav = pageData.fNav
    //  getFNav({
    //   f_ß: commonData.f_ß,
    //   r: _r,
    //   initFNav: commonData.fNav_0
    // })


    const _add_n_f = getN_F({
      n: mintETHNum,
      s0: commonData.s1,
      p_f: 1,
      fNav: _fNav
    })
    console.log('_add_n_f---', _add_n_f)

    const _new_p_f = getP_F({
      fNav: _fNav,
      n_f: (systemData.n_f * 1 + _add_n_f * 1),
      s: commonData.s1,
      n: newCommonData.n,
    })

    const _xNav = pageData.xNav
    // getXNav({
    //   f_ß: commonData.f_ß,
    //   r: _r,
    //   initXNav: commonData.xNav_0
    // })

    const _add_n_x = getN_X({
      n: mintETHNum,
      s0: commonData.s1,
      p_f: 1,
      xNav: _xNav
    })

    // const _n_x = getN_X({
    //   n: commonData.n,
    //   s0: commonData.s0,
    //   p_f: _new_p_f,
    //   xNav: _xNav
    // })

    const _fETH_Collecteral_Ratio = get_fETH_Collecteral_Ratio({
      p_f: _new_p_f
    })
    setNewSystemData((pre) => {
      return {
        ...pre,
        // n_f: checkNotZoroNum(pre.n_f) ? pre.n_f : _new_p_f,
        // n_x: checkNotZoroNum(pre.n_x) ? pre.n_x : _n_x
      }
    })
    return {
      r: _r,
      p_f: _new_p_f,
      n_f: mintType == 'fETH' ? (systemData.n_f * 1 + _add_n_f * 1) : systemData.n_f,
      fNav: _fNav,
      xNav: _xNav,
      n_x: mintType == 'xETH' ? (systemData.n_x * 1 + _add_n_x * 1) : systemData.n_x,
      fETH_Collecteral_Ratio: _fETH_Collecteral_Ratio
    }
  }, [mintETHNum, commonData])

  return (
    <div>
      <div className={styles.card}>
        fETH Beta系数 ，合约设置 (f_ß) :{commonData.f_ß}
        {/* <SimpleInput
          placeholder=""
          hidePercent
          onChange={handleChange_Beta}
          className={styles.input}
        /> */}
      </div>
      <div className={styles.card}>
        初始ETH池子数量 (n): {commonData.n}
        {/* <SimpleInput
          placeholder=""
          hidePercent
          onChange={handleChange_ETHTotalsupply}
          className={styles.input}
        /> */}
      </div>
      <div className={styles.card}>
        初始化ETH价格 (s_0): {commonData.s0}
        {/* <SimpleInput
          placeholder=""
          decimals={0}
          onChange={handleChange_InitETHPrice}
          className={styles.input}
        /> */}
      </div>
      <div className={styles.card}>
        触发稳定机制限制  (fETH Collecteral Ratio): {commonData.limitRatio}
        {/* <SimpleInput
          placeholder=""
          onChange={handleChange_LimitRatio}
          className={styles.input}
        /> */}
      </div>

      <div>计算：</div>
      <div>
        当前ETH价格
        <SimpleInput
          placeholder=""
          decimals={0}

          onChange={handleChange_CurrentETHPrice}
          className={styles.input}
        />
      </div>
      <div style={{
        paddingLeft: '20px'
      }}>
        当前系统状态：<br />
        fNav: {pageData.fNav}<br />
        n_f/fETH: {pageData.n_f}<br />
        xNav: {pageData.xNav}<br />
        n_x/xETH: {pageData.n_x}<br />
        p_f(RHO):{pageData.p_f} <br />
        r: {pageData.r}<br />
        fETH Collecteral Ratio:{pageData.fETH_Collecteral_Ratio * 100} %<br />
      </div>

      <div>Mint</div>
      <div>
        MintType: {mintType}<br />
        质押ETH数量(m_n)：
        <SimpleInput
          placeholder=""
          decimals={0}
          onChange={handleChange_mintETHNum}
          className={styles.input}
        />
      </div>
      <div style={{
        paddingLeft: '20px'
      }}>
        Mint后系统状态：<br />
        fNav: {mintPageData.fNav}<br />
        n_f/fETH: {mintPageData.n_f}<br />
        xNav: {mintPageData.xNav}<br />
        n_x/xETH: {mintPageData.n_x}<br />
        p_f(RHO):{mintPageData.p_f} <br />
        r: {mintPageData.r}<br />
        fETH Collecteral Ratio:{mintPageData.fETH_Collecteral_Ratio * 100} %<br />
      </div>
      {/* <div>铸造比例(m_r)：</div>
      <div>铸造fETH的数量(m_nf=m_n*s*m_r/f)：</div> */}
    </div>
  )
}
