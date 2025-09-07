import AsyncStorage from '@react-native-async-storage/async-storage';

// Pinata API Configuration
const PINATA_CONFIG = {
  apiKey: 'f579d90d04ec42f61c39',
  secretKey: 'e99beb993328608de7439f77c65ff7c8ddc7e339771b81bdf7a999a70fff6578',
  jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI5NzYwOTRiNi1iMTIwLTRlMDgtYTdlNS1hMzMzOWE2NmE2MzEiLCJlbWFpbCI6ImFobWV0LmNhbGlza2FuMzI4MUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiZjU3OWQ5MGQwNGVjNDJmNjFjMzkiLCJzY29wZWRLZXlTZWNyZXQiOiJlOTliZWI5OTMzMjg2MDhkZTc0MzlmNzdjNjVmZjdjOGRkYzdlMzM5NzcxYjgxYmRmN2E5OTlhNzBmZmY2NTc4IiwiZXhwIjoxNzg4Nzc0MTIzfQ.A9bPsV7hXTBl6AG5EXJ33o-aSzJT3HLYrmkpIDrpGlc',
  gatewayUrl: 'https://gateway.pinata.cloud/ipfs/'
};

// Tree Data Package Interface
export interface TreeDataPackage {
  // Temel Ağaç Bilgileri
  tree_info: {
    rfid_uid: string;           // "04:5A:2B:8C:9D:1E:2F"
    tree_id: string;            // "TR-04:5A:2B:8C:9D:1E:2F"
    name: string;               // "Zeytin Ağacı #123"
    type: string;              // "zeytin" | "elma" | "armut"
    age_years: number;          // 15
    health_percent: number;     // 95
    status: string;             // "healthy" | "maintenance" | "disease"
  };
  
  // Konum Bilgisi
  location: {
    lat: number;               // 37.123456
    lon: number;               // 33.654321
    accuracy_m: number;        // 2.4
    altitude_m?: number;       // 487.3
    address?: string;          // "Ayvalık, Balıkesir"
  };
  
  // Zaman Damgası
  timestamp: {
    collected_at_utc: string;  // "2025-01-07T10:30:00Z"
    created_at_utc: string;     // "2025-01-07T10:30:00Z"
    updated_at_utc: string;     // "2025-01-07T10:30:00Z"
  };
  
  // Çiftçi Bilgileri
  farmer_info: {
    farmer_id: string;          // "farmer_123"
    name: string;               // "Ahmet Çiftçi"
    contact_phone?: string;    // "+905551234567"
    experience_years: number;   // 15
  };
  
  // Bahçe Bilgileri
  garden_info: {
    garden_id: string;          // "garden_456"
    garden_name: string;        // "Zeytinlik Bahçesi"
    area_hectares: number;     // 2.5
    location: string;          // "Ayvalık, Balıkesir"
  };
  
  // Hasat Bilgileri
  harvest_info?: {
    last_harvest_date?: string; // "2024-11-15"
    last_harvest_amount_kg?: number; // 120
    expected_harvest_date?: string; // "2025-11-01"
    expected_harvest_amount_kg?: number; // 150
  };
  
  // Bakım Bilgileri
  maintenance_info?: {
    last_maintenance_date?: string; // "2024-10-01"
    next_maintenance_date?: string; // "2025-04-01"
    maintenance_type?: string; // "pruning" | "fertilizing"
    notes?: string;             // "Gübreleme yapıldı"
  };
  
  // Cihaz Bilgileri
  device_info: {
    platform: string;          // "android" | "ios"
    os_version: string;        // "14.0"
    device_model: string;      // "Samsung Galaxy S21"
    app_version: string;       // "1.0.0"
    nfc_technology: string;    // "Ndef" | "NfcA"
    gps_accuracy_m: number;   // 2.4
  };
  
  // Güvenlik (Hafta 3)
  security?: {
    digital_signature?: string; // "0x1234abcd..."
    signer_address?: string;    // "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
    signed_at?: string;         // "2025-01-07T10:30:00Z"
  };
  
  // Uydu Verisi (Hafta 3)
  satellite_data?: {
    ndvi_index?: number;       // 0.75
    rgb_values?: number[];     // [120, 150, 80]
    cloud_coverage?: number;   // 10
    image_date?: string;       // "2025-01-07"
    source?: string;           // "sentinel-2" | "google-earth-engine"
  };
}

// Pinata Service Class
class PinataService {
  private offlineQueue: TreeDataPackage[] = [];

  // JSON'u IPFS'e yükleme
  async uploadTreeData(treeData: TreeDataPackage): Promise<string> {
    try {
      console.log('🌳 Pinata\'ya ağaç verisi yükleniyor...');
      
      const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': PINATA_CONFIG.apiKey,
          'pinata_secret_api_key': PINATA_CONFIG.secretKey,
        },
        body: JSON.stringify({
          pinataContent: treeData,
          pinataMetadata: {
            name: `tree-${treeData.tree_info.tree_id}-${Date.now()}`,
            keyvalues: {
              rfid_uid: treeData.tree_info.rfid_uid,
              tree_id: treeData.tree_info.tree_id,
              farmer_id: treeData.farmer_info.farmer_id,
              garden_id: treeData.garden_info.garden_id,
              timestamp: treeData.timestamp.collected_at_utc
            }
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Pinata upload failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Pinata upload başarılı! CID:', result.IpfsHash);
      return result.IpfsHash; // CID döner
      
    } catch (error) {
      console.error('❌ Pinata upload error:', error);
      // Offline mod için kuyruğa ekle
      await this.addToOfflineQueue(treeData);
      throw error;
    }
  }

  // Offline kuyruğa ekleme
  private async addToOfflineQueue(treeData: TreeDataPackage): Promise<void> {
    try {
      this.offlineQueue.push(treeData);
      await AsyncStorage.setItem('pinata_offline_queue', JSON.stringify(this.offlineQueue));
      console.log('📶 Tree data added to offline queue');
    } catch (error) {
      console.error('❌ Failed to add to offline queue:', error);
    }
  }

  // Offline kuyruğu işleme
  async processOfflineQueue(): Promise<void> {
    try {
      const queueData = await AsyncStorage.getItem('pinata_offline_queue');
      if (queueData) {
        this.offlineQueue = JSON.parse(queueData);
        console.log(`📶 Processing ${this.offlineQueue.length} offline items...`);
        
        for (const treeData of this.offlineQueue) {
          try {
            const cid = await this.uploadTreeData(treeData);
            console.log(`✅ Offline queue item uploaded: ${cid}`);
          } catch (error) {
            console.error('❌ Failed to upload offline item:', error);
            break; // Hata durumunda dur
          }
        }
        
        // Başarılı yüklemeleri temizle
        await AsyncStorage.removeItem('pinata_offline_queue');
        this.offlineQueue = [];
        console.log('✅ Offline queue processed successfully');
      }
    } catch (error) {
      console.error('❌ Failed to process offline queue:', error);
    }
  }

  // IPFS'ten veri çekme
  async getTreeData(cid: string): Promise<TreeDataPackage> {
    try {
      console.log(`🔍 IPFS'ten veri çekiliyor: ${cid}`);
      const response = await fetch(`${PINATA_CONFIG.gatewayUrl}${cid}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ IPFS veri çekme başarılı');
      return data;
    } catch (error) {
      console.error('❌ Failed to get tree data:', error);
      throw error;
    }
  }

  // Pinata metadata ile arama
  async searchByMetadata(keyvalues: Record<string, string>): Promise<string[]> {
    try {
      console.log('🔍 Pinata metadata arama yapılıyor...');
      const response = await fetch('https://api.pinata.cloud/data/pinList', {
        method: 'GET',
        headers: {
          'pinata_api_key': PINATA_CONFIG.apiKey,
          'pinata_secret_api_key': PINATA_CONFIG.secretKey,
        }
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const result = await response.json();
      const filteredPins = result.rows
        .filter((pin: any) => {
          const metadata = pin.metadata?.keyvalues || {};
          return Object.keys(keyvalues).every(key => 
            metadata[key] === keyvalues[key]
          );
        })
        .map((pin: any) => pin.ipfs_pin_hash);
        
      console.log(`✅ Metadata arama tamamlandı: ${filteredPins.length} sonuç`);
      return filteredPins;
        
    } catch (error) {
      console.error('❌ Search error:', error);
      throw error;
    }
  }

  // Test fonksiyonu - Pinata bağlantısını test et
  async testConnection(): Promise<boolean> {
    try {
      console.log('🧪 Pinata bağlantı testi yapılıyor...');
      const response = await fetch('https://api.pinata.cloud/data/testAuthentication', {
        method: 'GET',
        headers: {
          'pinata_api_key': PINATA_CONFIG.apiKey,
          'pinata_secret_api_key': PINATA_CONFIG.secretKey,
        }
      });

      if (response.ok) {
        console.log('✅ Pinata bağlantı testi başarılı!');
        return true;
      } else {
        console.log('❌ Pinata bağlantı testi başarısız');
        return false;
      }
    } catch (error) {
      console.error('❌ Pinata bağlantı testi hatası:', error);
      return false;
    }
  }
}

// Singleton instance export
export default new PinataService();
