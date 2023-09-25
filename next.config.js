const { version } = require('./package.json')

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  output: 'export',
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
  async rewrites() {
    return [
      {
        source: '/INCH_HOST/:path*',
        destination: 'https://api.1inch.dev/swap/v5.2/1/:path*',
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: false,
      },
    ]
  },
  exportPathMap(defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
    return {
      '/': { page: '/vaults' },
    }
  },
}
