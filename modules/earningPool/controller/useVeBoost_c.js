import { useEffect, useState, useContext, useCallback, useMemo } from 'react'
import moment from 'moment'
import { cBN, checkNotZoroNum, checkNotZoroNumOption, fb4 } from '@/utils/index'
import { useGlobal } from '@/contexts/GlobalProvider'
import config from '@/config/index'
import useWeb3 from '@/hooks/useWeb3'
import NoPayableAction, { noPayableErrorAction } from '@/utils/noPayableAction'
import { POOLS_LIST } from '@/config/aladdinVault'
import { useContract, useVeFXN } from '@/hooks/useContracts'
import abi from '@/config/abi'
import { useVeBoost } from '@/hooks/calculator/useVeBoost'

const useVeBoost_c = (gaugeItem) => {
  const { lpGaugeContract, baseInfo = {}, userInfo = {} } = gaugeItem
  const { currentAccount, isAllReady } = useWeb3()
  const { totalSupply } = baseInfo
  const veContract = useVeFXN()
  const data = useVeBoost({
    veContract,
    lpContract: lpGaugeContract, // lp gauge contract
    depositAmount: 0, // lp deposit amount
    gaugeTotalSupply: 0, // lp totalSupply
    veTotalSupply: 0, // ve veTotalSupply
    userVeAmount: 0, // ve userVeCLEV
    veContractTargetAccount: currentAccount,
    gaugeContractTargetAccount: currentAccount, // gaugeContract working_balances targeAccount
  })
  console.log('ve-boost--', data)
  return data
}

export default useVeBoost_c
