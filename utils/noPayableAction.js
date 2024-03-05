import notify from '@/components/notify'

const firstUpperCase = (str) =>
  str.toString()[0].toUpperCase() + str.toString().slice(1)
const Timeout = 3000

const noPayableAction = async (fn, options, cb) => {
  const { key, action } = options
  const messageKey = `noPayableAction_${key}_${action}`
  notify.info({ key: messageKey, message: `${firstUpperCase(action)}ing` })

  try {
    const txn = await fn()
    if (txn.hash) {
      notify.txnSubmitted({
        key: messageKey,
        message: 'Transaction Submitted',
        txHash: txn.hash,
      })
    }
    const receipt = await txn.wait()
    if (receipt.status) {
      notify.success({
        key: messageKey,
        message: `Successfully ${firstUpperCase(action)}ed`,
        txHash: receipt.hash,
      })
      setTimeout(() => {
        notify.close(messageKey)
      }, Timeout)
      cb?.(receipt)
    }
  } catch (error) {
    notify.close(messageKey)
    throw error
  }
}

/**
 *
 * @param {*} fn promise
 */
const noPayableAction1 = (fn, options, cb) => {
  const { key, action } = options
  const messageKey = `noPayableAction_${key}_${action}`
  notify.info({ key: messageKey, message: `${firstUpperCase(action)}ing` })

  return new Promise((resolve, reject) => {
    try {
      fn()
        .once('transactionHash', (hash) => {
          console.log('hash', hash)
          notify.txnSubmitted({
            key: messageKey,
            message: 'Transaction Submitted',
            txHash: hash,
          })
        })
        .once('receipt', (receipt) => {
          notify.success({
            key: messageKey,
            message: `Successfully ${firstUpperCase(action)}ed`,
            txHash: receipt.transactionHash,
          })
          setTimeout(() => {
            notify.close(messageKey)
          }, Timeout)
          cb?.(receipt)
          resolve(receipt)
        })
        .once('error', (error) => {
          notify.close(messageKey)
          reject(error)
        })
    } catch (error) {
      notify.close(messageKey)
      reject(error)
    }
  })
}

export const noPayableErrorAction = (messageKey, error) => {
  let msg
  try {
    msg = error?.shortMessage || error?.message

    if (error?.message && error?.message?.toString().includes('estimateGas')) {
      msg = error.message.toString()
    }
  } catch (e) {
    console.log(e)
  }
  notify.error({
    key: messageKey,
    message: `Unexpected Error`,
    description: msg ? msg.toString() : JSON.stringify(error),
  })
  setTimeout(() => {
    notify.close('error_stake_claim')
  }, 3000)
}

export default noPayableAction
