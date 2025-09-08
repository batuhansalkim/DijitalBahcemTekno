// Zeynep'in gönderdiği sözleşme adresleri
// Bu dosyayı Zeynep sana gönderecek

export const SEPOLIA_CONTRACTS = {
  REGISTRY: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  ACCESS_CONTROL: "0x123456789abcdef123456789abcdef1234567890", 
  VERIFIER: "0xabcdef123456789abcdef123456789abcdef123456",
  DEPLOYED_BLOCK: 4567890,  // Hangi blokta deploy edildi
  NETWORK: "sepolia",
  DEPLOY_DATE: "2024-01-15T10:30:00Z"
};

// Network bilgileri
export const NETWORK_CONFIG = {
  sepolia: {
    chainId: 11155111,
    name: "Sepolia Test Network",
    rpcUrl: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
    explorerUrl: "https://sepolia.etherscan.io"
  }
};

// Sözleşme linkler (Etherscan'de görüntülemek için)
export const CONTRACT_LINKS = {
  REGISTRY: `${NETWORK_CONFIG.sepolia.explorerUrl}/address/${SEPOLIA_CONTRACTS.REGISTRY}`,
  ACCESS_CONTROL: `${NETWORK_CONFIG.sepolia.explorerUrl}/address/${SEPOLIA_CONTRACTS.ACCESS_CONTROL}`,
  VERIFIER: `${NETWORK_CONFIG.sepolia.explorerUrl}/address/${SEPOLIA_CONTRACTS.VERIFIER}`
};
