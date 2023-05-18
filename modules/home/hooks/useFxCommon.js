import { useEffect, useState, useContext, useCallback, useMemo } from 'react'
import { useQueries } from '@tanstack/react-query'
import moment from 'moment'
import { useContract, useFETH, useFX_Market, useFX_Treasury, useXETH } from 'hooks/useContracts'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import abis from '@/config/abi'
import config from '@/config/index'
import useWeb3 from '@/hooks/useWeb3'
import { cBN, fb4 } from '@/utils/index'
import useInfo from './useInfo'

const useFxCommon = () => {
    const { _currentAccount, web3, blockNumber } = useWeb3()
    const { erc20Contract } = useContract()
    const multiCallsV2 = useMutiCallV2()
    const { contract: treasuryContract } = useFX_Treasury()
    const { baseInfo } = useInfo()
    const [systemInfo, setSystemInfo] = useState({
        s0: '',//初始化ETH价格
        initFNav: '1',//初始化fNav
        f_ß: '0.1', //fETH Beta系数 ，合约设置
        n: '0', //ETH池子 数量
        s: '', //ETH价格，单位$，数据取自Oracle
        n_f: '', //fETH的数量
        fNav: '',//单个fETH的NAV
        n_x: '',//xETH的数量
        xNav: '',//单个xETH的NAV        
        p_f: '',//fETH的比例 RHO
        p_x: '',//xETH的比例
        r: '', //区间收益率,

        λ_f: '', //激励比例λ_f,λ_f > 0合约设置
        Max_n_s: '', //最大追加抵押品占比Δn_s/n=(p-p_s)/(p_s+λ_f)
        r_f1: '', //fETH付的稳定费率为
    })

    const params = {
        s0: '',//初始化ETH价格
        initFNav: '1',//初始化fNav
        f_ß: '0.1', //fETH Beta系数 ，合约设置
        n: '2', //ETH池子 数量
        s: '', //ETH价格，单位$，数据取自Oracle
        n_f: '', //fETH的数量
        fNav: '',//单个fETH的NAV
        n_x: '',//xETH的数量
        xNav: '',//单个xETH的NAV        
        p_f: '',//fETH的比例 RHO
        p_x: '',//xETH的比例
        r: '', //区间收益率,

        m_n: "",//质押ETH数量
        m_r: "",//铸造ETH比例
        m_nf: "", //铸造fETH的数量
        m_nx: "" //铸造xETH的数量
    }

    const fetchData = () => {
        const { fETHTotalSupplyRes, xETHTotalSupplyRes, ETHTotalUnderlyingRes } = baseInfo;
        const _n = ETHTotalUnderlyingRes
        const _n_f = fETHTotalSupplyRes
        const _n_x = xETHTotalSupplyRes
        const _x = getR(systemInfo)
    }
    const getR = (params) => {
        return cBN(params.s).div(params.s0).minus(1).toString(10)
    }

    const getFNav = (params) => {
        //(1 + params.f_ß * params.r) * params.initFNav
        return cBN(1).plus(cBN(params.f_ß).times(params.r)).times(params.initFNav).toString(10)
    }

    const getN_F = (params) => {
        //(params.n * params.s0) * params.p_f / params.fNav
        console.log('params.n,params.s0,params.p_f,params.fNav-', params.n, params.s0, params.p_f, params.fNav)
        return cBN(params.n).times(params.s0).times(params.p_f).div(params.fNav).toString(10)
    }

    const getXNav = (params) => {
        //(1 + (1 - params.f_ß) * params.r) * params.initXNav
        return (1 + (1 - params.f_ß) * params.r) * params.initXNav
        // return (params.s * params.n - params.fNav * params.n_f) / params.n_x
    }

    const getN_X = (params) => {
        return (params.n * params.s0) * (1 - params.p_f) / params.xNav
    }

    const getP_F = (params) => {
        if (params.fNav == 1) {
            return 0.5
        }
        console.log("params.fNav,params.n_f,params.s,params.n--", params.fNav, params.n_f, params.s, params.n)
        return params.fNav * params.n_f / (params.s * params.n)
    }

    const getp_x = (params) => {
        return params.xNav * params.n_x / (params.s * params.n)
    }

    const get_fETH_Collecteral_Ratio = (params) => {
        return 1 / params.p_f
    }


    const getM_NF = (params) => {
        return params.m_n * params.s * params.m_r / params.fNav
    }

    const getM_NX = (params) => {
        return params.m_n * params.s * (1 - params.m_r) / params.xNav
    }

    ///////////////////////// 稳定机制 //////////////////////////////////
    /**
     * 最大追加抵押品占比Δn_s/n=(p-p_s)/(p_s+λ_f)
     * @param {*} params 
     * @returns 
     */
    const getMax_n_s = (params) => {
        const limitCollecteralRatio = 1.3055;
        const _max_n_s = (params.p_f - 1 / limitCollecteralRatio) / (1 / limitCollecteralRatio + params.λ_f)
        return _max_n_s
    }

    /**
     * 最大追加抵押品（ETH）Δn_s
     * @param {*} params 
     */
    const getMax_n_s_eth = (params) => {
        const _n_s_eth = params.Max_n_s * params.n
        return _n_s_eth
    }

    /**
     * xETH的增发幅度r_x1=(1+λ_f)*(Δn_s/n)/(1-p)
     * @param {*} params 
     * @returns 
     */
    const getRx1 = (params) => {
        const _rx1 = (1 + params.λ_f) * params.Max_n_s / (1 - params.p_f)
        return _rx1
    }

    /**
     * fETH付的稳定费率为
     * @param {*} params 
     * @returns 
     */
    const getRf1 = (params) => {
        return params.λ_f * (params.m_n / params.n) / params.p_f
    }

    //fETH的超额抵押率
    const fETHCollecteralRatio = (params) => {
        return 1 / params.p_f
    }

    const StabilityModePrice = ''
    const UserLiquidationModePrice = ''
    const ProtocolLiquidationModePrice = ''

    const ETHLastChange = ''

    const _computeMultiple = (_newPrice, _lastPermissionedPrice, _beta) => {
        const PRECISION_I256 = 1e18;
        const _ratio = cBN(_newPrice).minus(_lastPermissionedPrice).multipliedBy(PRECISION_I256).div(_lastPermissionedPrice)
        const _fMultiple = _ratio.mul(_beta).div(PRECISION_I256);
        return _fMultiple
    }

    return {
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

    }
}
export default useFxCommon