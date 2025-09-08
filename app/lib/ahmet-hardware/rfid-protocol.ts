// Ahmet'in RFID donanımı veri protokolü
// Bu dosyayı Ahmet sana gönderecek

// RFID veri paketi formatı (Ahmet'in tanımlayacağı)
export interface RFIDDataPacket {
  // Temel RFID bilgileri
  rfid: string;           // "TR001234567890" formatında
  timestamp: string;      // ISO 8601 formatı
  deviceId: string;       // Cihaz benzersiz kimliği
  
  // Güvenlik
  signature: string;      // ECDSA dijital imza
  nonce: number;         // Tekrar saldırı önleme
  checksum: string;      // Veri bütünlüğü kontrolü
  
  // Konum bilgileri (opsiyonel)
  location?: {
    latitude: number;
    longitude: number;
    accuracy: number;     // metre cinsinden
    altitude?: number;
  };
  
  // Cihaz durumu
  deviceStatus: {
    batteryLevel: number;    // 0-100 arası
    signalStrength: number;  // dBm cinsinden
    temperature: number;     // Celsius
    humidity?: number;       // %0-100
  };
  
  // Ek sensör verileri (varsa)
  sensorData?: {
    soilMoisture?: number;   // Toprak nemi %0-100
    lightLevel?: number;     // Lux cinsinden
    ph?: number;            // pH değeri
    nutrients?: {
      nitrogen: number;
      phosphorus: number;
      potassium: number;
    };
  };
}

// BLE/Wi-Fi bağlantı yapılandırması (Ahmet'in belirleyeceği)
export const BLE_CONFIG = {
  // BLE Service UUID'leri
  serviceUUID: "6E400001-B5A3-F393-E0A9-E50E24DCCA9E",           // Ana servis
  characteristicUUIDs: {
    read: "6E400003-B5A3-F393-E0A9-E50E24DCCA9E",              // Veri okuma
    write: "6E400002-B5A3-F393-E0A9-E50E24DCCA9E",             // Komut gönderme
    notify: "6E400004-B5A3-F393-E0A9-E50E24DCCA9E",            // Bildirimler
  },
  
  // Bağlantı parametreleri
  scanTimeout: 10000,        // 10 saniye tarama
  connectionTimeout: 5000,   // 5 saniye bağlantı
  dataTimeout: 3000,         // 3 saniye veri bekleme
  
  // Veri formatı
  dataEncoding: "utf8",      // Karakter kodlaması
  dataFormat: "json",        // JSON formatında veri
  encryption: "aes256",      // Şifreleme algoritması
  
  // Cihaz filtreleme
  deviceNamePrefixes: [
    "DijitalBahce",
    "TreeReader",
    "AgriSensor",
    "RFID-Reader"
  ],
  
  // Minimum sinyal gücü
  minRSSI: -80               // dBm
};

// Wi-Fi yapılandırması (alternatif bağlantı)
export const WIFI_CONFIG = {
  // Hotspot bilgileri
  ssidPrefix: "DijitalBahce_",    // "DijitalBahce_001" gibi
  password: "dijital2024",        // Varsayılan şifre
  
  // HTTP API endpoint'leri
  endpoints: {
    status: "/api/status",         // Cihaz durumu
    rfid: "/api/rfid/read",       // RFID okuma
    config: "/api/config",        // Yapılandırma
    logs: "/api/logs"             // Log kayıtları
  },
  
  // Bağlantı parametreleri
  port: 80,
  timeout: 5000,
  retryCount: 3
};

// RFID okuma komutları (Ahmet'in tanımlayacağı)
export const RFID_COMMANDS = {
  // Temel komutlar
  READ_SINGLE: "READ_RFID",           // Tek RFID oku
  READ_CONTINUOUS: "START_SCAN",      // Sürekli tarama
  STOP_SCAN: "STOP_SCAN",            // Taramayı durdur
  
  // Yapılandırma komutları
  SET_POWER: "SET_POWER",            // Okuma gücü ayarla
  SET_FREQUENCY: "SET_FREQ",         // Frekans ayarla
  CALIBRATE: "CALIBRATE",            // Kalibre et
  
  // Sistem komutları
  GET_STATUS: "STATUS",              // Durum bilgisi
  GET_VERSION: "VERSION",            // Firmware versiyonu
  RESET: "RESET",                    // Cihazı sıfırla
  
  // Güvenlik komutları
  SET_KEY: "SET_KEY",               // Şifreleme anahtarı
  VERIFY_SIG: "VERIFY_SIG"          // İmza doğrula
};

// Cihaz yanıt kodları
export const RESPONSE_CODES = {
  SUCCESS: 200,
  RFID_NOT_FOUND: 404,
  INVALID_COMMAND: 400,
  DEVICE_ERROR: 500,
  BATTERY_LOW: 503,
  SIGNAL_WEAK: 502,
  AUTHENTICATION_FAILED: 401
};

// Hata mesajları
export const ERROR_MESSAGES = {
  [RESPONSE_CODES.RFID_NOT_FOUND]: "RFID etiketi bulunamadı",
  [RESPONSE_CODES.INVALID_COMMAND]: "Geçersiz komut",
  [RESPONSE_CODES.DEVICE_ERROR]: "Cihaz hatası",
  [RESPONSE_CODES.BATTERY_LOW]: "Batarya seviyesi düşük",
  [RESPONSE_CODES.SIGNAL_WEAK]: "Sinyal gücü yetersiz",
  [RESPONSE_CODES.AUTHENTICATION_FAILED]: "Kimlik doğrulama başarısız"
};

// Veri doğrulama fonksiyonları
export function validateRFIDPacket(packet: RFIDDataPacket): boolean {
  // RFID formatı kontrolü
  if (!/^TR\d{12}$/.test(packet.rfid)) {
    return false;
  }
  
  // Timestamp kontrolü (çok eski olmamalı)
  const now = Date.now();
  const packetTime = new Date(packet.timestamp).getTime();
  const timeDiff = Math.abs(now - packetTime);
  
  if (timeDiff > 5 * 60 * 1000) { // 5 dakikadan eski
    return false;
  }
  
  // Checksum kontrolü
  const calculatedChecksum = calculateChecksum(packet);
  if (packet.checksum !== calculatedChecksum) {
    return false;
  }
  
  return true;
}

export function calculateChecksum(packet: RFIDDataPacket): string {
  const data = `${packet.rfid}${packet.timestamp}${packet.deviceId}${packet.nonce}`;
  // SHA-256 hash hesapla (browser crypto API)
  return btoa(data); // Base64 encode (gerçekte SHA-256 olacak)
}

// İmza doğrulama (Ahmet'in implementasyonu)
export function verifyRFIDSignature(packet: RFIDDataPacket, publicKey: string): boolean {
  // ECDSA imza doğrulaması
  // Ahmet'in cihazında private key ile imzalanan veriyi
  // burada public key ile doğrulayacağız
  
  const dataToVerify = `${packet.rfid}${packet.timestamp}${packet.deviceId}${packet.nonce}`;
  
  // Mock implementation - gerçekte crypto library kullanılacak
  console.log('İmza doğrulaması:', { dataToVerify, signature: packet.signature, publicKey });
  return packet.signature.length > 0; // Mock: imza varsa geçerli
}
