// Zeynep'in gönderdiği event şemaları
// Bu dosyayı Zeynep sana gönderecek

// Registry sözleşmesi event'leri
export interface TreeRegisteredEvent {
  rfid: string;
  cid: string;
  owner: string;        // Ethereum adresi
  timestamp: number;    // Unix timestamp
  blockNumber: number;
  transactionHash: string;
  gasUsed?: string;
}

export interface SatelliteDataRegisteredEvent {
  location: string;     // "lat,lng" formatında
  cid: string;
  timestamp: number;
  blockNumber: number;
  transactionHash: string;
}

// AccessControl sözleşmesi event'leri
export interface RoleGrantedEvent {
  role: string;         // Role hash'i
  account: string;      // Ethereum adresi
  sender: string;       // Kim verdi
  blockNumber: number;
  transactionHash: string;
}

export interface RoleRevokedEvent {
  role: string;
  account: string;
  sender: string;
  blockNumber: number;
  transactionHash: string;
}

// Event filtreleme için helper'lar
export const EVENT_FILTERS = {
  // Sadece belirli RFID'nin event'lerini dinle
  TreeRegisteredByRFID: (rfid: string) => ({
    topics: [null, rfid] // indexed parametreler
  }),
  
  // Sadece belirli kullanıcının event'lerini dinle
  TreeRegisteredByOwner: (owner: string) => ({
    topics: [null, null, owner]
  })
};
