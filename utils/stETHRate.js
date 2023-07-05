const axios = require('axios');
const { checkNotZoroNum, fb4, cBN } = require('.');

async function getStETHRate() {
    try {
        let data = JSON.stringify({
            "query": "\nquery PriceHistoryQuery($schemaName: String!, $contractAddress: String!) {\n  priceHistoryWithTimestamp(\n    schemaName: $schemaName\n    contractAddress: $contractAddress\n  ) {\n    nodes {\n      id\n      latestAnswer\n      blockNumber\n      blockTimestamp\n    }\n  }\n}\n",
            "variables": {
                "contractAddress": "0x6e7a3ceb4797d0fd7b9854b251929ad68849951a",
                "schemaName": "ethereum-mainnet-optimism-1"
            }
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://atlas-postgraphile.public.main.prod.cldev.sh/graphql',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': 'AWSALB=nmvMrmHcQl5ToFLBjnpf4rs/RTMRhyonk2AgI5phkE7/0hVTVtBCA2cU096PtiXROOnGCWSITlJjFdsUFp3cJc0aH3Yrxuuz3qN/cB2JMyTozk6xbISVYWYQ3KfT; AWSALBCORS=nmvMrmHcQl5ToFLBjnpf4rs/RTMRhyonk2AgI5phkE7/0hVTVtBCA2cU096PtiXROOnGCWSITlJjFdsUFp3cJc0aH3Yrxuuz3qN/cB2JMyTozk6xbISVYWYQ3KfT'
            },
            data: data
        };

        const result = await axios.request(config)
        let _res = 1
        if (result.status == 200) {
            _res = checkNotZoroNum(result.data.data.priceHistoryWithTimestamp.nodes[0].latestAnswer) ? cBN(result.data.data.priceHistoryWithTimestamp.nodes[0].latestAnswer).div(1e18).toString(10) : 1
        }
        console.log("result----", _res)
        return _res
    } catch (error) {
        // console.log(`getGas error `, error)
        console.log(`return getStETHRate---`, error)
        return '1'
    }
}

module.exports = {
    getStETHRate
}
