import { useEffect, useState, useMemo } from 'react'
import { notification } from 'antd'
import { useRouter } from 'next/router'
import { useQueries } from '@tanstack/react-query'
import useWeb3 from '@/hooks/useWeb3'
import {
  getInviteCodeList,
  getInviteUser,
  invite,
  getInviteAllUser,
  createCode,
} from '@/services/referral'

const useSignCode = () => {
  const { currentAccount, signMessage } = useWeb3()
  const { query } = useRouter()

  const [code, setCode] = useState('')

  const [
    { data: codeList, refetch: refetch1 },
    { data: inviteUser, isFetched, refetch },
    { data: inviteAllUser, isFetched: isFetched2, refetch: refetch2 },
  ] = useQueries({
    queries: [
      {
        queryKey: ['codeList'],
        queryFn: () => getInviteCodeList(),
        refetchInterval: 0,
      },
      {
        queryKey: ['inviteUser', currentAccount],
        queryFn: () => getInviteUser(currentAccount),
        enabled: !!currentAccount,
        refetchInterval: 0,
      },
      {
        queryKey: ['inviteAllUser'],
        queryFn: () => getInviteAllUser(),
        enabled: !!currentAccount,
        refetchInterval: 0,
      },
    ],
  })

  const refreshCodeInfo = () => {
    refetch1()
    refetch()
    refetch2()
  }

  useEffect(() => {
    if (query?.code) {
      setCode(query.code)
    }
  }, [query?.code])

  const processCreate = async (val) => {
    try {
      if (codeList.includes(val)) {
        return 'This code already exists, change one.'
      }

      const { data } = await createCode({
        signerAddress: currentAccount,
        code: val,
      })

      if (data?.data?.code) {
        notification.success({
          description: `You create a referral code successful!`,
        })
      } else if (data?.data?.error) {
        notification.success({
          description: 'Create failed, please try another code',
        })
      }
      refreshCodeInfo()
      return ''
    } catch (error) {
      return 'Create failed'
    }
  }

  const myCode = useMemo(() => inviteUser?.code || '', [inviteUser])

  const myInviter = useMemo(
    () => inviteAllUser?.[currentAccount?.toLowerCase()]?.channel || '',
    [inviteAllUser, currentAccount]
  )

  const processSign = async () => {
    try {
      if (code === myCode) {
        return 'Can not binding yourself.'
      }
      if (!currentAccount || !code || !codeList) {
        return 'Please try again later'
      }
      if (!codeList.includes(code)) {
        return 'Code not exist'
      }
      const message = `I'm joining f(x) Protocol with my wallet ${currentAccount} have been referred by ${code}`
      const signature = await signMessage(message)
      const { data } = await invite({
        message,
        signerAddress: currentAccount,
        signature,
      })
      // console.log('data-dataCode--', data?.data?.dataCode)
      if (data?.data?.dataCode == 2) {
        notification.success({
          description: `You have joined f(x) Protocol now!`,
        })

        refreshCodeInfo()
        return ''
      }
      if (data?.data?.dataCode == 4) {
        return 'This code is your inviter/invitee.'
      }
      return 'Failed'
    } catch (error) {
      return 'Sign failed'
    }
  }

  useEffect(() => {
    if (!isFetched || !isFetched2 || !query?.code || myInviter) {
      return
    }

    processSign()
  }, [
    currentAccount,
    query?.code,
    code,
    codeList,
    isFetched,
    isFetched2,
    myInviter,
  ])

  return {
    code,
    setCode,
    codeList,
    processSign,
    processCreate,
    myCode,
    myInviter,
  }
}

export default useSignCode
