import axios from 'axios'
import config from '@/config/index'
import fetcher from '@/utils/fetcher'

const _fetchUrl = config.concentratorAPI

export const getInviteCodeList = () =>
  fetcher(`${_fetchUrl}/api2/get_inviteCodeList`)
    .then((res) => res.data)
    .catch(() => [])

export const getInviteUser = (signerAddress) =>
  fetcher({
    url: `${_fetchUrl}/api2/get_inviteUser`,
    params: {
      signerAddress,
    },
  })
    .then((res) => res.data)
    .catch(() => [])

export const getInviteAllUser = () =>
  fetcher(`${_fetchUrl}/api2/get_inviteAllUser`)
    .then((res) => res.data)
    .catch(() => {})

export const getInviteCodeInfo = (code) =>
  fetcher({
    url: `${_fetchUrl}/api2/get_inviteCodeInfo`,
    params: {
      code,
    },
  })
    .then((res) => res.data)
    .catch(() => {})

export const createCode = (data) =>
  axios.post(`${_fetchUrl}/api2/inviteCode`, data)

export const invite = (data) => axios.post(`${_fetchUrl}/api2/invite`, data)
