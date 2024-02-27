import { useCallback, useContext, useEffect, useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { useInitialFundContract } from '@/hooks/useFXUSDContract'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import { useWstETH, useSfrxETH } from '@/hooks/useContracts'
import useWeb3 from '@/hooks/useWeb3'
import {
  cBN,
  fb4,
  checkNotZoroNumOption,
  dollarText,
  checkNotZoroNum,
} from '@/utils/index'
import { GENESIS_MAP } from '@/config/tokens'
import { updateGenesis } from '@/store/slices/genesis'

const useGenesis = () => {
  const { blockNumber, currentAccount } = useWeb3()
  const multiCallsV2 = useMutiCallV2()
  const dispatch = useDispatch()
  const { contract: wstETHContract } = useWstETH()
  const { contract: sfrxETHContract } = useSfrxETH()

  const getInitialFundContract = useInitialFundContract()

  const fetchGenesisData = async (arr) => {
    try {
      const calls = arr.map((item) => {
        const {
          totalShares,
          shares,
          fxWithdrawalEnabled,
          totalFToken,
          totalXToken,
        } = getInitialFundContract(item.address).contract.methods

        return {
          symbol: item.symbol,
          totalSharesRes: totalShares(),
          sharesRes: shares(currentAccount),
          fxWithdrawalEnabled: fxWithdrawalEnabled(),
          totalFTokenRes: totalFToken(),
          totalXTokenRes: totalXToken(),
        }
      })

      const callData = await multiCallsV2(calls)

      const countCalls = callData.map((item) => {
        const { sharesRes, totalSharesRes, symbol } = item

        const countFunc =
          symbol === 'stETH'
            ? wstETHContract.methods.getStETHByWstETH
            : sfrxETHContract.methods.convertToAssets

        return {
          totalShare: checkNotZoroNum(totalSharesRes)
            ? countFunc(totalSharesRes)
            : 0,
          shares: checkNotZoroNum(sharesRes) ? countFunc(sharesRes) : 0,
        }
      })

      const countCallData = await multiCallsV2(countCalls)

      const data = {}

      callData.forEach((item, index) => {
        const { symbol, totalFTokenRes, totalXTokenRes, sharesRes } = item
        const { totalShare, shares } = countCallData[index]

        const totalShares_text = checkNotZoroNumOption(
          totalShare,
          fb4(totalShare)
        )

        const shares_text = checkNotZoroNumOption(shares, fb4(shares))

        const ratio = cBN(shares).dividedBy(totalShare)

        // receive
        const xToken_text = fb4(cBN(totalXTokenRes).multipliedBy(ratio))
        const fToken_text = fb4(cBN(totalFTokenRes).multipliedBy(ratio))

        const genesis = GENESIS_MAP[symbol]

        data[symbol] = {
          ...item,
          ...countCallData[index],
          ...genesis,
          isDeposited: checkNotZoroNum(sharesRes),
          totalShares_text,
          shares_text,
          ratio,
          xToken_text,
          fToken_text,
        }
      })
      return data
    } catch (error) {
      console.log('genesisData ----error', error)
      return {}
    }
  }

  const [{ data: genesisData, refetch: refetch1, isFetching: isFetching1 }] =
    useQueries({
      queries: [
        {
          queryKey: ['genesisData', currentAccount],
          queryFn: () => fetchGenesisData(Object.values(GENESIS_MAP)),
        },
      ],
    })

  useEffect(() => {
    if (!isFetching1) refetch1()
  }, [blockNumber])

  useEffect(() => {
    if (genesisData) {
      Object.values(genesisData).forEach((item) => {
        dispatch(updateGenesis(item))
      })
    }
  }, [genesisData, dispatch])
}

export default useGenesis
