import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import useWeb3 from '@/hooks/useWeb3'
import { useVeFXN } from '@/hooks/useContracts'
import { cBN, checkNotZoroNum, checkNotZoroNumOption, fb4 } from '@/utils/index'
import config from '@/config/index'
import useGenesis from '../hooks/useGenesis'

const useGenesis_c = (gaugeItem) => {
  useGenesis()
  const { currentAccount, isAllReady } = useWeb3()
  const { tokenPrice } = useSelector((state) => state.token)
  const genesis = useSelector((state) => state.genesis)
  const { contract: veContract } = useVeFXN()

  const _stETH_fxnNum = 100
  const _stETH_lido_total = 10000
  const _frxETH_fxnNum = 100
  const _frxETH_frxETH_tatal = 10000

  const getTokenPrice = useCallback(
    (tokenName) => {
      try {
        const _tokenPrice = tokenPrice[tokenName]
        if (_tokenPrice) {
          return _tokenPrice.usd
        }
        return 0
      } catch (e) {
        return 0
      }
    },
    [tokenPrice]
  )

  const dataPage = useMemo(() => {
    const _fxnPrice = getTokenPrice('FXN')
    const _stETHPrice = getTokenPrice('stETH')
    const _wstETHPrice = getTokenPrice('wstETH')
    const _sfrxETHPrice = getTokenPrice('sfrxETH')
    const _frxETHPrice = getTokenPrice('frxETH')
    const _wstETHTVL = cBN(genesis.stETH.totalShare)
      .times(_stETHPrice)
      .div(1e18)
    const _sfrxETHTVL = cBN(genesis.frxETH.totalShare)
      .times(_frxETHPrice)
      .div(1e18)
    const _times = cBN(config.yearSecond).div(config.weekSecond)
    console.log(
      'Genesis--dataPage---',
      _fxnPrice,
      // _stETHPrice,
      _wstETHPrice,
      _sfrxETHPrice,
      _wstETHTVL.toFixed(0, 1),
      _sfrxETHTVL.toFixed(0, 1),
      _times.toString()
    )
    const _stETH_fxn_apy = cBN(_stETH_fxnNum)
      .times(_fxnPrice)
      .div(_wstETHTVL)
      .times(_times)
      .times(100)
    const _stETH_stETH_apy = cBN(_stETH_lido_total)
      // .times(_stETHPrice)
      .div(_wstETHTVL)
      .times(_times)
      .times(100)
    const _sfrxETH_fxn_apy = cBN(_frxETH_fxnNum)
      .times(_fxnPrice)
      .div(_sfrxETHTVL)
      .times(_times)
      .times(100)
    const _sfrxETH_sfrxETH_apy = cBN(_frxETH_frxETH_tatal)
      // .times(_sfrxETHPrice)
      .div(_sfrxETHTVL)
      .times(_times)
      .times(100)
    let _stETHApy = _stETH_fxn_apy.plus(_stETH_stETH_apy)
    _stETHApy = checkNotZoroNumOption(
      _stETHApy,
      _stETHApy.gt(1000) ? '1000% +' : `${fb4(_stETHApy, false, 0, 2)}%`
    )
    let _sfrxETHApy = _sfrxETH_fxn_apy.plus(_sfrxETH_sfrxETH_apy)
    _sfrxETHApy = checkNotZoroNumOption(
      _sfrxETHApy,
      _sfrxETHApy.gt(1000) ? '1000% +' : `${fb4(_sfrxETHApy, false, 0, 2)}%`
    )
    console.log(
      'Genesis--dataPage---1--',
      _stETH_fxn_apy.toString(),
      _stETH_stETH_apy.toString(),
      _stETHApy,
      _sfrxETHApy
    )
    return {
      stETHApy: _stETHApy,
      sfrxETHApy: _sfrxETHApy,
    }
  }, [tokenPrice, genesis])
  return dataPage
}

export default useGenesis_c
