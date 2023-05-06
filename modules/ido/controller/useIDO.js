import { useEffect, useState, useContext, useCallback } from 'react'
import { useQueries } from '@tanstack/react-query'
import useWeb3 from '@/hooks/useWeb3'
import { useContract, erc20Contract } from 'hooks/useContracts'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import abis from 'config/abi'
import config from 'config'
import moment from 'moment'
import { cBN, fb4 } from 'utils'
import useInfo from '../hooks/useInfo'

const momentFormatStr = 'YYYY-MM-DD HH:mm'

export const useIDO = () => {
    const IDOInfo = useInfo()
    console.log('IDOInfo-----',IDOInfo)
    return {
        IDOInfo
    }
}

export default useIDO
