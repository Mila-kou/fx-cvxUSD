import React, { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/router'
import cn from 'classnames'
import { useSelector } from 'react-redux'
import Button from '@/components/Button'
import Tabs from '@/modules/assets/components/Tabs'
import BalanceInput, { useClearInput } from '@/components/BalanceInput'
import noPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import useWeb3 from '@/hooks/useWeb3'
import useApprove from '@/hooks/useApprove'
import { useToken } from '@/hooks/useTokenInfo'
import { getGas } from '@/utils/gas'
import WithdrawModal from './WithdrawModal'
import Select from '@/components/Select'
import { ASSET_MAP, BASE_TOKENS_MAP } from '@/config/tokens'
import SlippageInfo from '@/components/SlippageInfo'
import {
  useFxUSD_GatewayRouter_contract,
  useInitialFundContract,
} from '@/hooks/useFXUSDContract'
import { cBN, checkNotZoroNum, checkNotZoroNumOption, fb4 } from '@/utils/index'
import config from '@/config/index'
import styles from './styles.module.scss'
import useGenesis_c from './controller/useGenesis_c'
import { useZapIn } from '@/hooks/useZap'
import { DetailCell } from '@/modules/assets/components/Common'
import MerkleTree from '@/modules/earningPool/MerkleTree'

const STAGE = {
  LAUNCHING: 'Launching...',
  LAUNCHED: 'Event End Time: 2024/03/06 10:20:30',
  FULL_LAUNCHED: 'Full Launched',
}

const TOKEN_OPTIONS = {
  stETH: [
    ['ETH', config.tokens.eth],
    ['stETH', config.tokens.stETH],
    ['USDT', config.tokens.usdt],
    ['USDC', config.tokens.usdc],
    ['Frax', config.tokens.frax],
    ['crvUSD', config.tokens.crvUSD],
  ],
  frxETH: [
    ['ETH', config.tokens.eth],
    ['frxETH', config.tokens.frxETH],
    ['USDT', config.tokens.usdt],
    ['USDC', config.tokens.usdc],
    ['Frax', config.tokens.frax],
    ['crvUSD', config.tokens.crvUSD],
  ],
  eETH: [
    ['weETH', config.tokens.weETH],
    // ['ETH', config.tokens.eth],
    // ['eETH', config.tokens.eETH],
    // ['USDT', config.tokens.usdt],
    // ['USDC', config.tokens.usdc],
    // ['crvUSD', config.tokens.crvUSD],
  ],
  ezETH: [
    ['ezETH', config.tokens.ezETH],
    // ['ETH', config.tokens.eth],
    // ['eETH', config.tokens.eETH],
    // ['USDT', config.tokens.usdt],
    // ['USDC', config.tokens.usdc],
    // ['crvUSD', config.tokens.crvUSD],
  ],
}

export default function GenesisPage() {
  const { query } = useRouter()
  const { assetSymbol: _assetSymbol = 'fxUSD' } = query

  const [assetSymbol, _baseSymbol = 'ETH'] = _assetSymbol.split('_')

  const genesisData = useGenesis_c()
  const { tokens } = useSelector((state) => state.token)

  const genesis = useSelector((state) => state.genesis)
  const [slippage, setSlippage] = useState(0.3)
  const { getZapInParams } = useZapIn()

  const { baseTokenInfos } = ASSET_MAP[assetSymbol]

  // const stage = {
  //   fxUSD: STAGE.FULL_LAUNCHED,
  //   rUSD_eETH: STAGE.FULL_LAUNCHED,
  //   rUSD_ezETH: STAGE.LAUNCHING,
  // }[_assetSymbol]

  const [stage, setStage] = useState(
    {
      fxUSD: STAGE.FULL_LAUNCHED,
      rUSD_eETH: STAGE.FULL_LAUNCHED,
      rUSD_ezETH: STAGE.LAUNCHING,
    }[_assetSymbol]
  )

  const [clearTrigger, clearInput] = useClearInput()
  const { _currentAccount, sendTransaction } = useWeb3()
  const [activeIndex, setActiveIndex] = useState(0)
  const [symbol, setSymbol] = useState(_baseSymbol)
  const [isDepositing, setIsDepositing] = useState(false)
  const [fromAmount, setFromAmount] = useState(0)
  const [minOut, setMinOut] = useState(0)
  const { contract: fxUSD_GatewayRouterContract } =
    useFxUSD_GatewayRouter_contract()
  const getInitialFundContract = useInitialFundContract()

  useEffect(() => {
    setSymbol(_baseSymbol)
  }, [assetSymbol, setSymbol, _baseSymbol])

  const [withdrawInfo, setWithdrawInfo] = useState(null)
  const [isBaseToken, setIsBaseToken] = useState(false)

  const [isWithdrawing, setIsWithdrawing] = useState({
    stETH: false,
    frxETH: false,
    eETH: false,
    ezETH: false,
  })
  const [isWithdrawBaseTokening, setIsWithdrawBaseTokening] = useState({
    stETH: false,
    frxETH: false,
    eETH: false,
    ezETH: false,
  })

  const _baseTokenInfos =
    assetSymbol === 'rUSD' ? [BASE_TOKENS_MAP[_baseSymbol]] : baseTokenInfos

  const pools = _baseTokenInfos.map((item) => ({
    ...item,
    ...genesis[item.baseName],
    apy: genesisData[item.baseName].apy,
  }))

  const pool = pools[activeIndex]

  const { baseName, baseSymbol } = pool

  const showDeposited =
    stage !== STAGE.LAUNCHING || !!pools.find((item) => item.isDeposited)

  const OPTIONS = TOKEN_OPTIONS[baseName]

  const selectTokenAddress = useMemo(() => {
    return OPTIONS.find((item) => item[0] === symbol)[1]
  }, [symbol])

  const selectTokenInfo = useToken(
    selectTokenAddress,
    symbol === baseSymbol ? pool.address : 'fxUSD_gateway_router'
  )

  const { BtnWapper, needApprove } = useApprove({
    approveAmount: fromAmount,
    allowance: selectTokenInfo.allowance,
    tokenContract: selectTokenInfo.contract,
    approveAddress: selectTokenInfo.contractAddress,
  })

  const initPage = () => {
    clearInput()
    setFromAmount('0')
    setMinOut(0)
  }

  useEffect(() => {
    initPage()
  }, [symbol])

  const canDeposit = useMemo(() => {
    const _enableETH =
      cBN(fromAmount).isLessThanOrEqualTo(tokens[symbol].balance) &&
      cBN(fromAmount).isGreaterThan(0)

    if (needApprove && _enableETH) return true

    return _enableETH && cBN(minOut).isGreaterThan(0)
  }, [fromAmount, symbol, needApprove, minOut])

  const minGas = 234854

  const getMintGas = async (_fromAmount) => {
    const getGasPrice = await getGas()
    const gasFee = cBN(minGas).times(1e9).times(getGasPrice).toFixed(0, 1)
    let _ETHtAmountAndGas
    if (
      cBN(_fromAmount).plus(gasFee).isGreaterThan(tokens.ETH.balance) &&
      symbol == 'ETH'
    ) {
      _ETHtAmountAndGas = cBN(tokens.ETH.balance)
        .minus(gasFee)
        .toFixed(0, 1)
        .toString(10)
    } else {
      _ETHtAmountAndGas = cBN(_fromAmount).toString(10)
    }
    return _ETHtAmountAndGas
  }

  const getMinAmount = async () => {
    const _mockAmount = fromAmount
    const _mockRatio = 1

    console.log('_mockAmount-----', _mockAmount, symbol)
    try {
      let minout_ETH
      if (checkNotZoroNum(fromAmount)) {
        const _ETHtAmountAndGas = await getMintGas(fromAmount)

        const convertParams = await getZapInParams({
          from: symbol,
          to: baseSymbol,
          amount: _ETHtAmountAndGas,
          slippage,
        })

        const resData = await fxUSD_GatewayRouterContract.methods
          .fxInitialFundDeposit(convertParams, pool.address)
          .call({
            from: _currentAccount,
            value: symbol == 'ETH' ? _ETHtAmountAndGas : 0,
          })
        console.log('deposit--resData----', resData)
        minout_ETH = resData
      } else {
        minout_ETH = 0
      }

      // 比例计算
      minout_ETH *= _mockRatio

      const _minOut_CBN = (cBN(minout_ETH) || cBN(0)).multipliedBy(
        cBN(1).minus(cBN(slippage).dividedBy(100))
      )
      setMinOut(
        checkNotZoroNumOption(_minOut_CBN, fb4(_minOut_CBN.toString(10)))
      )

      return _minOut_CBN.toFixed(0, 1)
    } catch (error) {
      console.log('deposit----error--', error)
      setMinOut(0)
      return 0
    }
  }

  useEffect(() => {
    getMinAmount(true)
  }, [slippage, fromAmount, _currentAccount])

  const handleDeposit = async () => {
    try {
      setIsDepositing(true)
      const _ETHtAmountAndGas = await getMintGas(fromAmount)

      let apiCall
      let to

      if (symbol === baseSymbol) {
        apiCall = await getInitialFundContract(
          pool.address
        ).contract.methods.deposit(_ETHtAmountAndGas, _currentAccount)
        to = pool.address
      } else {
        const _minOut = await getMinAmount()

        if (!_minOut) return

        const convertParams = await getZapInParams({
          from: symbol,
          to: baseSymbol,
          amount: _ETHtAmountAndGas,
          minOut: _minOut,
          slippage,
        })

        console.log('convertParams---', convertParams, symbol)

        apiCall =
          await fxUSD_GatewayRouterContract.methods.fxInitialFundDeposit(
            convertParams,
            pool.address
          )

        to = fxUSD_GatewayRouterContract._address
      }

      await noPayableAction(
        () =>
          sendTransaction({
            to,
            value: symbol == 'ETH' ? _ETHtAmountAndGas : 0,
            data: apiCall.encodeABI(),
          }),
        {
          key: 'Deposit',
          action: 'Deposit',
        }
      )
      setIsDepositing(false)
      initPage()
    } catch (error) {
      setIsDepositing(false)
      initPage()
      noPayableErrorAction(`error_Deposit---`, error)
    }
  }

  const hanldeETHAmountChanged = (v) => {
    setFromAmount(v.toString(10))
  }

  const deposits = pools.filter((item) => genesis[item.symbol].isDeposited)

  const withdraw = async (_symbol) => {
    setIsBaseToken(false)
    if (!withdrawInfo) {
      setWithdrawInfo(genesis[_symbol])
      return
    }

    if (!genesis[_symbol].fxWithdrawalEnabled) {
      return
    }

    setWithdrawInfo(null)

    try {
      setIsWithdrawing((pre) => ({
        ...pre,
        [_symbol]: true,
      }))

      const apiCall = await getInitialFundContract(
        genesis[_symbol].address
      ).contract.methods.withdraw(_currentAccount)
      await noPayableAction(
        () =>
          sendTransaction({
            to: genesis[_symbol].address,
            data: apiCall.encodeABI(),
          }),
        {
          key: 'Withdraw',
          action: 'Withdraw',
        }
      )
      setIsWithdrawing((pre) => ({
        ...pre,
        [_symbol]: false,
      }))
    } catch (error) {
      setIsWithdrawing((pre) => ({
        ...pre,
        [_symbol]: false,
      }))
      noPayableErrorAction(`error_Withdraw---`, error)
    }
  }

  const getMinoutBaseToken = async (_symbol) => {
    try {
      const res = await getInitialFundContract(genesis[_symbol].address)
        .contract.methods.withdrawBaseToken(_currentAccount, 0)
        .call({
          from: _currentAccount,
        })

      return res
    } catch (error) {
      console.log('error----', error)
    }
    return 0
  }

  const withdrawBaseToken = async (_symbol) => {
    setIsBaseToken(true)
    if (!withdrawInfo && stage !== STAGE.FULL_LAUNCHED) {
      setWithdrawInfo(genesis[_symbol])
      return
    }

    setWithdrawInfo(null)

    try {
      setIsWithdrawBaseTokening((pre) => ({
        ...pre,
        [_symbol]: true,
      }))

      const mintOut = await getMinoutBaseToken(_symbol)
      const _mintOut = cBN(mintOut)
        .times(1 - 0.003)
        .toFixed(0, 1)
      const apiCall = await getInitialFundContract(
        genesis[_symbol].address
      ).contract.methods.withdrawBaseToken(_currentAccount, _mintOut)
      await noPayableAction(
        () =>
          sendTransaction({
            to: genesis[_symbol].address,
            data: apiCall.encodeABI(),
          }),
        {
          key: 'Withdraw',
          action: 'Withdraw',
        }
      )
      setIsWithdrawBaseTokening((pre) => ({
        ...pre,
        [_symbol]: false,
      }))
    } catch (error) {
      setIsWithdrawBaseTokening((pre) => ({
        ...pre,
        [_symbol]: false,
      }))
      noPayableErrorAction(`error_Withdraw---`, error)
    }
  }

  const getApyText = (apy) => {
    if (assetSymbol === 'rUSD') {
      return `${apy} + 2x ${
        _baseSymbol === 'ezETH' ? 'Renzo ezPoints' : 'Etherfi Points'
      } + Eigen Layer Points`
    }
    return `MAX APY ${apy}`
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className="flex gap-[6px] text-[22px]">{assetSymbol} Genesis</h2>
          {/* <p className="md:float-right">{stage}</p> */}
          <h2 className="flex gap-[6px] mt-[16px]">Current Deposited</h2>

          <div className={styles.items}>
            {pools.map((item) => (
              <div className={styles.item} key={item.symbol}>
                <p>{item.symbol}</p>
                <h2 className="text-[22px]">{item.totalShares_text}</h2>
                {stage !== STAGE.LAUNCHING && (
                  <h2 className="text-[20px] mt-[8px] text-[var(--primary-color)]">
                    {getApyText(item.apy)}
                  </h2>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showDeposited && (
        <div className={styles.content}>
          <h2 className="flex gap-[6px]">My Position</h2>

          {stage === STAGE.LAUNCHING ? (
            <div className={styles.items}>
              {deposits.map((item) => (
                <div className={styles.item} key={item.symbol}>
                  <p>{item.symbol}</p>
                  <h2 className="text-[22px]">{item.shares_text}</h2>
                </div>
              ))}
            </div>
          ) : (
            <div>
              {pools.map((item) => (
                <div
                  className={cn(styles.item, 'mt-[32px] px-[24px]')}
                  key={item.symbol}
                >
                  <div className="flex justify-between mb-[24px]">
                    <p className="text-[20px]">{item.symbol}</p>
                    <p>
                      {item.shares_text} {item.symbol}
                    </p>
                  </div>

                  {/* stage === STAGE.LAUNCHED && (
                    <div>
                      <p className="text-[16px] text-[var(--second-text-color)]">
                        You can withdraw {assetSymbol} + {item.xToken} after the event.
                      </p>
                    </div>
                  ) */}

                  {/* stage === STAGE.FULL_LAUNCHED && (
                    <div>
                      <p>Fully Rewarded</p>
                      <p className="text-[16px] mt-[6px] text-[var(--second-text-color)]">
                        All Reward, {assetSymbol} (equal to your deposit) or withdraw
                        your deposit.
                      </p>
                    </div>
                  ) */}

                  <div className="flex max-md:flex-col gap-[32px] mt-[16px]">
                    <Button
                      className="md:flex-1"
                      size="large"
                      onClick={() => withdraw(item.symbol)}
                      loading={isWithdrawing[item.symbol]}
                      disabled={!item.isDeposited}
                    >
                      Get {assetSymbol} + {item.xToken}
                    </Button>
                    <Button
                      className="md:flex-1"
                      size="large"
                      style={{ background: 'var(--primary-color)' }}
                      onClick={() => withdrawBaseToken(item.symbol)}
                      loading={isWithdrawBaseTokening[item.symbol]}
                      disabled={!item.isDeposited}
                    >
                      Withdraw {item.baseSymbol}
                    </Button>
                  </div>
                </div>
              ))}

              {['fxUSD'].includes(assetSymbol) && (
                <div className="mt-[32px] flex flex-col gap-[16px]">
                  <MerkleTree />
                  <MerkleTree tokenName="wstETH" title="" />
                  <MerkleTree tokenName="FXS" title="" />
                </div>
              )}
              {['rUSD'].includes(assetSymbol) && (
                <div className="mt-[32px] flex flex-col gap-[16px]">
                  <MerkleTree />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {stage === STAGE.LAUNCHING && (
        <div className={styles.content}>
          <h2 className="flex gap-[6px]  text-[22px]">Participate</h2>
          {/* <p className="mt-[16px]">Deposit ETH</p> */}
          <p className="text-[16px] mt-[16px] text-[var(--second-text-color)]">
            Any deposit to the vault will be minted into 50:50 ratio of stable &
            leverage tokens for that vault. No mint fees apply!
          </p>

          <h2 className="flex gap-[6px] my-[16px] text-[16px]">
            {/* Choose BaseToken Vault */}
          </h2>
          <Tabs
            selecedIndex={activeIndex}
            onChange={(v) => {
              if (activeIndex === v) return
              setActiveIndex(v)
              setSymbol('ETH')
            }}
            tabs={pools.map((item) => (
              <div className="py-[6px]" key={item.symbol}>
                <p className="text-center">{item.symbol}</p>
                <h2 className="text-[20px] mt-[8px] text-[var(--primary-color)]">
                  {getApyText(item.apy)}
                </h2>
              </div>
            ))}
          />

          <h2 className="flex gap-[6px] mt-[32px] mb-[16px] text-[16px]">
            Deposit Token and Amount
          </h2>
          <BalanceInput
            placeholder="0"
            symbol={symbol}
            decimals={config.zapTokens[symbol].decimals}
            balance={fb4(
              tokens[symbol].balance,
              false,
              config.zapTokens[symbol].decimals
            )}
            maxAmount={tokens[symbol].balance}
            clearTrigger={clearTrigger}
            onChange={hanldeETHAmountChanged}
            options={OPTIONS.map((item) => item[0])}
            onSymbolChanged={(v) => setSymbol(v)}
            withUsd={false}
          />
          {symbol !== baseSymbol && (
            <div className="my-[16px]">
              <SlippageInfo slippage={slippage} slippageChange={setSlippage} />
            </div>
          )}
          {checkNotZoroNum(minOut) ? (
            <DetailCell
              title="Min. Received:"
              content={[`${minOut} ${pool.baseSymbol}`]}
            />
          ) : null}
          <div className="mx-[auto] w-[50%] mt-[32px]">
            <BtnWapper
              loading={isDepositing}
              disabled={!canDeposit}
              onClick={handleDeposit}
              width="100%"
            >
              Join in
            </BtnWapper>
          </div>
        </div>
      )}

      {withdrawInfo && (
        <WithdrawModal
          onCancel={() => setWithdrawInfo(null)}
          onClaim={isBaseToken ? withdrawBaseToken : withdraw}
          info={withdrawInfo}
          assetSymbol={assetSymbol}
          getMinoutBaseToken={getMinoutBaseToken}
          isBaseToken={isBaseToken}
          isFullLaunched={stage === STAGE.FULL_LAUNCHED}
        />
      )}

      {/* <Select
        className="mt-[16px] h-[58px] w-[200px] mx-auto"
        style={{
          border: '1px solid #a6a6ae',
          borderRadius: '4px',
        }}
        options={Object.values(STAGE).map((value, index) => ({
          value,
          label: Object.keys(STAGE)[index],
        }))}
        value={stage}
        onChange={setStage}
      /> */}
    </div>
  )
}
