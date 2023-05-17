import { useEffect, useState, useContext, useCallback, useMemo } from 'react'
import { useQueries } from '@tanstack/react-query'
import moment from 'moment'
import { useContract, useFETH, useFX_Market, useFX_Treasury, useXETH } from 'hooks/useContracts'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import abis from '@/config/abi'
import config from '@/config/index'
import useWeb3 from '@/hooks/useWeb3'
import { cBN, fb4 } from '@/utils/index'

const useModePrice = () => {
    const { _currentAccount, web3, blockNumber } = useWeb3()
    const { erc20Contract } = useContract()
    const multiCallsV2 = useMutiCallV2()
    const { contract: treasuryContract } = useFX_Treasury()

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
        ρ_f: '',//fETH的比例 RHO
        ρ_x: '',//xETH的比例
        r: '', //区间收益率,

        m_n: "",//质押ETH数量
        m_r: "",//铸造ETH比例
        m_nf: "", //铸造fETH的数量
        m_nx: "" //铸造xETH的数量
    }

    const getR = useMemo(() => {
        return params.s / s0 - 1
    }, [params])

    const getFNav = useMemo(() => {
        return (1 + params.f_ß * params.r) * params.initFNav
    }, [params])

    const getXNav = useMemo(() => {
        return (params.s * params.n - params.fNav * params.n_f) / params.n_x
    }, [params])

    const getρ_f = useMemo(() => {
        return params.fNav * params.n_f / (params.s * params.n)
    }, [params])

    const getρ_x = useMemo(() => {
        return params.xNav * params.n_x / (params.s * params.n)
    }, [params])

    const getM_NF = useMemo(() => {
        return params.m_n * params.s * params.m_r / params.fNav
    }, [params])

    const getM_NX = useMemo(() => {
        return params.m_n * params.s * (1 - params.m_r) / params.xNav
    }, [params])

    //fETH的超额抵押率
    const fETHCollecteralRatio = useMemo(() => {
        return 1 / params.ρ_f
    }, [params])

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
        getρ_f,
        getρ_x,
        getM_NF,
        getM_NX,
        _computeMultiple
    }
}
export default useModePrice