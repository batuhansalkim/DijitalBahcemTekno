// Ahmet'in verilerini mobil uygulamada kullanma
// Bu dosyayı sen oluşturacaksın (Ahmet'in verilerini aldıktan sonra)

import { 
  RFIDDataPacket, 
  BLE_CONFIG, 
  RFID_COMMANDS, 
  RESPONSE_CODES,
  validateRFIDPacket,
  verifyRFIDSignature 
} from './ahmet-hardware/rfid-protocol';

import { 
  SatelliteImageData, 
  SatelliteQueryParams,
  fetchSatelliteData,
  getNdviHealthStatus 
} from './ahmet-hardware/satellite-api';

import { 
  DeviceConfiguration, 
  DeviceStatus, 
  DEVICE_COMMANDS,
  DEFAULT_DEVICE_CONFIG 
} from './ahmet-hardware/device-config';

// Ahmet'in BLE service'i ile entegrasyon
class AhmetBLEService {
  private connectedDevice: string | null = null;

  // Ahmet'in cihazına bağlan
  async connectToRFIDReader(deviceId: string): Promise<boolean> {
    try {
      console.log('Ahmet\'in RFID cihazına bağlanılıyor:', deviceId);
      
      // BLE bağlantısı kur (Ahmet'in protokolü)
      const success = await this.establishBLEConnection(deviceId);
      
      if (success) {
        this.connectedDevice = deviceId;
        
        // Cihaz durumunu kontrol et
        const status = await this.getDeviceStatus();
        console.log('Cihaz durumu:', status);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('BLE bağlantı hatası:', error);
      return false;
    }
  }

  // RFID okuma (Ahmet'in formatında)
  async readRFIDData(): Promise<RFIDDataPacket | null> {
    try {
      // Mock modda otomatik bağlantı
      if (!this.connectedDevice) {
        console.log('Mock mode: Otomatik RFID cihaz bağlantısı simüle ediliyor...');
        this.connectedDevice = 'MOCK_RFID_DEVICE_001';
        await new Promise(resolve => setTimeout(resolve, 800)); // Bağlantı simülasyonu
      }

      console.log('RFID okuma komutu gönderiliyor...');
      
      // Ahmet'in komut formatında RFID oku
      const command = {
        cmd: RFID_COMMANDS.READ_SINGLE,
        params: {
          timeout: 5000,
          power: 20,
          frequency: 868
        }
      };

      // Mock modda direkt veri döndür
      if (this.connectedDevice === 'MOCK_RFID_DEVICE_001') {
        console.log('Mock RFID verisi döndürülüyor...');
        await new Promise(resolve => setTimeout(resolve, 1200)); // Okuma simülasyonu
        
        // Mock RFID paketi oluştur
        const mockRFIDPacket: RFIDDataPacket = {
          rfid: `TR${Date.now().toString().slice(-9)}`, // Benzersiz RFID
          timestamp: new Date().toISOString(),
          deviceId: 'MOCK_RFID_DEVICE_001',
          signature: '0x' + Math.random().toString(16).slice(2, 18),
          nonce: Date.now(),
          checksum: 'mock_checksum_' + Math.random().toString(16).slice(2, 8),
          location: {
            latitude: 38.4237 + (Math.random() - 0.5) * 0.01,
            longitude: 27.1428 + (Math.random() - 0.5) * 0.01,
            accuracy: Math.floor(Math.random() * 5) + 3, // 3-8 metre doğruluk
          },
          deviceStatus: {
            batteryLevel: Math.floor(Math.random() * 30) + 70, // %70-100 arası
            signalStrength: Math.floor(Math.random() * 20) - 40, // -40 ile -60 arası dBm
            temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C arası
          },
          metadata: {
            frequency: 868,
            power: 20,
            readCount: 1
          }
        };
        
        console.log('Mock RFID başarıyla okundu:', mockRFIDPacket);
        return mockRFIDPacket;
      }

      // Gerçek cihaz için komut gönder
      const response = await this.sendCommand(command);
      
      if (response.code === RESPONSE_CODES.SUCCESS) {
        const rfidPacket: RFIDDataPacket = response.data;
        
        // Veriyi doğrula
        if (!validateRFIDPacket(rfidPacket)) {
          throw new Error('RFID veri paketi geçersiz');
        }
        
        // İmzayı doğrula (Ahmet'in public key'i ile)
        const publicKey = "ahmet-device-public-key"; // Ahmet'ten gelecek
        if (!verifyRFIDSignature(rfidPacket, publicKey)) {
          throw new Error('RFID imza doğrulaması başarısız');
        }
        
        console.log('RFID başarıyla okundu:', rfidPacket);
        return rfidPacket;
      } else {
        throw new Error(`RFID okuma hatası: ${response.message}`);
      }

    } catch (error) {
      console.error('RFID okuma hatası:', error);
      return null;
    }
  }

  // Sürekli RFID tarama
  async startContinuousRFIDScan(callback: (data: RFIDDataPacket) => void): Promise<void> {
    try {
      const command = {
        cmd: RFID_COMMANDS.READ_CONTINUOUS,
        params: {
          interval: 2000,  // 2 saniyede bir
          power: 20
        }
      };

      await this.sendCommand(command);
      
      // Event listener kur
      this.setupRFIDEventListener(callback);
      
    } catch (error) {
      console.error('Sürekli tarama başlatma hatası:', error);
      throw error;
    }
  }

  // Cihaz durumunu al
  async getDeviceStatus(): Promise<DeviceStatus> {
    try {
      const command = { cmd: DEVICE_COMMANDS.GET_CONFIG };
      const response = await this.sendCommand(command);
      
      return response.data as DeviceStatus;
    } catch (error) {
      console.error('Cihaz durumu alma hatası:', error);
      throw error;
    }
  }

  // Private helper methods
  private async establishBLEConnection(deviceId: string): Promise<boolean> {
    // Gerçek BLE bağlantı implementasyonu
    // Ahmet'in BLE_CONFIG'ini kullan
    return true; // Mock
  }

  private async sendCommand(command: any): Promise<any> {
    // Ahmet'in komut protokolü
    console.log('Komut gönderiliyor:', command);
    
    // Mock response
    return {
      code: RESPONSE_CODES.SUCCESS,
      message: "OK",
      data: {
        rfid: "TR001234567890",
        timestamp: new Date().toISOString(),
        deviceId: "DEVICE_001",
        signature: "mock_signature_" + Date.now(),
        nonce: Date.now(),
        checksum: "mock_checksum",
        location: {
          latitude: 39.9208,
          longitude: 32.8541,
          accuracy: 5
        },
        deviceStatus: {
          batteryLevel: 85,
          signalStrength: -45,
          temperature: 23.5
        }
      }
    };
  }

  private setupRFIDEventListener(callback: (data: RFIDDataPacket) => void): void {
    // BLE characteristic notification setup
    // Ahmet'in notify UUID'sini kullan
    console.log('RFID event listener kuruldu');
  }
}

// Ahmet'in uydu API'si ile entegrasyon
class AhmetSatelliteService {
  
  // Koordinatlara göre uydu verisi al
  async getSatelliteDataForLocation(
    latitude: number, 
    longitude: number
  ): Promise<SatelliteImageData | null> {
    try {
      console.log('Uydu verisi sorgulanıyor:', { latitude, longitude });
      
      const params: SatelliteQueryParams = {
        latitude,
        longitude,
        radius: 100,        // 100 metre
        resolution: 10,     // 10 metre/piksel
        maxCloudCover: 20,  // %20 bulut
        includeAnalysis: true
      };

      const response = await fetchSatelliteData(params);
      
      if (response.success && response.data) {
        console.log('Uydu verisi alındı:', response.data);
        return response.data;
      } else {
        console.error('Uydu verisi hatası:', response.error);
        return null;
      }

    } catch (error) {
      console.error('Uydu API hatası:', error);
      return null;
    }
  }

  // NDVI analizi ile ağaç sağlığı
  getTreeHealthFromSatellite(satelliteData: SatelliteImageData): {
    healthScore: number;
    status: string;
    recommendations: string[];
  } {
    const ndvi = satelliteData.analysis.ndvi;
    const healthStatus = getNdviHealthStatus(ndvi);
    
    // Sağlık skoru hesapla (0-100)
    const healthScore = Math.round(ndvi * 100);
    
    // Öneriler oluştur
    const recommendations: string[] = [];
    
    if (ndvi < 0.4) {
      recommendations.push("Su ihtiyacı kontrol edilmeli");
      recommendations.push("Gübre desteği gerekebilir");
    } else if (ndvi < 0.6) {
      recommendations.push("Budama yapılabilir");
      recommendations.push("Toprak nemi kontrol edilmeli");
    } else {
      recommendations.push("Ağaç sağlıklı durumda");
      recommendations.push("Mevcut bakım rutini devam ettirilmeli");
    }
    
    // Sıcaklık kontrolü
    if (satelliteData.analysis.temperature > 30) {
      recommendations.push("Yüksek sıcaklık - sulama artırılabilir");
    }
    
    // Nem kontrolü
    if (satelliteData.analysis.moisture < 0.3) {
      recommendations.push("Toprak nemi düşük - sulama gerekli");
    }

    return {
      healthScore,
      status: healthStatus.description,
      recommendations
    };
  }
}

// Birleştirilmiş servis (RFID + Uydu)
class AhmetIntegratedService {
  private bleService = new AhmetBLEService();
  private satelliteService = new AhmetSatelliteService();

  // Tam ağaç verisi toplama (RFID + Uydu)
  async collectCompleteTreeData(deviceId: string): Promise<{
    rfidData: RFIDDataPacket;
    satelliteData: SatelliteImageData;
    analysis: any;
  } | null> {
    try {
      // 1. RFID cihazına bağlan
      const connected = await this.bleService.connectToRFIDReader(deviceId);
      if (!connected) {
        throw new Error('RFID cihazına bağlanılamadı');
      }

      // 2. RFID verisi oku
      const rfidData = await this.bleService.readRFIDData();
      if (!rfidData) {
        throw new Error('RFID verisi okunamadı');
      }

      // 3. Uydu verisi al (RFID'den gelen konum ile)
      let satelliteData: SatelliteImageData | null = null;
      
      if (rfidData.location) {
        satelliteData = await this.satelliteService.getSatelliteDataForLocation(
          rfidData.location.latitude,
          rfidData.location.longitude
        );
      }

      // 4. Analiz yap
      let analysis = null;
      if (satelliteData) {
        analysis = this.satelliteService.getTreeHealthFromSatellite(satelliteData);
      }

      return {
        rfidData,
        satelliteData: satelliteData!,
        analysis
      };

    } catch (error) {
      console.error('Tam veri toplama hatası:', error);
      return null;
    }
  }

  // Cihaz durumunu izle
  async monitorDeviceHealth(deviceId: string): Promise<void> {
    try {
      const status = await this.bleService.getDeviceStatus();
      
      // Batarya uyarısı
      if (status.power.batteryLevel < 20) {
        console.warn('Düşük batarya:', status.power.batteryLevel);
        // UI'da uyarı göster
      }
      
      // Sinyal gücü kontrolü
      if (status.network.wifi.signalStrength < -70) {
        console.warn('Zayıf Wi-Fi sinyali:', status.network.wifi.signalStrength);
      }
      
      // RFID durumu
      if (!status.rfid.operational) {
        console.error('RFID okuyucu çalışmıyor');
        // Hata bildirimi gönder
      }

    } catch (error) {
      console.error('Cihaz izleme hatası:', error);
    }
  }
}

// Export edilen servisler
export const ahmetBLEService = new AhmetBLEService();
export const ahmetSatelliteService = new AhmetSatelliteService();
export const ahmetIntegratedService = new AhmetIntegratedService();

// Mobil uygulamada kullanım örneği
export async function useAhmetServices() {
  try {
    // Tam veri toplama
    const completeData = await ahmetIntegratedService.collectCompleteTreeData('device-001');
    
    if (completeData) {
      console.log('RFID:', completeData.rfidData.rfid);
      console.log('Konum:', completeData.rfidData.location);
      console.log('NDVI:', completeData.satelliteData.analysis.ndvi);
      console.log('Sağlık:', completeData.analysis.healthScore);
      console.log('Öneriler:', completeData.analysis.recommendations);
      
      return completeData;
    }
    
    return null;
  } catch (error) {
    console.error('Ahmet servisleri hatası:', error);
    return null;
  }
}
