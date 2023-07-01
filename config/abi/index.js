import erc20ABI from './ERC20.json'
import multiCallABI from './MultiCall.json'

//IDO
import IdoSale from './ido/IdoSale.json'
import IdoGovernanceVesting from './ido/IdoGovernanceVesting.json'

//fxETH
import FX_Market from './fx/Market.json'
import FX_FractionalToken from './fx/FractionalToken.json'
import FX_LeveragedToken from './fx/LeveragedToken.json'
import FX_Treasury from './fx/Treasury.json'
import FX_ETHGateway from './fx/ETHGateway.json'

//test
import MockTwapOracle from './fx/MockTwapOracle.json'

import AladdinCVXLockerABI from './AladdinCVXLocker.json'
import AladdinCVXABI from './AladdinCVX.json'
import TransmuterABI from './Transmuter.json'

import AlaLiquidityGaugeV3ABI from './ve/AlaLiquidityGaugeV3.json'
import AlaVeCLEVABI from './ve/AlaVeCLEV.json'
import AlaFeeDistributor from './ve/AlaFeeDistributor.json'
import AlaCLEV from './ve/AlaCLEV.json'
import AlaMinterABI from './ve/AlaMinter.json'
import AlaGaugeControllerABI from './ve/AlaGaugeController.json'
import AlaAllInOneGatewayABI from './ve/AllInOneGateway.json'
import PlatformFeeDistributorABI from './PlatformFeeDistributor.json'
import CommonABI from './common/abi.json'
import BalancerABI from './common/Balancer.json'
import CurveCopytoABI from './common/curveCopyto.json'
import CurveStaticCoinABI from './common/curveStaticCoin.json'
import AladdinbcCVXABI from './AladdinbcCVX.json'
import RewardClaimHelperABI from './RewardClaimHelper.json'

export default {
  erc20ABI,
  multiCallABI,
  IdoSale,
  IdoGovernanceVesting,

  FX_Market,
  FX_FractionalToken,
  FX_LeveragedToken,
  FX_Treasury,
  FX_ETHGateway,

  MockTwapOracleAbi: MockTwapOracle,

  AladdinCVXLockerABI,
  AladdinCVXABI,
  TransmuterABI,
  AlaVeCLEVABI,
  AlaFeeDistributor,
  AlaCLEV,
  AlaLiquidityGaugeV3ABI,
  AlaMinterABI,
  AlaGaugeControllerABI,
  AlaAllInOneGatewayABI,
  CommonABI,
  BalancerABI,
  CurveCopytoABI,
  CurveStaticCoinABI,
  PlatformFeeDistributorABI,
  AladdinbcCVXABI,
  RewardClaimHelperABI,
}
