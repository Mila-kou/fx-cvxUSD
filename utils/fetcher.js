import axios from 'axios'

// request.interceptors.request.use((config) => {
//   console.log('url----', config.url)
//   return config
// })

export default function fetcher(req) {
  return new Promise((resolve, reject) => {
    axios(req || {}).then(
      (res) => {
        resolve(res.data)
      },
      (error) => {
        reject(error)
      }
    )
  })
}
