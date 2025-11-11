import { Contract } from 'ethers'
import { usePerpStore } from '~/stores/perp'

export const PerpABI = [
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 value) returns (bool)",
  "function deposit(address token, uint256 amount, uint256 starkKey, uint256 positionId, bytes exchangeData) payable returns (uint256)",
  "function withdraw(uint256 ownerKey, uint256 assetType)"
]

export const allowance = (tokenAddress: string) => {
  const walletStore = useWalletStore()
  const chain = walletStore.chain
  const chain_id = getChainInfo(chain).chain_id
  const perpStore = usePerpStore()
  const perpConfig = perpStore.metadata?.multiChain?.chainList?.find(item => item.chainId === chain_id)
  const { _provider } = getProvider(chain)
  const ERC20 = new Contract(tokenAddress, PerpABI, _provider)
  return ERC20.allowance(walletStore.address, perpConfig?.contractAddress || '')
}

export const approve = async (tokenAddress: string) => {
  const walletStore = useWalletStore()

  const chain = walletStore.chain
  const chain_id = getChainInfo(chain).chain_id
  const perpStore = usePerpStore()
  const perpConfig = perpStore.metadata?.multiChain?.chainList?.find(item => item.chainId === chain_id)
  const signer = await getSigner()
  const ERC20 = new Contract(tokenAddress, PerpABI, signer)
  return ERC20.approve.estimateGas(perpConfig?.contractAddress || '', MAX_UINT_AMOUNT).then(gas => {
    return ERC20.approve(perpConfig?.contractAddress || '', MAX_UINT_AMOUNT, { gasLimit: (gas * 2n).toString() })
  })
}

export const deposit = async (tokenAddress: string, amount: string) => {
  const walletStore = useWalletStore()
  const chain = walletStore.chain
  const chain_id = getChainInfo(chain).chain_id
  const perpStore = usePerpStore()
  const perpConfig = perpStore.metadata?.multiChain?.chainList?.find(item => item.chainId === chain_id)
  const signer = await getSigner()
  const starkKey = '0x' + perpStore.l2KeyPair?.l2PublicKey
  const positionId = perpStore.userInfo?.id
  const ERC20 = new Contract(perpConfig?.contractAddress || '', PerpABI, signer)
  const exchangeData = '0x'
  return ERC20.deposit.estimateGas(tokenAddress, amount, starkKey, positionId, exchangeData).then(gas => {
    return ERC20.deposit(tokenAddress, amount, starkKey, positionId, exchangeData, { gasLimit: (gas * 2n).toString() })
  })
}

