const { version } = require('./package.json')

const isProd = false // process.env.NODE_ENV === 'production'

const config = isProd
  ? {
      output: 'export',
      exportPathMap(defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
        return {
          ...defaultPathMap,
          '/home': { page: '/assets' },
          '/': { page: '/assets' },
        }
      },
    }
  : {
      async rewrites() {
        return [
          {
            source: '/INCH_HOST/:path*',
            destination: 'https://api.1inch.dev/swap/v5.2/1/:path*',
          },
        ]
      },
    }

module.exports = {
  trailingSlash: true,
  images: {
    unoptimized: true,
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
        destination: '/genesis',
        permanent: false,
      },
      {
        source: '/assets/fxUSD',
        destination: '/genesis',
        permanent: false,
      },
      {
        source: '/assets/xstETH',
        destination: '/genesis',
        permanent: false,
      },
      {
        source: '/assets/xfrxETH',
        destination: '/genesis',
        permanent: false,
      },
    ]
  },
  ...config,
  exportPathMap(defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
    return {
      ...defaultPathMap,
      '/home': { page: '/assets' },
      '/': { page: '/genesis' },
    }
  },
}
