import { NativeModules, NativeEventEmitter, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  MOCK_RFID_DATA, 
  MOCK_BLE_DEVICES, 
  MOCK_BLE_CONFIG, 
  generateMockRFID,
  type MockRFIDData 
} from './mockData';

// BLE Manager import (React Native için)
let BleManager: any = null;
let bleManagerEmitter: any = null;

try {
  BleManager = require('react-native-ble-manager').default;
  bleManagerEmitter = new NativeEventEmitter(NativeModules.BleManager);
} catch (error) {
  console.warn('BLE Manager bulunamadı, mock mode aktif');
}

export interface RFIDData {
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
}

export interface BLEDevice {
  id: string;
  name: string;
  rssi: number;
  isConnected: boolean;
}

export interface BLEConnectionState {
  isScanning: boolean;
  isConnected: boolean;
  connectedDevice: BLEDevice | null;
  discoveredDevices: BLEDevice[];
}

class BLEService {
  private isInitialized = false;
  private scanTimeout: NodeJS.Timeout | null = null;
  private connectionState: BLEConnectionState = {
    isScanning: false,
    isConnected: false,
    connectedDevice: null,
    discoveredDevices: [],
  };

  // BLE servisini başlat
  async initialize(): Promise<void> {
    try {
      if (this.isInitialized) return;

      if (!BleManager) {
        console.warn('BLE Manager mevcut değil - mock mode');
        this.isInitialized = true;
        return;
      }

      await BleManager.start({ showAlert: false });
      
      // Event listener'ları ekle
      this.setupEventListeners();
      
      this.isInitialized = true;
      console.log('BLE Service başlatıldı');

    } catch (error) {
      console.error('BLE başlatma hatası:', error);
      throw error;
    }
  }

  // Event listener'ları kur
  private setupEventListeners(): void {
    if (!bleManagerEmitter) return;

    bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', (device: any) => {
      const bleDevice: BLEDevice = {
        id: device.id,
        name: device.name || 'Bilinmeyen Cihaz',
        rssi: device.rssi,
        isConnected: false,
      };

      // Sadece RFID cihazlarını filtrele (isim kontrolü)
      if (device.name && (
        device.name.includes('RFID') || 
        device.name.includes('DijitalBahce') ||
        device.name.includes('TreeReader')
      )) {
        this.connectionState.discoveredDevices.push(bleDevice);
        console.log('RFID cihazı bulundu:', bleDevice);
      }
    });

    bleManagerEmitter.addListener('BleManagerStopScan', () => {
      this.connectionState.isScanning = false;
      console.log('BLE tarama durduruldu');
    });

    bleManagerEmitter.addListener('BleManagerConnectPeripheral', (device: any) => {
      console.log('Cihaza bağlandı:', device);
      this.connectionState.isConnected = true;
      this.connectionState.connectedDevice = {
        id: device.peripheral,
        name: device.name || 'Bağlı Cihaz',
        rssi: 0,
        isConnected: true,
      };
    });

    bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', (device: any) => {
      console.log('Cihaz bağlantısı kesildi:', device);
      this.connectionState.isConnected = false;
      this.connectionState.connectedDevice = null;
    });
  }

  // RFID cihazlarını tara
  async scanForDevices(timeoutSeconds: number = 10): Promise<BLEDevice[]> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      if (!BleManager) {
        // Mock cihazlar döndür
        return this.getMockDevices();
      }

      this.connectionState.isScanning = true;
      this.connectionState.discoveredDevices = [];

      await BleManager.scan([], timeoutSeconds, true);
      
      // Timeout sonrası taramayı durdur
      this.scanTimeout = setTimeout(() => {
        this.stopScan();
      }, timeoutSeconds * 1000);

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(this.connectionState.discoveredDevices);
        }, timeoutSeconds * 1000 + 500);
      });

    } catch (error) {
      console.error('BLE tarama hatası:', error);
      this.connectionState.isScanning = false;
      return [];
    }
  }

  // Taramayı durdur
  async stopScan(): Promise<void> {
    try {
      if (this.scanTimeout) {
        clearTimeout(this.scanTimeout);
        this.scanTimeout = null;
      }

      if (BleManager) {
        await BleManager.stopScan();
      }

      this.connectionState.isScanning = false;
    } catch (error) {
      console.error('BLE tarama durdurma hatası:', error);
    }
  }

  // Cihaza bağlan
  async connectToDevice(deviceId: string): Promise<boolean> {
    try {
      if (!BleManager) {
        // Mock bağlantı
        this.connectionState.isConnected = true;
        this.connectionState.connectedDevice = {
          id: deviceId,
          name: 'Mock RFID Reader',
          rssi: -50,
          isConnected: true,
        };
        return true;
      }

      await BleManager.connect(deviceId);
      
      // Servisleri keşfet
      await BleManager.retrieveServices(deviceId);
      
      return true;

    } catch (error) {
      console.error('BLE bağlantı hatası:', error);
      return false;
    }
  }

  // Cihaz bağlantısını kes
  async disconnectDevice(deviceId: string): Promise<void> {
    try {
      if (BleManager) {
        await BleManager.disconnect(deviceId);
      }
      
      this.connectionState.isConnected = false;
      this.connectionState.connectedDevice = null;
    } catch (error) {
      console.error('BLE bağlantı kesme hatası:', error);
    }
  }

  // RFID verisini oku
  async readRFIDData(deviceId?: string): Promise<RFIDData | null> {
    try {
      if (!BleManager) {
        // Mock modda - otomatik olarak bağlı varsay
        console.log('Mock BLE mode: RFID verisi simüle ediliyor...');
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simülasyon gecikmesi
        return this.getMockRFIDData();
      }

      if (!this.connectionState.isConnected) {
        throw new Error('Cihaz bağlı değil');
      }

      // Gerçek RFID okuma implementasyonu
      // Bu kısım Ahmet'in donanım spesifikasyonlarına göre yapılacak
      const serviceUUID = 'your-rfid-service-uuid';
      const characteristicUUID = 'your-rfid-characteristic-uuid';

      const data = await BleManager.read(
        deviceId,
        serviceUUID,
        characteristicUUID
      );

      // Byte array'i string'e çevir ve parse et
      const jsonString = String.fromCharCode.apply(null, data);
      const rfidData = JSON.parse(jsonString) as RFIDData;

      // Veriyi doğrula
      this.validateRFIDData(rfidData);

      // Okunan veriyi kaydet
      await this.saveReadingHistory(rfidData);

      return rfidData;

    } catch (error) {
      console.error('RFID okuma hatası:', error);
      return null;
    }
  }

  // Bağlantı durumunu al
  getConnectionState(): BLEConnectionState {
    return { ...this.connectionState };
  }

  // RFID veri doğrulama
  private validateRFIDData(data: RFIDData): void {
    if (!data.rfid || data.rfid.length === 0) {
      throw new Error('Geçersiz RFID');
    }

    if (!data.timestamp) {
      throw new Error('Timestamp gerekli');
    }

    if (!data.deviceId) {
      throw new Error('Device ID gerekli');
    }

    if (!data.signature) {
      throw new Error('Dijital imza gerekli');
    }

    // Timestamp'i kontrol et (çok eski olmamalı)
    const now = Date.now();
    const dataTime = new Date(data.timestamp).getTime();
    const timeDiff = Math.abs(now - dataTime);
    
    if (timeDiff > 5 * 60 * 1000) { // 5 dakikadan eski
      throw new Error('Veri çok eski');
    }
  }

  // Okuma geçmişini kaydet
  private async saveReadingHistory(data: RFIDData): Promise<void> {
    try {
      const history = await this.getReadingHistory();
      history.push({
        ...data,
        readTimestamp: new Date().toISOString(),
      });

      // Son 100 okumayı sakla
      if (history.length > 100) {
        history.splice(0, history.length - 100);
      }

      await AsyncStorage.setItem('rfid_readings', JSON.stringify(history));
    } catch (error) {
      console.error('Okuma geçmişi kayıt hatası:', error);
    }
  }

  // Okuma geçmişini al
  async getReadingHistory(): Promise<(RFIDData & { readTimestamp: string })[]> {
    try {
      const stored = await AsyncStorage.getItem('rfid_readings');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Okuma geçmişi alma hatası:', error);
      return [];
    }
  }

  // Mock cihazlar (test için)
  private getMockDevices(): BLEDevice[] {
    return MOCK_BLE_DEVICES;
  }

  // Mock RFID verisi (test için)
  private getMockRFIDData(): RFIDData {
    // MOCK_RFID_DATA'dan random bir tane seç
    const randomData = MOCK_RFID_DATA[Math.floor(Math.random() * MOCK_RFID_DATA.length)];
    
    // Timestamp'i güncel yap
    return {
      ...randomData,
      timestamp: new Date().toISOString(),
      signature: 'mock_signature_' + Date.now(),
    };
  }

  // Temizleme
  cleanup(): void {
    try {
      if (this.scanTimeout) {
        clearTimeout(this.scanTimeout);
      }

      if (bleManagerEmitter) {
        bleManagerEmitter.removeAllListeners();
      }

      this.connectionState = {
        isScanning: false,
        isConnected: false,
        connectedDevice: null,
        discoveredDevices: [],
      };

      console.log('BLE Service temizlendi');
    } catch (error) {
      console.error('BLE cleanup hatası:', error);
    }
  }
}

export const bleService = new BLEService();
