// Ahmet'in donanım yapılandırması
// Bu dosyayı Ahmet sana gönderecek

// Desteklenen cihaz tipleri
export type DeviceType = "rfid_reader" | "sensor_station" | "gateway";

// Cihaz yapılandırması
export interface DeviceConfiguration {
  // Cihaz bilgileri
  deviceInfo: {
    type: DeviceType;
    model: string;            // "TreeReader Pro v2.1"
    serialNumber: string;     // "TR-001-2024-001"
    firmwareVersion: string;  // "1.2.3"
    hardwareVersion: string;  // "2.1"
    manufacturer: string;     // "DijitalBahce Tech"
  };
  
  // Ağ yapılandırması
  network: {
    // BLE yapılandırması
    ble: {
      enabled: boolean;
      deviceName: string;           // "DijitalBahce_001"
      advertisingInterval: number;  // milisaniye
      connectionInterval: number;   // milisaniye
      txPower: number;             // dBm (-40 to +4)
    };
    
    // Wi-Fi yapılandırması
    wifi: {
      enabled: boolean;
      mode: "client" | "ap" | "both";
      ssid?: string;               // Client mode için
      password?: string;           // Client mode için
      apSSID?: string;            // AP mode için
      apPassword?: string;        // AP mode için
      channel: number;            // 1-13
      encryption: "open" | "wpa2" | "wpa3";
    };
    
    // Cellular (opsiyonel)
    cellular?: {
      enabled: boolean;
      apn: string;
      username?: string;
      password?: string;
      operator: string;
    };
  };
  
  // RFID yapılandırması
  rfid: {
    frequency: number;        // MHz (865-928)
    power: number;           // dBm (0-30)
    sensitivity: number;     // -70 to -40 dBm
    protocol: "ISO18000-6C" | "ISO14443A" | "ISO15693";
    readRange: number;       // metre
    multiRead: boolean;      // Çoklu etiket okuma
    
    // Filtreler
    filters: {
      enableRSSIFilter: boolean;
      minRSSI: number;            // dBm
      enableTagFilter: boolean;
      allowedPrefixes: string[];  // ["TR", "AG"] gibi
    };
  };
  
  // Sensör yapılandırması
  sensors: {
    temperature: {
      enabled: boolean;
      unit: "celsius" | "fahrenheit";
      calibrationOffset: number;
      readInterval: number;       // saniye
    };
    
    humidity: {
      enabled: boolean;
      calibrationOffset: number;
      readInterval: number;
    };
    
    soilMoisture?: {
      enabled: boolean;
      probeCount: number;
      calibrationMin: number;
      calibrationMax: number;
      readInterval: number;
    };
    
    light?: {
      enabled: boolean;
      unit: "lux" | "ppfd";
      readInterval: number;
    };
    
    ph?: {
      enabled: boolean;
      calibrationPh4: number;
      calibrationPh7: number;
      calibrationPh10: number;
      readInterval: number;
    };
  };
  
  // Güç yönetimi
  power: {
    batteryType: "li-ion" | "li-po" | "alkaline" | "external";
    batteryCapacity: number;      // mAh
    lowBatteryThreshold: number;  // %
    sleepMode: {
      enabled: boolean;
      wakeInterval: number;       // saniye
      deepSleepEnabled: boolean;
    };
    
    // Solar panel (varsa)
    solar?: {
      enabled: boolean;
      maxPower: number;           // Watt
      batteryCharging: boolean;
    };
  };
  
  // Veri saklama
  storage: {
    maxRecords: number;           // Maksimum kayıt sayısı
    autoDelete: boolean;          // Eski kayıtları otomatik sil
    compressionEnabled: boolean;  // Veri sıkıştırma
    encryptionEnabled: boolean;   // Veri şifreleme
  };
  
  // Güvenlik
  security: {
    encryptionKey: string;        // AES-256 anahtarı
    signatureKey: string;         // ECDSA private key
    certificateChain: string[];   // X.509 sertifikaları
    
    // Kimlik doğrulama
    authentication: {
      enabled: boolean;
      method: "key" | "certificate" | "both";
      timeout: number;            // saniye
    };
  };
}

// Varsayılan cihaz yapılandırması
export const DEFAULT_DEVICE_CONFIG: DeviceConfiguration = {
  deviceInfo: {
    type: "rfid_reader",
    model: "TreeReader Pro v2.1",
    serialNumber: "TR-001-2024-001",
    firmwareVersion: "1.2.3",
    hardwareVersion: "2.1",
    manufacturer: "DijitalBahce Tech"
  },
  
  network: {
    ble: {
      enabled: true,
      deviceName: "DijitalBahce_001",
      advertisingInterval: 1000,
      connectionInterval: 100,
      txPower: 0
    },
    
    wifi: {
      enabled: true,
      mode: "both",
      apSSID: "DijitalBahce_001",
      apPassword: "dijital2024",
      channel: 6,
      encryption: "wpa2"
    }
  },
  
  rfid: {
    frequency: 868,
    power: 20,
    sensitivity: -60,
    protocol: "ISO18000-6C",
    readRange: 5,
    multiRead: true,
    
    filters: {
      enableRSSIFilter: true,
      minRSSI: -70,
      enableTagFilter: true,
      allowedPrefixes: ["TR", "AG", "DB"]
    }
  },
  
  sensors: {
    temperature: {
      enabled: true,
      unit: "celsius",
      calibrationOffset: 0,
      readInterval: 60
    },
    
    humidity: {
      enabled: true,
      calibrationOffset: 0,
      readInterval: 60
    }
  },
  
  power: {
    batteryType: "li-ion",
    batteryCapacity: 5000,
    lowBatteryThreshold: 20,
    sleepMode: {
      enabled: true,
      wakeInterval: 300,
      deepSleepEnabled: false
    }
  },
  
  storage: {
    maxRecords: 10000,
    autoDelete: true,
    compressionEnabled: true,
    encryptionEnabled: true
  },
  
  security: {
    encryptionKey: "your-256-bit-encryption-key-here",
    signatureKey: "your-ecdsa-private-key-here",
    certificateChain: [],
    
    authentication: {
      enabled: true,
      method: "key",
      timeout: 30
    }
  }
};

// Cihaz durumu
export interface DeviceStatus {
  // Sistem durumu
  system: {
    uptime: number;              // saniye
    cpuUsage: number;           // %0-100
    memoryUsage: number;        // %0-100
    storageUsage: number;       // %0-100
    temperature: number;        // Celsius
  };
  
  // Ağ durumu
  network: {
    ble: {
      connected: boolean;
      connectedDevices: number;
      lastConnection: string;    // ISO timestamp
    };
    
    wifi: {
      connected: boolean;
      ssid?: string;
      signalStrength: number;    // dBm
      ipAddress?: string;
    };
    
    cellular?: {
      connected: boolean;
      operator: string;
      signalStrength: number;    // dBm
      dataUsage: number;         // MB
    };
  };
  
  // Güç durumu
  power: {
    batteryLevel: number;        // %0-100
    batteryVoltage: number;      // Volt
    charging: boolean;
    estimatedRuntime: number;    // saat
    
    solar?: {
      generating: boolean;
      power: number;             // Watt
      efficiency: number;        // %
    };
  };
  
  // RFID durumu
  rfid: {
    operational: boolean;
    lastRead: string;            // ISO timestamp
    readCount: number;           // Toplam okuma sayısı
    errorCount: number;          // Hata sayısı
    averageReadTime: number;     // milisaniye
  };
  
  // Sensör durumları
  sensors: {
    temperature: {
      operational: boolean;
      lastReading: number;
      lastUpdate: string;
    };
    
    humidity: {
      operational: boolean;
      lastReading: number;
      lastUpdate: string;
    };
    
    soilMoisture?: {
      operational: boolean;
      readings: number[];        // Her prob için ayrı okuma
      lastUpdate: string;
    };
  };
  
  // Hata ve uyarılar
  alerts: Array<{
    level: "info" | "warning" | "error" | "critical";
    message: string;
    timestamp: string;
    code?: string;
  }>;
}

// Cihaz komutları
export const DEVICE_COMMANDS = {
  // Sistem komutları
  RESTART: "SYS_RESTART",
  SHUTDOWN: "SYS_SHUTDOWN",
  FACTORY_RESET: "SYS_FACTORY_RESET",
  UPDATE_FIRMWARE: "SYS_UPDATE_FW",
  
  // Yapılandırma komutları
  GET_CONFIG: "CFG_GET",
  SET_CONFIG: "CFG_SET",
  SAVE_CONFIG: "CFG_SAVE",
  LOAD_CONFIG: "CFG_LOAD",
  
  // RFID komutları
  RFID_READ: "RFID_READ",
  RFID_SCAN_START: "RFID_SCAN_START",
  RFID_SCAN_STOP: "RFID_SCAN_STOP",
  RFID_CALIBRATE: "RFID_CALIBRATE",
  
  // Sensör komutları
  SENSOR_READ_ALL: "SENSOR_READ_ALL",
  SENSOR_CALIBRATE: "SENSOR_CALIBRATE",
  
  // Ağ komutları
  WIFI_SCAN: "WIFI_SCAN",
  WIFI_CONNECT: "WIFI_CONNECT",
  WIFI_DISCONNECT: "WIFI_DISCONNECT",
  
  // Veri komutları
  DATA_EXPORT: "DATA_EXPORT",
  DATA_CLEAR: "DATA_CLEAR",
  DATA_SYNC: "DATA_SYNC"
};
