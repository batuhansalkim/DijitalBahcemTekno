// Ahmet'in uydu veri API'si
// Bu dosyayı Ahmet sana gönderecek

// Uydu veri formatı (Sentinel-2, Google Earth Engine vs.)
export interface SatelliteImageData {
  // Konum bilgileri
  coordinates: {
    latitude: number;
    longitude: number;
    bounds: {
      north: number;
      south: number;
      east: number;
      west: number;
    };
  };
  
  // Görüntü bilgileri
  imageInfo: {
    url: string;              // Görüntü URL'si
    thumbnailUrl?: string;    // Küçük görüntü
    resolution: number;       // Metre/piksel
    captureDate: string;      // Çekim tarihi
    satellite: string;        // "Sentinel-2A" gibi
    cloudCover: number;       // Bulut kapsamı %0-100
  };
  
  // Analiz verileri
  analysis: {
    ndvi: number;            // Normalized Difference Vegetation Index (0-1)
    evi: number;             // Enhanced Vegetation Index (0-1)
    savi: number;            // Soil Adjusted Vegetation Index (0-1)
    moisture: number;        // Toprak nemi indeksi (0-1)
    temperature: number;     // Yüzey sıcaklığı (Celsius)
  };
  
  // Metadata
  metadata: {
    dataSource: string;      // "Sentinel-2" | "Landsat-8" | "Google Earth"
    processingDate: string;  // İşlenme tarihi
    quality: "excellent" | "good" | "fair" | "poor";
    confidence: number;      // Analiz güvenilirliği %0-100
  };
}

// Uydu API yapılandırması
export const SATELLITE_API_CONFIG = {
  // API endpoint'leri (Ahmet'in belirleyeceği)
  baseUrl: "https://api.dijitalbahce.com/satellite",
  endpoints: {
    getImage: "/image",           // GET /image?lat=39.9&lng=32.8
    getAnalysis: "/analysis",     // GET /analysis?lat=39.9&lng=32.8
    getHistory: "/history",       // GET /history?lat=39.9&lng=32.8
    getBounds: "/bounds"          // POST /bounds (çokgen alan)
  },
  
  // Parametreler
  defaultParams: {
    resolution: 10,              // 10 metre/piksel
    maxCloudCover: 20,          // Maksimum %20 bulut
    dateRange: 30,              // Son 30 gün
    format: "geotiff"           // Görüntü formatı
  },
  
  // Rate limiting
  rateLimit: {
    requestsPerMinute: 60,
    requestsPerDay: 1000
  },
  
  // Authentication (varsa)
  auth: {
    apiKey: process.env.EXPO_PUBLIC_SATELLITE_API_KEY || "",
    secretKey: process.env.EXPO_PUBLIC_SATELLITE_SECRET || ""
  }
};

// Uydu veri sorgulama parametreleri
export interface SatelliteQueryParams {
  // Zorunlu parametreler
  latitude: number;
  longitude: number;
  
  // Opsiyonel parametreler
  radius?: number;             // Metre cinsinden (varsayılan: 100m)
  resolution?: number;         // Metre/piksel (varsayılan: 10m)
  maxCloudCover?: number;      // %0-100 (varsayılan: 20%)
  dateFrom?: string;           // ISO date
  dateTo?: string;             // ISO date
  satellite?: "sentinel2" | "landsat8" | "modis";
  includeAnalysis?: boolean;   // Analiz verilerini dahil et
}

// Uydu API yanıt formatı
export interface SatelliteApiResponse {
  success: boolean;
  data?: SatelliteImageData;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata: {
    requestId: string;
    timestamp: string;
    processingTime: number;    // milisaniye
    creditsUsed: number;       // API kullanım kredisi
  };
}

// Tarihsel uydu verileri
export interface SatelliteHistoryData {
  location: {
    latitude: number;
    longitude: number;
  };
  timeline: Array<{
    date: string;
    ndvi: number;
    cloudCover: number;
    temperature: number;
    imageUrl?: string;
    quality: "excellent" | "good" | "fair" | "poor";
  }>;
  summary: {
    averageNdvi: number;
    trendDirection: "improving" | "stable" | "declining";
    seasonality: {
      spring: number;
      summer: number;
      autumn: number;
      winter: number;
    };
  };
}

// Mock uydu verileri (Ahmet'in API'si hazır olmadan önce)
export const MOCK_SATELLITE_DATA: SatelliteImageData[] = [
  {
    coordinates: {
      latitude: 39.9208,
      longitude: 32.8541,
      bounds: {
        north: 39.9258,
        south: 39.9158,
        east: 32.8591,
        west: 32.8491
      }
    },
    imageInfo: {
      url: "https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?w=800",
      thumbnailUrl: "https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?w=200",
      resolution: 10,
      captureDate: new Date().toISOString(),
      satellite: "Sentinel-2A",
      cloudCover: 15
    },
    analysis: {
      ndvi: 0.75,
      evi: 0.68,
      savi: 0.72,
      moisture: 0.45,
      temperature: 23.5
    },
    metadata: {
      dataSource: "Sentinel-2",
      processingDate: new Date().toISOString(),
      quality: "excellent",
      confidence: 94
    }
  },
  {
    coordinates: {
      latitude: 36.8969,
      longitude: 30.7133,
      bounds: {
        north: 36.9019,
        south: 36.8919,
        east: 30.7183,
        west: 30.7083
      }
    },
    imageInfo: {
      url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800",
      thumbnailUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200",
      resolution: 10,
      captureDate: new Date(Date.now() - 86400000).toISOString(),
      satellite: "Sentinel-2B",
      cloudCover: 8
    },
    analysis: {
      ndvi: 0.82,
      evi: 0.79,
      savi: 0.80,
      moisture: 0.62,
      temperature: 25.2
    },
    metadata: {
      dataSource: "Sentinel-2",
      processingDate: new Date(Date.now() - 86400000).toISOString(),
      quality: "excellent",
      confidence: 97
    }
  }
];

// Uydu veri doğrulama
export function validateSatelliteData(data: SatelliteImageData): boolean {
  // Koordinat kontrolü
  if (Math.abs(data.coordinates.latitude) > 90 || Math.abs(data.coordinates.longitude) > 180) {
    return false;
  }
  
  // NDVI değeri kontrolü (0-1 arası olmalı)
  if (data.analysis.ndvi < 0 || data.analysis.ndvi > 1) {
    return false;
  }
  
  // Bulut kapsamı kontrolü
  if (data.imageInfo.cloudCover < 0 || data.imageInfo.cloudCover > 100) {
    return false;
  }
  
  return true;
}

// NDVI değerinden sağlık durumu çıkarma
export function getNdviHealthStatus(ndvi: number): {
  status: "excellent" | "good" | "fair" | "poor";
  color: string;
  description: string;
} {
  if (ndvi >= 0.8) {
    return {
      status: "excellent",
      color: "#2E7D32",
      description: "Çok sağlıklı bitki örtüsü"
    };
  } else if (ndvi >= 0.6) {
    return {
      status: "good", 
      color: "#66BB6A",
      description: "Sağlıklı bitki örtüsü"
    };
  } else if (ndvi >= 0.4) {
    return {
      status: "fair",
      color: "#FFA726",
      description: "Orta düzeyde bitki örtüsü"
    };
  } else {
    return {
      status: "poor",
      color: "#EF5350",
      description: "Zayıf bitki örtüsü"
    };
  }
}

// Koordinatlardan uydu verisi alma (Ahmet'in API'si)
export async function fetchSatelliteData(
  params: SatelliteQueryParams
): Promise<SatelliteApiResponse> {
  try {
    // Mock implementation - Ahmet'in gerçek API'si gelince değişecek
    console.log('Mock uydu verisi sorgusu:', params);
    
    // 2 saniye bekle (API çağrısını simüle et)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock veri döndür
    const mockData = MOCK_SATELLITE_DATA.find(data => 
      Math.abs(data.coordinates.latitude - params.latitude) < 0.1 &&
      Math.abs(data.coordinates.longitude - params.longitude) < 0.1
    ) || MOCK_SATELLITE_DATA[0];
    
    return {
      success: true,
      data: mockData,
      metadata: {
        requestId: `req_${Date.now()}`,
        timestamp: new Date().toISOString(),
        processingTime: 1500,
        creditsUsed: 1
      }
    };
    
  } catch (error) {
    return {
      success: false,
      error: {
        code: "API_ERROR",
        message: error instanceof Error ? error.message : "Bilinmeyen hata",
        details: error
      },
      metadata: {
        requestId: `req_${Date.now()}`,
        timestamp: new Date().toISOString(),
        processingTime: 0,
        creditsUsed: 0
      }
    };
  }
}
