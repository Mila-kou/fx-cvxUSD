import treeJSON from 'config/merkletree/earnPools.json'

const useMerkleTreeData = () => {
  const getTreeByAddress = (userAddress) => {
    const _newList = {}
    // eslint-disable-next-line guard-for-in
    for (const key in treeJSON.claims) {
      _newList[key.toLowerCase()] = treeJSON.claims[key]
    }
    if (treeJSON.claims && _newList[userAddress.toLowerCase()]) {
      return _newList[userAddress.toLowerCase()]
    }
    return {}
  }

  return {
    getTreeByAddress,
  }
}

export default useMerkleTreeData
