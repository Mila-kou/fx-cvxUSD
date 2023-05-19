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
    getBouns_N_X,
    fETHCollecteralRatio,

    getStabilityModePrice,
    getUserLiquidationModePrice,
    getProtocolLiquidationModePrice,
    systemStatus
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

  const [stabilityCommonData, setStabilityCommonData] = useState({
    λ_f: "0.1170"
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

  const handleChange_stabilityMode_mintETHNum = (e) => {
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

  //价格改变
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

    const _stabilityModePrice = getStabilityModePrice({
      fNav: _fNav,
      n_f: _n_f,
      n: commonData.n
    })

    const _userLiquidationModePrice = getUserLiquidationModePrice({
      fNav: _fNav,
      n_f: _n_f,
      n: commonData.n
    })

    const _protocolLiquidationModePrice = getProtocolLiquidationModePrice({
      fNav: _fNav,
      n_f: _n_f,
      n: commonData.n
    })

    const _systemStatus = systemStatus({
      limitCollecteralRatio: _fETH_Collecteral_Ratio
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
      fETH_Collecteral_Ratio: _fETH_Collecteral_Ratio,
      stabilityModePrice: _stabilityModePrice,
      userLiquidationModePrice: _userLiquidationModePrice,
      protocolLiquidationModePrice: _protocolLiquidationModePrice,

      systemStatus: _systemStatus
    }
  }, [commonData])

  //mint ETH
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

    const _new_n_f = (systemData.n_f * 1 + _add_n_f * 1)

    const _new_p_f = getP_F({
      fNav: _fNav,
      n_f: _new_n_f,
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

    const _new_n_x = (systemData.n_x * 1 + _add_n_x * 1)
    // const _n_x = getN_X({
    //   n: commonData.n,
    //   s0: commonData.s0,
    //   p_f: _new_p_f,
    //   xNav: _xNav
    // })

    const _fETH_Collecteral_Ratio = get_fETH_Collecteral_Ratio({
      p_f: _new_p_f
    })

    const _stabilityModePrice = getStabilityModePrice({
      fNav: _fNav,
      n_f: _new_n_f,
      n: newCommonData.n
    })

    const _userLiquidationModePrice = getUserLiquidationModePrice({
      fNav: _fNav,
      n_f: _new_n_f,
      n: newCommonData.n
    })

    const _protocolLiquidationModePrice = getProtocolLiquidationModePrice({
      fNav: _fNav,
      n_f: _new_n_f,
      n: newCommonData.n
    })

    const _systemStatus = systemStatus({
      limitCollecteralRatio: _fETH_Collecteral_Ratio
    })

    setNewSystemData((pre) => {
      return {
        ...pre,
        // n_f: checkNotZoroNum(pre.n_f) ? pre.n_f : _new_p_f,
        // n_x: checkNotZoroNum(pre.n_x) ? pre.n_x : _n_x
      }
    })
    return {
      n: newCommonData.n,
      r: _r,
      p_f: _new_p_f,
      n_f: mintType == 'fETH' ? _new_n_f : systemData.n_f,
      fNav: _fNav,
      xNav: _xNav,
      n_x: mintType == 'xETH' ? _new_n_x : systemData.n_x,
      fETH_Collecteral_Ratio: _fETH_Collecteral_Ratio,

      stabilityModePrice: _stabilityModePrice,
      userLiquidationModePrice: _userLiquidationModePrice,
      protocolLiquidationModePrice: _protocolLiquidationModePrice,
      systemStatus: _systemStatus
    }
  }, [mintETHNum, commonData])

  // Stability Data
  const stabilityPageData = useMemo(() => {
    const _max_n_s = getMax_n_s({
      p_f: mintPageData.p_f,
      λ_f: stabilityCommonData.λ_f
    })

    const _rx1 = getRx1({
      λ_f: stabilityCommonData.λ_f,
      Max_n_s: _max_n_s,
      p_f: mintPageData.p_f,
    })

    const _max_n_s_eth = getMax_n_s_eth({
      Max_n_s: _max_n_s,
      n: newCommonData.n,
    })

    const _rf1 = getRf1({
      λ_f: stabilityCommonData.λ_f,
      n: newCommonData.n,
      max_n_s: _max_n_s,
      p_f: mintPageData.p_f,
    })

    const _bouns_n_x = getBouns_N_X({
      rx1: _rf1,
      n_x: mintPageData.n_x,
    })



    setNewSystemData((pre) => {
      return {
        ...pre,
        // n_f: checkNotZoroNum(pre.n_f) ? pre.n_f : _new_p_f,
        // n_x: checkNotZoroNum(pre.n_x) ? pre.n_x : _n_x
      }
    })
    return {
      max_n_s: _max_n_s,
      rx1: _rx1,
      rf1: _rf1,
      max_n_s_eth: _max_n_s_eth,
      bouns_n_x: _bouns_n_x
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
        系统状态:{mintPageData.systemStatus}<br />

        Stability Model Price: ${pageData.stabilityModePrice}<br />
        User Liquidation Model Price: ${pageData.userLiquidationModePrice}<br />
        Protocol Liquidation Model Price: ${pageData.protocolLiquidationModePrice}<br />
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
        系统状态:{mintPageData.systemStatus}<br />

        Stability Model Price: ${mintPageData.stabilityModePrice}<br />
        User Liquidation Model Price: ${mintPageData.userLiquidationModePrice}<br />
        Protocol Liquidation Model Price: ${mintPageData.protocolLiquidationModePrice}<br />
      </div>
      {/* <div>铸造比例(m_r)：</div>
      <div>铸造fETH的数量(m_nf=m_n*s*m_r/f)：</div> */}

      {!!(mintPageData.systemStatus == 1) &&
        <div style={{
          paddingLeft: '20px'
        }}>
          稳定机制状态 <br />



          激励比例λ_f： {stabilityCommonData.λ_f}<br />

          最大追加抵押品占比Δn_s/n=(ρ-ρ_s)/(ρ_s+λ_f):{stabilityPageData.max_n_s} <br />
          xETH的增发幅度r_x1=(1+λ_f)*(Δn_s/n)/(1-ρ)
          :{stabilityPageData.rx1} <br />
          最大追加抵押品（ETH）Δn_s: {stabilityPageData.max_n_s_eth}<br />

          fETH付的稳定费率为: {stabilityPageData.rf1} <br />

          xETH的增发数量 Bouns:{stabilityPageData.bouns_n_x}

          <br />
          <br />
          <br />
          质押ETH数量(m_n)
          <SimpleInput
            placeholder=""
            decimals={0}
            onChange={handleChange_stabilityMode_mintETHNum}
            className={styles.input}
          />
        </div>
      }
    </div>
  )
}
