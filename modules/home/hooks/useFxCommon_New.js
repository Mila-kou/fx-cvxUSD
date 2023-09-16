import { useEffect, useState, useContext, useCallback, useMemo } from 'react'
import { cBN, checkNotZoroNum, checkNotZoroNumOption, fb4 } from '@/utils/index'
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
      const { CurrentNavRes, betaRes } = fxInfo.baseInfo
      const { _baseNav } = CurrentNavRes
      return [_baseNav, betaRes]
    }
    return [0, 0]
  }, [fxInfo])

  /// @notice Compute the amount of base token needed to reach the new collateral ratio.
  ///
  /// @dev If the current collateral ratio <= new collateral ratio, we should return 0.
  ///
  /// @param state The current state.
  /// @param _newCollateralRatio The target collateral ratio, multipled by 1e18.
  /// @return _maxBaseIn The amount of base token needed.
  /// @return _maxFTokenMintable The amount of fToken can be minted.
  const maxMintableFToken = (state, _newCollateralRatio) => {
    //  n * v = nf * vf + nx * vx
    //  (n + dn) * v = (nf + df) * vf + nx * vx
    //  (n + dn) * v / ((nf + df) * vf) = ncr
    // =>
    //  n * v - ncr * nf * vf = (ncr - 1) * dn * v
    //  n * v - ncr * nf * vf = (ncr - 1) * df * vf
    // =>
    //  dn = (n * v - ncr * nf * vf) / ((ncr - 1) * v)
    //  df = (n * v - ncr * nf * vf) / ((ncr - 1) * vf)

    const _baseVal = cBN(state.baseSupply)
      .multipliedBy(state.baseNav)
      .multipliedBy(PRECISION)
    const _fVal = cBN(_newCollateralRatio)
      .multipliedBy(state.fSupply)
      .multipliedBy(state.fNav)
    let _maxBaseIn = cBN(0)
    let _maxFTokenMintable = cBN(0)

    if (cBN(_baseVal).gt(_fVal)) {
      _newCollateralRatio = cBN(_newCollateralRatio).minus(PRECISION)
      const _delta = _baseVal.minus(_fVal)

      _maxBaseIn = _delta.div(state.baseNav.multipliedBy(_newCollateralRatio))
      _maxFTokenMintable = _delta.div(
        state.fNav.multipliedBy(_newCollateralRatio)
      )
    }
    return [_maxBaseIn, _maxFTokenMintable]
  }

  /// @notice Compute the amount of base token needed to reach the new collateral ratio.
  ///
  /// @dev If the current collateral ratio >= new collateral ratio, we should return 0.
  ///
  /// @param state The current state.
  /// @param _newCollateralRatio The target collateral ratio, multipled by 1e18.
  /// @return _maxBaseIn The amount of base token needed.
  /// @return _maxXTokenMintable The amount of xToken can be minted.
  const maxMintableXToken = (state, _newCollateralRatio) => {
    //  n * v = nf * vf + nx * vx
    //  (n + dn) * v = nf * vf + (nx + dx) * vx
    //  (n + dn) * v / (nf * vf) = ncr
    // =>
    //  n * v + dn * v = ncr * nf * vf
    //  n * v + dx * vx = ncr * nf * vf
    // =>
    //  dn = (ncr * nf * vf - n * v) / v
    //  dx = (ncr * nf * vf - n * v) / vx

    const _baseVal = cBN(state.baseNav)
      .multipliedBy(state.baseSupply)
      .multipliedBy(PRECISION)
    const _fVal = cBN(_newCollateralRatio)
      .multipliedBy(state.fSupply)
      .multipliedBy(state.fNav)

    let _maxBaseIn = cBN(0)
    let _maxXTokenMintable = cBN(0)
    if (cBN(_fVal).gt(_baseVal)) {
      const _delta = cBN(_fVal).minus(_baseVal)

      _maxBaseIn = _delta.div(state.baseNav.multipliedBy(PRECISION))
      _maxXTokenMintable = _delta.div(state.xNav.multipliedBy(PRECISION))
    }
    return [_maxBaseIn, _maxXTokenMintable]
  }

  /// @notice Compute the amount of base token needed to reach the new collateral ratio, with incentive.
  ///
  /// @dev If the current collateral ratio >= new collateral ratio, we should return 0.
  ///
  /// @param state The current state.
  /// @param _newCollateralRatio The target collateral ratio, multipled by 1e18.
  /// @param _incentiveRatio The extra incentive ratio, multipled by 1e18.
  /// @return _maxBaseIn The amount of base token needed.
  /// @return _maxXTokenMintable The amount of xToken can be minted.
  const maxMintableXTokenWithIncentive = (
    state,
    _newCollateralRatio,
    _incentiveRatio
  ) => {
    //  n * v = nf * vf + nx * vx
    //  (n + dn) * v = nf * (vf - dvf) + (nx + dx) * vx
    //  (n + dn) * v / (nf * (vf - dvf)) = ncr
    //  nf * dvf = lambda * dn * v
    //  dx * vx = (1 + lambda) * dn * v
    // =>
    //  n * v + dn * v = ncr * nf * vf - lambda * nrc * dn * v
    // =>
    //  dn = (ncr * nf * vf - n * v) / (v * (1 + lambda * ncr))
    //  dx = ((1 + lambda) * dn * v) / vx

    const _baseVal = cBN(state.baseNav)
      .multipliedBy(state.baseSupply)
      .multipliedBy(PRECISION)
    const _fVal = cBN(_newCollateralRatio)
      .multipliedBy(state.fSupply)
      .multipliedBy(state.fNav)

    let _maxBaseIn = cBN(0)
    let _maxXTokenMintable = cBN(0)
    if (cBN(_fVal).gt(_baseVal)) {
      const _delta = _fVal.minus(_baseVal)

      _maxBaseIn = _delta.div(
        cBN(state.baseNav).multipliedBy(
          cBN(PRECISION)
            .plus(cBN(_incentiveRatio).multipliedBy(_newCollateralRatio))
            .div(PRECISION)
        )
      )
      _maxXTokenMintable = _maxBaseIn
        .multipliedBy(state.baseNav)
        .multipliedBy(cBN(PRECISION).plus(_incentiveRatio))
        .div(state.xNav.multipliedBy(PRECISION))
    }
    return [_maxBaseIn, _maxXTokenMintable]
  }

  /// @notice Compute the amount of fToken needed to reach the new collateral ratio.
  ///
  /// @dev If the current collateral ratio >= new collateral ratio, we should return 0.
  ///
  /// @param state The current state.
  /// @param _newCollateralRatio The target collateral ratio, multipled by 1e18.
  /// @return _maxBaseOut The amount of base token redeemed.
  /// @return _maxFTokenRedeemable The amount of fToken needed.
  const maxRedeemableFToken = (state, _newCollateralRatio) => {
    //  n * v = nf * vf + nx * vx
    //  (n - dn) * v = (nf - df) * vf + nx * vx
    //  (n - dn) * v / ((nf - df) * vf) = ncr
    // =>
    //  n * v - dn * v = ncr * nf * vf - ncr * dn * v
    //  n * v - df * vf = ncr * nf * vf - ncr * df * vf
    // =>
    //  df = (ncr * nf * vf - n * v) / ((ncr - 1) * vf)
    //  dn = (ncr * nf * vf - n * v) / ((ncr - 1) * v)

    const _baseVal = cBN(state.baseSupply)
      .multipliedBy(state.baseNav)
      .multipliedBy(PRECISION)
    const _fVal = cBN(_newCollateralRatio)
      .multipliedBy(state.fSupply)
      .multipliedBy(state.fNav)

    let _maxBaseOut = cBN(0)
    let _maxFTokenRedeemable = cBN(0)
    if (cBN(_fVal).gt(_baseVal)) {
      const _delta = _fVal.minus(_baseVal)
      _newCollateralRatio = cBN(_newCollateralRatio).minus(PRECISION)

      _maxFTokenRedeemable = _delta.div(
        _newCollateralRatio.multipliedBy(state.fNav)
      )
      _maxBaseOut = _delta.div(_newCollateralRatio.multipliedBy(state.baseNav))
    }
    return [_maxBaseOut, _maxFTokenRedeemable]
  }

  /// @notice Compute the amount of xToken needed to reach the new collateral ratio.
  ///
  /// @dev If the current collateral ratio <= new collateral ratio, we should return 0.
  ///
  /// @param state The current state.
  /// @param _newCollateralRatio The target collateral ratio, multipled by 1e18.
  /// @return _maxBaseOut The amount of base token redeemed.
  /// @return _maxXTokenRedeemable The amount of xToken needed.
  const maxRedeemableXToken = (state, _newCollateralRatio) => {
    //  n * v = nf * vf + nx * vx
    //  (n - dn) * v = nf * vf + (nx - dx) * vx
    //  (n - dn) * v / (nf * vf) = ncr
    // =>
    //  n * v - dn * v = ncr * nf * vf
    //  n * v - dx * vx = ncr * nf * vf
    // =>
    //  dn = (n * v - ncr * nf * vf) / v
    //  dx = (n * v - ncr * nf * vf) / vx

    const _baseVal = cBN(state.baseSupply)
      .multipliedBy(state.baseNav)
      .multipliedBy(PRECISION)
    const _fVal = cBN(_newCollateralRatio)
      .multipliedBy(state.fSupply)
      .multipliedBy(state.fNav)

    let _maxBaseOut = cBN(0)
    let _maxXTokenRedeemable = cBN(0)
    if (cBN(_baseVal).gt(_fVal)) {
      const _delta = _baseVal.minus(_fVal)

      _maxXTokenRedeemable = _delta.div(state.xNav.multipliedBy(PRECISION))
      _maxBaseOut = _delta.div(state.baseNav.multipliedBy(PRECISION))
    }
    return [_maxBaseOut, _maxXTokenRedeemable]
  }

  /// @notice Compute the maximum amount of fToken can be liquidated.
  ///
  /// @dev If the current collateral ratio >= new collateral ratio, we should return 0.
  ///
  /// @param state The current state.
  /// @param _newCollateralRatio The target collateral ratio, multipled by 1e18.
  /// @param _incentiveRatio The extra incentive ratio, multipled by 1e18.
  /// @return _maxBaseOut The maximum amount of base token can liquidate, without incentive.
  /// @return _maxFTokenLiquidatable The maximum amount of fToken can be liquidated.
  const maxLiquidatable = (state, _newCollateralRatio, _incentiveRatio) => {
    //  n * v = nf * vf + nx * vx
    //  (n - dn) * v = (nf - df) * (vf - dvf) + nx * vx
    //  (n - dn) * v / ((nf - df) * (vf - dvf)) = ncr
    //  dn * v = nf * dvf + df * (vf - dvf)
    //  dn * v = df * vf * (1 + lambda)
    // =>
    //  n * v - dn * v = ncf * nf * vf - ncr * dn * v
    // =>
    //  dn = (ncr * nf * vf - n * v) / ((ncr - 1) * v)
    //  df = (dn * v) / ((1 + lambda) * vf)

    const _fVal = cBN(_newCollateralRatio)
      .multipliedBy(state.fSupply)
      .multipliedBy(state.fNav)
    const _baseVal = cBN(state.baseSupply)
      .multipliedBy(state.baseNav)
      .multipliedBy(PRECISION)

    let _maxBaseOut = cBN(0)
    let _maxFTokenLiquidatable = cBN(0)
    if (cBN(_fVal).gt(_baseVal)) {
      const _delta = _fVal.minus(_baseVal)
      _newCollateralRatio = cBN(_newCollateralRatio).minus(PRECISION)

      _maxBaseOut = _delta.div(state.baseNav.multipliedBy(_newCollateralRatio))
      _maxFTokenLiquidatable = _delta
        .div(_newCollateralRatio)
        .multipliedBy(PRECISION)
        .div(cBN(PRECISION).plus(_incentiveRatio).multipliedBy(state.fNav))
    }
    return [_maxBaseOut, _maxFTokenLiquidatable]
  }

  /// @notice Mint fToken and xToken according to current collateral ratio.
  /// @param state The current state.
  /// @param _baseIn The amount of base token supplied.
  /// @return _fTokenOut The amount of fToken expected.
  /// @return _xTokenOut The amount of xToken expected.
  const mint = (state, _baseIn) => {
    //  n * v = nf * vf + nx * vx
    //  (n + dn) * v = (nf + df) * vf + (nx + dx) * vx
    //  ((nf + df) * vf) / ((n + dn) * v) = (nf * vf) / (n * v)
    //  ((nx + dx) * vx) / ((n + dn) * v) = (nx * vx) / (n * v)
    // =>
    //   df = nf * dn / n
    //   dx = nx * dn / n
    const _fTokenOut = cBN(state.fSupply)
      .multipliedBy(_baseIn)
      .div(state.baseSupply)
    const _xTokenOut = cBN(state.xSupply)
      .multipliedBy(_baseIn)
      .div(state.baseSupply)
    return [_fTokenOut, _xTokenOut]
  }

  /// @notice Mint fToken.
  /// @param state The current state.
  /// @param _baseIn The amount of base token supplied.
  /// @return _fTokenOut The amount of fToken expected.
  const mintFToken = (state, _baseIn) => {
    //  n * v = nf * vf + nx * vx
    //  (n + dn) * v = (nf + df) * vf + nx * vx
    // =>
    //  df = dn * v / vf
    const _fTokenOut = cBN(_baseIn).multipliedBy(state.baseNav).div(state.fNav)
    return _fTokenOut
  }

  /// @notice Mint xToken.
  /// @param state The current state.
  /// @param _baseIn The amount of base token supplied.
  /// @return _xTokenOut The amount of xToken expected.
  const mintXToken = (state, _baseIn) => {
    //  n * v = nf * vf + nx * vx
    //  (n + dn) * v = nf * vf + (nx + dx) * vx
    // =>
    //  dx = (dn * v * nx) / (n * v - nf * vf)
    let _xTokenOut = cBN(_baseIn)
      .multipliedBy(state.baseNav)
      .multipliedBy(state.xSupply)
    _xTokenOut = cBN(_xTokenOut).div(
      cBN(state.baseSupply)
        .multipliedBy(state.baseNav)
        .minus(cBN(state.fSupply).multipliedBy(state.fNav))
    )
    return _xTokenOut
  }

  /// @notice Mint xToken with given incentive.
  /// @param state The current state.
  /// @param _baseIn The amount of base token supplied.
  /// @param _incentiveRatio The extra incentive given, multiplied by 1e18.
  /// @return _xTokenOut The amount of xToken expected.
  /// @return _fDeltaNav The change for nav of fToken.
  const mintXToken_1 = (state, _baseIn, _incentiveRatio) => {
    //  n * v = nf * vf + nx * vx
    //  (n + dn) * v = nf * (vf - dvf) + (nx + dx) * vx
    // =>
    //  dn * v = dx * vx - nf * dvf
    //  nf * dvf = lambda * dn * v
    // =>
    //  dx * vx = (1 + lambda) * dn * v
    //  dvf = lambda * dn * v / nf

    const _deltaVal = cBN(_baseIn).multipliedBy(state.baseNav)

    let _xTokenOut = cBN(_deltaVal)
      .multipliedBy(cBN(PRECISION).plus(_incentiveRatio))
      .div(PRECISION)
    _xTokenOut = _xTokenOut.div(state.xNav)

    let _fDeltaNav = _deltaVal.multipliedBy(_incentiveRatio).div(PRECISION)
    _fDeltaNav = _fDeltaNav.div(state.fSupply)
    return [_xTokenOut, _fDeltaNav]
  }

  /// @notice Redeem base token with fToken and xToken.
  /// @param state The current state.
  /// @param _fTokenIn The amount of fToken supplied.
  /// @param _xTokenIn The amount of xToken supplied.
  /// @return _baseOut The amount of base token expected.
  const redeem = (state, _fTokenIn, _xTokenIn) => {
    const _xVal = cBN(state.baseSupply)
      .multipliedBy(state.baseNav)
      .minus(cBN(state.fSupply).multipliedBy(state.fNav))

    //  n * v = nf * vf + nx * vx
    //  (n - dn) * v = (nf - df) * vf + (nx - dx) * vx
    // =>
    //  dn = (df * vf + dx * (n * v - nf * vf) / nx) / v
    let _baseOut = cBN(0)
    if (cBN(state.xSupply).isZero()) {
      _baseOut = cBN(_fTokenIn).multipliedBy(state.fNav).div(state.baseNav)
    } else {
      _baseOut = cBN(_fTokenIn).multipliedBy(state.fNav)
      _baseOut = cBN(_baseOut).plus(
        cBN(_xTokenIn).multipliedBy(_xVal).div(state.xSupply)
      )
      _baseOut = _baseOut.div(state.baseNav)
    }
    return _baseOut
  }

  /// @notice Redeem base token with fToken and given incentive.
  /// @param state The current state.
  /// @param _fTokenIn The amount of fToken supplied.
  /// @param _incentiveRatio The extra incentive given, multiplied by 1e18.
  /// @return _baseOut The amount of base token expected.
  /// @return _fDeltaNav The change for nav of fToken.
  const liquidateWithIncentive = (state, _fTokenIn, _incentiveRatio) => {
    //  n * v = nf * vf + nx * vx
    //  (n - dn) * v = (nf - df) * (vf - dvf) + nx * vx
    // =>
    //  dn * v = nf * dvf + df * (vf - dvf)
    //  dn * v = df * vf * (1 + lambda)
    // =>
    //  dn = df * vf * (1 + lambda) / v
    //  dvf = lambda * (df * vf) / (nf - df)

    const _fDeltaVal = cBN(_fTokenIn).multipliedBy(state.fNav)

    let _baseOut = _fDeltaVal
      .multipliedBy(cBN(PRECISION).plus(_incentiveRatio))
      .div(PRECISION)
    _baseOut = _baseOut.div(state.baseNav)

    let _fDeltaNav = _fDeltaVal.multipliedBy(_incentiveRatio).div(PRECISION)
    _fDeltaNav = _fDeltaNav.div(cBN(state.fSupply).minus(_fTokenIn))
  }

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
    const _nav = fxInfo.baseInfo.CurrentNavRes._fNav
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
    const { _isValid, _safePrice, _minPrice, _maxPrice } = priceObj

    let _price = _safePrice
    if (_kind == 'MintFToken' || _kind == 'MintXToken') {
      if (!_isValid) {
        // 'oracle price is invalid'
        _price = false
      }
    } else if (!_isValid) {
      if (_kind == 'RedeemFToken') {
        _price = _maxPrice
      } else if (_kind == 'RedeemXToken') {
        _price = _minPrice
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
    initConfig,
    maxMintableFToken,
    maxMintableXToken,
    maxMintableXTokenWithIncentive,
    maxRedeemableFToken,
    maxRedeemableXToken,
    maxLiquidatable,
    mint,
    mintFToken,
    mintXToken,
    mintXToken_1,
    redeem,
    liquidateWithIncentive,
    _loadSwapState,
  }
}

export default useFxCommon_New
