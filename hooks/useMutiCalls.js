import { useCallback, useMemo } from 'react'
import config from '@/config/index'
import abi from '@/config/abi'
import useWeb3 from '@/hooks/useWeb3'
import { useContract } from '@/hooks/useContracts'

function proxy(obj, key, call) {
  Object.defineProperty(obj, key, {
    get: () => call(),
    enumerable: true,
    configurable: false,
  })
}

// 解析组合
const isMethods = (methods) =>
  methods instanceof Object && methods.encodeABI && methods._parent._address

export const useMutiCallV2 = () => {
  const { getContract } = useContract()
  const { web3 } = useWeb3()

  const multiCallArrV2 = useCallback(
    async (methodsArr, ...options) => {
      const multiCallContract = getContract(
        config.contracts.multiCall,
        abi.multiCallABI
      )
      const calls = []
      const len = methodsArr.length
      for (let i = 0; i < len; i++) {
        const v = methodsArr[i]
        calls.push([v._parent._address, v.encodeABI()])
      }
      const res = await multiCallContract.methods
        .aggregate(calls)
        .call(...options)
      return res[1].map((hex, i) => {
        const v = methodsArr[i]
        const result = web3.eth.abi.decodeParameters(v._method.outputs, hex)
        if (result.__length__ === 1) {
          return result[0]
        }
        return result
      })
    },
    [web3, getContract]
  )

  const multiCallsV2 = useCallback(
    async (methodsObj, ...options) => {
      // 存放 encodeABI
      let calls = []
      let pro = []
      // 存放 callsIndex
      const callsIndex = methodsObj instanceof Array ? [] : {}
      //

      function analyze(methods, parentObj, key) {
        if (isMethods(methods)) {
          const index = calls.length
          calls.push(methods)
          proxy(parentObj, key, () => calls[index])
        } else if (methods instanceof Promise) {
          const index = pro.length
          pro.push(methods)
          proxy(parentObj, key, () => pro[index])
        } else if (methods instanceof Object) {
          parentObj[key] = methods instanceof Array ? [] : {}
          // eslint-disable-next-line guard-for-in
          for (const index in methods) {
            analyze(methods[index], parentObj[key], index)
          }
        } else {
          parentObj[key] = methods
        }
      }

      // eslint-disable-next-line guard-for-in
      for (const key in methodsObj) {
        analyze(methodsObj[key], callsIndex, key)
      }
      calls = await multiCallArrV2(calls, ...options)
      if (pro.length > 0) pro = await Promise.all(pro)
      return callsIndex
    },
    [multiCallArrV2]
  )

  return multiCallsV2
}

export const useMutiCall = () => {
  const { getContract } = useContract()
  const { web3 } = useWeb3()

  const multiCall = useCallback(
    async (...methodsArr) => {
      const multicallContract = getContract(
        config.contracts.multiCall,
        abi.multiCallABI
      )
      const calls = []
      // console.log(methodsArr,'methodsArr')
      const decodeParametersType = []
      methodsArr.forEach((v) => {
        calls.push([v._parent._address, v.encodeABI()])
        decodeParametersType.push(v._method.outputs.map((op) => op.type))
      })
      try {
        const res = await multicallContract.methods.aggregate(calls).call()
        return res[1].map((hex, i) => {
          const types = decodeParametersType[i]
          const oneType = types.length === 1
          return web3.eth.abi[oneType ? 'decodeParameter' : 'decodeParameters'](
            oneType ? types[0] : types,
            hex
          )
        })
      } catch (e) {
        console.error('error.multiCall', e, calls, e.message)
        return []
      }
    },
    [web3, getContract]
  )

  return multiCall
}
