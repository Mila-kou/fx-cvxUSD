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
    getAdd_N_F,
    getN_X,
    getAdd_N_X,
    getP_F,
    getP_X,
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

  const [initData, setInitData] = useState({
    f_ß: '0.1',
    n: '2',
    s0: '1890.00',
    s1: '1890',
    n_f: '1890.0000',
    n_x: '1890.0000',
    limitRatio: '1.3055',
    fNav_0: '1',
    xNav_0: '1',
    p_f: '0.5',
    p_x: '0.5',

    λ_f: "0.1170"
  })

  const [pageData, setPageData] = useState({})

  const [mintPageData, setMintPageData] = useState({})
  const [stabilityPageData, setStabilityPageData] = useState({})

  const [ethPrice, setEthPrice] = useState(0)

  const [mintType, setMintType] = useState('fETH')
  const [mintETHNum, setMintETHNum] = useState(0)
  const [stabilityMode_mintETHNum, setStabilityMode_mintETHNum] = useState(0)

  const handleChange_CurrentETHPrice = (e) => {
    // console.log('CurrentETHPrice--', e.toString(10))
    // setCommonData((pre) => {
    //   return {
    //     ...pre,
    //     s1: e
    //   }
    // })
    setEthPrice(e)
  }

  /////////////////// Mint /////////////////////  
  const handleChange_mintETHNum = (e) => {
    setMintETHNum(e)
  }

  const handleChange_stabilityMode_mintETHNum = (e) => {
    setStabilityMode_mintETHNum(e)
  }

  const handleMint_stabilityMode = () => {
    // const _a =
  }

  const handleUpdateETHPrice = () => {
    const data = UpdateETHPrice()
    setPageData(data)
  }

  const handleMint = () => {
    const data = MintETH()
    setMintPageData(data)
    // updateStabilityPageData()
  }

  const UpdateETHPrice = () => {
    const _r = getR({
      s0: initData.s0,
      s: ethPrice
    })
    const _fNav = getFNav({
      f_ß: initData.f_ß,
      r: _r,
      initFNav: initData.fNav_0
    })
    const _p_f = getP_F({
      fNav: _fNav,
      n_f: initData.n_f,
      s: ethPrice,
      n: initData.n,
    })

    const _n_f = initData.n_f
    const _n_x = initData.n_x

    const _xNav = getXNav({
      n: initData.n,
      s: ethPrice,
      fNav: _fNav,
      n_f: _n_f,
      n_x: _n_x
    })

    const _p_x = getP_X({
      n: initData.n,
      s: ethPrice,
      xNav: _xNav,
      n_x: _n_x
    })


    const _fETH_Collecteral_Ratio = get_fETH_Collecteral_Ratio({
      p_f: _p_f
    })

    const _stabilityModePrice = getStabilityModePrice({
      fNav: _fNav,
      n_f: _n_f,
      n: initData.n
    })

    const _userLiquidationModePrice = getUserLiquidationModePrice({
      fNav: _fNav,
      n_f: _n_f,
      n: initData.n
    })

    const _protocolLiquidationModePrice = getProtocolLiquidationModePrice({
      fNav: _fNav,
      n_f: _n_f,
      n: initData.n
    })

    const _systemStatus = systemStatus({
      limitCollecteralRatio: _fETH_Collecteral_Ratio
    })
    return {
      r: _r,
      p_f: _p_f,
      n_f: _n_f,
      fNav: _fNav,
      xNav: _xNav,
      n_x: _n_x,
      fETH_Collecteral_Ratio: _fETH_Collecteral_Ratio,
      stabilityModePrice: _stabilityModePrice,
      userLiquidationModePrice: _userLiquidationModePrice,
      protocolLiquidationModePrice: _protocolLiquidationModePrice,

      systemStatus: _systemStatus
    }
  }

  const MintETH = () => {
    const _r = getR({
      s0: initData.s0,
      s: ethPrice
    })

    const _fNav = pageData.fNav

    const _add_n_f = getAdd_N_F({
      n: mintETHNum,
      s: ethPrice,
      m_r: 1,
      fNav: _fNav
    })

    const _new_n_f = (initData.n_f * 1 + _add_n_f * 1)

    const _new_n = initData.n * 1 + mintETHNum * 1

    const _new_p_f = getP_F({
      fNav: _fNav,
      n_f: _new_n_f,
      s: ethPrice,
      n: _new_n,
    })

    const _xNav = pageData.xNav

    const _add_n_x = getAdd_N_X({
      n: mintETHNum,
      s: ethPrice,
      m_r: 0,
      xNav: _xNav
    })

    const _new_n_x = (initData.n_x * 1 + _add_n_x * 1)

    const _fETH_Collecteral_Ratio = get_fETH_Collecteral_Ratio({
      p_f: _new_p_f
    })

    const _stabilityModePrice = getStabilityModePrice({
      fNav: _fNav,
      n_f: _new_n_f,
      n: _new_n
    })

    const _userLiquidationModePrice = getUserLiquidationModePrice({
      fNav: _fNav,
      n_f: _new_n_f,
      n: _new_n
    })

    const _protocolLiquidationModePrice = getProtocolLiquidationModePrice({
      fNav: _fNav,
      n_f: _new_n_f,
      n: _new_n
    })

    const _systemStatus = systemStatus({
      limitCollecteralRatio: _fETH_Collecteral_Ratio
    })
    return {
      n: _new_n,
      r: _r,
      p_f: _new_p_f,
      n_f: mintType == 'fETH' ? _new_n_f : initData.n_f,
      fNav: _fNav,
      xNav: _xNav,
      n_x: mintType == 'xETH' ? _new_n_x : initData.n_x,
      fETH_Collecteral_Ratio: _fETH_Collecteral_Ratio,

      stabilityModePrice: _stabilityModePrice,
      userLiquidationModePrice: _userLiquidationModePrice,
      protocolLiquidationModePrice: _protocolLiquidationModePrice,
      systemStatus: _systemStatus
    }
  }

  const MintStabilityMode = () => {
    const _add_n_x = getAdd_N_X({
      n: stabilityMode_mintETHNum,
      s: ethPrice,
      m_r: 0,
      xNav: mintPageData.xNav
    })

    const _rx1 = getRx1({
      λ_f: initData.λ_f,
      Max_n_s: _max_n_s,
      p_f: mintPageData.p_f,
    })
    // const _bouns_n_x =
  }


  // Stability Data
  useEffect(() => {
    const _max_n_s = getMax_n_s({
      p_f: mintPageData.p_f,
      λ_f: initData.λ_f
    })

    const _rx1 = getRx1({
      λ_f: initData.λ_f,
      Max_n_s: _max_n_s,
      p_f: mintPageData.p_f,
    })

    const _max_n_s_eth = getMax_n_s_eth({
      Max_n_s: _max_n_s,
      n: mintPageData.n,
    })

    const _rf1 = getRf1({
      λ_f: initData.λ_f,
      n: mintPageData.n,
      max_n_s: _max_n_s,
      p_f: mintPageData.p_f,
    })

    const _bouns_n_x = getBouns_N_X({
      rx1: _rf1,
      n_x: mintPageData.n_x,
    })

    const _data = {
      max_n_s: _max_n_s,
      rx1: _rx1,
      rf1: _rf1,
      max_n_s_eth: _max_n_s_eth,
      bouns_n_x: _bouns_n_x
    }
    setStabilityPageData(_data)
  }, [mintPageData])

  return (
    <div>
      <div className={styles.card}>
        fETH Beta系数 ，合约设置 (f_ß) :{initData.f_ß}
      </div>
      <div className={styles.card}>
        初始ETH池子数量 (n): {initData.n}
      </div>
      <div className={styles.card}>
        初始fETH池子数量 (n_f): {initData.n_f}
      </div>
      <div className={styles.card}>
        初始xETH池子数量 (n_x): {initData.n_x}
      </div>
      <div className={styles.card}>
        初始化ETH价格 (s_0): {initData.s0}
      </div>
      <div className={styles.card}>
        触发稳定机制限制  (fETH Collecteral Ratio): {initData.limitRatio}
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
        <Button onClick={handleUpdateETHPrice}>更新价格</Button>
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
        <Button onClick={handleMint}>开始mint</Button>
      </div>
      <div style={{
        paddingLeft: '20px'
      }}>
        Mint后系统状态：<br />
        ETH数量: {mintPageData.n}<br />
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



          激励比例λ_f： {initData.λ_f}<br />

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
          <Button>开始mintxETH</Button>
        </div>
      }
    </div>
  )
}
