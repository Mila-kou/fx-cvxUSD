import { useEffect, useState } from 'react'
import { notification } from 'antd'
import { useRouter } from 'next/router'
import { useQueries } from '@tanstack/react-query'
import useWeb3 from '@/hooks/useWeb3'
import { getCodeList, getInviteUser, invite } from '@/services/dataInfo'

const useSignCode = () => {
  const { currentAccount, signMessage } = useWeb3()
  const { query } = useRouter()

  const [code, setCode] = useState('')

  const [{ data: codeList }, { data: inviteUser, isFetched, refetch }] =
    useQueries({
      queries: [
        {
          queryKey: ['codeList'],
          queryFn: () => getCodeList(),
          refetchInterval: 0,
        },
        {
          queryKey: ['inviteUser', currentAccount],
          queryFn: () => getInviteUser(currentAccount),
          enabled: !!currentAccount,
          refetchInterval: 0,
        },
      ],
    })

  useEffect(() => {
    if (query?.code) {
      setCode(query.code)
    }
  }, [query?.code])

  const processSign = async () => {
    try {
      const message = `I'm community member of ${code}`
      const signature = await signMessage(message)
      const { data } = await invite({
        message,
        signerAddress: currentAccount,
        signature,
      })
      // console.log('data-dataCode--', data?.data?.dataCode)
      if (data?.data?.dataCode == 2) {
        notification.success({
          description: `You are community member of ${code} Now!`,
        })
      }
      refetch()
    } catch (error) {
      console.log('sign failed')
    }
  }

  useEffect(() => {
    if (!isFetched) {
      return
    }

    if (inviteUser && inviteUser?.channel) {
      return
    }

    if (currentAccount && code && codeList) {
      if (codeList.includes(code)) {
        processSign()
      }
    }
  }, [currentAccount, code, codeList, inviteUser, isFetched])
}

export default useSignCode
