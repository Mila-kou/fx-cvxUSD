import { useEffect, useState, useContext, useCallback } from 'react'
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
