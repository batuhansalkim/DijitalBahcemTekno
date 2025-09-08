// Mock data - Gerçek veriler gelene kadar kullanılacak
// Zeynep'in ABI'ları ve sözleşme adresleri

export const MOCK_REGISTRY_ABI = [
  "function registerTree(string memory rfid, string memory cid, bytes memory deviceSig) external",
  "function getByRfid(string memory rfid) external view returns (string memory)",
  "function registerSatelliteData(string memory location, string memory cid) external",
  "event TreeRegistered(string indexed rfid, string cid, address indexed owner, uint256 timestamp)",
  "event SatelliteDataRegistered(string location, string cid, uint256 timestamp)"
];

export const MOCK_CONTRACT_ADDRESSES = {
  REGISTRY: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6", // Mock adres
  VERIFIER: "0x123456789abcdef123456789abcdef1234567890",   // Mock adres
  ACCESS_CONTROL: "0xabcdef123456789abcdef123456789abcdef123456" // Mock adres
};

// Zeynep'in event şemaları (Mock)
export interface MockTreeRegisteredEvent {
  rfid: string;
  cid: string;
  owner: string;
  timestamp: number;
  blockNumber: number;
  transactionHash: string;
}

// Mock blockchain işlemleri
export const MOCK_BLOCKCHAIN_TRANSACTIONS = [
  {
    hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    status: "confirmed" as const,
    gasUsed: "21000",
    gasPrice: "20000000000",
    blockNumber: 12345678,
    timestamp: Date.now() - 3600000, // 1 saat önce
  },
  {
    hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    status: "pending" as const,
    gasUsed: undefined,
    gasPrice: "22000000000",
    blockNumber: undefined,
    timestamp: Date.now() - 300000, // 5 dakika önce
  }
];

// Ahmet'ten gelecek RFID veri formatı (Mock)
export interface MockRFIDData {
  rfid: string;
  timestamp: string;
  deviceId: string;
  signature: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  batteryLevel?: number;
  signalStrength?: number;
  temperature?: number;
}

// Mock RFID verileri
export const MOCK_RFID_DATA: MockRFIDData[] = [
  {
    rfid: "TR001234567890",
    timestamp: new Date().toISOString(),
    deviceId: "DEVICE_001",
    signature: "mock_signature_12345",
    location: {
      latitude: 39.9208,
      longitude: 32.8541
    },
    batteryLevel: 85,
    signalStrength: 92,
    temperature: 23.5
  },
  {
    rfid: "TR987654321098",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    deviceId: "DEVICE_002", 
    signature: "mock_signature_67890",
    location: {
      latitude: 36.8969,
      longitude: 30.7133
    },
    batteryLevel: 72,
    signalStrength: 88,
    temperature: 25.2
  },
  {
    rfid: "TR555666777888",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    deviceId: "DEVICE_003",
    signature: "mock_signature_abcdef",
    location: {
      latitude: 41.0082,
      longitude: 28.9784
    },
    batteryLevel: 94,
    signalStrength: 95,
    temperature: 22.1
  }
];

// Ahmet'in BLE protokol detayları (Mock)
export const MOCK_BLE_CONFIG = {
  serviceUUID: "12345678-1234-1234-1234-123456789abc",
  characteristicUUID: "87654321-4321-4321-4321-cba987654321",
  dataFormat: "JSON",
  encryption: "AES256",
  timeout: 30000
};

// Ahmet'in uydu verisi formatı (Mock)
export interface MockSatelliteData {
  coordinates: [number, number]; // [lat, lng]
  timestamp: string;
  resolution: number;     // metre
  cloudCover: number;     // %0-100
  imageUrl?: string;      // Sentinel-2 görüntü linki
  ndviValue?: number;     // Bitki sağlığı indeksi
}

export const MOCK_SATELLITE_DATA: MockSatelliteData[] = [
  {
    coordinates: [39.9208, 32.8541],
    timestamp: new Date().toISOString(),
    resolution: 10, // 10 metre
    cloudCover: 15,
    imageUrl: "https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f",
    ndviValue: 0.75
  },
  {
    coordinates: [36.8969, 30.7133],
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    resolution: 10,
    cloudCover: 5,
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b",
    ndviValue: 0.82
  }
];

// Elif'ten gelecek AI analiz sonucu (Mock)
export interface MockAIAnalysisResult {
  rfid: string;
  analysisId: string;
  timestamp: string;
  health: {
    score: number;        // 0-100
    status: "healthy" | "warning" | "critical";
    issues: string[];     // ["leaf_disease", "water_stress"]
  };
  growth: {
    stage: string;        // "flowering", "fruiting"
    progress: number;     // %0-100
    expectedHarvest: string; // ISO date
  };
  recommendations: {
    watering: string;
    fertilizer: string;
    pruning: string;
  };
  confidence: number;     // %0-100
  imageAnalysis?: {
    leafHealth: number;
    fruitCount: number;
    diseaseDetected: boolean;
  };
}

export const MOCK_AI_ANALYSIS: MockAIAnalysisResult[] = [
  {
    rfid: "TR001234567890",
    analysisId: "AI_001_" + Date.now(),
    timestamp: new Date().toISOString(),
    health: {
      score: 92,
      status: "healthy",
      issues: []
    },
    growth: {
      stage: "fruiting",
      progress: 75,
      expectedHarvest: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    recommendations: {
      watering: "Haftada 2-3 kez sulama yapın",
      fertilizer: "Azot bazlı gübre uygulayın",
      pruning: "Kuru dalları temizleyin"
    },
    confidence: 94,
    imageAnalysis: {
      leafHealth: 95,
      fruitCount: 45,
      diseaseDetected: false
    }
  },
  {
    rfid: "TR987654321098",
    analysisId: "AI_002_" + Date.now(),
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    health: {
      score: 78,
      status: "warning",
      issues: ["water_stress", "minor_leaf_spots"]
    },
    growth: {
      stage: "flowering",
      progress: 60,
      expectedHarvest: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
    },
    recommendations: {
      watering: "Sulama miktarını artırın",
      fertilizer: "Potasyum desteği verin",
      pruning: "Hastalıklı yaprakları temizleyin"
    },
    confidence: 87,
    imageAnalysis: {
      leafHealth: 82,
      fruitCount: 28,
      diseaseDetected: true
    }
  }
];

// Elif'in History API response formatı (Mock)
export interface MockHistoryResponse {
  rfid: string;
  records: Array<{
    timestamp: string;
    cid: string;
    blockchainTx: string;
    analysisResult: MockAIAnalysisResult;
    verified: boolean;
  }>;
  totalRecords: number;
  pagination: {
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export const MOCK_HISTORY_DATA: { [rfid: string]: MockHistoryResponse } = {
  "TR001234567890": {
    rfid: "TR001234567890",
    records: [
      {
        timestamp: new Date().toISOString(),
        cid: "QmX1234567890abcdef",
        blockchainTx: "0x1234567890abcdef",
        analysisResult: MOCK_AI_ANALYSIS[0],
        verified: true
      },
      {
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        cid: "QmY987654321fedcba",
        blockchainTx: "0xabcdef1234567890",
        analysisResult: {
          ...MOCK_AI_ANALYSIS[0],
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          health: { ...MOCK_AI_ANALYSIS[0].health, score: 88 }
        },
        verified: true
      }
    ],
    totalRecords: 2,
    pagination: {
      page: 1,
      limit: 10,
      hasMore: false
    }
  }
};

// Elif'in IPFS doğrulama API response formatı (Mock)
export interface MockIPFSVerificationResponse {
  isValid: boolean;
  cid: string;
  actualHash: string;
  expectedHash?: string;
  lastVerified: string;
  pinStatus: "pinned" | "unpinned" | "failed";
  errors?: string[];
}

export const MOCK_IPFS_VERIFICATION: MockIPFSVerificationResponse = {
  isValid: true,
  cid: "QmX1234567890abcdef",
  actualHash: "sha256:abcdef1234567890",
  expectedHash: "sha256:abcdef1234567890",
  lastVerified: new Date().toISOString(),
  pinStatus: "pinned",
  errors: []
};

// Mock BLE cihazları
export const MOCK_BLE_DEVICES = [
  {
    id: "mock-rfid-001",
    name: "DijitalBahce RFID Reader",
    rssi: -45,
    isConnected: false,
  },
  {
    id: "mock-rfid-002", 
    name: "TreeReader Pro",
    rssi: -67,
    isConnected: false,
  },
  {
    id: "mock-rfid-003",
    name: "AgriSensor V2",
    rssi: -52,
    isConnected: false,
  }
];

// Random mock data üretici fonksiyonlar
export function generateMockRFID(): string {
  const prefix = "TR";
  const number = Math.floor(Math.random() * 999999999999).toString().padStart(12, '0');
  return prefix + number;
}

export function generateMockCID(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'Qm';
  for (let i = 0; i < 44; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateMockTxHash(): string {
  const chars = '0123456789abcdef';
  let result = '0x';
  for (let i = 0; i < 64; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

