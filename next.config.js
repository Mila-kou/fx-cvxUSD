const { version } = require('./package.json')

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  output: 'export',
  trailingSlash: true,
  compiler: {
    removeConsole: isProd ? { exclude: ['error'] } : false,
  },
  images: {
    unoptimized: true,
    // loader: 'custom',
    // dangerouslyAllowSVG: true,
  },
  env: {
    NETWORK_ENV: process.env.NETWORK_ENV,
    VERSION: version,
  },
  // async redirects() {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/home',
  //       permanent: false,
  //     },
  //   ]
  // },
  exportPathMap(defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
    return {
      ...defaultPathMap,
      '/': { page: '/home' },
    }
  },
}
