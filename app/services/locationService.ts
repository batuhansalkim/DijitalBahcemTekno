import * as Location from 'expo-location';
import { Alert } from 'react-native';

export interface GpsFix {
  lat: number;
  lon: number;
  alt?: number | null;
  accuracy_m?: number | null;
  timestamp: string; // ISO-8601 UTC
}

export interface LocationPermissionStatus {
  granted: boolean;
  canAskAgain: boolean;
  status: 'granted' | 'denied' | 'undetermined';
}

/**
 * Konum izinlerini kontrol et ve iste
 */
export async function checkLocationPermissions(): Promise<LocationPermissionStatus> {
  try {
    const { status, canAskAgain } = await Location.getForegroundPermissionsAsync();
    
    return {
      granted: status === 'granted',
      canAskAgain,
      status
    };
  } catch (error) {
    console.error('Konum izni kontrolü hatası:', error);
    return {
      granted: false,
      canAskAgain: false,
      status: 'undetermined'
    };
  }
}

/**
 * Konum izni iste
 */
export async function requestLocationPermission(): Promise<boolean> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Konum izni isteme hatası:', error);
    return false;
  }
}

/**
 * Yüksek doğrulukta GPS konumu al
 */
export async function getGpsFix(): Promise<GpsFix> {
  try {
    // Önce izin kontrolü
    const permissionStatus = await checkLocationPermissions();
    
    if (!permissionStatus.granted) {
      if (permissionStatus.canAskAgain) {
        const granted = await requestLocationPermission();
        if (!granted) {
          throw new Error('Konum izni verilmedi. Lütfen ayarlardan konum iznini açın.');
        }
      } else {
        throw new Error('Konum izni reddedildi. Lütfen ayarlardan konum iznini açın.');
      }
    }

    // Yüksek doğruluk ve taze konum al
    const pos = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
      mayShowUserSettingsDialog: true,
      timeInterval: 5000, // 5 saniye timeout
    });

    const lat = Number(pos.coords.latitude.toFixed(6));
    const lon = Number(pos.coords.longitude.toFixed(6));

    // Koordinat aralığı doğrulaması
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      throw new Error('Geçersiz koordinat aralığı.');
    }

    return {
      lat,
      lon,
      alt: pos.coords.altitude ?? null,
      accuracy_m: pos.coords.accuracy ?? null,
      timestamp: new Date(pos.timestamp).toISOString(),
    };
  } catch (error: any) {
    console.error('GPS konumu alma hatası:', error);
    throw new Error(error.message || 'Konum alınamadı. Lütfen tekrar deneyin.');
  }
}

/**
 * Konum doğruluğunu kontrol et
 */
export function validateLocationAccuracy(accuracy: number | null | undefined, threshold: number = 10): boolean {
  if (accuracy === null || accuracy === undefined) return true; // Doğruluk bilgisi yoksa kabul et
  return accuracy <= threshold;
}

/**
 * Konum doğruluk mesajı oluştur
 */
export function getAccuracyMessage(accuracy: number | null | undefined): string {
  if (accuracy === null || accuracy === undefined) return 'Doğruluk bilgisi mevcut değil';
  
  if (accuracy <= 5) return `Mükemmel doğruluk (${accuracy.toFixed(1)}m)`;
  if (accuracy <= 10) return `İyi doğruluk (${accuracy.toFixed(1)}m)`;
  if (accuracy <= 20) return `Orta doğruluk (${accuracy.toFixed(1)}m)`;
  return `Zayıf doğruluk (${accuracy.toFixed(1)}m) - Tekrar denemeniz önerilir`;
}

/**
 * NFC + Konum entegrasyonu için ana fonksiyon
 */
export async function captureTreeLocation(): Promise<GpsFix> {
  try {
    const fix = await getGpsFix();
    
    // Doğruluk kontrolü (isteğe bağlı)
    if (!validateLocationAccuracy(fix.accuracy_m, 20)) {
      Alert.alert(
        'Konum Doğruluğu',
        `${getAccuracyMessage(fix.accuracy_m)}\n\nTekrar denemek ister misiniz?`,
        [
          { text: 'Kabul Et', style: 'default' },
          { text: 'Tekrar Dene', style: 'default', onPress: () => captureTreeLocation() }
        ]
      );
    }
    
    return fix;
  } catch (error: any) {
    console.error('Ağaç konumu alma hatası:', error);
    throw error;
  }
}

/**
 * Konum ayarlarını aç
 */
export async function openLocationSettings(): Promise<void> {
  try {
    await Location.enableNetworkProviderAsync();
  } catch (error) {
    console.error('Konum ayarları açma hatası:', error);
  }
}
