import { useEffect, useState, useContext, useCallback, useMemo } from 'react'
import { useQueries } from '@tanstack/react-query'
import moment from 'moment'
import { useContract, useFETH, useFX_Market, useFX_Treasury, useXETH } from 'hooks/useContracts'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import abis from '@/config/abi'
import config from '@/config/index'
import useWeb3 from '@/hooks/useWeb3'
import { cBN, checkNotZoroNum, fb4 } from '@/utils/index'
import useInfo from './useInfo'
import { useGlobal } from '@/contexts/GlobalProvider'

const useFxCommon = () => {
    const { _currentAccount, web3, blockNumber } = useWeb3()
    const { erc20Contract } = useContract()
    const multiCallsV2 = useMutiCallV2()
    const { fx_info } = useGlobal()
    console.log('fx_info--', fx_info)
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

        max_n_s: "",//最大追加抵押品占比
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
        console.log('params.n,params.s,params.p_f,params.fNav-', params.n, params.s, params.p_f, params.fNav)
        return cBN(params.n).times(params.s).times(params.p_f).div(params.fNav).toString(10)
    }

    const getAdd_N_F = (params) => {
        //(params.n * params.s0) * params.p_f / params.fNav
        console.log('params.n,params.s,params.p_f,params.fNav-', params.n, params.s, params.m_r, params.fNav)
        return cBN(params.n).times(params.s).times(params.m_r).div(params.fNav).toString(10)
    }

    const getXNav = (params) => {
        //(1 + (1 - params.f_ß) * params.r) * params.initXNav
        console.log('params.s, params.n, params.fNav, params.n_f, params.n_x--', params.s, params.n, params.fNav, params.n_f, params.n_x)
        return (params.s * params.n - params.fNav * params.n_f) / params.n_x
        // return (1 + (1 - params.f_ß) * params.r) * params.initXNav

    }

    const getN_X = (params) => {
        return (params.n * params.s) * (1 - params.p_f) / params.xNav
    }

    const getAdd_N_X = (params) => {
        //(params.n * params.s0) * params.p_f / params.fNav
        console.log('params.n,params.s,params.p_f,params.xNav-', params.n, params.s, params.m_r, params.xNav)
        return cBN(params.n).times(params.s).times((1 - params.m_r)).div(params.xNav).toString(10)
    }

    const getP_F = (params) => {
        if (params.fNav == 1) {
            return 0.5
        }
        console.log("params.fNav,params.n_f,params.s,params.n--", params.fNav, params.n_f, params.s, params.n)
        return params.fNav * params.n_f / (params.s * params.n)
    }

    const getP_X = (params) => {
        return params.xNav * params.n_x / (params.s * params.n)
    }

    const get_fETH_Collecteral_Ratio = (params) => {
        return 1 / params.p_f
    }

    ///////////////////////// 稳定机制 //////////////////////////////////
    /**
     * 最大追加抵押品占比Δn_s/n=(p-p_s)/(p_s+λ_f)
     * @param {*} params 
     * @returns 
     */
    const getMax_n_s = (params) => {
        const limitCollecteralRatio = 1.3055;
        // const _max_n_s = (params.p_f - 1 / limitCollecteralRatio) / (1 / limitCollecteralRatio + params.λ_f)
        const _max_n_s = cBN(params.p_f).minus(cBN(1).div(limitCollecteralRatio)).div(cBN(1).div(limitCollecteralRatio).plus(params.λ_f)).toString(10)
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
        return params.λ_f * (params.max_n_s / params.n) / params.p_f
    }

    /**
     * xETH的增发数量 Bouns n_x
     * @param {*} params 
     * @returns 
     */
    const getBouns_N_X = (params) => {
        return params.rx1 * params.n_x
    }

    //fETH的超额抵押率
    const fETHCollecteralRatio = (params) => {
        return 1 / params.p_f
    }


    /**
     * 
     * @param {*} params 
     * @returns 
     */
    const getM_NF = (params) => {
        return params.m_n * params.s * params.m_r / params.fNav
    }

    const getM_NX = (params) => {
        return params.m_n * params.s * (1 - params.m_r) / params.xNav
    }
    ///////////////////////// 稳定机制  end //////////////////////////////////




    /**
     * 获取StabilityMode 价格
     * s*(1-(1-p_f*30%)/(1-beta*p_f*30%))
     * @param {*} params 
     * @returns 
     */
    const getStabilityModePrice = (params) => {
        const { fETHTotalSupplyRes, fNav0Res, totalBaseTokenRes, lastPermissionedPriceRes } = fx_info.baseInfo || {}
        //n_fETH* fnav(t0) / (n_ETH * ETH Price(t0))
        const adjust_Rho = cBN(fETHTotalSupplyRes).multipliedBy(fNav0Res).div(cBN(totalBaseTokenRes).multipliedBy(lastPermissionedPriceRes))
        const limitCollecteralRatio = checkNotZoroNum(fx_info.baseInfo.marketConfigRes?.stabilityRatio) ? cBN(fx_info.baseInfo.marketConfigRes?.stabilityRatio).div(1e18).toFixed(10) : 1.3055;
        console.log('limitCollecteralRatio----', fx_info.baseInfo.marketConfigRes.stabilityRatio, limitCollecteralRatio, params.s, params.p_f, adjust_Rho.toString(10), params.beta)
        const _p1 = cBN(1).minus(cBN(adjust_Rho).multipliedBy(limitCollecteralRatio))
        const _p2 = cBN(1).minus(cBN(params.beta).multipliedBy(adjust_Rho).multipliedBy(limitCollecteralRatio))
        return cBN(lastPermissionedPriceRes).div(1e18).multipliedBy(cBN(1).minus(_p1.div(_p2))).toString(10)
    }

    /**
     * 获取用户清算模式 价格
     * @param {*} params 
     * @returns 
     */
    const getUserLiquidationModePrice = (params) => {
        //n_fETH* fnav(t0) / (n_ETH * ETH Price(t0))
        const { fETHTotalSupplyRes, fNav0Res, totalBaseTokenRes, lastPermissionedPriceRes } = fx_info.baseInfo || {}
        const adjust_Rho = cBN(fETHTotalSupplyRes).multipliedBy(fNav0Res).div(cBN(totalBaseTokenRes).multipliedBy(lastPermissionedPriceRes))
        const limitCollecteralRatio = checkNotZoroNum(fx_info.baseInfo.marketConfigRes?.liquidationRatio) ? cBN(fx_info.baseInfo.marketConfigRes?.liquidationRatio).div(1e18).toFixed(10) : 1.2067;
        const _p1 = cBN(1).minus(cBN(adjust_Rho).multipliedBy(limitCollecteralRatio))
        const _p2 = cBN(1).minus(cBN(params.beta).multipliedBy(adjust_Rho).multipliedBy(limitCollecteralRatio))
        return cBN(lastPermissionedPriceRes).div(1e18).multipliedBy(cBN(1).minus(_p1.div(_p2))).toString(10)
    }

    /**
     * 获取协议清算模式 价格
     * @param {*} params 
     * @returns 
     */
    const getProtocolLiquidationModePrice = (params) => {
        //n_fETH* fnav(t0) / (n_ETH * ETH Price(t0))
        const { fETHTotalSupplyRes, fNav0Res, totalBaseTokenRes, lastPermissionedPriceRes } = fx_info.baseInfo || {}
        const adjust_Rho = cBN(fETHTotalSupplyRes).multipliedBy(fNav0Res).div(cBN(totalBaseTokenRes).multipliedBy(lastPermissionedPriceRes))
        const limitCollecteralRatio = checkNotZoroNum(fx_info.baseInfo.marketConfigRes?.selfLiquidationRatio) ? cBN(fx_info.baseInfo.marketConfigRes?.selfLiquidationRatio).div(1e18).toFixed(10) : 1.1449;
        const _p1 = cBN(1).minus(cBN(adjust_Rho).multipliedBy(limitCollecteralRatio))
        const _p2 = cBN(1).minus(cBN(params.beta).multipliedBy(adjust_Rho).multipliedBy(limitCollecteralRatio))
        return cBN(lastPermissionedPriceRes).div(1e18).multipliedBy(cBN(1).minus(_p1.div(_p2))).toString(10)
    }

    /**
     * 系统状态
     * @param {*} params 
     */
    const getSystemStatus = (params) => {
        const limitCollecteralRatio_0 = cBN(fx_info.baseInfo.marketConfigRes?.stabilityRatio).div(1e18).toString(10);
        const limitCollecteralRatio_1 = cBN(fx_info.baseInfo.marketConfigRes?.liquidationRatio).div(1e18).toString(10);
        const limitCollecteralRatio_2 = cBN(fx_info.baseInfo.marketConfigRes?.selfLiquidationRatio).div(1e18).toString(10);
        const isEnd = 1;
        console.log('limitCollecteralRatio-limitCollecteralRatio_0-limitCollecteralRatio_1-limitCollecteralRatio_2', params.limitCollecteralRatio, limitCollecteralRatio_0, limitCollecteralRatio_1, limitCollecteralRatio_2)
        let _status = 0;
        if (cBN(params.limitCollecteralRatio).isGreaterThanOrEqualTo(limitCollecteralRatio_0)) {
            _status = 0;
        } else if (cBN(params.limitCollecteralRatio).isGreaterThanOrEqualTo(limitCollecteralRatio_1) && cBN(params.limitCollecteralRatio).isLessThan(limitCollecteralRatio_0)) {
            _status = 1;
        } else if (cBN(params.limitCollecteralRatio).isGreaterThanOrEqualTo(limitCollecteralRatio_2) && cBN(params.limitCollecteralRatio).isLessThan(limitCollecteralRatio_1)) {
            _status = 2;
        } else {
            _status = 3;
        }
        return _status
    }

    const getMaxFETHBonus = (params) => {

    }

    const getUserFETHBonus = (params) => {

    }

    const getMaxXETHBonus = (params) => {
        // Incentive(xETH)= λ_f*Δn*s/x nav
        // λ_f：8%，Δn：MaxBaseInETH，s1：ethPrice，xnav：xNav
        // const MaxBaseInETH = fx_info.maxMintableXTokenWithIncentiveRes?._maxBaseIn / 1e18
        try {
            const λ_f = fx_info.baseInfo.incentiveConfigRes?.stabilityIncentiveRatio / 1e18 || 0
            const s = fx_info.baseInfo.CurrentNavRes?._baseNav / 1e18
            const xNav = fx_info.baseInfo.CurrentNavRes?._xNav / 1e18
            // console.log('MaxBaseInETH--', fx_info.maxMintableXTokenWithIncentiveRes?._maxBaseIn, MaxBaseInETH, λ_f, params.s, params.xNav)
            return cBN(λ_f).multipliedBy(params.MaxBaseInETH).multipliedBy(s).div(xNav).toString(10)
        } catch (error) {
            console.log(error)
            return 0
        }

    }

    const getUserXETHBonus = (params) => {

    }

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
        getSystemStatus,

        getMaxFETHBonus,
        getUserFETHBonus,
        getMaxXETHBonus,
        getUserXETHBonus

    }
}
export default useFxCommon