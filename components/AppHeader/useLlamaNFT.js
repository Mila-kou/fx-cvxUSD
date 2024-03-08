import { useQuery } from '@tanstack/react-query'
import { useLlamasContract } from '@/hooks/useContracts'
import useWeb3 from '@/hooks/useWeb3'

const useLlamaNFT = () => {
  const { currentAccount } = useWeb3()
  const { contract } = useLlamasContract()

  const { data } = useQuery({
    queryKey: ['LlamaNFT', currentAccount],
    queryFn: async () => {
      const tokens = await contract.methods
        .tokensForOwner(currentAccount) // 0xfC4B2a62A06cb2E1C6A743E9aE327Bb16977E4c1
        .call()
      if (tokens.length === 0) {
        return ''
      }

      const tokenUri = await contract.methods.tokenURI(tokens[0]).call()
      const tokenResp = await fetch(tokenUri)
      const token = await tokenResp.json()
      return token?.image || ''
    },
    enabled: !!currentAccount,
  })

  return data
}

export default useLlamaNFT
