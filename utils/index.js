import { message } from 'antd'
import BigNumber from 'bignumber.js'

export const cBN = (val) => new BigNumber(val)

export const dollarText = (val) => {
  if (val === '-') return '$0'
  if (val === undefined) return '$0'
  return `$${val}`
}

export const checkNotZoroNum = (num) => {
  if (!num) {
    return false
  }
  return !(cBN(num).isZero() || cBN(num).isNaN() || !cBN(num).isFinite())
}

export function formatBalance(balanceInWei, decimals = 18, toFixed = -1) {
  if (cBN(balanceInWei).isNaN()) return '0'

  const formatResult = (result) => {
    if (cBN(result).isZero() || Number.isNaN(result) || result === 'NaN') {
      return '0'
    }

    const trimZero =
      result.split('.').length > 1
        ? result.replace(/0+?$/gi, '').replace(/[.]$/gi, '')
        : result

    if (cBN(result).isLessThan(1)) {
      return `${trimZero}`
    }

    return trimZero
  }

  if (toFixed === -1) {
    const result = cBN(balanceInWei).div(cBN(10).pow(decimals)).toFormat()

    return formatResult(result)
  }

  const result = cBN(balanceInWei)
    .div(cBN(10).pow(decimals))
    .toFormat(toFixed, 1)

  return formatResult(result)
}

export const addToMetamask = (options) => {
  try {
    window.ethereum
      .request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: options.address,
            symbol: options.symbol,
            decimals: options.decimals,
            image: options.image,
          },
        },
      })
      .then((success) => {
        if (success) {
          message.success('Token Added')
        } else {
          message.error('Failed to add token')
        }
      })
  } catch (error) {
    message.error('Failed to add token')
  }
}

export const fb4 = (balance, isMoney, decimals, toFixedNum = -1) => {
  if (cBN(balance).isZero()) {
    return isMoney ? '$0' : '-'
  }
  if (cBN(balance).isNaN()) {
    return isMoney ? '$0' : '-'
  }

  return `${isMoney ? '$' : ''}${formatBalance(
    balance,
    decimals ?? 18,
    toFixedNum > -1 ? toFixedNum : isMoney ? 2 : 4
  )}`
}

export const groupByLength = (array, subGroupLength) => {
  let index = 0
  const newArray = []

  while (index < array.length) {
    newArray.push(array.slice(index, (index += subGroupLength)))
  }

  return newArray
}

export const checkNotZoroNumOption = (num, cb) => {
  if (checkNotZoroNum(num)) {
    return cb
  }
  return '-'
}

export const numberLess = (number, floorNum, cb) => {
  if (cBN(number).isLessThan(floorNum)) {
    return `<${floorNum}`
  }
  return cb
}

export const getConvexData = (connvexInfo, tokenName) => {
  try {
    const info = connvexInfo.find((item) => {
      const iname = decodeURI(encodeURI(item.name).replace(/%E2%80%8B/g, ''))
      return (
        iname.toLocaleLowerCase() === tokenName.toLocaleLowerCase() ||
        item.name === tokenName ||
        item.depositInfo.url === tokenName
      )
    })
    return info
  } catch (e) {
    // console.log('tokenName----', tokenName)
    return null
  }
}
