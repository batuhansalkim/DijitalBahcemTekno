import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateMockCID } from './mockData';

// Pinata API yapılandırması
const PINATA_API_KEY = process.env.EXPO_PUBLIC_PINATA_API_KEY || '';
const PINATA_SECRET_KEY = process.env.EXPO_PUBLIC_PINATA_SECRET_KEY || '';
const PINATA_JWT = process.env.EXPO_PUBLIC_PINATA_JWT || '';

export interface TreeData {
  rfid: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  farmer: {
    name: string;
    id: string;
    contact: string;
  };
  treeInfo: {
    type: string;
    age: number;
    plantDate: string;
    variety?: string;
  };
  health: {
    status: string;
    lastCheck: string;
    score: number;
  };
  harvest: {
    lastHarvest?: string;
    expectedNext?: string;
    averageYield?: string;
  };
  images: string[];
  metadata: {
    timestamp: string;
    deviceId: string;
    signature: string;
  };
}

export interface IPFSUploadResult {
  success: boolean;
  cid?: string;
  error?: string;
  hash?: string;
}

class IPFSService {
  private baseUrl = 'https://api.pinata.cloud';

  // Pinata bağlantısını test et
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/data/testAuthentication`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${PINATA_JWT}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Pinata bağlantı testi başarısız:', error);
      return false;
    }
  }

  // JSON verisini IPFS'e yükle
  async uploadJSON(data: TreeData): Promise<IPFSUploadResult> {
    try {
      // Veriyi doğrula
      this.validateTreeData(data);

      const jsonBlob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });

      const formData = new FormData();
      formData.append('file', jsonBlob, `tree-${data.rfid}-${Date.now()}.json`);
      
      const metadata = JSON.stringify({
        name: `Ağaç Verisi - ${data.name}`,
        description: `RFID: ${data.rfid} - ${data.location.address}`,
        keyvalues: {
          rfid: data.rfid,
          treeType: data.treeInfo.type,
          location: data.location.address,
          farmer: data.farmer.name,
          timestamp: data.metadata.timestamp,
        },
      });
      
      formData.append('pinataMetadata', metadata);

      const options = JSON.stringify({
        cidVersion: 1,
        customPinPolicy: {
          regions: [
            { id: 'FRA1', desiredReplicationCount: 2 },
            { id: 'NYC1', desiredReplicationCount: 2 }
          ]
        }
      });
      
      formData.append('pinataOptions', options);

      const response = await fetch(`${this.baseUrl}/pinning/pinFileToIPFS`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PINATA_JWT}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Pinata yükleme hatası: ${errorData}`);
      }

      const result = await response.json();
      
      // Başarılı yüklemeyi kaydet
      await this.saveUploadRecord(data.rfid, result.IpfsHash);

      return {
        success: true,
        cid: result.IpfsHash,
        hash: result.IpfsHash,
      };

    } catch (error) {
      console.error('IPFS yükleme hatası:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      };
    }
  }

  // IPFS'ten veri çek
  async fetchFromIPFS(cid: string): Promise<TreeData | null> {
    try {
      const response = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`);
      
      if (!response.ok) {
        throw new Error(`IPFS veri çekme hatası: ${response.statusText}`);
      }

      const data = await response.json();
      return data as TreeData;

    } catch (error) {
      console.error('IPFS veri çekme hatası:', error);
      return null;
    }
  }

  // CID'den hash doğrulaması
  async verifyCIDIntegrity(cid: string, originalData?: TreeData): Promise<boolean> {
    try {
      const fetchedData = await this.fetchFromIPFS(cid);
      
      if (!fetchedData) return false;
      
      // Eğer orijinal veri varsa karşılaştır
      if (originalData) {
        const originalHash = await this.generateDataHash(originalData);
        const fetchedHash = await this.generateDataHash(fetchedData);
        return originalHash === fetchedHash;
      }
      
      return true;
    } catch (error) {
      console.error('CID doğrulama hatası:', error);
      return false;
    }
  }

  // Veri hash'i oluştur (SHA-256)
  async generateDataHash(data: TreeData): Promise<string> {
    const jsonString = JSON.stringify(data, Object.keys(data).sort());
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(jsonString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Yükleme geçmişini kaydet
  private async saveUploadRecord(rfid: string, cid: string): Promise<void> {
    try {
      const records = await this.getUploadHistory();
      const newRecord = {
        rfid,
        cid,
        timestamp: new Date().toISOString(),
      };
      
      records.push(newRecord);
      await AsyncStorage.setItem('ipfs_uploads', JSON.stringify(records));
    } catch (error) {
      console.error('Yükleme kaydı hatası:', error);
    }
  }

  // Yükleme geçmişini al
  async getUploadHistory(): Promise<Array<{rfid: string, cid: string, timestamp: string}>> {
    try {
      const stored = await AsyncStorage.getItem('ipfs_uploads');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Geçmiş alma hatası:', error);
      return [];
    }
  }

  // RFID'ye göre CID bul
  async getCIDByRFID(rfid: string): Promise<string | null> {
    try {
      const history = await this.getUploadHistory();
      const record = history.find(r => r.rfid === rfid);
      return record?.cid || null;
    } catch (error) {
      console.error('CID arama hatası:', error);
      return null;
    }
  }

  // Veri doğrulama
  private validateTreeData(data: TreeData): void {
    if (!data.rfid || data.rfid.trim().length === 0) {
      throw new Error('RFID gerekli');
    }
    
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Ağaç adı gerekli');
    }
    
    if (!data.location || !data.location.latitude || !data.location.longitude) {
      throw new Error('Konum bilgisi gerekli');
    }
    
    if (!data.farmer || !data.farmer.name || !data.farmer.id) {
      throw new Error('Çiftçi bilgisi gerekli');
    }
    
    if (!data.metadata || !data.metadata.timestamp || !data.metadata.deviceId) {
      throw new Error('Metadata gerekli');
    }
  }

  // Pin durumunu kontrol et
  async checkPinStatus(cid: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/data/pinList?hashContains=${cid}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${PINATA_JWT}`,
        },
      });

      if (!response.ok) return false;
      
      const data = await response.json();
      return data.rows && data.rows.length > 0;
    } catch (error) {
      console.error('Pin durumu kontrol hatası:', error);
      return false;
    }
  }
}

export const ipfsService = new IPFSService();
