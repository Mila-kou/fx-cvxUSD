const { version } = require('./package.json')

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  trailingSlash: true,
  compiler: {
    removeConsole: isProd ? { exclude: ['error'] } : false,
  },
  images: {
    // loader: 'custom',
    // dangerouslyAllowSVG: true,
  },
  env: {
    NETWORK_ENV: process.env.NETWORK_ENV,
    VERSION: version,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/clever',
        permanent: false,
      },
    ]
  },
}
