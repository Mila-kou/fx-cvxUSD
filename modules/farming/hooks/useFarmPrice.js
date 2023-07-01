import { useCallback, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import useGlobal from '@/hooks/useGlobal'
import { useContract } from '@/hooks/useContracts'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import { POOLS_LIST as FarmList } from '@/config/aladdinVault'
import { cBN } from '@/utils/index'
import abi from '@/config/abi'
import config from '@/config/index'

const useFarmPrice = () => {
  const { getContract, erc20Contract } = useContract()
  const multiCallsV2 = useMutiCallV2()
  const { tokenPrice } = useGlobal()

  const getFarmPrice = useCallback(async () => {
    const lpList = FarmList
    const dyNum = 0.01
    try {
      const lpPriceList = {}
      const allFethList = {}
      lpList.forEach((item) => {
        const {
          name,
          nameShow,
          isClevPrice,
          fromPlatform,
          isLock = false,
          lpAddress,
          curveType,
        } = item
        const poolData = config.POOLS_LIST_GAUGE[nameShow]
        if (!poolData || isLock) {
          return
        }
        const {
          lpPoolCurveToken,
          balancerPoolId,
          abiType,
          otherTokenIndex,
          checkLpPriceTokenIndex,
          underlyingAssets,
        } = poolData
        allFethList[lpAddress.toLowerCase()] = {
          name,
          nameShow,
          fromPlatform,
          lpAddress,
          isClevPrice,
          ...poolData,
        }
        const tokenContract = erc20Contract(lpAddress)

        if (fromPlatform.toLowerCase() == 'curve') {
          const coins = underlyingAssets
          const _c1 = getContract(lpPoolCurveToken, [abi.CommonABI[abiType]])
          const _calls1 = coins.map((item, index) =>
            _c1.methods.balances(index)
          )
          const _curveAbi =
            curveType == 'curveCopyto'
              ? abi.CurveCopytoABI
              : abi.CurveStaticCoinABI
          const CurveContract = getContract(lpPoolCurveToken, _curveAbi)
          const _num = dyNum * 1e18
          const _get_dy = CurveContract.methods.get_dy(
            otherTokenIndex,
            checkLpPriceTokenIndex,
            _num.toString()
          )
          allFethList[lpAddress.toLowerCase()].coinBalances = _calls1
          allFethList[lpAddress.toLowerCase()].get_dy = _get_dy
          allFethList[lpAddress.toLowerCase()].coins0 =
            CurveContract.methods.coins(0)
          allFethList[lpAddress.toLowerCase()].coins1 =
            CurveContract.methods.coins(1)
        } else if (fromPlatform.toLowerCase() == 'balancer') {
          const BalancerContractContract = getContract(
            config.contracts.BalancerContract,
            [abi.BalancerABI.getPoolTokens]
          )
          allFethList[lpAddress.toLowerCase()].coinBalances =
            BalancerContractContract.methods.getPoolTokens(balancerPoolId)
        }
        allFethList[lpAddress.toLowerCase()].totalSupply =
          tokenContract.methods.totalSupply()
      })
      const totalSupplies = await multiCallsV2(allFethList)
      const resKey = Object.keys(totalSupplies)
      resKey.forEach((_lpAddress) => {
        const {
          fromPlatform,
          name,
          nameShow,
          isClevPrice,
          lpAddress,
          underlyingAssets,
          underlyingAssetsPercentage,
          checkLpPriceTokenIndex,
          get_dy,
          otherTokenIndex,
          otherTokenName,
          checkLpTokenName,
          coinBalances,
          totalSupply,
        } = totalSupplies[_lpAddress]
        const checkLpPriceTokenName =
          underlyingAssets[checkLpPriceTokenIndex][0]
        const checkLpPriceTokenAddress =
          underlyingAssets[checkLpPriceTokenIndex][1]
        const checkLpPriceTokenDecimal =
          underlyingAssets[checkLpPriceTokenIndex][2]

        const otherTokenAddress = underlyingAssets[otherTokenIndex][1]
        const otherTokenDecimal = underlyingAssets[otherTokenIndex][2]

        const checkLpPriceTokenPrice =
          tokenPrice[
            checkLpPriceTokenName == 'weth' ? 'ETH' : checkLpPriceTokenName
          ]?.usd
        let otherToeknPrice = 0
        let otherToeknPriceInWei = cBN(0)
        let lpPriceInwei = cBN(0)
        let _dy = cBN(0)
        let ClevPrice = 0
        const otherTokenData = {
          dy: _dy.toFixed(4),
          tokenPrice: otherToeknPrice,
          otherTokenAddress,
          otherTokenDecimal,
          otherTokenName,
          checkLpTokenName,
        }
        if (fromPlatform.toLowerCase() == 'curve') {
          const checkLpPriceCoinBalances = coinBalances[checkLpPriceTokenIndex]
          const otherTokenCoinBalances = coinBalances[otherTokenIndex]
          _dy = cBN(get_dy).shiftedBy(-checkLpPriceTokenDecimal).div(dyNum)
          otherToeknPriceInWei = _dy.times(checkLpPriceTokenPrice)
          otherToeknPrice = otherToeknPriceInWei.toFixed(4)
          otherTokenData.dy = _dy.toFixed(4)
          otherTokenData.tokenPrice = otherToeknPrice
          if (isClevPrice) {
            ClevPrice = otherToeknPrice
          }
          lpPriceInwei = cBN(checkLpPriceCoinBalances)
            .shiftedBy(-checkLpPriceTokenDecimal)
            .times(cBN(checkLpPriceTokenPrice))
            .plus(
              cBN(otherTokenCoinBalances)
                .shiftedBy(-otherTokenDecimal)
                .times(otherToeknPriceInWei)
            )
            .div(cBN(totalSupply).shiftedBy(-18))
        } else if (fromPlatform.toLowerCase() == 'balancer') {
          const checkLpPriceTokenPercentage =
            underlyingAssetsPercentage[checkLpPriceTokenAddress]
          const otherTokenPercentage =
            underlyingAssetsPercentage[otherTokenAddress]
          const checkLpPriceCoinBalancesIndex =
            coinBalances.tokens[0].toLowerCase() ==
            checkLpPriceTokenAddress.toLowerCase()
              ? 0
              : 1
          const otherCoinBalancesIndex =
            coinBalances.tokens[0].toLowerCase() ==
            checkLpPriceTokenAddress.toLowerCase()
              ? 1
              : 0

          const checkLpPriceCoinBalances =
            coinBalances.balances[checkLpPriceCoinBalancesIndex]
          const otherCoinBalances =
            coinBalances.balances[otherCoinBalancesIndex]
          _dy = cBN(checkLpPriceCoinBalances)
            .times(otherTokenPercentage)
            .div(cBN(otherCoinBalances).times(checkLpPriceTokenPercentage))
          otherToeknPrice = _dy.times(checkLpPriceTokenPrice).toFixed(4)
          // console.log('otherToeknPrice---', otherToeknPrice.toString(10))
          lpPriceInwei = cBN(checkLpPriceCoinBalances)
            .shiftedBy(-checkLpPriceTokenDecimal)
            .multipliedBy(checkLpPriceTokenPrice)
            .div(checkLpPriceTokenPercentage / 100)
            .div(cBN(totalSupply).div(1e18))
          otherTokenData.dy = _dy.toFixed(4)
          otherTokenData.tokenPrice = otherToeknPrice
        }
        const _lpPrice = lpPriceInwei.toFixed(4)
        lpPriceList[_lpAddress.toLowerCase()] = {
          usd: _lpPrice,
          usdInwei: lpPriceInwei,
          lpAddress,
          otherToeknPrice,
          name,
          nameShow,
          ClevPrice,
          otherTokenData,
        }
      })
      console.log('getLpPrice---', lpPriceList)

      return lpPriceList
    } catch (e) {
      console.log('getLpPrice----error---', e)
      return false
    }
  }, [tokenPrice, getContract, erc20Contract, multiCallsV2])

  const { data: farmingPriceData, refetch } = useQuery({
    queryKey: ['farmPrice'],
    queryFn: getFarmPrice,
    enabled: !!tokenPrice?.weth,
  })

  useEffect(() => {
    console.log('tokenPrice?.weth----', tokenPrice?.weth, tokenPrice)
    if (tokenPrice?.ETH) {
      refetch()
    }
  }, [tokenPrice, refetch])

  return { farmingPriceData, refetch }
}

export default useFarmPrice
