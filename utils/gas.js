const axios = require('axios')

async function getGas() {
    try {
        var options = {
            method: 'get',
            url: 'https://api.curve.fi/api/getGas',
            Headers: {
                "authority": 'api.curve.fi'
            }
        };

        let result = await axios(options)
        let gas = result.data.data.gas.standard / 1e9
        let slowGas = result.data.data.gas.slow / 1e9
        let finalGas = gas
        return String(finalGas)
    } catch (error) {
        // console.log(`getGas error `, error)
        console.log(`return default gas`)
        return '100'
    }
    return "10"
}

async function getSlowGas() {
    try {
        var options = {
            method: 'get',
            url: 'https://api.curve.fi/api/getGas',
            Headers: {
                "authority": 'api.curve.fi'
            }
        };

        let result = await axios(options)
        let gas = result.data.data.gas.standard / 1e9
        let slowGas = result.data.data.gas.slow / 1e9
        let finalGas = slowGas
        return String(finalGas)
    } catch (error) {
        console.log(`return default gas`)
        return '100'
    }
    return "10"
}

module.exports = {
    getGas,
    getSlowGas
}
