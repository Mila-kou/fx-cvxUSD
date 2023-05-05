import { useContext } from 'react'
import { Web3Context } from '@/contexts/Web3Provider'

const useWeb3 = () => useContext(Web3Context)

export default useWeb3
