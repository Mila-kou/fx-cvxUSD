import React, { useEffect, useState, useCallback } from 'react'
import styles from './styles.module.scss'

export const useClearInput = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const clearInput = useCallback(() => {
    setRefreshTrigger((pre) => pre + 1)
  }, [setRefreshTrigger])

  return [refreshTrigger, clearInput]
}

function TextInput(props) {
  const { placeholder, onChange = () => {} } = props

  return (
    <div className={styles.inputContent}>
      <input onChange={onChange} placeholder={placeholder} />
    </div>
  )
}
export default TextInput
