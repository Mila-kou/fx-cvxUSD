import config from '@/config/index'

const fxUSD_ROUTER = {
  stETH: {
    fromAddress: config.tokens.stETH,
    routers: {
      [config.tokens.weth]: [
        'WETH',
        config.tokens.weth,
        ['0x277090c5ae6b80a3c525f09d7ae464a8fa83d9c08804'],
      ],
      [config.tokens.usdc]: [
        'USDC',
        config.tokens.usdc,
        [
          '0x277090c5ae6b80a3c525f09d7ae464a8fa83d9c08804',
          '0x49fe1afc5df753cd252e1068dfa0428d3755b20a6c08',
        ],
      ],
      [config.tokens.usdt]: [
        'USDT',
        config.tokens.usdt,
        [
          '0x277090c5ae6b80a3c525f09d7ae464a8fa83d9c08804',
          '0x4bd7d6e5d89150b5caa781bc12012fe06ea8578ad008',
        ],
      ],
      [config.tokens.wstETH]: [
        'wstETH',
        config.tokens.wstETH,
        ['0x1fce71607d656d4f172c66f42cfe369b24d78b2810a'],
        // eslint-disable-next-line no-bitwise
        1048575n + (1n << 20n),
      ],
    },
  },
  wstETH: {
    fromAddress: config.tokens.wstETH,
    routers: {
      [config.tokens.stETH]: [
        'stETH',
        config.tokens.stETH,
        ['0x1fce71607d656d4f172c66f42cfe369b24d78b2820a'],
      ],
      [config.tokens.weth]: [
        'weth',
        config.tokens.weth,
        [
          '0x1fce71607d656d4f172c66f42cfe369b24d78b2820a',
          '0x277090c5ae6b80a3c525f09d7ae464a8fa83d9c08804',
        ],
      ],
      [config.tokens.usdc]: [
        'USDC',
        config.tokens.usdc,
        [
          '0x1fce71607d656d4f172c66f42cfe369b24d78b2820a',
          '0x277090c5ae6b80a3c525f09d7ae464a8fa83d9c08804',
          '0x49fe1afc5df753cd252e1068dfa0428d3755b20a6c08',
        ],
      ],
      [config.tokens.usdt]: [
        'USDT',
        config.tokens.usdt,
        [
          '0x1fce71607d656d4f172c66f42cfe369b24d78b2820a',
          '0x277090c5ae6b80a3c525f09d7ae464a8fa83d9c08804',
          '0x4bd7d6e5d89150b5caa781bc12012fe06ea8578ad008',
        ],
      ],
      [config.tokens.frax]: [
        'Frax',
        config.tokens.frax,
        [
          '0x1fce71607d656d4f172c66f42cfe369b24d78b2820a',
          '0x277090c5ae6b80a3c525f09d7ae464a8fa83d9c08804',
          '0x49fe1afc5df753cd252e1068dfa0428d3755b20a6c08',
          '0x2773be5a3505a90736b03b61c0beb204a29909068804',
        ],
      ],
      [config.tokens.crvUSD]: [
        'crvUSD',
        config.tokens.crvUSD,
        [
          '0x1fce71607d656d4f172c66f42cfe369b24d78b2820a',
          '0x277090c5ae6b80a3c525f09d7ae464a8fa83d9c08804',
          '0x49fe1afc5df753cd252e1068dfa0428d3755b20a6c08',
          '0x10537b399e33b3ac9d11acd719cb71f587cc2eb5a7804',
        ],
      ],
      // wstETH -> WETH, WETH -> sfrxETH, sfrxETH -> frxETH
      [config.tokens.frxETH]: [
        'frxETH',
        config.tokens.frxETH,
        [
          '0x1fce71607d656d4f172c66f42cfe369b24d78b2820a',
          '0x277090c5ae6b80a3c525f09d7ae464a8fa83d9c08804',
          '0x10670ed1b033ad6e78c13f35b623f143df7492cc6f004',
          '0x2b0f806115ec88b64c4511611dbcf8d05aaef8e3d09',
          '0x2b0f806115ec88b64c4511611dbcf8d05aaef8e3e09',
        ],
        // eslint-disable-next-line no-bitwise
        1048575n + (5n << 20n),
      ],
    },
  },
  weETH: {
    fromAddress: config.tokens.weETH,
    routers: {
      [config.tokens.eETH]: [
        'eETH',
        config.tokens.eETH,
        ['0x17357f88f216083dedcb4249bf26c16d0f8d66dfba0b'],
      ],
      [config.tokens.weth]: [
        'weth',
        config.tokens.weth,
        ['0x1044e51cc0fd8ecd8e1da1a341c3c53721970d918ec0c'],
      ],
      [config.tokens.usdc]: [
        'USDC',
        config.tokens.usdc,
        [
          '0x1044e51cc0fd8ecd8e1da1a341c3c53721970d918ec0c',
          '0x49fe1afc5df753cd252e1068dfa0428d3755b20a6c08',
        ],
      ],
      [config.tokens.usdt]: [
        'USDT',
        config.tokens.usdt,
        [
          '0x1044e51cc0fd8ecd8e1da1a341c3c53721970d918ec0c',
          '0x4bd7d6e5d89150b5caa781bc12012fe06ea8578ad008',
        ],
      ],
      [config.tokens.eth]: [
        'ETH',
        config.tokens.eth_0,
        ['0x1044e51cc0fd8ecd8e1da1a341c3c53721970d918ec0c', '0x20e'],
      ],
    },
  },
  apxETH: {
    fromAddress: config.tokens.apxETH,
    routers: {
      [config.tokens.pxETH]: [
        'pxETH',
        config.tokens.pxETH,
        ['0x26e8086c2a6e562d79d73a7db7fe5f1fb94b2cf9a09'],
      ],
      [config.tokens.weth]: [
        'weth',
        config.tokens.weth,
        [
          '0x26e8086c2a6e562d79d73a7db7fe5f1fb94b2cf9a09',
          '0x105a546f711cd2e7dfcf86dd2bfaf19c31cda83b6d80c',
          '0x277090c5ae6b80a3c525f09d7ae464a8fa83d9c08804',
        ],
      ],
      [config.tokens.usdc]: [
        'USDC',
        config.tokens.usdc,
        [
          '0x26e8086c2a6e562d79d73a7db7fe5f1fb94b2cf9a09',
          '0x105a546f711cd2e7dfcf86dd2bfaf19c31cda83b6d80c',
          '0x277090c5ae6b80a3c525f09d7ae464a8fa83d9c08804',
          '0x49fe1afc5df753cd252e1068dfa0428d3755b20a6c08',
        ],
      ],
      [config.tokens.usdt]: [
        'USDT',
        config.tokens.usdt,
        [
          '0x26e8086c2a6e562d79d73a7db7fe5f1fb94b2cf9a09',
          '0x105a546f711cd2e7dfcf86dd2bfaf19c31cda83b6d80c',
          '0x277090c5ae6b80a3c525f09d7ae464a8fa83d9c08804',
          '0x4bd7d6e5d89150b5caa781bc12012fe06ea8578ad008',
        ],
      ],
      [config.tokens.eth]: [
        'ETH',
        config.tokens.eth_0,
        [
          '0x26e8086c2a6e562d79d73a7db7fe5f1fb94b2cf9a09',
          '0x105a546f711cd2e7dfcf86dd2bfaf19c31cda83b6d80c',
          '0x277090c5ae6b80a3c525f09d7ae464a8fa83d9c08804',
          '0x20e',
        ],
      ],
    },
  },
  aCVX: {
    fromAddress: config.tokens.aCVX,
    routers: {
      [config.tokens.cvx]: [
        'cvx',
        config.tokens.cvx,
        ['0x2c240eadc29d19fb95d581d2cc6b222baee3eddde09'],
      ],
      [config.tokens.weth]: [
        'weth',
        config.tokens.weth,
        [
          '0x2c240eadc29d19fb95d581d2cc6b222baee3eddde09',
          '0x26d5d9247c79b9798bc763c9818bba08ad02c3835008',
        ],
      ],
      [config.tokens.usdc]: [
        'USDC',
        config.tokens.usdc,
        [
          '0x2c240eadc29d19fb95d581d2cc6b222baee3eddde09',
          '0x26d5d9247c79b9798bc763c9818bba08ad02c3835008',
          '0x49fe1afc5df753cd252e1068dfa0428d3755b20a6c08',
        ],
      ],
      [config.tokens.usdt]: [
        'USDT',
        config.tokens.usdt,
        [
          '0x2c240eadc29d19fb95d581d2cc6b222baee3eddde09',
          '0x26d5d9247c79b9798bc763c9818bba08ad02c3835008',
          '0x4bd7d6e5d89150b5caa781bc12012fe06ea8578ad008',
        ],
      ],
      [config.tokens.eth]: [
        'ETH',
        config.tokens.eth_0,
        [
          '0x2c240eadc29d19fb95d581d2cc6b222baee3eddde09',
          '0x26d5d9247c79b9798bc763c9818bba08ad02c3835008',
          '0x20e',
        ],
      ],
    },
  },
  sfrxETH: {
    fromAddress: config.tokens.sfrxETH,
    routers: {
      [config.tokens.frxETH]: [
        'frxETH',
        config.tokens.frxETH,
        ['0x2b0f806115ec88b64c4511611dbcf8d05aaef8e3e09'],
      ],
      [config.tokens.weth]: [
        'weth',
        config.tokens.weth,
        [
          '0x2b0f806115ec88b64c4511611dbcf8d05aaef8e3e09',
          '0x2670ed1b033ad6e78c13f35b623f143df7492cc6f004',
        ],
      ],
      [config.tokens.usdc]: [
        'USDC',
        config.tokens.usdc,
        [
          '0x2b0f806115ec88b64c4511611dbcf8d05aaef8e3e09',
          '0x2670ed1b033ad6e78c13f35b623f143df7492cc6f004',
          '0x49fe1afc5df753cd252e1068dfa0428d3755b20a6c08',
        ],
      ],
      [config.tokens.usdt]: [
        'USDT',
        config.tokens.usdt,
        [
          '0x2b0f806115ec88b64c4511611dbcf8d05aaef8e3e09',
          '0x2670ed1b033ad6e78c13f35b623f143df7492cc6f004',
          '0x4bd7d6e5d89150b5caa781bc12012fe06ea8578ad008',
        ],
      ],
      [config.tokens.wstETH]: [
        'wstETH',
        config.tokens.wstETH,
        [
          '0x2b0f806115ec88b64c4511611dbcf8d05aaef8e3e09',
          '0x2670ed1b033ad6e78c13f35b623f143df7492cc6f004',
          '0x2b9eae5948378e863978446d7aaac254c4b5ffa110a',
          '0x1fce71607d656d4f172c66f42cfe369b24d78b2810a',
        ],
      ],
      [config.tokens.stETH]: [
        'stETH',
        config.tokens.stETH,
        [
          '0x2b0f806115ec88b64c4511611dbcf8d05aaef8e3e09',
          '0x2670ed1b033ad6e78c13f35b623f143df7492cc6f004',
          '0x2b9eae5948378e863978446d7aaac254c4b5ffa110a',
        ],
      ],
      [config.tokens.frax]: [
        'Frax',
        config.tokens.frax,
        [
          '0x2b0f806115ec88b64c4511611dbcf8d05aaef8e3e09',
          '0x2670ed1b033ad6e78c13f35b623f143df7492cc6f004',
          '0x49fe1afc5df753cd252e1068dfa0428d3755b20a6c08',
          '0x2773be5a3505a90736b03b61c0beb204a29909068804',
        ],
      ],
      [config.tokens.crvUSD]: [
        'crvUSD',
        config.tokens.crvUSD,
        [
          '0x2b0f806115ec88b64c4511611dbcf8d05aaef8e3e09',
          '0x2670ed1b033ad6e78c13f35b623f143df7492cc6f004',
          '0x49fe1afc5df753cd252e1068dfa0428d3755b20a6c08',
          '0x10537b399e33b3ac9d11acd719cb71f587cc2eb5a7804',
        ],
      ],
    },
  },
  WETH: {
    fromAddress: config.tokens.weth,
    routers: {
      [config.tokens.wstETH]: [
        'wstETH',
        config.tokens.wstETH,
        [
          '0x2b9eae5948378e863978446d7aaac254c4b5ffa110a',
          '0x1fce71607d656d4f172c66f42cfe369b24d78b2810a',
        ],
        // eslint-disable-next-line no-bitwise
        1048575n + (2n << 20n),
      ],
      [config.tokens.sfrxETH]: [
        'sfrxETH',
        config.tokens.sfrxETH,
        [
          '0x10670ed1b033ad6e78c13f35b623f143df7492cc6f004',
          '0x2b0f806115ec88b64c4511611dbcf8d05aaef8e3d09',
        ],
        // eslint-disable-next-line no-bitwise
        1048575n + (2n << 20n),
      ],
      [config.tokens.weETH]: [
        'weETH',
        config.tokens.weETH,
        ['0x244e51cc0fd8ecd8e1da1a341c3c53721970d918ec0c'],
        // eslint-disable-next-line no-bitwise
        1048575n + (1n << 20n),
      ],
      [config.tokens.apxETH]: [
        'apxETH',
        config.tokens.apxETH,
        [
          '0x2b9eae5948378e863978446d7aaac254c4b5ffa110a',
          '0x25a546f711cd2e7dfcf86dd2bfaf19c31cda83b6d80c',
          '0x26e8086c2a6e562d79d73a7db7fe5f1fb94b2cf9909',
        ],
        // eslint-disable-next-line no-bitwise
        1048575n + (3n << 20n),
      ],
      [config.tokens.aCVX]: [
        'aCVX',
        config.tokens.aCVX,
        [
          '0x106d5d9247c79b9798bc763c9818bba08ad02c3835008',
          '0x2c240eadc29d19fb95d581d2cc6b222baee3edddd09',
        ],
        // eslint-disable-next-line no-bitwise
        1048575n + (2n << 20n),
      ],
    },
  },
  USDC: {
    fromAddress: config.tokens.usdc,
    routers: {
      [config.tokens.wstETH]: [
        'wstETH',
        config.tokens.wstETH,
        [
          '0x40007d2239a830b7749bfbad93c0e68b104a5bf2cfd590001',
          '0x2b9eae5948378e863978446d7aaac254c4b5ffa110a',
          '0x1fce71607d656d4f172c66f42cfe369b24d78b2810a',
        ],
        // eslint-disable-next-line no-bitwise
        1048575n + (3n << 20n),
      ],
      [config.tokens.sfrxETH]: [
        'sfrxETH',
        config.tokens.sfrxETH,
        [
          '0x40007d2239a830b7749bfbad93c0e68b104a5bf2cfd590001',
          '0x10670ed1b033ad6e78c13f35b623f143df7492cc6f004',
          '0x2b0f806115ec88b64c4511611dbcf8d05aaef8e3d09',
        ],
        // eslint-disable-next-line no-bitwise
        1048575n + (3n << 20n),
      ],
      [config.tokens.weETH]: [
        'weETH',
        config.tokens.weETH,
        [
          '0x209fe1afc5df753cd252e1068dfa0428d3755b20a6c08',
          '0x244e51cc0fd8ecd8e1da1a341c3c53721970d918ec0c',
        ],
        // eslint-disable-next-line no-bitwise
        1048575n + (2n << 20n),
      ],
      [config.tokens.apxETH]: [
        'apxETH',
        config.tokens.apxETH,
        [
          '0x209fe1afc5df753cd252e1068dfa0428d3755b20a6c08',
          '0x2b9eae5948378e863978446d7aaac254c4b5ffa110a',
          '0x25a546f711cd2e7dfcf86dd2bfaf19c31cda83b6d80c',
          '0x26e8086c2a6e562d79d73a7db7fe5f1fb94b2cf9909',
        ],
        // eslint-disable-next-line no-bitwise
        1048575n + (4n << 20n),
      ],
      [config.tokens.aCVX]: [
        'aCVX',
        config.tokens.aCVX,
        [
          '0x209fe1afc5df753cd252e1068dfa0428d3755b20a6c08',
          '0x106d5d9247c79b9798bc763c9818bba08ad02c3835008',
          '0x2c240eadc29d19fb95d581d2cc6b222baee3edddd09',
        ],
        // eslint-disable-next-line no-bitwise
        1048575n + (3n << 20n),
      ],
    },
  },
  USDT: {
    fromAddress: config.tokens.usdt,
    routers: {
      [config.tokens.wstETH]: [
        'wstETH',
        config.tokens.wstETH,
        [
          '0x20bd7d6e5d89150b5caa781bc12012fe06ea8578ad008',
          '0x2b9eae5948378e863978446d7aaac254c4b5ffa110a',
          '0x1fce71607d656d4f172c66f42cfe369b24d78b2810a',
        ],
        // eslint-disable-next-line no-bitwise
        1048575n + (3n << 20n),
      ],
      [config.tokens.sfrxETH]: [
        'sfrxETH',
        config.tokens.sfrxETH,
        [
          '0x20bd7d6e5d89150b5caa781bc12012fe06ea8578ad008',
          '0x10670ed1b033ad6e78c13f35b623f143df7492cc6f004',
          '0x2b0f806115ec88b64c4511611dbcf8d05aaef8e3d09',
        ],
        // eslint-disable-next-line no-bitwise
        1048575n + (3n << 20n),
      ],
      [config.tokens.weETH]: [
        'weETH',
        config.tokens.weETH,
        [
          '0x20bd7d6e5d89150b5caa781bc12012fe06ea8578ad008',
          '0x244e51cc0fd8ecd8e1da1a341c3c53721970d918ec0c',
        ],
        // eslint-disable-next-line no-bitwise
        1048575n + (2n << 20n),
      ],
      [config.tokens.apxETH]: [
        'apxETH',
        config.tokens.apxETH,
        [
          '0x20bd7d6e5d89150b5caa781bc12012fe06ea8578ad008',
          '0x2b9eae5948378e863978446d7aaac254c4b5ffa110a',
          '0x25a546f711cd2e7dfcf86dd2bfaf19c31cda83b6d80c',
          '0x26e8086c2a6e562d79d73a7db7fe5f1fb94b2cf9909',
        ],
        // eslint-disable-next-line no-bitwise
        1048575n + (4n << 20n),
      ],
      [config.tokens.aCVX]: [
        'aCVX',
        config.tokens.aCVX,
        [
          '0x20bd7d6e5d89150b5caa781bc12012fe06ea8578ad008',
          '0x106d5d9247c79b9798bc763c9818bba08ad02c3835008',
          '0x2c240eadc29d19fb95d581d2cc6b222baee3edddd09',
        ],
        // eslint-disable-next-line no-bitwise
        1048575n + (3n << 20n),
      ],
    },
  },
  Frax: {
    fromAddress: config.tokens.frax,
    routers: {
      [config.tokens.wstETH]: [
        'wstETH',
        config.tokens.wstETH,
        [
          '0x10773be5a3505a90736b03b61c0beb204a29909068804',
          '0x209fe1afc5df753cd252e1068dfa0428d3755b20a6c08',
          '0x2b9eae5948378e863978446d7aaac254c4b5ffa110a',
          '0x1fce71607d656d4f172c66f42cfe369b24d78b2810a',
        ],
        // eslint-disable-next-line no-bitwise
        1048575n + (4n << 20n),
      ],
      [config.tokens.sfrxETH]: [
        'sfrxETH',
        config.tokens.sfrxETH,
        [
          '0x10773be5a3505a90736b03b61c0beb204a29909068804',
          '0x209fe1afc5df753cd252e1068dfa0428d3755b20a6c08',
          '0x10670ed1b033ad6e78c13f35b623f143df7492cc6f004',
          '0x2b0f806115ec88b64c4511611dbcf8d05aaef8e3d09',
        ],
        // eslint-disable-next-line no-bitwise
        1048575n + (4n << 20n),
      ],
    },
  },
  crvUSD: {
    fromAddress: config.tokens.crvUSD,
    routers: {
      [config.tokens.wstETH]: [
        'wstETH',
        config.tokens.wstETH,
        [
          '0x2537b399e33b3ac9d11acd719cb71f587cc2eb5a7804',
          '0x209fe1afc5df753cd252e1068dfa0428d3755b20a6c08',
          '0x2b9eae5948378e863978446d7aaac254c4b5ffa110a',
          '0x1fce71607d656d4f172c66f42cfe369b24d78b2810a',
        ],
        // eslint-disable-next-line no-bitwise
        1048575n + (4n << 20n),
      ],
      [config.tokens.sfrxETH]: [
        'sfrxETH',
        config.tokens.sfrxETH,
        [
          '0x2537b399e33b3ac9d11acd719cb71f587cc2eb5a7804',
          '0x209fe1afc5df753cd252e1068dfa0428d3755b20a6c08',
          '0x10670ed1b033ad6e78c13f35b623f143df7492cc6f004',
          '0x2b0f806115ec88b64c4511611dbcf8d05aaef8e3d09',
        ],
        // eslint-disable-next-line no-bitwise
        1048575n + (4n << 20n),
      ],
    },
  },
  frxETH: {
    fromAddress: config.tokens.frxETH,
    routers: {
      [config.tokens.sfrxETH]: [
        'sfrxETH',
        config.tokens.sfrxETH,
        ['0x2b0f806115ec88b64c4511611dbcf8d05aaef8e3d09'],
        // eslint-disable-next-line no-bitwise
        1048575n + (1n << 20n),
      ],
    },
  },
  eETH: {
    fromAddress: config.tokens.eETH,
    routers: {
      [config.tokens.weETH]: [
        'weETH',
        config.tokens.weETH,
        ['0x17357f88f216083dedcb4249bf26c16d0f8d66dfb90b'],
        // eslint-disable-next-line no-bitwise
        1048575n + (1n << 20n),
      ],
    },
  },
  pxETH: {
    fromAddress: config.tokens.pxETH,
    routers: {
      [config.tokens.apxETH]: [
        'apxETH',
        config.tokens.apxETH,
        ['0x26e8086c2a6e562d79d73a7db7fe5f1fb94b2cf9909'],
        // eslint-disable-next-line no-bitwise
        1048575n + (1n << 20n),
      ],
    },
  },
  CVX: {
    fromAddress: config.tokens.cvx,
    routers: {
      [config.tokens.aCVX]: [
        'aCVX',
        config.tokens.aCVX,
        ['0x2c240eadc29d19fb95d581d2cc6b222baee3edddd09'],
        // eslint-disable-next-line no-bitwise
        1048575n + (1n << 20n),
      ],
    },
  },
}

// export const isFxRouteSupported = (from, to) => {
//   if (fxUSD_ROUTER[from]) {
//     if (Object.values(fxUSD_ROUTER[from].routers)[0] === to) {
//       return true
//     }
//   }
//   return false
// }

export const getFXUSDRouterByAddress = (fromAddress, toAddress) => {
  let _router = []
  Object.keys(fxUSD_ROUTER).map((tokenName) => {
    const _obj = fxUSD_ROUTER[tokenName]
    if (_obj.fromAddress.toLowerCase() == fromAddress.toLowerCase()) {
      Object.keys(_obj.routers).map((router) => {
        if (router.toLowerCase() == toAddress.toLowerCase()) {
          _router = _obj.routers[router]
        }
      })
    }
  })
  return _router
}
export default fxUSD_ROUTER
