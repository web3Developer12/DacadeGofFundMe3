import { InjectedConnector } from "@web3-react/injected-connector"

const AVALANCHE_TESTNET_PARAMS = {
  chainId: "0xAEF3",
  chainName: "Celo (Alfajores Testnet)",
  nativeCurrency: {
    name: "Celo (Alfajores Testnet)",
    symbol: "CELO",
    decimals: 18,
  },
  rpcUrls: ["https://alfajores-forno.celo-testnet.org"],
  blockExplorerUrls: ["https://alfajores-blockscout.celo-testnet.org"],
}

export async function addAvalancheNetwork() {
  const params = [AVALANCHE_TESTNET_PARAMS]
  await window.ethereum.request({ method: 'wallet_addEthereumChain', params })
  .then(() => true)
  .catch((error) => false)
}