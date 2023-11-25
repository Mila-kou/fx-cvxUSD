import erc20ABI from './ERC20.json'
import multiCallABI from './MultiCall.json'

// IDO
import IdoSale from './ido/IdoSale.json'
import IdoGovernanceVesting from './ido/IdoGovernanceVesting.json'

// fxETH
import FX_Market from './fx/Market.json'
import FX_FractionalToken from './fx/FractionalToken.json'
import FX_LeveragedToken from './fx/LeveragedToken.json'
import FX_Treasury from './fx/Treasury.json'
import FX_ETHGateway from './fx/ETHGateway.json'
import Fx_Gateway from './fx/FxGateway.json'
import Fx_ReservePool from './fx/ReservePool.json'
import Fx_FxETHTwapOracle from './fx/FxETHTwapOracle.json'
import FXNABI from './fx/FXN.json'

// test
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
import CommonABI from './common/abi.json'
import BalancerABI from './common/Balancer.json'
import CurveCopytoABI from './common/curveCopyto.json'
import CurveStaticCoinABI from './common/curveStaticCoin.json'
import AladdinbcCVXABI from './AladdinbcCVX.json'
import RewardClaimHelperABI from './RewardClaimHelper.json'

import FX_stETHGatewayABI from './fx/stETHGateway.json'
import FX_stETHTreasuryABI from './fx/stETHTreasury.json'
import FX_RebalancePoolABI from './fx/RebalancePool.json'
import FX_RebalanceWithBonusTokenABI from './fx/RebalanceWithBonusToken.json'

import wstETHABI from './wstETH.json'
import curveSwapABI from './common/curveSwap.json'

// vesting
import AladdinCLEVVestingABI from './airdrop/vesting.json'
import FX_ManageableVestingABI from './fx/FX_ManageableVesting.json'
import convex_cvxFxnStakingABI from './fx/convex_cvxFxnStaking.json'
import stakeDao_sdFxnStakingABI from './fx/stakeDao_sdFxnStaking.json'

// gauge
import FX_GaugeControllerABI from './fx/farming/fx-GaugeController.json'
import FX_ConvexCurveManagerABI from './fx/farming/fx-ConvexCurveManager.json'
import FX_VotingEscrowBoostABI from './fx/farming/fx-VotingEscrowBoost.json'
import FX_VotingEscrowProxyABI from './fx/farming/fx-VotingEscrowProxy.json'
import FX_fx_SharedLiquidityGaugeABI from './fx/farming/fx_SharedLiquidityGauge.json'
import FX_BoostableRebalancePoolABI from './fx/farming/fx_BoostableRebalancePool.json'
import FX_RebalancePoolGaugeClaimerABI from './fx/farming/fx-RebalancePoolGaugeClaimer.json'

// rebalance
import FX_RebalancePoolRegistryABI from './fx/fx-RebalancePoolRegistry.json'

export default {
  erc20ABI,
  multiCallABI,
  IdoSale,
  IdoGovernanceVesting,
  FXNABI,

  FX_Market,
  FX_FractionalToken,
  FX_LeveragedToken,
  FX_Treasury,
  FX_ETHGateway,
  FX_stETHGatewayABI,
  FX_stETHTreasuryABI,
  FX_RebalancePoolABI,
  FX_RebalanceWithBonusTokenABI,

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
  AladdinbcCVXABI,
  RewardClaimHelperABI,
  wstETHABI,
  Fx_Gateway,
  Fx_ReservePool,
  Fx_FxETHTwapOracle,

  curveSwapABI,

  AladdinCLEVVestingABI,

  FX_GaugeControllerABI,
  FX_ConvexCurveManagerABI,
  FX_VotingEscrowBoostABI,
  FX_VotingEscrowProxyABI,
  FX_fx_SharedLiquidityGaugeABI,
  FX_ManageableVestingABI,
  convex_cvxFxnStakingABI,
  stakeDao_sdFxnStakingABI,

  FX_BoostableRebalancePoolABI,
  FX_RebalancePoolGaugeClaimerABI,

  FX_RebalancePoolRegistryABI,

  // gauge
}
