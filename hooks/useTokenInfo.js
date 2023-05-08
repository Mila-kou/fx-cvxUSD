import { useEffect, useState, useCallback } from 'react'
import useWeb3 from '@/hooks/useWeb3'
import { useMutiCallV2 } from '@/hooks/useMutiCalls'
import { useContract } from '@/hooks/useContracts'
import config from '@/config/index'

const useTokens = (options) => {
  const { _currentAccount, web3, blockNumber, isAllReady } = useWeb3()
  const [tokenContracts, setTokenContracts] = useState([])
  const [tokenBalance, setTokenBalance] = useState([])
  const [tokenInfo, setTokenInfo] = useState([])
  const multiCallsV2 = useMutiCallV2()
  const { erc20Contract } = useContract()

  const fetchUserInfo = useCallback(async () => {
    try {
      const ethBalance = await web3.eth.getBalance(_currentAccount)
      const noZeroTokens = (options || []).filter(
        (i) => i.address !== config.zeroAddress
      )
      const _tokenContracts = noZeroTokens.map((i) => erc20Contract(i.address))

      const calls = _tokenContracts
        .map(({ methods }, index) => {
          if (noZeroTokens[index]?.approveTo) {
            return [
              methods.balanceOf(_currentAccount),
              methods.allowance(
                _currentAccount,
                noZeroTokens[index]?.approveTo
              ),
            ]
          }
          return [methods.balanceOf(_currentAccount)]
        })
        .reverse()
        .reduce((prev, cur) => cur.concat(prev), [])

      const res = await multiCallsV2(calls)

      const list = noZeroTokens.map((i, index) => {
        if (i.approveTo) {
          return {
            symbol: i.symbol,
            contract: _tokenContracts[index],
            balance: res[index * 2],
            allowance: res[index * 2 + 1],
            source: i,
          }
        }

        return {
          contract: _tokenContracts[index],
          symbol: i.symbol,
          balance: res[index],
          source: i,
        }
      })

      const ethIndex = options.findIndex(
        (i) => i.address === config.zeroAddress
      )

      if (ethIndex > -1) {
        list.splice(ethIndex, 0, {
          symbol: 'eth',
          balance: ethBalance,
        })
      }

      setTokenInfo(list)
      setTokenBalance(list.map((i) => i.balance))
      setTokenContracts(_tokenContracts)
    } catch (error) {
      console.log(error)
    }
  }, [multiCallsV2, erc20Contract, _currentAccount, web3, options])

  useEffect(() => {
    fetchUserInfo()
  }, [_currentAccount, blockNumber])

  return {
    tokenContracts,
    tokenBalance,
    tokenInfo,
  }
}

export const useToken = (address, contractType, lpInfo) => {
  const { _currentAccount, web3, blockNumber, isAllReady } = useWeb3()
  const multiCallsV2 = useMutiCallV2()
  const { erc20Contract } = useContract()
  const [token, setToken] = useState({
    balance: 0,
    allowance: 0,
  })

  const fetchUserInfo = useCallback(async () => {
    try {
      // console.log('fetchUserInfo----', address)
      if (address === config.zeroAddress) {
        const ethBalance = await web3.eth.getBalance(_currentAccount)
        console.log('ethBalance----', ethBalance)
        setToken({
          address,
          balance: ethBalance,
          allowance: ethBalance,
        })
      } else {
        let _contractAddress
        switch (contractType) {
          case 'ido':
            _contractAddress = config.contracts.idoSale
            break
          default:
            _contractAddress = config.contracts.idoSale
            break
        }
        const tokenContract = erc20Contract(address)
        const calls = [
          tokenContract.methods.balanceOf(_currentAccount),
          tokenContract.methods.allowance(_currentAccount, _contractAddress),
        ]
        const [balance, allowance] = await multiCallsV2(calls)

        setToken({
          balance,
          allowance,
          contractAddress: _contractAddress,
          contract: tokenContract,
        })
      }
    } catch (error) {
      console.log(error)
    }
  }, [
    _currentAccount,
    web3,
    erc20Contract,
    multiCallsV2,
    address,
    contractType,
    lpInfo,
  ])

  useEffect(() => {
    if (isAllReady && address) {
      fetchUserInfo()
    }
  }, [web3, blockNumber, isAllReady, address])

  return token
}

export default useTokens
