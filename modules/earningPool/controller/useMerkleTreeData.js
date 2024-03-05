import FXNJSON from 'config/merkletree/FXN.json'
import wstETHJSON from 'config/merkletree/wstETH.json'
import FXSJSON from 'config/merkletree/FXS.json'

const tokenMap = {
  FXN: FXNJSON,
  wstETH: wstETHJSON,
  FXS: FXSJSON,
}

const useMerkleTreeData = () => {
  const getTreeByAddressAndTokenName = (userAddress, tokenName) => {
    const JSON = tokenMap[tokenName]
    const _newList = {}
    // eslint-disable-next-line guard-for-in
    for (const key in JSON.claims) {
      _newList[key.toLowerCase()] = JSON.claims[key]
    }
    if (JSON.claims && _newList[userAddress.toLowerCase()]) {
      return _newList[userAddress.toLowerCase()]
    }
    return {}
  }

  return {
    getTreeByAddressAndTokenName,
  }
}

export default useMerkleTreeData
