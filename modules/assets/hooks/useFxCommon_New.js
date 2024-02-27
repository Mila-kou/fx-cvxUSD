import { useEffect, useState, useMemo } from 'react'
import { cBN } from '@/utils/index'
import { useGlobal } from '@/contexts/GlobalProvider'

const PRECISION = 1e18
const PRECISION_I256 = 1e18
const _initConfig = {
  // Current supply of base token
  baseSupply: 0,
  // Current nav of base token
  baseNav: 0,
  // The multiple used to compute current nav.
  fMultiple: 0,
  // Current supply of fractional token
  fSupply: 0,
  // Current nav of fractional token
  fNav: 0,
  // Current supply of leveraged token
  xSupply: 0,
  // Current nav of leveraged token
  xNav: 0,
}
const useFxCommon_New = () => {
  const { fx_info: fxInfo } = useGlobal()
  const [initConfig, setInitConfig] = useState(_initConfig)
  const [lastPermissionedPrice, beta] = useMemo(() => {
    if (fxInfo.baseInfo && fxInfo.baseInfo.CurrentNavRes) {
      const { lastPermissionedPriceRes, betaRes } = fxInfo.baseInfo
      return [lastPermissionedPriceRes, betaRes]
    }
    return [0, 0]
  }, [fxInfo])

  const _computeMultiple = (_newPrice) => {
    const _lastPermissionedPrice = lastPermissionedPrice

    const _ratio = cBN(_newPrice)
      .minus(_lastPermissionedPrice)
      .multipliedBy(PRECISION_I256)
      .div(_lastPermissionedPrice)

    const _fMultiple = _ratio.multipliedBy(beta).div(PRECISION_I256).toFixed(0)
    return _fMultiple
  }

  /// Common Data ////////////////////////////////

  /// @inheritdoc IFractionalToken
  /// @dev Normally `multiple/1e18` should be in the range `(-1, 1e18)`.
  const getNav = (multiple) => {
    const _nav = fxInfo.baseInfo.fNav0Res
    console.log('_nav------111', _nav)
    let _newNav = _nav
    if (cBN(multiple).lt(0)) {
      if (cBN(multiple).abs().gt(PRECISION)) {
        // multiple too large
        return _nav
      }
    } else if (cBN(multiple).gt(cBN(PRECISION).multipliedBy(PRECISION))) {
      return _nav
    }

    _newNav = cBN(_nav)
      .multipliedBy(cBN(PRECISION).plus(multiple))
      .div(PRECISION)
      .toFixed(0)

    return _newNav
  }

  /// @dev Internal function to fetch twap price.
  /// @return _price The twap price of the base token.
  const _fetchTwapPrice = (_kind, priceObj = {}) => {
    const { _isValid, _safePrice, _minUnsafePrice, _maxUnsafePrice } = priceObj

    let _price = _safePrice
    if (_kind == 'MintFToken' || _kind == 'MintXToken') {
      if (!_isValid) {
        // 'oracle price is invalid'
        _price = _safePrice
      }
    } else if (!_isValid) {
      if (_kind == 'RedeemFToken') {
        _price = _maxUnsafePrice
      } else if (_kind == 'RedeemXToken') {
        _price = _minUnsafePrice
      }
    }
    return _price
  }

  /// @dev Internal function to load swap variable to memory
  const _loadSwapState = (_kind) => {
    const _state = initConfig
    const _priceObj = fxInfo.baseInfo.fxETHTwapOraclePriceeInfo
    _state.baseSupply = fxInfo.baseInfo.totalBaseTokenRes
    _state.baseNav = _fetchTwapPrice(_kind, _priceObj)

    if (_state.baseSupply == 0) {
      _state.fNav = PRECISION
      _state.xNav = PRECISION
    } else {
      _state.fMultiple = _computeMultiple(_state.baseNav)

      _state.fSupply = fxInfo.baseInfo.fETHTotalSupplyRes
      _state.fNav = getNav(_state.fMultiple)

      _state.xSupply = fxInfo.baseInfo.xETHTotalSupplyRes
      if (cBN(_state.xSupply).isZero()) {
        // no xToken, treat the nav of xToken as 1.0
        _state.xNav = PRECISION
      } else {
        _state.xNav = cBN(_state.baseSupply)
          .multipliedBy(_state.baseNav)
          .minus(cBN(_state.fSupply).multipliedBy(_state.fNav))
          .div(_state.xSupply)
          .toFixed(0)
      }
    }
    console.log('_state----', _state)
    if (_kind == 'none') {
      setInitConfig(_state)
    } else {
      return _state
    }
  }

  useEffect(() => {
    if (fxInfo.baseInfo && fxInfo.baseInfo.CurrentNavRes) {
      _loadSwapState('none')
    }
  }, [fxInfo])

  return {
    _loadSwapState,
  }
}

export default useFxCommon_New
